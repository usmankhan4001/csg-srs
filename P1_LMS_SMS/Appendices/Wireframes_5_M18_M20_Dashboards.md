# APPENDIX B — SCREEN WIREFRAMES (5/5)
## M18 User & Role Management · M19 Reports & Analytics · M20 Settings · Role Dashboards

**Status:** ✅ Complete
*Referenced from [Part 7 — Screen Specifications](../01_Master_SRS/Layer_3_UI_UX/Part_7_Screen_Specifications.md). This is the canonical Appendix B location for all wireframes per the production guide.*


---

## SCR-USR-001 — User List
**Purpose:** Admin manages all user accounts within their school.

```
┌─────────────────────────────────────────────────────────────────┐
│ Users                          [+ Add User]  [Bulk Import CSV] │
├─────────────────────────────────────────────────────────────────┤
│ [All] [Students] [Teachers] [Parents] [Staff]   [Search users...]│
├──────────────┬──────────────┬──────────────┬──────────┬─────────┤
│ Name           │ Role           │ Email          │ Status    │ Action  │
├──────────────┼──────────────┼──────────────┼──────────┼─────────┤
│ Ahmed Khan     │ Student        │ ahmed@...      │ Active    │ [Edit]  │
│ Ms. Fatima     │ Teacher        │ fatima@...     │ Active    │ [Edit]  │
└──────────────┴──────────────┴──────────────┴──────────┴─────────┘
```
**Components:** Role filter tabs · Search · User table · Bulk import button
**Actions:** Add User → Bulk Import (opens SCR-USR-004) → Edit (opens SCR-USR-002)
**Validation:** N/A
**Loading:** Skeleton table · **Empty:** "No users yet" · **Error:** "Couldn't load users — Retry"
**Reflow:** Tablet — table scrolls. Mobile — cards.

---

## SCR-USR-002 — User Detail / Edit
**Purpose:** Edit a user's profile, role, and account status.

```
┌─────────────────────────────────────────────────────────────────┐
│ ← Back    Edit User — Ahmed Khan                                  │
├─────────────────────────────────────────────────────────────────┤
│ Full Name *      [Ahmed Khan_______________]                       │
│ Email *           [ahmed@email.com_________]                       │
│ Role *             [Student ▾]                                      │
│ Status             (•)Active ( )Suspended ( )Expelled              │
│   Reason (if changing status): [_____________________]              │
│                                                                       │
│ ☑ MFA Enabled    [Reset Password]    [Force Logout All Sessions]   │
│                                                                       │
│                                              [Save Changes]         │
└─────────────────────────────────────────────────────────────────┘
```
**Components:** Editable profile fields · Role dropdown · Status radio with reason field · Security actions
**Actions:** Edit fields → Change status (reason required if not Active) → Reset Password → Save
**Validation:** Status change to Suspended/Expelled requires a reason · Email must be unique within school
**Loading:** N/A · **Empty:** N/A · **Error:** "Couldn't save — email already in use"
**Reflow:** Tablet/Mobile — single column.

---

## SCR-USR-003 — Role Builder
**Purpose:** Admin creates a custom role with granular permissions.

```
┌─────────────────────────────────────────────────────────────────┐
│ Create Custom Role                                                  │
├─────────────────────────────────────────────────────────────────┤
│ Role Name *       [Senior Teacher___________]                       │
│ Base Template *    [Teacher ▾]                                      │
│                                                                       │
│ Permissions (within Teacher template scope)                          │
│ ☑ Create assignments    ☑ Grade submissions    ☑ Mark attendance    │
│ ☑ View gradebook         ☐ Delete student account ← greyed (BR-042)  │
│ ☑ Mentor junior teachers (custom)                                     │
│                                                                       │
│                                          [Cancel]    [Create Role →]│
└─────────────────────────────────────────────────────────────────┘
```
**Components:** Role name input · Base template dropdown · Permission checklist (permissions outside the template scope shown greyed/disabled, not just hidden — so admin understands why)
**Actions:** Select base template → Toggle permissions → Create
**Validation:** Cannot enable a permission outside the base template's scope — `422 PERMISSION_EXCEEDS_TEMPLATE` if attempted via API; UI prevents this at the source by disabling the checkbox
**Loading:** N/A · **Empty:** N/A · **Error:** "Role name already exists"
**Reflow:** Tablet/Mobile — single column, checklist remains scrollable.

