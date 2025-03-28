from random import randint
from typing import Literal

import click
from flask import current_app

from chatgame.exceptions import ApiException
from chatgame.constants import Game
from ..statistics import StatisticsService, bp
from ..users import UsersService


@bp.cli.command("create-total-statistics")
@click.argument("user_id")
def create_total_statistics(user_id):
    StatisticsService.create_total_statistics(user_id)

    current_app.logger.info(f"TotalStatistics for User <{user_id}> created")

@bp.cli.command("create-sub-statistics")
@click.argument("game_name")
@click.argument("total_statistics_id")
def create_total_statistics(game_name: str, total_statistics_id: int):
    StatisticsService.create_sub_statistics(Game(game_name), total_statistics_id)

    current_app.logger.info(f"SubStatistics for <TotalStatistics {total_statistics_id}> created")

@bp.cli.command("create-many-users")
@click.argument("amount")
def create_many_users(amount: int):
    counter: int = 1
    for _ in range(1, int(amount) // 2 + 1):
        user = None
        opponent = None

        while user is None:
            try:
                user = UsersService.create_user(
                    f"User{counter}",
                    f"user{counter}@gmail.com",
                    "password",
                    email_confirmed=True
                )
            except ApiException:
                counter += 1
                continue

        while opponent is None:
            try:
                opponent = UsersService.create_user(
                    f"User{counter}",
                    f"user{counter}@gmail.com",
                    "password",
                    email_confirmed=True
                )
            except ApiException:
                counter += 1
                continue

        for j in range(0, randint(20, 100)):
            game = Game.TICTACTOE if randint(0, 1) else Game.TICTACTOE_PLUS

            percent = randint(1, 100)

            outcome: Literal["win", "draw", "loss"]

            if 1 <= percent <= 50:
                outcome = "win"     # 50%
            elif 51 <= percent <= 70:
                outcome = "draw"    # 20%
            else:
                outcome = "loss"

            StatisticsService.register_played_game(user.id, opponent.id, game, outcome)   # type: ignore

    current_app.logger.info(f"{amount} users have been created.")


@bp.cli.command("clear-users")
def clear_many_users():
    for i in UsersService.get_all_users():
        if "User" in i.username:
            UsersService.delete_user(user=i)

    current_app.logger.info(f"Users have been cleared.")