# MASTER SRS — P3 AI STUDENT COACH
## Part 7 — Screen Specifications
### Student App — Batch 2: Revision Hub

*Layer 3 — UI/UX & Experience · Standalone screen-spec document within the Part 7 set*

| Field | Value |
|---|---|
| Surface | Student App (Web, iOS, Android) |
| Screens in this batch | SCR-REV-001, SCR-QUIZ-001, SCR-QUIZ-002, SCR-QUIZ-003, SCR-FLASH-001, SCR-FLASH-002, SCR-SUMM-001, SCR-MOCK-001, SCR-MOCK-002, SCR-MOCK-003, SCR-SAVED-001 |
| Module | 4.3 — Revision Coach |

---

## SCR-REV-001 — Revision Hub (landing)

**Purpose:** Let the student choose a revision format (quiz, flashcards, summary, mock test) and see what's due.

**Wireframe — Desktop**
```
┌──────────────────────────────────────────────────────────┐
│ ← Back        Revision Hub                                 │
├──────────────────────────────────────────────────────────┤
│  Due today: 12 flashcards · 1 quiz suggested                │
│                                                              │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐        │
│  │ Quiz     │ │Flashcards│ │ Summary  │ │ Mock Test│        │
│  │[Start→] │ │[Review→]│ │[Get one→]│ │[Set up→] │        │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘        │
│                                                              │
│  [📁 Saved decks & summaries]                                │
└──────────────────────────────────────────────────────────┘
```
**Tablet:** 2x2 card grid. **Mobile:** Single column stack, due-today banner sticky at top.

| Components | Type | Data Source | States |
|---|---|---|---|
| Due-today banner | Status text | Spaced-repetition scheduler (4.3) | populated, empty ("nothing due") |
| Format cards (4) | Card/button | — | default |
| Saved link | Link | Saved decks store | default |

| Actions | Trigger | Outcome | Permission |
|---|---|---|---|
| Start quiz | Tap card | Routes to SCR-QUIZ-001 | Student |
| Review flashcards | Tap card | Routes to SCR-FLASH-002 (due cards) | Student |
| Get summary | Tap card | Routes to SCR-SUMM-001 | Student |
| Set up mock test | Tap card | Routes to SCR-MOCK-001 | Student |
| Open saved | Tap link | Routes to SCR-SAVED-001 | Student |

**Validation:** N/A. **Loading:** Skeleton banner + cards. **Empty:** "Nothing due — pick a topic to practise" with topic shortcuts. **Error:** "Couldn't load your revision status" with retry; format cards remain usable.

---

## SCR-QUIZ-001 — Generate Quiz

**Purpose:** Let the student configure and generate a practice quiz scoped to their stage syllabus.

**Wireframe — Desktop**
```
┌──────────────────────────────────────────────────────────┐
│ ← Back        New Quiz                                     │
├──────────────────────────────────────────────────────────┤
│  Topic: [ Quadratic Equations          ▾ ]                  │
│  Suggested: Algebra (your weak topic)                       │
│                                                              │
│  Questions: [ 10 ▾ ]   Types: [☑MCQ ☑T/F ☐Fill-blank ☐Short]│
│  Difficulty: [ Adaptive ▾ ]                                  │
│                                                              │
│                                          [Generate quiz →]   │
└──────────────────────────────────────────────────────────┘
```
**Tablet/Mobile:** Fields stack full-width; question-type checkboxes wrap to 2 per row.

| Components | Type | Data Source | States |
|---|---|---|---|
| Topic selector | Searchable dropdown | In-stage syllabus (4.7) | default, invalid (out-of-syllabus) |
| Question count | Stepper/dropdown | 1–50 (4.3.8) | default |
| Question types | Checkbox group | 4 types | default, all-unchecked-error |
| Difficulty | Dropdown | easy/medium/hard/adaptive | default |
| Generate button | Primary button | — | enabled, generating, disabled |

| Actions | Trigger | Outcome | Permission |
|---|---|---|---|
| Select topic | Type/select | Validates against syllabus | Student |
| Generate quiz | Tap button | Routes to SCR-QUIZ-002 with generated items (UC-R-01) | Student |

**Validation:** Topic must resolve to in-stage syllabus; count 1–50; >=1 type selected (4.3.8).
**Loading:** "Building your quiz..." progress indicator.
**Empty:** N/A (form default).
**Error:** "That topic isn't in your current syllabus. Here are related topics." (4.3.9); "I don't have study material for that yet."

