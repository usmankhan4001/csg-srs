# APPENDIX F — COMPLIANCE CHECKLISTS
## P1 — Learning Management System + School Management System
### Cambridge / Cognia / GDPR / FERPA / WCAG 2.1

**Status:** ✅ Complete

*Each checklist maps the compliance requirement to the SRS section that addresses it. Status column is completed at the pre-Go-Live compliance review — not at SRS delivery.*

---

## F.1 Cambridge Assessment International Education — Readiness Checklist

| # | Requirement | SRS Reference | Status (pre-Go-Live) |
|---|---|---|---|
| CAM-001 | The system shall support the Cambridge academic year structure: two terms (October–March, April–September) with configurable start/end dates | Part 3.3.3, M01 | ☐ |
| CAM-002 | The system shall support Cambridge grade boundaries: A*, A, B, C, D, E, F, G, U as configurable grade categories | Part 3.3.3, LMS-FR-073 | ☐ |
| CAM-003 | The system shall support subject codes and course identifiers conforming to the Cambridge syllabus numbering system (e.g., 0580 for IGCSE Mathematics) | Part 3.3.3, M04 | ☐ |
| CAM-004 | The system shall generate report cards and transcripts in a format compatible with Cambridge portfolio evidence requirements | Part 3.3.7, LMS-FR-085 | ☐ |
| CAM-005 | The system shall support the Cambridge AS & A Level two-year programme structure (Year 12 / Year 13) as a distinct academic pathway | Part 3.3.3 | ☐ |
| CAM-006 | The system shall support Cambridge Primary and Lower Secondary stages (Stages 1–9) as distinct grade levels | Part 3.3.3 | ☐ |
| CAM-007 | The system shall support Cambridge checkpoint assessment recording and evidence storage | M04, M16 | ☐ |
| CAM-008 | The system shall allow export of student academic records in a format suitable for submission to Cambridge International Examinations | Part 3.3.7, M19 | ☐ |
| CAM-009 | The timetable module shall support Cambridge's recommended teaching hours per subject per week (configurable per subject) | M07 | ☐ |
| CAM-010 | Teacher qualification records shall capture Cambridge-specific teaching certification fields (Cambridge PDQ, Cambridge TKT) | M10 | ☐ |

---

## F.2 Cognia Accreditation — Evidence Readiness Checklist

*Cognia accreditation requires documented evidence of continuous improvement across five standards. The checklist below maps each standard's evidence requirement to the platform feature that produces or stores that evidence.*

| # | Cognia Standard | Evidence Required | SRS Reference | Status |
|---|---|---|---|---|
| COG-001 | Standard 1: Purpose and Direction | Mission statement, strategic goals, and stakeholder communication records | Part 3.2, CEO Portal (Part 3.2.8 OKR tracking) | ☐ |
| COG-002 | Standard 2: Governance and Leadership | Organisational structure, leadership roles, policy documentation | M17, M18, M10 | ☐ |
| COG-003 | Standard 3: Teaching and Assessing for Learning — Curriculum alignment | Evidence that curriculum is aligned to stated learning objectives per subject | M04 question tagging by learning objective, M19 curriculum coverage report | ☐ |
| COG-004 | Standard 3: Teaching and Assessing for Learning — Assessment quality | Assessment instruments (exam papers, rubrics) stored with version history | M04, M03 rubric library, M16 evidence tagging | ☐ |
| COG-005 | Standard 3: Teaching and Assessing for Learning — Student performance data | Longitudinal student performance data by subject, grade level, and cohort | M05 Gradebook, M19 Reports & Analytics | ☐ |
| COG-006 | Standard 3: Teaching and Assessing for Learning — Feedback evidence | Records of teacher feedback on student work | M03 assignment feedback, M04 grading comments | ☐ |
| COG-007 | Standard 4: Resources and Support Systems — Professional development records | Teacher professional development logs and certification tracking | M10 staff qualifications, M17 audit logs | ☐ |
| COG-008 | Standard 4: Resources and Support Systems — Student support documentation | Records of student support interventions and counselling | M14 Psychological Assessment, action plans (Part 3.7.5) | ☐ |
| COG-009 | Standard 4: Resources and Support Systems — Attendance and wellbeing | Attendance records and chronic absenteeism tracking | M06 Attendance module | ☐ |
| COG-010 | Standard 5: Using Results for Continuous Improvement — Data-driven decisions | Evidence that school leadership reviews performance data and takes documented action | M19 Reports, CEO Portal analytics, OKR tracking (Part 3.2.8) | ☐ |
| COG-011 | M16 evidence package export | The Cognia evidence export package (M16) shall produce a structured archive with evidence items tagged to the five Cognia standards, each with a date, source module, and linked requirement | LMS-FR-175 to LMS-FR-179 | ☐ |
| COG-012 | Evidence retention | All Cognia evidence artefacts shall be retained for a minimum of 7 years per Cognia's accreditation cycle requirements | Part 19.1 (Data Retention), M16 | ☐ |

