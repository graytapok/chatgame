from flask_login import login_required, current_user
from flask_pydantic import validate

from chatgame.blueprints.friends import bp, FriendsService
from chatgame.db.dto import FriendRequestDto
from chatgame.extensions import socketio

from .dto import *


@bp.get("/me")
@login_required
@validate(response_many=True)
def get_current_user_friends():
    friends = FriendsService.get_friends(current_user)
    return [FriendUserDto.model_validate(i) for i in friends]

@bp.delete("/<friend_id>")
@login_required
@validate()
def remove_friend(friend_id: str):
    friend = FriendsService.remove_friend(current_user, friend_id)

    socketio.emit("refetch", {"request": "friends"}, namespace="/friends", to=str(friend.id))

    return UserDto.model_validate(friend), 200

@bp.get("/requests/to/me")
@login_required
@validate(response_many=True)
def get_current_user_friend_requests_to():
    friend_requests = FriendsService.get_friend_requests(current_user)
    return [FriendRequestDto.model_validate(i) for i in friend_requests]

@bp.get("/requests/from/me")
@login_required
@validate(response_many=True)
def get_current_user_friend_requests_from():
    friend_requests = FriendsService.get_sent_friend_requests(current_user)

    return [FriendRequestDto.model_validate(i) for i in friend_requests]

@bp.post("/requests/<username>")
@login_required
@validate()
def send_friend_request(username: str):
    friend_request = FriendsService.send_friend_request(current_user, username)

    socketio.emit(
        "received_request",
        {"username": friend_request.sender.username},
        namespace="/friends",
        to=str(friend_request.receiver_id)
    )

    return FriendRequestDto.model_validate(friend_request), 201

@bp.patch("/requests/<int:request_id>")
@login_required
@validate()
def answer_friend_request(request_id: int, query: AnswerFriendRequestBody):
    friend_request = FriendsService.answer_friend_request(current_user, request_id, answer=query.answer)

    socketio.emit(
        "answered_request",
        {
            "username": current_user.username,
            "answer": "accepted" if query.answer == "accept" else "rejected"
        },
        namespace="/friends",
        to=str(friend_request.sender_id)
    )

    return FriendRequestDto.model_validate(friend_request), 200

@bp.delete("/requests/<int:request_id>")
@login_required
def cancel_friend_request(request_id: int):
    friend_request = FriendsService.cancel_friend_request(current_user, request_id)

    socketio.emit(
        "refetch",
        {
            "request": "requests_to",
        },
        namespace="/friends",
        to=str(friend_request.receiver_id)
    )

    return {}, 200