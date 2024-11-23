"""empty message

Revision ID: f64c4ab248ae
Revises: eb199ebc6490
Create Date: 2024-11-22 17:01:55.207695

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'f64c4ab248ae'
down_revision = 'eb199ebc6490'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('total_statistics',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('user_id', sa.Uuid(), nullable=False),
    sa.Column('total_games', sa.Integer(), nullable=False),
    sa.Column('total_wins', sa.Integer(), nullable=False),
    sa.Column('total_draws', sa.Integer(), nullable=False),
    sa.Column('total_losses', sa.Integer(), nullable=False),
    sa.ForeignKeyConstraint(['user_id'], ['users.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('sub_statistics',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('game_name', sa.Enum('TICTACTOE', 'TICTACTOE_PLUS', name='game'), nullable=False),
    sa.Column('total_statistics_id', sa.Integer(), nullable=False),
    sa.Column('games', sa.Integer(), nullable=False),
    sa.Column('wins', sa.Integer(), nullable=False),
    sa.Column('draws', sa.Integer(), nullable=False),
    sa.Column('losses', sa.Integer(), nullable=False),
    sa.ForeignKeyConstraint(['total_statistics_id'], ['total_statistics.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    with op.batch_alter_table('users', schema=None) as batch_op:
        batch_op.add_column(sa.Column('created_at', sa.DateTime(), nullable=False))

    # ### end Alembic commands ###

    # Create autogenerated fields for TotalStatistics
    op.execute("""
        CREATE OR REPLACE FUNCTION compute_total_statistics()
        RETURNS TRIGGER AS $$
        BEGIN
            -- Compute aggregate values
            SELECT 
                COALESCE(SUM(wins), 0) AS total_wins,
                COALESCE(SUM(losses), 0) AS total_losses,
                COALESCE(SUM(draws), 0) AS total_draws,
                COALESCE(SUM(wins + losses + draws), 0) AS total_games
            INTO
                NEW.total_wins,
                NEW.total_losses,
                NEW.total_draws,
                NEW.total_games
            FROM
                sub_statistics
            WHERE
                total_statistics_id = NEW.id;

            RETURN NEW;
        END;
        $$ LANGUAGE plpgsql;
        """)

    # Add the trigger
    op.execute("""
        CREATE TRIGGER compute_total_statistics_trigger
        BEFORE INSERT OR UPDATE
        ON total_statistics
        FOR EACH ROW
        EXECUTE FUNCTION compute_total_statistics();
        """)


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('users', schema=None) as batch_op:
        batch_op.drop_column('created_at')

    # Drop the trigger and function
    op.execute("DROP TRIGGER IF EXISTS compute_total_statistics_trigger ON total_statistics;")
    op.execute("DROP FUNCTION IF EXISTS compute_total_statistics;")

    op.drop_table('sub_statistics')
    op.drop_table('total_statistics')
    # ### end Alembic commands ###