---

## F.3 GDPR Compliance Checklist

*Applies to all EU/EEA data subjects. Lighthouse serves students globally including from EU countries.*

| # | Requirement | Implementation | SRS Reference | Status |
|---|---|---|---|---|
| GDPR-001 | Lawful basis for processing | The system shall record the lawful basis for processing each category of personal data (consent, legitimate interest, legal obligation) in the data governance configuration | Part 9.3, Part 19 | ☐ |
| GDPR-002 | Privacy notice | A privacy notice is presented to all users at account creation and is accessible at all times from within the portal | M20 Settings, Part 3.1.7 | ☐ |
| GDPR-003 | Consent management for minors | For students under 16, parental consent is collected and recorded before account creation; the consent record is stored and auditable | M01 Admissions, Part 3.1.7 | ☐ |
| GDPR-004 | Right of access (Article 15) | The system shall generate a full data export of all personal data held about a data subject within 30 days of a Subject Access Request | Part 3.1.7 (GDPR data export), M18 admin tools | ☐ |
| GDPR-005 | Right to erasure (Article 17) | The system shall anonymise (not delete) personal identifiers in financial/ledger records to satisfy accounting retention obligations while fulfilling the deletion request for profile data | RISK-C-001 mitigation, Part 9.3 soft-delete design | ☐ |
| GDPR-006 | Right to rectification (Article 16) | Users may request correction of inaccurate personal data; the correction is logged in the audit trail | M18, Part 3.1.7 | ☐ |
| GDPR-007 | Data portability (Article 20) | The system shall export a user's personal data in a machine-readable format (JSON or CSV) on request | Part 3.1.7 | ☐ |
| GDPR-008 | Data minimisation | Only personal data fields necessary for the stated processing purpose are collected; no surplus fields are stored | Part 9.3 data dictionary — every field has a stated purpose | ☐ |
| GDPR-009 | Encryption at rest | All personal data is stored encrypted using AES-256 | Part 10.4, Part 9.6 | ☐ |
| GDPR-010 | Encryption in transit | All data transmitted between clients and servers uses TLS 1.3 | Part 10.4, Part 9.6 | ☐ |
| GDPR-011 | Data retention limits | Personal data is deleted or anonymised after the period specified in the data retention policy; this policy is configurable per data category | Part 3.1.7, Part 19.1 | ☐ |
| GDPR-012 | Breach notification | The system generates an alert to the Super Admin within 1 hour of detecting a potential data breach, supporting the 72-hour regulatory notification window | Part 11.5 alerting tiers, RISK-S-001 escalation | ☐ |
| GDPR-013 | Data Processing Agreements | All third-party processors (AWS, Stripe, Anthropic API, Zoom/Meet/Teams) operate under documented Data Processing Agreements — this is a legal/commercial action, not a platform feature | RISK-C-001 note | ☐ |
| GDPR-014 | Audit trail | All access to and modifications of personal data are logged with timestamp, user, and action | Part 9.6 audit logging, Part 3.1.7 | ☐ |

---

## F.4 FERPA Compliance Checklist

*Applies to US students. Lighthouse's international enrolment may include US residents whose records are subject to FERPA.*

| # | Requirement | Implementation | SRS Reference | Status |
|---|---|---|---|---|
| FERPA-001 | Parental rights (students under 18) | Parents have full access to their child's education records; the Parent Portal provides this access by design | Part 3.6 Parent Portal | ☐ |
| FERPA-002 | Student rights (students 18+) | Students aged 18 and over have direct access to their own education records; the Student Portal provides this | Part 3.5 Student Portal | ☐ |
| FERPA-003 | Consent for disclosure | The system shall require explicit recorded consent before sharing a student's education records with any third party not covered by FERPA's school officials exception | M17 admin configuration, data export audit log | ☐ |
| FERPA-004 | Amendment requests | Students and parents may request amendment of inaccurate education records; the system provides a request workflow and stores the outcome | M18 admin tools, Part 3.1.7 | ☐ |
| FERPA-005 | Directory information policy | The school shall configure which fields (if any) are designated as directory information; the system enforces this classification in all data exports | M17 configuration, Part 9.3 data classification fields | ☐ |
| FERPA-006 | Legitimate educational interest | Access to student records is restricted to users with a documented legitimate educational interest; RBAC enforces this at the role level | Part 2.4 Roles & Permissions, Part 9.6 RBAC | ☐ |
| FERPA-007 | Annual notification | The school administrator can generate an annual FERPA notification document for distribution to parents/students | M19 Reports, M13 Communication | ☐ |
| FERPA-008 | Records of disclosure | The system maintains a log of every third-party disclosure of student education records | Part 9.6 audit logging | ☐ |

