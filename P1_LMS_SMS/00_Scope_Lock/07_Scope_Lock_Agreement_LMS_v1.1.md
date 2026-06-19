# SCOPE LOCK AGREEMENT
## P1 — Learning Management System + School Management System
### Lighthouse Global School System | Master SRS Production

---

| Field | Value |
|---|---|
| **Document Title** | Scope Lock Agreement — P1: LMS + SMS |
| **Document Status** | DRAFT — Awaiting Client Signature |
| **Version** | 1.1 |
| **Classification** | Internal — Consultant Use Only |
| **Product** | P1: LMS + School Management System |
| **Prepared By** | SRS Consultant — Lighthouse Global School System |
| **Date** | June 2026 |
| **Change Request Clause** | Any additions to IN SCOPE after signature require a formal Change Request with impact assessment and written approval. |

---

## 1. Purpose

This Scope Lock Agreement defines the exact boundary of P1 version 1.0 before any SRS writing begins. It classifies every module, feature, integration, and platform into one of three states: **IN SCOPE** for v1.0, **DEFERRED** to v2.0, or **OUT OF SCOPE**. Once signed, this document governs what the Master SRS will specify and what will be built. Any addition to the IN SCOPE list after signature requires a formal Change Request.

---

## 2. Discovery Session — Locked Decisions

| Decision Area | Confirmed Decision | Notes |
|---|---|---|
| **Platform Selection** | Consultant produces full comparison and recommendation in SRS Part 8.1 | Odoo, Moodle, Open edX, Frappe/ERPNext evaluated |
| **Geographic Base** | Pakistan primary. SaaS architecture for global scalability from day one. Multi-currency and multi-jurisdiction required. | PKR primary; USD, AED, GBP supported |
| **Cambridge Programmes** | All programmes in v1.0: Primary, Lower Secondary, IGCSE, AS & A-Level. Full Cambridge compliance including Cognia-eligibility. | Full Cambridge suite |
| **Budget** | Consultant proposes. Must be market-realistic with full justification. | Included in SRS Part 13 |
| **Timeline** | Consultant recommends. Realistic and urgent — not artificially compressed. | Included in SRS Part 14 |
| **Data Migration** | None. Clean build from scratch. | Zero migration scope |
| **Schools at Launch** | 1 school at v1.0 go-live. Architecture must support multi-tenant SaaS from day one for 100,000+ students. | Single tenant at launch |
| **Mobile Stack** | Consultant evaluates Native (Swift/Kotlin) vs Cross-platform (React Native/Flutter) and recommends with full comparison table in SRS Part 9.1 | Decision in SRS |
| **PWA** | Ships in v1.0 as a core offline layer alongside web. Not a fallback — a confirmed deliverable. | Always in v1.0 |
| **Languages (v1.0)** | English + Arabic (RTL) + Urdu (RTL). Full RTL support across all screens. | 3 languages in v1.0 |
| **Cloud Infrastructure** | Consultant produces full AWS vs Azure vs GCP vs self-hosted VPS comparison and recommendation in SRS Part 8.9 | No pre-selected vendor |
| **Physical School Scope** | System serves both online and physical schools. All physical school management modules are in scope for v1.0. | Full SMS scope confirmed |
| **P3 Integration** | P1 exposes API endpoints and integration hooks for P3 (AI Student Coach) to plug into. No P3 features built inside P1. | Integration-ready architecture |
| **Payment Architecture** | Each payment gateway must be configurable per school (tenant-level). Plug-and-play credentials per school. No platform-level lock-in. | SaaS multi-tenant requirement |

---

## 3. Portals — v1.0 Scope

All 7 portals are IN SCOPE for v1.0.

| # | Portal | Primary Users | Status |
|---|---|---|---|
| 1 | Super Admin Portal | Platform Administrator | **IN SCOPE** |
| 2 | CEO / Director Portal | CEO, School Director | **IN SCOPE** |
| 3 | School Admin Portal | School Administrator | **IN SCOPE** |
| 4 | Teacher Portal | Subject Teachers, Class Teachers | **IN SCOPE** |
| 5 | Student Portal | Enrolled Students | **IN SCOPE** |
| 6 | Parent Portal | Parents / Guardians | **IN SCOPE** |
| 7 | Psychologist Portal | School Psychologist, Counsellors | **IN SCOPE** |

---

## 4. Module Scope — v1.0

