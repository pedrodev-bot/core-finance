from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
import models
import schemas
from database import engine, Base, get_db

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Core Finance API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/auth/register", response_model=schemas.LoginResponse)
def register(creds: schemas.LoginRequest, db: Session = Depends(get_db)):
    clean_username = creds.username.strip().lower()

    if not clean_username:
        raise HTTPException(status_code=400, detail="Usuário não pode ser vazio.")

    existing_user = db.query(models.User).filter(models.User.username == clean_username).first()

    if existing_user is not None:
        raise HTTPException(status_code=400, detail="Este nome de usuário já está em uso.")

    new_user = models.User(
        username=clean_username,
        name=clean_username.capitalize(),
        hashed_password=creds.password
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return {
        "token": f"jwt-fake-{new_user.id}",
        "user": new_user
    }

@app.post("/auth/login", response_model=schemas.LoginResponse)
def login(creds: schemas.LoginRequest, db: Session = Depends(get_db)):
    username = creds.username.strip().lower()
    
    existing_user = db.query(models.User).filter(models.User.username == creds.username).first()

    if not existing_user:
        user = models.User(
            username=username,
            name=username.capitalize(),
            hashed_password=creds.password
        )
        db.add(user)
        db.commit()
        db.refresh(user)
        return {
            "token": f"jwt-fake-{user.id}",
            "user": user
        }

    if str(existing_user.hashed_password) != creds.password:
        raise HTTPException(status_code=400, detail="Senha incorreta para este usuário.")

    return {
        "token": f"jwt-fake-{existing_user.id}",
        "user": existing_user
    }

@app.get("/users/{user_id}/transactions", response_model=list[schemas.TransactionResponse])
def get_user_transactions(user_id: str, db: Session = Depends(get_db)):
    return db.query(models.Transaction).filter(models.Transaction.user_id == user_id).all()

@app.post("/users/{user_id}/transactions", response_model=schemas.TransactionResponse)
def create_transaction(user_id: str, tx: schemas.TransactionCreate, db: Session = Depends(get_db)):
    new_tx = models.Transaction(**tx.model_dump(), user_id=user_id)
    db.add(new_tx)
    db.commit()
    db.refresh(new_tx)
    return new_tx