# Decision Log
## Lighthouse Global School System — All Products

> Every significant decision made during discovery or SRS writing is recorded here.
> Decisions are never deleted — only superseded with a new entry referencing the old one.

---

## P1 — LMS + SMS

| ID | Date | Decision | Rationale | Alternatives Rejected | Approver |
|---|---|---|---|---|---|
| DEC-P1-001 | Jun 2026 | Platform selection delegated to SRS — consultant produces comparison and recommendation | Client has not used any of the candidate platforms; unbiased evaluation needed | Odoo selected outright, Moodle selected outright | Consultant |
| DEC-P1-002 | Jun 2026 | Pakistan-primary SaaS with multi-currency/jurisdiction from day one | Client base is Pakistan but product is global SaaS | Pakistan-only architecture | Consultant |
| DEC-P1-003 | Jun 2026 | All Cambridge programmes (Primary → A-Level) in v1.0 | Client requires full Cambridge compliance at launch | Phased Cambridge rollout | Client |
| DEC-P1-004 | Jun 2026 | No data migration — clean build | No existing system in use | Migration from Excel | Client |
| DEC-P1-005 | Jun 2026 | Single school at v1.0 launch; multi-tenant architecture from day one | Fastest path to market while protecting future scale | Multi-school launch | Client |
| DEC-P1-006 | Jun 2026 | Mobile stack evaluation in SRS Part 9.1 — Native vs React Native vs Flutter comparison | Significant cost and timeline impact; decision requires full analysis | Native only selected outright | Consultant |
| DEC-P1-007 | Jun 2026 | PWA ships in v1.0 as core offline layer — not a fallback | Product serves low-bandwidth markets; offline capability is a feature | PWA as fallback only | Client |
| DEC-P1-008 | Jun 2026 | English + Arabic + Urdu (full RTL) in v1.0 | Core target markets; RTL is non-negotiable for Arabic/Urdu users | English-only v1.0 | Client |
| DEC-P1-009 | Jun 2026 | Cloud provider selection in SRS Part 8.9 — AWS vs Azure vs GCP vs VPS comparison | No pre-existing cloud vendor; cost and capability comparison needed | AWS selected outright | Consultant |
| DEC-P1-010 | Jun 2026 | HR & Payroll both in v1.0 | Confirmed in client's own Detailed Specs document | HR only; Payroll deferred | Client |
| DEC-P1-011 | Jun 2026 | Full double-entry accounting in v1.0 — native build, no third-party integration | Confirmed in client documents; native build gives full control | QuickBooks integration | Client |
| DEC-P1-012 | Jun 2026 | Transport module in v1.0 — system serves physical schools as well | Reversed from initial decision to defer; system is full SMS not online-only | Transport deferred to v2.0 | Client |
| DEC-P1-013 | Jun 2026 | Cognia-ready evidence management in v1.0 | Client confirmed Cognia accreditation is a strategic goal | Cognia deferred to v2.0 | Client |
| DEC-P1-014 | Jun 2026 | Library = digital resources only in v1.0; physical catalog in v2.0 | Online school primary; physical catalog is lower priority | Full library in v1.0 | Client |
| DEC-P1-015 | Jun 2026 | Multi-school onboarding tools in v1.0 | Confirmed in High Level SRS; SaaS product needs onboarding tooling from day one | Onboarding tools deferred | Client |
| DEC-P1-016 | Jun 2026 | P3 (AI Coach) integration: P1 exposes API hooks only; no P3 features inside P1 | Clean product boundaries; P3 has its own SRS and delivery track | P3 features embedded in P1 | Consultant |
| DEC-P1-017 | Jun 2026 | Payment gateways are per-tenant (plug-and-play per school) — no platform-level credential lock | SaaS architecture requirement; each school has its own merchant accounts | Platform-level shared gateway | Consultant |
| DEC-P1-018 | Jun 2026 | Biometric: generic API layer approach — not locked to specific vendor | Schools use different hardware; generic layer future-proofs integration | Specific vendor locked in | Consultant |
| DEC-P1-019 | Jun 2026 | AI Quiz Bot in v1.0 — auto-generate exam questions from syllabus content | Confirmed in Production Guide as P1 feature | Quiz bot deferred to P3 | Client |

---

## P2 — AI RevOps Engine

*No decisions logged yet — discovery not started.*

---

## P3 — AI Student Coach

*No decisions logged yet — discovery not started.*

---

## P4 — Dynamics 365 Bots

*No decisions logged yet — discovery not started.*