| # | Module / Feature | Category | Decision | Source |
|---|---|---|---|---|
| M01 | Live Online Classes — Jitsi (built-in) + Zoom + Google Meet + Teams | LMS Core | **IN SCOPE** | High Level SRS |
| M02 | Assignment Module — all types, rubric builder, plagiarism check | LMS Core | **IN SCOPE** | High Level SRS |
| M03 | Exam Module + AI Quiz Generation Bot | LMS Core | **IN SCOPE** | High Level SRS + Guide |
| M04 | Gradebook Module | LMS Core | **IN SCOPE** | High Level SRS |
| M05 | Attendance Module — digital, biometric, RFID, QR, GPS geofence | LMS Core | **IN SCOPE** | High Level SRS |
| M06 | Fee Management — Stripe, PayPal, JazzCash, Easypaisa (per-tenant config) | SMS Finance | **IN SCOPE** | High Level SRS |
| M07 | Timetable / Scheduling Module | SMS Academic | **IN SCOPE** | High Level SRS |
| M08 | Communication Module — messaging, announcements, WhatsApp, SMS, email | Communication | **IN SCOPE** | High Level SRS |
| M09 | Library Management — digital resources only (e-books, journals, digital catalog) | Academic Support | **IN SCOPE** | High Level SRS |
| M10 | Admissions Module — full workflow, drag-and-drop form builder | SMS Admin | **IN SCOPE** | High Level SRS |
| M11 | Psychological Assessment Module — 5 test types, action plans, counselling | Student Wellbeing | **IN SCOPE** | High Level SRS |
| M12 | HR Management Module | SMS HR | **IN SCOPE** | Detailed Specs |
| M13 | Payroll Management Module | SMS HR | **IN SCOPE** | Detailed Specs |
| M14 | Full Double-Entry Accounting — chart of accounts, journal entries, ledger, trial balance, P&L, balance sheet. Covers all financial operations including fees, expenses, payroll accounting, and reporting. | SMS Finance | **IN SCOPE** | Detailed Specs + Guide |
| M15 | Transport Management — routes, GPS tracking, driver management, parent notifications | SMS Operations | **IN SCOPE** | High Level SRS |
| M16 | Cognia Evidence Management — audit trails, outcome tracking, standards mapping, compliance reports | Compliance | **IN SCOPE** | Detailed Specs + Guide |
| M17 | Multi-School Onboarding Admin Tools — school creation, config, module enable/disable, user limits | Platform | **IN SCOPE** | High Level SRS |
| M18 | Physical Library Catalog — barcode/RFID stock management | Academic Support | **DEFERRED v2.0** | Scope Decision |
| M19 | Additional Languages beyond EN / AR / UR | Platform | **DEFERRED v2.0** | Scope Decision |

---

## 5. Integration Scope — v1.0

| # | Integration | Purpose | Status | Notes / Risk |
|---|---|---|---|---|
| I01 | Jitsi Meet (open source, self-hosted) | Built-in video engine | **IN SCOPE** | No per-user cost |
| I02 | Zoom API | Live class platform option | **IN SCOPE** | API keys provided by client |
| I03 | Microsoft Teams API | Live class platform option | **IN SCOPE** | Azure AD app registration required |
| I04 | Google Meet + Calendar API | Live class + calendar sync | **IN SCOPE** | OAuth 2.0 |
| I05 | Stripe | International payments | **IN SCOPE** | Per-tenant credentials. Plug-and-play per school. |
| I06 | PayPal | International payments | **IN SCOPE** | Per-tenant credentials. Plug-and-play per school. |
| I07 | JazzCash | Pakistan payments | **IN SCOPE** | Per-tenant credentials. Plug-and-play per school. |
| I08 | Easypaisa | Pakistan payments | **IN SCOPE** | Per-tenant credentials. Plug-and-play per school. |
| I09 | WhatsApp Business API | Bulk messaging + alerts | **IN SCOPE** | ⚠️ Meta approval: 2–4 weeks. Client action required Week 1. |
| I10 | SMS Gateway — Twilio / local provider | OTP + alerts + reminders | **IN SCOPE** | Per-tenant API keys |
| I11 | Email Service — SendGrid / AWS SES / open source self-hosted (e.g. Postal, Mautic) | Transactional email | **IN SCOPE** | Comparison and recommendation in SRS |
| I12 | Biometric / RFID Systems | Attendance hardware | **IN SCOPE** | Generic API layer supporting popular market standards. Hardware sourced by school. |
| I13 | Cambridge Submission Portals | Grade / data submission | **IN SCOPE** | ⚠️ API availability unconfirmed. Client to engage Cambridge. CRITICAL risk. |
| I14 | Turnitin / Copyleaks | Plagiarism detection | **IN SCOPE** | Licence required |
| I15 | Google Calendar / Outlook / Apple Calendar | Timetable + schedule sync | **IN SCOPE** | OAuth 2.0 |
| I16 | Push Notifications — Firebase Cloud Messaging or evaluated open source alternative | Mobile + web push | **IN SCOPE** | Alternatives evaluated in SRS |
| I17 | CDN — AWS CloudFront / Cloudflare | Recordings + static assets delivery | **IN SCOPE** | Costed in infrastructure budget |

