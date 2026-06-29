# Spec 03 — ATS Intelligence Engine, SEO Strategy & UI System

> **Constitution alignment:** Module Boundaries (`ats/`, `keywords/`) · SEO & Accessibility Standards · Form & Validation Standards · Code Quality Standards (TDD, 80% coverage on business logic)

---

## 1. Overview

This spec defines the three layers that differentiate the ATS Resume Builder from a generic PDF maker: the **ATS Parseability Score** (the intelligence that reads the resume like a real scanner), the **Job Description Keyword Matcher** (the assistant that closes the gap between a resume and a job posting), and the **UI System** (the design token system, Dark/Light theming, animation contracts, and SEO infrastructure that make the product coherent and discoverable). These modules are independently testable and must pass their own test suites before being wired into the broader application.

---

## 2. ATS Parseability Score Module

### 2.1 Module Location

`backend/services/ats/`

This module is a standalone, pure-function service. It takes a structured resume data object as input and returns a score with a detailed breakdown. It has zero knowledge of HTTP — it is tested without FastAPI.

### 2.2 Scoring Model

The score is computed out of **100 points** across six weighted dimensions:

| Dimension | Weight | What Is Evaluated |
|---|---|---|
| **Section Structure** | 25 pts | Presence and correct labeling of required sections: Summary, Work Experience, Education, Skills. Each missing mandatory section deducts proportionally. |
| **Heading Parseability** | 20 pts | Section headings match ATS-standard labels exactly or via fuzzy match (≥ 85% similarity). Non-standard headings (e.g., "My Journey" instead of "Work Experience") score 0 for that heading. |
| **Date Format Compliance** | 15 pts | All date values match `Month YYYY` pattern. Ambiguous or missing dates deduct proportionally across all experience and education entries. |
| **Contact Field Completeness** | 15 pts | Presence of: name, email, phone, location. Each field is worth equal weight within the dimension. |
| **Keyword Density** | 15 pts | Raw keyword count across skills, experience descriptions, and certifications. Evaluated against a baseline vocabulary of 300 common ATS-indexed terms. Score scales with match count — capped at 15 pts. |
| **Layout Safety** | 10 pts | Inferred from `template_id`. Templates 1, 2, 3, 5 receive full 10 pts. Template 4 receives 8 pts (two-column penalty). Any unknown or unregistered `template_id` receives 0 pts. |

**Final score = sum of all dimension scores, clamped to [0, 100].**

### 2.3 Score Response Schema

```python
class ATSScoreResult(BaseModel):
    total_score: int                          # 0–100
    grade: Literal['A', 'B', 'C', 'D', 'F'] # A: 90+, B: 75+, C: 60+, D: 45+, F: <45
    breakdown: dict[str, DimensionScore]
    improvement_hints: list[str]              # max 5 actionable strings

class DimensionScore(BaseModel):
    score: int
    max_score: int
    label: str
    hint: str | None                          # populated only when score < max
```

### 2.4 Endpoint

**`POST /resumes/{id}/ats-score`**

**Auth:** Bearer token required. Resume must belong to the authenticated user.

**Behaviour:**
1. Fetch `Resume.form_data` via `ResumeRepository`.
2. Pass to `ats_service.compute_score(form_data, template_id)`.
3. Persist the `total_score` to `Resume.ats_score`.
4. Write `resume.ats_scored` to `AuditLog`.
5. Return `ATSScoreResult`.

**Performance constraint:** The scoring computation must complete in under **200ms** for any valid form_data payload. If it exceeds this, the implementation is flagged as a `[CONSTITUTION VIOLATION]` (function complexity — extract helpers).

### 2.5 Frontend — Score Display

- Accessible from the dashboard resume card and from Step 8 of the builder.
- Displayed as a circular progress ring (SVG, not canvas) with the score number at the centre.
- Ring color:
  - Grade A: `#14B8A6` (Teal)
  - Grade B: `#22C55E` (Green)
  - Grade C: `#EAB308` (Yellow)
  - Grade D / F: `#EF4444` (Red)
