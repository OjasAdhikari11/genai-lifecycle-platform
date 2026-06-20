# GenAI Lifecycle Platform

**Author:** Ojas Adhikari  
**Email:** [ojasadhikari11@gmail.com](mailto:ojasadhikari11@gmail.com)

**Status: Complete** — full-stack GenAI app with auth, Docker, cloud deploy, tests, and CI/CD.

A learning project that walks through the entire lifecycle of a GenAI application: build, run locally, containerize, deploy, test, and automate delivery with GitHub Actions.

## What it does

- Users sign up and log in (JWT authentication)
- Chat with OpenAI (gpt-5.4-nano) through a protected web UI
- Automated tests on every push; deploy to production only after tests pass

## Tech stack

| Layer | Technology |
|-------|------------|
| Backend | Python, FastAPI, SQLAlchemy, SQLite, JWT, OpenAI API |
| Frontend | React, Vite |
| Local containers | Docker, docker-compose, nginx |
| Cloud | Render (backend), Vercel (frontend) |
| CI/CD | GitHub Actions, pytest, deploy hooks |

## Full lifecycle (what this project covers)

```
1. Build      → FastAPI + React + auth + OpenAI chat
2. Run local  → uvicorn + npm dev, or docker compose up
3. Docker     → Dockerfiles + compose for local containerization
4. Deploy     → Render (API) + Vercel (UI) + CORS
5. Test       → pytest (7 tests, in-memory DB, no OpenAI in CI)
6. CI         → GitHub Actions runs pytest on every push/PR
7. CD         → After tests pass, deploy hooks update Render + Vercel
```

## Project structure

```
backend/                 FastAPI app, auth, tests
frontend/                React app (login, signup, chat)
.github/workflows/       CI/CD pipeline (ci.yml)
docker-compose.yml       Run both services locally with Docker
docs/                    Development log
```

## Quick start (local)

### Backend

```bash
cd backend
python -m venv venv
venv\Scripts\activate          # Windows
pip install -r requirements.txt
```

Copy `.env.example` to `.env` and add your OpenAI API key, then:

```bash
uvicorn app.main:app --reload
```

API: `http://localhost:8000` · Docs: `http://localhost:8000/docs`

### Frontend

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

App: `http://localhost:5173`

### Docker

From project root (requires `backend/.env` with `OPENAI_API_KEY`):

```bash
docker compose build
docker compose up
```

### Tests

```bash
cd backend
pip install -r requirements-dev.txt
pytest
```

## CI/CD

Workflow: `.github/workflows/ci.yml`

| Stage | Trigger | What happens |
|-------|---------|--------------|
| **CI** | Push or PR to `main` | Runs `pytest` (7 tests) |
| **CD** | Push to `main`, after CI passes | POSTs deploy hooks → Render + Vercel rebuild |

```
git push → pytest ✓ → deploy hooks ✓ → live app updated
```

### One-time CD setup

1. Deploy backend on [Render](https://render.com) and frontend on [Vercel](https://vercel.com) (see below).
2. Create **deploy hooks** on Render and Vercel; add as GitHub secrets:
   - `RENDER_DEPLOY_HOOK`
   - `VERCEL_DEPLOY_HOOK`
3. Push to `main` — Actions runs tests, then triggers redeploy.

Verify CD: `GET /health` should return the latest `message` after deploy.

## Deploy to production

Deploy **backend first**, then **frontend**, then update CORS.

### Backend (Render)

| Setting | Value |
|---------|--------|
| Root Directory | `backend` |
| Runtime | Python 3 |
| Build Command | `pip install -r requirements.txt` |
| Start Command | `uvicorn app.main:app --host 0.0.0.0 --port $PORT` |

Environment variables: `OPENAI_API_KEY`, `OPENAI_MODEL`, `MAX_NEW_TOKENS`, `SECRET_KEY`, `DATABASE_URL=sqlite:////tmp/genai.db`, `CORS_ORIGINS`

### Frontend (Vercel)

| Setting | Value |
|---------|--------|
| Root Directory | `frontend` |
| Env var | `VITE_API_URL=https://YOUR-API.onrender.com` |

### CORS

On Render, set `CORS_ORIGINS` to include your Vercel URL (no trailing slash):

```
http://localhost:5173,https://your-app.vercel.app
```

### Notes

- Render free tier sleeps when idle — first request may take 30–60 seconds
- Cloud deploy uses native Python on Render (Dockerfiles are for local use)
- Tear down Render/Vercel when not demoing to avoid OpenAI usage
- Do not commit `.env` files

## API endpoints

| Method | Endpoint | Auth required |
|--------|----------|---------------|
| GET | `/health` | No |
| POST | `/auth/signup` | No |
| POST | `/auth/login` | No |
| GET | `/auth/me` | Yes |
| POST | `/chat` | Yes |

## Scope

This project intentionally stays simple to teach the lifecycle end-to-end.

**Included:** auth, protected chat, Docker locally, cloud deploy, pytest, CI/CD  
**Not included:** chat persistence, PostgreSQL, Kubernetes, always-on public demo

## Demo video idea

A strong portfolio demo in ~3 minutes:

1. Show live `/health` response
2. Change the message in `backend/app/main.py`
3. `git push` → show GitHub Actions (tests + deploy)
4. Refresh `/health` — new message is live
5. Optional: signup + chat on the Vercel URL

See `docs/DEVELOPMENT_LOG.md` for build history.
