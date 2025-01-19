from random import randint
from typing import Literal

import click
from flask import current_app

from ..statistics import StatisticsService, bp

from chatgame.constants import Game
from ..users import UsersService


@bp.cli.command("create-total-statistics")
@click.argument("user_id")
def create_total_statistics_command(user_id):
    StatisticsService.create_total_statistics(user_id)

    current_app.logger.info(f"TotalStatistics for User <{user_id}> created")

@bp.cli.command("create-sub-statistics")
@click.argument("game_name")
@click.argument("total_statistics_id")
def create_total_statistics_command(game_name: str, total_statistics_id: int):
    StatisticsService.create_sub_statistics(Game(game_name), total_statistics_id)

    current_app.logger.info(f"SubStatistics for <TotalStatistics {total_statistics_id}> created")

@bp.cli.command("create-many-users")
@click.argument("amount")
def create_many_users(amount: int):
    for i in range(1, int(amount) + 1):
        user = UsersService.create_user(f"User{i}", f"user{i}@gmail.com", "password", email_confirmed=True)

        for j in range(0, randint(20, 100)):
            game = Game.TICTACTOE if randint(0, 1) else Game.TICTACTOE_PLUS

            percent = randint(1, 100)

            outcome: Literal["win", "draw", "loss"]

            if 1 <= percent <= 50:
                outcome = "win"     # 50%
            elif 51 <= percent <= 70:
                outcome = "draw"    # 20%
            else:
                outcome = "loss"    # 30%

            StatisticsService.register_played_game(user.id, game, outcome)

    current_app.logger.info(f"{amount} users have been created.")