---

## 6. Platform & Technology Scope — v1.0

| Platform / Technology | Specification | Status |
|---|---|---|
| Web Application | React.js or Vue.js with TypeScript. Responsive. All modern browsers. | **IN SCOPE** |
| Mobile Stack | Consultant evaluates Native (Swift + Kotlin) vs Cross-platform (React Native / Flutter) in SRS Part 9.1. Recommendation with full comparison table. | **IN SCOPE — decision in SRS** |
| PWA (Progressive Web App) | Offline capability layer for web. Ships in v1.0 always. | **IN SCOPE** |
| English Language | Full UI, content, and notifications | **IN SCOPE** |
| Arabic Language + RTL | Full RTL layout. All screens mirrored. Arabic UI and content. | **IN SCOPE** |
| Urdu Language + RTL | Full RTL layout. All screens mirrored. Urdu UI and content. | **IN SCOPE** |
| Multi-Tenancy Architecture | Single tenant at launch. Architecture must support 100,000+ students and unlimited schools from day one. | **IN SCOPE** |
| Cambridge: Primary Programme | Full curriculum structure, assessment, grade reporting, Cognia-compliance evidence | **IN SCOPE** |
| Cambridge: Lower Secondary | Full curriculum structure, assessment, grade reporting | **IN SCOPE** |
| Cambridge: IGCSE (O-Level) | Curriculum structure, assessment, grade submission to Cambridge | **IN SCOPE** |
| Cambridge: AS & A-Level | Curriculum structure, assessment, grade submission to Cambridge | **IN SCOPE** |

---

## 7. Explicitly Out of Scope — v1.0

| # | Item Excluded | Reason / Notes |
|---|---|---|
| X01 | AI Student Coach features (P3) | P3 is a separate product with its own SRS. P1 exposes integration API hooks only. No AI tutoring, coaching, or recommendation features built inside P1. |
| X02 | AI Marketing & Sales RevOps Engine (P2) | Separate product. Covered in P2 SRS. P1 exposes lead/enrolment data via API. |
| X03 | Dynamics 365 Guidance Bots (P4) | Separate product. Covered in P4 SRS. |
| X04 | Custom video conferencing infrastructure | Jitsi Meet used as open source built-in engine. No custom video stack. |
| X05 | Third-party accounting software integration | Double-entry accounting built natively in P1. Optional: data export via API/webhook for schools that use external accounting tools. Export-only, not sync. |
| X06 | Physical library barcode/RFID stock management | Digital resources only in v1.0. Physical stock catalog deferred to v2.0. |
| X07 | Additional languages beyond EN / AR / UR | v2.0. Language pack architecture supports future additions without code changes. |

---

## 8. Open Risks — Client Action Required

| ID | Risk | Action Required | Owner | Priority | Deadline |
|---|---|---|---|---|---|
| R01 | Cambridge API availability unconfirmed | Engage Cambridge International to confirm API access, documentation, and data format for grade submission before development sprint begins | Client | **CRITICAL** | Week 2 |
| R02 | WhatsApp Business API approval | Submit Meta Business verification and WhatsApp Business API application at project kickoff | Client | **HIGH** | Week 1 |
| R03 | JazzCash merchant account | Apply for JazzCash merchant API credentials | Client | **HIGH** | Week 2 |
| R04 | Easypaisa merchant account | Apply for Easypaisa merchant API credentials | Client | **HIGH** | Week 2 |
| R05 | Biometric hardware compatibility | Confirm biometric hardware brands to be deployed. Consultant builds generic API layer; specific adapters for confirmed vendors. | Client | **MEDIUM** | Week 4 |
| R06 | Zoom / Teams API keys | Provide Zoom Developer API keys and Microsoft Azure App Registration for Teams | Client | **MEDIUM** | Week 2 |

---

## 9. Change Request Clause

> Any addition to the IN SCOPE list after this document is signed requires a formal Change Request containing:
> 1. Written description of the addition
> 2. Impact assessment: estimated additional cost and timeline impact
> 3. Written approval from both client representative and consultant
> 4. Amendment to this Scope Lock Agreement with version increment

---

## 10. Approvals & Signatures

By signing below, both parties confirm that the scope defined in Sections 3–7 is complete and agreed. No additions will be made to v1.0 scope without a formal Change Request.

| | Client Representative | Consultant |
|---|---|---|
| **Name** | ___________________________ | ___________________________ |
| **Title** | ___________________________ | ___________________________ |
| **Signature** | ___________________________ | ___________________________ |
| **Date** | ___________________________ | ___________________________ |

---
*Lighthouse Global School System — Internal Document — Consultant Use Only — v1.1*
