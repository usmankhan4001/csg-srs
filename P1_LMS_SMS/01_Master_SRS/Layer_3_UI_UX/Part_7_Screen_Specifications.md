# PART 7 — SCREEN SPECIFICATIONS
## P1 — Learning Management System + School Management System
### Layer 3 — UI/UX & Experience

**Status:** 🟡 Content Complete — Layer Gate Not Yet Passed
**Wireframes:** All 88 screen wireframes (ASCII layout + components/actions/validation/states per Part 7 element requirements) are maintained in `Appendices/` as the canonical Appendix B deliverable, organised by module:
- [Wireframes 1/5 — M01 Admissions, M02 Live Classes, M03 Assignment, M04 Exam](../Appendices/Wireframes_1_M01_M04.md)
- [Wireframes 2/5 — M05 Gradebook, M06 Attendance, M07 Timetable, M08 Fee Management](../Appendices/Wireframes_2_M05_M08.md)
- [Wireframes 3/5 — M09 Accounting, M10 HR, M11 Payroll, M12 Library, M13 Communication](../Appendices/Wireframes_3_M09_M13.md)
- [Wireframes 4/5 — M14 Psych. Assessment, M15 Transport, M16 Cognia, M17 Platform Admin](../Appendices/Wireframes_4_M14_M17.md)
- [Wireframes 5/5 — M18 User/Role Mgmt, M19 Reports, M20 Settings, Role Dashboards](../Appendices/Wireframes_5_M18_M20_Dashboards.md)

Each screen below references its wireframe by Screen ID (e.g. `SCR-ADM-001`) — look up that ID in the linked file for the full layout.

*Screen ID format: `SCR-[PORTAL]-[NUMBER]` (e.g. SCR-ADM-014). Wireframes (desktop/tablet/mobile) are visual artifacts batched with all other outstanding diagrams across this document. Six standard screen templates are defined once below (Section 7.0); every screen in the inventory either follows a template exactly (compressed entry: ID, name, purpose, template, screen-specific notes only) or — for genuinely complex/unique screens — receives a full standalone specification with its own components, actions, validation, and states. This avoids restating identical List/Detail/Form/Dashboard patterns ~100 times (Rule 5).*

---

## 7.0 Standard Screen Templates

### Template A — List/Table Screen

| Element | Specification |
|---|---|
| **Components** | Search bar; filter dropdowns (context-dependent); data table with sortable columns and pagination; bulk-action toolbar (appears on row selection); primary "Add New" button (top-right) |
| **Actions** | Search; filter; sort column; select one or more rows; perform bulk action; click a row to open its Detail screen; click "Add New" to open its Form screen |
| **Validation** | Search query: max 100 characters. No validation on filter/sort actions. |
| **Loading State** | Skeleton rows (5–8) in place of the table while data loads |
| **Empty State** | Centered message ("No [items] found") with the primary "Add New" action repeated |
| **Error State** | Inline banner: "Couldn't load [items]. Retry?" with a retry action; table area remains otherwise blank |

### Template B — Detail / Profile Screen

| Element | Specification |
|---|---|
| **Components** | Header bar with identity (photo/name/ID) and primary action buttons (Edit, top-right); tabbed sections for grouped information; breadcrumb back to the originating List screen |
| **Actions** | Switch tabs; Edit (opens Form template inline or as modal); navigate back |
| **Validation** | N/A at the Detail level — validation lives in the Form template used for editing |
| **Loading State** | Skeleton header + skeleton tab content |
| **Empty State** | N/A (a Detail screen by definition has a record) |
| **Error State** | "Record not found or you don't have permission to view this." with a back action |

### Template C — Form (Create/Edit) Screen

| Element | Specification |
|---|---|
| **Components** | Form fields per the relevant module's Validation Rules table (Part 4); Save and Cancel buttons; inline per-field error messages |
| **Actions** | Enter/select field values; Save; Cancel (discards unsaved changes with confirmation if any field was modified) |
| **Validation** | Cross-references the specific module's Validation Rules table in Part 4 — not restated here per Rule 5 |
| **Loading State** | Save button shows a spinner and disables itself during submission to prevent duplicate submits |
| **Empty State** | N/A |
| **Error State** | Field-level errors appear beneath the specific field; a top-level banner summarises if multiple fields fail ("3 fields need attention") |

### Template D — Dashboard Screen

