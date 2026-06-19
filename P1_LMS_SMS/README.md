# P1 — LMS + School Management System — MASTER INDEX
## Lighthouse Global School System | Single Entry Point

**Status:** ✅ All 17 Parts content-complete · 52 diagrams embedded in-place · 9 Appendices complete · 88 wireframes complete
**Last reorganized:** 19 June 2026 — all diagrams now live inline in their owning Part; Appendices link back to source Parts; zero duplicate or orphaned files.

---

## How This Document Set Is Organized

Every diagram lives **inside the Part it belongs to** — not in a separate scattered file. Appendix A (ER Diagrams) and Appendix B (Wireframes) are the two exceptions, by design: the production guide defines these as canonical Appendix deliverables. Every Part that references them links directly to the Appendix; every Appendix links back to its source Part. There are no duplicate diagrams anywhere in this document set.

```
P1_LMS_SMS/
├── 00_Scope_Lock/                  Scope Lock Agreement (signed before build starts)
├── 01_Master_SRS/                  17 Parts — all diagrams embedded inline
├── 02_Executive_Summary/           2-page leadership summary
├── 03_Traceability_Matrix/         XLSX — 207 requirements
├── 04_Budget_Resource_Plan/        XLSX — formulas, hours matrix, OpEx
├── 05_Project_Timeline/            XLSX — milestones + phase plan
├── 06_Risk_Register/               XLSX — 30 risks, colour-coded
├── Appendices/                     C–I (text/data) + A & B (canonical diagram/wireframe stores)
└── _Shared/Decision_Log.md         All 31 decisions, single source of truth
```

---

## 01 — Master SRS (17 Parts)

| Layer | Part | Diagrams Inside | Status |
|---|---|---|---|
| **0** | [Document Control](01_Master_SRS/Part_0_Document_Control.md) | — | ✅ |
| **1 — Business & Strategy** | [Part 1 — Project Definition](01_Master_SRS/Layer_1_Business_Strategy/Part_1_Project_Definition.md) | — | ✅ |
| | [Part 2 — Stakeholders & Users](01_Master_SRS/Layer_1_Business_Strategy/Part_2_Stakeholders_Users.md) | 7 journey maps | ✅ |
| | [Part 3 — Business Requirements](01_Master_SRS/Layer_1_Business_Strategy/Part_3_Business_Requirements.md) | 9 (current/future state + process flows) | ✅ |
| **2 — Product & Functional** | [Part 4 — Functional Requirements](01_Master_SRS/Layer_2_Product_Functional/Part_4_Functional_Requirements.md) | 5 feature-tree diagrams (all 20 modules) | ✅ |
| | [Part 5 — Use Cases](01_Master_SRS/Layer_2_Product_Functional/Part_5_Use_Cases.md) | 2 use case diagrams | ✅ |
| **3 — UI/UX** | [Part 6 — UI/UX Specifications](01_Master_SRS/Layer_3_UI_UX/Part_6_UI_UX_Specifications.md) | 1 navigation tree | ✅ |
| | [Part 7 — Screen Specifications](01_Master_SRS/Layer_3_UI_UX/Part_7_Screen_Specifications.md) | → links to **Appendix B** (88 wireframes) | ✅ |
| **4 — Technical** | [Part 8 — Solution Architecture](01_Master_SRS/Layer_4_Technical/Part_8_Solution_Architecture.md) | 8 architecture diagrams (all subsections) | ✅ |
| | [Part 9 — Technical Specifications](01_Master_SRS/Layer_4_Technical/Part_9_Technical_Specifications.md) | 7 sequence diagrams + → links to **Appendix A** (ERDs) | ✅ |
| | [Part 10 — Non-Functional Requirements](01_Master_SRS/Layer_4_Technical/Part_10_Non_Functional_Requirements.md) | — | ✅ |
| | [Part 11 — Infrastructure & DevOps](01_Master_SRS/Layer_4_Technical/Part_11_Infrastructure_DevOps.md) | 1 CI/CD pipeline | ✅ |
| **5 — Project & Financial** | [Part 12 — Resource Plan](01_Master_SRS/Layer_5_Project_Financial/Part_12_Resource_Plan.md) | 1 org chart | ✅ |
| | [Part 13 — Budget Plan](01_Master_SRS/Layer_5_Project_Financial/Part_13_Budget_Plan.md) | 2 pie charts (budget + cost-by-phase) | ✅ |
| | [Part 14 — Project Timeline](01_Master_SRS/Layer_5_Project_Financial/Part_14_Project_Timeline.md) | 1 Gantt + 2 dependency maps | ✅ |
| | [Part 15 — Testing & QA Plan](01_Master_SRS/Layer_5_Project_Financial/Part_15_Testing_QA_Plan.md) | 1 testing pyramid | ✅ |
| | [Part 16 — Risk Register](01_Master_SRS/Layer_5_Project_Financial/Part_16_Risk_Register.md) | 1 risk quadrant matrix | ✅ |
| | [Part 17 — Governance](01_Master_SRS/Layer_5_Project_Financial/Part_17_Governance.md) | 3 (CR flow, approval, escalation) | ✅ |

