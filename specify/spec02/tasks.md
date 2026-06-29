# Tasks — Spec 02

## Environment Setup
- [ ] **Task 1: Project Dependencies Setup**
  - Execute terminal commands to establish backend dependencies (SQLModel, WeasyPrint/ReportLab, etc.).
  - Execute terminal commands to install and configure frontend dependencies (Next.js, Zustand, Framer Motion, Tailwind).

## Database & Repositories
- [x] **Task 2: Database Schema & Models**
  - Define `Resume` and `ResumeSnapshot` models in `backend/models/resume.py` reflecting the spec constraints.
- [x] **Task 3: Backend Repositories**
  - Implement `ResumeRepository` in `backend/repositories/resume_repository.py` for standard CRUD operations and version snapshot management.

## Core API Endpoints
- [x] **Task 4: Resume CRUD API**
  - Create Pydantic schemas in `backend/schemas/resume.py`.
  - Implement `backend/routers/resumes.py` mapped to CRUD operations (`POST`, `GET`, `PATCH`, `DELETE`) and restore snapshot functionality, ensuring strict JWT user isolation.

## PDF Generation Pipeline
- [x] **Task 5: PDF Engine Service**
  - (Wait for user selection between WeasyPrint/ReportLab if necessary).
  - Implement `backend/services/pdf/pdf_service.py` to convert live data to PDF.
  - Implement `/resumes/{id}/generate-pdf` and `/resumes/{id}/download` endpoints.

## Frontend State Management
- [x] **Task 6: Global Form Store & Auto-Save**
  - Set up `frontend/lib/store/useResumeStore.ts` using Zustand to manage all resume form state.
  - Implement a robust 3-second debounced auto-save mechanism that patches data to the backend.

## Smart Form Development
- [x] **Task 7: Form Sections (Basics & Navigation)**
  - Build the multi-step form layout with Framer Motion slide/cross-fade transitions and breadcrumbs.
  - Implement `Contact Information` and `Professional Summary` modules with character counters and live validation.
- [x] **Task 8: Form Sections (Repeatables & Tags)**
  - Implement `Work Experience` and `Education` modules, perfectly handling the "Currently Working/Studying" logic (clearing the end date in state).
  - Implement `Certifications`, `Projects`, and `Skills` modules, specifically building the tag-input validation logic.

## ATS Templates & Live Preview
- [x] **Task 9: ATS Templates**
  - Construct pixel-perfect React template components for all 5 layout variants (`Classic`, `Modern`, `Executive`, `Compact`, `Minimal`), ensuring strict single/two-column parseability and HTML semantics.
- [x] **Task 10: Live Preview & Template Selection UI**
  - Implement the `TemplateSelector` card row on Step 8.
  - Build the `LivePreviewPanel` that dynamically maps store data to the selected template component with a 300ms debounce.

## Final Review & Routing
- [x] **Task 11: End-to-End Integration**
  - Finalize all frontend routes (`/builder`, `/builder/new`, `/builder/{id}`, `/dashboard/resumes`).
  - Verify end-to-end functionality including PDF download success, auto-saving accuracy, and Dark/Light mode on the UI.
