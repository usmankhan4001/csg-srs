# PART 0 — DOCUMENT CONTROL
## P1 — Learning Management System + School Management System
### Lighthouse Global School System | Master SRS v1.0

---

## 0.1 Cover Page

| Field | Value |
|---|---|
| **Document Title** | Master Software Requirements Specification — P1: LMS + School Management System |
| **Document Status** | IN PROGRESS |
| **Version** | 1.0 |
| **Classification** | Internal — Consultant Use Only |
| **Client** | Lighthouse Global School System |
| **Product** | P1: LMS + School Management System |
| **Prepared By** | SRS Consultant — Lighthouse Global School System |
| **Date Initiated** | June 2026 |
| **Target Completion** | TBD — see Part 14 |
| **Scope Lock Reference** | `00_Scope_Lock/07_Scope_Lock_Agreement_LMS_v1.1.md` |
| **Related Products** | P2: AI RevOps Engine / P3: AI Student Coach / P4: D365 Bots |

---

## 0.2 Confidentiality Notice

This document is classified **Internal — Consultant Use Only**.

It shall not be shared with any third party, developer, vendor, or investor without written authorisation from the client. Distribution is limited to the individuals named in Section 0.5.

This document constitutes a contractual and governance record. Any reproduction, extraction, or distribution of its contents without authorisation is prohibited.

---

## 0.3 Version History

| Version | Date | Author | Status | Change Summary |
|---|---|---|---|---|
| 0.1 | Jun 2026 | SRS Consultant | Draft | Document structure created. Scope Lock signed. |
| 1.0 | TBD | SRS Consultant | In Progress | Active writing — updated per session |

---

## 0.4 How to Use This Document

This document is structured in five discipline layers. Each layer is self-contained. Read only the layer relevant to your role.

| Your Role | Read These Parts | Skip These Parts |
|---|---|---|
| **CEO / Board / Investor** | Part 1, Part 2, Part 3 (Layer 1 only) | Parts 4–17 |
| **Product Manager / BA** | Part 4, Part 5 (Layer 2) | Parts 6–17 |
| **UI/UX Designer** | Part 6, Part 7 (Layer 3) | Parts 8–17 |
| **Developer / Architect** | Parts 8–11 (Layer 4) | Parts 1–7, 12–17 |
| **Project Manager / Finance** | Parts 12–17 (Layer 5) | Parts 1–11 |
| **QA Engineer** | Part 15 + Appendix E | All others |

> **Rule:** A developer shall never need to read Layer 1 to understand a technical requirement. A CEO shall never need to read Layer 4 to understand what the product does.

---

## 0.5 Distribution List

| Name | Role | Access Level | Date Distributed |
|---|---|---|---|
| TBD | Client Representative | Full document | TBD |
| TBD | SRS Consultant | Full document | TBD |
| TBD | Lead Developer | Layers 3, 4, 5 | TBD |
| TBD | UI/UX Lead | Layer 3 + Appendix B | TBD |
| TBD | QA Lead | Layer 2 + Part 15 + Appendix E | TBD |
| TBD | Finance / PMO | Layer 5 only | TBD |

---

## 0.6 Approvals

| Role | Name | Signature | Date |
|---|---|---|---|
| Client Representative | TBD | __________ | TBD |
| SRS Consultant | TBD | __________ | TBD |
| Technical Lead (if assigned) | TBD | __________ | TBD |

---

## 0.7 Definitions & Acronyms

