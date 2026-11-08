from pydantic import BaseModel
from typing import Optional

class UserBase(BaseModel):
    username: str
    name: str

class UserCreate(UserBase):
    password: str

class UserResponse(UserBase):
    id: str
    class Config:
        from_attributes = True

class TransactionBase(BaseModel):
    description: str
    amount: float
    date: str
    type: str

class TransactionCreate(TransactionBase):
    pass

class TransactionResponse(TransactionBase):
    id: str
    user_id: str
    synced: bool
    class Config:
        from_attributes = True

class LoginRequest(BaseModel):
    username: str
    password: str

class LoginResponse(BaseModel):
    token: str
    user: UserResponse