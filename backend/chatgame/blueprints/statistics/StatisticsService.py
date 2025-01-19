from uuid import UUID
from typing import Literal
from random import randint

from flask_sqlalchemy.pagination import Pagination
from sqlalchemy import or_

from chatgame.blueprints.users import UsersService
from chatgame.db.models.UserModel import friend_table
from chatgame.exceptions import AlreadyExistsException, NotFoundException
from chatgame.db.models import TotalStatisticsModel, SubStatisticsModel, UserModel
from chatgame.constants import Game
from chatgame.extensions import db

class StatisticsService:
    @staticmethod
    def get_total_statistics_or_throw(total_statistics_id: int) -> TotalStatisticsModel:
        total_statistics = db.session.query(TotalStatisticsModel).where(TotalStatisticsModel.id == total_statistics_id).first()

        if total_statistics is None:
            raise NotFoundException("TotalStatistics", str(total_statistics_id))

        return total_statistics

    @staticmethod
    def get_sub_statistics_or_throw(sub_statistics_id: int) -> SubStatisticsModel:
        sub_statistics = db.session.get(SubStatisticsModel, sub_statistics_id)

        if sub_statistics is None:
            raise NotFoundException("SubStatistics", str(sub_statistics_id))

        return sub_statistics

    @staticmethod
    def create_total_statistics(user_id: str) -> TotalStatisticsModel:
        user = UsersService.get_user_or_throw(user_id)

        if db.session.query(TotalStatisticsModel).where(TotalStatisticsModel.user_id == user.id).first():
            raise AlreadyExistsException("TotalStatistics", str(user.id))

        total_statistics = TotalStatisticsModel(user.id)

        db.session.add(total_statistics)
        db.session.commit()

        return total_statistics

    @staticmethod
    def create_sub_statistics(game_name: Game, total_statistics_id: int):
        total_statistics = StatisticsService.get_total_statistics_or_throw(total_statistics_id)

        sub_statistics_with_matched_name = (
            db.session.query(SubStatisticsModel)
            .where(
                SubStatisticsModel.total_statistics_id == total_statistics_id,
                SubStatisticsModel.game_name == game_name
            )
            .first()
        )

        if sub_statistics_with_matched_name:
            raise AlreadyExistsException("SubStatistics", game_name.value)

        sub_statistics = SubStatisticsModel(game_name=game_name, total_statistics_id=total_statistics.id)

        db.session.add(sub_statistics)
        db.session.commit()

        return sub_statistics

    @staticmethod
    def get_user_total_statistics(user_id: str | UUID) -> TotalStatisticsModel:
        user = UsersService.get_user_or_throw(user_id)

        total_statistics = db.session.query(TotalStatisticsModel).where(TotalStatisticsModel.user_id == user.id).first()

        if total_statistics is None:
            total_statistics = StatisticsService.create_total_statistics(user_id)

        return total_statistics

    @staticmethod
    def get_user_sub_statistics(user_id: str | UUID, sub_statistics_name: Game):
        total_statistics = StatisticsService.get_user_total_statistics(user_id)

        for sub_statistics in total_statistics.sub_statistics:
            if sub_statistics.game_name == sub_statistics_name:
                return sub_statistics

        return StatisticsService.create_sub_statistics(sub_statistics_name, total_statistics.id)

    @staticmethod
    def get_leaderboard_top_3() -> list[UserModel]:
        return (
            db.session
            .query(UserModel)
            .join(TotalStatisticsModel, TotalStatisticsModel.user_id == UserModel.id)
            .filter(TotalStatisticsModel.total_games >= 10)
            .order_by(TotalStatisticsModel.total_elo.desc(), TotalStatisticsModel.total_wins.desc())
            .limit(3)
            .all()
        )

    @staticmethod
    def get_friends_leaderboard_top_3(user: UserModel) -> list[UserModel]:
        return (
            db.session
            .query(UserModel)
            .join(friend_table, friend_table.c.friend_id == UserModel.id)
            .where(or_(friend_table.c.user_id == user.id, UserModel.id == user.id))
            .join(TotalStatisticsModel, TotalStatisticsModel.user_id == UserModel.id)
            .order_by(TotalStatisticsModel.total_elo.desc(), TotalStatisticsModel.total_wins.desc())
            .limit(3)
            .all()
        )

    @staticmethod
    def get_leaderboard(page: int, per_page: int) -> Pagination:
        best_stats: Pagination = (
            db.session
            .query(UserModel)
            .join(TotalStatisticsModel, TotalStatisticsModel.user_id == UserModel.id)
            .filter(TotalStatisticsModel.total_games >= 10)
            .order_by(TotalStatisticsModel.total_elo.desc(), TotalStatisticsModel.total_wins.desc())
            .paginate(page=page, per_page=per_page, error_out=False)
        )

        return best_stats

    @staticmethod
    def get_friends_leaderboard(user: UserModel, page: int, per_page: int) -> Pagination:
        best_stats: Pagination = (
            db.session
            .query(UserModel)
            .join(friend_table, friend_table.c.friend_id == UserModel.id)
            .where(or_(friend_table.c.user_id == user.id, UserModel.id == user.id))
            .join(TotalStatisticsModel, TotalStatisticsModel.user_id == UserModel.id)
            .order_by(TotalStatisticsModel.total_elo.desc(), TotalStatisticsModel.total_wins.desc())
            .paginate(page=page, per_page=per_page, error_out=False)
        )

        return best_stats

    @staticmethod
    def generate_elo():
        percent = randint(1, 100)

        if 1 <= percent <= 70:
            return randint(10, 15)  # 70% 10-15
        elif 71 < percent <= 90:
            return randint(16, 20)  # 20% 16-20
        else:
            return randint(21, 25)  # 10% 21-25

    @staticmethod
    def register_played_game(user_id: UUID, game: Game, outcome: Literal["win", "loss", "draw"]) -> int | None:
        sub_statistics = StatisticsService.get_user_sub_statistics(user_id, game)

        sub_statistics.games += 1

        elo = StatisticsService.generate_elo()

        if outcome == "win":
            sub_statistics.wins += 1
            sub_statistics.elo += elo

            db.session.commit()
            return elo

        if outcome == "loss":
            sub_statistics.losses += 1
            sub_statistics.elo = sub_statistics.elo - elo if sub_statistics.elo > elo else 0

            db.session.commit()
            return -elo

        sub_statistics.draws += 1
        db.session.commit()
        return 0