| Term | Definition |
|---|---|
| LMS | Learning Management System |
| SMS | School Management System |
| SRS | Software Requirements Specification |
| SaaS | Software as a Service |
| RBAC | Role-Based Access Control |
| MFA | Multi-Factor Authentication |
| SSO | Single Sign-On |
| API | Application Programming Interface |
| REST | Representational State Transfer |
| WebRTC | Web Real-Time Communication |
| SFU | Selective Forwarding Unit |
| PWA | Progressive Web Application |
| RTL | Right-to-Left (text direction — Arabic, Urdu) |
| ERD | Entity Relationship Diagram |
| CI/CD | Continuous Integration / Continuous Deployment |
| CDN | Content Delivery Network |
| JWT | JSON Web Token |
| OTP | One-Time Password |
| NFR | Non-Functional Requirement |
| FR | Functional Requirement |
| TR | Technical Requirement |
| UIR | UI Requirement |
| WCAG | Web Content Accessibility Guidelines |
| GDPR | General Data Protection Regulation |
| FERPA | Family Educational Rights and Privacy Act |
| PECA | Prevention of Electronic Crimes Act (Pakistan) |
| Cambridge | Cambridge Assessment International Education |
| Cognia | International accreditation body (formerly AdvancED) |
| IGCSE | International General Certificate of Secondary Education |
| P&L | Profit and Loss Statement |
| TB | Trial Balance |
| EQ | Emotional Intelligence Quotient |
| IQ | Intelligence Quotient |
| RIASEC | Holland Code — Realistic, Investigative, Artistic, Social, Enterprising, Conventional |
| MBTI | Myers-Briggs Type Indicator |
| SMART | Specific, Measurable, Achievable, Relevant, Time-bound |
| KPI | Key Performance Indicator |
| OKR | Objectives and Key Results |
| MRR | Monthly Recurring Revenue |
| ARR | Annual Recurring Revenue |
| RPO | Recovery Point Objective |
| RTO | Recovery Time Objective |
| DAU | Daily Active Users |
| MAU | Monthly Active Users |
| UAT | User Acceptance Testing |
| OWASP | Open Web Application Security Project |
| AES | Advanced Encryption Standard |
| TLS | Transport Layer Security |
| VPS | Virtual Private Server |
| P1 | Product 1 — LMS + SMS (this document) |
| P2 | Product 2 — AI Marketing & Sales RevOps Engine |
| P3 | Product 3 — AI Student Coach |
| P4 | Product 4 — Dynamics 365 Guidance Bots |

---

## 0.8 Requirement ID Index

All requirement IDs follow this format: `[PRODUCT]-[TYPE]-[NUMBER]`

| Prefix | Type | Example | Assigned In |
|---|---|---|---|
| `LMS-FR-xxx` | Functional Requirement | LMS-FR-001 | Part 4 |
| `LMS-TR-xxx` | Technical Requirement | LMS-TR-001 | Parts 8, 9 |
| `LMS-NFR-xxx` | Non-Functional Requirement | LMS-NFR-001 | Part 10 |
| `LMS-UIR-xxx` | UI Requirement | LMS-UIR-001 | Parts 6, 7 |

> Full index is maintained live in `_Shared/Requirement_ID_Register.md`
> Cross-reference with traceability matrix in `03_Traceability_Matrix/`

---

## 0.9 Table of Contents

### PART 0 — Document Control ✅
- 0.1 Cover Page
- 0.2 Confidentiality Notice
- 0.3 Version History
- 0.4 How to Use This Document
- 0.5 Distribution List
- 0.6 Approvals
- 0.7 Definitions & Acronyms
- 0.8 Requirement ID Index
- 0.9 Table of Contents

---

### LAYER 1 — BUSINESS & STRATEGY

#### PART 1 — Project Definition 🔴
- 1.1 Product Vision
- 1.2 Strategic Objectives
- 1.3 Scope Statement (In / Out / Deferred tables)
- 1.4 Success Criteria & KPIs
- 1.5 Business Drivers
- 1.6 Expected ROI & Value
- 1.7 Assumptions
- 1.8 Constraints
- 1.9 Dependencies
- 1.10 Definitions & Acronyms (cross-ref 0.7)

#### PART 2 — Stakeholders & Users 🔴
- 2.1 Stakeholder Register
- 2.2 User Personas (one per role — 7 total)
- 2.3 User Journey Maps (swimlane per role)
- 2.4 Roles & Permissions Matrix (full)
- 2.5 Accessibility Requirements

#### PART 3 — Business Requirements 🔴
- 3.1 Current State Analysis
- 3.2 Future State Vision
- 3.3 Business Process Flows (swimlane per process)
- 3.4 Business Rules
- 3.5 Compliance Requirements
- 3.6 Reporting Requirements

---

### LAYER 2 — PRODUCT & FUNCTIONAL

