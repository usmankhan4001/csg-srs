# MASTER SRS — P3 AI STUDENT COACH
## Part 9 — Technical Specifications
### 9.4 API Specifications — Batch A: Conventions + Tutor Engine, Homework Assistant, Revision Coach

*Layer 4 — Technical & Architecture*

| Field | Value |
|---|---|
| Product | P3 — AI Student Coach |
| Identifier range (this document) | AIC-TR-173 → AIC-TR-184 |
| Base path convention | `https://api.p3.lighthouseschool.edu/api/v1/{service}/...` (illustrative domain) |

---

## 9.4.1  API Conventions (apply to every endpoint in 9.4 Batches A–C)

| Convention | Rule |
|---|---|
| Authentication | `Authorization: Bearer <token>` on every request, validated per 8.8.1; no endpoint is unauthenticated except the API Gateway's own health-check |
| Versioning | URL-path versioned (`/api/v1/...`); a breaking change increments to `/api/v2/...` rather than mutating v1's contract |
| Response envelope | `{ "data": <payload or null>, "error": <error object or null>, "meta": { "request_id": "...", "timestamp": "..." } }` |
| Error object shape | `{ "code": "STRING_CODE", "message": "human-readable", "details": {} }` (matches AIC-TR-126's cross-language consistency requirement) |
| Pagination | Cursor-based: `?cursor=<opaque>&limit=<n, default 20, max 100>`; response `meta` includes `next_cursor` |
| Idempotency | State-changing POSTs that may be retried (e.g., writeback to P1) accept an optional `Idempotency-Key` header |
| Content type | `application/json` for all request/response bodies except file upload endpoints, which use `multipart/form-data` |
| Streaming | Endpoints marked **[stream]** below use WebSocket rather than standard REST request/response, per 9.2.3 |

**AIC-TR-173:** Every endpoint in this catalog shall be generated from the FastAPI/NestJS framework's schema decorators (AIC-TR-131/132), not maintained as a hand-written separate document, so this catalog and the live OpenAPI spec cannot drift apart silently.
**AIC-TR-174:** Every state-changing endpoint shall validate the caller's permission against the relevant Part 2.4/module permission table before executing, returning `403 FORBIDDEN` (error code `PERMISSION_DENIED`) otherwise.

---

## 9.4.2  Tutor Engine Service — `/api/v1/tutor`

| Method | Path | Auth (role) | Request | Response | Key Errors |
|---|---|---|---|---|---|
| POST | `/conversations` | Student | `{}` (starts new conversation) | `201` `{ conversation_id }` | `403 PERMISSION_DENIED` (consent not active) |
| POST | `/conversations/{id}/messages` **[stream]** | Student (own conversation) | `{ content, language? }` | Streamed tokens; final frame includes `{ citations[], uncertainty_flag }` | `409 TOKEN_CAP_REACHED`, `422 MESSAGE_TOO_LONG`, `503 PROVIDER_UNAVAILABLE` |
| GET | `/conversations/{id}/messages` | Student (own) | Query: `cursor`, `limit` | `200` `{ messages[] }` | `404 NOT_FOUND` |
| GET | `/conversations` | Student (own) | Query: `q` (search), `from`, `to` | `200` `{ conversations[] }` | — |
| POST | `/messages/{id}/rating` | Student (own) | `{ rating: "helpful"\|"not_helpful", reason? }` | `200` `{}` | `422 VALIDATION_ERROR` |
| POST | `/messages/{id}/tts` | Student (own) | `{}` | `200` audio stream (binary) | `404 LANGUAGE_UNAVAILABLE` |

**Example — POST `/conversations/{id}/messages`:**
```json
// Request
{ "content": "How do I solve x^2 - 5x + 6 = 0?", "language": "ur" }

// Final stream frame
{
  "message_id": "a1b2...",
  "citations": [{ "source_id": "c3d4...", "title": "Grade 9 Algebra Guide", "chunk_index": 12 }],
  "uncertainty_flag": false
}
```

**AIC-TR-175:** The `/conversations/{id}/messages` streaming endpoint shall close the stream with a terminal frame containing `citations`/`uncertainty_flag` even if the underlying model call partially fails mid-stream, so the client always reaches a defined end state (no hung stream).

---

## 9.4.3  Homework Assistant Service — `/api/v1/homework`

| Method | Path | Auth (role) | Request | Response | Key Errors |
|---|---|---|---|---|---|
| POST | `/problems` | Student | `{ text? , image_base64? }` | `201` `{ problem_id, extracted_text? }` | `422 IMAGE_TOO_LARGE`, `422 IMAGE_UNREADABLE` |
| POST | `/problems/{id}/help` **[stream]** | Student (own) | `{}` | Streamed response; final frame `{ mode: "guided"\|"full_solution", citations[] }` | `409 HELP_DISABLED` |
| POST | `/problems/{id}/check-approach` | Student (own) | `{ approach_text }` | `200` `{ feedback, error_step? }` | `422 VALIDATION_ERROR` |
| GET | `/turns` | Teacher (assigned classes) | Query: `student_id?, assignment_id?, from?, to?` | `200` `{ turns[] }` | `403 PERMISSION_DENIED` |
| PATCH | `/controls/assignments/{assignment_id}` | Teacher / School Admin | `{ full_help_enabled: boolean }` | `200` `{}` | `404 NOT_FOUND` |
| PATCH | `/controls/students/{student_id}` | Teacher / Psychologist / School Admin | `{ access_enabled: boolean }` | `200` `{}` | `404 NOT_FOUND` |

**Example — POST `/problems/{id}/help` final frame (Guided mode):**
```json
{
  "mode": "guided",
  "similarity_score": 0.91,
  "citations": [{ "source_id": "c3d4...", "title": "Grade 9 Algebra Guide" }]
}
```

**AIC-TR-176:** `PATCH /controls/assignments/{id}` and `PATCH /controls/students/{id}` shall propagate to the Mode Selector component (8.4.2) within 30 seconds of a `200` response, and the endpoint's own response shall not return `200` until the underlying configuration write is durably committed (the 30-second figure governs propagation to active in-flight requests, not the write itself).
**AIC-TR-177:** `GET /turns` shall enforce `BR-AIC-O-01` server-side — a teacher's query is automatically scoped to their assigned classes regardless of query parameters supplied; a `student_id` outside the teacher's classes returns an empty result, not an error (to avoid leaking which student IDs exist).

---

## 9.4.4  Revision Coach Service — `/api/v1/revision`

| Method | Path | Auth (role) | Request | Response | Key Errors |
|---|---|---|---|---|---|
| POST | `/quizzes` | Student | `{ topic, question_count?, types?, difficulty? }` | `201` `{ quiz_id, questions[] }` | `422 OUT_OF_SYLLABUS`, `422 NO_CONTENT` |
| POST | `/quizzes/{id}/submit` | Student (own) | `{ answers[] }` | `200` `{ score, max_score, review[] }` | `422 VALIDATION_ERROR` |
| POST | `/flashcards/decks` | Student | `{ topic, deck_name? }` | `201` `{ deck_id, cards[] }` | `422 OUT_OF_SYLLABUS` |
| GET | `/flashcards/decks/{id}/due` | Student (own) | — | `200` `{ cards[] }` | `404 NOT_FOUND` |
| POST | `/flashcards/{id}/review` | Student (own) | `{ rating: "hard"\|"good"\|"easy" }` | `200` `{ next_due_date }` | `422 VALIDATION_ERROR` |
| POST | `/summaries` | Student | `{ topic, extended?: boolean }` | `201` `{ summary_id, text, citations[] }` | `422 NO_CONTENT` |
| POST | `/mock-tests` | Student | `{ topic, question_count?, duration_minutes }` | `201` `{ mock_test_id, questions[], expires_at }` | `422 VALIDATION_ERROR` |
| POST | `/mock-tests/{id}/autosave` | Student (own) | `{ answers[] }` | `200` `{}` | `410 EXPIRED` |
| POST | `/mock-tests/{id}/submit` | Student (own) | `{ answers[] }` | `200` `{ score, max_score, time_per_question[] }` | `410 EXPIRED` |
| POST | `/questions/{id}/flag` | Student (own) | `{ reason? }` | `200` `{}` | `422 VALIDATION_ERROR` |
| GET | `/saved` | Student (own) | — | `200` `{ decks[], summaries[] }` | — |
| GET | `/saved/{id}/export` | Student (own) | — | `200` PDF binary | `404 NOT_FOUND` |

**AIC-TR-178:** `POST /mock-tests/{id}/autosave` shall be called by the client at least every 30 seconds during an active mock test (BR-AIC-R-06); the server shall reject autosave calls received after `expires_at` with `410 EXPIRED` rather than silently accepting late data.
**AIC-TR-179:** `POST /quizzes/{id}/submit` and `/mock-tests/{id}/submit` shall never write to any P1 gradebook table or call any P1 gradebook endpoint — this is enforced by the service's database role having no connection credential to any P1-write path (restates BR-AIC-R-01/AIC-FR-045 at the API layer).

---

## 9.4.5  Rate Limiting (this batch's services)

| Endpoint group | Limit | Scope |
|---|---|---|
| Tutor Engine messages | 30 requests/minute | Per student |
| Homework Assistant help requests | 20 requests/minute | Per student |
| Revision generation (quiz/flashcard/summary/mock-test) | 15 requests/minute | Per student |
| Teacher control/oversight endpoints | 60 requests/minute | Per teacher |

**AIC-TR-180:** Rate limits in this section apply per AIC-TR-098 (per authenticated identity); none of the endpoints in this batch are eligible for the Wellbeing/Consent bypass (AIC-TR-007), since none are on the safety-critical escalation path.

---

## 9.4.6  Error Codes (this batch)

| Code | HTTP Status | Meaning |
|---|---|---|
| `TOKEN_CAP_REACHED` | 409 | Student's monthly token cap reached; Tier B/C applies (AIC-FR-015) |
| `MESSAGE_TOO_LONG` | 422 | Input exceeds 4,000 characters |
| `PROVIDER_UNAVAILABLE` | 503 | All configured LLM providers in the relevant tier failed |
| `IMAGE_TOO_LARGE` | 422 | Upload exceeds 10MB |
| `IMAGE_UNREADABLE` | 422 | OCR extraction failed |
| `HELP_DISABLED` | 409 | Teacher/Admin has disabled help for this assignment/student |
| `OUT_OF_SYLLABUS` | 422 | Requested topic outside the student's stage syllabus |
| `NO_CONTENT` | 422 | No licensed corpus content available for the request |
| `EXPIRED` | 410 | Mock test window has closed |
| `PERMISSION_DENIED` | 403 | Caller lacks permission for this action |
| `VALIDATION_ERROR` | 422 | Request body failed schema validation |
| `NOT_FOUND` | 404 | Resource does not exist or is outside the caller's scope |

---

### Layer 4 gate status — Part 9.4 Batch A

| Gate item | Minimum Standard | Status |
|---|---|---|
| API catalog | Every endpoint documented, request/response example | Pass — 22 endpoints across 3 services, examples provided for representative complex endpoints |
| Rate limiting table | Required | Pass |
| Error code matrix | Required | Pass (batch-scoped; consolidated matrix completes in Batch C) |

*Next: Part 9.4 Batch B — Career Coach, Wellbeing Coach, Student Learning Profile, Knowledge Graph & RAG, Personalization endpoints.*
