from fastapi import FastAPI, HTTPException
from openai import APIError, OpenAI

from app.config import MAX_NEW_TOKENS, OPENAI_API_KEY, OPENAI_MODEL
from app.schemas.chat import ChatRequest, ChatResponse

app = FastAPI(
    title="GenAI Lifecycle Platform",
    description="Backend API for the GenAI lifecycle learning project",
    version="0.1.0",
)


@app.get("/health")
def health_check() -> dict[str, str]:
    return {"status": "ok"}


@app.post("/chat", response_model=ChatResponse)
def chat(request: ChatRequest) -> ChatResponse:
    if not OPENAI_API_KEY:
        raise HTTPException(
            status_code=500,
            detail="OpenAI API key is not configured. Set OPENAI_API_KEY in backend/.env",
        )

    client = OpenAI(api_key=OPENAI_API_KEY)

    try:
        completion = client.chat.completions.create(
            model=OPENAI_MODEL,
            messages=[{"role": "user", "content": request.question}],
            max_completion_tokens=MAX_NEW_TOKENS,
        )
    except APIError as exc:
        raise HTTPException(
            status_code=502,
            detail=f"OpenAI API error: {exc.message}",
        ) from exc

    answer = completion.choices[0].message.content
    if not answer:
        raise HTTPException(status_code=502, detail="OpenAI returned an empty response")

    return ChatResponse(answer=answer)
