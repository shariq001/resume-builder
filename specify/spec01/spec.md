# Spec 01 — Authentication, Profile Management & Database Architecture

> **Constitution alignment:** Security Requirements · Module Boundaries (`auth/`, `repositories/`, `models/`) · Form & Validation Standards · Code Quality Standards

---

## 1. Overview

This spec covers the complete identity layer of the ATS Resume Builder: user registration, login, session lifecycle, profile customization, and the underlying database schema that ties all user-owned data together. Everything in this spec is a prerequisite for Spec 02 and Spec 03 — no resume or ATS feature can be built until the auth boundary and data models are stable.

---

## 2. Database Schema

All models are defined using **SQLModel** and applied to **Neon Serverless PostgreSQL**. Raw SQL is forbidden outside of migration files.

### 2.1 `User`

| Column | Type | Constraints |
|---|---|---|
| `id` | `UUID` | Primary key, auto-generated |
| `email` | `VARCHAR(255)` | Unique, not null, indexed |
| `username` | `VARCHAR(50)` | Unique, not null |
| `hashed_password` | `TEXT` | Not null |
| `full_name` | `VARCHAR(150)` | Not null |
| `profile_picture_url` | `TEXT` | Nullable |
| `theme_preference` | `ENUM('light', 'dark', 'system')` | Default: `'system'` |
| `created_at` | `TIMESTAMPTZ` | Default: `now()` |
| `updated_at` | `TIMESTAMPTZ` | Auto-updated on write |

### 2.2 `RefreshToken`

| Column | Type | Constraints |
|---|---|---|
| `id` | `UUID` | Primary key |
| `user_id` | `UUID` | Foreign key → `User.id`, cascade delete |
| `token_hash` | `TEXT` | Not null, indexed |
| `expires_at` | `TIMESTAMPTZ` | Not null |
| `revoked` | `BOOLEAN` | Default: `false` |
| `created_at` | `TIMESTAMPTZ` | Default: `now()` |

### 2.3 `AuditLog`

| Column | Type | Constraints |
|---|---|---|
| `id` | `UUID` | Primary key |
| `user_id` | `UUID` | Foreign key → `User.id`, nullable (pre-auth events) |
| `action` | `VARCHAR(100)` | Not null (e.g., `user.created`, `resume.deleted`) |
| `http_method` | `VARCHAR(10)` | Not null |
| `path` | `TEXT` | Not null |
| `ip_address` | `INET` | Not null |
| `created_at` | `TIMESTAMPTZ` | Default: `now()` |

> **Constitution rule:** Request bodies are never logged. Only the metadata columns above are written.

---

## 3. Authentication Flow

### 3.1 Registration

**Endpoint:** `POST /auth/register`

**Pydantic schema — `RegisterRequest`:**
```python
class RegisterRequest(BaseModel):
    full_name: str          # min 2 chars, max 150 chars
    email: EmailStr         # validated format
    username: str           # 3–50 chars, alphanumeric + underscores only
    password: str           # min 8 chars, at least 1 uppercase, 1 digit, 1 special char
```

**Behaviour:**
1. Validate uniqueness of `email` and `username` — return `409 Conflict` if either exists.
2. Hash password with **bcrypt** (cost factor ≥ 12).
3. Persist `User` row via `UserRepository.create()`.
4. Issue access token (15-minute expiry) and refresh token (7-day expiry).
5. Write `user.created` to `AuditLog`.
6. Return `201 Created` with access token in response body; refresh token in `HttpOnly` cookie is **forbidden** — both tokens returned in response body per constitution (no cookies).

### 3.2 Login

**Endpoint:** `POST /auth/login`

**Pydantic schema — `LoginRequest`:**
```python
class LoginRequest(BaseModel):
    email: EmailStr
    password: str
```

**Behaviour:**
1. Look up user by email — return `401 Unauthorized` with a generic message on any failure (no distinguishing between "email not found" and "wrong password").
2. Verify bcrypt hash.
3. Rotate refresh token: revoke any existing active token for this user, issue a new one.
4. Write `user.login` to `AuditLog`.
5. Return `200 OK` with both tokens.

### 3.3 Token Refresh

**Endpoint:** `POST /auth/refresh`

**Behaviour:**
1. Accept `refresh_token` in request body.
2. Validate token hash exists in `RefreshToken`, is not revoked, and has not expired.
3. Revoke the submitted token and issue a new pair (rotate both access and refresh tokens).
4. Return `200 OK` with new tokens.

### 3.4 Logout

**Endpoint:** `POST /auth/logout`

**Behaviour:**
1. Accept `refresh_token` in request body.
2. Mark the token as `revoked = true` in `RefreshToken` table.
3. Write `user.logout` to `AuditLog`.
4. Return `204 No Content`.

