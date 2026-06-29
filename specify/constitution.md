# Project Constitution — ATS Resume Builder

## Architecture Principles

- Every feature begins as a standalone module before integration into the application
- Modules communicate through explicit interfaces — no cross-module internal imports
- All async operations use consistent error handling: Result types, never raw throws
- Database access through the repository layer only — no direct queries in services or routers
- Frontend components are self-contained: each form section (Experience, Education, Certifications, Projects) is an isolated React component with its own local state before syncing to the global form store
- Backend PDF generation and ATS scoring logic live in dedicated service modules — never inlined into route handlers
- Job Keyword Matcher and ATS Parseability Score are separate, independently testable service modules

## Technology Constraints

### Backend

- Language: Python 3.12 with strict type checking enabled (`mypy --strict`)
- Framework: FastAPI for all API surfaces
- ORM: SQLModel paired with Neon Serverless PostgreSQL — no raw SQL except in migrations
- Auth: Better Auth with JWT and refresh token rotation — no sessions, no cookies
- PDF Generation: Dedicated service module (e.g., WeasyPrint or ReportLab) — PDF logic never leaks into route handlers
- File Storage: Resume files associated to user via unique user ID in the database — no anonymous file storage

### Frontend

- Framework: Next.js (App Router) with TypeScript — strict mode enabled
- Animations: Framer Motion only — no mixing with other animation libraries
- Styling: Tailwind CSS — no inline styles except for Framer Motion dynamic values
- State Management: A single global form store (e.g., Zustand or React Context) for multi-step form data
- Theme: CSS variables for Dark/Light mode — no hardcoded color values in component files

### Design Tokens (Enforced)

- Primary Background / Text: `#1E293B` (Deep Slate Blue)
- Primary Interactive (Buttons, Accents): `#14B8A6` (Vibrant Teal)
- All color variables defined once in the global theme file — no redefinition at component level

## Code Quality Standards

- No function or component longer than 40 lines — extract helpers or sub-components rather than extending
- All public functions, classes, and API route handlers have docstrings or JSDoc comments
- Type hints on every Python parameter and return value — no `Any` types
- TypeScript `strict` mode enforced — no `any` types, no implicit returns
- Minimum 80% test coverage on business logic (ATS scoring, keyword matching, PDF generation); 100% on utility functions
- Tests written before implementation (TDD) — the test file is the first commit for every new module
- All form fields marked mandatory (`*`) in the spec must have both client-side and server-side validation

## Form & Validation Standards

- Every mandatory field defined in the spec must be enforced at three levels: UI indicator (`*`), client-side real-time validation, and Pydantic model validation on the API boundary
- Tag-input fields (Skills Acquired in Certifications, Used Skills in Projects) must validate that at least one tag is present before form submission
- URL fields (Certificate URL, Live View Link, GitHub Link) must use regex validation for `http://` or `https://` format on both client and server
- Date fields (Experience Start/End) must use Month/Year format — no free-text date inputs
- The "Currently Working Here" checkbox must dynamically suppress and clear the End Date field value in state — not just hide it visually
- ATS Template Engine must enforce: single-column or parse-safe two-column layout, standard section headings, no embedded graphics or text boxes in generated PDFs

## Security Requirements

- No secrets, tokens, or credentials in code or committed files — environment variables only, loaded via `.env` files excluded from version control
- Input validation at every API boundary using Pydantic models — no raw dict access in route handlers
- All state-changing operations (create, update, delete resume; profile updates) write to the audit log
- Never log request bodies — only request metadata (method, path, user ID, timestamp)
- User data is strictly isolated — all database queries must be scoped to the authenticated user's ID; no cross-user data access is permissible
- Profile picture uploads must be validated for MIME type and file size before storage

## SEO & Accessibility Standards

- Every Next.js route must export dynamic metadata: `title`, `description`, and Open Graph tags
- Semantic HTML is mandatory: `<header>`, `<main>`, `<article>`, and logical heading hierarchy (`<h1>` → `<h6>`) on every page
- `sitemap.xml` must be auto-generated and kept up to date
- All interactive elements must have visible keyboard focus states
- Color contrast ratios must meet WCAG AA minimum for both Light and Dark themes
- `prefers-reduced-motion` media query must be respected — all Framer Motion animations must have a reduced-motion fallback

## Module Boundaries

```
frontend/
  components/
    form/           ← Isolated form section components (Experience, Education, Certifications, Projects)
    preview/        ← Live resume preview renderer
    auth/           ← Login / Signup UI with Framer Motion transitions
    dashboard/      ← Profile management, version history
  lib/
    store/          ← Global form state
    theme/          ← CSS variable definitions for Dark/Light mode

backend/
  routers/          ← FastAPI route handlers (thin — delegate to services)
  services/
    resume/         ← Resume CRUD, versioning, auto-save logic
    pdf/            ← PDF generation service
    ats/            ← ATS Parseability Score module
    keywords/       ← Job Description Keyword Matcher module
    auth/           ← Better Auth integration, token management
  repositories/     ← All database access (SQLModel queries)
  models/           ← SQLModel table definitions
  schemas/          ← Pydantic request/response schemas
  core/
    config/         ← Environment variable loading
    audit/          ← Audit log writer
```

No cross-boundary imports are permitted — a router may only import from `services`; a service may only import from `repositories` and `schemas`; a repository may only import from `models`.

## Workflow Rules

- When a spec is ambiguous, ask one clarifying question before proceeding — never assume and proceed silently
- Propose three implementation options for all architectural decisions, then wait for selection before writing code
- Commit after each completed task using the format: `type(scope): description`
  - Examples: `feat(certifications): add tag-input with real-time validation`, `fix(ats-score): correct heading parser for two-column layouts`
- When a pattern violation against this constitution is identified, flag it explicitly with the label `[CONSTITUTION VIOLATION]` before proposing a fix
- ATS compliance of any new resume template must be verified against the ATS Parseability Score module before the template is merged
- Dark/Light mode must be tested on every new UI component before the component is considered complete
