# Spec 02 — Resume Builder: Form Engine, ATS Templates & PDF Generation

> **Constitution alignment:** Form & Validation Standards · Module Boundaries (`form/`, `preview/`, `pdf/`, `resume/`) · Architecture Principles (isolated components, service-layer PDF) · SEO & Accessibility Standards

---

## 1. Overview

This spec defines the complete resume construction surface: the multi-step smart form, all input modules (Contact, Summary, Experience, Education, Certifications, Projects, Skills), the five ATS-compliant templates, the live preview renderer, and the one-click PDF download pipeline. This is the product's core deliverable — every decision here is evaluated against ATS parseability first, then UX.

---

## 2. Database Schema

### 2.1 `Resume`

| Column | Type | Constraints |
|---|---|---|
| `id` | `UUID` | Primary key |
| `user_id` | `UUID` | Foreign key → `User.id`, cascade delete |
| `title` | `VARCHAR(100)` | Not null (user-defined label, e.g., "Senior Dev Resume v2") |
| `template_id` | `SMALLINT` | Not null, 1–5 |
| `form_data` | `JSONB` | Not null — serialized form state |
| `ats_score` | `SMALLINT` | Nullable, 0–100 |
| `pdf_url` | `TEXT` | Nullable — set after first successful PDF generation |
| `version` | `INTEGER` | Not null, default 1 — increments on each save |
| `last_auto_saved_at` | `TIMESTAMPTZ` | Nullable |
| `created_at` | `TIMESTAMPTZ` | Default: `now()` |
| `updated_at` | `TIMESTAMPTZ` | Auto-updated |

> One user may have multiple `Resume` rows. The `version` column tracks how many times a specific resume has been saved, not the number of resumes.

### 2.2 `ResumeSnapshot` (Version History)

| Column | Type | Constraints |
|---|---|---|
| `id` | `UUID` | Primary key |
| `resume_id` | `UUID` | Foreign key → `Resume.id`, cascade delete |
| `version` | `INTEGER` | Not null |
| `form_data` | `JSONB` | Not null — snapshot of `form_data` at time of save |
| `ats_score` | `SMALLINT` | Nullable |
| `created_at` | `TIMESTAMPTZ` | Default: `now()` |

---

## 3. Multi-Step Smart Form

### 3.1 Form Steps & Order

```
Step 1 → Contact Information
Step 2 → Professional Summary
Step 3 → Work Experience       (repeatable)
Step 4 → Education             (repeatable)
Step 5 → Certifications        (repeatable)
Step 6 → Projects              (repeatable)
Step 7 → Skills
Step 8 → Template Selection & Preview
```

### 3.2 Navigation Rules

- Users may move forward only if the current step passes client-side validation.
- Users may move backward freely — form state is preserved in the global store.
- A step progress indicator (non-clickable breadcrumb) shows completed, current, and upcoming steps.
- Step transitions use a **Framer Motion cross-fade + slide** (slide direction: left-to-right on advance, right-to-left on back).
- `prefers-reduced-motion`: transitions become instant opacity changes.

### 3.3 Auto-Save

- The global form store debounces writes to `PATCH /resumes/{id}` with a **3-second delay** after the last keystroke.
- A subtle "Saving…" → "Saved" indicator appears in the top-right corner of the builder.
- Auto-save fires `resume.auto_saved` to `AuditLog`.

---

## 4. Form Sections — Field Specifications

### 4.1 Contact Information

| Field | Mandatory | Validation |
|---|---|---|
| Full Name | ✅ | 2–100 chars |
| Job Title / Headline | ✅ | 2–100 chars |
| Email | ✅ | RFC-5322 email format |
| Phone Number | ✅ | E.164 format or local with country code |
| Location (City, Country) | ✅ | 2–100 chars |
| LinkedIn URL | ❌ | `https://linkedin.com/in/...` format if provided |
| Portfolio / Website URL | ❌ | `http://` or `https://` if provided |

### 4.2 Professional Summary

| Field | Mandatory | Validation |
|---|---|---|
| Summary Text | ✅ | 50–600 chars; live character counter shown |

### 4.3 Work Experience (Repeatable — max 10 entries)