#### PART 4 — Functional Requirements 🔴
*Per module (M01–M17):*
- Module overview
- Feature map
- Requirement list (ID / statement / priority / source)
- User stories
- Acceptance criteria
- Business rules
- Permission rules
- Validation rules
- Error states
- Edge cases

**Modules covered:**
- 4.1 Live Online Classes (M01)
- 4.2 Assignment Module (M02)
- 4.3 Exam Module + AI Quiz Bot (M03)
- 4.4 Gradebook Module (M04)
- 4.5 Attendance Module (M05)
- 4.6 Fee Management Module (M06)
- 4.7 Timetable / Scheduling Module (M07)
- 4.8 Communication Module (M08)
- 4.9 Library Management — Digital (M09)
- 4.10 Admissions Module (M10)
- 4.11 Psychological Assessment Module (M11)
- 4.12 HR Management Module (M12)
- 4.13 Payroll Management Module (M13)
- 4.14 Accounting Module (M14)
- 4.15 Transport Management Module (M15)
- 4.16 Cognia Evidence Management Module (M16)
- 4.17 Multi-School Onboarding Module (M17)

#### PART 5 — Use Cases 🔴
- 5.1 Use Case Diagrams (per module)
- 5.2 Use Case Specifications (per user story)

---

### LAYER 3 — UI/UX & EXPERIENCE

#### PART 6 — UI/UX Specifications 🔴
- 6.1 Design Principles
- 6.2 Navigation Structure (full tree)
- 6.3 Design System (typography, colours, spacing, grid)
- 6.4 Responsive Breakpoints
- 6.5 Accessibility Standards (WCAG 2.1 AA)
- 6.6 RTL Language Rules (Arabic + Urdu)

#### PART 7 — Screen Specifications 🔴
*Per screen (SCR-[MODULE]-[NUMBER]):*
- Purpose
- Wireframe: Desktop / Tablet / Mobile
- Components list
- Actions
- Validation rules
- Loading / Empty / Error states

**Portals covered:**
- 7.1 Super Admin Portal screens
- 7.2 CEO / Director Portal screens
- 7.3 School Admin Portal screens
- 7.4 Teacher Portal screens
- 7.5 Student Portal screens
- 7.6 Parent Portal screens
- 7.7 Psychologist Portal screens

---

### LAYER 4 — TECHNICAL & ARCHITECTURE

#### PART 8 — Solution Architecture 🔴
- 8.1 Platform Analysis & Recommendation
- 8.2 High-Level Architecture Diagram
- 8.3 System Context Diagram
- 8.4 Component Architecture Diagram
- 8.5 Integration Architecture Diagram
- 8.6 Data Architecture Overview
- 8.7 Security Architecture Diagram
- 8.8 AI Architecture (Quiz Bot + P3 integration hooks)
- 8.9 Cloud Architecture (AWS vs Azure vs GCP vs VPS)

#### PART 9 — Technical Specifications 🔴
- 9.1 Frontend Stack (Native vs Cross-platform comparison + recommendation)
- 9.2 Backend Stack
- 9.3 Database Design (ERDs + data dictionary)
- 9.4 API Specifications (full endpoint catalog)
- 9.5 Third-Party Integrations
- 9.6 Security Specifications

#### PART 10 — Non-Functional Requirements 🔴
- 10.1 Performance
- 10.2 Scalability
- 10.3 Availability & Uptime
- 10.4 Security Standards
- 10.5 Usability Standards
- 10.6 Disaster Recovery (RPO & RTO)

#### PART 11 — Infrastructure & DevOps 🔴
- 11.1 Cloud Infrastructure
- 11.2 Environment Strategy (Dev / QA / UAT / Production)
- 11.3 CI/CD Pipeline
- 11.4 Containerisation & Orchestration
- 11.5 Monitoring & Alerting
- 11.6 Backup & Recovery

---

### LAYER 5 — PROJECT & FINANCIAL

#### PART 12 — Resource Plan 🔴
- 12.1 Team Structure
- 12.2 Roles & Responsibilities
- 12.3 Hours Matrix (role vs module)
- 12.4 Skill Requirements

