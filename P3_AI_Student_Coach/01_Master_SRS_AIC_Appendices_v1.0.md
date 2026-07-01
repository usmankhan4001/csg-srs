# MASTER SRS — P3 AI STUDENT COACH
## APPENDICES (A–I)

| Field | Value |
|---|---|
| Product | P3 — AI Student Coach |
| Document | Master SRS — Appendices |
| Note | Per Rule 5 (one statement, one location), Appendices A, B, and C index and cross-reference content already fully delivered in Parts 7 and 9 rather than reproducing it. Appendices D and E establish structure and a representative sample; their full row-level content is delivered as separate XLSX companion files. Appendices F-I are original content. |

---

## APPENDIX A — ER Diagrams

Complete colour-coded entity relationship diagrams for all data domains are delivered in Part 9.3, Batches A-C.

| Domain | Figure | Source Document |
|---|---|---|
| Identity & Enrollment | Figure 9a | Part 9.3 Batch A |
| Curriculum & Assessment | Figure 9b | Part 9.3 Batch A |
| Psychometric | Figure 9c | Part 9.3 Batch A |
| Configuration | Figure 9d | Part 9.3 Batch A |
| Audit & Compliance Logs | Figure 9e | Part 9.3 Batch A |
| Conversation & Interaction | Figure 9f | Part 9.3 Batch B |
| Student Learning Profile | Figure 9g | Part 9.3 Batch B |
| Knowledge/Content | Figure 9h | Part 9.3 Batch B |
| Recommendations & Career Output | Figure 9i | Part 9.3 Batch C |
| Wellbeing & Safety | Figure 9j | Part 9.3 Batch C |
| Consent Records | Figure 9k | Part 9.3 Batch C |
| Notification & Delivery | Figure 9l | Part 9.3 Batch C |

**Coverage confirmation:** All 12 data domains identified in Section 8.6.1 have a corresponding ER diagram; every entity in the Part 9.3 data dictionary appears in one of Figures 9a-9l, satisfying the Layer 4 ERD-coverage KPI in full.

---

## APPENDIX B — Wireframes Package

All 57 screen wireframes (desktop/tablet/mobile per screen) are delivered across Part 7, Batches 1-7.

| Surface | Screens | Source Document |
|---|---|---|
| Student App — Onboarding & Tutor Core | 6 screens | Part 7 Student App Batch 1 |
| Student App — Revision Hub | 11 screens | Part 7 Student App Batch 2 |
| Student App — Career Hub | 5 screens | Part 7 Student App Batch 3 |
| Student App — Wellbeing, Profile & Settings | 7 screens | Part 7 Student App Batch 4 |
| Parent App | 6 screens | Part 7 Parent App |
| Teacher Console | 7 screens | Part 7 Teacher Console |
| School Admin Console | 6 screens | Part 7 School Admin Console |
| Super Admin Console | 9 screens | Part 7 Super Admin Console |
| **Total** | **57 screens** | |

**Coverage confirmation:** Every screen named in the Part 6.2 navigation trees has a corresponding wireframe specification with components, actions, validation, and loading/empty/error states.

---

## APPENDIX C — API Catalog

The complete API reference (56 endpoints, all schemas, examples, error codes) is delivered in Part 9.4, Batches A-C, with the consolidated rate-limiting table and consolidated error-code matrix.

| Service Group | Endpoints | Source Document |
|---|---|---|
| Conventions + Tutor Engine, Homework Assistant, Revision Coach | 22 | Part 9.4 Batch A |
| Career Coach, Wellbeing Coach, Student Learning Profile, Knowledge Graph & RAG, Personalization | 21 | Part 9.4 Batch B |
| Teacher Oversight, Consent & Safety, Admin & Configuration, Notification + sequence diagrams | 13 | Part 9.4 Batch C |

### C.1  JSON Variant-Shape Reference (new content, per AIC-TR-160)

| Column | Discriminator | Shape per Value |
|---|---|---|
| profile_attribute.value | attribute_type | weak_topic/strong_topic: topic_id + evidence_count. learning_style_signal: style + basis. engagement_level: score_0_to_1 + trend |
| psychometric_result_cache.result_summary | test_type | personality: dimension scores. career_riasec: six RIASEC scores 0-100. aptitude: five section scores with percentile. iq: full_scale + subtests + confidence_interval. eq: five dimension scores |
| config_setting.value | config_key | Each key has a fixed primitive or small-object shape, e.g. homework.similarity_threshold: a decimal value |
| recommendation.payload | rec_type | next_topic: topic_id + reason_signal_ref. revision_item: item_type + topic_id. resource: source_id + chunk_index. study_plan_ref: plan_id |
| career_option.match_factors | fixed shape | riasec_alignment, aptitude_alignment, performance_signal arrays |

