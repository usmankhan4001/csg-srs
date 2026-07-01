# MASTER SRS — P3 AI STUDENT COACH
## Part 7 — Screen Specifications
### School Admin Console (full surface)

*Layer 3 — UI/UX & Experience · Standalone screen-spec document within the Part 7 set*

| Field | Value |
|---|---|
| Surface | School Admin Console (web) |
| Breakpoints | Per AIC-UIR-016: Tablet + Desktop; Mobile-S read-only summary only |
| Screens | SCR-SENABLE-001, SCR-SCONTENT-001, SCR-SCONSENT-001, SCR-SHELP-001, SCR-SUSAGE-001, SCR-STEMPL-001 |
| Module | 4.11 — Admin & Configuration (School Admin scope) |

---

## SCR-SENABLE-001 — P3 Enablement (grade/section)

**Purpose:** Let the School Admin enable or disable P3 per grade/section.

**Wireframe — Desktop**
```
┌──────────────────────────────────────────────────────────┐
│ P3 Setup     Enablement                                     │
├──────────────────────────────────────────────────────────┤
│  Grade 9A     [ Enabled ● Disabled ◯ ]                        │
│  Grade 9B     [ Enabled ● Disabled ◯ ]                        │
│  Grade 6A     [ Disabled ● Enabled ◯ ]                        │
└──────────────────────────────────────────────────────────┘
```
**Tablet:** Same toggle list. **Mobile-S:** Read-only enabled/disabled status list.

| Components | Type | Data Source | States |
|---|---|---|---|
| Section toggle list | Toggle | P1 sections (AIC-FR-194) | enabled, disabled, pending |

| Actions | Trigger | Outcome | Permission |
|---|---|---|---|
| Toggle section | Tap | Applies within 60s (UC-A-02); active sessions end gracefully on disable (BR-AIC-A-06) | School Admin (own school) |

**Validation:** N/A. **Loading:** "Pending" badge during propagation.
**Empty:** N/A. **Error:** "P3 will be disabled and current sessions will end shortly." confirmation on disable (4.11.9).

---

## SCR-SCONTENT-001 — Content Corpus Management

**Purpose:** Let the School Admin upload and manage school curriculum materials for RAG indexing.

**Wireframe — Desktop**
```
┌──────────────────────────────────────────────────────────┐
│ ← Back   Content Library                                    │
├──────────────────────────────────────────────────────────┤
│  [+ Upload material]                                          │
│                                                                │
│  Algebra Stage Guide.pdf    Stage 9 · Maths   Pending license  │
│  Biology Notes Ch4.docx     Stage 9 · Biology  ✓ Indexed        │
└──────────────────────────────────────────────────────────┘
```
**Tablet:** Same list. **Mobile-S:** Count + status summary only.

| Components | Type | Data Source | States |
|---|---|---|---|
| Upload control | File picker + metadata form | 4.7 (PDF/DOCX/TXT/HTML/MD, <=100MB) | default, uploading |
| Content list | List | 4.7 corpus | pending-license, indexed, quarantined |

| Actions | Trigger | Outcome | Permission |
|---|---|---|---|
| Upload material | Select file + metadata | Staged pending license confirmation (UC-K-03) | School Admin (own school) |

**Validation:** Format PDF/DOCX/TXT/HTML/MD; <=100MB; stage + subject required (4.7.8).
**Loading:** "Uploading..." progress bar.
**Empty:** "No materials uploaded yet."
**Error:** "That file type isn't supported." / "That file exceeds the 100 MB limit." (4.7.9); "This content was flagged by the safety filter and was not indexed." for quarantined items.

---

## SCR-SCONSENT-001 — Consent Register

**Purpose:** Let the School Admin view consent status across the school.

**Wireframe — Desktop**
```
┌──────────────────────────────────────────────────────────┐
│ ← Back   Consent Register      Filter: [Status▾][Grade▾]   │
├──────────────────────────────────────────────────────────┤
│ Student      Guardian       Status        Date               │
│ Ahmed K.     Asif Khan      Pending        —                  │
│ Zainab F.    Asif Khan      Approved       12 Jun 2026        │
└──────────────────────────────────────────────────────────┘
```
**Tablet:** Same table. **Mobile-S:** Aggregate counts only (e.g., "42 approved, 5 pending").

| Components | Type | Data Source | States |
|---|---|---|---|
| Consent table | Table | 4.10 register | populated, empty |
| Filters | Dropdowns | status/grade | default |

| Actions | Trigger | Outcome | Permission |
|---|---|---|---|
| Filter | Select | Narrows table | School Admin |
| Export report | Tap | Generates RPT-AIC-07 (consent register report) | School Admin |

