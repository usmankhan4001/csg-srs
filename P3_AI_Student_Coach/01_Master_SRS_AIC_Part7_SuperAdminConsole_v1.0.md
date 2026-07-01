# MASTER SRS — P3 AI STUDENT COACH
## Part 7 — Screen Specifications
### Super Admin Console (full surface — closes Part 7)

*Layer 3 — UI/UX & Experience · Standalone screen-spec document within the Part 7 set*

| Field | Value |
|---|---|
| Surface | Super Admin Console (web) |
| Breakpoints | Per AIC-UIR-016: Tablet + Desktop; Mobile-S read-only summary only |
| Screens | SCR-PROV-001, SCR-GATEWAY-001, SCR-CAP-001, SCR-THRESH-001, SCR-WELLCFG-001, SCR-LICENSE-001, SCR-FLAGS-001, SCR-XUSAGE-001, SCR-AUDIT-001 |
| Module | 4.11 — Admin & Configuration (Super Admin scope) |

---

## SCR-PROV-001 — Tenant Provisioning

**Purpose:** Provision a new tenant school for P3.

**Wireframe — Desktop**
```
┌──────────────────────────────────────────────────────────┐
│ Super Admin     Tenant Provisioning                          │
├──────────────────────────────────────────────────────────┤
│  School: [ Lighthouse — Lahore Campus     ]                   │
│  Region: [ Pakistan ▾ ]   Languages: [☑EN ☑UR ☐AR]            │
│                                          [Provision →]          │
└──────────────────────────────────────────────────────────┘
```
**Tablet:** Same form. **Mobile-S:** Read-only list of provisioned tenants.

| Components | Type | Data Source | States |
|---|---|---|---|
| School field | Text/linked picker | P1 tenant list | default |
| Region dropdown | Dropdown | Supported regions (4.11.8) | default |
| Language checkboxes | Checkbox group | {en, ur, ar} | default |

| Actions | Trigger | Outcome | Permission |
|---|---|---|---|
| Provision | Tap | Tenant configured for P3 (UC-A-01); versioned + audited | Super Admin |

**Validation:** Region required, from supported list; >=1 language selected (4.11.8).
**Loading:** "Provisioning..." spinner. **Empty:** N/A.
**Error:** Region-unsupported blocks save; shows supported list.

---

## SCR-GATEWAY-001 — Model Gateway

**Purpose:** Configure provider keys, tier routing, and failover order.

**Wireframe — Desktop**
```
┌──────────────────────────────────────────────────────────┐
│ ← Back   Model Gateway                                       │
├──────────────────────────────────────────────────────────┤
│  Tier A (reasoning):  1) Anthropic  2) OpenAI                  │
│  Tier B (synthesis):  1) OpenAI     2) Gemini                  │
│  Tier C (classify):   1) Local model                            │
│                                                                  │
│  Provider keys: Anthropic [●●●●●●●● Saved] [Edit]                │
│                                          [Save routing →]        │
└──────────────────────────────────────────────────────────┘
```
**Tablet:** Same layout. **Mobile-S:** Read-only current routing order.

| Components | Type | Data Source | States |
|---|---|---|---|
| Tier routing lists | Ordered list (drag-reorder) | 4.11.8 | default |
| Provider key fields | Masked secret input | Encrypted store (BR-AIC-A-07) | empty, saved-masked, error |

| Actions | Trigger | Outcome | Permission |
|---|---|---|---|
| Reorder failover | Drag/select | Applies to subsequent requests (UC-A-03) | Super Admin |
| Save/edit key | Enter + save | Stored encrypted; masked after save | Super Admin |

**Validation:** >=1 provider per tier; key format validated per provider (4.11.8).
**Loading:** N/A. **Empty:** N/A.
**Error:** "That provider key was rejected. Check and re-enter it." (4.11.9).

---

## SCR-CAP-001 — Token Cap & Throttle Policy

**Purpose:** Set the per-student monthly token cap and throttle behaviour.

**Wireframe — Desktop**
```
┌──────────────────────────────────────────────────────────┐
│ ← Back   Token Cap Policy                                     │
├──────────────────────────────────────────────────────────┤
│  Cap per student/month: [ 2,000,000 ] tokens                   │
│  On reaching cap: [ Throttle to Tier B/C ▾ ]                    │
│                                          [Save →]                │
└──────────────────────────────────────────────────────────┘
```
**Tablet:** Same form. **Mobile-S:** Read-only current cap value.

| Components | Type | Data Source | States |
|---|---|---|---|
| Cap field | Number input | 4.11.8, floor enforced | default, error |
| Throttle policy dropdown | Dropdown | — | default |