---

## SCR-USR-004 — Bulk Import
**Purpose:** Import multiple users from CSV/XLSX.

```
┌─────────────────────────────────────────────────────────────────┐
│ Bulk Import Users                                                    │
├─────────────────────────────────────────────────────────────────┤
│ Role to import: [Student ▾]                                          │
│ [Download Template CSV]                                               │
│                                                                       │
│ ┌─────────────────────────────────────────────────────────────┐    │
│ │              📎 Drag CSV/XLSX here or click to browse           │    │
│ └─────────────────────────────────────────────────────────────┘    │
│                                                                       │
│                                              [Upload & Validate →]  │
└─────────────────────────────────────────────────────────────────┘
```
**Components:** Role selector · Template download link · File drop zone
**Actions:** Download template → Upload → triggers async job (Part 9.4 sequence)

### SCR-USR-004b — Import Results
```
┌─────────────────────────────────────────────────────────────────┐
│ Import Results — students.csv                                       │
├─────────────────────────────────────────────────────────────────┤
│ ✅ 48 imported successfully     ⚠️ 2 failed                          │
├──────────────┬──────────────┬──────────────────────────────────┤
│ Row            │ Error          │ Detail                              │
├──────────────┼──────────────┼──────────────────────────────────┤
│ Row 12          │ DUPLICATE_EMAIL│ ahmed@email.com already exists       │
│ Row 31          │ INVALID_GRADE  │ "Grade 99" is not a valid grade      │
└──────────────┴──────────────┴──────────────────────────────────┘
                                              [Download Error Report]
```
**Validation:** Per-row validation — failures don't block successful rows (Appendix C.6's per-row result design)
**Loading:** "Processing 50 rows…" progress bar · **Empty:** N/A · **Error:** shown per-row, not as a blocking page error
**Reflow:** Tablet — table scrolls. Mobile — cards per failed row.

---

## SCR-RPT-001 — Custom Report Builder
**Purpose:** Drag-and-drop report designer.

```
┌─────────────────────────────────────────────────────────────────┐
│ Report Builder                                  [Save] [Preview]│
├───────────────────────┬───────────────────────────────────────────┤
│ Available Fields        │  Report Layout                            │
│ □ Student Name           │  Columns: [Student Name] [Grade]          │
│ □ Grade                  │           [Attendance %] [+]              │
│ □ Attendance %           │                                            │
│ □ GPA                    │  Filters:                                  │
│ □ Fee Status             │  Grade = [Grade 8 ▾]                       │
│ □ Class Section          │  Date Range = [Current Term ▾]             │
│                          │                                            │
│                          │  [+ Add Filter]                            │
└───────────────────────┴───────────────────────────────────────────┘
```
**Components:** Field palette · Column builder (drag to add) · Filter builder
**Actions:** Drag fields to columns → Add filters → Save (named report) → Preview
**Validation:** At least one column required before Preview/Save
**Loading:** N/A · **Empty:** "Drag fields to start building your report" · **Error:** "Couldn't save report — Retry"
**Reflow:** Tablet — palette collapses to a button. Mobile — not optimized for building (admin desktop tool); viewing saved reports works on mobile.

---

## SCR-RPT-002 — Saved Reports List
**Purpose:** Browse and run previously saved custom reports.

```
┌─────────────────────────────────────────────────────────────────┐
│ Saved Reports                                  [+ New Report]   │
├──────────────┬──────────────┬──────────────┬──────────┬─────────┤
│ Report Name    │ Created By     │ Last Run       │ Schedule  │ Action  │
├──────────────┼──────────────┼──────────────┼──────────┼─────────┤
│ Grade 8 Attend.│ Admin          │ 2 days ago     │ Weekly    │[Run][Edit]│
│ Fee Aging Rpt  │ Admin          │ Today          │ Manual    │[Run][Edit]│
└──────────────┴──────────────┴──────────────┴──────────┴─────────┘
```
**Components:** Report table with run/edit actions · Schedule indicator
**Actions:** Run (generates output now) → Edit (opens builder) → Schedule (configure recurring delivery)
**Validation:** N/A
**Loading:** Skeleton table · **Empty:** "No saved reports yet" · **Error:** "Couldn't load — Retry"
**Reflow:** Tablet — table scrolls. Mobile — cards.

