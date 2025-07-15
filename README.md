# Medstagram

<div align="center">
  <img src="frontend/public/medstagram_full.png" alt="Medstagram Logo" width="400"/>
</div>

## 🏥 Modern Electronic Medical Record System

Medstagram is an intelligent electronic medical record (EMR) system designed for hospitals and clinics. It helps healthcare professionals efficiently manage patient records, streamline workflows, and extract actionable insights to improve healthcare outcomes.

## ✨ Current Features

### ✅ Implemented
- **Patient Management**: Comprehensive patient profiles with detailed medical information
- **Dashboard**: Real-time statistics, recent activities, and upcoming appointments
- **SOAP Interface**: Individual patient view with tabbed navigation for medical data
- **Advanced Search & Filtering**: Multi-criteria patient search and filtering system
- **AI Assistant UI**: MIRA panel ready for intelligent clinical assistance
- **Responsive Design**: Modern, clean interface optimized for healthcare workflows

### 🚧 In Development
- **Backend API**: FastAPI implementation with PostgreSQL database
- **Authentication System**: Role-based access control
- **Clinical Documentation**: Full SOAP note charting functionality
- **AI Integration**: Machine-assisted clinical decision support

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

### Development Tools

- ESLint + Prettier (frontend)
- Ruff + Black (backend)
- Poetry (Python dependency manager)
- Vitest / React Testing Library (frontend testing)
- Pytest (backend testing)
- Docker for containerization

## 🚀 Getting Started

### Prerequisites

- Docker and Docker Compose
- Node.js 18+ (for frontend development)
- Python 3.11+ (for backend development)
- Poetry (Python package manager)

### Development Setup

1. Clone the repository:

   ```bash
   git clone https://github.com/mfranco1/medstagram.git
   cd medstagram
   ```

2. Start the development environment:

   ```bash
   docker-compose up -d
   ```

3. Install frontend dependencies:

   ```bash
   cd frontend
   npm install
   ```

4. Install backend dependencies:

   ```bash
   cd backend
   poetry install
   ```

5. Start the development servers:
   - Frontend: `cd frontend && npm run dev`
   - Backend: (Not yet implemented - currently using mock data)

## 📚 Documentation

- [Project Instructions](instructions.md)
- [Development Roadmap](roadmap.md)

## 🧪 Testing

- Frontend: `npm test`
- Backend: `poetry run pytest`

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 👥 Target Users

- Medical doctors
- Nurses
- Hospital administrators
- Patients (for access to personal records)

## 🔮 Future Plans

See our [Roadmap](roadmap.md) for detailed information about upcoming features and development plans.

## 📞 Contact Us

Email our team at [mcfranco16@gmail.com](mailto:mcfranco16@gmail.com)
