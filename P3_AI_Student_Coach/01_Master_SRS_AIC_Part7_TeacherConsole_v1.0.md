# MASTER SRS — P3 AI STUDENT COACH
## Part 7 — Screen Specifications
### Teacher Console (full surface)

*Layer 3 — UI/UX & Experience · Standalone screen-spec document within the Part 7 set*

| Field | Value |
|---|---|
| Surface | Teacher Console (web, within P1 portal, P3 tab) |
| Breakpoints | Per AIC-UIR-016: specified at Tablet + Desktop; Mobile-S is read-only summary only |
| Screens | SCR-TDASH-001, SCR-TQUEUE-001, SCR-TTRANS-001, SCR-TLOG-001, SCR-TCTRL-001, SCR-TWELL-001, SCR-TREC-001 |
| Module | 4.9 — Teacher Oversight Console |

---

## SCR-TDASH-001 — Oversight Dashboard

**Purpose:** Give the teacher a per-class overview of coach usage and pending items.

**Wireframe — Desktop**
```
┌──────────────────────────────────────────────────────────┐
│ P3 Oversight     Class: [Grade 9A ▾]                        │
├──────────────────────────────────────────────────────────┤
│  Usage this week: 84 sessions · 12 graded-context turns      │
│                                                               │
│  ┌────────────┐ ┌────────────┐ ┌────────────┐                │
│  │ Flag queue  │ │ Turn log    │ │ Wellbeing   │                │
│  │ 3 open      │ │ View →     │ │ 1 summary   │                │
│  │ [Review →]  │ │            │ │ [View →]    │                │
│  └────────────┘ └────────────┘ └────────────┘                │
└──────────────────────────────────────────────────────────┘
```
**Tablet:** Cards stack 2-per-row. **Mobile-S:** Read-only summary list of the three counts only; no review actions (per AIC-UIR-016).

| Components | Type | Data Source | States |
|---|---|---|---|
| Class selector | Dropdown | Teacher's assigned classes (BR-AIC-O-01) | default |
| Usage summary | Stat text | Module 4.9 telemetry | populated |
| Flag/Log/Wellbeing cards | Card | 4.9 | populated, empty (zero counts) |

| Actions | Trigger | Outcome | Permission |
|---|---|---|---|
| Switch class | Select | Reloads dashboard for that class | Teacher (assigned classes only) |
| Open flag queue | Tap | Routes to SCR-TQUEUE-001 | Teacher |
| Open turn log | Tap | Routes to SCR-TLOG-001 | Teacher |
| Open wellbeing | Tap | Routes to SCR-TWELL-001 | Teacher |

**Validation:** N/A. **Loading:** Skeleton cards.
**Empty:** "Nothing to review this week" if all counts are zero.
**Error:** "You don't have access to that class." if a class outside assignment is requested (BR-AIC-O-01).

---

## SCR-TQUEUE-001 — Flag Queue & Sampled Review

**Purpose:** Show integrity flags and the sampled review set for the teacher's classes.

**Wireframe — Desktop**
```
┌──────────────────────────────────────────────────────────┐
│ ← Back   Flag Queue          Filter: [Type ▾][Date ▾]      │
├──────────────────────────────────────────────────────────┤
│  🚩 Ali K. — Repeated attempts on Q3 Algebra Quiz    [Open]  │
│  🔍 Sara M. — Sampled review, Maths homework         [Open]  │
└──────────────────────────────────────────────────────────┘
```
**Tablet:** Same list, condensed row spacing. **Mobile-S:** Count summary only ("3 open flags") with a link to open on desktop/tablet.

| Components | Type | Data Source | States |
|---|---|---|---|
| Filter controls | Dropdowns | type/date (4.9.8) | default |
| Flag/sample list | List | 4.2/4.9 | populated, empty |

| Actions | Trigger | Outcome | Permission |
|---|---|---|---|
| Open item | Tap | Routes to SCR-TTRANS-001 | Teacher (assigned classes) |
| Filter | Select | Narrows list | Teacher |

**Validation:** Date range start <= end (4.9.8).
**Loading:** Skeleton list. **Empty:** "No flags right now."
**Error:** "Still loading — showing the latest flags first." on large-volume timeout (4.9.9).

---

## SCR-TTRANS-001 — Transcript Detail

**Purpose:** Let the teacher review a flagged or sampled transcript and acknowledge it.

**Wireframe — Desktop**
```
┌──────────────────────────────────────────────────────────┐
│ ← Back   Transcript — Ali K., Algebra Quiz, Q3              │
├──────────────────────────────────────────────────────────┤
│  🧑‍🎓 What's the answer to question 3?                       │
│  🤖 [Guided] Let's work through it — first, factor...         │
│  🧑‍🎓 Just give me the answer                                 │
│  🤖 [Guided] I can't give the final answer, but here's a hint │
│                                                               │
│  Note: [                                          ]           │
│                                          [Acknowledge →]       │
└──────────────────────────────────────────────────────────┘
```
**Tablet:** Same layout, narrower message width. **Mobile-S:** Not available (desktop/tablet only per AIC-UIR-016).

| Components | Type | Data Source | States |
|---|---|---|---|
| Transcript thread | List (read-only) | Logged turns with mode tags (4.2) | populated |
| Note field | Textarea | 1–1,000 chars (4.9.8) | empty, typing, error |
| Acknowledge button | Button | — | enabled, disabled (no note) |

| Actions | Trigger | Outcome | Permission |
|---|---|---|---|
| Acknowledge with note | Tap | Flag resolved; note + teacher + timestamp recorded immutably (UC-O-06) | Teacher |

