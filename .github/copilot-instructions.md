# Genai Lifecycle Platform- Copilot Development Instructions

## Project Goal

I am building this project as an end-to-end AI engineering learning project.We will build this step by step not full at once.

The objective is not to create a complex production chatbot.
The objective is to understand how a real software product is designed, developed, containerized, tested, and deployed.

Focus on:

* Clean architecture
* Industry practices
* Readable code
* Incremental development
* Git history quality

## Tech Stack

Backend:

* Python
* FastAPI
* OpenAI API
* JWT Authentication
* SQLAlchemy ORM
* sqlite
* Pytest

Frontend:

* React
* Axios
* React Router

DevOps:

* Docker
* Docker Compose
* Github Actions CI/CD

Deployment:

* Frontend: Vercel
* Backend: Render
* Database: sqlite

## Project Structure

Use separate frontend and backend applications.

backend/
contains all FastAPI code.

frontend/
contains React application.

Both services should communicate through REST APIs.

## Development Rules

Do not generate everything at once.

Build incrementally:

Step 1:
Create basic FastAPI server.

Step 2:
Create chatbot endpoint using OpenAI API.

Step 3:
Add proper project structure.

Step 4:
Add authentication:

* user registration
* login
* JWT token generation
* protected routes

Step 5:
Add database layer.

Step 6:
Create React frontend.

Step 7:
Dockerize backend and frontend.

Step 8:
Create Github Actions pipelines.

Step 9:
Deploy to cloud.

## Coding Guidelines

Follow:

* clean code principles
* dependency injection where useful
* environment variables for secrets
* proper error handling
* logging
* modular files

Never hardcode API keys.

Use .env files locally.

Provide .env.example for Github.

## Git Practices

Create meaningful commits.

Examples:

feat: add chatbot endpoint

feat: implement JWT authentication

fix: handle OpenAI API errors

chore: add Docker configuration

The repository should show professional software development progression.

## Final Expected Architecture

User Browser

↓

React Frontend

↓

FastAPI Backend

↓

OpenAI API

FastAPI also connects with PostgreSQL for user data and chat history.

The final goal is a recruiter-friendly AI engineering portfolio project demonstrating:

* Generative AI
* API Development
* Authentication
* Full Stack Development
* Docker
* CI/CD
* Cloud Deployment

# Progress Tracking Rule

Maintain a docs/DEVELOPMENT_LOG.md file.

After completing any meaningful change:
- Update completed tasks
- Update current architecture
- Update important decisions made
- Update next planned steps

Before starting new development:
- Read docs/DEVELOPMENT_LOG.md.md
- Understand current state
- Continue from there
- Do not recreate existing functionality

docs/DEVELOPMENT_LOG.md acts as project memory.