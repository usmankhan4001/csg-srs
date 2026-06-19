# APPENDIX B — SCREEN WIREFRAMES (4/5)
## M14 Psychological Assessment · M15 Transport · M16 Cognia · M17 Platform Administration

**Status:** ✅ Complete
*Referenced from [Part 7 — Screen Specifications](../01_Master_SRS/Layer_3_UI_UX/Part_7_Screen_Specifications.md). This is the canonical Appendix B location for all wireframes per the production guide.*


---

## SCR-PSY-001 — Student Risk Dashboard
**Purpose:** Psychologist's overview of flagged students.

```
┌─────────────────────────────────────────────────────────────────┐
│ Wellbeing Dashboard                                                 │
├─────────────────────────────────────────────────────────────────┤
│ ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐                │
│ │Assessed │ │Pending  │ │Active   │ │This Week│                │
│ │   142   │ │   18    │ │Cases: 9 │ │Sessions:7│                │
│ └─────────┘ └─────────┘ └─────────┘ └─────────┘                │
├─────────────────────────────────────────────────────────────────┤
│ Risk-Flagged Students                                                │
│ ┌───────────────┬──────────┬──────────────┬─────────────────────┐│
│ │ Student          │ Risk Level│ Triggered By │ Action                 ││
│ ├───────────────┼──────────┼──────────────┼─────────────────────┤│
│ │ 🔴 Hina Malik    │ Critical  │ EQ score <40  │ [View Full Record →]  ││
│ │ 🟠 Omar Sheikh   │ High      │ Attendance drop│ [View Full Record →]  ││
│ │ 🟡 Sara Ali       │ Medium    │ Self-reported  │ [View Full Record →]  ││
│ └───────────────┴──────────┴──────────────┴─────────────────────┘│
└─────────────────────────────────────────────────────────────────┘
```
**Components:** KPI cards · Risk-flagged table colour-coded by level (red/orange/yellow per Part 16's risk colour convention)
**Actions:** View Full Record (opens SCR-PSY-006, privacy-gated)
**Validation:** N/A
**Loading:** Skeleton cards + table · **Empty:** "No flagged students currently" · **Error:** "Couldn't load dashboard — Retry"
**Reflow:** Tablet — KPI cards 2×2. Mobile — KPI cards stack, table becomes cards with risk colour as a left border strip.

---

## SCR-PSY-002 — Test Assignment
**Purpose:** Psychologist assigns a test to students/classes/grades.

```
┌─────────────────────────────────────────────────────────────────┐
│ Assign Test                                                         │
├─────────────────────────────────────────────────────────────────┤
│ Test Type *      (•)Personality ( )Career ( )Aptitude ( )IQ ( )EQ │
│ Specific Test     [Big Five Inventory ▾]                           │
│ Assign To         (•)Individual ( )Class ( )Grade Level            │
│                   [Search students...______________]                │
│                   ☑ Ahmed Khan  ☑ Sara Ali                          │
│ Available Window  [22/06/2026] to [29/06/2026]                     │
│ Time Limit         [30] minutes                                     │
│ ☐ Prevent retakes within 12 months (auto for IQ test)              │
│                                                                       │
│                                          [Cancel]    [Assign Test →]│
└─────────────────────────────────────────────────────────────────┘
```
**Components:** Test type radio · Specific test dropdown (filtered by type) · Target selector (individual search / class / grade) · Date window pickers · Time limit input · Retake prevention toggle
**Actions:** Configure → Assign (creates test_assignment records, triggers reminders per LMS-FR-161)
**Validation:** Available window end date must be after start date · At least one target must be selected
**Loading:** N/A · **Empty:** N/A · **Error:** "Couldn't assign — Retry"
**Reflow:** Tablet/Mobile — single column, student search becomes a full-screen picker on mobile.

---

## SCR-PSY-003 — Test Results Report (Psychologist View — Full)
**Purpose:** Psychologist sees complete scored results.

```
┌─────────────────────────────────────────────────────────────────┐
│ ← Back    Ahmed Khan — IQ Test Results                            │
├─────────────────────────────────────────────────────────────────┤
│ Full-Scale IQ Score: 118        Percentile: 87th                  │
│                                                                     │
│ Subtest Scores                                                       │
│  Verbal Comprehension    ████████████████░░ 82%                    │
│  Perceptual Reasoning     ██████████████░░░░ 75%                    │
│  Working Memory           ████████████████████ 95%                  │
│  Processing Speed         ████████████░░░░░░ 68%                    │
│                                                                     │
│ Confidence Interval: 113-123 (95% CI)                               │
│ Age-Normed: Above average for age 11                                │
│                                                                     │
│ [Generate Full PDF Report]    [Create Action Plan →]                │
└─────────────────────────────────────────────────────────────────┘
```
**Components:** Full-scale score + percentile · Subtest bar charts · Confidence interval note · Age-norm interpretation
**Actions:** Generate PDF → Create Action Plan (opens SCR-PSY-004)
**Validation:** N/A — access restricted to Psychologist role per BR-031/032; Teacher/Parent views render a different, summary-only version of this same data
**Loading:** Skeleton charts · **Empty:** N/A · **Error:** "Couldn't load results — Retry"
**Reflow:** Tablet/Mobile — bars stack full width.

### SCR-PSY-003b — Test Results (Teacher View — Summary Only)
```
┌─────────────────────────────────────────────────────────────────┐
│ Ahmed Khan — Psychologist Insights                                 │
├─────────────────────────────────────────────────────────────────┤
│ Assessment completed: IQ Test — 20 June 2026                       │
│                                                                     │
│ ℹ️ Detailed scores are visible to the psychologist only.            │
│    Refer to the psychologist for interpretation guidance.           │
│                                                                     │
│ Recommended classroom approach (if provided):                       │
│ "Benefits from visual learning aids"                                │
└─────────────────────────────────────────────────────────────────┘
```
**Components:** Summary-only card — no raw scores rendered anywhere in this view (BR-031/032 enforced server-side, not just hidden by CSS)
**Reflow:** Same simple card at all breakpoints.

---

## SCR-PSY-004 — Action Plan Builder
**Purpose:** Psychologist creates a SMART-goal development plan.

```
┌─────────────────────────────────────────────────────────────────┐
│ Create Action Plan — Hina Malik                                    │
├─────────────────────────────────────────────────────────────────┤
│ Plan Type *       [Social-Emotional Development ▾]                 │
│ Summary *          [Build peer connection and reduce isolation___] │
│                                                                       │
│ Goals & Milestones                                  [+ Add Goal]    │
│ ┌───────────────────────────────────────────────────────────────┐  │
│ │ Goal 1: Join one extracurricular activity                       │  │
│ │ Milestone: Attend 3 debate club sessions   Target: 15 Jul       │  │
│ │ Activity: "Practice mindfulness 10 min daily"                    │  │
│ └───────────────────────────────────────────────────────────────┘  │
│                                                                       │
│ Visibility                                                            │
│ Goals: ☑Student ☑Parent ☑Teacher ☑Admin                            │
│ Detailed Interventions: ☑Student ☐Parent ☐Teacher ☐Admin            │
│ ☑ Override visibility for critical cases (always alert admin)        │
│                                                                       │
│                                          [Save Draft]  [Activate →] │
└─────────────────────────────────────────────────────────────────┘
```
**Components:** Plan type dropdown · Summary text · Goal/milestone repeatable section · Visibility checkbox matrix (per Part 4.11.4's controls) · Critical-case override toggle
**Actions:** Add goal → Configure visibility → Save Draft → Activate (visible to configured parties)
**Validation:** At least one goal required · Summary required
**Loading:** N/A · **Empty:** "No goals added yet" · **Error:** "Couldn't save — Retry"
**Reflow:** Tablet/Mobile — single column, goal cards stack.

---

## SCR-PSY-005 — Counselling Session Log
**Purpose:** Psychologist records a session with confidential and shareable notes.

```
┌─────────────────────────────────────────────────────────────────┐
│ New Session — Hina Malik                                            │
├─────────────────────────────────────────────────────────────────┤
│ Date: [22/06/2026]    Duration: [45] min     Type: [Individual ▾] │
│                                                                       │
│ Confidential Notes (psychologist only)        [🎤 Voice-to-text]   │
│ [SOAP format:                                                       │
│  S: Student reports feeling isolated from peers...................]│
│                                                                       │
│ Shareable Summary (visible per visibility settings)                  │
│ [Discussed strategies for building friendships............]        │
│                                                                       │
│                                          [Save Draft]  [Finalize →] │
└─────────────────────────────────────────────────────────────────┘
```
**Components:** Date/duration/type fields · Confidential notes (SOAP format, voice-to-text option) · Shareable summary text · Save/Finalize actions
**Actions:** Record voice note (transcribed) → Save Draft → Finalize (locks confidential notes from further edits, logs immutable timestamp)
**Validation:** Shareable summary cannot contain content flagged as overly clinical (soft warning, not hard block) · Confidential notes required before Finalize
**Loading:** "Transcribing voice note…" · **Empty:** N/A · **Error:** "Couldn't save — your notes are cached locally, retry"
**Reflow:** Tablet/Mobile — single column, full width text areas.

---

## SCR-PSY-006 — Student Health Record (Full)
**Purpose:** Psychologist's comprehensive view combining all wellbeing data for one student.

```
┌─────────────────────────────────────────────────────────────────┐
│ ← Back    Hina Malik — Comprehensive Health Record    🔴 Critical│
├─────────────────────────────────────────────────────────────────┤
│ [Mental Health] [Physical Health] [Test Results] [Action Plans]   │
│ [Counselling History] [Family Notes 🔒]                            │
├─────────────────────────────────────────────────────────────────┤
│ Mental Health Trends                                                 │
│  Anxiety (GAD-7)     12 (Moderate) ↗️ trending up over 6 weeks      │
│  Stress Level         7/10                                           │
│                                                                       │
│  ┌──────────────────────────────────────────┐                       │
│  │ [Line chart: anxiety score over time]      │                       │
│  └──────────────────────────────────────────┘                       │
│                                                                       │
│ Behavioral Incidents (3 logged)                                       │
│ 15 Jun — Withdrew from group activity                                 │
└─────────────────────────────────────────────────────────────────┘
```
**Components:** Tab navigation across record sections · Trend charts · Behavioural incident log · Lock icon on sensitive sections
**Actions:** Switch tabs → Add incident note → Update risk level
**Validation:** Family Notes tab requires re-authentication (step-up auth) given its sensitivity
**Loading:** Skeleton tabs · **Empty:** N/A · **Error:** "Couldn't load record — Retry"
**Reflow:** Tablet — tabs stay horizontal, scroll if needed. Mobile — tabs become a dropdown selector instead of a tab bar.

---

## SCR-TRN-001 — Route Management
**Purpose:** Admin manages transport routes and vehicles.

```
┌─────────────────────────────────────────────────────────────────┐
│ Transport Routes                                  [+ Add Route] │
├──────────────┬──────────────┬──────────────┬──────────┬─────────┤
│ Route          │ Driver         │ Vehicle        │ Capacity  │ Action  │
├──────────────┼──────────────┼──────────────┼──────────┼─────────┤
│ Route 3 — North│ Mr. Yousuf     │ Bus #12        │ 28/35     │ [Edit]  │
│ Route 5 — East │ Mr. Akram      │ Van #4         │ 14/15     │ [Edit]  │
└──────────────┴──────────────┴──────────────┴──────────┴─────────┘
```
**Components:** Route table with capacity utilisation bar
**Actions:** Add Route (modal: name, driver, vehicle, capacity) → Edit
**Validation:** Capacity cannot be set below currently allocated students
**Loading:** Skeleton table · **Empty:** "No routes configured" · **Error:** "Couldn't save — Retry"
**Reflow:** Tablet/Mobile — cards.

---

## SCR-TRN-002 — Student Allocation
**Purpose:** Assign students to transport routes.

```
┌─────────────────────────────────────────────────────────────────┐
│ Route 3 — North — Student Allocation        14/35 students       │
├─────────────────────────────────────────────────────────────────┤
│ [Search and add student...___________]                            │
│                                                                       │
│ Ahmed Khan          Pickup: Main Gate, North Block    [Remove]      │
│ Sara Ali             Pickup: Park Avenue                [Remove]      │
└─────────────────────────────────────────────────────────────────┘
```
**Components:** Capacity counter · Search-to-add · Allocated student list with pickup point
**Actions:** Search and add student → Set pickup point → Remove from route
**Validation:** Cannot add beyond route capacity
**Loading:** N/A · **Empty:** "No students allocated yet" · **Error:** "Route at capacity — cannot add"
**Reflow:** Tablet/Mobile — same list, full width.

---

## SCR-TRN-003 — Parent Tracking View
**Purpose:** Parent sees live bus location and pickup/drop alerts.

```
┌─────────────────────────────────────────────────────────────────┐
│ Ahmed's Bus — Route 3                                                │
├─────────────────────────────────────────────────────────────────┤
│              [Live Map showing bus location 🚌]                     │
│                                                                       │
│ Status: En route — 8 minutes to your stop                            │
│ Last update: 30 seconds ago                                          │
│                                                                       │
│ Recent Notifications                                                  │
│ 07:45 AM — Bus departed school                                        │
│ Yesterday 03:15 PM — Ahmed dropped off safely                         │
└─────────────────────────────────────────────────────────────────┘
```
**Components:** Live map widget (GPS marker) · ETA status · Notification history
**Actions:** N/A (read-only, real-time updates via push)
**Validation:** N/A
**Loading:** "Connecting to GPS tracker…" · **Empty:** "Bus not currently in transit" · **Error:** "GPS signal lost — last known location shown"
**Reflow:** Tablet/Mobile — map takes more vertical space, notifications below.

---

## SCR-COG-001 — Evidence Repository
**Purpose:** Browse Cognia-tagged evidence by standard.

```
┌─────────────────────────────────────────────────────────────────┐
│ Cognia Evidence Repository                                          │
├─────────────────────────────────────────────────────────────────┤
│ Filter by Standard: [Standard 3 — Teaching & Assessing ▾]           │
├──────────────────┬──────────────┬──────────────┬─────────────────┤
│ Evidence            │ Type           │ Date           │ Teacher              │
├──────────────────┼──────────────┼──────────────┼─────────────────┤
│ Algebra Worksheet 3  │ Assignment     │ 22 Jun 2026     │ Ms. Fatima           │
│ Mid-Term Algebra     │ Exam            │ 28 Jun 2026     │ Ms. Fatima           │
└──────────────────┴──────────────┴──────────────┴─────────────────┘
                                              [Export Evidence Package]
```
**Components:** Standard filter dropdown · Evidence table linked to source artefact
**Actions:** Filter by standard → Click evidence (opens source assignment/exam) → Export Package
**Validation:** N/A
**Loading:** Skeleton table · **Empty:** "No evidence tagged for this standard yet" · **Error:** "Couldn't load — Retry"
**Reflow:** Tablet — table scrolls. Mobile — cards.

---

## SCR-COG-002 — Evidence Tagging
**Purpose:** Teacher tags an artefact against a Cognia standard.

```
┌─────────────────────────────────────────────────────────────────┐
│ Tag as Cognia Evidence — Algebra Worksheet 3                [✕] │
├─────────────────────────────────────────────────────────────────┤
│ Standard *         [Standard 3 — Teaching & Assessing ▾]            │
│ Evidence Type       [Assignment — auto-detected]                     │
│                                                                       │
│                                       [Cancel]      [Tag Evidence →]│
└─────────────────────────────────────────────────────────────────┘
```
**Components:** Standard dropdown (only shows standards configured by School Admin) · Evidence type (auto-detected, read-only)
**Actions:** Select standard → Tag (Part 9.4 `400 STANDARD_NOT_MAPPED` if standard isn't configured)
**Validation:** Standard must be selected
**Loading:** N/A · **Empty:** N/A · **Error:** "This standard hasn't been configured by your school admin yet"
**Reflow:** Tablet/Mobile — full-screen modal.

---

## SCR-COG-003 — Export Builder
**Purpose:** Generate the structured Cognia evidence package.

```
┌─────────────────────────────────────────────────────────────────┐
│ Export Cognia Evidence Package                                      │
├─────────────────────────────────────────────────────────────────┤
│ Include Standards: ☑1 ☑2 ☑3 ☑4 ☑5                                  │
│ Date Range:        [Aug 2026] to [Jun 2027] (full academic year)   │
│ Format:            (•)Structured Archive (.zip) ( )PDF Summary       │
│                                                                       │
│                                          [Generate Package →]       │
└─────────────────────────────────────────────────────────────────┘
```
**Components:** Standard checkboxes (all 5) · Date range · Format radio
**Actions:** Generate (async job, builds dated/sourced archive per Part 4.11.1)
**Validation:** At least one standard must be selected
**Loading:** "Building evidence package…" progress bar · **Empty:** N/A · **Error:** "Couldn't generate — Retry"
**Reflow:** Tablet/Mobile — single column.

---

## SCR-PLT-001 — Super Admin Dashboard
**Purpose:** Platform-wide overview across all school tenants.

```
┌─────────────────────────────────────────────────────────────────┐
│ Super Admin Dashboard                                                │
├─────────────────────────────────────────────────────────────────┤
│ System Health: ✅ 99.97% uptime    API p95: 240ms    Errors: 0.02%  │
│                                                                       │
│ ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐                    │
│ │Schools  │ │Total    │ │Revenue  │ │Active   │                    │
│ │   12    │ │Users    │ │ MRR     │ │Sessions │                    │
│ │         │ │ 8,420   │ │$24,500  │ │  1,205  │                    │
│ └─────────┘ └─────────┘ └─────────┘ └─────────┘                    │
├─────────────────────────────────────────────────────────────────┤
│ Alert Center                                                          │
│ ⚠️ School "Riverside Academy" — payment failure on subscription      │
└─────────────────────────────────────────────────────────────────┘
```
**Components:** System health bar · Global KPI cards · Alert center list
**Actions:** Click alert → resolve/investigate → Add New School (header button)
**Validation:** N/A
**Loading:** Skeleton dashboard · **Empty:** N/A (always has data once any school exists) · **Error:** "Couldn't load system metrics — Retry"
**Reflow:** Tablet — KPI cards 2×2. Mobile — cards stack vertically.

---

## SCR-PLT-002 — School Management
**Purpose:** Super Admin manages all school tenants.

```
┌─────────────────────────────────────────────────────────────────┐
│ Schools                                          [+ Add School] │
├──────────────┬──────────────┬──────────────┬──────────┬─────────┤
│ School         │ Subdomain      │ Plan           │ Status    │ Action  │
├──────────────┼──────────────┼──────────────┼──────────┼─────────┤
│ Lighthouse Intl│lighthouse.   │ Enterprise     │ ✅ Active │ [Manage]│
│                │platform.com   │                │           │         │
│ Riverside Acad.│riverside.    │ Premium        │ ⚠️ Trial  │ [Manage]│
│                │platform.com   │                │           │         │
└──────────────┴──────────────┴──────────────┴──────────┴─────────┘
```
**Components:** School table with subdomain, plan, status badge
**Actions:** Add School (modal: name, subdomain, timezone, currency, plan) → Manage (opens detail view)
**Validation:** Subdomain must be unique — `409 SUBDOMAIN_TAKEN` if duplicate
**Loading:** Skeleton table · **Empty:** "No schools yet" · **Error:** "Couldn't load — Retry"
**Reflow:** Tablet — table scrolls. Mobile — cards.

---

## SCR-PLT-003 — Subscription & Billing
**Purpose:** Manage a school's subscription plan and billing.

```
┌─────────────────────────────────────────────────────────────────┐
│ ← Back   Lighthouse Intl — Subscription                              │
├─────────────────────────────────────────────────────────────────┤
│ Current Plan: Enterprise — $2,500/month                              │
│ Billing Cycle: Annual    Next Invoice: 1 Aug 2026                    │
│                                                                       │
│ Feature Mapping                                                       │
│ ✅ Unlimited students  ✅ AI Quiz Service  ✅ All 7 portals           │
│ ✅ Psychological Assessment  ✅ Cognia Evidence Management            │
│                                                                       │
│ Payment History     [View All →]                                      │
│ 1 Jul 2026 — $2,500 — ✅ Paid                                         │
│                                                                       │
│                              [Change Plan]    [Generate Invoice]    │
└─────────────────────────────────────────────────────────────────┘
```
**Components:** Plan summary · Feature checklist · Payment history · Change Plan / Generate Invoice actions
**Actions:** Change Plan (upgrade/downgrade) → Generate Invoice manually
**Validation:** N/A
**Loading:** Skeleton panel · **Empty:** N/A · **Error:** "Couldn't load billing — Retry"
**Reflow:** Tablet/Mobile — single column.

---

## SCR-PLT-004 — Global User Directory
**Purpose:** Super Admin searches/manages users across all schools.

```
┌─────────────────────────────────────────────────────────────────┐
│ Global User Directory               [Search across all schools]│
├──────────────┬──────────────┬──────────────┬──────────┬─────────┤
│ Name           │ School         │ Role           │ Status    │ Action  │
├──────────────┼──────────────┼──────────────┼──────────┼─────────┤
│ Ahmed Khan     │ Lighthouse Intl│ Student        │ Active    │ [⋯]     │
│   ⋯ menu: [View Profile] [Impersonate ⚠️] [Reset Password] [Deactivate]│
└──────────────┴──────────────┴──────────────┴──────────┴─────────┘
```
**Components:** Cross-school search · User table · Action menu per row including Impersonate
**Actions:** Impersonate (shows confirmation dialog with audit warning per LMS-FR-194) → Reset Password → Deactivate
**Validation:** Impersonation requires explicit confirmation: "This action is fully audited. Continue?"
**Loading:** Skeleton table · **Empty:** "No users match your search" · **Error:** "Couldn't load directory — Retry"
**Reflow:** Tablet — table scrolls. Mobile — cards, action menu becomes bottom sheet.

---

## SCR-PLT-005 — System Configuration
**Purpose:** Global platform settings.

```
┌─────────────────────────────────────────────────────────────────┐
│ System Configuration                                                  │
├─────────────────────────────────────────────────────────────────┤
│ [General] [Email/SMS Gateway] [Payment Gateways] [SSO] [Backup]    │
├─────────────────────────────────────────────────────────────────┤
│ General Settings                                                       │
│ Default Timezone        [UTC+5 Asia/Karachi ▾]                        │
│ Default Currency         [PKR ▾]                                       │
│ Password Policy           Min length: [10]   Require: ☑Upper ☑Number  │
│ Session Timeout            [30] minutes                                 │
│                                                                          │
│                                              [Save Configuration]      │
└─────────────────────────────────────────────────────────────────┘
```
**Components:** Tab navigation across config categories · Settings forms per tab
**Actions:** Switch tabs → Configure → Save
**Validation:** Min password length ≥ 8 enforced
**Loading:** N/A · **Empty:** N/A (defaults always present) · **Error:** "Couldn't save — Retry"
**Reflow:** Tablet — tabs stay horizontal. Mobile — tabs become a dropdown selector.

---

*Lighthouse Global School System — P1 — Appendix B Wireframes (4/5) — Internal — v1.0*