---

## APPENDIX D — Requirement Traceability Matrix

Per the Production Guide's deliverable package, the full Requirement Traceability Matrix is delivered as companion file 03_Traceability_Matrix_AIC_v1.0.xlsx, tracing all 530+ requirement IDs across this SRS through Requirement to Design to Development Task to Test Case to Acceptance.

### D.1  Matrix Structure

| Column | Description |
|---|---|
| Requirement ID | e.g. AIC-FR-023 |
| Requirement Statement | Short restatement, sourced from the owning Part |
| Source Part | Where the requirement originates |
| Design Reference | Component/screen/architecture element implementing it |
| Development Task | Ticket ID, assigned during build |
| Test Case ID | Per Part 15.7/Appendix E |
| Acceptance Status | Pass / Fail / Pending Execution / Not Yet Built |
| Accepted By | Client signatory, once accepted |

### D.2  Representative Sample

| Requirement ID | Requirement Statement | Source Part | Design Reference | Test Case ID | Acceptance Status |
|---|---|---|---|---|---|
| AIC-FR-023 | Homework Assistant selects Guided mode when item is in-window and similarity >=0.85 | Part 4.2 | Mode Selector component | TC-AIC-H-002 | Pending Execution |
| AIC-FR-086 | Wellbeing Coach delivers safe response and alerts Psychologist/Admin within 60s on L2 | Part 4.5 | Escalation Router component | TC-AIC-W-002 | Pending Execution |
| AIC-TR-053 | Every table carries tenant_id with row-level security | Part 9.3 | All Part 9.3 schemas | Cross-tenant isolation suite | Pending Execution |
| AIC-TR-198 | CLASSIFIER_UNAVAILABLE treated as allowed:false by every caller | Part 9.4 | Consent & Safety Service | Fail-closed verification | Pending Execution |
| AIC-NFR-013 | Wellbeing L2 alert delivery within 60 seconds | Part 10.1 | Escalation Router | Wellbeing bypass-path load test | Pending Execution |
| RISK-AIC-A-03 | Wellbeing classifier false-negative risk | Part 16.6 | Recall-favoring tuning | AI evaluation framework | Ongoing monitoring |

**AIC-APP-D-001:** The full matrix shall achieve 100% coverage of all requirement IDs in this SRS before the delivery checklist item "Traceability matrix covers 100% of requirement IDs" can be marked complete.

---

## APPENDIX E — Test Case Library

The full test case library is delivered as a companion artifact, containing one row per acceptance criterion across all 11 Part 4 modules plus the full 88-scenario UAT set.

### E.1  Test Case Structure

| Column | Description |
|---|---|
| Test Case ID | e.g. TC-AIC-T-001 |
| Description | What is being verified |
| Preconditions | State required before execution |
| Steps | Numbered execution steps |
| Expected Result | What constitutes a pass |
| Linked Acceptance Criterion | Cross-reference to the Part 4 AC it verifies |
| Test Type | Unit / Integration / System / UAT |
| Automated | Yes/No |

### E.2  Extended Sample

| Test Case ID | Description | Linked AC | Test Type | Automated |
|---|---|---|---|---|
| TC-AIC-T-001 | Urdu-set student receives Urdu response with first-token p95 within 3s | AC#3, US-AIC-T-01 | System | Yes |
| TC-AIC-T-005 | Question outside enrolled stage returns scope-decline message | AC#2, US-AIC-T-01 | Integration | Yes |
| TC-AIC-H-002 | Direct graded-answer request in Guided mode never returns exact final value | AC#2, US-AIC-H-01 | Unit | Yes |
| TC-AIC-H-007 | Three direct-answer attempts in one session raise a teacher flag | US-AIC-H-07 | Integration | Yes |
| TC-AIC-R-012 | Quiz submission never appears in P1 gradebook | AC#12, US-AIC-R-09 | Integration | Yes |
| TC-AIC-C-009 | Salary claim without a dataset source is withheld, not estimated | AC#9, US-AIC-C-08 | Unit | Yes |
| TC-AIC-W-001 | Explicit-risk language produces safe response and helpline within 1s render | AC#1, US-AIC-W-01 | System | Yes |
| TC-AIC-W-007 | Fail-closed: classifier outage blocks output platform-wide | 8.7.5 | Security | Yes |
| TC-AIC-K-008 | Tenant A retrieval returns zero Tenant B chunks under concurrent load | AC#8, US-AIC-K-07 | Security | Yes |
| TC-AIC-S-008 | Under-18 activation blocked when DOB missing from P1 | 4.10.9 | Integration | Yes |
| UAT-AIC-001 to 010 | Per Part 15.3.2 | Various | UAT | No |