**Diagrams embedded in Parts: 52.** (Plus 7 ERDs in Appendix A canonical store = 59 total diagrams across the whole document set.)

---

## 02–06 — Deliverable Files

| # | File | Format | Key Figure |
|---|---|---|---|
| 02 | [Executive Summary](02_Executive_Summary/02_Executive_Summary_LMS_v1.0.md) | Markdown | 2-page leadership brief |
| 03 | [Traceability Matrix](03_Traceability_Matrix/03_Traceability_Matrix_LMS_v1.0.xlsx) | XLSX | 207 requirements traced |
| 04 | [Budget & Resource Plan](04_Budget_Resource_Plan/04_Budget_Resource_Plan_LMS_v1.0.xlsx) | XLSX | PKR 7,895,191 total |
| 05 | [Project Timeline](05_Project_Timeline/05_Project_Timeline_LMS_v1.0.xlsx) | XLSX | Go-Live 30 Nov 2026 |
| 06 | [Risk Register](06_Risk_Register/06_Risk_Register_LMS_v1.0.xlsx) | XLSX | 30 risks, colour-coded |

---

## Appendices (C–I = data/text · A & B = canonical diagram/wireframe stores)

| Appendix | Content | Linked From |
|---|---|---|
| [A — ER Diagrams](Appendices/Appendix_A_ER_Diagrams.md) | 7 ERDs, all data domains | Part 9.3 |
| [B — Wireframes (Index)](Appendices/Appendix_B_Wireframes_Index.md) | 88 screens across 5 files | Part 7 |
| [C — API Catalog](Appendices/Appendix_C_API_Catalog.md) | 52 endpoints, 9 services | Part 9.4 |
| [D — Traceability Matrix](Appendices/Appendix_D_Traceability_Matrix.md) | 207 FRs → service → screen → test case | Part 4, Part 15 |
| [E — Test Case Library](Appendices/Appendix_E_Test_Case_Library.md) | Executable UAT test cases, all 20 modules | Part 15.3, Part 15.7 |
| [F — Compliance Checklists](Appendices/Appendix_F_Compliance_Checklists.md) | Cambridge / Cognia / GDPR / FERPA / WCAG 2.1 | Part 8.1, Part 3.5 |
| [G — Open Source Evaluation](Appendices/Appendix_G_OpenSource_Evaluation.md) | 9-platform scoring matrix | Part 8.1, DEC-P1-024 |
| [H — Glossary](Appendices/Appendix_H_Glossary.md) | All terms & acronyms | All Parts |
| [I — Acceptance Sign-Off](Appendices/Appendix_I_Acceptance_Signoff.md) | Scope Lock / UAT / Go-Live sign-off templates | Part 17, Milestones M8–M10 |

---

## Governance

- [Scope Lock Agreement v1.1](00_Scope_Lock/07_Scope_Lock_Agreement_LMS_v1.1.md)
- [Decision Log](_Shared/Decision_Log.md) — 31 decisions, DEC-P1-001 to DEC-P1-031

---

## What's Genuinely Left

| Item | Why it's not done |
|---|---|
| Pixel-precise Figma mockups | Appendix B's 88 ASCII wireframes are dev-ready but not designer-final; a design pass can build directly from them when needed |
| P2 / P3 / P4 | Not started — same 17-Part structure applies once P1 is locked |

Everything else — all 17 Parts, all 59 diagrams, all 9 Appendices, all 5 deliverable files — is content-complete and cross-linked with zero duplication.

---

*Lighthouse Global School System — P1 Master Index — Internal — v1.0*