---

## SCR-RPT-003 — Dashboard Analytics (Generic Chart View)
**Purpose:** Reusable analytics view pattern used across CEO/Admin dashboards.

```
┌─────────────────────────────────────────────────────────────────┐
│ Enrollment Analytics                    [Day][Week][Month][Year]│
├─────────────────────────────────────────────────────────────────┤
│ Enrollment Trend                                                     │
│  500│                                          ●━━●                │
│  400│                          ●━━●                                │
│  300│        ●━━●                                                  │
│      └────────────────────────────────────────                     │
│       Q1      Q2      Q3      Q4                                   │
├─────────────────────────────────────────────────────────────────┤
│ By Grade Level             │ By Source                              │
│  [Bar chart]                │  [Pie chart]                            │
└─────────────────────────────────────────────────────────────────┘
                                              [Export Dashboard PDF]
```
**Components:** Period selector tabs · Trend line chart · Secondary bar/pie charts side-by-side
**Actions:** Switch period → Export PDF
**Validation:** N/A
**Loading:** Skeleton charts · **Empty:** "No data for this period" · **Error:** "Couldn't load analytics — Retry"
**Reflow:** Tablet — secondary charts stack. Mobile — all charts stack vertically, simplified.

---

## SCR-CFG-001 — School Profile Settings
**Purpose:** Configure school branding and contact info.

```
┌─────────────────────────────────────────────────────────────────┐
│ School Profile                                                       │
├─────────────────────────────────────────────────────────────────┤
│ School Name *     [Lighthouse International School_______]          │
│ Logo               [Current logo] [Upload New]                       │
│ Primary Colour      [🟦 #2b6cb0]                                     │
│ Address              [_________________________________]              │
│ Contact Email        [info@lighthouse.edu_____________]               │
│ Contact Phone         [+92 21 1234567__________________]              │
│                                                                       │
│                                              [Save Profile]         │
└─────────────────────────────────────────────────────────────────┘
```
**Components:** Logo upload with preview · Colour picker · Address/contact fields
**Actions:** Upload logo → Pick colour → Save
**Validation:** Logo file size limit enforced (per Part 9.6 upload validation) · Email format check
**Loading:** N/A · **Empty:** N/A (defaults shown) · **Error:** "Couldn't save — Retry"
**Reflow:** Tablet/Mobile — single column.

---

## SCR-CFG-002 — Notification Templates
**Purpose:** Customize email/SMS templates with merge fields.

