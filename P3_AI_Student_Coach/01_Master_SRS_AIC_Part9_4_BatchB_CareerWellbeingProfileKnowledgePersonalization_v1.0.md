# MASTER SRS — P3 AI STUDENT COACH
## Part 9 — Technical Specifications
### 9.4 API Specifications — Batch B: Career Coach, Wellbeing Coach, Student Learning Profile, Knowledge Graph & RAG, Personalization

*Layer 4 — Technical & Architecture*

| Field | Value |
|---|---|
| Product | P3 — AI Student Coach |
| Identifier range (this document) | AIC-TR-185 → AIC-TR-196 |
| Conventions | Per Part 9.4 Batch A, Section 9.4.1 — applies identically here |

---

## 9.4.7  Career Coach Service — `/api/v1/career`

| Method | Path | Auth (role) | Request | Response | Key Errors |
|---|---|---|---|---|---|
| GET | `/recommendations` | Student (own) / Parent (child, read) / Teacher (assigned, read) | — | `200` `{ careers[] }` (qualitative-only until Gap G11 resolved) | `404 NO_PSYCHOMETRICS` |
| GET | `/recommendations/{id}/explain` | Student (own) | — | `200` `{ factors[] }` | `404 NOT_FOUND` |
| GET | `/pathways` | Student (own) | Query: `career_id, region?` | `200` `{ subjects[], universities[] }` | `404 REGION_NOT_SUPPORTED` |
| POST | `/interest-exploration` **[stream]** | Student | `{}` (conversational, used when psychometrics absent) | Streamed response | — |
| GET | `/growth-tips` | Student (own) | — | `200` `{ tips[] }` | `404 NO_PSYCHOMETRICS` |
| POST | `/options/{id}/bookmark` | Student (own) | `{ bookmarked: boolean }` | `200` `{}` | `404 NOT_FOUND` |
| POST | `/reports` | Student (own) | `{}` | `201` `{ report_id }`, async PDF generation | `503 GENERATION_FAILED` |
| GET | `/reports/{id}` | Student (own) | — | `200` PDF binary or `202` (still generating) | `404 NOT_FOUND` |

**AIC-TR-185:** `GET /recommendations` shall never return a salary/outlook figure without an accompanying `source` field in the response payload; if the Career/University Dataset (Gap G11) is unresolved, the endpoint omits the figure entirely rather than returning a null/placeholder that a client could misrender as zero (restates BR-AIC-C-03 at the API contract level).
**AIC-TR-186:** `GET /recommendations` for a Parent or Teacher caller shall return the identical payload shape as the Student's own read, with no additional fields — there is no "extended" admin view of career data; the only difference is the caller's permission scope, not the data shape.

---

## 9.4.8  Wellbeing Coach Service — `/api/v1/wellbeing`

| Method | Path | Auth (role) | Request | Response | Key Errors |
|---|---|---|---|---|---|
| POST | `/checkins` | Student | `{ mood_score?, note? }` | `200` `{ checkin_id }`; **if risk detected, response includes `{ escalation_triggered: true }` and the client immediately renders SCR-WELL-002** | `422 VALIDATION_ERROR` |
| GET | `/cases` | Psychologist (assigned) / School Admin (read) | Query: `status?, level?` | `200` `{ cases[] }` (confidential fields included only for Psychologist role) | `403 PERMISSION_DENIED` |
| GET | `/cases/{id}` | Psychologist | — | `200` `{ ...case detail incl. confidential_notes }` | `403 PERMISSION_DENIED` (non-Psychologist) |
| PATCH | `/cases/{id}` | Psychologist | `{ status?, confidential_notes?, outcome? }` | `200` `{}` | `404 NOT_FOUND` |
| GET | `/cases/{id}/summary` | Teacher (assigned) / Parent (child) | — | `200` `{ level, status, summary_text }` (no confidential fields — separate summary view per 9.3.11) | `403 PERMISSION_DENIED` |
| PATCH | `/config/thresholds` | Psychologist + Super Admin (dual, pending-approval pattern) | `{ l1_threshold?, l2_sensitivity? }` | `202` `{ approval_status: "pending" }` | `403 PERMISSION_DENIED` |

**This service has no standard rate limit** (AIC-TR-007/098 bypass) — `/checkins` and any internally-triggered escalation path are exempt from the per-identity rate limit applied elsewhere, since a struggling student must never be throttled.

**AIC-TR-187:** `POST /checkins` shall never return a response indicating "all clear" by omission — the response explicitly states `escalation_triggered: false` rather than simply not including the field, so the client cannot misinterpret a missing field as either outcome.
**AIC-TR-188:** `GET /cases/{id}/summary` shall be served by a dedicated read path querying the `escalation_case_summary` view (9.3.11), architecturally incapable of returning `confidential_notes` regardless of any future endpoint code change, since the underlying view does not expose that column.
**AIC-TR-189:** `PATCH /config/thresholds` shall require both a Psychologist-initiated request and a Super Admin (or co-approving Psychologist, per the final approval-chain decision in Part 17) confirmation before `approval_status` transitions from `pending` to `approved`; the endpoint itself only ever returns `pending` on the initiating call (restates BR-AIC-A-04 at the API layer).

---

## 9.4.9  Student Learning Profile Service — `/api/v1/profile`