| Element | Specification |
|---|---|
| **Components** | KPI summary cards (top row); widget/chart grid below; quick-action shortcuts; period/date-range selector where relevant |
| **Actions** | Click a KPI card or widget to drill into the relevant List/Detail screen; change the period selector; trigger a quick action |
| **Validation** | N/A |
| **Loading State** | Each widget loads independently with its own skeleton — the dashboard never blocks entirely on the slowest widget |
| **Empty State** | Per-widget: "No data yet for this period" |
| **Error State** | Per-widget: "Couldn't load this data. Retry?" — one widget's failure never blocks the others |

### Template E — Messaging / Inbox Screen

| Element | Specification |
|---|---|
| **Components** | Thread list (left/sidebar); active message view (main pane); compose box with attachment control |
| **Actions** | Select a thread; compose and send a message; attach a file; search threads |
| **Validation** | Message body required unless an attachment is present (Part 4, M13); attachment size max per KPI-15 (500MB) |
| **Loading State** | Skeleton thread list; skeleton message bubbles |
| **Empty State** | "No messages yet" with a "Start a conversation" prompt where the role permits initiating contact |
| **Error State** | Failed send shows an inline "Message failed to send — Retry" directly on the affected message bubble |

### Template F — Calendar / Schedule Screen

| Element | Specification |
|---|---|
| **Components** | Calendar grid (week/month toggle) or agenda list view; event detail popover on click |
| **Actions** | Toggle view type; navigate between periods; click an event for detail; (role-dependent) join/start a live class directly from its event entry |
| **Validation** | N/A — this is a read-only view for Student/Parent/Teacher; editing occurs in the Timetable Module's own Form/Builder screens |
| **Loading State** | Skeleton calendar grid |
| **Empty State** | "No classes scheduled for this period" |
| **Error State** | "Couldn't load your schedule. Retry?" |

---

## 7.1 Super Admin Portal Screens

| Screen ID | Name | Purpose | Template | Notes |
|---|---|---|---|---|
| SCR-SA-001 | Dashboard | View platform-wide health, alerts, and quick actions. | D | KPI cards: total schools, total users, active sessions, system health (Old SRS 3.1.1) |
| SCR-SA-002 | Schools List | View and search all onboarded schools. | A | Filter by status: Active/Suspended/Trial/Expired |
| SCR-SA-003 | School Onboarding Wizard | Provision a new school tenant. | — | **Complex — see 7.1.1** |
| SCR-SA-004 | School Configuration Detail | View/edit a specific school's settings, module flags, limits. | B | Edit opens module-toggle and limit-setting forms |
| SCR-SA-005 | Subscriptions & Billing | Manage plans, billing cycles, invoices per school. | A | Plan tiers per LMS-FR-182 |
| SCR-SA-006 | Platform Analytics | View aggregated, anonymised usage trends. | D | Never shows individual school sensitive data (BR-039) |
| SCR-SA-007 | Security & Compliance Settings | Configure global MFA, IP rules, password policy. | C | Cross-references LMS-FR-185 |
| SCR-SA-008 | Audit Trail | Search the full system-wide audit log. | A | Export to CSV/PDF |
| SCR-SA-009 | Support Tickets List | View all tickets across all schools. | A | Filter by priority, SLA status |
| SCR-SA-010 | Support Ticket Detail | View/respond to a specific ticket. | B | — |
| SCR-SA-011 | School Financial Data (View-Only) | Support a school's financial issue without export. | B | **Complex — see 7.1.2** |

### 7.1.1 — SCR-SA-003 — School Onboarding Wizard (Full Specification)

| Element | Specification |
|---|---|
| **Purpose** | Provision a new, fully isolated school tenant in a structured, multi-step process so nothing is missed (UC-060). |
| **Components** | Multi-step progress indicator (Subdomain → Branding → Plan → Modules → Admin Account → Review); per-step form fields; "Save & Continue Later" option |
| **Actions** | Enter subdomain; upload logo/colours; select subscription plan; toggle enabled modules; create initial School Admin account; review and confirm |
| **Validation** | Subdomain: globally unique, lowercase alphanumeric (LMS-FR-180 error state); all other fields per their respective module's validation rules |
| **Loading State** | Step transitions show a brief progress spinner while validating the previous step |
| **Empty State** | N/A |
| **Error State** | Subdomain collision shows inline error immediately on blur, before final submission |

### 7.1.2 — SCR-SA-011 — School Financial Data (View-Only) (Full Specification)

| Element | Specification |
|---|---|
| **Purpose** | Allow Super Admin to view a school's financial data for support purposes with zero export capability and full audit logging (UC-044, BR-041). |
| **Components** | Read-only ledger/trial balance/P&L/balance sheet views identical in layout to the School Admin's own Accounting screens, but with every export/download control structurally absent from the UI — not merely disabled |
| **Actions** | View only — no edit, export, or download actions exist on this screen |
| **Validation** | N/A |
| **Loading State** | Standard skeleton |
| **Empty State** | "No financial data available for this school yet." |
| **Error State** | "Couldn't load this data. Retry?" |

