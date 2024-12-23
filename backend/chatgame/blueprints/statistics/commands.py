import click

from ..statistics import StatisticsService, bp

from chatgame.constants import Game

@bp.cli.command("create-total-statistics")
@click.argument("user_id")
def create_total_statistics_command(user_id):
    StatisticsService.create_total_statistics(user_id)

    print(f"TotalStatistics for User <{user_id}> created")

@bp.cli.command("create-sub-statistics")
@click.argument("game_name")
@click.argument("total_statistics_id")
def create_total_statistics_command(game_name: str, total_statistics_id: int):
    StatisticsService.create_sub_statistics(Game(game_name), total_statistics_id)

    print(f"SubStatistics for <TotalStatistics {total_statistics_id}> created")