---

## SCR-QUIZ-002 — Take Quiz

**Purpose:** Present quiz questions for the student to answer.

**Wireframe — Desktop**
```
┌──────────────────────────────────────────────────────────┐
│ Question 3 of 10                          [Exit]            │
├──────────────────────────────────────────────────────────┤
│  Which value of x satisfies x² - 5x + 6 = 0?                │
│  ○ x = 1        ○ x = 2                                      │
│  ○ x = 3        ○ x = 6                                      │
│                                                              │
│  [← Previous]                              [Next →]          │
└──────────────────────────────────────────────────────────┘
```
**Tablet/Mobile:** Options stack full-width single column; progress shown as a thin bar under the header instead of "X of Y" text on mobile.

| Components | Type | Data Source | States |
|---|---|---|---|
| Progress indicator | Bar/text | Quiz session state | default |
| Question + options | Form (radio/checkbox/text per type) | Generated quiz (4.3) | unanswered, answered |
| Navigation buttons | Button | — | default, disabled (first/last) |

| Actions | Trigger | Outcome | Permission |
|---|---|---|---|
| Select answer | Tap option | Records answer locally | Student |
| Navigate | Tap Previous/Next | Moves between questions; answers preserved | Student |
| Submit | Tap on last question | Auto-scores (UC-R-02); routes to SCR-QUIZ-003 | Student |
| Exit | Tap Exit | Confirms discard or save-progress | Student |

**Validation:** N/A beyond answer-type constraints inherited from question type.
**Loading:** N/A (quiz pre-generated before this screen).
**Empty:** N/A.
**Error:** "Connection lost — your answers are saved" (shared pattern with Mock Test, 4.3.9) if connectivity drops mid-quiz.

---

## SCR-QUIZ-003 — Quiz Results & Review

**Purpose:** Show the score and let the student review explanations per question.

**Wireframe — Desktop**
```
┌──────────────────────────────────────────────────────────┐
│            Quiz Results                                    │
├──────────────────────────────────────────────────────────┤
│   Score: 8 / 10  (80%)                                       │
│                                                               │
│   Q1 ✓   Q2 ✓   Q3 ✗   Q4 ✓ ...                                │
│                                                               │
│   [Review answers ▾]                                          │
│   Q3: Your answer x=3 — Correct: x=2 or x=3                   │
│       Explanation: ...   Source: Algebra Guide [view]         │
│                                                               │
│   [🚩 Flag a question]      [Try another quiz →]               │
└──────────────────────────────────────────────────────────┘
```
**Tablet/Mobile:** Score summary stacked above a vertically scrollable review list.

| Components | Type | Data Source | States |
|---|---|---|---|
| Score summary | Stat display | Auto-scoring engine (4.3) | default |
| Per-question result chips | Icon list | Quiz session result | correct, incorrect |
| Answer review panel | Expandable list | Generated quiz + explanations | collapsed, expanded |
| Flag control | Icon button | AIC-FR-059 | default, flagged |

| Actions | Trigger | Outcome | Permission |
|---|---|---|---|
| Expand review | Tap question row | Shows explanation + source | Student |
| Flag question | Tap flag icon + reason | Recorded; excluded from next generation (UC-R-08) | Student |
| Try another quiz | Tap button | Routes to SCR-QUIZ-001 | Student |

**Validation:** Flag reason 0–300 chars (4.3.8).
**Loading:** N/A (results computed on submit).
**Empty:** N/A.
**Error:** "Couldn't save your flag — try again" on flag-submit failure.

---

## SCR-FLASH-001 — Flashcard Decks

**Purpose:** Let the student generate or open a flashcard deck.

**Wireframe — Desktop**
```
┌──────────────────────────────────────────────────────────┐
│ ← Back        Flashcards                                   │
├──────────────────────────────────────────────────────────┤
│  [+ New deck from topic...]                                  │
│                                                               │
│  Algebra Basics — 12 due           [Study →]                  │
│  Photosynthesis — 0 due            [Study →]                  │
└──────────────────────────────────────────────────────────┘
```
**Tablet/Mobile:** List rows full-width; "New deck" as a floating action button on mobile.

| Components | Type | Data Source | States |
|---|---|---|---|
| New-deck control | Input + button | Topic selector (shared with SCR-QUIZ-001) | default |
| Deck list | List | Saved decks (4.3.7) | populated, empty |

