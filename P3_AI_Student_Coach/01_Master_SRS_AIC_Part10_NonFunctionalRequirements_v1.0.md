# MASTER SRS — P3 AI STUDENT COACH
## Part 10 — Non-Functional Requirements

*Layer 4 — Technical & Architecture*

| Field | Value |
|---|---|
| Product | P3 — AI Student Coach |
| Document | Master SRS — Part 10 of 17 |
| Identifier prefix | AIC-NFR |
| Rule applied | Every target below is a single exact number, not a range, except where the table explicitly states a tiered target across defined load stages (which is itself a defined set of exact numbers, not an open range). |

---

## 10.1  Performance

| ID | Metric | Target | Measurement Method |
|---|---|---|---|
| AIC-NFR-001 | API response time — p50 (standard CRUD endpoints, e.g., profile read, recommendation list) | 150 ms | Application Insights percentile tracking, server-side processing time excluding network |
| AIC-NFR-002 | API response time — p95 (standard CRUD endpoints) | 400 ms | Same as above |
| AIC-NFR-003 | API response time — p99 (standard CRUD endpoints) | 800 ms | Same as above |
| AIC-NFR-004 | Tutor Engine first-token latency (streaming chat response) — p95 | 3 seconds | Time from request received to first streamed token emitted (restates KPI-AIC-07) |
| AIC-NFR-005 | Tutor Engine full-response completion — p95 (for a 500-token response) | 12 seconds | End-to-end stream completion time |
| AIC-NFR-006 | Wellbeing safe-response render time (client-side, post-detection) | 1 second | Time from server-side L2/L3 classification to safe-response screen fully rendered on client (restates AIC-UIR-005) |
| AIC-NFR-007 | RAG retrieval latency (vector search step only) — p95 | 200 ms | Internal Knowledge Graph & RAG service timing, excluding downstream model call |
| AIC-NFR-008 | Page load time — initial load, Student/Parent web app | 2 seconds | Largest Contentful Paint (LCP), measured on a 4G-equivalent connection profile |
| AIC-NFR-009 | Page load time — initial load, Teacher/Admin consoles | 2.5 seconds | LCP, desktop broadband connection profile |
| AIC-NFR-010 | Database query time — p95 (single-table read, indexed) | 50 ms | PostgreSQL query duration via Application Insights/pg_stat tracking |
| AIC-NFR-011 | Database query time — p95 (cross-domain join, e.g., Personalization reading Profile + Graph) | 150 ms | Same as above |
| AIC-NFR-012 | Homework integrity-flag teacher-log visibility | 30 seconds | Restates AIC-FR-029's binding SLA, measured end-to-end from turn completion to queryable in `homework_turn` |
| AIC-NFR-013 | Wellbeing L2 escalation recipient-alert delivery | 60 seconds | Restates AIC-FR-086's binding SLA, measured from classification to notification dispatch confirmation |
| AIC-NFR-014 | Configuration change propagation (teacher/admin control toggles) | 30 seconds | Restates AIC-FR-031/AIC-TR-176, measured from API `200` to effect on subsequent in-flight requests |

---

## 10.2  Scalability

