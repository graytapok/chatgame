from uuid import UUID
from typing import Literal
from random import randint

from flask_sqlalchemy.pagination import Pagination
from sqlalchemy import or_

from chatgame.blueprints.statistics.dto import LeaderboardQuery
from chatgame.blueprints.users import UsersService
from chatgame.db.models import FriendModel
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
    def get_leaderboard(page: int, per_page: int) -> Pagination:
        leaderboard: Pagination = (
            db.session
            .query(UserModel)
            .join(TotalStatisticsModel, TotalStatisticsModel.user_id == UserModel.id)
            .filter(TotalStatisticsModel.total_games >= 10)
            .order_by(TotalStatisticsModel.total_elo.desc(), TotalStatisticsModel.total_wins.desc())
            .paginate(page=page, per_page=per_page, error_out=False)
        )

        if 0 < page <= leaderboard.pages:
            counter = page * per_page - per_page

            users = []

            for i in leaderboard.items:
                counter += 1
                i.rank = counter
                users.append(i)

            leaderboard.items = users

            return leaderboard

        if page > leaderboard.pages:
            return StatisticsService.get_leaderboard(leaderboard.pages, per_page)

        return StatisticsService.get_leaderboard(1, per_page)

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
    def get_friends_leaderboard(user: UserModel, page: int, per_page: int) -> Pagination:
        leaderboard: Pagination = (
            db.session
            .query(UserModel)
            .join(FriendModel, or_(FriendModel.friend_id == UserModel.id, UserModel.id == user.id))
            .where(or_(FriendModel.user_id == user.id, UserModel.id == user.id))
            .join(TotalStatisticsModel, TotalStatisticsModel.user_id == UserModel.id)
            .order_by(TotalStatisticsModel.total_elo.desc(), TotalStatisticsModel.total_wins.desc())
            .paginate(page=page, per_page=per_page, error_out=False)
        )

        if 0 < page <= leaderboard.pages:
            counter = page * per_page - per_page

            users = []

            for i in leaderboard.items:
                counter += 1
                i.rank = counter
                users.append(i)

            leaderboard.items = users

            return leaderboard

        elif leaderboard.pages == 0:
            return leaderboard

        if page > leaderboard.pages:
            return StatisticsService.get_friends_leaderboard(user, leaderboard.pages, per_page)

        return StatisticsService.get_friends_leaderboard(user, 1, per_page)

    @staticmethod
    def get_friends_leaderboard_top_3(user: UserModel) -> list[UserModel]:
        users = (
            UserModel
            .query
            .join(FriendModel, or_(FriendModel.friend_id == UserModel.id, UserModel.id == user.id))
            .where(or_(FriendModel.user_id == user.id, UserModel.id == user.id))
            .join(TotalStatisticsModel, TotalStatisticsModel.user_id == UserModel.id)
            .order_by(TotalStatisticsModel.total_elo.desc(), TotalStatisticsModel.total_wins.desc())
            .all()
        )[:3]

        if not users and not user.statistics:
            StatisticsService.create_total_statistics(str(user.id))
            return [user]

        return users

    @staticmethod
    def calculate_elo(w_elo: int, l_elo: int):
        elo_diff = w_elo - l_elo
        elo_bonus = abs(elo_diff) // 22

        w_diff = randint(14, 18)
        l_diff = -randint(14, 18)

        if elo_diff > 0:
            w_diff -= elo_bonus
            l_diff += elo_bonus
        elif elo_diff < 0:
            w_diff += elo_bonus
            l_diff -= elo_bonus

        return w_diff, l_diff

    @staticmethod
    def register_played_game(user_id: UUID, opponent_id: UUID, game: Game, outcome: Literal["win", "loss", "draw"]):
        player = StatisticsService.get_user_sub_statistics(user_id, game)
        opponent = StatisticsService.get_user_sub_statistics(opponent_id, game)

        player.games += 1
        opponent.games += 1

        if outcome == "win":
            player.wins += 1
            opponent.losses += 1

            player_diff, opponent_diff = StatisticsService.calculate_elo(player.elo, opponent.elo)

            player.elo += player_diff
            opponent.elo = opponent.elo - opponent_diff if opponent.elo > opponent_diff else 0

            db.session.commit()

            return {"player_elo": player_diff, "opponent_elo": opponent_diff}

        if outcome == "loss":
            opponent.wins += 1
            player.losses += 1

            opponent_diff, player_diff = StatisticsService.calculate_elo(opponent.elo, player.elo)

            opponent.elo += opponent_diff
            player.elo = player.elo - player_diff if player.elo > player_diff else 0

            db.session.commit()

            return {"player_elo": player_diff, "opponent_elo": opponent_diff}

        player.draws += 1
        opponent.draws += 1
        db.session.commit()

        return {"player_elo": 0, "opponent_elo": 0}