# PART 1 — PROJECT DEFINITION
## P1 — Learning Management System + School Management System
### Layer 1 — Business & Strategy

**Status:** ✅ Complete
**Layer Gate:** Passed

---

## 1.1 Product Vision

P1 is an AI-ready multi-tenant SaaS platform delivering a complete LMS and SMS in a single product, built first for Pakistan and the GCC and designed to scale globally, enabling any Cambridge-compliant school — online or physical — to manage every academic, administrative, financial, and student wellbeing operation from one platform in English, Arabic, and Urdu.

---

## 1.2 Strategic Objectives

| # | Objective | Measurable Target | Business Outcome |
|---|---|---|---|
| SO-01 | Deliver a production-ready multi-tenant SaaS LMS+SMS | v1.0 live with 1 school onboarded. Architecture supports unlimited schools without code changes. | Revenue-generating platform from day one |
| SO-02 | Support full Cambridge International curriculum | All 4 programmes operational: Primary, Lower Secondary, IGCSE, AS & A-Level. Grade submission to Cambridge portals functioning. | Cambridge-compliant school operations |
| SO-03 | Build a Cognia accreditation-ready platform | Evidence management module operational. Audit trails complete. Compliance reports generatable on demand. | Foundation for Cognia accreditation submission |
| SO-04 | Achieve platform reliability target | 99.9% uptime per calendar month. | Trustworthy platform schools depend on daily |
| SO-05 | Support school growth from 500 to 100,000+ students | Platform handles 10,000 concurrent users at launch. Auto-scales to 100,000+ without architecture rebuild. | No re-platforming cost as schools grow |
| SO-06 | Eliminate manual school financial operations | Full double-entry accounting, fee management, and payroll operational. 4 payment gateways live. Invoice-to-receipt cycle fully automated. | Reduction in finance admin headcount per school |
| SO-07 | Serve multilingual markets from day one | English, Arabic (RTL), and Urdu (RTL) fully operational at launch. Every screen, notification, and report available in all 3 languages. | Access to Pakistan, GCC, and global diaspora markets simultaneously |
| SO-08 | Establish integration-ready architecture for P3 | P1 exposes documented API endpoints for P3 (AI Student Coach) to connect without modifying the P1 codebase. | AI coaching product enabled by P1 data foundation |

---

## 1.3 Scope Statement

### 1.3.1 In Scope — Version 1.0

| # | Item | Category |
|---|---|---|
| S-01 | 8 role-based portals: Super Admin, CEO, School Admin, Teacher, Student, Parent, Psychologist, Staff (non-teaching staff — librarians, accountants, and similar roles, with sub-role permissions configured via the custom role system) | Platform |
| S-02 | School Live Online Classes — virtual classrooms for teacher-led lessons via Jitsi (built-in), Zoom, Google Meet, and Microsoft Teams | LMS Core |
| S-03 | School Assignment Management — teachers create, distribute, and mark student assignments with file upload, text, URL, peer review, group work, rubric-based marking, and plagiarism detection | LMS Core |
| S-04 | School Examination Management — teachers create and administer online exams with 10 question types, question banks, AI-generated quiz questions from syllabus content, and anti-cheating proctoring | LMS Core |
| S-05 | School Gradebook — teachers record, calculate, and publish student grades with weighted categories, custom grading formulas, and automated report card generation | LMS Core |
| S-06 | School Attendance Management — daily and period-wise student and staff attendance via digital marking, biometric readers, RFID, QR code, and GPS geofence check-in | LMS Core |
| S-07 | School Fee Management — school-specific fee structures, automated invoicing, and online payment collection via Stripe, PayPal, JazzCash, and Easypaisa, all configured per school | SMS Finance |
| S-08 | School Timetable and Class Scheduling — drag-and-drop timetable builder with AI-powered auto-scheduling, conflict detection, and substitute teacher management | SMS Academic |
| S-09 | School Communication — internal messaging between staff, teachers, students, and parents via WhatsApp Business, SMS, email, and in-app announcements | Communication |
| S-10 | School Digital Library — management of e-books, academic journals, and digital learning resources accessible to students and teachers | Academic Support |
| S-11 | Student Admissions Management — online application forms, document verification, interview scheduling, acceptance letters, and enrolment conversion tracking | SMS Admin |
| S-12 | Student Wellbeing and Psychological Assessment — five standardised tests (Personality, Career, Aptitude, IQ, EQ), personalised action plans, and counselling session management | Student Wellbeing |
| S-13 | School Staff Management — teacher and non-teaching staff profiles, employment contracts, qualifications, leave management, and performance tracking | SMS HR |
| S-14 | School Staff Payroll — monthly salary processing, tax deductions, allowances, payslip generation, and payroll reports for all school staff | SMS HR |
| S-15 | School Financial Management — complete double-entry accounting covering fee income, school expenses, budget management, ledger, trial balance, P&L statement, and balance sheet for school operations | SMS Finance |
| S-16 | School Transport Management — student route planning, GPS vehicle tracking, driver management, and automated parent notifications for pickup and drop-off | SMS Operations |
| S-17 | Cognia Accreditation Evidence Management — structured storage of teaching standards evidence, learning outcome records, audit trails, and accreditation compliance reports | Compliance |
| S-18 | Multi-School Onboarding and Administration — school creation, module configuration, per-school branding, user limits, and platform administration for multiple school tenants | Platform |
| S-19 | Web application — React.js or Vue.js with TypeScript, responsive, all modern browsers | Platform |
| S-20 | Mobile applications — iOS and Android (stack determined by SRS Part 9.1 recommendation) | Platform |
| S-21 | PWA — offline capability layer for web | Platform |
| S-22 | English, Arabic (RTL), Urdu (RTL) — full language support across all screens, notifications, and reports | Platform |
| S-23 | Multi-tenant SaaS architecture — single platform instance supporting unlimited schools | Platform |
| S-24 | Cambridge International Curriculum Support — full curriculum structure, assessment framework, grade reporting, and direct submission to Cambridge portals for Primary, Lower Secondary, IGCSE, and AS & A-Level | Academic |
| S-25 | P3 Integration API hooks — P1 exposes documented endpoints for AI Student Coach to connect to student academic records, attendance, assessments, and wellbeing data | Integration |