**AIC-APP-E-001:** Every "Pending Execution" status shall transition to Pass or Fail before the owning module's Part 14 milestone is marked complete.

---

## APPENDIX F — Compliance Checklists

### F.1  Cambridge Readiness Checklist

| Item | Status |
|---|---|
| Stage/subject curriculum mapping reflects current Cambridge syllabus structure | Pending — depends on Gap G6 corpus licensing |
| Evidence of personalized learning support exportable on demand | Built — Part 3.6/9.4.7 |
| Subject-choice-to-pathway mapping available | Built, qualitative-only pending Gap G11 |
| Assessment data correctly mirrored from P1 | Built — pending Gap G12 live validation |

### F.2  Cognia Readiness Checklist

| Item | Status |
|---|---|
| Evidence of timely intervention (wellbeing escalation audit trail) | Built — Part 9.3.11 |
| Continuous improvement process documented (AI evaluation framework) | Built |
| Stakeholder engagement evidence (UAT, communication plan) | Built |
| Data-informed decision-making evidence | Built |

### F.3  GDPR Checklist

| Item | Status |
|---|---|
| Lawful basis for processing (consent, Module 4.10) | Built |
| Right to access/export | Built |
| Right to erasure (soft-scheduled) | Built |
| Data Protection Impact Assessment | Not yet conducted — recommended before Phase D ships |
| 72-hour breach notification process | Built, pending exact jurisdiction confirmation |

### F.4  FERPA Checklist

| Item | Status |
|---|---|
| Education-record access control (RBAC) | Built |
| Parental access rights for minors | Built |
| Audit trail of education-record access | Built |

### F.5  WCAG 2.1 AA Checklist

| Item | Status |
|---|---|
| Contrast ratios | Specified, pending automated audit |
| Screen reader support | Specified, pending manual audit |
| Keyboard navigation | Specified, pending manual audit |
| RTL rendering correctness | Specified, pending the M6 sample audit |

**AIC-APP-F-001:** Items marked Pending in this Appendix are tracked to closure via the Part 14 milestone schedule and Part 16 risk register, not left open indefinitely.
**AIC-APP-F-002:** A formal Data Protection Impact Assessment is recommended as a Pre-Phase 0 or early-Phase-A activity, conducted by the DPO, given Module 4.5 processes special-category mental health data.

---

## APPENDIX G — Open-Source / Self-Hosted Model Evaluation

Evaluates the self-hosted Tier C classification model referenced in Section 8.1.1.

| Criterion | Llama 3.x | Mistral / Mixtral | Qwen 2.x | DeepSeek-class |
|---|---|---|---|---|
| Licence | Llama Community License | Apache 2.0 | Apache 2.0 / Tongyi Qianwen | Generally permissive |
| Urdu/Arabic support | Moderate | Moderate | Strong | Moderate |
| Fine-tuning ecosystem | Very mature | Mature | Growing rapidly | Growing |
| Inference cost at high volume | Low when self-hosted | Low | Low | Low |
| Classification-task suitability | Strong with fine-tuning | Strong | Strong, especially Urdu/Arabic | Adequate |
| Community / support | Largest | Strong | Growing, strong in multilingual NLP | Smaller |

**Recommendation:** Qwen 2.x (a 7B-class variant, fine-tuned for Tier C classification tasks) is recommended, given its stronger multilingual performance relevant to P3's Urdu/Arabic-heavy classification load. Llama 3.x (8B) is documented as the fallback.

**AIC-APP-G-001:** This evaluation shall be re-validated once Gap G12 latency testing is complete.
**AIC-APP-G-002:** Whichever model is selected, it shall be version-pinned and re-evaluated before any version change.