**Validation:** N/A. **Loading:** Skeleton table. **Empty:** "No consent records yet."
**Error:** "Couldn't load the register right now" with retry.

---

## SCR-SHELP-001 — Helpline Registry (school entry)

**Purpose:** Let the School Admin/DPO enter the regional helpline used in wellbeing safe responses.

**Wireframe — Desktop**
```
┌──────────────────────────────────────────────────────────┐
│ ← Back   Helpline Registry                                   │
├──────────────────────────────────────────────────────────┤
│  Region: Pakistan                                             │
│  Channel: [ Phone ▾ ]   Contact: [ 0800-XXXXX        ]        │
│                                          [Save →]               │
│  ⚠ Requires DPO/clinician approval before going live           │
└──────────────────────────────────────────────────────────┘
```
**Tablet:** Same form. **Mobile-S:** Read-only current value display only.

| Components | Type | Data Source | States |
|---|---|---|---|
| Region field | Read-only/dropdown | Tenant region | default |
| Channel + contact fields | Dropdown + text | 4.11.8 | empty, filled, error |
| Approval notice | Banner | BR-AIC-A-04 | always visible |

| Actions | Trigger | Outcome | Permission |
|---|---|---|---|
| Save entry | Tap | Held pending approver before taking effect (UC-A-06) | School Admin / DPO |

**Validation:** Region + channel + contact value all required, non-empty (4.11.8).
**Loading:** N/A. **Empty:** "No helpline configured for this region yet" warning state.
**Error:** "Complete the region, channel, and contact before saving." (4.11.9).

---

## SCR-SUSAGE-001 — Usage & Cost Report (school)

**Purpose:** Show the School Admin coach usage and cost adherence for their school.

**Wireframe — Desktop**
```
┌──────────────────────────────────────────────────────────┐
│ ← Back   Usage & Cost — This Month                           │
├──────────────────────────────────────────────────────────┤
│  Active students: 412 / 450     Avg tokens/student: 1.2M      │
│  Students near cap: 6            [View list →]                 │
│  [Export CSV/PDF →]                                             │
└──────────────────────────────────────────────────────────┘
```
**Tablet:** Same stat layout. **Mobile-S:** Headline stats only.

| Components | Type | Data Source | States |
|---|---|---|---|
| Usage stats | Stat cards | 4.11 telemetry (RPT-AIC-04) | populated |
| Near-cap list link | Link | Token-cap telemetry | default |
| Export control | Button | — | default, exporting |

| Actions | Trigger | Outcome | Permission |
|---|---|---|---|
| View near-cap list | Tap | Shows students approaching token cap | School Admin |
| Export | Tap | Generates CSV/PDF report | School Admin |

**Validation:** N/A. **Loading:** Skeleton stats. **Empty:** N/A (always has at least zero-state data).
**Error:** "Couldn't load this report right now" with retry.

---

## SCR-STEMPL-001 — Notification Templates

**Purpose:** Let the School Admin customize localized notification templates.

**Wireframe — Desktop**
```
┌──────────────────────────────────────────────────────────┐
│ ← Back   Notification Templates    Language: [Urdu ▾]       │
├──────────────────────────────────────────────────────────┤
│  Weekly parent summary:                                       │
│  [ Dear {parent_name}, here is {student_name}'s week...  ]    │
│                                          [Save →]               │
└──────────────────────────────────────────────────────────┘
```
**Tablet:** Same form. **Mobile-S:** Read-only template list.

| Components | Type | Data Source | States |
|---|---|---|---|
| Language selector | Dropdown | Available languages (4.11) | default |
| Template editor | Textarea with merge-field validation | 4.11.8 | default, error (invalid merge field) |

| Actions | Trigger | Outcome | Permission |
|---|---|---|---|
| Save template | Tap | Updates the localized template | School Admin |

**Validation:** Merge fields must resolve to valid tokens; 1–4,000 chars (4.11.8).
**Loading:** N/A. **Empty:** Default system template shown if none customized.
**Error:** "Couldn't save this template — check the merge fields and try again."

---

### Layer 3 gate status — Part 7, School Admin Console

| Gate item | Status |
|---|---|
| Screen coverage | 6 of 6 School Admin Console screens specified |
| Wireframes per breakpoint | Pass — Tablet + Desktop full; Mobile-S summary-only |
| Component / action / validation / state tables | Pass for all 6 |

*Next: Part 7 — Super Admin Console (9 screens) — final surface, closes Part 7.*
