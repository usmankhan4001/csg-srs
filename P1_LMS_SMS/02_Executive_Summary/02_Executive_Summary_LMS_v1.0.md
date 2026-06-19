# EXECUTIVE SUMMARY
## P1 — Learning Management System + School Management System
### Lighthouse Global School System | Master SRS v1.0

**Document:** 02_Executive_Summary_LMS_v1.0
**Classification:** Internal — Consultant Use Only
**Audience:** CEO, Board, Investors, Project Sponsor
**Date:** June 2026

---

## What We Are Building

Lighthouse Global School System requires a single, integrated platform to run every aspect of its online school — from a student joining a live class on a mobile phone in Karachi to a parent in London paying fees, a psychologist in Dubai running an aptitude assessment, and the CEO in one dashboard seeing enrollment conversion and revenue across all campuses.

The platform is **P1: LMS + School Management System** — a custom-built, SaaS, multi-tenant system delivered as a web application and native iOS/Android apps, supporting English, Arabic, and Urdu with full RTL layout. It replaces the current fragmented mix of WhatsApp groups, Excel spreadsheets, paper registers, and disconnected tools with a single source of truth accessible to every role in real time.

---

## Strategic Objectives

| # | Objective | Target | Measured By |
|---|---|---|---|
| 1 | Replace all manual administrative workflows | 100% of admissions, fees, attendance, timetabling, and HR processes on-platform at Go-Live | Zero manual Excel-based processes in operation 30 days post-launch |
| 2 | Enable live online teaching at scale | All classes delivered via the platform with auto-attendance and auto-recording | 100% of scheduled classes started via platform by end of Month 1 |
| 3 | Achieve Cognia accreditation readiness | Evidence for all 5 Cognia standards tagged and exportable | Cognia evidence package successfully exported before first accreditation review |
| 4 | Deliver real-time financial visibility | Fee collection rate, outstanding balances, and P&L accessible to CEO and School Admin in real time | CEO dashboard shows live financial data within 24 hours of Go-Live |
| 5 | Support Cambridge curriculum structure | Cambridge grade levels, subject codes, and assessment formats configured and operational | Cambridge academic year and grading scale live before first term |
| 6 | Scale to 100,000+ students without re-architecture | Multi-tenant architecture supports growth from 500 students at launch to 100,000+ | Architecture validated by load test at 2,000 concurrent users at launch; 20,000 at Year 1 |

---

## Scope

### In Scope — Version 1.0

20 functional modules across 7 user portals:

| Portal | Key Capability |
|---|---|
| Super Admin | Multi-school provisioning, subscription billing, global user management, platform configuration |
| CEO / Director | KPI dashboards, enrollment and financial analytics, board reporting, OKR tracking |
| School Admin | Admissions, timetabling, fee management, HR, reporting, Cognia evidence export |
| Teacher | Live classes, assignments, exams, gradebook, attendance, AI quiz generation |
| Student | Course content, live classes, exams with proctoring, grades, psychological assessment results |
| Parent | Child progress monitoring, fee payment, attendance alerts, teacher messaging |
| Psychologist | Psychological test administration, risk flagging, action plans, counselling management |

Payments: Stripe, PayPal, JazzCash, Easypaisa.
Live classes: Zoom, Google Meet, Microsoft Teams, Jitsi (self-hosted).
Curriculum: Cambridge International Education.
Compliance: Cognia evidence management, GDPR, FERPA, WCAG 2.1 AA.
Languages: English, Arabic (RTL), Urdu (RTL).

### Out of Scope — Version 1.0

P2 (AI Marketing & RevOps Engine), P3 (AI Student Coach), P4 (Dynamics 365 Guidance Bots), external accounting software integration, physical biometric hardware installation, transport GPS hardware procurement, third-party student information system migration beyond founding cohort.

### Deferred — Version 2.0

Advanced AI-powered learning analytics, peer-to-peer video tutoring, custom mobile app white-labelling per school, blockchain-verified certificates, parent-facing mobile app (PWA covers v1.0).

---

## Success Criteria & KPIs

| KPI | Target at Go-Live | Target at 6 Months |
|---|---|---|
| Platform uptime | 99.9% (43 min/month downtime max) | 99.9% |
| API response time | p95 < 300ms | p95 < 300ms |
| Concurrent users supported | 2,000 | 20,000 |
| Fee collection processing time | Invoice to payment < 24 hours (online) | < 12 hours |
| Attendance SMS to parent | Within 5 minutes of marking | Within 5 minutes |
| Exam auto-grading | MCQ results within 3 seconds of submission | Within 3 seconds |
| Recording availability | Within 30 minutes of class end | Within 30 minutes |
| Cognia evidence export | Full 5-standard package exportable | Full package + new term evidence |

