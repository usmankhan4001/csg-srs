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
| DEC-P1-020 | Jun 2026 | Added 8th portal: Staff Portal for non-teaching staff (librarians, accountants, etc.). Updated S-01 from 7 to 8 portals during Roles & Permissions Matrix review (Part 2.4). Sub-role permissions configured via existing custom role system. | Original High Level SRS references non-teaching staff (Librarian, Accountant) as predefined roles requiring system access, which the initial 7-portal scope omitted | 7-portal scope without dedicated staff access | Client |
| DEC-P1-021 | Jun 2026 | Super Admin has View-only access (with audit logging) to individual school financial data — no export capability | Respects tenant data isolation principle (A-10/DEC-P1-002); protects school trust and limits platform liability if Super Admin account is compromised | Full export access for Super Admin | Client |
| DEC-P1-022 | Jun 2026 | Super Admin sees only which payment gateway providers are configured per school (provider name only) — no credential or financial data access | Per-school plug-and-play payment architecture (DEC-P1-017) means gateway credentials are school-owned; Super Admin needs only enough visibility for platform-level support | Full Super Admin gateway configuration access | Client |
| DEC-P1-023 | Jun 2026 | CEO restricted to staff-only broadcast messaging — cannot send bulk announcements to all students/parents school-wide | Matches original CEO portal scope (strategic/analytical, not operational); bulk school-wide messaging is a School Admin function | CEO with full bulk announcement rights | Client |
| DEC-P1-024 | Jun 2026 | Part 8.1 platform analysis: no off-the-shelf platform (Moodle/Open edX/Frappe-ERPNext/Odoo-OpenEduCat) natively supports project scope. Custom microservices build confirmed, with ERPNext's accounting/payroll data model referenced as design input (not platform adoption). | Evaluated candidate platforms against the project scope and confirmed custom microservices is the only fit. | Moodle/Open edX/Frappe-ERPNext/Odoo-OpenEduCat | Consultant |
| DEC-P1-025 | Jun 2026 | Part 8.9 cloud provider: AWS recommended (broadest Middle East regional footprint — Bahrain/UAE/Saudi as of Jan 2026) over Azure/GCP. Flagged as open for client confirmation given Azure's ecosystem synergy with P4 (Dynamics 365). | AWS offers the strongest regional fit and maturity for UAT/Production, while Azure/GCP remain evaluated alternatives. | Azure/GCP | Consultant |
| DEC-P1-027 | Jun 2026 | Part 8.9 expanded to a 3-way comparison including self-managed VPS. Recommendation: AWS for UAT/Production; self-managed VPS (DigitalOcean/Hetzner) for Dev/QA only as a cost-saving hybrid. | AWS is preferred for compliance and production stability; VPS provides a lower-cost Dev/QA option without risking UAT/Production. | Full self-managed VPS for UAT/Production | Consultant |
| DEC-P1-026 | Jun 2026 | Part 9.1: Three-way mobile comparison (true native Swift/Kotlin, React Native, Flutter) conducted. React Native recommended on team/code-overlap grounds with the React web stack. Flagged for client confirmation; native fallback noted if proctoring lockdown proves infeasible in RN during technical discovery. | React Native maximizes shared web/mobile code and delivery speed while preserving a native fallback if needed. | Native-only mobile stack | Consultant |
| DEC-P1-028 | Jun 2026 | CONFIRMED by client: AWS for UAT/Production, accepting the cost premium over OCI for ecosystem maturity. OCI and full self-host VPS documented as evaluated alternatives, not selected. | Client accepted AWS premium for ecosystem maturity and compliance inheritance; OCI/VPS remain alternatives for future consideration. | OCI and full self-host VPS | Client |
| DEC-P1-029 | Jun 2026 | CONFIRMED by client: Part 12 Resource Plan restructured to a lean cross-utilised team with on-demand outsourced developer capacity. | Leaner staffing reduces cost while outsourcing mitigates single-point-of-failure and timeline risk. | Larger specialist team without outsourced backup | Client |
| DEC-P1-030 | Jun 2026 | CONFIRMED by client: Part 13 revised with labour rates in PKR and AI-assisted tooling applied for hours reduction. | Real Pakistan market salaries and AI tooling lowered the budget and timeline; AI seat costs flagged for later confirmation. | USD-based international contractor rates | Client |
| DEC-P1-031 | Jun 2026 | Part 13 concluded: detailed AI tool pricing and revised budget included. | Verified current pricing for all AI tools, selected Claude Code primary coding tool, and recalculated runtime quiz service costs. | Flat/estimated AI tool cost | Client |


---

## P2 — AI RevOps Engine

*No decisions logged yet — discovery not started.*

---

## P3 — AI Student Coach

*No decisions logged yet — discovery not started.*

---

## P4 — Dynamics 365 Bots

*No decisions logged yet — discovery not started.*