---

## 7.2 CEO / Director Portal Screens

| Screen ID | Name | Purpose | Template | Notes |
|---|---|---|---|---|
| SCR-CEO-001 | Dashboard | View strategic KPIs (enrolment, revenue, retention, GPA, NPS). | D | **Complex — see 7.2.1** |
| SCR-CEO-002 | Financial Overview | View own school's full financial reports. | D | Same reports as Accounting Module (M09), CEO has full access (not View-only — that restriction applies to Super Admin only) |
| SCR-CEO-003 | Academic Performance Overview | View school-wide academic trends. | D | — |
| SCR-CEO-004 | Staff Broadcast Composer | Send a message to all staff or by department. | C | Restricted to staff-only per BR-035 — no student/parent recipient option exists on this screen |
| SCR-CEO-005 | Discount/Scholarship Approval Queue | Review and approve/deny high-value discount requests. | A | Routed automatically per BR-022 (UC-041) |
| SCR-CEO-006 | Reports Hub | Access all reports CEO has permission to view. | A | Cross-references Part 3, Section 3.6 |
| SCR-CEO-007 | Cross-School Comparative Analytics | Compare metrics across schools (own school context only). | D | Restricted to own school's data per role |

### 7.2.1 — SCR-CEO-001 — Dashboard (Full Specification)

| Element | Specification |
|---|---|
| **Purpose** | Give the CEO a single-screen strategic view of enrolment, revenue, retention, academic, and satisfaction KPIs with trend indicators (Old SRS 3.2.1). |
| **Components** | KPI cards with current/target/last-year comparison and trend arrows; period selector (day/week/month/quarter/year/custom); comparison toggle (vs. previous period / vs. same period last year) |
| **Actions** | Change period; toggle comparison basis; click any KPI card to drill into its detailed report |
| **Validation** | N/A |
| **Loading State** | Each KPI card loads independently with its own skeleton |
| **Empty State** | "No data available for the selected period" per affected card |
| **Error State** | Per-card retry, consistent with Template D |

## 7.3 School Admin Portal Screens

| Screen ID | Name | Purpose | Template | Notes |
|---|---|---|---|---|
| SCR-ADM-001 | Dashboard | View daily operations overview and quick stats. | D | Old SRS 3.3.1 |
| SCR-ADM-002 | Inquiry List | View and manage admissions inquiries. | A | UC-001 |
| SCR-ADM-003 | New/Edit Inquiry | Log a manual inquiry. | C | LMS-FR-002 |
| SCR-ADM-004 | Application List | View all submitted applications by stage. | A | Filter by stage |
| SCR-ADM-005 | Application Summary | Review consolidated application and decide. | — | **Complex — see 7.3.1** |
| SCR-ADM-006 | Document Verification | Verify checklist documents for an application. | B | LMS-FR-009, UC-004 |
| SCR-ADM-007 | Interview Scheduling | Schedule and assign interviews. | C | LMS-FR-012 |
| SCR-ADM-008 | Waitlist Management | View and manage ranked waitlist. | A | LMS-FR-018 |
| SCR-ADM-009 | Student Directory | Search and view all students. | A | — |
| SCR-ADM-010 | Student Profile | View/edit a student's full record. | B | Tabs: Personal, Academic, Fees, Documents |
| SCR-ADM-011 | Bulk Student Import | Import students via CSV/Excel. | C | LMS-FR-191, UC-062 |
| SCR-ADM-012 | Staff Directory | Search and view all staff. | A | — |
| SCR-ADM-013 | Staff Profile | View/edit a staff member's full record. | B | Tabs: Personal, Contract, Qualifications, Leave |
| SCR-ADM-014 | Leave Approval Queue | Review and approve/deny leave requests. | A | UC-045 |
| SCR-ADM-015 | Performance Review | Conduct a staff performance review. | — | **Complex — see 7.3.2** |
| SCR-ADM-016 | Timetable Builder | Build/edit the school timetable. | — | **Complex — see 7.3.3** |
| SCR-ADM-017 | Gradebook Oversight | View grade data across all classes. | A | Read access for oversight, not entry |
| SCR-ADM-018 | Attendance Overview | View daily/monthly attendance across the school. | D | LMS-FR-097 |
| SCR-ADM-019 | Attendance Defaulter List | View students below the attendance threshold. | A | LMS-FR-097 |
| SCR-ADM-020 | Fee Structure Configuration | Configure fee heads, amounts, plans. | C | LMS-FR-110 |
| SCR-ADM-021 | Invoice Generation | Bulk-generate invoices. | — | **Complex — see 7.3.4** |
| SCR-ADM-022 | Outstanding Fees / Aging Report | View overdue fee status. | A | LMS-FR-124 |
| SCR-ADM-023 | Accounting Ledger | View/enter journal transactions. | A | LMS-FR-127 |
| SCR-ADM-024 | Financial Statements | View trial balance, P&L, balance sheet. | D | LMS-FR-129 |
| SCR-ADM-025 | Announcement Composer | Create and target a school announcement. | C | LMS-FR-160 |
| SCR-ADM-026 | Emergency Broadcast | Trigger a multi-channel emergency message. | — | **Complex — see 7.3.5** |
| SCR-ADM-027 | Library Catalog Management | Add/edit digital library resources. | A + C | M12 |
| SCR-ADM-028 | Transport Route Management | Configure routes, vehicles, allocations. | C | M15 |
| SCR-ADM-029 | Reports Hub | Access all standing and custom reports. | A | Cross-references Part 3, Section 3.6 |
| SCR-ADM-030 | School Profile Settings | Configure branding, contact info. | C | LMS-FR-202 |
| SCR-ADM-031 | Payment Gateway Settings | Configure this school's payment gateway credentials. | C | LMS-FR-205, BR-040 — credentials never visible to Super Admin |
| SCR-ADM-032 | Role & Permission Management | Create/edit custom roles. | — | **Complex — see 7.3.6** |
| SCR-ADM-033 | Cognia Evidence Dashboard | View accreditation readiness and gaps. | D | LMS-FR-178 |