### 1.3.2 Out of Scope — Version 1.0

| # | Item | Reason |
|---|---|---|
| X-01 | AI Student Coach features (P3) | Separate product. P1 exposes API hooks only. No AI tutoring or coaching features built inside P1. |
| X-02 | AI Marketing & Sales RevOps Engine (P2) | Separate product with its own SRS. |
| X-03 | Dynamics 365 Guidance Bots (P4) | Separate product with its own SRS. |
| X-04 | Custom video conferencing infrastructure | Jitsi Meet used as open source built-in engine. No proprietary video stack built. |
| X-05 | Third-party accounting software sync | Native accounting built in P1. Data export via API available; two-way sync with QuickBooks or Xero is out of scope. |
| X-06 | Physical library catalog — barcode/RFID stock management | Digital resources only in v1.0. Physical stock catalog in v2.0. |

### 1.3.3 Deferred — Version 2.0

| # | Item | Reason for Deferral |
|---|---|---|
| D-01 | Physical library barcode and RFID stock management | Low priority for online-primary school. Digital catalog serves v1.0 need. |
| D-02 | Additional languages beyond English, Arabic, Urdu | Language pack architecture supports addition without code changes. Market demand determines priority. |
| D-03 | Multi-school branch comparison analytics (CEO portal) | Requires multiple schools live. Unlocks naturally as platform grows. |
| D-04 | Multi-jurisdiction payroll (UAE, UK, Saudi Arabia) | Pakistan payroll rules in v1.0. Additional jurisdictions added as v2.0 rules extensions. |
| D-05 | Third-party accounting software sync (QuickBooks, Xero) | Native accounting covers v1.0 need entirely. |

---

## 1.4 Success Criteria & KPIs

