# Tasks — Spec 01

## Backend Initialization
- [x] **Task 1: Backend Setup & Configuration**
  - Initialize backend structure and dependencies (FastAPI, SQLModel, bcrypt, PyJWT).
  - Setup `backend/core/config.py` to securely load environment variables.

## Database & Models
- [x] **Task 2: Database Models**
  - Define `User` SQLModel in `backend/models/user.py`.
  - Define `RefreshToken` SQLModel in `backend/models/user.py`.
  - Define `AuditLog` SQLModel in `backend/models/user.py`.
  - Set up Neon Serverless PostgreSQL connection and database initialization/migrations.

## Data Access Layer (Repositories)
- [x] **Task 3: Repositories**
  - Implement `backend/repositories/user_repository.py` for user CRUD and refresh token management.
  - Implement `backend/repositories/audit_repository.py` for audit logging operations.

## Schemas & Validation
- [x] **Task 4: Authentication & User Schemas**
  - Create `backend/schemas/auth.py`.
  - Define `RegisterRequest`, `LoginRequest`, `UpdateProfileRequest`, `ChangePasswordRequest`, and token response schemas with strict Pydantic validation (e.g., password complexity, email format).

## Business Logic (Services)
- [x] **Task 5: Authentication Service**
  - Implement `backend/services/auth/auth_service.py`.
  - Implement registration (password hashing, user creation).
  - Implement login (password verification, token rotation).
  - Implement token refresh and logout.
  - Implement profile updates, password changes, and profile picture upload logic.
  - Ensure all state-changing actions correctly trigger `AuditLog` writes.

## API Endpoints (Routers)
- [x] **Task 6: Routers**
  - Create `backend/routers/auth.py` for endpoints: `POST /auth/register`, `POST /auth/login`, `POST /auth/refresh`, `POST /auth/logout`.
  - Create user route handlers for endpoints: `GET /users/me`, `PATCH /users/me`, `POST /users/me/change-password`, `POST /users/me/avatar`.
  - Connect route handlers to the authentication service and strictly enforce token authorization.

## Backend Testing
- [x] **Task 7: Backend Tests (TDD)**
  - Write unit/integration tests for authentication logic (login/register).
  - Write tests for profile picture upload validation (2MB limit, specific MIME types).
  - Write tests validating `AuditLog` persistence on state changes.

## Frontend Setup & Theme
- [x] **Task 8: Frontend Initialization**
  - Initialize Next.js project (App Router, TypeScript, Tailwind CSS).
  - Create `frontend/lib/theme/` and configure CSS variables for `light`, `dark`, and `system` theme preferences using the exact defined colors (`#1E293B`, `#14B8A6`).

## Auth UI Implementation
- [x] **Task 9: Auth Components**
  - Create lightweight CSS-only particle background for the Auth page.
  - Create `frontend/components/auth/AuthPageLayout` at the `/auth` route.
  - Implement `LoginPanel` and `SignupPanel` with the Framer Motion sliding panel transition (including `prefers-reduced-motion` fallback).
  - Add input field focus animations and error shake states.

## Dashboard Profile UI
- [x] **Task 10: Dashboard Profile Components**
  - Create `frontend/components/dashboard/ProfileEditor` at `/dashboard/profile` featuring inline-editable fields.
  - Create `AvatarUpload` component with drag-and-drop and fallback upload functionality.
  - Create `ThemeToggle` component with a smooth sliding indicator.
  - Integrate these components with the backend API.

## Final Review & Validation
- [x] **Task 11: End-to-End Validation**
  - Verify acceptance criteria specified in Spec 01.
  - Verify accessibility standards (WCAG AA) and responsive design on the UI.