---

## 4. Profile Management

### 4.1 Get Profile

**Endpoint:** `GET /users/me`

**Auth:** Bearer access token required.

Returns the authenticated user's full profile excluding `hashed_password`.

### 4.2 Update Profile

**Endpoint:** `PATCH /users/me`

**Pydantic schema — `UpdateProfileRequest`:**
```python
class UpdateProfileRequest(BaseModel):
    full_name: str | None = None       # min 2, max 150 chars if provided
    username: str | None = None        # 3–50 chars, alphanumeric + underscores
    theme_preference: Literal['light', 'dark', 'system'] | None = None
```

**Behaviour:**
1. Only fields explicitly provided in the request body are updated (partial update).
2. If `username` is changed, re-validate uniqueness.
3. Write `user.profile_updated` to `AuditLog`.
4. Return `200 OK` with updated profile.

### 4.3 Change Password

**Endpoint:** `POST /users/me/change-password`

**Pydantic schema — `ChangePasswordRequest`:**
```python
class ChangePasswordRequest(BaseModel):
    current_password: str
    new_password: str     # same rules as registration
```

**Behaviour:**
1. Verify `current_password` against stored hash.
2. Hash and persist `new_password`.
3. Revoke all existing refresh tokens for this user (force re-login on all devices).
4. Write `user.password_changed` to `AuditLog`.
5. Return `200 OK`.

### 4.4 Upload Profile Picture

**Endpoint:** `POST /users/me/avatar`

**Constraints (constitution — security):**
- Accepted MIME types: `image/jpeg`, `image/png`, `image/webp` only.
- Maximum file size: 2 MB.
- File is validated before storage — rejected files return `422 Unprocessable Entity`.
- Stored path / URL is persisted to `User.profile_picture_url`.

---

## 5. Frontend — Auth UI

### 5.1 Entry Page Layout

- A single `/auth` route hosts both Login and Signup views.
- A **sliding panel** Framer Motion transition switches between the two — the panel slides left to reveal Signup, right to reveal Login.
- `prefers-reduced-motion`: the slide becomes an instant opacity cross-fade.

### 5.2 Input Animations

- Each input field has a Framer Motion `border-color` transition on `:focus` — border transitions from `#1E293B` border variant to `#14B8A6` over 200ms.
- Error states animate in with a subtle `x` shake (3px, 2 cycles, 150ms total).
- Reduced-motion: shake is replaced by a static red border.

### 5.3 Background Effect

- Lightweight CSS-only particle effect (SVG `<circle>` elements, no canvas, no JS particle library) for the auth page background. Must not exceed 5ms paint time.

### 5.4 Dashboard — Profile Page

- Accessible at `/dashboard/profile`.
- Fields rendered as inline-editable inputs — not a traditional form. Each field shows a pencil icon on hover; clicking enters edit mode for that field only.
- Profile picture upload via drag-and-drop zone with a fallback click-to-upload button.
- Theme toggle (`light` / `dark` / `system`) rendered as a three-way segmented control with a smooth sliding indicator.
- All updates fire `PATCH /users/me` immediately on confirmation; a success toast confirms the save.

---

## 6. Module Responsibilities

| Module | Responsibility |
|---|---|
| `backend/routers/auth.py` | Route handlers only — delegate to `AuthService` |
| `backend/services/auth/` | Token issuance, rotation, bcrypt logic, profile update orchestration |
| `backend/repositories/user_repository.py` | All `User` and `RefreshToken` DB queries |
| `backend/repositories/audit_repository.py` | All `AuditLog` writes |
| `backend/models/user.py` | `User`, `RefreshToken`, `AuditLog` SQLModel definitions |
| `backend/schemas/auth.py` | `RegisterRequest`, `LoginRequest`, `ChangePasswordRequest`, token response schemas |
| `frontend/components/auth/` | `LoginPanel`, `SignupPanel`, `AuthPageLayout` |
| `frontend/components/dashboard/` | `ProfileEditor`, `AvatarUpload`, `ThemeToggle` |

---

## 7. Acceptance Criteria

- [ ] A new user can register, receive tokens, and immediately access `GET /users/me`.
- [ ] An invalid password returns `401` with a generic message — no field-level distinction.
- [ ] Refresh token rotation revokes the old token; replaying the old token returns `401`.
- [ ] Profile picture upload rejects files over 2 MB and non-image MIME types with `422`.
- [ ] All state-changing operations produce an `AuditLog` row — verified in integration tests.
- [ ] Auth UI sliding panel transition runs at ≥ 60fps on a mid-range mobile device.
- [ ] `prefers-reduced-motion` is respected — verified via manual test and unit test on animation config.
- [ ] Dark/Light/System theme toggle persists to backend and is reflected on next session load.
