# GenAI Lifecycle Platform

**Author:** Ojas Adhikari

A full-stack AI chat app with user authentication. FastAPI backend, React frontend, OpenAI integration.

## What it does

- Users can sign up and log in
- Chat with OpenAI (gpt-4o-mini) through a web UI
- Chat endpoint is protected — requires a valid JWT token

## Tech stack

**Backend:** Python, FastAPI, SQLAlchemy, SQLite, JWT, OpenAI API  
**Frontend:** React, Vite

## Project structure

```
backend/          FastAPI app, auth routes, database
frontend/         React app (login, signup, chat)
docs/             Development log
```

## Setup

### Backend

```bash
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
```

Copy `.env.example` to `.env` and add your OpenAI API key:

```
OPENAI_API_KEY=your_key_here
OPENAI_MODEL=gpt-4o-mini
MAX_NEW_TOKENS=256
```

Run:

```bash
uvicorn app.main:app --reload
```

API runs at `http://localhost:8000`  
Docs at `http://localhost:8000/docs`

### Frontend

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

App runs at `http://localhost:5173`

## API endpoints

| Method | Endpoint       | Auth required |
|--------|----------------|---------------|
| GET    | /health        | No            |
| POST   | /auth/signup   | No            |
| POST   | /auth/login    | No            |
| GET    | /auth/me       | Yes           |
| POST   | /chat          | Yes           |

## Planned

- Chat history per user
- Docker setup
- CI/CD with GitHub Actions
- Deploy to Vercel (frontend) and Render (backend)

See `docs/DEVELOPMENT_LOG.md` for build progress.