### 7.3.1 — SCR-ADM-005 — Application Summary (Full Specification)

| Element | Specification |
|---|---|
| **Purpose** | Present every piece of information needed to decide on an applicant — documents, interview score, notes — on one screen (UC-006, LMS-FR-014). |
| **Components** | Consolidated panel showing application form data, document checklist status, interview score/rubric breakdown, and admin notes; decision action bar (Accept / Reject / Waitlist / Conditional Accept) fixed at the bottom of the screen |
| **Actions** | Review each section; select a decision; for Conditional Accept, specify the condition |
| **Validation** | Decision cannot be confirmed while required documents remain Missing (BR-026) — the decision bar shows this constraint inline rather than failing only on submit |
| **Loading State** | Skeleton for each panel section, loaded independently |
| **Empty State** | N/A — a summary screen only exists for a submitted application |
| **Error State** | "Couldn't load complete application data. Some information may be missing — retry before deciding." |

### 7.3.2 — SCR-ADM-015 — Performance Review (Full Specification)

| Element | Specification |
|---|---|
| **Purpose** | Conduct a staff performance review with objective data and self-assessment already compiled (UC-047, BP26). |
| **Components** | Pre-compiled data panel (class average trends, attendance/punctuality, grading turnaround); staff self-assessment panel (read-only once submitted); structured review form (ratings, goals, comments) |
| **Actions** | Review compiled data; review self-assessment; complete the structured review form; save and finalise |
| **Validation** | Review form fields per Part 4, M10 |
| **Loading State** | Skeleton per panel |
| **Empty State** | Self-assessment panel shows "Not yet submitted by [staff name]" if applicable, rather than appearing blank without explanation |
| **Error State** | Standard Template B error pattern |

### 7.3.3 — SCR-ADM-016 — Timetable Builder (Full Specification)

| Element | Specification |
|---|---|
| **Purpose** | Build, adjust, and publish the school timetable with real-time conflict detection (UC-034, UC-035). |
| **Components** | Drag-and-drop weekly grid; constraint configuration panel (collapsible); AI auto-schedule trigger button; draft comparison view (when multiple AI drafts are generated); conflict indicator overlay directly on the grid |
| **Actions** | Drag a class to a new slot; trigger AI auto-scheduling; compare generated drafts; resolve a flagged conflict; publish the finalised timetable |
| **Validation** | Real-time conflict checking on every drag action (LMS-FR-102); publish is blocked while unresolved conflicts remain |
| **Loading State** | Grid shows a skeleton while the AI scheduler computes draft options (this may take several seconds — a determinate or indeterminate progress indicator is shown, not a frozen screen) |
| **Empty State** | "No timetable exists yet for this term — generate a draft to begin" |
| **Error State** | "[N] unresolved conflicts" banner pinned to the top of the grid until resolved |

