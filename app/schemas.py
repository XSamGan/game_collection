from pydantic import BaseModel, ConfigDict, Field

from datetime import date


class RegisterRequest(BaseModel):
    username: str = Field(min_length=3, max_length=50)
    password: str = Field(min_length=6, max_length=100)


class LoginRequest(BaseModel):
    username: str
    password: str


class UserResponse(BaseModel):
    id: int
    username: str

    model_config = ConfigDict(from_attributes=True)



class StatusResponse(BaseModel):
    id: int
    name: str
    description: str | None = None

    model_config = ConfigDict(from_attributes=True)



class PlatformCreate(BaseModel):
    name: str = Field(min_length=1, max_length=100)
    manufacturer: str = Field(min_length=1, max_length=100)


class PlatformResponse(BaseModel):
    id: int
    name: str
    manufacturer: str

    model_config = ConfigDict(from_attributes=True)




class GameCreate(BaseModel):
    title: str
    description: str | None = None
    genre: str | None = None
    cover_url: str | None = None
    status_id: int
    hours_played: float = 0
    rating: float | None = None
    release_date: date | None = None
    platform_id: int


class GameUpdate(BaseModel):
    title: str | None = Field(default=None, min_length=1, max_length=150)
    description: str | None = None
    genre: str | None
    cover_url: str | None = None
    status_id: int | None = None
    hours_played: float | None = Field(default=None, ge=0)
    rating: float | None = Field(default=None, ge=0, le=10)
    release_date: date | None = None
    platform_id: int | None = None


class GameResponse(BaseModel):
    id: int
    title: str
    description: str | None
    genre: str | None
    cover_url: str | None
    status_id: int
    hours_played: float
    rating: float | None
    release_date: date | None = None
    user_id: int
    platform_id: int
    platform_name: str
    status_name: str

    model_config = ConfigDict(from_attributes=True)