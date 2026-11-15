from .routers import auth, games, platforms, statuses
from pathlib import Path

from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from starlette.middleware.sessions import SessionMiddleware


BASE_DIR = Path(__file__).resolve().parent.parent


app = FastAPI(
    title="Коллекция игр",
    description="Веб-приложение для управления личной коллекцией игр",
)


app.add_middleware(
    SessionMiddleware,
    secret_key="super-secret-key-change-later",
)


app.mount(
    "/static",
    StaticFiles(directory=BASE_DIR / "static"),
    name="static",
)
app.include_router(auth.router)
app.include_router(games.router)
app.include_router(platforms.router)
app.include_router(statuses.router)