| ID | Metric | Target |
|---|---|---|
| AIC-NFR-015 | Concurrent active users at launch (Phase 1, current confirmed enrollment) | 2,000 students, supporting up to 600 concurrent active sessions at peak (30% concurrency assumption, evening study-hours peak) |
| AIC-NFR-016 | Concurrent active users at Year 1 (Phase 2, growth) | 20,000 students, supporting up to 6,000 concurrent active sessions at peak |
| AIC-NFR-017 | Concurrent active users at Year 3 (Phase 3, target scale) | 100,000 students, supporting up to 30,000 concurrent active sessions at peak |
| AIC-NFR-018 | Data volume — conversation/interaction records at Year 3 target scale | 50 million message rows (estimated at ~500 messages/student/year × 100,000 students, 1-year rolling within the 24-month retention window) |
| AIC-NFR-019 | Data volume — vector store entries (Year 3, full Cambridge corpus across all stages/subjects) | 2 million content chunks (estimated; finalized once the licensed corpus from Gap G6/G11 is confirmed) |
| AIC-NFR-020 | Auto-scaling trigger — AKS application services | Scale out when average CPU utilization exceeds 70% sustained for 3 minutes, or request-queue depth exceeds 50 pending requests per pod |
| AIC-NFR-021 | Auto-scaling trigger — Model Gateway specifically | Scale out when inference-call queue depth exceeds 20 pending calls (restates AIC-TR-111's I/O-bound scaling basis) |
| AIC-NFR-022 | Database read-replica addition trigger | Add a read replica when p95 read query latency (AIC-NFR-010/011) exceeds target for 3 consecutive monitoring windows (restates AIC-TR-113) |

---

## 10.3  Availability

| ID | Metric | Target |
|---|---|---|
| AIC-NFR-023 | Platform uptime (monthly) | 99.9% (allowing ~43 minutes of downtime per 30-day month) |
| AIC-NFR-024 | Wellbeing Coach + Consent & Safety services uptime (monthly) — stricter than platform average given safety-critical role | 99.95% (allowing ~22 minutes of downtime per 30-day month) |
| AIC-NFR-025 | Planned maintenance window | Maximum 4 hours per month, scheduled outside peak usage hours (identified peak: 5 PM–11 PM Pakistan Standard Time, per the evening study-hours usage pattern) |
| AIC-NFR-026 | Unplanned downtime limit (per incident) | Maximum 1 hour before incident escalates to the Part 17 governance escalation matrix |
| AIC-NFR-027 | Zone-failure recovery (single Availability Zone outage within UAE North) | Automatic failover with zero manual intervention, recovery within 5 minutes (restates AIC-TR-107) |

---

## 10.4  Disaster Recovery

| ID | Metric | Target |
|---|---|---|
| AIC-NFR-028 | Recovery Point Objective (RPO) — primary database | 15 minutes maximum data loss, via continuous geo-replication to UAE Central (restates AIC-TR-108) |
| AIC-NFR-029 | Recovery Time Objective (RTO) — full region failover (UAE North → UAE Central) | 4 hours maximum to restore full service |
| AIC-NFR-030 | RTO — single-service failure (one of the 13 application services, not a region event) | 15 minutes maximum, via AKS pod restart/reschedule |
| AIC-NFR-031 | Backup frequency — full database backup | Daily, retained 35 days |
| AIC-NFR-032 | Backup frequency — transaction log backup | Continuous (point-in-time recovery granularity of 5 minutes) |
| AIC-NFR-033 | Disaster recovery failover test frequency | Minimum twice per year (restates AIC-TR-117's "tested before launch and recurring thereafter," with the cadence fixed here at twice-yearly) |
| AIC-NFR-034 | Wellbeing & Safety domain audit record retention | **Pending Gap G14 resolution** — DPO/legal counsel to confirm exact period; this NFR remains a placeholder target of no less than 7 years until confirmed, reflecting common safeguarding-record retention practice, subject to revision |

---

## 10.5  Security

| ID | Metric | Target |
|---|---|---|
| AIC-NFR-035 | Encryption in transit | TLS 1.3, zero exceptions (restates AIC-TR-051/8.8.3) |
| AIC-NFR-036 | Encryption at rest | AES-256, zero exceptions (restates 8.8.3) |
| AIC-NFR-037 | Session timeout — Student/Parent app | 30 minutes of inactivity |
| AIC-NFR-038 | Session timeout — Teacher console | 20 minutes of inactivity |
| AIC-NFR-039 | Session timeout — School Admin / Super Admin console | 15 minutes of inactivity (restates AIC-TR-089's "shorter than Student/Parent" principle with an exact figure) |
| AIC-NFR-040 | Penetration test frequency | Minimum annual, plus mandatory pre-major-release (restates AIC-TR-101) |
| AIC-NFR-041 | Failed login lockout threshold | Per P1's existing policy (restates AIC-TR-099); exact threshold inherited, not independently set by P3 |
| AIC-NFR-042 | Critical/High penetration-test finding remediation window | 14 days from finding to verified fix, before next release proceeds (restates AIC-TR-230) |

---

## 10.6  Usability

| ID | Metric | Target |
|---|---|---|
| AIC-NFR-043 | Maximum clicks/taps to primary student action (start tutoring, generate quiz) from home screen | 2 (restates AIC-UIR-001) |
| AIC-NFR-044 | Maximum clicks to a flagged integrity item from Teacher oversight dashboard | 2 (restates AIC-UIR-003) |
| AIC-NFR-045 | Mobile performance score (Lighthouse, or equivalent) — Student/Parent app | Minimum 85/100 |
| AIC-NFR-046 | Accessibility conformance | WCAG 2.1 Level AA, 100% of screens (restates ACC-AIC-01/Part 2.5) |
| AIC-NFR-047 | Task completion rate — first-time user completing initial tutoring session without external help (usability test) | Minimum 90% of test participants |
| AIC-NFR-048 | Localization completeness | 100% of UI strings available in English, Urdu, and Arabic at launch (zero untranslated strings in production) |

---

## 10.7  Cross-Cutting NFR Requirements

**AIC-NFR-049:** Every numeric target in this Part 10 shall be instrumented and visible on a live dashboard (Part 11.5) before production launch; a target that cannot currently be measured is treated as a gap to close before launch, not an aspirational figure left unverified.
**AIC-NFR-050:** Where a Part 8/9 architectural decision (e.g., the UAE North region choice, pending Gap G12 latency confirmation) directly underpins a target in this Part 10 (e.g., AIC-NFR-004's first-token latency), that target shall be re-validated once the underlying architectural decision is confirmed, and adjusted here if the confirmed reality differs from the design assumption.
**AIC-NFR-051:** No target in this Part 10 shall be silently loosened after launch without a Part 17 change request and a written justification, consistent with the guide's "contractually defensible" quality standard — a missed target is a tracked issue, not a reason to quietly redefine the target.
**AIC-NFR-052:** The distinction between Wellbeing/Consent & Safety's stricter availability target (AIC-NFR-024) and the platform-wide target (AIC-NFR-023) shall be preserved through any future infrastructure change; these two services shall not be collapsed onto a single shared availability target on the basis of operational simplicity.

---

### Layer 4 gate status — Part 10

| Gate item | Minimum Standard | Status |
|---|---|---|
| All 6 NFR categories present | Performance, Scalability, Availability, Disaster Recovery, Security, Usability | Pass — all 6 present |
| Single exact target value per metric — no ranges | Required | Pass — 48 metrics (AIC-NFR-001–048), each a single number or a defined tiered set of numbers; one placeholder (AIC-NFR-034) explicitly marked pending and bounded by a stated minimum rather than left as an open range |

*Open items carried forward: AIC-NFR-004/005/007 latency targets assume the UAE North region decision holds (Gap G12); AIC-NFR-034 awaits Gap G14 resolution. Next: Part 11 — Infrastructure & DevOps (cloud infrastructure detail, environment strategy, CI/CD pipeline, containerization, monitoring & alerting, backup & recovery) — closes Layer 4.*