| Actions | Trigger | Outcome | Permission |
|---|---|---|---|
| Create deck | Enter topic, confirm | Generates deck (UC-R-03); appears in list | Student |
| Study deck | Tap "Study" | Routes to SCR-FLASH-002 | Student |

**Validation:** Topic in-stage; deck name unique per student (4.3.8).
**Loading:** Skeleton list.
**Empty:** "No decks yet — create one from any topic."
**Error:** "Couldn't create that deck right now" with retry.

---

## SCR-FLASH-002 — Flashcard Study Session

**Purpose:** Let the student review due flashcards with spaced-repetition self-rating.

**Wireframe — Desktop**
```
┌──────────────────────────────────────────────────────────┐
│ Algebra Basics — card 4 of 12                [Exit]         │
├──────────────────────────────────────────────────────────┤
│              ┌───────────────────────┐                      │
│              │  What is the quadratic │                      │
│              │  formula?              │                      │
│              │      [Tap to flip]     │                      │
│              └───────────────────────┘                      │
│   [Hard]      [Good]      [Easy]                             │
└──────────────────────────────────────────────────────────┘
```
**Tablet/Mobile:** Card scales to ~90% width; self-rating buttons full-width row at bottom.

| Components | Type | Data Source | States |
|---|---|---|---|
| Flashcard | Flip card | Deck content | front, back |
| Self-rating buttons | Button group | Spaced-repetition engine | default |
| Progress indicator | Text/bar | Session state | default |

| Actions | Trigger | Outcome | Permission |
|---|---|---|---|
| Flip card | Tap card | Reveals back | Student |
| Rate (Hard/Good/Easy) | Tap button | Reschedules card (UC-R-03); advances | Student |
| Exit | Tap Exit | Saves session progress | Student |

**Validation:** N/A. **Loading:** N/A (deck pre-loaded). **Empty:** "No cards due — nice work!" if opened with nothing due. **Error:** "Couldn't save your progress" with retry, session held locally until resolved.

---

## SCR-SUMM-001 — Topic Summary

**Purpose:** Give the student a concise, sourced summary of a topic.

**Wireframe — Desktop**
```
┌──────────────────────────────────────────────────────────┐
│ ← Back        Photosynthesis — Summary                      │
├──────────────────────────────────────────────────────────┤
│  Photosynthesis converts light energy into chemical          │
│  energy... (≤400 words)                                      │
│                                                                │
│  Source: Biology Stage Guide, Ch.4 [view]                     │
│                                                                │
│  [🔊 Listen]   [💾 Save]   [Get a longer version]              │
└──────────────────────────────────────────────────────────┘
```
**Tablet/Mobile:** Same single-column reading layout; action buttons become a sticky bottom bar.

| Components | Type | Data Source | States |
|---|---|---|---|
| Summary text | Rich text | RAG-grounded generation (4.3/4.7) | populated, uncertainty-note |
| Source reference | Link | Citation metadata | default |
| TTS / Save / Extend controls | Buttons | 4.3 | default |

| Actions | Trigger | Outcome | Permission |
|---|---|---|---|
| Listen | Tap | TTS playback in set language | Student |
| Save | Tap | Adds to SCR-SAVED-001 | Student |
| Get longer version | Tap | Regenerates extended summary (exception to 400-word default) | Student |

**Validation:** N/A (generation request only). **Loading:** "Summarizing..." spinner. **Empty:** N/A. **Error:** "I don't have a reliable source for that yet" (uncertainty path, 4.3.9).

---

## SCR-MOCK-001 — Mock Test Setup

**Purpose:** Let the student configure a timed mock test. Field layout mirrors SCR-QUIZ-001 with an added duration control.

**Wireframe — Desktop**
```
┌──────────────────────────────────────────────────────────┐
│ ← Back        Mock Test Setup                               │
├──────────────────────────────────────────────────────────┤
│  Topic/scope: [ Full Algebra Unit        ▾ ]                 │
│  Questions: [ 20 ▾ ]   Duration: [ 30 min ▾ ]                 │
│                                          [Start mock test →]  │
└──────────────────────────────────────────────────────────┘
```
**Tablet/Mobile:** Fields stack; identical pattern to SCR-QUIZ-001.

