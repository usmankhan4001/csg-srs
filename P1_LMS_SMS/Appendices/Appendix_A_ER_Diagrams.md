# APPENDIX A — ER DIAGRAMS
## P1 — LMS + SMS | All entity relationship diagrams (Mermaid erDiagram)

*Colour coding by domain is described in headings since Mermaid erDiagram does not support node colours. Five domains: Identity (users/roles), Academic (courses/classes), Assessment (assignments/exams), Financial (fees/accounting), Wellbeing (psych/health).*

---

## A.1 Identity Domain — Users, Roles, Tenants

```mermaid
erDiagram
    SCHOOL {
        uuid id PK
        string subdomain UK
        string name
        string timezone
        string currency
        string subscription_plan
        string status
        timestamptz created_at
    }

    USER {
        uuid id PK
        uuid school_id FK
        string email UK
        string password_hash
        string first_name
        string last_name
        string phone
        string photo_url
        boolean is_active
        boolean mfa_enabled
        timestamptz last_login_at
        timestamptz created_at
    }

    ROLE {
        uuid id PK
        uuid school_id FK
        string name
        string base_role_template
        boolean is_custom
    }

    USER_ROLE {
        uuid user_id FK
        uuid role_id FK
        timestamptz assigned_at
    }

    PERMISSION {
        uuid id PK
        string module
        string action
        string description
    }

    ROLE_PERMISSION {
        uuid role_id FK
        uuid permission_id FK
    }

    AUDIT_LOG {
        uuid id PK
        uuid school_id FK
        uuid actor_user_id FK
        string action
        string entity_type
        uuid entity_id
        jsonb before_value
        jsonb after_value
        inet ip_address
        timestamptz created_at
    }

    SCHOOL ||--o{ USER : "has"
    SCHOOL ||--o{ ROLE : "defines"
    USER ||--o{ USER_ROLE : "assigned"
    ROLE ||--o{ USER_ROLE : "grants"
    ROLE ||--o{ ROLE_PERMISSION : "includes"
    PERMISSION ||--o{ ROLE_PERMISSION : "in"
    USER ||--o{ AUDIT_LOG : "generates"
```

---

## A.2 Student & Parent Domain

```mermaid
erDiagram
    STUDENT {
        uuid id PK
        uuid user_id FK
        uuid school_id FK
        string student_id_number UK
        string grade_level
        uuid class_section_id FK
        date date_of_birth
        string gender
        string nationality
        jsonb emergency_contacts
        jsonb medical_info
        string status
        timestamptz enrolled_at
    }

    PARENT {
        uuid id PK
        uuid user_id FK
        uuid school_id FK
        string relationship_to_student
    }

    STUDENT_PARENT {
        uuid student_id FK
        uuid parent_id FK
        boolean is_primary_guardian
        boolean authorized_pickup
    }

    CLASS_SECTION {
        uuid id PK
        uuid school_id FK
        string grade_level
        string section_name
        uuid class_teacher_id FK
        integer capacity
        integer academic_year
    }

    STUDENT ||--|| USER : "is a"
    PARENT ||--|| USER : "is a"
    STUDENT ||--o{ STUDENT_PARENT : "linked to"
    PARENT ||--o{ STUDENT_PARENT : "linked to"
    CLASS_SECTION ||--o{ STUDENT : "contains"
```

---

## A.3 Academic Domain — Courses, Subjects, Timetable

```mermaid
erDiagram
    SUBJECT {
        uuid id PK
        uuid school_id FK
        string code UK
        string name
        string grade_level
        integer credit_hours
        string cambridge_syllabus_code
    }

    COURSE {
        uuid id PK
        uuid subject_id FK
        uuid class_section_id FK
        uuid teacher_id FK
        integer academic_year
        string term
        string status
    }

    LESSON {
        uuid id PK
        uuid course_id FK
        string title
        integer order_index
        string content_type
        text content_url
        boolean is_published
        timestamptz published_at
    }

    TIMETABLE_SLOT {
        uuid id PK
        uuid school_id FK
        uuid course_id FK
        uuid room_id FK
        integer day_of_week
        time start_time
        time end_time
        integer academic_year
        string term
        boolean is_active
    }

    ROOM {
        uuid id PK
        uuid school_id FK
        string name
        string type
        integer capacity
    }

    SUBSTITUTION {
        uuid id PK
        uuid timetable_slot_id FK
        uuid original_teacher_id FK
        uuid substitute_teacher_id FK
        date substitution_date
        uuid approved_by FK
        timestamptz created_at
    }

    SUBJECT ||--o{ COURSE : "delivered as"
    COURSE ||--o{ LESSON : "contains"
    COURSE ||--o{ TIMETABLE_SLOT : "scheduled in"
    ROOM ||--o{ TIMETABLE_SLOT : "hosts"
    TIMETABLE_SLOT ||--o{ SUBSTITUTION : "covered by"
```