| Actions | Trigger | Outcome | Permission |
|---|---|---|---|
| Save cap | Tap | Applies per policy (UC-A-04); never blocks wellbeing escalation (AIC-FR-099) | Super Admin |

**Validation:** Cap >= configured floor, not zero (BR-AIC-A-05).
**Loading:** N/A. **Empty:** N/A.
**Error:** "Token cap must be at least the minimum allowed value." (4.11.9).

---

## SCR-THRESH-001 — Detection Thresholds

**Purpose:** Tune homework-similarity, RAG-relevance, personalization, and sampling thresholds.

**Wireframe — Desktop**
```
┌──────────────────────────────────────────────────────────┐
│ ← Back   Detection Thresholds                                  │
├──────────────────────────────────────────────────────────┤
│  Homework similarity:     [ 0.85 ]                              │
│  RAG relevance:           [ 0.80 ]                               │
│  Recommendation volume cap:[ 5 ]   Cooldown (days): [ 7 ]         │
│  Sampling rate (teacher review): [ 0.05 ]                         │
│                                          [Save →]                 │
└──────────────────────────────────────────────────────────┘
```
**Tablet:** Same form. **Mobile-S:** Read-only current values.

| Components | Type | Data Source | States |
|---|---|---|---|
| Threshold fields | Decimal/number inputs | 4.11.8 (ranges per field) | default, error |

| Actions | Trigger | Outcome | Permission |
|---|---|---|---|
| Save thresholds | Tap | Governs subsequent detections in owning modules (UC-A-05) | Super Admin |

**Validation:** Similarity/relevance 0.50–0.99; volume cap 1–20; cooldown 1–60 days; sampling 0.05–1.00 (4.11.8).
**Loading:** N/A. **Empty:** N/A.
**Error:** "Enter a value between 0.50 and 0.99." for out-of-range fields (4.11.9).

---

## SCR-WELLCFG-001 — Wellbeing Thresholds & Recipients

**Purpose:** Configure escalation thresholds and recipients for the Wellbeing Coach — a safety-critical screen requiring approval.

**Wireframe — Desktop**
```
┌──────────────────────────────────────────────────────────┐
│ ← Back   Wellbeing Configuration     ⚠ Approval required     │
├──────────────────────────────────────────────────────────┤
│  L1 threshold: [ 0.60 ]    L2 sensitivity: [ High ▾ ]           │
│  Escalation recipients:                                          │
│   L1 → Psychologist queue                                        │
│   L2 → Psychologist + School Admin                                │
│   L3 → Safeguarding lead + Emergency contact                      │
│                                          [Submit for approval →]  │
└──────────────────────────────────────────────────────────┘
```
**Tablet:** Same form. **Mobile-S:** Read-only current configuration, no edit.

| Components | Type | Data Source | States |
|---|---|---|---|
| Threshold/sensitivity fields | Decimal/enum | 4.5.8 | default, error |
| Recipient mapping | Read-only structure (editable by role) | 4.11.8 | default |
| Approval banner | Banner | BR-AIC-A-04 | always visible |

| Actions | Trigger | Outcome | Permission |
|---|---|---|---|
| Submit for approval | Tap | Held pending Psychologist/DPO approval before taking effect (UC-A-06) | Super Admin (Psychologist co-approves) |

**Validation:** Threshold 0.00–1.00; recipients must resolve to valid P1 roles (4.5.8/4.11.8).
**Loading:** N/A. **Empty:** N/A.
**Error:** "This change needs approval before it takes effect." (4.11.9).

---

## SCR-LICENSE-001 — License / Rights Confirmation

**Purpose:** Confirm or revoke license/indexing rights for uploaded content.

**Wireframe — Desktop**
```
┌──────────────────────────────────────────────────────────┐
│ ← Back   License Confirmation                                  │
├──────────────────────────────────────────────────────────┤
│  Algebra Stage Guide.pdf — Lahore Campus     [Confirm rights →]│
│  Biology Notes Ch4.docx — Lahore Campus      ✓ Confirmed         │
└──────────────────────────────────────────────────────────┘
```
**Tablet:** Same list. **Mobile-S:** Pending-count summary only.

| Components | Type | Data Source | States |
|---|---|---|---|
| Pending content list | List | 4.7 staged content | pending, confirmed, revoked |

| Actions | Trigger | Outcome | Permission |
|---|---|---|---|
| Confirm rights | Tap | Content indexed within reindex window (UC-K-04) | Super Admin |
| Revoke rights | Tap | Content removed from index within window (UC-A...EC-AIC-A-07) | Super Admin |

**Validation:** N/A (binary confirm/revoke action).
**Loading:** N/A. **Empty:** "Nothing pending confirmation."
**Error:** "Couldn't update this right now" with retry.

---

