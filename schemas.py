from datetime import datetime
from pydantic import BaseModel, ConfigDict

class TransactionBase(BaseModel):
    title: str
    amount: float
    transaction_type: str
    category: str


class TransactionCreate(TransactionBase):
    pass

class TransactionResponse(TransactionBase):
    id: int
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)