### 7.3.4 — SCR-ADM-021 — Invoice Generation (Full Specification)

| Element | Specification |
|---|---|
| **Purpose** | Bulk-generate invoices for an entire billing cycle in one action, with a preview step before sending (UC-039). |
| **Components** | Billing cycle/grade selector; generated invoice preview list (with per-student discount already applied); "Send All" confirmation action |
| **Actions** | Select billing parameters; generate preview; review individual invoices in the preview; confirm bulk send; or cancel before sending |
| **Validation** | Students with an incomplete fee structure are excluded from the batch and listed separately (LMS-FR-113 error state) |
| **Loading State** | Progress indicator showing "[X] of [N] invoices generated" during bulk processing |
| **Empty State** | "No eligible students found for this billing cycle" |
| **Error State** | Partial-failure list: which invoices generated successfully vs. which failed, with retry per failed item |

### 7.3.5 — SCR-ADM-026 — Emergency Broadcast (Full Specification)

| Element | Specification |
|---|---|
| **Purpose** | Trigger an instant, multi-channel emergency message to all or targeted recipients with full delivery tracking (UC-053, BP08). |
| **Components** | Pre-defined template selector (lockdown/weather/health) with editable message body; recipient scope selector; channel indicator showing which channels will be used per recipient; "Send Now" action requiring explicit confirmation (this is the highest-stakes action in the entire system) |
| **Actions** | Select or edit a template; select recipient scope; confirm and send; view post-send delivery status |
| **Validation** | Message body required, max 1000 characters for SMS compatibility (Part 4, M13) |
| **Loading State** | "Sending to [N] recipients..." progress indicator |
| **Empty State** | N/A |
| **Error State** | Per-recipient delivery failures listed distinctly, without blocking confirmation of successful deliveries (Part 4, M13 error state) |

### 7.3.6 — SCR-ADM-032 — Role & Permission Management (Full Specification)

| Element | Specification |
|---|---|
| **Purpose** | Create a custom role whose permissions can never exceed predefined role boundaries, structurally rather than just by warning (UC-063, BR-042). |
| **Components** | Custom role name field; permission selector showing only subsets of existing predefined roles' permissions — platform-level permissions are not rendered as options at all, not merely disabled |
| **Actions** | Name the role; select permissions from the constrained list; save |
| **Validation** | Role name required, unique within the school; permission selection has no validation error path because invalid options are never selectable in the first place |
| **Loading State** | Standard Template C |
| **Empty State** | N/A |
| **Error State** | Duplicate role name: "A role with this name already exists." |

## 7.4 Teacher Portal Screens

| Screen ID | Name | Purpose | Template | Notes |
|---|---|---|---|---|
| SCR-TCH-001 | Dashboard | View today's schedule, pending tasks, alerts. | D | Old SRS 3.4.1 |
| SCR-TCH-002 | My Classes List | View assigned classes and rosters. | A | — |
| SCR-TCH-003 | Schedule Live Class | Create a live class session, including recurrence. | C | UC-010 |
| SCR-TCH-004 | Live Class In-Session | Run an active live class session. | — | **Complex — see 7.4.1** |
| SCR-TCH-005 | Recordings List | Browse past class recordings. | A | — |
| SCR-TCH-006 | Assignment List/Create | View and create assignments. | A + C | M03 |
| SCR-TCH-007 | Rubric Builder | Build and save a reusable rubric. | C | UC-016 |
| SCR-TCH-008 | Assignment Grading Interface | Grade student submissions. | — | **Complex — see 7.4.2** |
| SCR-TCH-009 | Exam List/Create | View and create exams. | A + C | M04 |
| SCR-TCH-010 | Question Bank / AI Generator | Build and manage exam questions. | — | **Complex — see 7.4.3** |
| SCR-TCH-011 | Exam Grading Interface | Grade subjective exam questions. | B | Similar pattern to 7.4.2, applied to exam answers |
| SCR-TCH-012 | Live Proctoring Dashboard | Monitor an active proctored exam. | — | **Complex — see 7.4.4** |
| SCR-TCH-013 | Gradebook | Enter and manage grades for a class. | — | **Complex — see 7.4.5** |
| SCR-TCH-014 | Mark Attendance | Take attendance for a class period. | C | UC-030 |
| SCR-TCH-015 | Messages | Communicate with students/parents. | E | — |
| SCR-TCH-016 | My Schedule | View personal teaching timetable. | F | UC-037 |

### 7.4.1 — SCR-TCH-004 — Live Class In-Session (Full Specification)

