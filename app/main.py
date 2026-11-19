from .routers import auth, games, platforms, statuses, rawg
from pathlib import Path
from .seed import seed_platforms
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from starlette.middleware.sessions import SessionMiddleware
from fastapi.responses import RedirectResponse

from dotenv import load_dotenv
import os

load_dotenv(
    dotenv_path=Path(__file__).resolve().parent / ".env"
)

RAWG_API_KEY = os.getenv("RAWG_API_KEY")
RAWG_API_URL = "https://api.rawg.io/api"


BASE_DIR = Path(__file__).resolve().parent.parent


@asynccontextmanager
async def lifespan(app: FastAPI):
    seed_platforms()
    yield


app = FastAPI(
    title="Коллекция игр",
    description="Веб-приложение для управления личной коллекцией игр",
)

@app.get("/", include_in_schema=False)
def home():
    return RedirectResponse(url="/static/login.html")

app.add_middleware(
    SessionMiddleware,
    secret_key=os.getenv("SECRET_KEY"),
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
app.include_router(rawg.router)