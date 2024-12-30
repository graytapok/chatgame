from flask_login import login_required, current_user
from flask_pydantic import validate

from chatgame.blueprints.friends import bp, FriendsService
from chatgame.db.dto import UserDto, FriendRequestDto

from .dto import *


@bp.get("/me")
@login_required
@validate(response_many=True)
def get_current_user_friends():
    return [UserDto.model_validate(i) for i in current_user.friends]

@bp.get("/requests/me")
@login_required
@validate(response_many=True)
def get_current_user_friend_requests():
    friend_requests = FriendsService.get_friend_requests(current_user)
    return [FriendRequestDto.model_validate(i) for i in friend_requests]

@bp.post("/requests/<username>")
@login_required
@validate()
def send_friend_request(username: str):
    friend_request = FriendsService.send_friend_request(current_user, username)
    return FriendRequestDto.model_validate(friend_request), 201

@bp.patch("/requests/<int:request_id>")
@login_required
@validate()
def answer_friend_request(request_id: int, query: AnswerFriendRequestBody):
    friend_request = FriendsService.answer_friend_request(current_user, request_id, answer=query.answer)
    return FriendRequestDto.model_validate(friend_request), 200