| Element | Specification |
|---|---|
| **Purpose** | Provide the teacher full real-time control of an active live class: video, whiteboard, polls, breakout rooms, and attendance, without leaving the session view (Part 4, M02). |
| **Components** | Main video/content stage; participant list panel with per-student controls (mute, remove, spotlight); whiteboard toggle; poll/quiz launcher; breakout room manager; raise-hand/I'm-Lost queue indicator; recording control; session timer |
| **Actions** | Mute/remove/spotlight a student; toggle whiteboard; launch a poll; create breakout rooms; start/stop recording; lock the class; end the class for all |
| **Validation** | N/A — this is a real-time control surface, not a data-entry form |
| **Loading State** | "Connecting to session..." while the meeting link initialises |
| **Empty State** | "Waiting for students to join" before any participant arrives |
| **Error State** | Connection-loss banner with auto-retry, per the error state defined in Part 4, M02 |

### 7.4.2 — SCR-TCH-008 — Assignment Grading Interface (Full Specification)

| Element | Specification |
|---|---|
| **Purpose** | Allow efficient, rubric-based grading with inline annotation and voice/video feedback in one screen (UC-019, Part 4 M03). |
| **Components** | Submission viewer (left pane — supports PDF/image annotation); rubric/grading panel (right pane) with point-scale inputs per criterion; voice/video feedback recorder; comment bank quick-insert; navigation to next/previous submission without leaving the screen |
| **Actions** | Annotate the submission; score each rubric criterion; record voice/video feedback; insert a comment bank entry; publish or schedule the grade; move to the next submission |
| **Validation** | Rubric scores must fall within the criterion's defined point scale (Part 4, M03) |
| **Loading State** | Skeleton for submission viewer while the file loads |
| **Empty State** | "No submissions yet for this assignment" |
| **Error State** | "This file type could not be previewed — download to view" for unsupported inline preview formats |

### 7.4.3 — SCR-TCH-010 — Question Bank / AI Generator (Full Specification)

| Element | Specification |
|---|---|
| **Purpose** | Build an exam question set manually or via AI-assisted generation, with every AI-drafted question editable before use (UC-021, Part 4 M04). |
| **Components** | Question bank browser (filter by subject/topic/difficulty/tag); "Generate with AI" panel (subject/topic/difficulty/count inputs); question editor supporting all 10 question types; CSV/Word import control |
| **Actions** | Search/filter the bank; generate AI draft questions; edit/delete/regenerate individual questions; import from file; add a question to an exam |
| **Validation** | Question marks must be greater than 0 (Part 4, M04) |
| **Loading State** | "Generating questions..." progress indicator during AI generation (this may take several seconds) |
| **Empty State** | "No questions in the bank yet for this subject" |
| **Error State** | AI generation failure: "Couldn't generate questions — try again or build manually" |

### 7.4.4 — SCR-TCH-012 — Live Proctoring Dashboard (Full Specification)

| Element | Specification |
|---|---|
| **Purpose** | Give the proctor full visibility of every active exam-taker's webcam feed and flagged events in one screen (UC-025, Part 4 M04). |
| **Components** | Grid of all active students' webcam feeds; flagged-event alert overlay per student (tab-switch, multiple faces); expandable individual feed view; session time-remaining indicator |
| **Actions** | View all feeds simultaneously; expand an individual feed; review a flagged event's evidence (capture + timestamp) |
| **Validation** | N/A |
| **Loading State** | Per-feed skeleton/placeholder while each student's stream connects |
| **Empty State** | "No students have started this exam yet" |
| **Error State** | "Disconnected" status badge on an individual feed, per Part 4 M04's edge case — never a frozen or blank feed |

### 7.4.5 — SCR-TCH-013 — Gradebook (Full Specification)

| Element | Specification |
|---|---|
| **Purpose** | Provide a spreadsheet-like interface for grade entry and weighted calculation review (UC-026, UC-029, Part 4 M05). |
| **Components** | Spreadsheet grid (students × assignments/exams); category weighting configuration panel; curve/scaling action; CSV import control; grade override modal (requires reason) |
| **Actions** | Enter/edit a grade cell directly; apply a curve to a category; override a calculated grade with a reason; import grades from CSV; publish/hide grades |
| **Validation** | Category weights must sum to 100% (Part 4, M05 error state); override requires a non-empty reason |
| **Loading State** | Skeleton grid |
| **Empty State** | "No grade-bearing items yet for this class" |
| **Error State** | CSV import row-level errors listed per the Part 4, M05 error state |

## 7.5 Student Portal Screens

