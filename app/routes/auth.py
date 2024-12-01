from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from schemas.auth import UserCreate, UserLogin, UserChange
from models.user import User
from database import get_db

router = APIRouter()

@router.post("/login/")
async def login(user: UserLogin, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.email == user.email, User.password == user.password).first()
    if db_user is None:
        raise HTTPException(status_code=401, detail="Incorrect email or password")
    
    cleaned_user = {
        "id": db_user.id,
        "email": db_user.email,
        "name": db_user.name
    }
    return {
        "message": "Login successful",
        "user": cleaned_user
    }

@router.post("/register/")
async def register(user: UserCreate, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.email == user.email).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")

    new_user = User(email=user.email, password=user.password, name=user.name)
    db.add(new_user)
    db.commit()
    return {"message": "User registered successfully"}

@router.put("/change_user/{user_id}/")
async def change_user(user_id: str, user: UserChange, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.id == user_id).first()
    if db_user is None:
        raise HTTPException(status_code=404, detail="User not found")
    
    if user.email:
        existing_user = db.query(User).filter(User.email == user.email).first()
        if existing_user:
            raise HTTPException(status_code=400, detail="Email already registered")

    db_user.email = user.email or db_user.email
    db_user.name = user.name or db_user.name

    if user.password and user.old_password:
        if db_user.password != user.old_password:
            raise HTTPException(status_code=400, detail="Incorrect old password")
        db_user.password = user.password

    db.commit()
    return {"message": "User updated successfully"}