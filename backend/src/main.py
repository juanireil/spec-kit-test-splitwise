from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.src.api.routes import router

app = FastAPI(
    title="SplitWise Lite API",
    description="API for Iteration 01 (MVP): Expense Entry & Live Balance Sheet",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router, prefix="/api")


@app.get("/")
def root():
    return {"message": "SplitWise Lite API is running", "docs": "/docs"}
