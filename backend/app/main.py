from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routers import runs, test_cases

app = FastAPI(title="ElevenLabs Agent QA & Observability Dashboard")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(test_cases.router)
app.include_router(runs.router)


@app.get("/health")
async def health():
    return {"status": "ok"}
