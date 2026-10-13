from fastapi import FastAPI, Depends
from database import engine, Base, SessionLocal
from sqlalchemy.orm import Session
import models
import schemas 

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Finance Tracker API",
    description="Core backend for the multi-platform finance tracker.",
    version="1.0.0"
)

@app.get("/")
def health_check():
    """
    Root endpoint to verify if the API is up and running.
    """
    return {
        "status": "success",
        "message": "Finance Tracker API is online and ready.",
        "environment": "development"
    }



def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.post("/transactions/", response_model=schemas.TransactionResponse)
def create_transaction(transaction: schemas.TransactionCreate, db: Session = Depends(get_db)):
    """
    Create a new financial transaction in database.
    """
    new_transaction = models.Transaction(
        title=transaction.title,
        amount=transaction.amount,
        transaction_type=transaction.transaction_type,
        category=transaction.category
    )

    db.add(new_transaction)
    db.commit()
    db.refresh(new_transaction)

    return new_transaction