| # | KPI | Target Value | Measurement Method | Review Frequency |
|---|---|---|---|---|
| KPI-01 | Platform uptime | 99.9% per calendar month | Automated uptime monitoring (Datadog / UptimeRobot) | Monthly |
| KPI-02 | API response time | < 300ms at p95 | APM tool (Datadog / New Relic) | Weekly |
| KPI-03 | Page load time | < 2 seconds on 4G connection | Lighthouse / Real User Monitoring | Weekly |
| KPI-04 | Concurrent users at launch | 10,000 | Load test pre-go-live | Pre-launch + quarterly |
| KPI-05 | Concurrent users by Year 3 | 100,000 | Load test + auto-scale verification | Annual |
| KPI-06 | Live class participants per session | 1,000 | Stress test on Jitsi SFU | Pre-launch |
| KPI-07 | Video streaming latency | < 500ms end-to-end | In-session latency measurement | Per release |
| KPI-08 | Mobile app crash rate | < 0.1% of sessions | Firebase Crashlytics | Weekly |
| KPI-09 | Recovery Point Objective (RPO) | < 1 hour data loss | Backup verification test | Monthly |
| KPI-10 | Recovery Time Objective (RTO) | < 4 hours full restoration | Disaster recovery drill | Quarterly |
| KPI-11 | Security — pen test findings at go-live | 0 critical, 0 high vulnerabilities | Third-party penetration test report | Pre-launch + annually |
| KPI-12 | WCAG 2.1 AA compliance | 100% of screens pass automated checks | axe / Lighthouse accessibility audit | Per release |
| KPI-13 | Cambridge submission accuracy | 0 data errors in grade submissions | Cambridge confirmation receipts | Per submission cycle |
| KPI-14 | Database query time | < 100ms at p95 for all standard queries | APM query monitoring | Weekly |
| KPI-15 | File upload success rate | > 99.5% for files up to 500MB | Storage service monitoring | Weekly |

---

## 1.5 Business Drivers

| # | Driver | Detail |
|---|---|---|
| BD-01 | No integrated platform for Cambridge schools | No single product combines LMS + SMS + Accounting + HR + Payroll + Psychological Assessment + Cambridge compliance. Schools currently use 4–6 disconnected tools with no unified data view. |
| BD-02 | Pakistan and GCC markets underserved | No SaaS LMS+SMS exists with native JazzCash, Easypaisa, Arabic RTL, and Urdu RTL support built from the ground up. |
| BD-03 | Cognia accreditation requires structured evidence management | Manual evidence collection across scattered systems is a compliance risk. Cognia assessors require documented, auditable, structured records. |
| BD-04 | Cambridge schools lack a purpose-built digital platform | Cambridge programme structures — checkpoint assessments, predicted grades, Cambridge submission formats — are not natively supported by any open-source LMS. Schools resort to manual workarounds. |
| BD-05 | No school platform delivers a personalised AI coach per student | Personalisation requires every student's grades, attendance, assessments, and wellbeing data held in one place — not scattered across disconnected tools. P1 builds that unified foundation, making a truly personalised AI coaching experience per student possible for the first time. |
| BD-06 | School leadership has no real-time financial visibility | School leadership currently operates with financial data scattered across spreadsheets, fee software, and accounting tools with no single live view. Fee collection status, outstanding balances, payroll costs, and budget variance are only visible after manual consolidation. P1 eliminates that scatter with a live financial dashboard giving leadership instant, accurate financial visibility. |

---

## 1.6 Expected ROI & Value

| # | Value Area | Quantified Benefit | Basis |
|---|---|---|---|
| V-01 | Tool consolidation saving | $200–$800/month per school saved by replacing Moodle hosting + iSAMS/Classter + QuickBooks + HR tool | Vendor pricing comparison |
| V-02 | Admin time reduction | 15–20 hours/week per school admin saved through automated invoicing, attendance, and reporting | Industry benchmark |
| V-03 | Faster fee collection | Automated reminders + online payment reduces average collection cycle from 30+ days to under 7 days | Payment automation benchmark |
| V-04 | Admissions conversion | Structured funnel + automated follow-up increases inquiry-to-enrolment conversion by estimated 15–25% | CRM benchmark |
| V-05 | SaaS revenue model | Zero marginal cost per additional school beyond infrastructure. Unlimited schools on one instance. | SaaS unit economics |
| V-06 | P3 enablement | P1 is a hard dependency for P3 (AI Student Coach). Without P1 in production, P3 has no student academic records, attendance, assessments, or wellbeing data to personalise coaching with. | Product architecture |

---

## 1.7 Assumptions

