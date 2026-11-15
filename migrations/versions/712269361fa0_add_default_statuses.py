"""add default statuses

Revision ID: 712269361fa0
Revises: 51caca066ef8
Create Date: 2026-11-12 23:09:08.602540

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '712269361fa0'
down_revision: Union[str, Sequence[str], None] = '51caca066ef8'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.bulk_insert(
        sa.table(
            "statuses",
            sa.column("name", sa.String),
            sa.column("description", sa.Text),
        ),
        [
            {
                "name": "Не начата",
                "description": "Игра ещё не начата",
            },
            {
                "name": "Играю",
                "description": "Игра находится в процессе прохождения",
            },
            {
                "name": "Пройдена",
                "description": "Игра успешно пройдена",
            },
            {
                "name": "Брошена",
                "description": "Игра больше не проходится",
            },
        ],
    )


def downgrade() -> None:
    op.execute(
        sa.text(
            """
            DELETE FROM statuses
            WHERE name IN (
                'Не начата',
                'Играю',
                'Пройдена',
                'Брошена'
            )
            """
        )
    )