
from sqlalchemy import select

from .database import SessionLocal
from .models import Platform


DEFAULT_PLATFORMS = [
    ("PC", "Microsoft"),
    ("PlayStation 5", "Sony"),
    ("PlayStation 4", "Sony"),
    ("Xbox Series X", "Microsoft"),
    ("Xbox One", "Microsoft"),
    ("Nintendo Switch", "Nintendo"),
    ("Steam Deck", "Valve"),
    ("PlayStation 3", "Sony"),
]


def seed_platforms():
    db = SessionLocal()

    try:
        for name, manufacturer in DEFAULT_PLATFORMS:
            existing = db.scalar(
                select(Platform).where(Platform.name == name)
            )

            if existing is None:
                db.add(
                    Platform(
                        name=name,
                        manufacturer=manufacturer,
                    )
                )

        db.commit()
    finally:
        db.close()
