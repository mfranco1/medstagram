# 📘 Project: Medstagram

Medstagram is a modern, intelligent electronic medical record system built for hospitals and clinics. It helps healthcare professionals efficiently manage patient records, streamline workflows, and extract actionable insights to improve healthcare outcomes.

## 👤 Target Users

- Medical doctors
- Nurses
- Hospital administrators
- Patients (for access to personal records)

## 🛠️ Tech Stack

### Frontend

- React + TypeScript
- TailwindCSS
- Zustand (state management)
- React Hook Form + Zod (form validation)

### Backend

- FastAPI (Python 3.11+)
- PostgreSQL
- SQLModel
- Pydantic (validation)

### Tooling

- ESLint + Prettier (frontend)
- Ruff + Black (backend)
- Poetry (Python dependency manager)
- Vitest / React Testing Library (frontend testing)
- Pytest (backend testing)
- Docker for containerization

## 📁 Project Structure

### Frontend (React)

frontend/
┣ components/
┣ pages/
┣ features/
┣ hooks/
┣ lib/
┣ assets/
┗ index.tsx

### Backend (FastAPI)

backend/
┣ app/
┃ ┣ api/
┃ ┣ core/
┃ ┣ models/
┃ ┣ schemas/
┣ tests/
┗ main.py

## ✅ Development Practices

- Desktop-first design, responsive across devices
- Explicit TypeScript typing when possible
- Clean Architecture (modular monorepo)
- Squash merges, conventional commits
- Unit testing baseline with increasing coverage goals

## 🧪 Testing

- Use mocks for all external dependencies
- Unit tests required for all core logic
- Integration and e2e tests will follow in later stages

## 🐳 Deployment

- Docker used in development and CI/CD
- Supports containerized deployments (Fly.io, Render, etc.)