---

## F.5 WCAG 2.1 Level AA Compliance Checklist

*Applies to all web and mobile interfaces. Verified during Phase 5 by the Frontend Lead.*

| # | Criterion | Requirement | SRS Reference | Status |
|---|---|---|---|---|
| WCAG-001 | 1.1.1 Non-text content | All images, icons, and non-text UI elements have descriptive alt text | Part 6.5 | ☐ |
| WCAG-002 | 1.3.1 Info and relationships | Semantic HTML is used throughout — headings, lists, tables, and form labels convey structure programmatically | Part 6.5 | ☐ |
| WCAG-003 | 1.3.3 Sensory characteristics | Instructions do not rely solely on colour, shape, or position (e.g., error states use both colour and an icon + text label) | Part 6.3 design system, Part 6.5 | ☐ |
| WCAG-004 | 1.3.4 Orientation | The application does not restrict display to a single orientation (portrait or landscape) on mobile | Part 6.4 responsive breakpoints | ☐ |
| WCAG-005 | 1.4.1 Use of colour | Colour is never the only visual means of conveying information (Part 9.2's risk register table uses text labels, not only colour) | Part 6.3 | ☐ |
| WCAG-006 | 1.4.3 Contrast (minimum) | Text contrast ratio is at least 4.5:1 for normal text; 3:1 for large text | Part 6.3 colour palette with contrast ratios | ☐ |
| WCAG-007 | 1.4.4 Resize text | Text can be resized up to 200% without loss of content or functionality | Part 6.4 | ☐ |
| WCAG-008 | 1.4.10 Reflow | Content reflows to a single column at 320px viewport width without horizontal scrolling | Part 6.4 responsive breakpoints (320px mobile) | ☐ |
| WCAG-009 | 1.4.11 Non-text contrast | UI components and graphical objects have a contrast ratio of at least 3:1 against adjacent colours | Part 6.3 design system | ☐ |
| WCAG-010 | 2.1.1 Keyboard | All functionality is operable via keyboard; no keyboard trap exists | Part 6.5 | ☐ |
| WCAG-011 | 2.1.2 No keyboard trap | Keyboard focus can always be moved away from a component using standard keys | Part 6.5 | ☐ |
| WCAG-012 | 2.4.1 Bypass blocks | A skip-to-main-content link is provided on all pages | Part 6.5 | ☐ |
| WCAG-013 | 2.4.3 Focus order | Focus order follows a logical reading sequence | Part 6.5 | ☐ |
| WCAG-014 | 2.4.4 Link purpose | Every link's purpose is determinable from its label or context alone | Part 6.5 | ☐ |
| WCAG-015 | 2.4.7 Focus visible | Keyboard focus indicator is visible on all interactive elements | Part 6.3 design system focus states | ☐ |
| WCAG-016 | 3.1.1 Language of page | The HTML `lang` attribute is set correctly per the active language (en, ar, ur) | Part 6.6 RTL language rules | ☐ |
| WCAG-017 | 3.1.2 Language of parts | Inline language changes (e.g., an Arabic phrase in an English UI) are marked with `lang` attribute | Part 6.6 | ☐ |
| WCAG-018 | 3.2.2 On input | Changing a form field value does not automatically cause a page change without warning | Part 6.5 | ☐ |
| WCAG-019 | 3.3.1 Error identification | Form errors identify the specific field in error and describe the problem in text | Part 4 Error States tables per module | ☐ |
| WCAG-020 | 3.3.2 Labels or instructions | All form inputs have programmatically associated labels | Part 7 Screen Specifications, components table | ☐ |
| WCAG-021 | 4.1.1 Parsing | HTML is valid and well-formed with no duplicate IDs | Part 6.5 — enforced by ESLint/accessibility linting in CI/CD | ☐ |
| WCAG-022 | 4.1.2 Name, role, value | All UI components expose name, role, and value to assistive technologies via ARIA where native HTML is insufficient | Part 6.5 | ☐ |
| WCAG-023 | 4.1.3 Status messages | Status messages (success, error, loading) are programmatically determinable without receiving focus (ARIA live regions) | Part 6.5 | ☐ |
| WCAG-024 | RTL layout mirror | All layouts mirror correctly for Arabic and Urdu — logical properties used in CSS, no hardcoded `left`/`right` values | Part 6.6 RTL language rules | ☐ |

---

*Lighthouse Global School System — P1 Master SRS — Appendix F — Internal — v1.0*
