from sqlalchemy import Float, ForeignKey, Integer, String, Text, Date
from sqlalchemy.orm import Mapped, mapped_column, relationship

from .database import Base
from datetime import date

class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(
        Integer,
        primary_key=True,
        autoincrement=True,
    )

    username: Mapped[str] = mapped_column(
        String(50),
        unique=True,
        nullable=False,
    )

    password_hash: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
    )


class Platform(Base):
    __tablename__ = "platforms"

    id: Mapped[int] = mapped_column(
        Integer,
        primary_key=True,
        autoincrement=True,
    )

    name: Mapped[str] = mapped_column(
        String(100),
        unique=True,
        nullable=False,
    )

    manufacturer: Mapped[str] = mapped_column(
        String(100),
        nullable=False,
    )


class Status(Base):
    __tablename__ = "statuses"

    id: Mapped[int] = mapped_column(
        Integer,
        primary_key=True,
        autoincrement=True,
    )

    name: Mapped[str] = mapped_column(
        String(30),
        unique=True,
        nullable=False,
    )

    description: Mapped[str | None] = mapped_column(
        Text,
        nullable=True,
    )


class Game(Base):
    __tablename__ = "games"

    id: Mapped[int] = mapped_column(
        Integer,
        primary_key=True,
        autoincrement=True,
    )

    title: Mapped[str] = mapped_column(
        String(150),
        nullable=False,
    )

    description: Mapped[str | None] = mapped_column(
        Text,
        nullable=True,
    )

    genre: Mapped[str | None] = mapped_column(
        String(100),
        nullable=True,
    )

    cover_url: Mapped[str | None] = mapped_column(
    String(500),
    nullable=True,
    )

    status_id: Mapped[int] = mapped_column(
        Integer,
        ForeignKey("statuses.id"),
        nullable=False,
    )

    hours_played: Mapped[float] = mapped_column(
        Float,
        default=0,
        nullable=False,
    )

    rating: Mapped[float | None] = mapped_column(
        Float,
        nullable=True,
    )

    release_date: Mapped[date | None] = mapped_column(
        Date,
        nullable=True,
    )

    user_id: Mapped[int] = mapped_column(
        Integer,
        ForeignKey("users.id"),
        nullable=False,
    )

    platform_id: Mapped[int] = mapped_column(
        Integer,
        ForeignKey("platforms.id"),
        nullable=False,
    )
    platform: Mapped["Platform"] = relationship()
    status: Mapped["Status"] = relationship()

    @property
    def platform_name(self) -> str:
        return self.platform.name

    @property
    def status_name(self) -> str:
        return self.status.name