---

## A.4 Assessment Domain — Assignments, Exams, Grades

```mermaid
erDiagram
    ASSIGNMENT {
        uuid id PK
        uuid course_id FK
        uuid created_by FK
        string title
        string type
        text instructions
        timestamptz due_at
        string late_rule
        decimal late_penalty_pct
        integer attempt_limit
        boolean plagiarism_check_enabled
        boolean is_published
    }

    SUBMISSION {
        uuid id PK
        uuid assignment_id FK
        uuid student_id FK
        integer attempt_number
        string content_url
        text submission_text
        boolean is_late
        timestamptz submitted_at
        decimal score
        boolean is_graded
        timestamptz graded_at
        uuid graded_by FK
    }

    RUBRIC {
        uuid id PK
        uuid school_id FK
        string name
        boolean is_reusable
    }

    RUBRIC_CRITERION {
        uuid id PK
        uuid rubric_id FK
        string title
        text description
        decimal max_points
        decimal weight
    }

    EXAM {
        uuid id PK
        uuid course_id FK
        uuid created_by FK
        string title
        string exam_type
        integer total_marks
        integer passing_marks
        integer time_limit_minutes
        timestamptz available_from
        timestamptz available_until
        jsonb proctoring_settings
        boolean is_published
    }

    QUESTION {
        uuid id PK
        uuid school_id FK
        string question_type
        text content
        jsonb options
        jsonb correct_answer
        integer marks
        string difficulty
        string subject
        string topic
        boolean ai_generated
        boolean reviewed
    }

    EXAM_QUESTION {
        uuid exam_id FK
        uuid question_id FK
        integer order_index
    }

    EXAM_ATTEMPT {
        uuid id PK
        uuid exam_id FK
        uuid student_id FK
        jsonb answers
        decimal score
        timestamptz started_at
        timestamptz submitted_at
        boolean flagged_for_review
        jsonb proctoring_incidents
    }

    GRADEBOOK_CATEGORY {
        uuid id PK
        uuid course_id FK
        string name
        decimal weight
        boolean drop_lowest
        integer drop_count
    }

    ASSIGNMENT ||--o{ SUBMISSION : "receives"
    ASSIGNMENT }o--|| RUBRIC : "uses"
    RUBRIC ||--o{ RUBRIC_CRITERION : "has"
    EXAM ||--o{ EXAM_QUESTION : "contains"
    QUESTION ||--o{ EXAM_QUESTION : "in"
    EXAM ||--o{ EXAM_ATTEMPT : "attempted by"
    ASSIGNMENT }o--|| GRADEBOOK_CATEGORY : "belongs to"
    EXAM }o--|| GRADEBOOK_CATEGORY : "belongs to"
```

---

## A.5 Financial Domain — Fees, Payments, Accounting