| Screen ID | Name | Purpose | Template | Notes |
|---|---|---|---|---|
| SCR-STU-001 | Dashboard | View today's schedule, pending tasks, announcements. | D | Old SRS 3.5.1 |
| SCR-STU-002 | My Classes | View enrolled courses and progress. | A | — |
| SCR-STU-003 | Live Class Join View | Join and participate in an active live class. | — | **Complex — see 7.5.1** |
| SCR-STU-004 | Assignment List | View all assignments by status. | A | — |
| SCR-STU-005 | Assignment Submission | Submit work for an assignment. | C | UC-017, UC-020 |
| SCR-STU-006 | Exam List | View upcoming and past exams. | A | — |
| SCR-STU-007 | Exam Taking View | Take a proctored or unproctored exam. | — | **Complex — see 7.5.2** |
| SCR-STU-008 | Grades | View real-time grades and breakdown. | D | UC-028 |
| SCR-STU-009 | What-If Calculator | Model hypothetical grade scenarios. | C | UC-027 |
| SCR-STU-010 | Performance Dashboard | View graphical academic performance charts. | D | Old SRS 3.5.6 |
| SCR-STU-011 | Library Search | Search and browse digital library resources. | A | UC-050 |
| SCR-STU-012 | Messages | Communicate with teachers and classmates. | E | — |
| SCR-STU-013 | My Schedule | View personal class timetable. | F | — |

### 7.5.1 — SCR-STU-003 — Live Class Join View (Full Specification)

| Element | Specification |
|---|---|
| **Purpose** | Let a student fully participate in a live class — video, chat, polls, breakout rooms — from a single screen (Part 4, M02). |
| **Components** | Main video/content view; chat panel; raise-hand and "I'm Lost" buttons; poll/quiz response panel (appears when launched); breakout room indicator |
| **Actions** | Toggle own video/audio; send a chat message; raise hand; send "I'm Lost" signal; respond to a poll/quiz; join an assigned breakout room |
| **Validation** | N/A |
| **Loading State** | "Joining class..." with a pre-class technical check (camera/mic/bandwidth) if not already completed |
| **Empty State** | N/A — screen only exists once joined |
| **Error State** | "Class is locked" or "Class has not started yet" per the relevant error states in Part 4, M02 |

### 7.5.2 — SCR-STU-007 — Exam Taking View (Full Specification)

| Element | Specification |
|---|---|
| **Purpose** | Provide a focused, proctoring-compliant exam-taking experience with auto-save and a clear unanswered-question warning before submission (UC-022, Part 4 M04). |
| **Components** | Question display (one-at-a-time or full list, per exam configuration); countdown timer; question navigator with answered/unanswered/flagged indicators; submit action; webcam preview (when proctored) |
| **Actions** | Answer a question; flag a question for review; navigate between questions (if permitted); submit |
| **Validation** | Submission triggers the unanswered-question warning (LMS-FR-068) before finalising |
| **Loading State** | "Loading exam..." with the pre-exam technical check |
| **Empty State** | N/A |
| **Error State** | "Webcam access required" blocking entry per Part 4, M04's error state, when proctoring is mandatory |

## 7.6 Parent Portal Screens

| Screen ID | Name | Purpose | Template | Notes |
|---|---|---|---|---|
| SCR-PAR-001 | Dashboard | View per-child summary cards and alerts. | D | Old SRS 3.6.1 |
| SCR-PAR-002 | My Children Switcher | Switch between linked children's data. | — | Persistent UI element across all screens, not a standalone screen — see note below |
| SCR-PAR-003 | Grades | View a child's grades (read-only). | D | UC-028 |
| SCR-PAR-004 | Attendance | View a child's attendance record. | D | — |
| SCR-PAR-005 | Fee Payments | View consolidated fees across all children and pay. | — | **Complex — see 7.6.1** |
| SCR-PAR-006 | Messages | Communicate with teachers and admin. | E | UC-052 |
| SCR-PAR-007 | Meeting Booking | Book a parent-teacher meeting slot. | C | UC-054 |
| SCR-PAR-008 | Action Plan View | View a child's psychological action plan goals. | B | LMS-FR-167 — goals only, not detailed intervention notes |
| SCR-PAR-009 | Profile Settings | Update contact details and notification preferences. | C | — |

*Note on SCR-PAR-002: the children switcher is a persistent header control present on every Parent Portal screen (per BP13), not a separate navigable screen — included here for completeness of the interaction model.*

### 7.6.1 — SCR-PAR-005 — Fee Payments (Full Specification)

