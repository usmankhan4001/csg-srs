# MASTER SRS — P3 AI STUDENT COACH
## Part 7 — Screen Specifications
### Student App — Batch 3: Career Hub

*Layer 3 — UI/UX & Experience · Standalone screen-spec document within the Part 7 set*

| Field | Value |
|---|---|
| Surface | Student App (Web, iOS, Android) |
| Screens in this batch | SCR-CAR-001, SCR-CAR-002, SCR-CAR-003, SCR-CAR-004, SCR-CAR-005 |
| Module | 4.4 — Career Coach |

---

## SCR-CAR-001 — Career Recommendations

**Purpose:** Show the student career options matched to their psychometric profile, performance, and interests.

**Wireframe — Desktop**
```
┌──────────────────────────────────────────────────────────┐
│ ← Back        Career Hub                                    │
├──────────────────────────────────────────────────────────┤
│  Based on your profile (updated 2 months ago)                │
│                                                               │
│  ┌────────────────────┐ ┌────────────────────┐               │
│  │ Software Engineer   │ │ Data Scientist      │               │
│  │ Match: Strong fit    │ │ Match: Strong fit    │               │
│  │ [Why this? →]        │ │ [Why this? →]        │               │
│  └────────────────────┘ └────────────────────┘               │
│                                                               │
│  [Explore pathways →]   [Growth tips →]   [Saved & report →]  │
└──────────────────────────────────────────────────────────┘
```
**Tablet:** Cards 2-per-row. **Mobile:** Single column; bottom action row becomes a horizontal scroll chip set.

| Components | Type | Data Source | States |
|---|---|---|---|
| Recency note | Inline banner | Psychometrics age (BR-AIC-C-06) | hidden (<12mo), shown (>=12mo) |
| Career option cards | Card | Career Coach engine (4.4) | populated, low-confidence, empty (no psychometrics) |
| Match label | Badge | Mapping confidence | qualitative only — no numeric score implied |
| Nav buttons (pathways/growth/saved) | Button | — | default |

| Actions | Trigger | Outcome | Permission |
|---|---|---|---|
| Tap "Why this?" | Tap | Routes to SCR-CAR-002 | Student |
| Explore pathways | Tap | Routes to SCR-CAR-003 | Student |
| Growth tips | Tap | Routes to SCR-CAR-004 | Student |
| Saved & report | Tap | Routes to SCR-CAR-005 | Student |

**Validation:** N/A. **Loading:** Skeleton cards.
**Empty:** "You haven't completed the career and aptitude tests yet" → routes to interest-exploration variant of this screen (AIC-FR-069/075), with a link to take tests in P1.
**Error:** "I can't reach your test results right now. Let's explore interests while I try again." (4.4.9).

---

## SCR-CAR-002 — Why This Recommendation

**Purpose:** Explain the profile factors behind a specific career recommendation.

**Wireframe — Desktop**
```
┌──────────────────────────────────────────────────────────┐
│ ← Back        Why: Software Engineer                       │
├──────────────────────────────────────────────────────────┤
│  This fits because:                                          │
│   • Strong Investigative + Realistic interest (RIASEC)        │
│   • High numerical aptitude (88th percentile)                 │
│   • Consistent Maths/Physics performance                       │
│                                                               │
│  [See related subjects & universities →]                     │
└──────────────────────────────────────────────────────────┘
```
**Tablet/Mobile:** Same single-column list layout.

| Components | Type | Data Source | States |
|---|---|---|---|
| Factor list | List | AIC-FR-076 explainability output | populated |
| Confidence caveat | Inline note | Confidence score (4.6/4.8) | shown if low-confidence |

| Actions | Trigger | Outcome | Permission |
|---|---|---|---|
| See pathways | Tap | Routes to SCR-CAR-003, pre-filtered to this career | Student |

**Validation:** N/A. **Loading:** Skeleton text. **Empty:** N/A (only reached from an existing recommendation).
**Error:** "I don't have enough detail to explain this one yet" if explainability data missing.

---

## SCR-CAR-003 — Subjects & University Pathways

**Purpose:** Show required subjects, qualifications, and university pathways with entry requirements for a target career.