| Method | Path | Auth (role) | Request | Response | Key Errors |
|---|---|---|---|---|---|
| GET | `/me` | Student (own) | — | `200` `{ attributes[], preferences }` | — |
| PATCH | `/me/preferences` | Student (own) | `{ set_language?, explanation_style?, tts_enabled? }` | `200` `{}` | `422 VALIDATION_ERROR` |
| POST | `/me/attributes/{id}/correction` | Student (own) | `{ corrected_value }` | `201` `{ correction_id }` | `422 VALIDATION_ERROR` |
| GET | `/me/export` | Student (own) / School Admin (on data-rights request) | — | `200` JSON export | `403 PERMISSION_DENIED` |
| DELETE | `/me` | School Admin (on confirmed data-rights request only) | — | `202` `{ status: "scheduled" }` | `403 PERMISSION_DENIED` |
| GET | `/{student_id}` **[internal, service-to-service only]** | Other P3 services (scoped JWT) | Query: `fields?` (scope-limited) | `200` `{ ...scoped fields }` | `403 SCOPE_EXCEEDED` |

**AIC-TR-190:** The internal `GET /{student_id}` endpoint shall never be reachable from the public API Gateway path — it is registered only on the private Application Zone network (8.8.2) and accepts only service-to-service JWTs (AIC-TR-088), never a student/parent/teacher token.
**AIC-TR-191:** `DELETE /me` shall be a soft, scheduled deletion (`202 scheduled`), not an immediate hard delete, giving the standard retention/anonymization process (AIC-TR-058) the defined window to execute correctly rather than racing a synchronous delete against in-flight writes.

---

## 9.4.10  Knowledge Graph & RAG Service — `/api/v1/knowledge`

| Method | Path | Auth (role) | Request | Response | Key Errors |
|---|---|---|---|---|---|
| POST | `/retrieve` **[internal, service-to-service only]** | Other P3 services (scoped JWT) | `{ query, stage, subject, tenant_id, language }` | `200` `{ chunks[], groundedness_score }` or `{ uncertain: true }` | `403 SCOPE_EXCEEDED` |
| POST | `/content` | School Admin | `multipart/form-data` (file + metadata) | `201` `{ source_id, license_status: "pending" }` | `422 UNSUPPORTED_FORMAT`, `422 TOO_LARGE` |
| PATCH | `/content/{id}/license` | Super Admin | `{ status: "confirmed"\|"revoked" }` | `200` `{}` | `404 NOT_FOUND` |
| GET | `/content` | School Admin (own tenant) | Query: `status?` | `200` `{ sources[] }` | — |
| GET | `/graph/traverse` **[internal]** | Other P3 services (scoped JWT) | `{ node_id, relationship_type? }` | `200` `{ nodes[], edges[] }` | `403 SCOPE_EXCEEDED` |

**AIC-TR-192:** `POST /retrieve` shall be the **only** path by which any other P3 service obtains corpus-grounded content; no service shall query `content_chunk` directly via its own database connection, even though they share a PostgreSQL instance (8.6.3's "joins where both domains share the instance" efficiency note applies to read-only cross-domain joins within a service's own owned data, not to bypassing the Retrieval API's license/threshold logic).
**AIC-TR-193:** `POST /content` shall reject the upload outright (not merely flag it) if the safety-screening step (BR-AIC-K-05) detects disallowed content, returning `422 UNSAFE_CONTENT` rather than storing a quarantined-but-present row.

---

## 9.4.11  Personalization & Recommendation Service — `/api/v1/personalization`

| Method | Path | Auth (role) | Request | Response | Key Errors |
|---|---|---|---|---|---|
| GET | `/recommendations` | Student (own) / Teacher (assigned, read) | — | `200` `{ recommendations[] }` | — |
| POST | `/recommendations/{id}/feedback` | Student (own) | `{ action: "accept"\|"dismiss", reason? }` | `200` `{}` | `422 VALIDATION_ERROR` |
| POST | `/study-plans` | Student (own) | `{ horizon_days? }` | `201` `{ plan_id, items[] }` | `422 VALIDATION_ERROR` |
| GET | `/study-plans/{id}` | Student (own) | — | `200` `{ items[] }` | `404 NOT_FOUND` |
| PATCH | `/study-plans/{id}/items/{item_id}` | Student (own) | `{ status: "done"\|"skipped" }` | `200` `{}` | `404 NOT_FOUND` |

**AIC-TR-194:** `GET /recommendations` shall apply the Confidence Gate (8.4.2) server-side before response — a client never receives a below-threshold recommendation to filter itself; the cold-start stage-default fallback (AIC-FR-149) is likewise resolved server-side.
**AIC-TR-195:** `POST /study-plans` shall reject (`422 OUT_OF_SYLLABUS`) any resulting plan that would include a topic outside the student's current stage, even if the request itself does not specify topics directly (the service's own topic-selection logic is bound by the same constraint it would enforce on an explicit client-supplied topic).
**AIC-TR-196:** `POST /recommendations/{id}/feedback` with `action: "dismiss"` shall update `recommendation.status` and apply the cooldown (BR-AIC-N-06) atomically — a client retry of the same feedback call shall be idempotent (no double cooldown application) keyed on the recommendation ID.

---

### Layer 4 gate status — Part 9.4 Batch B

| Gate item | Minimum Standard | Status |
|---|---|---|
| API catalog | Every endpoint documented | Pass — 21 endpoints across 5 services |
| Internal vs. public endpoint distinction | Required for security review (8.8) | Pass — internal-only endpoints explicitly marked and gated to the Application Zone |

*Next: Part 9.4 Batch C — Teacher Oversight, Consent & Safety, Admin & Configuration, Notification endpoints + sequence diagrams for complex flows + consolidated rate-limiting and error-code matrix (closes 9.4).*