| Element | Specification |
|---|---|
| **Purpose** | Let a parent view and pay outstanding fees across all linked children in a single session (UC-038, Part 4 M08). |
| **Components** | Consolidated outstanding-balance summary across all children; per-child itemised invoice list; payment method selector; multi-invoice checkout flow |
| **Actions** | Select invoices across one or more children; choose a payment method; complete payment; download receipt |
| **Validation** | Payment amount must match the selected invoice total(s); gateway-specific field validation per the configured provider |
| **Loading State** | "Processing payment..." with the payment button disabled during the transaction |
| **Empty State** | "No outstanding fees" — shown per child if that child has nothing due |
| **Error State** | "Payment could not be processed" per Part 4, M08's error state, with allocation detail if a partial multi-invoice payment partially succeeded |

## 7.7 Psychologist Portal Screens

| Screen ID | Name | Purpose | Template | Notes |
|---|---|---|---|---|
| SCR-PSY-001 | Dashboard | View overview cards, alerts, today's schedule. | D | Old SRS 3.7.1 |
| SCR-PSY-002 | Assign Assessments | Assign a test to students/classes/grades. | C | M14 |
| SCR-PSY-003 | Assessment Results | View a student's scored test results. | — | **Complex — see 7.7.1** |
| SCR-PSY-004 | Risk-Flagged Cases | View students flagged Medium/High/Critical. | A | UC-056 |
| SCR-PSY-005 | Counselling Session Notes | Record SOAP-format session notes. | C | LMS-FR-168 |
| SCR-PSY-006 | Action Plan Builder | Create/edit a student's action plan with visibility controls. | — | **Complex — see 7.7.2** |
| SCR-PSY-007 | Anonymised Trends Report | View school-wide mental health trends. | D | RR-002 — never shows individual student data |

### 7.7.1 — SCR-PSY-003 — Assessment Results (Full Specification)

| Element | Specification |
|---|---|
| **Purpose** | Display a student's full scored result for any of the five test types with appropriate visual representation per type (UC-055, Part 4 M14). |
| **Components** | Test-type-specific visualisation (Big Five/MBTI radar or profile, Holland Code career matches, aptitude percentile bars, IQ score with confidence interval, EQ dimension radar); comparison-to-norm overlay; PDF report export |
| **Actions** | View the visual result; toggle norm-group comparison; export the PDF report |
| **Validation** | N/A — read-only results display |
| **Loading State** | Skeleton chart placeholder |
| **Empty State** | "This student has not completed this assessment yet" |
| **Error State** | "Couldn't load this result. Retry?" |

### 7.7.2 — SCR-PSY-006 — Action Plan Builder (Full Specification)

| Element | Specification |
|---|---|
| **Purpose** | Build a SMART-goal action plan with granular, per-section visibility control across Student/Parent/Teacher/Admin (UC-057, BR-032, Part 4 M14). |
| **Components** | Goal/milestone builder with SMART-format structured fields; activity/resource recommendation list; per-section visibility toggle (Goals: default visible to Student/Parent/Teacher; Detailed Interventions: default Student/Psychologist-only); Critical Case Override control |
| **Actions** | Define goals and milestones; add recommended activities/resources; set visibility per section; apply or remove the Critical Case Override |
| **Validation** | Each goal must include a measurable target and deadline (Part 4, M14) |
| **Loading State** | Standard Template C |
| **Empty State** | N/A |
| **Error State** | Standard Template C field-level errors |

## 7.8 Staff Portal Screens

*Staff Portal screens vary by assigned sub-role (e.g. Librarian, Accountant) per DEC-P1-020. Each sub-role surfaces only the modules its permission set grants, reusing the same screens already specified for that module elsewhere in this Part (e.g. a Librarian sees SCR-ADM-027's Library Catalog Management screen with Staff-level permissions rather than a duplicate screen).*

| Screen ID | Name | Purpose | Template | Notes |
|---|---|---|---|---|
| SCR-STF-001 | Dashboard | Sub-role-specific summary view. | D | Content varies by assigned sub-role |
| SCR-STF-002 | Library Catalog Management | (Librarian sub-role) Manage digital library resources. | — | Reuses SCR-ADM-027 with Staff-scoped permissions, not a separate screen |
| SCR-STF-003 | Accounting Access | (Accountant sub-role) Access ledger and financial reports. | — | Reuses SCR-ADM-023/024 with Staff-scoped permissions, not a separate screen |
| SCR-STF-004 | My Profile | View/update own profile and notification preferences. | C | Identical pattern to other portals' profile settings |

---

*Lighthouse Global School System — P1 Master SRS — Part 7 — Layer 3 — Internal — v1.0*

