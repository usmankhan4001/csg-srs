# APPENDIX C — API CATALOG
## P1 — Learning Management System + School Management System
### Complete endpoint reference — all 52 endpoints across 9 services

**Status:** ✅ Complete

*All endpoints are prefixed with their service base path. Authentication: every endpoint requires a valid JWT Bearer token in the Authorization header unless otherwise stated. Tenant isolation is enforced at the API gateway layer — a token issued by Tenant A cannot access Tenant B data regardless of endpoint. Full sequence diagrams for complex multi-service flows are deferred to the visual batch.*

---

## C.1 Global Error Code Matrix

These codes apply to every endpoint. Service-specific errors are listed in the endpoint's own Notable Errors column.

| HTTP Status | Error Code | Meaning |
|---|---|---|
| 400 | `VALIDATION_ERROR` | One or more request fields fail validation; `errors` array lists field + reason |
| 401 | `UNAUTHENTICATED` | No JWT token provided, or token is expired |
| 403 | `FORBIDDEN` | Valid token but the caller's role lacks permission for this action |
| 403 | `CROSS_TENANT_ACCESS` | The requested resource belongs to a different school tenant |
| 404 | `NOT_FOUND` | The requested resource does not exist |
| 409 | `CONFLICT` | The operation conflicts with existing data (duplicate, constraint violation) |
| 422 | `UNPROCESSABLE` | Request is syntactically valid but violates a business rule |
| 429 | `RATE_LIMITED` | Caller has exceeded the rate limit; `Retry-After` header indicates wait time |
| 500 | `INTERNAL_ERROR` | Unexpected server error; a correlation ID is returned for support reference |
| 503 | `SERVICE_UNAVAILABLE` | The downstream service is temporarily unavailable |

## C.2 Rate Limiting

| Tier | Limit | Applies To |
|---|---|---|
| Standard authenticated | 300 requests/minute per user token | All roles except Super Admin |
| Super Admin | 600 requests/minute | Super Admin token |
| Bulk operations | 10 requests/minute per school | `/users/bulk-import`, `/fees/invoices` bulk generate, `/payroll/runs` |
| AI generation | 20 requests/minute per school | `/exams/{id}/questions/generate` |
| Emergency broadcast | 5 requests/hour per school | `/communication/announcements/emergency-broadcast` |

---

## C.3 Learning Service — Base Path `/api/v1/learning`

| Method | Path | Auth (Role) | Description | FR Ref | Request Body / Key Params | Notable Errors |
|---|---|---|---|---|---|---|
| GET | `/live-classes` | All enrolled roles | Lists scheduled live classes for the caller's class/section. | LMS-FR-021 | — | — |
| POST | `/live-classes` | Teacher | Schedules a new live class including recurrence rules. | LMS-FR-021, 022 | `{title, scheduled_at, duration_minutes, platform, recurrence_rule}` | 409 `TEACHER_DOUBLE_BOOKED` if slot conflicts with teacher's timetable |
| POST | `/live-classes/{id}/start` | Teacher | Launches the session and generates meeting link and password. | LMS-FR-025 | — | — |
| GET | `/live-classes/{id}/recording` | Enrolled roles | Fetches the published recording with chapter markers and transcript URL. | LMS-FR-033, 034 | — | 404 if recording not yet published |
| GET | `/assignments` | Teacher (all own), Student (own) | Lists assignments for a class/section, status-filtered for students. | LMS-FR-041 | Query: `class_section_id, status` | — |
| POST | `/assignments` | Teacher | Creates a new assignment with rubric, deadline, and late-submission rule. | LMS-FR-041, 043 | `{title, type, due_at, late_rule, attempt_limit, rubric_id}` | — |
| POST | `/assignments/{id}/submissions` | Student | Submits work for an assignment. | LMS-FR-046 | `{content_url, submission_text}` | 422 `ATTEMPT_LIMIT_EXCEEDED`; 422 `LATE_SUBMISSIONS_NOT_ACCEPTED` |
| POST | `/assignments/{id}/submissions/{subId}/grade` | Teacher | Records grade and feedback including optional voice/video feedback URLs. | LMS-FR-049, 053 | `{score, rubric_scores, voice_feedback_url, override_reason}` — `override_reason` required if overriding auto-score | — |
| GET | `/exams` | Teacher (all own), Student (own) | Lists exams for a class/section. | LMS-FR-056 | Query: `class_section_id, status` | — |
| POST | `/exams` | Teacher | Creates a new exam with proctoring configuration and question list. | LMS-FR-056, 060 | `{title, total_marks, passing_marks, time_limit_minutes, proctoring_settings, question_ids}` | — |
| POST | `/exams/{id}/questions/generate` | Teacher | Drafts AI-generated questions for teacher review. Never publishes to students directly. | LMS-FR-057 | `{subject_id, topic, difficulty: 'easy'|'medium'|'hard', count}` → array of `{question_id, content, type, reviewed: false}` | Rate limited: 20/min per school (C.2) |
| GET | `/gradebook/{classSectionId}` | Teacher (write), Student/Parent (read own) | Retrieves the weighted gradebook view for a class/section. | LMS-FR-073, 074 | — | — |
| POST | `/gradebook/{classSectionId}/curve` | Teacher | Applies a linear or bell-curve grade adjustment to a category. | LMS-FR-078 | `{category, method: 'linear'|'bell'}` | — |
| GET | `/timetable/{classSectionId}` | All (read own) | Retrieves the published timetable for a class/section. | LMS-FR-099 | — | — |
| POST | `/timetable/auto-generate` | School Admin | Triggers AI-assisted draft timetable generation (async; returns job ID). | LMS-FR-100 | `{academic_year_id, constraints}` → `{job_id}` | — |

