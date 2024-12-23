from flask_login import login_required, current_user
from flask_pydantic import validate

from .dto import LeaderboardUserDto
from ..auth.deps import admin_required
from ..statistics import bp, StatisticsService
from chatgame.db.dto import TotalStatisticsDto


@bp.get("/me")
@login_required
@validate()
def get_current_user_statistics():
    statistics = StatisticsService.get_user_total_statistics(str(current_user.id))

    return TotalStatisticsDto.model_validate(statistics)

@bp.get("/<user_id>")
@admin_required
@validate()
def get_user_statistics(user_id: str):
    statistics = StatisticsService.get_user_total_statistics(user_id)

    return TotalStatisticsDto.model_validate(statistics)

@bp.get("/leaderboard")
@validate(response_many=True)
def get_leaderboard():
    leaderboard = StatisticsService.get_leaderboard()
    return [LeaderboardUserDto.model_validate(i) for i in leaderboard]

@bp.get("/leaderboard/friends")
@login_required
@validate(response_many=True)
def get_friends_leaderboard():
    leaderboard = StatisticsService.get_friends_leaderboard(current_user)
    return [LeaderboardUserDto.model_validate(i) for i in leaderboard]