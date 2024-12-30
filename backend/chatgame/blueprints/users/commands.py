from random import randint

import click
from sqlalchemy import except_

from ..statistics import StatisticsService
from ..users import bp, UsersService

from chatgame.constants import Game
from chatgame.extensions import db
from ...db.models import TotalStatisticsModel, SubStatisticsModel


@bp.cli.command("create-admin")
@click.argument("name")
@click.argument("email")
@click.argument("password")
def create_admin(name, email, password):
    UsersService.create_user(name, email, password, admin=True, email_confirmed=True)

    print(f"Admin '{name}' created.")


@bp.cli.command("create-user")
@click.argument("name")
@click.argument("email")
@click.argument("password")
def create_user(name, email, password):
    UsersService.create_user(name, email, password, email_confirmed=True)

    print(f"User '{name}' created.")

@bp.cli.command("create-hundred-users")
def create_hundred_users():
    for i in range(1, 101):
        user = UsersService.create_user(f"User{i}", f"user{i}@gmail.com", "password", email_confirmed=True)

        ts = TotalStatisticsModel(user.id)
        db.session.add(ts)
        db.session.commit()

        fst = SubStatisticsModel(Game.TICTACTOE, ts.id)
        sst = SubStatisticsModel(Game.TICTACTOE_PLUS, ts.id)

        db.session.add(fst)
        db.session.add(sst)
        db.session.commit()

        fst.games = randint(0, 20)
        fst.wins = randint(0, fst.games)
        fst.losses = randint(0, fst.games - fst.wins)
        fst.draws = fst.games - fst.wins - fst.losses

        sst.games = randint(0, 20)
        sst.wins = randint(0, sst.games)
        sst.losses = randint(0, sst.games - sst.wins)
        sst.draws = sst.games - sst.wins - sst.losses
        db.session.commit()

    print("One hundred users have been created.")