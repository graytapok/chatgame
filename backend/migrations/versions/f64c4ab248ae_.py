"""Create statistics table and trigger

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
        sa.Column('user_id', sa.Uuid(), nullable=False, unique=True),
        sa.Column('total_games', sa.Integer(), nullable=False),
        sa.Column('total_wins', sa.Integer(), nullable=False),
        sa.Column('total_draws', sa.Integer(), nullable=False),
        sa.Column('total_losses', sa.Integer(), nullable=False),
        sa.ForeignKeyConstraint(['user_id'], ['user.id'], ),
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

    with op.batch_alter_table('user', schema=None) as batch_op:
        batch_op.add_column(sa.Column('created_at', sa.DateTime(), nullable=False))

    # ### end Alembic commands ###

    # Create function for autogenerated fields in TotalStatistics
    op.execute("""
        CREATE OR REPLACE FUNCTION public.compute_total_statistics()
            RETURNS trigger
            LANGUAGE plpgsql
        AS $function$
        BEGIN
            UPDATE total_statistics

            SET total_games = COALESCE((
                    SELECT SUM(games) 
                    FROM sub_statistics 
                    WHERE total_statistics_id = NEW.total_statistics_id
                ), 0),				

                total_wins = COALESCE((
                    SELECT SUM(wins) 
                        FROM sub_statistics
                        WHERE total_statistics_id = NEW.total_statistics_id
                    ), 0),

                total_draws = COALESCE((
                    SELECT SUM(draws) 
                    FROM sub_statistics 
                    WHERE total_statistics_id = NEW.total_statistics_id
                ), 0),

                total_losses = COALESCE((
                    SELECT SUM(losses) 
                    FROM sub_statistics 
                    WHERE total_statistics_id = NEW.total_statistics_id
                ), 0)

            WHERE id = NEW.total_statistics_id;

            RETURN NEW;
        END;
        $function$;
        """)

    # Add the trigger
    op.execute("""
        CREATE trigger compute_total_statistics_trigger 
        AFTER INSERT OR UPDATE
        ON public.sub_statistics FOR EACH ROW EXECUTE FUNCTION compute_total_statistics()
        """)


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('user', schema=None) as batch_op:
        batch_op.drop_column('created_at')
    # ### end Alembic commands ###

    # Drop the trigger and function
    op.execute("DROP TRIGGER IF EXISTS compute_total_statistics_trigger ON total_statistics;")
    op.execute("DROP FUNCTION IF EXISTS compute_total_statistics;")

    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('sub_statistics')
    op.drop_table('total_statistics')
    # ### end Alembic commands ###