| Components | Type | Data Source | States |
|---|---|---|---|
| Scope selector | Dropdown | In-stage syllabus / exam scope | default |
| Question count | Stepper | 1–50 | default |
| Duration | Dropdown | 5–180 min (4.3.8) | default |
| Start button | Primary button | — | enabled, starting |

| Actions | Trigger | Outcome | Permission |
|---|---|---|---|
| Start mock test | Tap button | Routes to SCR-MOCK-002, timer begins (UC-R-05) | Student |

**Validation:** Duration 5–180 min; count 1–50 (4.3.8).
**Loading:** "Preparing your mock test..." **Empty:** N/A. **Error:** Shared with SCR-QUIZ-001 generation errors.

---

## SCR-MOCK-002 — Mock Test — Timed

**Purpose:** Run the timed test under exam-like conditions. Identical question-answering structure to SCR-QUIZ-002, with a persistent countdown timer and auto-submit.

**Wireframe — Desktop**
```
┌──────────────────────────────────────────────────────────┐
│ ⏱ 18:42 remaining          Question 7 of 20    [Exit]      │
├──────────────────────────────────────────────────────────┤
│  [Question content — same pattern as SCR-QUIZ-002]          │
└──────────────────────────────────────────────────────────┘
```
**Tablet/Mobile:** Timer pinned to top, always visible while scrolling.

| Components | Type | Data Source | States |
|---|---|---|---|
| Countdown timer | Timer display | Mock test session | running, expiring (<1 min, visually flagged), expired |
| Question content | (same as SCR-QUIZ-002) | — | — |

| Actions | Trigger | Outcome | Permission |
|---|---|---|---|
| Answer / navigate | (same as SCR-QUIZ-002) | Auto-saved every 30s (BR-AIC-R-06) | Student |
| Timer expiry | System | Auto-submits; routes to SCR-MOCK-003 | System |

**Validation:** Inherited from question types.
**Loading:** N/A. **Empty:** N/A.
**Error:** "Connection lost — your answers are saved. Resume when you're back online." (EC-AIC-R-05).

---

## SCR-MOCK-003 — Mock Test Results

**Purpose:** Show the mock-test score under exam-condition framing. Structurally identical to SCR-QUIZ-003 with an added time-analysis section.

| Components (additional to SCR-QUIZ-003) | Type | Data Source | States |
|---|---|---|---|
| Time-per-question breakdown | Chart/list | Session telemetry | default |

**Actions, Validation, Loading/Empty/Error:** Identical to SCR-QUIZ-003.

---

## SCR-SAVED-001 — Saved Decks & Summaries

**Purpose:** Let the student browse and reopen saved flashcard decks and summaries.

**Wireframe — Desktop**
```
┌──────────────────────────────────────────────────────────┐
│ ← Back        Saved                                         │
├──────────────────────────────────────────────────────────┤
│ Decks                                                        │
│  • Algebra Basics              [Open] [Export PDF]           │
│ Summaries                                                     │
│  • Photosynthesis              [Open] [Export PDF]           │
└──────────────────────────────────────────────────────────┘
```
**Tablet/Mobile:** Same grouped list, full-width rows.

| Components | Type | Data Source | States |
|---|---|---|---|
| Grouped list (Decks/Summaries) | List | Student's saved items (own only) | populated, empty |
| Export control | Icon button | AIC-FR-060 | default, exporting |

| Actions | Trigger | Outcome | Permission |
|---|---|---|---|
| Open item | Tap | Routes to SCR-FLASH-002 or SCR-SUMM-001 | Student (own only) |
| Export PDF | Tap | Generates downloadable PDF (UC-R-06) | Student (own only) |

**Validation:** N/A. **Loading:** Skeleton list. **Empty:** "Nothing saved yet." **Error:** "Couldn't generate that PDF — try again."

---

### Layer 3 gate status — Part 7, Student App Batch 2

| Gate item | Status |
|---|---|
| Screen coverage (this batch) | 11 of ~21 Student App screens specified (17 of 21 cumulative) |
| All 3 wireframes per screen | Pass — full wireframes given; structurally repeated screens (MOCK-002/003) cross-reference rather than duplicate per Rule 5 |
| Component / action / validation / state tables | Pass for all 11 |

*Next batch: Student App — Career Hub (5 screens), then Wellbeing/Profile/Settings (remaining ~4–5 screens) to close out the Student App surface.*