- Below the ring: the dimension breakdown rendered as a horizontal bar chart (one bar per dimension, labeled with score/max).
- Below the chart: up to 5 `improvement_hints` rendered as a checklist — users can tick off hints as they act on them (client-side only, no persistence).
- The score panel is hidden until the user explicitly clicks "Check ATS Score" — it is never computed or displayed automatically on form save.

---

## 3. Job Description Keyword Matcher Module

### 3.1 Module Location

`backend/services/keywords/`

Standalone service. Input: raw job description text + resume `form_data`. Output: matched keywords, missing keywords, and a match percentage. Zero HTTP knowledge.

### 3.2 Algorithm

```
1. Tokenize job description → extract noun phrases and skill tokens
2. Normalize tokens (lowercase, strip punctuation, deduplicate)
3. Filter against a stop-word list (remove "and", "the", "a", etc.)
4. Extract keyword set from resume form_data:
   - skills tags
   - certifications.skills_acquired tags
   - projects.used_skills tags
   - experience.description text (tokenized)
5. Compute intersection: matched_keywords = jd_keywords ∩ resume_keywords
6. Compute gap: missing_keywords = jd_keywords − resume_keywords
7. match_percentage = len(matched_keywords) / len(jd_keywords) * 100
```

### 3.3 Response Schema

```python
class KeywordMatchResult(BaseModel):
    match_percentage: float                  # 0.0–100.0, rounded to 1 decimal
    matched_keywords: list[str]              # sorted alphabetically
    missing_keywords: list[str]              # sorted by frequency in JD (most frequent first)
    total_jd_keywords: int
    total_matched: int
```

### 3.4 Endpoint

**`POST /resumes/{id}/keyword-match`**

**Request body:**
```python
class KeywordMatchRequest(BaseModel):
    job_description: str    # min 50 chars, max 5000 chars
```

**Auth:** Bearer token required. Resume must belong to the authenticated user.

**Behaviour:**
1. Validate `job_description` length.
2. Fetch `Resume.form_data` via `ResumeRepository`.
3. Pass both to `keyword_service.match(job_description, form_data)`.
4. Return `KeywordMatchResult` — result is **not** persisted (stateless operation).
5. Write `resume.keyword_matched` to `AuditLog` (metadata only — job description text is never logged).

### 3.5 Frontend — Keyword Matcher UI

- Accessible via a "Match Job Description" panel in the builder sidebar (Step 8) and on the dashboard resume detail view.
- The panel contains:
  - A `<textarea>` labeled "Paste Job Description" with a 5000-character counter.
  - A "Analyse" button that triggers `POST /resumes/{id}/keyword-match`.
  - While loading: a Lottie animation (scan/search theme, ≤ 30KB file size) plays in place of the results.
  - Results display:
    - Match percentage shown as a large number with a teal accent (e.g., `72%`).
    - **Matched Keywords:** green chip list.
    - **Missing Keywords:** red chip list — each chip has a `+` icon. Clicking `+` adds the keyword to the Skills tag-input field in the global form store and triggers auto-save.
- `prefers-reduced-motion`: Lottie animation is replaced by a static skeleton loader.

---

## 4. UI System

### 4.1 Design Token Definitions

All tokens are defined in `frontend/lib/theme/tokens.css` as CSS custom properties. No component file may define a color value directly.

```css
/* Light Theme */
:root[data-theme="light"] {
  --color-bg-primary:       #FFFFFF;
  --color-bg-secondary:     #F1F5F9;
  --color-bg-surface:       #E2E8F0;
  --color-text-primary:     #1E293B;
  --color-text-secondary:   #475569;
  --color-text-muted:       #94A3B8;
  --color-accent:           #14B8A6;
  --color-accent-hover:     #0D9488;
  --color-border:           #CBD5E1;
  --color-error:            #EF4444;
  --color-success:          #22C55E;
  --color-warning:          #EAB308;
}

/* Dark Theme */
:root[data-theme="dark"] {
  --color-bg-primary:       #0F172A;
  --color-bg-secondary:     #1E293B;
  --color-bg-surface:       #334155;
  --color-text-primary:     #F1F5F9;
  --color-text-secondary:   #CBD5E1;
  --color-text-muted:       #64748B;
  --color-accent:           #14B8A6;
  --color-accent-hover:     #2DD4BF;
  --color-border:           #475569;
  --color-error:            #FCA5A5;
  --color-success:          #86EFAC;
  --color-warning:          #FDE68A;
}
```

