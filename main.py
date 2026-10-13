from fastapi import FastAPI
from database import engine, Base
import models

Base.metadata.create_all(bind=engine)

# Initialize the API application
app = FastAPI(
    title="Finance Tracker API",
    description="Core backend for the multi-platform finance tracker.",
    version="1.0.0"
)

# Define our first Route / Endpoint (Health Check)
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