---

## C.4 Operations Service — Base Path `/api/v1/operations`

| Method | Path | Auth (Role) | Description | FR Ref | Request Body / Key Params | Notable Errors |
|---|---|---|---|---|---|---|
| GET | `/admissions/inquiries` | School Admin | Lists admissions inquiries with funnel status. | LMS-FR-001 | Query: `status, assigned_to, date_range` | — |
| POST | `/admissions/inquiries` | School Admin | Manually logs a phone or walk-in inquiry. | LMS-FR-002 | `{applicant_name, grade, parent_contact, source}` | — |
| GET | `/admissions/applications` | School Admin (all), Parent (own) | Lists applications with stage status. | LMS-FR-008 | Query: `stage, grade` | — |
| POST | `/admissions/applications/{id}/documents` | Parent | Uploads a required application document. | LMS-FR-009 | Multipart: file + `{document_type}` | 400 `FILE_TOO_LARGE` (>500 MB); 400 `UNSUPPORTED_FILE_TYPE` |
| GET | `/attendance/{classSectionId}` | Teacher (write), Student/Parent (read own) | Retrieves attendance records for a class/section and date range. | LMS-FR-087 | Query: `start_date, end_date` | — |
| POST | `/attendance/{classSectionId}` | Teacher | Records attendance for a period; supports bulk mark-all-present via full entries array. | LMS-FR-088 | `{date, period, entries: [{student_id, status}]}` | 422 `INCOMPLETE_ATTENDANCE` if any enrolled student has no status entry |
| POST | `/attendance/leave-requests` | Parent/Student | Submits a leave or absence excuse request. | LMS-FR-092 | `{date_range, reason, supporting_document_url}` | — |
| GET | `/library/resources` | All (filtered by grade access) | Searches the digital library catalog. | LMS-FR-149 | Query: `q, subject, author, availability` | — |
| POST | `/library/resources` | School Admin/Librarian | Adds a resource to the catalog. | LMS-FR-147 | `{title, author, subject, grade_access: [string], file_url}` | — |
| GET | `/transport/routes` | School Admin | Lists configured transport routes with capacity status. | LMS-FR-171 | — | — |
| POST | `/transport/routes` | School Admin | Creates a transport route. | LMS-FR-171 | `{route_name, vehicle_id, capacity}` | — |

---

## C.5 Finance Service — Base Path `/api/v1/finance`

