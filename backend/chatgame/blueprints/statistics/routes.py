from flask_login import login_required, current_user
from flask_pydantic import validate

from .dto import LeaderboardUserDto, LeaderboardQuery, LeaderboardDto
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
@validate()
def get_leaderboard(query: LeaderboardQuery):
    counter = query.p * query.per - query.per
    leaderboard = StatisticsService.get_leaderboard(query.p, query.per)

    if query.p > leaderboard.pages:
        counter = leaderboard.pages * query.per - query.per
        leaderboard = StatisticsService.get_leaderboard(leaderboard.pages, query.per)

    if query.p < 1:
        counter = 1 * query.per - query.per
        leaderboard = StatisticsService.get_leaderboard(1, query.per)

    top3 = StatisticsService.get_leaderboard_top_3()

    users = []

    for i in leaderboard.items:
        counter += 1
        i.rank = counter
        users.append(LeaderboardUserDto.model_validate(i))

    return LeaderboardDto(
        total=leaderboard.total,
        pages=leaderboard.pages,
        current_page=leaderboard.page,
        next_page=leaderboard.next_num,
        prev_page=leaderboard.prev_num,
        users=users,
        top3=[LeaderboardUserDto.model_validate(i) for i in top3]
    )

@bp.get("/leaderboard/friends")
@login_required
@validate()
def get_friends_leaderboard(query: LeaderboardQuery):
    counter = query.p * query.per - query.per
    leaderboard = StatisticsService.get_friends_leaderboard(current_user, query.p, query.per)

    if query.p > leaderboard.pages:
        counter = leaderboard.pages * query.per - query.per
        leaderboard = StatisticsService.get_friends_leaderboard(current_user, leaderboard.pages, query.per)

    if query.p < 1:
        counter = 1 * query.per - query.per
        leaderboard = StatisticsService.get_friends_leaderboard(current_user, 1, query.per)

    top3 = StatisticsService.get_friends_leaderboard_top_3(current_user)

    users = []

    for i in leaderboard.items:
        counter += 1
        i.rank = counter
        users.append(LeaderboardUserDto.model_validate(i))

    return LeaderboardDto(
        total=leaderboard.total,
        pages=leaderboard.pages,
        current_page=leaderboard.page,
        next_page=leaderboard.next_num,
        prev_page=leaderboard.prev_num,
        users=users,
        top3=[LeaderboardUserDto.model_validate(i) for i in top3]
    )