```
┌─────────────────────────────────────────────────────────────────┐
│ Notification Templates                                                │
├─────────────────────────────────────────────────────────────────┤
│ Template: [Fee Reminder — Email ▾]                                    │
│                                                                       │
│ Subject   [Reminder: {{fee_amount}} due on {{due_date}}_______]      │
│ Body       [Dear {{parent_name}},.....................................]│
│            [Available merge fields: {{student_name}} {{fee_amount}}   │
│             {{due_date}} {{school_name}}]                              │
│                                                                       │
│                                  [Send Test]    [Save Template]    │
└─────────────────────────────────────────────────────────────────┘
```
**Components:** Template selector · Subject/body editor with merge field reference · Send Test action
**Actions:** Edit template → Send Test (to admin's own email) → Save
**Validation:** Merge fields must use valid `{{field}}` syntax — invalid syntax highlighted
**Loading:** N/A · **Empty:** N/A (defaults present) · **Error:** "Couldn't save — invalid merge field {{xyz}}"
**Reflow:** Tablet/Mobile — single column, full width text area.

---

## SCR-CFG-003 — Integration Settings
**Purpose:** Configure payment gateways, SSO, and calendar sync.

```
┌─────────────────────────────────────────────────────────────────┐
│ Integration Settings                                                  │
├─────────────────────────────────────────────────────────────────┤
│ [Payment Gateways] [SSO] [Calendar Sync] [Backup & Restore]          │
├─────────────────────────────────────────────────────────────────┤
│ Payment Gateways                                                       │
│ Stripe      API Key: [••••••••••••3xK9]    [Test Connection]  ✅      │
│ JazzCash    API Key: [Not configured]       [Add Credentials]         │
│                                                                       │
│                                              [Save Configuration]    │
└─────────────────────────────────────────────────────────────────┘
```
**Components:** Tab navigation · Masked API key fields (never shown in plaintext, per RISK-T security note) · Test Connection action with live status
**Actions:** Add/edit credentials → Test Connection (validates before saving) → Save
**Validation:** Test Connection must succeed before the gateway is marked Active — failed test shows the gateway's exact decline reason
**Loading:** "Testing connection…" · **Empty:** "Not configured" · **Error:** "Connection failed — check your API key"
**Reflow:** Tablet — tabs horizontal. Mobile — tabs become dropdown.

---

## ROLE DASHBOARDS

## SCR-CEO-001 — CEO Executive Dashboard
**Purpose:** Strategic KPI overview for leadership.

```
┌─────────────────────────────────────────────────────────────────┐
│ Executive Dashboard                    [This Month ▾] [vs Last]│
├─────────────────────────────────────────────────────────────────┤
│ ┌─────────┐┌─────────┐┌─────────┐┌─────────┐┌─────────┐        │
│ │Enrollment││Revenue  ││Collection││Retention││Avg GPA  │        │
│ │ 1,250 ↗  ││$245K ↗  ││Rate: 94%││  91% ↗  ││  3.4    │        │
│ └─────────┘└─────────┘└─────────┘└─────────┘└─────────┘        │
├─────────────────────────────────────────────────────────────────┤
│ Critical Alerts                                                       │
│ ⚠️ Revenue 8% below target this month                                │
├─────────────────────────────────────────────────────────────────┤
│ [Enrollment Analytics] [Financial Analytics] [Academic Performance] │
│ [Decision Support — What-If Scenarios]  [Board Reports]              │
└─────────────────────────────────────────────────────────────────┘
```
**Components:** KPI cards with trend arrows · Period selector + comparison toggle · Critical alerts banner · Navigation cards to deeper analytics sections
**Actions:** Click any KPI card → drills into detailed analytics (e.g., SCR-RPT-003 pattern) → Run what-if scenario
**Validation:** N/A
**Loading:** Skeleton cards · **Empty:** N/A · **Error:** "Couldn't load executive data — Retry"
**Reflow:** Tablet — cards 3×2. Mobile — Lightweight Mobile Executive App variant per Part 3.2.12: top 5 KPIs only, simplified single column.

---

## SCR-ADM-DASH-001 — School Admin Dashboard
**Purpose:** Daily operations overview.

```
┌─────────────────────────────────────────────────────────────────┐
│ Good morning, Admin                                    22 June  │
├─────────────────────────────────────────────────────────────────┤
│ ┌─────────┐┌─────────┐┌─────────┐┌─────────┐                    │
│ │Students  ││Teachers  ││Classes   ││Attendance│                    │
│ │  450     ││   28     ││Today: 32 ││Today: 94%│                    │
│ └─────────┘└─────────┘└─────────┘└─────────┘                    │
├─────────────────────────────────────────────────────────────────┤
│ Today's Tasks                                                         │
│ • 3 pending admissions to review                                       │
│ • 5 unpaid fee reminders to send                                       │
│ • 2 leave requests awaiting approval                                    │
├─────────────────────────────────────────────────────────────────┤
│ Calendar                              │ System Alerts               │
│ [mini calendar widget]                  │ ⚠️ Storage at 85% capacity   │
└─────────────────────────────────────────────────────────────────┘
```
**Components:** Greeting header with date · Quick stat cards · Task list (clickable, routes to relevant module) · Calendar widget · System alerts panel
**Actions:** Click task → navigates to relevant screen (e.g., "3 pending admissions" → SCR-ADM-001)
**Validation:** N/A
**Loading:** Skeleton dashboard · **Empty:** N/A · **Error:** "Couldn't load dashboard — Retry"
**Reflow:** Tablet — cards 2×2. Mobile — cards stack, tasks remain a priority list at top.

---

## SCR-TCH-DASH-001 — Teacher Dashboard
**Purpose:** Teacher's daily view.

```
┌─────────────────────────────────────────────────────────────────┐
│ Good morning, Ms. Fatima                                22 June │
├─────────────────────────────────────────────────────────────────┤
│ Today's Schedule                                                       │
│ 08:00 Grade 8A Mathematics    09:00 Grade 9A Mathematics                │
│ 11:00 Grade 8B Mathematics                                              │
├─────────────────────────────────────────────────────────────────┤
│ Pending Tasks                                                           │
│ • 12 assignments to grade — Algebra Worksheet 3                          │
│ • Attendance not yet marked for Period 2                                 │
│ • 3 unread parent messages                                                │
├─────────────────────────────────────────────────────────────────┤
│ Quick Stats: Classes this week: 18 · Avg class performance: 78%          │
└─────────────────────────────────────────────────────────────────┘
```
**Components:** Today's schedule strip · Pending task list (actionable, clickable) · Quick stats footer
**Actions:** Click schedule item → Start class · Click task → navigate to relevant screen
**Validation:** N/A
**Loading:** Skeleton dashboard · **Empty:** "No classes today" · **Error:** "Couldn't load — Retry"
**Reflow:** Tablet/Mobile — schedule strip becomes vertical list, tasks remain prioritized at top.

---

## SCR-STU-DASH-001 — Student Dashboard
**Purpose:** Student's daily view.

```
┌─────────────────────────────────────────────────────────────────┐
│ Hi Ahmed!                                              22 June  │
├─────────────────────────────────────────────────────────────────┤
│ Today                                                                   │
│ 🕐 09:00 Mathematics — [Join Class]      📝 Algebra HW due tonight      │
├─────────────────────────────────────────────────────────────────┤
│ Quick Stats: GPA 3.4 · Attendance 96% · 2 assignments due this week    │
├─────────────────────────────────────────────────────────────────┤
│ Announcements                                                           │
│ 📌 School closed Friday for public holiday                              │
└─────────────────────────────────────────────────────────────────┘
```
**Components:** Today's schedule with Join buttons · Quick stat strip · Announcements feed
**Actions:** Join Class → goes live · Click assignment → opens SCR-ASN-005
**Validation:** N/A
**Loading:** Skeleton dashboard · **Empty:** "No classes today" · **Error:** "Couldn't load — Retry"
**Reflow:** Tablet/Mobile — single column, Join button prominent and large for thumb-tap.

---

## SCR-PAR-DASH-001 — Parent Dashboard
**Purpose:** Parent's overview, supports multiple children.

```
┌─────────────────────────────────────────────────────────────────┐
│ Welcome, Bilal Khan         Viewing: [Ahmed Khan ▾] (2 children)│
├─────────────────────────────────────────────────────────────────┤
│ Ahmed's Summary                                                         │
│ GPA: 3.4    Attendance: 96%    Outstanding Fees: PKR 30,000             │
│                                                                          │
│ Recent Activity                                                          │
│ • Grade posted: Algebra Worksheet 3 — 90%                                │
│ • Attendance alert: Absent 20 June                                       │
├─────────────────────────────────────────────────────────────────┤
│ Quick Actions: [Pay Fees] [Message Teacher] [View Report Card]          │
└─────────────────────────────────────────────────────────────────┘
```
**Components:** Child switcher dropdown (multi-child support, Part 3.6.8) · Summary stats · Recent activity feed · Quick action buttons
**Actions:** Switch child → Pay Fees (SCR-FEE-003) → Message Teacher (SCR-COM-001) → View Report Card
**Validation:** N/A
**Loading:** Skeleton dashboard · **Empty:** N/A · **Error:** "Couldn't load — Retry"
**Reflow:** Tablet/Mobile — child switcher remains at top, single column below.

---

*Lighthouse Global School System — P1 — Appendix B Wireframes (5/5) — Internal — v1.0*
*All 5 wireframe files together cover ~90 screens across all 20 modules and 7 role dashboards.*