| Method | Path | Auth (Role) | Description | FR Ref | Request Body / Key Params | Notable Errors |
|---|---|---|---|---|---|---|
| GET | `/fees/structures` | School Admin | Lists configured fee heads and amounts per grade. | LMS-FR-110 | — | — |
| POST | `/fees/structures` | School Admin | Creates or updates a fee structure entry. | LMS-FR-110 | `{fee_head, grade, amount, plan_type: 'monthly'|'quarterly'|'annual'|'one-time'}` | — |
| GET | `/fees/invoices` | School Admin (all), Parent (own children) | Lists invoices, filterable by student or status. | LMS-FR-113 | Query: `student_id, status, due_date_range` | — |
| POST | `/fees/invoices/{id}/pay` | Parent | Initiates payment through the school's configured gateway (Stripe/PayPal/JazzCash/Easypaisa). | LMS-FR-114 | `{gateway_provider, payment_method_token, amount}` | 402 `PAYMENT_DECLINED` with gateway's reason code; 422 `AMOUNT_MISMATCH` if amount does not match outstanding balance |
| GET | `/accounting/ledger` | School Admin/Accountant; Super Admin (view-only, school credentials excluded per LMS-FR-184) | Retrieves double-entry ledger entries for a date range. | LMS-FR-127 | Query: `start_date, end_date, account_id` | — |
| GET | `/accounting/statements` | CEO, School Admin/Accountant | Generates trial balance, P&L, or balance sheet for a period. | LMS-FR-129 | Query: `statement_type: 'trial_balance'|'pnl'|'balance_sheet', start_date, end_date` | — |
| POST | `/payroll/runs` | School Admin/Accountant | Processes payroll for a pay period (async; returns job ID). | LMS-FR-142, 143 | `{pay_period: 'YYYY-MM'}` → `{job_id}` | 422 `INCOMPLETE_PAYROLL_PROFILE` with array of affected staff IDs |
| GET | `/payroll/payslips/{staffId}` | Staff — owner of `staffId` only | Retrieves a staff member's own payslip history. | LMS-FR-144 | — | 403 if `staffId` does not match the authenticated user |

---

## C.6 People Service — Base Path `/api/v1/people`

| Method | Path | Auth (Role) | Description | FR Ref | Request Body / Key Params | Notable Errors |
|---|---|---|---|---|---|---|
| GET | `/staff` | School Admin | Lists the staff directory. | LMS-FR-134 | Query: `sub_role, contract_status` | — |
| POST | `/staff/leave-requests` | Staff | Submits a leave request; response includes remaining leave balance. | LMS-FR-135 | `{leave_type, start_date, end_date, reason}` | 422 `INSUFFICIENT_LEAVE_BALANCE` |
| POST | `/staff/leave-requests/{id}/approve` | School Admin | Approves a leave request and auto-flags the timetable for substitution. | LMS-FR-136, 137 | `{approved: boolean, note}` | — |
| POST | `/users/bulk-import` | School Admin | Bulk-creates user accounts from a CSV or XLSX upload (async; per-row results in job output). | LMS-FR-191 | Multipart: CSV/XLSX file → `{job_id}` | Per-row 400 `DUPLICATE_EMAIL` in job result — not a request-level failure |
| GET | `/roles/custom` | School Admin | Lists custom roles defined for the school with their permission overrides. | LMS-FR-193 | — | — |
| POST | `/roles/custom` | School Admin | Creates a custom role constrained to a subset of a predefined role's permissions (BR-042). | LMS-FR-193 | `{name, base_role_template, permissions: [string]}` | 422 `PERMISSION_EXCEEDS_TEMPLATE` if any permission is not in the base role |

---

## C.7 Wellbeing Service — Base Path `/api/v1/wellbeing`

| Method | Path | Auth (Role) | Description | FR Ref | Request Body / Key Params | Notable Errors |
|---|---|---|---|---|---|---|
| POST | `/tests` | Psychologist | Assigns a psychological test to a student, class section, or grade level. | LMS-FR-161 | `{test_type: 'personality'|'career'|'aptitude'|'iq'|'eq', target: {student_ids|class_section_id|grade}}` | — |
| GET | `/students/{id}/results` | Per BR-031/032 visibility rules | Retrieves scored test results; response shape varies by caller role (psychologist=full, teacher=summary, parent=career+aptitude only). | LMS-FR-163 | — | 403 if caller role is not permitted any view of this student's results |
| GET | `/risk-flags` | Psychologist (all), School Admin (High/Critical), CEO (Critical only) | Lists currently risk-flagged students at the caller's escalation level. | LMS-FR-164, 165 | Query: `risk_level: 'low'|'medium'|'high'|'critical'` | — |
| POST | `/counselling-sessions` | Psychologist | Records a counselling session with separate confidential and shareable note fields. | LMS-FR-168 | `{student_id, scheduled_at, duration_minutes, confidential_notes, shareable_summary}` | — |

