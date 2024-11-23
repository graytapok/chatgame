from chatgame.blueprints.users.utils import get_user_or_throw
from chatgame.exceptions import AlreadyExistsException, NotFoundException
from chatgame.models import TotalStatisticsModel, SubStatisticsModel
from chatgame.constants import Game
from chatgame.extensions import db

def get_total_statistics_to_throw(total_statistics_id: int) -> TotalStatisticsModel:
    total_statistics = db.session.get(TotalStatisticsModel, total_statistics_id)

    if total_statistics is None:
        raise NotFoundException("TotalStatistics", str(total_statistics_id))

    return total_statistics

def get_sub_statistics_to_throw(sub_statistics_id: int) -> SubStatisticsModel:
    sub_statistics = db.session.get(SubStatisticsModel, sub_statistics_id)

    if sub_statistics is None:
        raise NotFoundException("SubStatistics", str(sub_statistics_id))

    return sub_statistics

def create_total_statistics(user_id: str) -> TotalStatisticsModel:
    user = get_user_or_throw(user_id)

    if db.session.query(TotalStatisticsModel).where(TotalStatisticsModel.user_id == user.id):
        raise AlreadyExistsException("TotalStatistics", str(user.id))

    total_statistics = TotalStatisticsModel(user.id)

    db.session.add(total_statistics)
    db.session.commit()

    return total_statistics

def create_sub_statistics(game_name: Game, total_statistics_id: int):
    total_statistics = get_total_statistics_to_throw(total_statistics_id)

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

def get_user_total_statistics(user_id: str) -> TotalStatisticsModel:
    user = get_user_or_throw(user_id)

    total_statistics = db.session.query(TotalStatisticsModel).where(TotalStatisticsModel.user_id == user.id).first()

    if total_statistics is None:
        total_statistics = create_total_statistics(user_id)

    return total_statistics

def get_user_sub_statistics(total_statistics_id: int, sub_statistics_name: Game):
    total_statistics = get_total_statistics_to_throw(total_statistics_id)

    for sub_statistics in total_statistics.sub_statistics:
        if sub_statistics.name == sub_statistics_name:
            return sub_statistics

    return create_sub_statistics(sub_statistics_name, total_statistics)