| Field | Mandatory | Validation |
|---|---|---|
| Job Title / Role | ✅ | 2–100 chars |
| Organization Name | ✅ | 2–150 chars |
| Working Field | ✅ | Dropdown — predefined list (Technology, Finance, Healthcare, etc.) |
| Experience Type | ✅ | Dropdown — `Employee`, `Intern`, `Consultant`, `Freelancer`, `Volunteer` |
| Working Type | ✅ | Dropdown — `Full-time`, `Part-time`, `Remote`, `Hybrid`, `Contract` |
| Location | ✅ | 2–100 chars |
| Start Date | ✅ | Month/Year picker — no free-text input |
| Currently Working Here | — | Checkbox — when checked, hides and clears End Date |
| End Date | Conditional ✅ | Required when "Currently Working Here" is unchecked; Month/Year picker |
| Description / Bullets | ❌ | Free text — max 1000 chars; rendered as bullet points in template |

> **Constitution rule:** "Currently Working Here" must clear `end_date` from state when checked — not just hide the field visually.

### 4.4 Education (Repeatable — max 5 entries)

| Field | Mandatory | Validation |
|---|---|---|
| Degree / Qualification | ✅ | 2–100 chars |
| Institution Name | ✅ | 2–150 chars |
| Field of Study | ✅ | 2–100 chars |
| Start Date | ✅ | Month/Year picker |
| Currently Studying | — | Checkbox — hides and clears End Date |
| End Date | Conditional ✅ | Required when "Currently Studying" is unchecked |
| Grade / GPA | ❌ | Free text — max 20 chars |

### 4.5 Certifications (Repeatable — max 10 entries)

| Field | Mandatory | Validation |
|---|---|---|
| Certificate Name | ✅ | 2–150 chars |
| Provider Organization | ✅ | 2–150 chars |
| Skills Acquired | ✅ | Tag-input — minimum 1 tag required; Enter key adds a tag |
| Certificate ID | ❌ | Free text — max 100 chars |
| Certificate URL | ❌ | Must match `^https?://` if provided |

### 4.6 Projects (Repeatable — max 10 entries)

| Field | Mandatory | Validation |
|---|---|---|
| Project Name | ✅ | 2–100 chars |
| Project Working Field | ✅ | Dropdown — same predefined list as Working Field |
| Used Skills / Tech Stack | ✅ | Tag-input — minimum 1 tag required |
| Project Description | ❌ | Free text — max 800 chars |
| Live View / Demo Link | ❌ | Must match `^https?://` if provided |
| GitHub Repository Link | ❌ | Must match `^https?://github\.com/` if provided |

### 4.7 Skills

| Field | Mandatory | Validation |
|---|---|---|
| Skills | ✅ | Tag-input — minimum 3 tags required |

---

## 5. ATS Template Engine

### 5.1 Compliance Rules (All Templates)

The following constraints apply to **every** template. Any new template that violates these is blocked from merge (constitution — workflow rules, ATS score verification).

- Single-column layout **or** a parse-safe two-column layout where the main content column is always parsed first
- Standard ATS section headings: `Work Experience`, `Education`, `Skills`, `Certifications`, `Projects`, `Summary`
- Body font: system-safe serif or sans-serif only (`Arial`, `Calibri`, `Georgia`, `Times New Roman`, or equivalent web-safe font)
- No text in SVG elements, canvas, or images
- No multi-column text boxes that break reading order
- All dates in `Month YYYY` format (e.g., `January 2023`)
- No headers or footers containing critical resume content

### 5.2 Five Templates

| ID | Name | Layout | Distinguishing Characteristic |
|---|---|---|---|
| 1 | **Classic** | Single column | Traditional, high ATS compatibility; Georgia serif body |
| 2 | **Modern** | Single column | Clean sans-serif; teal `#14B8A6` section heading accents |
| 3 | **Executive** | Single column | Dense, information-rich; all-caps section headings |
| 4 | **Compact** | Parse-safe two-column (sidebar: contact + skills; main: experience + education) | Maximizes content density while maintaining parse order |
| 5 | **Minimal** | Single column | Generous whitespace; only name and section headings styled; zero graphic elements |

### 5.3 Template Selection UI

- Rendered on Step 8 as a horizontally scrollable card row.
- Each card shows a thumbnail preview (static SVG render) of the template.
- Selecting a template immediately updates the live preview panel.
- The selected card has a `#14B8A6` border ring.