---

## Timeline

| Milestone | Date |
|---|---|
| Kickoff — Scope Lock signed, team onboarded | 6 July 2026 |
| Foundation complete — Auth, RBAC, multi-tenant | 18 July 2026 |
| Core Academic complete — M01–M07 | 28 August 2026 |
| Finance & Operations complete — M08–M12, M15 | 25 September 2026 |
| Specialised & Compliance complete — M13, M14, M16, M19 | 13 October 2026 |
| Feature complete / Code freeze | 16 October 2026 |
| Penetration test complete | 24 October 2026 |
| UAT sign-off | 14 November 2026 |
| **Go-Live — Production** | **30 November 2026** |

Total build duration: **20 weeks (~4.6 months)**. 1.6 weeks of schedule buffer built in before Go-Live.

---

## Budget

| Category | PKR | USD |
|---|---|---|
| Development + Design (all 20 modules) | 2,057,944 | ~$7,403 |
| Combined Lead — PM/Architecture/QA overhead | 1,332,173 | ~$4,792 |
| Security Consultant (2 engagements) | 1,200,000 | ~$4,317 |
| Infrastructure during build (AWS + VPS) | 1,151,710 | ~$4,143 |
| AI development tooling (Claude Code, 7 seats) | 1,123,557 | ~$4,042 |
| Contingency (15%) | 1,029,808 | ~$3,704 |
| **Total Project Budget** | **PKR 7,895,191** | **~$28,400** |

Monthly operating costs post-launch: ~PKR 842,500–860,000/month (AWS infrastructure, AI API, SMS/email gateways, security consultant amortised).

Exchange rate used: 278 PKR = 1 USD (June 2026).

---

## Team

| Role | Person | Commitment |
|---|---|---|
| Combined Lead (Architect + PM + QA + DevOps) | TBC | Full-time, 20 weeks |
| Backend Lead + 2 Junior Interns | TBC | Full-time, 20 weeks |
| Frontend + Mobile Lead + 2 Junior Interns | TBC | Full-time, 20 weeks |
| UI/UX Designer | TBC | Part-time, contracted per module |
| Security Consultant | TBC (OSCP-certified) | 2 engagements (Oct 2026 + post-launch) |

The team is deliberately lean. On-demand outsourced capacity is a formally funded contingency (Part 12.1.1) — not an afterthought — available if the Combined Lead is unavailable or any phase risks slipping.

---

## Top Risks

| Risk | Level | Primary Mitigation |
|---|---|---|
| JazzCash/Easypaisa merchant account approval delay | HIGH | Client initiates applications at Kickoff — not at Phase 3 |
| AI-tooling productivity assumption not met | HIGH | 15% contingency + on-demand outsourced capacity both funded |
| Pakistan data residency regulation (RISK-C-004) | HIGH | Client legal counsel review before Go-Live; AWS region migration path pre-planned |
| Combined Lead single point of failure | MEDIUM | Decision Log maintained daily; on-demand capacity lever funded |
| Scope creep post Scope Lock signature | MEDIUM | Formal CR process (Part 17.1) — no development starts without signed approval |

Full risk register: 30 risks across 6 categories in Part 16 of the Master SRS.

---

## Decisions Already Locked

- **Platform:** Custom microservices build — no off-the-shelf platform meets the combined LMS + SMS + Psychological Assessment + Cognia + local payment scope (9 platforms evaluated, Part 8.1).
- **Cloud:** AWS (me-central-1, UAE) for Production and UAT. VPS (Dev/QA only).
- **Mobile:** React Native. Native fallback for exam proctoring screen only.
- **Payments:** Stripe + PayPal (international) + JazzCash + Easypaisa (Pakistan local).
- **Video:** Zoom + Google Meet + Microsoft Teams (API integrations) + Jitsi (self-hosted fallback).
- **AI Quiz Service:** Claude Sonnet 4.6 (Anthropic) via provider-agnostic LLM proxy.
- **Budget:** PKR 7,895,191 including 15% contingency.
- **Go-Live date:** 30 November 2026.

Full decision log: 31 decisions (DEC-P1-001 through DEC-P1-031) in Appendix I of the Master SRS.

---

*For full technical, functional, UI/UX, and project detail — see the Master SRS document (01_Master_SRS_LMS_v1.0). This summary covers Layer 1 (Business & Strategy) only.*

*Lighthouse Global School System — P1 Executive Summary — Internal — v1.0*