```mermaid
erDiagram
    FEE_STRUCTURE {
        uuid id PK
        uuid school_id FK
        string fee_head
        string grade_level
        decimal amount
        string plan_type
        integer academic_year
    }

    INVOICE {
        uuid id PK
        uuid school_id FK
        uuid student_id FK
        string invoice_number UK
        decimal total_amount
        decimal paid_amount
        decimal outstanding_amount
        date due_date
        string status
        timestamptz generated_at
    }

    INVOICE_LINE {
        uuid id PK
        uuid invoice_id FK
        uuid fee_structure_id FK
        string description
        decimal amount
    }

    PAYMENT {
        uuid id PK
        uuid invoice_id FK
        uuid school_id FK
        decimal amount
        string gateway_provider
        string gateway_transaction_id UK
        string status
        string payment_method
        string receipt_number UK
        timestamptz paid_at
    }

    LEDGER_ACCOUNT {
        uuid id PK
        uuid school_id FK
        string account_code UK
        string account_name
        string account_type
        uuid parent_account_id FK
    }

    JOURNAL_ENTRY {
        uuid id PK
        uuid school_id FK
        string reference_type
        uuid reference_id
        date entry_date
        text description
        uuid posted_by FK
        timestamptz posted_at
    }

    JOURNAL_LINE {
        uuid id PK
        uuid journal_entry_id FK
        uuid account_id FK
        decimal debit_amount
        decimal credit_amount
    }

    FEE_STRUCTURE ||--o{ INVOICE_LINE : "itemised in"
    INVOICE ||--o{ INVOICE_LINE : "contains"
    INVOICE ||--o{ PAYMENT : "settled by"
    JOURNAL_ENTRY ||--o{ JOURNAL_LINE : "has lines"
    LEDGER_ACCOUNT ||--o{ JOURNAL_LINE : "credited/debited in"
    LEDGER_ACCOUNT ||--o{ LEDGER_ACCOUNT : "parent of"
```

---

## A.6 Wellbeing Domain — Psychological Assessment

```mermaid
erDiagram
    PSYCH_TEST {
        uuid id PK
        uuid school_id FK
        string test_type
        string name
        jsonb configuration
        boolean is_active
    }

    TEST_ASSIGNMENT {
        uuid id PK
        uuid test_id FK
        uuid assigned_to_student_id FK
        uuid assigned_by FK
        timestamptz available_from
        timestamptz available_until
        string status
    }

    TEST_RESULT {
        uuid id PK
        uuid test_assignment_id FK
        uuid student_id FK
        jsonb raw_scores
        jsonb computed_profile
        string risk_level
        timestamptz completed_at
    }

    ACTION_PLAN {
        uuid id PK
        uuid student_id FK
        uuid created_by FK
        string plan_type
        text summary
        jsonb visibility_settings
        string status
        timestamptz created_at
    }

    ACTION_PLAN_MILESTONE {
        uuid id PK
        uuid action_plan_id FK
        string title
        text description
        date target_date
        boolean completed
        timestamptz completed_at
    }

    COUNSELLING_SESSION {
        uuid id PK
        uuid student_id FK
        uuid psychologist_id FK
        timestamptz scheduled_at
        integer duration_minutes
        text confidential_notes
        text shareable_summary
        string session_type
        string status
    }

    RISK_FLAG {
        uuid id PK
        uuid student_id FK
        uuid school_id FK
        string risk_level
        string triggered_by
        boolean resolved
        uuid resolved_by FK
        timestamptz created_at
    }

    PSYCH_TEST ||--o{ TEST_ASSIGNMENT : "assigned via"
    TEST_ASSIGNMENT ||--o{ TEST_RESULT : "produces"
    TEST_RESULT ||--o{ RISK_FLAG : "may trigger"
    ACTION_PLAN ||--o{ ACTION_PLAN_MILESTONE : "has"
    COUNSELLING_SESSION }o--|| TEST_RESULT : "informed by"
```

---

## A.7 Attendance Domain

```mermaid
erDiagram
    ATTENDANCE_RECORD {
        uuid id PK
        uuid school_id FK
        uuid student_id FK
        uuid class_section_id FK
        uuid timetable_slot_id FK
        date attendance_date
        string period
        string status
        boolean is_excused
        text notes
        uuid marked_by FK
        timestamptz marked_at
    }

    LEAVE_REQUEST {
        uuid id PK
        uuid school_id FK
        uuid student_id FK
        uuid requested_by FK
        date start_date
        date end_date
        string reason
        string supporting_document_url
        string status
        uuid reviewed_by FK
        timestamptz reviewed_at
    }

    LIVE_CLASS_ATTENDANCE {
        uuid id PK
        uuid live_class_id FK
        uuid student_id FK
        timestamptz joined_at
        timestamptz left_at
        boolean auto_marked_present
    }

    ATTENDANCE_RECORD }o--|| LEAVE_REQUEST : "excused by"
    LIVE_CLASS_ATTENDANCE }o--|| ATTENDANCE_RECORD : "feeds into"
```

---

*Lighthouse Global School System — P1 Master SRS — Appendix A — Internal — v1.0*
