from fastapi import FastAPI

app = FastAPI(
    title="GenAI Lifecycle Platform",
    description="Backend API for the GenAI lifecycle learning project",
    version="0.1.0",
)


@app.get("/health")
def health_check() -> dict[str, str]:
    return {"status": "ok"}
