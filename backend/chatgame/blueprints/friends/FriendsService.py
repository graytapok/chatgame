from datetime import datetime
from os import access
from typing import Literal
from uuid import UUID

from chatgame.blueprints.users import UsersService
from chatgame.constants import FriendRequestStatus
from chatgame.db.models import UserModel, FriendRequestModel
from chatgame.exceptions import BadRequestException, NotFoundException
from chatgame.extensions import db


class FriendsService:
    @staticmethod
    def get_friend_request_or_throw(friend_request_id: int) -> FriendRequestModel:
        friend_request = FriendRequestModel.query.get(friend_request_id)

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
            raise BadRequestException("The friend must be some else, not you.")

        receiver = UsersService.get_user_by_username_or_throw(receiver_username)

        friend_request = FriendRequestModel(user.id, receiver.id)

        db.session.add(friend_request)
        db.session.commit()

        return friend_request

    @staticmethod
    def answer_friend_request(user: UserModel, friend_request_id: int, answer: Literal["accept", "reject"]) -> FriendRequestModel:
        friend_request = FriendsService.get_friend_request_or_throw(friend_request_id)

        if friend_request.receiver_id != user.id:
            raise BadRequestException("You are not the receiver.")

        if datetime.now() > friend_request.expires_at:
            raise BadRequestException("FriendRequest expired.")

        if friend_request.status != FriendRequestStatus.IDLE:
            raise BadRequestException("FriendRequest already answered.")

        friend_request.status = FriendRequestStatus.ACCEPTED if answer == "accept" else FriendRequestStatus.REJECTED

        if answer == "accept":
            FriendsService.add_fiend(user, friend_request.sender_id)

        db.session.delete(friend_request)
        db.session.commit()

        return friend_request

    @staticmethod
    def get_friend_requests(user: UserModel) -> list[FriendRequestModel]:
        return FriendRequestModel.query.where(
            FriendRequestModel.receiver_id == user.id,
            FriendRequestModel.status == FriendRequestStatus.IDLE,
            datetime.now() < FriendRequestModel.expires_at
        )
