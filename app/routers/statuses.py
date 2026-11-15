from fastapi import APIRouter, Depends
from sqlalchemy import select
from sqlalchemy.orm import Session

from ..database import get_db
from ..deps import get_current_user
from ..models import Status, User
from ..schemas import StatusResponse


router = APIRouter(
    prefix="/api/statuses",
    tags=["statuses"],
)


@router.get("", response_model=list[StatusResponse])
def get_statuses(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    statuses = db.scalars(
        select(Status)
    ).all()

    return statuses