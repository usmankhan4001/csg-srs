# APPENDIX H — GLOSSARY
## P1 — Learning Management System + School Management System
### All terms, definitions, and acronyms used in this document

**Status:** ✅ Complete

---

| Term / Acronym | Definition |
|---|---|
| **AES-256** | Advanced Encryption Standard with a 256-bit key — the encryption standard used for all data at rest in this system (Part 10.4) |
| **API** | Application Programming Interface — a defined contract through which software components communicate; all inter-service communication uses RESTful APIs (Part 9.4) |
| **BA** | Business Analyst — filled by the Combined Lead in this project's lean team structure (Part 12) |
| **BR** | Business Rule — a numbered rule governing system behaviour, prefixed BR-[NNN] throughout this document |
| **BPMN** | Business Process Model and Notation — the diagram standard used for swimlane/process flow diagrams in Part 3.3 |
| **Cambridge** | Cambridge Assessment International Education — the curriculum framework to which Lighthouse's academic structure conforms |
| **CDN** | Content Delivery Network — serves static assets and recorded video from geographically close nodes (Part 11.1) |
| **CI/CD** | Continuous Integration / Continuous Deployment — the automated pipeline that builds, tests, and deploys code (Part 11.3) |
| **Cognia** | Accreditation body (formerly AdvancED + SACS) whose evidence management requirements are a compliance target; addressed by M16 |
| **Combined Lead** | Lean-team role combining Solution Architect, PM, QA Lead, and DevOps Lead in a single person (Part 12) |
| **CR** | Change Request — a formal request to modify the signed Scope Lock Agreement (Part 17.1) |
| **CSRF** | Cross-Site Request Forgery — a web security attack; mitigated by CSRF tokens on all state-changing API calls (Part 9.6) |
| **DAU / MAU** | Daily Active Users / Monthly Active Users — usage metrics tracked by the Super Admin analytics portal (Part 3.1.9) |
| **DEC-P1-NNN** | Decision Log identifier format for P1 decisions; all decisions through DEC-P1-031 are logged in Appendix I |
| **DISC** | Personality assessment model measuring Dominance, Influence, Steadiness, Conscientiousness; one of the M14 test options |
| **E2E** | End-to-End — a type of automated test simulating a complete user journey from browser through to database (Part 15.1) |
| **Enneagram** | A personality typing system with 9 types; one of the M14 personality test options (Part 4) |
| **EQ** | Emotional Intelligence Quotient — measures self-awareness, regulation, empathy, and social skills; assessed in M14 (Part 4) |
| **ERD** | Entity Relationship Diagram — shows database entities, fields, and relationships (Appendix A) |
| **FERPA** | Family Educational Rights and Privacy Act — US federal law governing student record privacy; a compliance target (Appendix F) |
| **FR** | Functional Requirement — a numbered, testable system behaviour statement, prefixed LMS-FR-[NNN] |
| **GDPR** | General Data Protection Regulation — EU data privacy regulation; a compliance target (Appendix F) |
| **HMAC** | Hash-based Message Authentication Code — used to verify webhook payload integrity (Part 9.6) |
| **HR** | Human Resources — staff management and employment records; addressed by M10 |
| **IaC** | Infrastructure as Code — managing cloud infrastructure through version-controlled configuration files (Part 11.1) |
| **IAM** | Identity and Access Management — AWS service controlling access to cloud resources (Part 11.1) |
| **IQ** | Intelligence Quotient — a standardised measure of cognitive ability; assessed by the IQ Test in M14 (Part 4) |
| **ISBN** | International Standard Book Number — unique identifier for published books; used in M12 Library Management |
| **JWT** | JSON Web Token — a signed token used for stateless authentication between client and API services (Part 9.6) |
| **k6** | Open-source load testing tool used to execute the performance test scenarios in Part 15.4 |
| **KPI** | Key Performance Indicator — a measurable value tracking progress toward a defined goal (Part 1.4) |
| **LMS** | Learning Management System — the component managing course content, assignments, exams, gradebooks, and live classes |
| **LTI** | Learning Tools Interoperability — a standard for integrating third-party learning tools with an LMS |
| **M01-M20** | Module identifiers referencing the 20 functional modules specified in Part 4 |
| **MBTI** | Myers-Briggs Type Indicator — a personality assessment; one of the M14 personality test options (Part 4) |
| **MFA** | Multi-Factor Authentication — a second verification step beyond password; required for Admin-tier roles (Part 10.4) |
| **MIME type** | Multipurpose Internet Mail Extensions type — a standard identifying file format; used for upload validation (Part 9.6) |
| **MRR** | Monthly Recurring Revenue — a SaaS business metric tracked by the Super Admin billing dashboard (Part 3.1.3) |
| **NFR** | Non-Functional Requirement — governs system qualities (performance, security, availability); prefixed LMS-NFR-[NNN] |
| **NPS** | Net Promoter Score — a customer loyalty metric tracked in the CEO Portal (Part 3.2.1) |
| **OKR** | Objectives and Key Results — a goal-setting framework used in the CEO Portal's goal tracking feature (Part 3.2.8) |
| **ORM** | Object-Relational Mapper — a library mapping database tables to application code objects; this system uses Prisma (Part 9.2) |
| **OWASP Top 10** | The Open Web Application Security Project's list of the 10 most critical web security risks; all 10 are addressed in Part 9.6 and Part 15.5 |
| **p95** | The 95th percentile response time — 95% of requests completed in that time or faster; the primary NFR performance target metric (Part 10.1) |
| **Pact** | Open-source consumer-driven contract testing tool; verifies RabbitMQ message schemas between services (Part 15.2) |
| **PDPA** | Pakistan Personal Data Protection Act — Pakistan's data privacy law; relevant to RISK-C-004 (Part 16) |
| **PHQ-9** | Patient Health Questionnaire-9 — a standardised depression screening instrument referenced in M14 (Part 3.7.2) |
| **Playwright** | Browser automation framework used for E2E automated testing (Part 15.1) |
| **PM** | Project Manager |
| **PostgreSQL** | The primary relational database used by this platform (Part 9.3) |
| **Prisma** | The TypeScript ORM used for all database access, enforcing parameterised queries throughout (Part 9.2) |
| **PWA** | Progressive Web Application — a web app installable on a device with offline capability |
| **QA** | Quality Assurance — verifying software meets its requirements before release |
| **RabbitMQ** | Open-source message broker for asynchronous inter-service communication (Part 9.2) |
| **RBAC** | Role-Based Access Control — permissions assigned to roles, users assigned to roles; the access model for all 7 portals (Part 2.4) |
| **Redis** | In-memory data store used for session management and caching (Part 9.3) |
| **RFID** | Radio-Frequency Identification — optional contactless attendance check-in method (M06) |
| **RIASEC** | Realistic, Investigative, Artistic, Social, Enterprising, Conventional — the six Holland Code career interest types used in M14's Career Test |
| **RN** | React Native — the cross-platform mobile framework used for iOS and Android in this project (Part 9.1) |
| **RPO** | Recovery Point Objective — maximum acceptable data loss measured in time; set at 15 minutes (Part 10.6) |
| **RTO** | Recovery Time Objective — maximum acceptable time to restore service after failure; set at 4 hours (Part 10.6) |
| **RTL** | Right-to-Left — the text direction for Arabic and Urdu; full RTL support is required (Part 6.6) |
| **S3** | Amazon Simple Storage Service — AWS object storage for all file uploads and recordings (Part 11.1) |
| **SAML 2.0** | Security Assertion Markup Language — an SSO federation standard (Part 3.1.6) |
| **SFU** | Selective Forwarding Unit — video conferencing server architecture used by the built-in WebRTC option (Part 4.1.1) |
| **SIS** | Student Information System — the component managing student records and enrolments |
| **SMS** | School Management System — the component managing admissions, fees, HR, timetabling, and operations |
| **SMTP** | Simple Mail Transfer Protocol — the email sending protocol (Part 3.1.6) |
| **SOAP notes** | Subjective, Objective, Assessment, Plan — a clinical note format used in the Psychologist Portal's session notes (Part 3.7.6) |
| **Sonnet 4.6** | Claude Sonnet 4.6 (Anthropic) — the LLM used by the AI Quiz Service (Part 8.8, Part 13.7) |
| **SRS** | Software Requirements Specification — this document |
| **SSO** | Single Sign-On — authentication via an external identity provider (Google OAuth, Microsoft Azure AD, SAML 2.0) |
| **Stripe** | Online payment gateway; the primary international payment provider integrated in M08 |
| **TLS 1.3** | Transport Layer Security version 1.3 — encryption standard for all data in transit (Part 10.4) |
| **TR** | Technical Requirement — prefixed LMS-TR-[NNN] |
| **UAT** | User Acceptance Testing — final human-verified testing phase before Go-Live (Part 15.3) |
| **UIR** | UI Requirement — prefixed LMS-UIR-[NNN] |
| **UUID** | Universally Unique Identifier — 128-bit primary key for all database records (Part 9.3) |
| **WCAG 2.1 AA** | Web Content Accessibility Guidelines version 2.1, Level AA — the accessibility standard this system must meet (Part 6.5) |
| **WebRTC** | Web Real-Time Communication — browser API enabling peer-to-peer audio/video for the built-in video option (Part 4.1.1) |
| **XSS** | Cross-Site Scripting — a web security attack; mitigated by output encoding and Content Security Policy headers (Part 9.6) |

---

*Lighthouse Global School System — P1 Master SRS — Appendix H — Internal — v1.0*
