from pathlib import Path

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from routes.trading_one_month import router as trading_one_month_router
from routes.bank_one_month import router as bank_one_month_router

print("hi")
try:
    from workers import WorkerEntrypoint
except:
    pass
BASE_DIR = Path(__file__).resolve().parent
INDEX_FILE = BASE_DIR / "index.html"

app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Allow all origins in development
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/", response_class=FileResponse)
async def root():
    return INDEX_FILE


app.include_router(trading_one_month_router)
app.include_router(bank_one_month_router)


try:

    class Default(WorkerEntrypoint):
        async def fetch(self, request):
            import asgi

            return await asgi.fetch(app, request.js_object, self.env)

except:
    pass