---

## APPENDIX H — Glossary

| Term | Definition |
|---|---|
| AKS | Azure Kubernetes Service |
| AIC | AI Student Coach — product P3 |
| BR / FR / TR / NFR / UIR | Business Rule / Functional Requirement / Technical Requirement / Non-Functional Requirement / UI Requirement |
| CI/CD | Continuous Integration / Continuous Deployment |
| Critical Path | The chain of dependent phases with zero schedule float, directly determining the launch date |
| Fail-closed | On failure of a protective control, the system blocks the action rather than allowing it |
| Float (schedule) | The amount a phase's finish date can slip without delaying the project end date |
| Guardrail (Layer 2) | A deterministic, code-level check independent of model instruction-following |
| Guided mode | Homework Assistant behavior giving hints, not the exact graded answer |
| HPA | Horizontal Pod Autoscaler |
| IaC | Infrastructure as Code |
| Knowledge Graph | Linked data model connecting Student, Course, Learning Objective, Assessment, Resource, Recommendation |
| LLM | Large Language Model |
| Mirrored domain | A data domain read-only cached from P1, never written by P3 |
| OWASP Top 10 | The ten most critical web application security risks |
| p50 / p95 / p99 | The 50th / 95th / 99th percentile of a measured distribution |
| Prompt injection | An attack making an LLM disregard its system instructions via embedded conflicting instructions |
| RAG | Retrieval-Augmented Generation |
| RBAC | Role-Based Access Control |
| RPO / RTO | Recovery Point Objective / Recovery Time Objective |
| RTL | Right-to-Left text rendering |
| Schema-per-domain | Database design isolating each data domain into its own PostgreSQL schema |
| SLA | Service Level Agreement |
| SSO | Single Sign-On |
| Tenant isolation | The guarantee that one tenant's data is never accessible to another |
| Tier A / B / C | Model Gateway routing tiers: A=reasoning, B=synthesis, C=classification |
| TLS | Transport Layer Security |
| TTS / STT | Text-to-Speech / Speech-to-Text |
| WAU | Weekly Active Users |
| WCAG 2.1 AA | Web Content Accessibility Guidelines, level AA |
| Zero-tolerance alert | A monitoring alert category with no acceptable occurrence rate |

---

## APPENDIX I — Final Acceptance Sign-Off

Executed once Part 14's M8 milestone is reached and all Pre-Launch Checklist items are confirmed complete.

| Field | Detail |
|---|---|
| Product | P3 — AI Student Coach |
| SRS Version Accepted | v1.0 |
| Scope Accepted | As defined in Part 1.3, as amended through any Part 17.6 amendments up to this date |

### Acceptance Statement

By signing below, the Client confirms that:
1. All Pre-Launch Checklist items have been reviewed and confirmed complete.
2. UAT has been executed and signed off.
3. All Critical/High security findings have been remediated and verified.
4. The product as delivered conforms to this Master SRS as amended through the date below.
5. Any outstanding Medium/Low punch-list items are accepted as documented.

| Signatory | Name | Title | Date | Signature |
|---|---|---|---|---|
| Client Representative | | | | |
| Consultant Engagement Lead | | | | |
| DPO (confirming Wellbeing/Consent compliance) | | | | |

**AIC-APP-I-001:** This sign-off page, once executed, becomes the authoritative record that v1.0 is accepted; any subsequent change is governed by the Part 17.6 amendment process.

---

## APPENDICES — CLOSE-OUT

| Appendix | Title | Status |
|---|---|---|
| A | ER Diagrams | Indexed — full content in Part 9.3 |
| B | Wireframes Package | Indexed — full content in Part 7 |
| C | API Catalog | Indexed — full content in Part 9.4 + JSON variant-shape reference |
| D | Requirement Traceability Matrix | Structure + sample; full matrix routed to companion XLSX |
| E | Test Case Library | Structure + extended sample; full library routed to companion XLSX |
| F | Compliance Checklists | Complete |
| G | Open Source Evaluation | Complete |
| H | Glossary | Complete |
| I | Final Acceptance Sign-Off | Template ready for execution at M8 |

*This completes the Master SRS for P3 — AI Student Coach: 17 numbered Parts plus Appendices A-I. Remaining work outside this document's scope: compiling Part 0 (Document Control) and assembling the 7 deliverable files once the still-open client-facing gaps are resolved.*
