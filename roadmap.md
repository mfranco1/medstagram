# 🗺️ Medstagram Roadmap

This document outlines the key milestones and planned features for the Medstagram project. It helps maintain a clear direction for development, prioritization, and design decisions.

---

## ✅ Phase 1 – MVP (Core EMR)

### 🧩 Features

- [ ] User authentication and role-based access (doctor, nurse, admin, patient)
- [ ] Patient profile management
- [ ] Consultation and inpatient records
- [ ] SOAP note charting
- [ ] Structured lab and imaging results input
- [ ] Clinician dashboard (task overview, new results, follow-ups)

### 🛠️ Infrastructure

- [x] Tech stack selection (React, FastAPI, PostgreSQL)
- [ ] Dockerized dev setup
- [ ] Basic CI integration (TBD)

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