**Validation:** Note required (1–1,000 chars) before acknowledge enables (4.9.8/4.9.9).
**Loading:** Skeleton thread. **Empty:** N/A (only reached from an existing item).
**Error:** "Add a note before resolving this flag." (4.9.9).

---

## SCR-TLOG-001 — Graded-Context Turn Log

**Purpose:** Show all graded-context turns with mode tags for the teacher's classes.

**Wireframe — Desktop**
```
┌──────────────────────────────────────────────────────────┐
│ ← Back   Graded-Context Log    Filter: [Student▾][Item▾]    │
├──────────────────────────────────────────────────────────┤
│ Student      Item              Mode      Time               │
│ Ali K.       Algebra Quiz Q3    Guided    2:14 PM            │
│ Sara M.      Essay Draft        Full-sol. 1:02 PM            │
└──────────────────────────────────────────────────────────┘
```
**Tablet:** Table scrolls horizontally if needed. **Mobile-S:** Total turn count only.

| Components | Type | Data Source | States |
|---|---|---|---|
| Log table | Table | 4.2 immutable log | populated, empty |
| Filters | Dropdowns | student/item/date | default |

| Actions | Trigger | Outcome | Permission |
|---|---|---|---|
| Filter | Select | Narrows table | Teacher |
| Open turn detail | Tap row | Routes to SCR-TTRANS-001 context | Teacher |

**Validation:** N/A. **Loading:** Skeleton table. **Empty:** "No graded-context activity yet."
**Error:** "Couldn't load the log right now" with retry.

---

## SCR-TCTRL-001 — Per-Student / Per-Assignment Controls

**Purpose:** Let the teacher enable/disable coach help at a granular level.

**Wireframe — Desktop**
```
┌──────────────────────────────────────────────────────────┐
│ ← Back   Controls — Grade 9A                                 │
├──────────────────────────────────────────────────────────┤
│  Per assignment:                                              │
│   Algebra Quiz Q3      Full help: [ Disabled ● Enabled ◯ ]    │
│  Per student:                                                  │
│   Ali K.                Coach access: [ Enabled ● Disabled ◯ ]│
└──────────────────────────────────────────────────────────┘
```
**Tablet:** Same toggle list. **Mobile-S:** Read-only status list, no toggles (per AIC-UIR-016).

| Components | Type | Data Source | States |
|---|---|---|---|
| Assignment toggle list | Toggle/switch | 4.2 (AIC-FR-031) | enabled, disabled, pending (propagating) |
| Student toggle list | Toggle/switch | 4.2/4.5 | enabled, disabled, pending |

| Actions | Trigger | Outcome | Permission |
|---|---|---|---|
| Toggle assignment help | Tap | Propagates within 30s (UC-H-06/UC-O-04) | Teacher (assigned classes) |
| Toggle student access | Tap | Propagates within 30s | Teacher |

**Validation:** N/A. **Loading:** "Pending" badge during propagation.
**Empty:** N/A. **Error:** "Couldn't apply that change. Retrying." (4.9.9); conflict note shown if a School Admin override exists (EC-AIC-O-02).

---

## SCR-TWELL-001 — Wellbeing Summary Alerts (teacher view)

**Purpose:** Show class-level wellbeing alerts at summary level only — identical privacy boundary to SCR-PWELL-001.

**Wireframe — Desktop**
```
┌──────────────────────────────────────────────────────────┐
│ ← Back   Wellbeing — Grade 9A                                │
├──────────────────────────────────────────────────────────┤
│  Sara M. may be going through a hard time. The              │
│  psychologist has been notified.                              │
└──────────────────────────────────────────────────────────┘
```
**Tablet:** Same. **Mobile-S:** Count only ("1 active summary").

| Components | Type | Data Source | States |
|---|---|---|---|
| Summary alert card | Card (read-only) | 4.5 summary output (BR-AIC-O-02) | none, alert-present |

| Actions | Trigger | Outcome | Permission |
|---|---|---|---|
| (read-only — no detail access) | — | — | Teacher |

**Validation:** N/A. **Loading:** N/A. **Empty:** "No wellbeing alerts for this class."
**Error:** "Only summary-level wellbeing information is available here." shown if any attempt is made to access deeper detail (BR-AIC-O-02) — this is a permission boundary, not a failure state.

---

## SCR-TREC-001 — Student Recommendations (read-only)

**Purpose:** Let the teacher view a student's personalization recommendations to align support.

**Wireframe — Desktop**
```
┌──────────────────────────────────────────────────────────┐
│ ← Back   Recommendations — Ali K.                            │
├──────────────────────────────────────────────────────────┤
│  Next step: Review Quadratic Equations                        │
│  Weak topics: Trigonometry                                     │
└──────────────────────────────────────────────────────────┘
```
**Tablet:** Same. **Mobile-S:** Not available.

| Components | Type | Data Source | States |
|---|---|---|---|
| Recommendation list | List (read-only) | 4.8 | populated, empty |

| Actions | Trigger | Outcome | Permission |
|---|---|---|---|
| (read-only) | — | — | Teacher (assigned classes) |

**Validation:** N/A. **Loading:** Skeleton list. **Empty:** "No recommendations yet for this student."
**Error:** "Couldn't load this right now" with retry.

---

### Layer 3 gate status — Part 7, Teacher Console

| Gate item | Status |
|---|---|
| Screen coverage | 7 of 7 Teacher Console screens specified |
| Wireframes per breakpoint | Pass — Tablet + Desktop full; Mobile-S summary-only per AIC-UIR-016 |
| Component / action / validation / state tables | Pass for all 7 |

*Next: Part 7 — School Admin Console (6 screens).*