---

## 6. Live Preview

- Rendered in a fixed right-panel (desktop) or as a toggleable bottom sheet (mobile).
- The preview is a pixel-accurate React render of the selected template populated with live form store data.
- Updates are debounced at **300ms** after the last form change to avoid excessive re-renders.
- A "Toggle Preview" button is always visible on mobile; on desktop the panel is always open.
- The preview is not interactive — it is read-only.

---

## 7. PDF Generation

### 7.1 Endpoint

**`POST /resumes/{id}/generate-pdf`**

**Auth:** Bearer token required. `resume.user_id` must match the authenticated user — `403 Forbidden` otherwise.

### 7.2 Service Contract (`backend/services/pdf/`)

```python
async def generate_pdf(resume_id: UUID, user_id: UUID) -> PDFGenerationResult:
    """
    Fetch the resume's form_data and template_id from the repository,
    render the selected ATS template to HTML, convert to PDF via the
    PDF engine, store the output, update Resume.pdf_url, and return
    the file path and download URL.
    """
```

**Rules:**
- The PDF must be text-selectable — no rasterized text.
- Font embedding is mandatory so the PDF renders identically across all operating systems.
- Page size: A4.
- Margins: minimum 12mm on all sides.
- PDF engine options: WeasyPrint (preferred) or ReportLab — selection is an architectural decision to be proposed with three options before implementation.
- The generated file is stored with the naming convention: `{user_id}/{resume_id}/v{version}.pdf`.
- `Resume.pdf_url` is updated after successful generation.
- `AuditLog` writes `resume.pdf_generated`.

### 7.3 Download Endpoint

**`GET /resumes/{id}/download`**

Returns a signed, time-limited download URL for the stored PDF. The URL expires after 15 minutes. The client uses this URL to trigger a browser download — the file is never streamed directly through the FastAPI server.

---

## 8. Resume CRUD API

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/resumes` | Create a new blank resume |
| `GET` | `/resumes` | List all resumes for the authenticated user |
| `GET` | `/resumes/{id}` | Get a single resume with full `form_data` |
| `PATCH` | `/resumes/{id}` | Partial update (auto-save target) |
| `DELETE` | `/resumes/{id}` | Delete resume and all snapshots |
| `GET` | `/resumes/{id}/snapshots` | List all version snapshots |
| `POST` | `/resumes/{id}/restore/{version}` | Restore a snapshot as the current form state |
| `POST` | `/resumes/{id}/generate-pdf` | Trigger PDF generation |
| `GET` | `/resumes/{id}/download` | Get signed PDF download URL |

All endpoints scope queries to `user_id` from the JWT — cross-user access returns `403`.

---

## 9. Frontend Route Map

| Route | Description |
|---|---|
| `/builder` | Redirects to `/builder/new` or last in-progress resume |
| `/builder/new` | Creates a new resume and enters Step 1 |
| `/builder/{id}` | Loads an existing resume into the form at its last step |
| `/builder/{id}/preview` | Full-screen preview mode (mobile primary) |
| `/dashboard/resumes` | Lists all user resumes with ATS score badges and download buttons |

---

## 10. Acceptance Criteria

- [ ] Every mandatory field (`*`) is blocked at both client (real-time) and server (Pydantic) levels.
- [ ] Tag-input fields reject submission with zero tags with an inline error message.
- [ ] "Currently Working Here" checkbox clears `end_date` from the global store, verified by unit test on the store reducer.
- [ ] Certificate URL and project URLs with invalid schemes are rejected with inline validation error before API call.
- [ ] Generated PDF is text-selectable — verified by programmatic text extraction in integration test.
- [ ] PDF page size is A4 with minimum 12mm margins — verified by metadata inspection in test.
- [ ] Template 4 (Compact) parses all content sections in correct reading order when fed to an ATS parser mock in tests.
- [ ] Live preview updates within 300ms of the last form keystroke — verified by Playwright performance test.
- [ ] Auto-save fires no earlier than 3 seconds after the last input event — verified by unit test on debounce logic.
- [ ] All five template thumbnails render without layout overflow at 280px card width.
- [ ] Dark/Light mode is tested on every form component and the live preview panel before merge.