---

## C.8 Communication Service — Base Path `/api/v1/communication`

| Method | Path | Auth (Role) | Description | FR Ref | Request Body / Key Params | Notable Errors |
|---|---|---|---|---|---|---|
| GET | `/messages` | All (per Section 2.4 permissions) | Retrieves the caller's message threads with unread counts. | LMS-FR-152 | Query: `thread_id, unread_only` | — |
| POST | `/announcements/emergency-broadcast` | School Admin | Triggers a multi-channel emergency broadcast fanned out across SMS, email, push, and in-app (async). | LMS-FR-155 | `{template_id, message_body, recipient_scope: 'all'|'class'|'grade'}` → `{job_id}` | Rate limited: 5/hour per school (C.2) |

---

## C.9 Compliance Service — Base Path `/api/v1/compliance`

| Method | Path | Auth (Role) | Description | FR Ref | Request Body / Key Params | Notable Errors |
|---|---|---|---|---|---|---|
| GET | `/cognia/evidence-tags` | Teacher, School Admin | Lists evidence items tagged against Cognia standards, filterable by standard. | LMS-FR-176 | Query: `standard_reference` | — |
| POST | `/cognia/evidence-tags` | Teacher | Tags a piece of evidence (assignment, exam, record) against a mapped Cognia standard. | LMS-FR-176 | `{standard_reference, evidence_type, reference_id}` | 400 `STANDARD_NOT_MAPPED` if the standard has not been configured by School Admin |

---

## C.10 Platform Service — Base Path `/api/v1/platform`

| Method | Path | Auth (Role) | Description | FR Ref | Request Body / Key Params | Notable Errors |
|---|---|---|---|---|---|---|
| POST | `/schools` | Super Admin | Provisions a new school tenant with an isolated data namespace and subdomain. | LMS-FR-180 | `{subdomain, name, timezone, currency, subscription_plan_id}` | 409 `SUBDOMAIN_TAKEN` |
| GET | `/analytics` | Super Admin | Retrieves aggregated, anonymised platform-wide usage trends. No individual school is identifiable in the response (BR-039). | LMS-FR-187 | Query: `metric, date_range` | — |

---

## C.11 Insights Service — Base Path `/api/v1/insights`

| Method | Path | Auth (Role) | Description | FR Ref | Request Body / Key Params | Notable Errors |
|---|---|---|---|---|---|---|
| POST | `/reports/custom` | Per Section 2.4 permissions | Saves a custom report definition built via the drag-and-drop report builder. | LMS-FR-196 | `{name, filters: [{field, operator, value}], columns: [string]}` | — |
| POST | `/reports/custom/{id}/schedule` | Per Section 2.4 permissions | Schedules a saved custom report for recurring automated email delivery. | LMS-FR-199 | `{frequency: 'daily'|'weekly'|'monthly', recipient_email}` | — |

---

## C.12 Endpoint Summary

| Service | Base Path | Endpoint Count |
|---|---|---|
| Learning | `/api/v1/learning` | 15 |
| Operations | `/api/v1/operations` | 11 |
| Finance | `/api/v1/finance` | 8 |
| People | `/api/v1/people` | 6 |
| Wellbeing | `/api/v1/wellbeing` | 4 |
| Communication | `/api/v1/communication` | 2 |
| Compliance | `/api/v1/compliance` | 2 |
| Platform | `/api/v1/platform` | 2 |
| Insights | `/api/v1/insights` | 2 |
| **Total** | | **52** |

---

*Lighthouse Global School System — P1 Master SRS — Appendix C — Internal — v1.0*
