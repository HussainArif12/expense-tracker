from pathlib import Path

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from routes.trading_one_month import router as trading_one_month_router
from routes.bank_one_month import router as bank_one_month_router
from routes.verdict import router as verdict_router
from routes.bank_multi_month import router as bank_multi_month_router
from routes.trading_multi_month import router as trading_multi_month_router
from dotenv import load_dotenv
import os

load_dotenv()

BASE_DIR = Path(__file__).resolve().parent
INDEX_FILE = BASE_DIR / "index.html"
SELF_HOST = os.environ.get("SELF_HOST")

app = FastAPI()
origins = (
    [
        "http://localhost:3000",
        "https://tanstack-start-app.hussainarifkl.workers.dev",
        "https://expense-tracker.hussainarifkl.workers.dev",
    ]
    if SELF_HOST
    else ["*"]
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/", response_class=FileResponse)
async def root():
    return INDEX_FILE


app.include_router(trading_one_month_router)
app.include_router(bank_one_month_router)
app.include_router(verdict_router)
app.include_router(bank_multi_month_router)
app.include_router(trading_multi_month_router)