### 4.2 Typography Scale

Defined in `frontend/lib/theme/typography.css`.

| Token | Value | Usage |
|---|---|---|
| `--font-display` | `'Inter', system-ui, sans-serif` | Headings h1–h3 |
| `--font-body` | `'Inter', system-ui, sans-serif` | Body text, labels |
| `--font-mono` | `'JetBrains Mono', monospace` | Code, certificate IDs |
| `--text-xs` | `0.75rem / 1rem` | Captions, helper text |
| `--text-sm` | `0.875rem / 1.25rem` | Input labels |
| `--text-base` | `1rem / 1.5rem` | Body |
| `--text-lg` | `1.125rem / 1.75rem` | Section subheadings |
| `--text-xl` | `1.25rem / 1.75rem` | Card titles |
| `--text-2xl` | `1.5rem / 2rem` | Page headings |
| `--text-4xl` | `2.25rem / 2.5rem` | Hero / score display |

### 4.3 Theme Switching

- Theme is stored in `User.theme_preference` on the backend and in `localStorage` as a fallback for unauthenticated users.
- On page load, `data-theme` is set on `<html>` before first paint to prevent flash of unstyled content (FOUC). This logic runs in a blocking `<script>` tag in `<head>` — the only permitted inline script in the project.
- `system` preference reads `prefers-color-scheme` media query and applies `light` or `dark` accordingly.
- Theme transitions use a CSS `transition` on `background-color` and `color` properties: `200ms ease`. This transition is suppressed when `prefers-reduced-motion: reduce` is active.

### 4.4 Animation Contracts

All Framer Motion animation configs are defined as named constants in `frontend/lib/theme/motion.ts`. No component may define raw animation values inline.

```typescript
export const TRANSITIONS = {
  formStep: {
    initial: { opacity: 0, x: 40 },
    animate: { opacity: 1, x: 0 },
    exit:    { opacity: 0, x: -40 },
    transition: { duration: 0.25, ease: 'easeInOut' },
  },
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    transition: { duration: 0.2 },
  },
  inputFocus: {
    // Applied via Framer Motion layout animations on border-color
    transition: { duration: 0.15 },
  },
  reducedMotion: {
    // Applied when prefers-reduced-motion: reduce is detected
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    transition: { duration: 0 },
  },
} as const;
```

All components must check `useReducedMotion()` from Framer Motion and swap to `TRANSITIONS.reducedMotion` when it returns `true`.

### 4.5 Lottie Animation Rules

- Maximum Lottie file size: **30KB** after compression.
- Lottie animations are used exclusively for: loading/scanning states, empty section states in the form, and the keyword matcher analysis state.
- Lottie is never used for page transitions or persistent decorative animation.
- All Lottie instances must be replaced by a static skeleton loader when `prefers-reduced-motion` is active.

---

## 5. SEO Infrastructure

### 5.1 Metadata — Per Route

Every route in the Next.js App Router exports a `generateMetadata` function. Static routes export `metadata` directly. No route is permitted to use a generic fallback title.

| Route | Title Template | Description |
|---|---|---|
| `/` | `ATS Resume Builder — Get Past the Bots` | Landing page — SEO-optimized hero copy |
| `/builder` | `Build Your Resume — ATS Resume Builder` | Builder entry |
| `/builder/{id}` | `Editing: {resume.title} — ATS Resume Builder` | Dynamic per resume |
| `/dashboard` | `Your Dashboard — ATS Resume Builder` | User dashboard |
| `/auth` | `Sign In or Sign Up — ATS Resume Builder` | Auth page |

All routes include:
- `<meta name="description">` — unique per route, 120–160 chars
- Open Graph: `og:title`, `og:description`, `og:url`, `og:type`
- Twitter Card: `twitter:card`, `twitter:title`, `twitter:description`

### 5.2 Semantic HTML Contracts

Every page must satisfy this structure — verified by automated HTML lint in CI:

```html
<html lang="en">
  <head>...</head>
  <body>
    <header>         <!-- Site nav, logo, theme toggle -->
      <nav>...</nav>
    </header>
    <main>           <!-- One <main> per page -->
      <h1>...</h1>   <!-- Exactly one h1 per page -->
      <article>      <!-- Primary page content block -->
        ...
      </article>
    </main>
    <footer>...</footer>
  </body>
</html>
```

No `<div>` may be used where a semantic element is appropriate. Violations are flagged in PR review and blocked from merge.

### 5.3 `sitemap.xml`

- Auto-generated by Next.js `sitemap.ts` at build time.
- Includes: `/`, `/auth`, all public-facing marketing routes.
- Excludes: `/builder/*`, `/dashboard/*` (authenticated routes — no indexing).
- `robots.txt` disallows crawling of `/builder/` and `/dashboard/`.

### 5.4 Core Web Vitals Targets

| Metric | Target |
|---|---|
| LCP (Largest Contentful Paint) | ≤ 2.5s |
| CLS (Cumulative Layout Shift) | ≤ 0.1 |
| INP (Interaction to Next Paint) | ≤ 200ms |

- All Framer Motion animations are `will-change: transform` — not `will-change: opacity` (avoids composite layer thrashing).
- Images use `next/image` with explicit `width` and `height` — no layout shift from images.
- Lottie animations are lazy-loaded below the fold.

---

## 6. Accessibility Requirements

- All form inputs have associated `<label>` elements — no `placeholder`-only labeling.
- Error messages are linked to inputs via `aria-describedby`.
- The ATS score ring SVG includes `role="img"` and `aria-label="ATS score: {score} out of 100"`.
- The keyword chip list uses `role="list"` and `role="listitem"`.
- The `+` add-to-skills button on missing keyword chips has `aria-label="Add {keyword} to skills"`.
- All keyboard focus states use the `--color-accent` token as the focus ring color — minimum 3px offset.
- Tab order follows visual reading order — no `tabindex` values above 0 are permitted.

---

## 7. Module Responsibilities

| Module | Responsibility |
|---|---|
| `backend/services/ats/score.py` | `compute_score()` — pure function, no I/O |
| `backend/services/ats/dimensions/` | One file per scoring dimension — each under 40 lines |
| `backend/services/keywords/matcher.py` | `match()` — pure function, no I/O |
| `backend/routers/intelligence.py` | `/ats-score` and `/keyword-match` route handlers |
| `frontend/lib/theme/tokens.css` | All CSS custom property definitions |
| `frontend/lib/theme/motion.ts` | All Framer Motion animation constant definitions |
| `frontend/components/ats/ScoreRing.tsx` | SVG score ring with grade color logic |
| `frontend/components/ats/DimensionChart.tsx` | Horizontal bar chart for score breakdown |
| `frontend/components/keywords/KeywordPanel.tsx` | Keyword matcher UI, textarea, chip lists |

---

## 8. Acceptance Criteria

- [ ] `compute_score()` is tested with 100% coverage — every dimension has at least one passing and one failing test case.
- [ ] ATS score computation completes in under 200ms for the largest valid `form_data` payload — verified by benchmark test.
- [ ] `match()` correctly returns `missing_keywords` sorted by frequency — verified by unit test with a known JD and resume fixture.
- [ ] Clicking `+` on a missing keyword chip adds the keyword to the Skills store and triggers auto-save — verified by Playwright E2E test.
- [ ] Job description text is never written to `AuditLog` — verified by integration test inspecting the audit row.
- [ ] All CSS color values in component files are CSS variable references — verified by automated CSS lint rule in CI.
- [ ] `prefers-reduced-motion` replaces all Framer Motion transitions with zero-duration fades — verified by unit test on the motion config selector.
- [ ] The `<h1>` uniqueness rule (exactly one per page) is enforced by an automated HTML lint check that runs in CI.
- [ ] LCP ≤ 2.5s on the landing page — verified by Lighthouse CI in the deployment pipeline.
- [ ] Dark and Light themes both pass WCAG AA contrast ratio checks — verified by automated axe-core scan in CI.