**Wireframe — Desktop**
```
┌──────────────────────────────────────────────────────────┐
│ ← Back        Pathways: Software Engineer                   │
├──────────────────────────────────────────────────────────┤
│  Region: [ Pakistan ▾ ]                                       │
│                                                               │
│  Required subjects: Maths, Physics, Computer Science            │
│                                                               │
│  Universities (Pakistan):                                       │
│   • NUST — Entry: Maths/Physics A-grade + entry test            │
│   • FAST-NU — Entry: ...                                        │
└──────────────────────────────────────────────────────────┘
```
**Tablet/Mobile:** Region selector full-width above stacked list.

| Components | Type | Data Source | States |
|---|---|---|---|
| Region selector | Dropdown | Supported regions (4.4.8) | default |
| Subject list | List | Cambridge subject mapping (4.4) | populated |
| University list | List | Career/University dataset (Gap G11) | populated, data-not-available |

| Actions | Trigger | Outcome | Permission |
|---|---|---|---|
| Change region | Select | Reloads university list for region | Student |

**Validation:** Region must be a supported value (4.4.8). **Loading:** Skeleton list.
**Empty:** "I don't have verified entry requirements for that region yet." (BR-AIC-C-05).
**Error:** "Couldn't load pathway data right now" with retry.

---

## SCR-CAR-004 — Personality-Growth Tips

**Purpose:** Give non-clinical, actionable growth suggestions tied to the student's psychometric dimensions.

**Wireframe — Desktop**
```
┌──────────────────────────────────────────────────────────┐
│ ← Back        Growth Tips                                    │
├──────────────────────────────────────────────────────────┤
│  Based on your EQ profile — Social Skills (dimension)          │
│  Try: Join a debate or group project this term                 │
│                                                               │
│  Based on your Personality profile — Conscientiousness          │
│  Try: Use a weekly planner for assignments                      │
└──────────────────────────────────────────────────────────┘
```
**Tablet/Mobile:** Same card-per-dimension stacked layout.

| Components | Type | Data Source | States |
|---|---|---|---|
| Dimension cards | Card | Psychometric dimensions + AIC-FR-068 | populated |

| Actions | Trigger | Outcome | Permission |
|---|---|---|---|
| (none — read content) | — | — | Student |

**Validation:** N/A. **Loading:** Skeleton cards. **Empty:** "Complete your personality/EQ tests to unlock growth tips."
**Error:** "That's important — I want you to get the right support" + handoff to Wellbeing Coach if a wellbeing concern is detected instead of a growth request (BR-AIC-C-04).

---

## SCR-CAR-005 — Saved Options / Career Report

**Purpose:** Let the student review bookmarked options and generate a PDF report to discuss with family.

**Wireframe — Desktop**
```
┌──────────────────────────────────────────────────────────┐
│ ← Back        Saved & Report                                │
├──────────────────────────────────────────────────────────┤
│  Bookmarked:                                                  │
│   ★ Software Engineer        ★ Data Scientist                  │
│                                                               │
│  [Generate PDF report →]                                      │
└──────────────────────────────────────────────────────────┘
```
**Tablet/Mobile:** Same list + button, full-width.

| Components | Type | Data Source | States |
|---|---|---|---|
| Bookmark list | List | Saved options (4.4) | populated, empty |
| Generate-report button | Primary button | AIC-FR-071 | default, generating |

| Actions | Trigger | Outcome | Permission |
|---|---|---|---|
| Generate PDF | Tap | Produces downloadable report (AIC-FR-071) | Student (own only) |
| Remove bookmark | Tap star | Unsaves the option | Student |

**Validation:** N/A. **Loading:** "Building your report..." **Empty:** "Bookmark a career to see it here."
**Error:** "Couldn't generate the report — try again."

---

### Layer 3 gate status — Part 7, Student App Batch 3

| Gate item | Status |
|---|---|
| Screen coverage (this batch) | 5 of ~21 Student App screens specified (22 of ~21 cumulative — Career Hub completes the planned set) |
| All 3 wireframes per screen | Pass |
| Component / action / validation / state tables | Pass for all 5 |

*Next batch: Student App — Wellbeing, Profile & Settings (final batch for this surface).*
