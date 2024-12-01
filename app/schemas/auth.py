from pydantic import BaseModel
from typing import Optional

class UserCreate(BaseModel):
    email: str
    password: str
    name: str

class UserChange(BaseModel):
    email: Optional[str] = None
    password: Optional[str] = None
    old_password: Optional[str] = None
    name: Optional[str] = None

    class Config:
        from_attributes = True

class UserLogin(BaseModel):
    email: str
    password: str

    class Config:
        from_attributes = True