#### PART 13 — Budget Plan 🔴
- 13.1 Cost Per Module
- 13.2 Cost Per Phase
- 13.3 Total Project Budget
- 13.4 Operational Costs Post-Launch
- 13.5 Licence & Infrastructure Costs
- 13.6 Contingency

#### PART 14 — Project Timeline 🔴
- 14.1 Development Phases
- 14.2 Milestone Schedule
- 14.3 Gantt Chart
- 14.4 Critical Path
- 14.5 Dependencies Map
- 14.6 Go-Live Plan

#### PART 15 — Testing & QA Plan 🔴
- 15.1 Testing Strategy
- 15.2 Test Types & Coverage
- 15.3 UAT Plan & Script
- 15.4 Performance Test Scenarios
- 15.5 Security Test Requirements
- 15.6 Acceptance Criteria Matrix

#### PART 16 — Risk Register 🔴
- 16.1 Technical Risks
- 16.2 Business Risks
- 16.3 Compliance Risks
- 16.4 Security Risks
- 16.5 Resource Risks

#### PART 17 — Governance 🔴
- 17.1 Change Request Process
- 17.2 Approval Workflow
- 17.3 Communication Plan
- 17.4 Escalation Matrix
- 17.5 Decision Log Template
- 17.6 Amendment Process

---

### APPENDICES

| Appendix | Contents | Status |
|---|---|---|
| A — ER Diagrams | Complete colour-coded ERDs for all data domains | 🔴 Pending |
| B — Wireframes Package | All screens: Desktop / Tablet / Mobile | 🔴 Pending |
| C — API Catalog | All endpoints, schemas, request/response examples, error codes | 🔴 Pending |
| D — Requirement Traceability Matrix | Every requirement ID → design → dev task → test case → acceptance | 🔴 Pending |
| E — Test Case Library | Full test cases: ID / steps / expected result / pass/fail | 🔴 Pending |
| F — Compliance Checklists | Cambridge / Cognia / GDPR / FERPA / PECA / WCAG 2.1 | 🔴 Pending |
| G — Open Source Evaluation | Platform comparison: Odoo / Moodle / Open edX / Frappe + scoring matrix | 🔴 Pending |
| H — Glossary | All terms, definitions, and acronyms | 🔴 Pending |
| I — Final Acceptance Sign-Off | Formal acceptance signatures — client and consultant | 🔴 Pending |

---

## 0.10 Document Status Tracker

| Part | Title | Layer | Status | Gate Passed |
|---|---|---|---|---|
| Part 0 | Document Control | — | ✅ Complete | — |
| Part 1 | Project Definition | L1 | 🔴 Not Started | ❌ |
| Part 2 | Stakeholders & Users | L1 | 🔴 Not Started | ❌ |
| Part 3 | Business Requirements | L1 | 🔴 Not Started | ❌ |
| Part 4 | Functional Requirements | L2 | 🔴 Not Started | ❌ |
| Part 5 | Use Cases | L2 | 🔴 Not Started | ❌ |
| Part 6 | UI/UX Specifications | L3 | 🔴 Not Started | ❌ |
| Part 7 | Screen Specifications | L3 | 🔴 Not Started | ❌ |
| Part 8 | Solution Architecture | L4 | 🔴 Not Started | ❌ |
| Part 9 | Technical Specifications | L4 | 🔴 Not Started | ❌ |
| Part 10 | Non-Functional Requirements | L4 | 🔴 Not Started | ❌ |
| Part 11 | Infrastructure & DevOps | L4 | 🔴 Not Started | ❌ |
| Part 12 | Resource Plan | L5 | 🔴 Not Started | ❌ |
| Part 13 | Budget Plan | L5 | 🔴 Not Started | ❌ |
| Part 14 | Project Timeline | L5 | 🔴 Not Started | ❌ |
| Part 15 | Testing & QA Plan | L5 | 🔴 Not Started | ❌ |
| Part 16 | Risk Register | L5 | 🔴 Not Started | ❌ |
| Part 17 | Governance | L5 | 🔴 Not Started | ❌ |

---

*Lighthouse Global School System — P1 Master SRS — Internal — Consultant Use Only — v1.0*
