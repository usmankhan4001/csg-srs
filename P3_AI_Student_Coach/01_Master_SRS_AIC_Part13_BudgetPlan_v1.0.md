# MASTER SRS — P3 AI STUDENT COACH
## Part 13 — Budget Plan

*Layer 5 — Project & Financial*

| Field | Value |
|---|---|
| Product | P3 — AI Student Coach |
| Document | Master SRS — Part 13 of 17 |
| Identifier prefix | AIC-BUD |
| Currency | USD throughout, for cross-provider comparability; convert to PKR at the prevailing rate for client-facing invoicing |
| Pricing currency note | Compute unit pricing (Azure D4s_v5 ≈ $0.192/hr on-demand) was verified against live pricing sources on 29 June 2026. Database/cache/storage/networking figures below extrapolate from this verified base using standard Azure service-tier ratios and are explicitly flagged as **estimates requiring Azure Pricing Calculator confirmation** before contractual budget lock — consistent with the same caveat applied to LLM pricing in Section 8.1 (Gap G13). |
| Basis | Built directly from the Part 12 Resource Plan hours matrix; no hours are introduced in this Part that do not trace back to Part 12 (AIC-RES-005's reconciliation requirement). |

---

## 13.1  Cost Per Module

Rate card (blended hourly, USD) applied to the Part 12.3 hours matrix: AI/ML Engineer $38 · Backend Eng. Python $28 · Backend Eng. Node $26 · Frontend Eng. Web $25 · Frontend Eng. Mobile $26 · UI/UX Designer $24 · Data Engineer $35 · QA Engineer $20 · Clinical/Safety Advisor $80 · Security Specialist $55.

| Module | AI/ML | BE-Py | BE-Node | FE-Web | FE-Mob | UX | Data Eng | QA | Clinical | Security | **Module Cost** |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 4.1 Tutor Engine | $6,840 | $3,920 | — | $2,750 | $2,340 | $1,200 | $1,050 | $1,600 | — | $825 | **$20,525** |
| 4.2 Homework Assistant | $5,320 | $3,360 | — | $1,750 | $1,560 | $840 | $875 | $1,400 | $800 | $1,100 | **$17,005** |
| 4.3 Revision Coach | $4,560 | $3,080 | — | $3,250 | $2,600 | $1,440 | $875 | $1,400 | — | $550 | **$17,755** |
| 4.4 Career Coach | $3,800 | $2,520 | — | $2,000 | $1,560 | $1,080 | $700 | $1,000 | $800 | $550 | **$14,010** |
| 4.5 Wellbeing Coach | $6,080 | $3,640 | — | $1,500 | $1,300 | $1,200 | $1,225 | $1,800 | $9,600 | $1,375 | **$27,720** |
| 4.6 Student Learning Profile | — | $2,240 | $2,600 | $1,250 | $1,040 | $600 | $1,400 | $800 | — | $550 | **$10,480** |
| 4.7 Knowledge Graph & RAG | $8,360 | $2,800 | — | — | — | — | $2,100 | $1,000 | — | $1,100 | **$15,360** |
| 4.8 Personalization & Rec. | $5,320 | $2,520 | — | $1,250 | $780 | $600 | $875 | $800 | — | $550 | **$12,695** |
| 4.9 Teacher Oversight | — | — | $3,120 | $2,250 | — | $960 | $350 | $1,000 | — | $550 | **$8,230** |
| 4.10 Consent & Safety | — | $840 | $2,860 | $1,250 | $780 | $720 | $875 | $1,200 | $1,200 | $1,375 | **$11,100** |
| 4.11 Admin & Configuration | — | — | $3,640 | $2,500 | — | $1,200 | $525 | $1,000 | — | $825 | **$9,690** |
| **Module subtotal** | | | | | | | | | | | **$164,570** |

**AIC-BUD-001:** Module 4.5 (Wellbeing Coach) is the single most expensive module ($27,720), driven by the Clinical/Safety Advisor's $9,600 concentrated engagement — this is a direct, traceable consequence of the safety-criticality decisions made in Part 4/8.7.5, not a budgeting anomaly.

---

## 13.2  Cost Per Phase

Cross-cutting costs ($63,120 total — Solution Architect, PM, DevOps Lead, foundational Data Engineer, Frontend Lead, QA Lead, per Part 12.3) are apportioned across phases by duration-weighted share (~$2,339/week across 27 total weeks).

| Phase | Modules Included | Duration | Module Cost | Cross-Cutting Share | **Phase Total** |
|---|---|---|---|---|---|
| A — Foundation | Environment/schema/design-system setup + 4.6, 4.7 | 6 weeks | $25,840 | $14,032 | **$39,900** |
| B — Core Tutoring & Integrity | 4.1, 4.2 | 5 weeks | $37,530 | $11,693 | **$49,200** |
| C — Revision, Career, Personalization | 4.3, 4.4, 4.8 | 5 weeks | $44,460 | $11,693 | **$56,200** |
| D — Wellbeing & Safety | 4.5, 4.10 | 4 weeks | $38,820 | $9,355 | **$48,200** |
| E — Oversight & Admin + UI Integration | 4.9, 4.11 | 3 weeks | $17,920 | $7,016 | **$24,900** |
| F — Testing, Security Hardening, UAT, Launch | (no new modules — regression, pen testing, UAT, cutover) | 4 weeks | — | $9,400 | **$9,400** |
| **Total** | | **27 weeks (~6.2 months)** | **$164,570** | **$63,189** | **≈$227,700** |

**AIC-BUD-002:** Phase D (Wellbeing & Safety) is deliberately sequenced as its own isolated phase rather than folded into Phase B/C alongside other modules, giving the Clinical/Safety Advisor's review and the escalation-drill validation (ASM-AIC-03) a dedicated window rather than competing for attention against unrelated module work.
**AIC-BUD-003:** Phase F carries no module-specific cost because all functional build cost is captured in Phases A–E; Phase F's cost is the tail allocation of QA Lead/DevOps/Security time already counted in the Part 12 cross-cutting hours, not newly invented hours — this phase represents calendar time and coordination effort, not additional headcount cost beyond what Part 12 already budgets.

---

## 13.3  Total Project Budget

| Category | Amount | Basis |
|---|---|---|
| Development (AI/ML, Backend Python/Node, Frontend Web/Mobile, Data Engineering incl. foundational, Solution Architect, DevOps Lead, Frontend Lead) | $160,620 | Sum of all engineering-role hours × rate, Part 12.2/12.3 |
| Design (UI/UX Designer) | $9,840 | Sum of UX hours × rate |
| Testing & Security (QA Engineer, QA Lead, Security Specialist) | $29,550 | Sum of QA/Security hours × rate |
| Specialist Consulting (Clinical/Safety Advisor) | $12,400 | Per AIC-RES-001/002 — committed, not contingency-only |
| Project Management | $16,800 | PM hours × rate |
| Infrastructure (build-phase: Dev/QA/UAT environments, ~6 months) | $4,500 | Estimate — see 13.5 methodology note |
| **Subtotal** | **$233,710** | |
| Contingency (15%) | $35,100 | See 13.6 |
| **Total Phase 1 Development Budget** | **≈$268,800** | |

**AIC-BUD-004:** This total covers **Phase 1 build only** (v1.0, current confirmed scale of 500–2,000 students) — it does not include Phase 2/3 scale-driven re-architecture costs (additional read replicas, vector-store migration trigger per Section 8.1.3, dedicated mobile-native rework if Gap G15 resolves toward native) or ongoing operational costs, which are budgeted separately in Section 13.4.

---

## 13.4  Operational Costs (Monthly, Post-Launch, Phase 1 Scale)

| Cost Category | Monthly Estimate | Methodology / Confidence |
|---|---|---|
| Cloud infrastructure (AKS compute, PostgreSQL HA, Redis, Blob, API Management/Front Door, Key Vault, Monitor) | ≈$1,800 | Compute base rate verified (D4s_v5 $0.192/hr × 3 nodes ≈ $420/mo); database, cache, networking, and management-service components extrapolated from standard Azure tier pricing ratios — **requires Azure Pricing Calculator confirmation against the exact Part 11.1 Phase 1 sizing before this figure is treated as committed** |
| LLM/AI inference (Tier A/B/C blended, ~1,600 active students/month) | ≈$3,600 | Estimated at ~$2.25/active-student/month blended (Tier A ≈$1.32 + Tier B ≈$0.90, using verified Section 8.1.1 per-token rates against an assumed ~350,000 tokens/student/month average usage — well below the 2,000,000 hard cap, which is a ceiling not an expected average); **re-verify against actual Part 15 UAT/pilot telemetry once available, and re-verify unit pricing per Gap G13** |
| SMS/Email/Push notifications | ≈$150 | Estimated from wellbeing/consent/reminder notification volume at Phase 1 scale, local Pakistani SMS gateway rates assumed (pending AIC-TR-212 deliverability test) |
| Ongoing support/maintenance engineering | ≈$2,400 | 0.5 FTE blended retainer (~80 hrs/month at $30/hr) for monitoring response, bug fixes, minor enhancements post-launch |
| Third-party tooling/licenses (CI/CD, monitoring tier beyond free allowance, design tooling) | ≈$150 | Estimate; see 13.5 |
| **Total estimated monthly operational cost (Phase 1)** | **≈$8,100/month (≈$97,200/year)** | |

**AIC-BUD-005:** The LLM inference cost line is the single most volatile figure in this budget — it scales directly with active-student count and per-token pricing, both of which are explicitly flagged as pending confirmation (Gap G13, and actual usage telemetry not yet available pre-launch). This line shall be re-baselined immediately after the first month of real UAT/pilot usage data, not left at the pre-launch estimate indefinitely.
**AIC-BUD-006:** Operational cost at Phase 2 (~20,000 students) and Phase 3 (100,000+ students) scales are **not linearly extrapolated** from the Phase 1 figures above in this document, since infrastructure sizing at those phases (Part 11.1) uses different instance tiers and read-replica counts, not simply more of the same Phase 1 units — Phase 2/3 operational budgets shall be produced as dedicated re-budgeting exercises at each phase transition (consistent with AIC-TR-235's phase-trigger principle), not assumed from a simple multiplier applied here.

---

## 13.5  Licence & Infrastructure Costs

| Item | Type | Estimated Cost | Notes |
|---|---|---|---|
| Azure cloud services (compute, DB, cache, storage, networking, AI Foundry routing) | Consumption-based, no separate license fee | Per 13.4 | No upfront license; pure consumption pricing |
| LLM provider accounts (Anthropic, OpenAI, Google — enterprise/business tier) | Consumption-based, no separate license fee | Per 13.4 | Enterprise tier required for no-training-on-customer-data terms (AIC-TR-221) — confirm this tier carries no additional flat fee beyond usage, per provider |
| Azure AI Vision (OCR) | Consumption-based (per-transaction) | Included in 13.4 cloud estimate | Pay-per-call, no separate license |
| Source control / project management tooling (e.g., GitHub/GitLab, Jira-equivalent) | SaaS subscription | ≈$80/month | Team-size-tier pricing |
| Design tooling (Figma or equivalent) | SaaS subscription | ≈$45/month | Per-seat for UI/UX Designer + Frontend Lead review access |
| Monitoring/SIEM tooling beyond Azure-native free tier (if a dedicated SIEM beyond Azure Sentinel's base is required) | SaaS subscription | ≈$25–100/month | Final figure depends on log-ingestion volume, confirmed during Part 11 build |
| **Total recurring licence/tooling cost** | | **≈$150–225/month** | Already incorporated into the 13.4 "Third-party tooling/licenses" line |

**AIC-BUD-007:** No third-party tool or platform in this section requires an upfront perpetual-license purchase; the entire stack is consumption-based or subscription-based, consistent with the cloud-native architecture decisions in Part 8/9 — this avoids large capital outlay in favor of operating expense, which the client should confirm aligns with their preferred financial structure.

---

## 13.6  Contingency

| Element | Detail |
|---|---|
| Contingency percentage | 15% of the Section 13.3 subtotal ($233,710 × 15% = $35,100) |
| Justification | A 15% rate reflects: (a) the project's requirements are already extensively detailed (210 functional requirements, 88 use cases, 322 Layer 4 technical requirements specified before build begins), which is a risk-reducing factor relative to a less-specified project; offset by (b) genuine residual uncertainty in AI-specific work (prompt engineering iteration, evaluation-driven rework per Part 15.6, and the Clinical/Safety Advisor's review potentially requiring template revisions), and (c) four still-open gaps (G12 latency test, G13 pricing re-verification, G14 retention period, G15 mobile framework) that could each shift scope or cost once resolved |
| Contingency use governance | Contingency draws require Project Manager + Solution Architect joint sign-off and are logged against the Part 17.5 decision log; contingency is not a slush fund for scope creep — a draw against contingency for new functionality (rather than absorbing estimation variance on already-scoped work) requires a Part 17 change request first |
| Contingency review cadence | Reviewed at each phase boundary (13.2); if Phase A–C draw down contingency faster than the proportional 27-week schedule would suggest, this is an early-warning signal escalated to the client before Phase D/E begins, not discovered only at project end |

**AIC-BUD-008:** The four open gaps cited in the contingency justification (G12–G15) should, where possible, be resolved **before** Phase A begins rather than absorbed silently into contingency — contingency is sized to cover reasonable estimation variance, not to substitute for resolving known open decisions that are within the client's and consultant's control to close before build starts.

---

### Layer 5 gate status — Part 13

| Gate item | Minimum Standard | Status |
|---|---|---|
| 13.1 Cost per module | Module/role/hours/rate/cost, summed per module | Pass — 11 modules, full role breakdown |
| 13.2 Cost per phase | Phase/modules/total cost/duration | Pass — 6 phases |
| 13.3 Total project budget | Development/design/infra/testing/PM/contingency/total | Pass |
| 13.4 Operational costs | Monthly post-launch: cloud/licences/support/AI API | Pass — 5 categories with methodology |
| 13.5 Licence & infra costs | Open-source/SaaS/cloud estimates | Pass |
| 13.6 Contingency | Percentage + justification | Pass — 15%, justified |

*Open items carried forward: AIC-BUD-005 flags LLM cost as the most volatile line pending Gap G13 and real usage data; AIC-BUD-008 recommends resolving G12/G13/G14/G15 before Phase A rather than absorbing into contingency. Next: Part 14 — Project Timeline (development phases, milestone schedule, Gantt chart, critical path, dependencies map, go-live plan) — builds directly on the Section 13.2 phase structure.*
