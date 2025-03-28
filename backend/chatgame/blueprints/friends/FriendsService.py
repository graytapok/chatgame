from datetime import datetime
from typing import Literal
from uuid import UUID

from sqlalchemy.orm import joinedload

from chatgame.constants import FriendRequestStatus
from chatgame.db.models import UserModel, FriendRequestModel, FriendModel
from chatgame.exceptions import BadRequestException, NotFoundException, AlreadyExistsException
from chatgame.extensions import db
from chatgame.blueprints.users import UsersService


class FriendsService:
    @staticmethod
    def get_friend_or_throw(user: UserModel, friend_id: UUID | str):
        friend = UsersService.get_user_or_throw(friend_id)

        if friend not in user.friends:
            raise BadRequestException(f"You are not friends with {friend.username}.")

        return friend

    @staticmethod
    def get_friends(user: UserModel) -> list[UserModel]:
        return (
            db.session
            .query(UserModel)
            .join(FriendModel, FriendModel.friend_id == UserModel.id)
            .where(FriendModel.user_id == user.id)
            .order_by(UserModel.last_seen.desc())
            .all()
        )

    @staticmethod
    def get_friend_request_or_throw(friend_request_id: int) -> FriendRequestModel:
        friend_request = (
            FriendRequestModel.query
            .options(
                joinedload(FriendRequestModel.sender),
                joinedload(FriendRequestModel.receiver)
            )
            .where(FriendRequestModel.id == friend_request_id)
            .first()
        )

        if friend_request is None:
            raise NotFoundException("FriendRequest", friend_request_id)

        return friend_request

    @staticmethod
    def add_fiend(user: UserModel, new_friend_id: UUID):
        if new_friend_id == user.id:
            raise BadRequestException("The friend must be some else, not you.")

        receiver = UsersService.get_user_or_throw(new_friend_id)

        user.friends.append(receiver)
        receiver.friends.append(user)

        db.session.commit()

    @staticmethod
    def send_friend_request(user: UserModel, receiver_username: str) -> FriendRequestModel:
        if receiver_username == user.username:
            raise BadRequestException("You can not be friends with yourself.")

        receiver = UsersService.get_user_by_username_or_throw(receiver_username)

        if receiver in user.friends:
            raise BadRequestException(f"You are already friends with {receiver_username}.")

        if fr := db.session.query(FriendRequestModel).filter_by(sender_id=user.id, receiver_id=receiver.id).first():
            raise AlreadyExistsException("FriendRequest", fr.id)

        friend_request = FriendRequestModel(user.id, receiver.id)

        db.session.add(friend_request)
        db.session.commit()

        return friend_request

    @staticmethod
    def cancel_friend_request(user: UserModel, friend_request_id: int):
        friend_request = FriendsService.get_friend_request_or_throw(friend_request_id)

        if friend_request.sender_id != user.id:
            raise BadRequestException("You are not the sender of the friend request!")

        db.session.delete(friend_request)
        db.session.commit()

        return friend_request

    @staticmethod
    def remove_friend(user: UserModel, friend_id: UUID | str) -> UserModel:
        friend = FriendsService.get_friend_or_throw(user, friend_id)

        user_friend = FriendModel.query.where(FriendModel.user_id == user.id, FriendModel.friend_id == friend.id).first()
        friend_user = FriendModel.query.where(FriendModel.user_id == friend.id, FriendModel.friend_id == user.id).first()

        db.session.delete(user_friend)
        db.session.delete(friend_user)
        db.session.commit()

        return friend

    @staticmethod
    def answer_friend_request(user: UserModel, friend_request_id: int, answer: Literal["accept", "reject"]) -> FriendRequestModel:
        friend_request = FriendsService.get_friend_request_or_throw(friend_request_id)

        if friend_request.receiver_id != user.id:
            raise BadRequestException("You are not the receiver.")

        if datetime.now() > friend_request.expires_at:
            raise BadRequestException("Friend request expired.")

        if friend_request.status != FriendRequestStatus.PENDING:
            raise BadRequestException("Friend request already answered.")

        friend_request.status = FriendRequestStatus.ACCEPTED if answer == "accept" else FriendRequestStatus.REJECTED

        if answer == "accept":
            FriendsService.add_fiend(user, friend_request.sender_id)

        db.session.delete(friend_request)
        db.session.commit()

        return friend_request

    @staticmethod
    def get_friend_requests(user: UserModel) -> list[FriendRequestModel]:
        return (
            FriendRequestModel
            .query
            .where(
                FriendRequestModel.receiver_id == user.id,
                FriendRequestModel.status == FriendRequestStatus.PENDING,
                datetime.now() < FriendRequestModel.expires_at
            )
            .order_by(
                FriendRequestModel.send_at.desc()
            )
            .all()
        )

    @staticmethod
    def get_sent_friend_requests(user: UserModel) -> list[FriendRequestModel]:
        return (
            FriendRequestModel
            .query
            .where(
                FriendRequestModel.sender_id == user.id,
                FriendRequestModel.status == FriendRequestStatus.PENDING,
                datetime.now() < FriendRequestModel.expires_at
            )
            .order_by(
                FriendRequestModel.send_at.desc()
            )
            .all()
        )