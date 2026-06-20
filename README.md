# GenAI Lifecycle Platform

**Author:** Ojas Adhikari  
**Email:** [ojasadhikari11@gmail.com](mailto:ojasadhikari11@gmail.com)

A full-stack AI chat app with user authentication. FastAPI backend, React frontend, OpenAI integration.

This project intentionally keeps the scope simple — auth, protected chat, local Docker, and cloud deploy — to learn the full GenAI app lifecycle without extra complexity.

## What it does

- Users can sign up and log in
- Chat with OpenAI (gpt-4o-mini) through a web UI
- Chat endpoint is protected — requires a valid JWT token

## Tech stack

**Backend:** Python, FastAPI, SQLAlchemy, SQLite, JWT, OpenAI API  
**Frontend:** React, Vite  
**Deploy:** Render (backend), Vercel (frontend), Docker (local)

## Project structure

```
backend/          FastAPI app, auth routes, database
frontend/         React app (login, signup, chat)
docs/             Development log
docker-compose.yml   Run both services locally with Docker
```

## Local setup

### Backend

```bash
cd backend
python -m venv venv
venv\Scripts\activate          # Windows
# source venv/bin/activate     # Mac/Linux
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

### Docker (alternative)

From the project root:

```bash
docker compose build
docker compose up
```

- Frontend: http://localhost:5173
- Backend: http://localhost:8000

Requires `backend/.env` with your `OPENAI_API_KEY`.

### Tests

```bash
cd backend
pip install -r requirements-dev.txt
pytest
```

Runs unit tests (security helpers) and API tests (health, auth, chat auth) using an in-memory database — no OpenAI calls.

### CI/CD (GitHub Actions)

**CI** — on every push/PR to `main`, runs `pytest` (see `.github/workflows/ci.yml`).

**CD** — on push to `main`, *after tests pass*, triggers deploy hooks for Render and Vercel.

```
Push code → pytest (CI) → if green → deploy hooks (CD) → live app updates
```

#### One-time CD setup (deploy hooks)

1. **Redeploy** backend on Render and frontend on Vercel (see below).
2. **Disable auto-deploy on git push** so only CI can trigger deploys:
   - **Render:** Settings → turn off *Auto-Deploy* (or use deploy hook only)
   - **Vercel:** Settings → Git → disable automatic deployments for production *(optional; hook redeploys after CI)*
3. **Create deploy hooks:**
   - **Render:** Service → Settings → **Deploy Hook** → copy URL
   - **Vercel:** Project → Settings → Git → **Deploy Hooks** → create hook for `main` → copy URL
4. **Add GitHub secrets** (repo → Settings → Secrets and variables → Actions):

| Secret name | Value |
|-------------|--------|
| `RENDER_DEPLOY_HOOK` | Render deploy hook URL |
| `VERCEL_DEPLOY_HOOK` | Vercel deploy hook URL |

5. Push to `main` — Actions runs tests, then POSTs to both hooks if secrets are set.

Verify CD worked: `GET https://YOUR-API.onrender.com/health` should include the latest `message` field.

## Deploy to production

Deploy **backend first**, then **frontend**, then update CORS.

### 1. Backend on Render

1. [render.com](https://render.com) → New Web Service → connect GitHub repo
2. Settings:

| Setting | Value |
|---------|--------|
| Root Directory | `backend` |
| Runtime | Python 3 |
| Build Command | `pip install -r requirements.txt` |
| Start Command | `uvicorn app.main:app --host 0.0.0.0 --port $PORT` |
| Instance Type | Free |

3. Environment variables:

| Key | Value |
|-----|--------|
| `OPENAI_API_KEY` | your OpenAI key |
| `OPENAI_MODEL` | `gpt-4o-mini` |
| `MAX_NEW_TOKENS` | `256` |
| `SECRET_KEY` | long random string |
| `DATABASE_URL` | `sqlite:////tmp/genai.db` |
| `CORS_ORIGINS` | `http://localhost:5173` *(update after Vercel deploy)* |

4. Deploy and test: `https://YOUR-SERVICE.onrender.com/health`

### 2. Frontend on Vercel

1. [vercel.com](https://vercel.com) → New Project → import GitHub repo
2. Set **Root Directory** to `frontend` (not repo root)
3. Add environment variable:

| Key | Value |
|-----|--------|
| `VITE_API_URL` | `https://YOUR-SERVICE.onrender.com` *(no trailing slash)* |

4. Deploy. Note your Vercel URL (e.g. `https://your-app.vercel.app`).

### 3. Connect frontend and backend (CORS)

On Render, update `CORS_ORIGINS`:

```
http://localhost:5173,https://your-app.vercel.app
```

Save and wait for Render to redeploy. Then test signup and chat on your Vercel URL.

### Deployment notes

- Render free tier sleeps when idle — first request may take 30–60 seconds
- SQLite on Render is ephemeral — user data may reset on redeploy (fine for learning)
- Do not commit `.env` files — use platform environment variables instead
- **Cloud deploy uses native Python on Render** — Dockerfiles are for local use only (see below)

## API endpoints

| Method | Endpoint       | Auth required |
|--------|----------------|---------------|
| GET    | /health        | No            |
| POST   | /auth/signup   | No            |
| POST   | /auth/login    | No            |
| GET    | /auth/me       | Yes           |
| POST   | /chat          | Yes           |

## Scope & optional next steps

Core lifecycle is complete: build → auth → chat → Docker → deploy → tests → CI → CD.

Intentionally **not** in scope (kept simple on purpose):
- Chat history / message persistence
- PostgreSQL or other managed database
- Always-on hosted demo (tear down Render/Vercel when not demoing)

See `docs/DEVELOPMENT_LOG.md` for build progress.