## SCR-FLAGS-001 — Feature Flags

**Purpose:** Enable or disable P3 features per school.

**Wireframe — Desktop**
```
┌──────────────────────────────────────────────────────────┐
│ ← Back   Feature Flags     School: [Lahore Campus ▾]          │
├──────────────────────────────────────────────────────────┤
│  Career Coach          [ On ● Off ◯ ]                           │
│  Mock Test              [ On ● Off ◯ ]                           │
│  TTS Read-aloud         [ Off ● On ◯ ]                           │
└──────────────────────────────────────────────────────────┘
```
**Tablet:** Same toggle list. **Mobile-S:** Read-only current flag states.

| Components | Type | Data Source | States |
|---|---|---|---|
| School selector | Dropdown | Tenant list | default |
| Feature toggle list | Toggle | 4.11 feature flag store | on, off, pending |

| Actions | Trigger | Outcome | Permission |
|---|---|---|---|
| Toggle feature | Tap | Module ends gracefully if disabled mid-use; entry points hidden (EC-AIC-A-05) | Super Admin |

**Validation:** N/A. **Loading:** "Pending" badge. **Empty:** N/A.
**Error:** "Couldn't apply that change — try again."

---

## SCR-XUSAGE-001 — Cross-School Usage & Cost

**Purpose:** Show usage and cost across all tenant schools.

**Wireframe — Desktop**
```
┌──────────────────────────────────────────────────────────┐
│ ← Back   Cross-School Usage & Cost      Period: [This month▾]│
├──────────────────────────────────────────────────────────┤
│ School              Active     Avg Tok/Student   Cost           │
│ Lahore Campus        412        1.2M              $X             │
│ Karachi Campus        205        0.9M              $X             │
│ [Export →]                                                       │
└──────────────────────────────────────────────────────────┘
```
**Tablet:** Same table, horizontal scroll if needed. **Mobile-S:** Aggregate total only.

| Components | Type | Data Source | States |
|---|---|---|---|
| Cross-school table | Table | 4.11 telemetry (RPT-AIC-05) | populated |
| Period selector | Dropdown | — | default |
| Export control | Button | — | default, exporting |

| Actions | Trigger | Outcome | Permission |
|---|---|---|---|
| Change period | Select | Reloads table | Super Admin |
| Export | Tap | Generates CSV | Super Admin |

**Validation:** N/A. **Loading:** Skeleton table. **Empty:** N/A.
**Error:** "Couldn't load this report right now" with retry.

---

## SCR-AUDIT-001 — Global Audit Log

**Purpose:** Let the Super Admin/Auditor query configuration, consent, and safety audit records globally.

**Wireframe — Desktop**
```
┌──────────────────────────────────────────────────────────┐
│ ← Back   Global Audit Log    Filter: [School▾][Type▾][Date▾]│
├──────────────────────────────────────────────────────────┤
│ Actor          Action                          Time           │
│ S. Admin (LHE) Helpline updated (pending appr.)  10:02 AM       │
│ Super Admin    Token cap changed: 2M → 1.5M      9:14 AM        │
└──────────────────────────────────────────────────────────┘
```
**Tablet:** Same table. **Mobile-S:** Not available (desktop/tablet only).

| Components | Type | Data Source | States |
|---|---|---|---|
| Audit table | Table | All module audit logs (4.11.7) | populated, out-of-window |
| Filters | Dropdowns | school/type/date | default |

| Actions | Trigger | Outcome | Permission |
|---|---|---|---|
| Filter/query | Select | Narrows table | Super Admin, Auditor |
| Export | Tap | CSV/PDF export for compliance | Super Admin |

**Validation:** Date range start <= end, within retention window (4.11.8).
**Loading:** Skeleton table. **Empty:** "No matching audit entries."
**Error:** Records beyond retention shown as "out of window" rather than fabricated/omitted silently.

---

### Layer 3 gate status — Part 7, Super Admin Console

| Gate item | Status |
|---|---|
| Screen coverage | 9 of 9 Super Admin Console screens specified |
| Wireframes per breakpoint | Pass — Tablet + Desktop full; Mobile-S summary-only/unavailable per screen sensitivity |
| Component / action / validation / state tables | Pass for all 9 |

---

## PART 7 — CLOSE-OUT (All Surfaces)

| Surface | Screens |
|---|---|
| Student App | 29 |
| Parent App | 6 |
| Teacher Console | 7 |
| School Admin Console | 6 |
| Super Admin Console | 9 |
| **Total** | **57 screens** |

*Part 7 complete. Layer 3 (Parts 6 + 7) closed — every screen named in the Part 6 navigation trees now has a full specification. Next: Layer 4 — Part 8 (Solution Architecture).*
