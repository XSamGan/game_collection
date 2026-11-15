from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import func, select
from sqlalchemy.orm import Session


from ..database import get_db
from ..deps import get_current_user
from ..models import Game, User
from ..schemas import GameCreate, GameResponse, GameUpdate


router = APIRouter(
    prefix="/api/games",
    tags=["games"],
)


@router.get("", response_model=list[GameResponse])
def get_games(
    search: str | None = None,
    status_id: int | None = None,
    sort: str | None = None,
    limit: int = 10,
    offset: int = 0,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    query = select(Game).where(
        Game.user_id == current_user.id
    )

    if search:
        query = query.where(
            Game.title.ilike(f"%{search}%")
        )

    if status_id:
        query = query.where(
        Game.status_id == status_id
    )

    if sort == "rating_desc":
        query = query.order_by(Game.rating.desc())

    elif sort == "rating_asc":
        query = query.order_by(Game.rating.asc())

    query = query.limit(limit).offset(offset)

    games = db.scalars(query).all()

    return games

@router.get("/stats")
def get_game_stats(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    total_games = db.scalar(
        select(func.count(Game.id))
        .where(Game.user_id == current_user.id)
    )

    average_rating = db.scalar(
        select(func.avg(Game.rating))
        .where(Game.user_id == current_user.id)
    )

    total_hours = db.scalar(
        select(func.sum(Game.hours_played))
        .where(Game.user_id == current_user.id)
    )

    games_by_status = db.execute(
        select(
            Game.status_id,
            func.count(Game.id),
        )
        .where(Game.user_id == current_user.id)
        .group_by(Game.status_id)
    ).all()

    return {
        "total_games": total_games or 0,
        "average_rating": round(average_rating or 0, 2),
        "total_hours": round(total_hours or 0, 2),
        "games_by_status": [
            {
                "status_id": status_id,
                "count": count,
            }
            for status_id, count in games_by_status
        ],
    }


@router.get("/top", response_model=list[GameResponse])
def get_top_games(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    query = (
        select(Game)
        .where(
            Game.user_id == current_user.id,
            Game.rating.is_not(None),
        )
        .order_by(Game.rating.desc())
        .limit(5)
    )

    games = db.scalars(query).all()

    return games


@router.get("/{game_id}", response_model=GameResponse)
def get_game(
    game_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    game = db.scalar(
        select(Game).where(
            Game.id == game_id,
            Game.user_id == current_user.id,
        )
    )

    if game is None:
        raise HTTPException(
            status_code=404,
            detail="Игра не найдена",
        )

    return game

@router.patch("/{game_id}", response_model=GameResponse)
def update_game(
    game_id: int,
    data: GameUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    game = db.scalar(
        select(Game).where(
            Game.id == game_id,
            Game.user_id == current_user.id,
        )
    )

    if game is None:
        raise HTTPException(
            status_code=404,
            detail="Игра не найдена",
        )

    update_data = data.model_dump(exclude_unset=True)

    for field, value in update_data.items():
        setattr(game, field, value)

    db.commit()
    db.refresh(game)

    return game

@router.delete("/{game_id}")
def delete_game(
    game_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    game = db.scalar(
        select(Game).where(
            Game.id == game_id,
            Game.user_id == current_user.id,
        )
    )

    if game is None:
        raise HTTPException(
            status_code=404,
            detail="Игра не найдена",
        )

    db.delete(game)
    db.commit()

    return {
        "message": "Игра успешно удалена"
    }

@router.post("", response_model=GameResponse)
def create_game(
    data: GameCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    game = Game(
        title=data.title,
        description=data.description,
        status_id=data.status_id,
        hours_played=data.hours_played,
        rating=data.rating,
        release_year=data.release_year,
        platform_id=data.platform_id,
        user_id=current_user.id,
    )

    db.add(game)
    db.commit()
    db.refresh(game)

    return game