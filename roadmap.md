# 🗺️ Medstagram Roadmap

This document outlines the key milestones and planned features for the Medstagram project. It helps maintain a clear direction for development, prioritization, and design decisions.

---

## ✅ Phase 1 – MVP (Core EMR)

### 🧩 Features

- [ ] User authentication and role-based access (doctor, nurse, admin, patient)
- [x] Patient profile management (comprehensive patient data model)
- [x] Patient dashboard and listing with advanced search/filtering
- [x] Individual patient view with tabbed interface
- [ ] Full SOAP note charting (UI ready, backend needed)
- [ ] Structured lab and imaging results input
- [x] Clinician dashboard (statistics, recent activities, appointments)

### 🛠️ Infrastructure

- [x] Tech stack selection (React, FastAPI, PostgreSQL)
- [x] Frontend application architecture and implementation
- [x] Dockerized dev setup (configured)
- [x] Mock data system for development
- [ ] Backend API implementation
- [ ] Database schema and migrations
- [ ] Basic CI integration (TBD)

---

## 🎯 Current Status & Immediate Next Steps

### ✅ What's Working Now
- **Frontend Application**: Fully functional React app with patient management
- **Patient Data**: Comprehensive patient profiles with medical information
- **UI/UX**: Modern, responsive interface with advanced filtering and search
- **MIRA AI Panel**: UI framework ready for AI integration
- **Development Environment**: Docker setup with hot reloading

### 🚀 Priority Next Steps
1. **Backend API Development**: Implement FastAPI endpoints for patient data
2. **Database Integration**: Set up PostgreSQL with patient data models
3. **Authentication System**: Implement login/logout with role-based access
4. **SOAP Note Functionality**: Connect UI to backend for clinical documentation
5. **AI Integration**: Connect MIRA panel to actual AI services

---

## ✅ Phase 2 – Intelligence Layer

- [ ] Machine-assisted history and physical exam taking
- [ ] Machine-assisted assessment and management plan formulation
- [ ] Chat with patient records
- [ ] Auto-generate case summaries
- [ ] Smart search (fulltext + filters + ranking)
- [ ] Analytics dashboard (operational and clinical metrics)
- [ ] Rule-based alert system (abnormal labs, missed follow-ups, etc.)
- [ ] ML-driven triage risk scoring (placeholder for integration)

---

## ✅ Phase 3 – Patient-Facing Portal

- [ ] Secure access to personal records
- [ ] View lab results and doctor notes
- [ ] Appointment booking and reminders
- [ ] Secure messaging with providers

---

## ✅ Phase 4 – Administrative & Reporting Tools

- [ ] Staff scheduling + shift tracking
- [ ] Automatic generation of DOH-compliant reports
- [ ] Custom report builder (drag-and-drop style)
- [ ] Audit logs and access tracing

---

## ✅ Phase 5 – Long-Term Stretch Goals

- [ ] Integration with national health record systems
- [ ] Offline-first mode with eventual sync
- [ ] Multi-clinic/hospital support with central dashboard

---

## ⏳ Prioritization Principles

- 🚀 Build thin, functional vertical slices
- 👥 Prioritize real-world clinician use cases
- 🧼 Maintain clean and well-documented architecture
- 🧪 Deliver testable units with every milestone
