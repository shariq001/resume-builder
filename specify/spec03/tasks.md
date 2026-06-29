# Tasks — Spec 03

## ATS Intelligence Engine
- [x] **Task 1: ATS Dimensions**
  - Create `backend/services/ats/dimensions/` with modules for the 6 dimensions (Section Structure, Heading Parseability, Date Format, Contact, Keyword Density, Layout Safety). Each < 40 lines.
- [x] **Task 2: ATS Score Computation**
  - Create `backend/services/ats/score.py` integrating the dimensions into `compute_score()`.
- [x] **Task 3: Tests for ATS Score**
  - Write 100% coverage tests for `compute_score()` and dimensions in `backend/tests/test_ats_score.py`.

## Job Description Keyword Matcher
- [x] **Task 4: Keyword Matcher Algorithm**
  - Create `backend/services/keywords/matcher.py` implementing the intersection algorithm, returning matches, missing keywords (by frequency), and score.
- [x] **Task 5: Intelligence Routers**
  - Implement `backend/routers/intelligence.py` with `POST /resumes/{id}/ats-score` and `POST /resumes/{id}/keyword-match`. Register in `main.py`.
- [x] **Task 6: Tests for Keyword Matcher**
  - Write tests for `match()` in `backend/tests/test_keyword_matcher.py`.

## UI System & SEO
- [x] **Task 7: Design Tokens**
  - Create `frontend/lib/theme/tokens.css` and `frontend/lib/theme/typography.css` with CSS variables.
- [x] **Task 8: Motion & Theme Config**
  - Create `frontend/lib/theme/motion.ts` with `TRANSITIONS` object. Implement basic theme loading script if needed.
- [x] **Task 9: ATS UI Components**
  - Build `ScoreRing.tsx` (SVG) and `DimensionChart.tsx` in `frontend/components/ats/`.
- [x] **Task 10: Keyword Matcher UI**
  - Build `KeywordPanel.tsx` in `frontend/components/keywords/` with chip lists and "+" button logic.
- [x] **Task 11: SEO Metadata & Layout**
  - Add `generateMetadata` to routes. Ensure semantic tags (`<main>`, single `<h1>`). Create `sitemap.ts` and `robots.txt`.
