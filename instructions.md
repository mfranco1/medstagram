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
- React Hook Form + Zod (form validation)
- React Router (navigation)
- Lucide React (icons)

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

### Frontend (React) - ✅ Implemented

```
frontend/
┣ src/
┃ ┣ components/
┃ ┃ ┣ ai/ # MIRA AI assistant panel
┃ ┃ ┣ layout/ # Header, sidebar, main layout
┃ ┃ ┣ patient/ # Patient-specific components
┃ ┃ ┗ ui/ # Reusable UI components
┃ ┣ pages/ # Route-based views (Dashboard, Patients, SOAP, etc.)
┃ ┣ types/ # TypeScript type definitions
┃ ┣ constants/ # Application constants
┃ ┣ hooks/ # Custom React hooks
┃ ┣ mocks/ # Mock data for development
┃ ┣ utils/ # Utility functions
┃ ┗ assets/ # Images and static files
┗ package.json
```

### Backend (FastAPI) - 🚧 Planned

```
backend/
┣ app/ # (Not yet implemented)
┃ ┣ api/ # Route endpoints
┃ ┣ core/ # Config, startup, security
┃ ┣ models/ # SQLModel classes
┃ ┣ schemas/ # Pydantic schemas
┣ tests/ # Pytest-based unit tests
┗ main.py
```

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
