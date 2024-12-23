import click

from ..users import bp, UsersService


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