"""add genre and release date

Revision ID: c0d1ba032e60
Revises: 712269361fa0
Create Date: 2026-11-17 10:04:53.982006

"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = "c0d1ba032e60"
down_revision: Union[str, Sequence[str], None] = "712269361fa0"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    op.add_column(
        "games",
        sa.Column("genre", sa.String(length=100), nullable=True),
    )

    op.add_column(
        "games",
        sa.Column("release_date", sa.Date(), nullable=True),
    )

    op.execute(
        """
        UPDATE games
        SET release_date = printf('%04d-01-01', release_year)
        WHERE release_year IS NOT NULL
        """
    )

    op.drop_column("games", "release_year")


def downgrade() -> None:
    """Downgrade schema."""
    op.add_column(
        "games",
        sa.Column("release_year", sa.INTEGER(), nullable=True),
    )

    op.execute(
        """
        UPDATE games
        SET release_year = CAST(strftime('%Y', release_date) AS INTEGER)
        WHERE release_date IS NOT NULL
        """
    )

    op.drop_column("games", "release_date")
    op.drop_column("games", "genre")