| # | Assumption |
|---|---|
| A-01 | Cambridge Assessment provides a REST API secured with OAuth 2.0 via their Developer Portal (developer.cambridgeassessment.org.uk). Sandbox credentials are available immediately upon registration. Live credentials require Cambridge's approval. The client must register and apply for sandbox credentials before the Cambridge integration sprint begins, and apply for live credentials at project kickoff to start the approval clock. |
| A-02 | The client will obtain all required merchant accounts (JazzCash, Easypaisa, Stripe, PayPal) before fee management development begins. |
| A-03 | Meta will approve the WhatsApp Business API application within 4 weeks of project kickoff submission. |
| A-04 | Schools will source and procure their own biometric attendance hardware. The platform provides a generic integration API; hardware compatibility is the school's responsibility. |
| A-05 | Cloud infrastructure will be provisioned as recommended in SRS Part 8.9. Infrastructure costs are separate from development costs. |
| A-06 | Course content, curriculum documents, and question banks will be provided by the school. The platform provides the container; content population is the school's responsibility. |
| A-07 | Cognia accreditation active submission will begin after v1.0 is live. The platform provides evidence infrastructure; the accreditation process is the school's responsibility. |
| A-08 | Each school uploads its own Chart of Accounts. The platform provides the double-entry accounting engine; the chart of accounts structure is the school's responsibility and supports any country or currency. |
| A-09 | Payroll tax and deduction calculations in v1.0 are based on Pakistan labour law only. Schools operating under UAE, UK, or Saudi payroll rules will require a v2.0 payroll rules extension. |
| A-10 | Tenant isolation is at the database level. Each school gets isolated data storage. A shared database with tenant ID column is not acceptable due to data privacy requirements. |

---

## 1.8 Constraints

| # | Constraint | Impact |
|---|---|---|
| C-01 | Budget: consultant proposes — must be market-realistic | Scope phasing may be required. Detailed in Part 13. |
| C-02 | Timeline: urgent but not artificially compressed | Minimum realistic timeline defined in Part 14. Compression below minimum creates delivery risk. |
| C-03 | Cambridge live API credentials: require Cambridge approval | Cambridge integration sprint cannot go live until live credentials are approved. Sandbox credentials unblock development immediately. |
| C-04 | WhatsApp Business API: requires Meta approval (2–4 weeks) | WhatsApp features untestable until approval received. Must be submitted at project kickoff. |
| C-05 | Pakistan payroll law only in v1.0 | Multi-jurisdiction payroll requires separate rules engine. Not in v1.0. |
| C-06 | Single school at v1.0 launch | Multi-school load testing is a v2.0 activity. Architecture must support it; live testing deferred. |
| C-07 | Mobile stack decision pending Part 9.1 | Mobile development cannot begin until Native vs Cross-platform decision is documented and approved in Part 9.1. |
| C-08 | WCAG 2.1 AA compliance required for all screens | Non-compliant components block UAT sign-off. |

---

## 1.9 Dependencies

| # | Dependency | Type | Owner | Blocks |
|---|---|---|---|---|
| DEP-01 | Cambridge Assessment Developer Portal registration + sandbox credentials | External | Client | Cambridge integration development sprint |
| DEP-02 | Cambridge live API credentials approval | External | Cambridge / Client | Cambridge grade submission go-live |
| DEP-03 | WhatsApp Business API Meta approval | External | Client | WhatsApp in Communication Module (S-09) |
| DEP-04 | JazzCash merchant API credentials | External | Client | JazzCash payment option (S-07) |
| DEP-05 | Easypaisa merchant API credentials | External | Client | Easypaisa payment option (S-07) |
| DEP-06 | Cloud infrastructure provisioned | Internal | Consultant / Client | All Dev, QA, UAT, Production environments |
| DEP-07 | Mobile stack decision approved (Part 9.1) | Internal | Consultant | Mobile app development start |
| DEP-08 | Platform selection decision approved (Part 8.1) | Internal | Consultant | All backend architecture and development |
| DEP-09 | P1 v1.0 in production | Internal | Consultant | P3 (AI Student Coach) student data availability |
| DEP-10 | Biometric hardware vendor confirmed by school | External | Client | Biometric attendance adapter (S-06) |
| DEP-11 | Zoom Developer API keys | External | Client | Zoom live class integration (S-02) |
| DEP-12 | Microsoft Azure App Registration for Teams | External | Client | Teams live class integration (S-02) |

---

## 1.10 Definitions & Acronyms

All terms are defined in **Part 0, Section 0.7**.
Cross-reference: `Part_0_Document_Control.md → Section 0.7`

---

*Lighthouse Global School System — P1 Master SRS — Part 1 — Layer 1 — Internal — v1.0*
