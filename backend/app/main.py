from fastapi import FastAPI, HTTPException, Depends, Header, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from openai import APIError, OpenAI

from app.config import MAX_NEW_TOKENS, OPENAI_API_KEY, OPENAI_MODEL
from app.schemas.chat import ChatRequest, ChatResponse
from app.database import engine, Base, get_db
from app.models import User
from app.routes import auth_router
from app.security import verify_token

# Create tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="GenAI Lifecycle Platform",
    description="Backend API for the GenAI lifecycle learning project",
    version="0.1.0",
)

# Add CORS middleware to allow requests from frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include auth routes
app.include_router(auth_router)


@app.get("/health")
def health_check() -> dict[str, str]:
    return {"status": "ok"}


@app.post("/chat", response_model=ChatResponse)
def chat(
    request: ChatRequest,
    authorization: str = Header(None),
    db: Session = Depends(get_db),
) -> ChatResponse:
    """Chat endpoint - requires authentication"""
    
    # Verify token
    if not authorization:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authorization header required",
        )
    
    # Extract token from "Bearer <token>"
    try:
        token = authorization.split(" ")[1]
    except IndexError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authorization header format",
        )
    
    # Verify token and get user
    user_id = verify_token(token)
    user = db.query(User).filter(User.id == int(user_id)).first()
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found",
        )
    
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
