from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError

from ..database import get_db
from ..deps import get_current_user
from ..models import Platform, User
from ..schemas import PlatformCreate, PlatformResponse


router = APIRouter(
    prefix="/api/platforms",
    tags=["platforms"],
)


@router.get("", response_model=list[PlatformResponse])
def get_platforms(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    platforms = db.scalars(
        select(Platform)
    ).all()

    return platforms


@router.post("", response_model=PlatformResponse)
def create_platform(
    data: PlatformCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    existing_platform = db.scalar(
        select(Platform).where(Platform.name == data.name)
    )

    if existing_platform is not None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Платформа с таким названием уже существует",
        )

    platform = Platform(
        name=data.name,
        manufacturer=data.manufacturer,
    )

    db.add(platform)
    db.commit()
    db.refresh(platform)

    return platform

@router.delete("/{platform_id}")
def delete_platform(
    platform_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    platform = db.get(Platform, platform_id)

    if platform is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Платформа не найдена",
        )

    try:
        db.delete(platform)
        db.commit()
    except IntegrityError:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Нельзя удалить платформу, которая используется играми",
    )

    return {
        "message": "Платформа успешно удалена"
    }