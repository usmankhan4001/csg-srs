# Lighthouse Global School System — Master SRS Repository

**Classification:** Internal — Consultant Use Only
**Status:** In Progress
**Version:** See individual product files

---

## Products

| Product | Name | Min Pages | Status |
|---|---|---|---|
| P1 | LMS + School Management System | 200–250 | 🟡 In Progress |
| P2 | AI Marketing & Sales RevOps Engine | 150–180 | 🔴 Not Started |
| P3 | AI Student Coach | 120–150 | 🔴 Not Started |
| P4 | Dynamics 365 Guidance Bots | 100–120 | 🔴 Not Started |

---

## Repository Structure

```
lighthouse-srs/
├── _Shared/                          # Cross-product reference files
│   ├── Master_SRS_Production_Guide.md
│   ├── Requirement_ID_Register.md
│   └── Decision_Log.md
│
├── P1_LMS_SMS/
│   ├── 00_Scope_Lock/
│   ├── 01_Master_SRS/
│   │   ├── Layer_1_Business_Strategy/
│   │   │   ├── Part_1_Project_Definition.md
│   │   │   ├── Part_2_Stakeholders_Users.md
│   │   │   └── Part_3_Business_Requirements.md
│   │   ├── Layer_2_Product_Functional/
│   │   │   ├── Part_4_Functional_Requirements.md
│   │   │   └── Part_5_Use_Cases.md
│   │   ├── Layer_3_UI_UX/
│   │   │   ├── Part_6_UI_UX_Specifications.md
│   │   │   └── Part_7_Screen_Specifications.md
│   │   ├── Layer_4_Technical/
│   │   │   ├── Part_8_Solution_Architecture.md
│   │   │   ├── Part_9_Technical_Specifications.md
│   │   │   ├── Part_10_Non_Functional_Requirements.md
│   │   │   └── Part_11_Infrastructure_DevOps.md
│   │   └── Layer_5_Project_Financial/
│   │       ├── Part_12_Resource_Plan.md
│   │       ├── Part_13_Budget_Plan.md
│   │       ├── Part_14_Project_Timeline.md
│   │       ├── Part_15_Testing_QA_Plan.md
│   │       ├── Part_16_Risk_Register.md
│   │       └── Part_17_Governance.md
│   ├── 02_Executive_Summary/
│   ├── 03_Traceability_Matrix/
│   ├── 04_Budget_Resource_Plan/
│   ├── 05_Project_Timeline/
│   ├── 06_Risk_Register/
│   └── Appendices/
│       ├── A_ER_Diagrams/
│       ├── B_Wireframes/
│       ├── C_API_Catalog/
│       ├── D_Traceability_Matrix/
│       ├── E_Test_Cases/
│       ├── F_Compliance_Checklists/
│       ├── G_Open_Source_Evaluation/
│       ├── H_Glossary/
│       └── I_Final_Acceptance/
│
├── P2_AI_RevOps/                     # Same structure as P1
├── P3_AI_Student_Coach/              # Same structure as P1
└── P4_D365_Bots/                     # Same structure as P1
```

---

## How to Use This Repo

### For the Consultant
- Work one Part at a time, in order
- Every file is a single SRS Part
- Commit after completing and reviewing each Part
- Never mark a section complete until its Layer KPI gate is passed (see Production Guide)

### For the Client
- Read `P1_LMS_SMS/02_Executive_Summary/` — Layer 1 only
- Do not read Layer 4 (Technical) unless you are a developer

### For Developers
- Read `Layer_4_Technical/` parts only
- Every requirement has a unique ID (e.g. `LMS-FR-001`)
- Trace requirements in `03_Traceability_Matrix/`

---

## Requirement ID Format

| Product | Functional | Technical | Non-Functional | UI |
|---|---|---|---|---|
| P1 LMS+SMS | `LMS-FR-001` | `LMS-TR-001` | `LMS-NFR-001` | `LMS-UIR-001` |
| P2 RevOps | `AI-FR-001` | `AI-TR-001` | `AI-NFR-001` | `AI-UIR-001` |
| P3 Coach | `AIC-FR-001` | `AIC-TR-001` | `AIC-NFR-001` | `AIC-UIR-001` |
| P4 D365 | `D365-FR-001` | `D365-TR-001` | `D365-NFR-001` | `D365-UIR-001` |

---

## Commit Convention

```
[P1] Part 1 — Project Definition complete
[P1] Part 4 — Functional Requirements: Attendance Module added
[SHARED] Decision Log updated — mobile stack decision
[P2] Scope Lock signed and locked
```

---

*Lighthouse Global School System — Internal — Consultant Use Only*
