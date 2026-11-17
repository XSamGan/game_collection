
import os

import httpx
from fastapi import APIRouter, Depends, HTTPException

from ..deps import get_current_user
from ..models import User


router = APIRouter(
    prefix="/api/rawg",
    tags=["rawg"],
)


@router.get("/search")
async def search_rawg_games(
    search: str,
    current_user: User = Depends(get_current_user),
):
    api_key = os.getenv("RAWG_API_KEY")

    if not api_key:
        raise HTTPException(
            status_code=500,
            detail="RAWG API key is not configured",
        )

    try:
        async with httpx.AsyncClient(timeout=15.0) as client:
            response = await client.get(
                "https://api.rawg.io/api/games",
                params={
                    "key": api_key,
                    "search": search,
                    "page_size": 10,
                },
            )

            response.raise_for_status()
            data = response.json()

    except httpx.HTTPError:
        raise HTTPException(
            status_code=502,
            detail="Не удалось получить данные от RAWG",
        )

    return [
        {
            "id": game["id"],
            "name": game["name"],
            "background_image": game.get("background_image"),
            "released": game.get("released"),
            "genres": [
                genre["name"]
                for genre in game.get("genres", [])
            ],
            "platforms": [
                item["platform"]["name"]
                for item in game.get("platforms", [])
            ],
        }
        for game in data.get("results", [])
    ]
