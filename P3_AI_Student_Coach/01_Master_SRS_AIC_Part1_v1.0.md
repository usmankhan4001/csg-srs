# PART 1 — PROJECT DEFINITION

*Layer 1 — Business & Strategy*

| **Field**  | **Value**  |
| --- | --- |
| Product  | P3 — AI Student Coach  |
| Document  | Master SRS — Part 1 of 17  |
| Version  | 1.0 (Draft — Layer 1 in progress)  |
| Classification  | Internal — Consultant Use Only  |
| Status  | Draft for consultant review  |
| Requirement ID prefixes  | AIC-FR / AIC-TR / AIC-NFR / AIC-UIR  |
| Layer-1 identifier prefixes  | OBJ-AIC / KPI-AIC / ASM-AIC / CON-AIC / DEP-AIC / DRV-AIC  |

## 1.1 Product Vision

The AI Student Coach (P3) provides each enrolled student a dedicated AI tutor that teaches every subject in the student's Cambridge stage, adapts instruction to the student's grade, learning profile, strengths, and weaknesses, responds in the student's set language, and is reachable 24 hours per day across web, iOS, and Android.

P3 addresses a fixed-capacity constraint: at the target scale of 100,000+ enrolled students, individualized instruction for every student cannot be delivered by teaching staff alone.

P3 reads student data from P1 (LMS/SMS) and returns recommendations, coach-session summaries, and risk flags. P3 does not author curriculum content, does not grade formal assessments, and does not perform psychological diagnosis; those functions remain owned by P1.

## 1.2 Strategic Objectives

| **ID**  | **Objective**  | **Measurable Target**  | **Business Outcome**  |
| --- | --- | --- | --- |
| OBJ-AIC-01  | Provide every active student an individual AI tutor  | 100% of active enrolled students provisioned within 30 days of launch  | Delivers client Strategic Goal 4 (private AI tutor per student)  |
| OBJ-AIC-02  | Raise measured academic performance  | Mean subject-assessment score +8 percentage points over one term for students with >=2 coach sessions/week vs. matched baseline  | Higher academic outcomes; accreditation evidence  |
| OBJ-AIC-03  | Increase student retention  | +5 percentage points term-over-term retention for active coach users vs. non-users  | Recurring tuition revenue protection  |
| OBJ-AIC-04  | Sustain student engagement  | >=60% weekly active usage among enrolled students by month 6  | Product adoption; data for personalization  |
| OBJ-AIC-05  | Detect at-risk students earlier  | >=90% of Level-1 wellbeing signals routed to P1 Psychologist within 1 hour  | Earlier intervention; safeguarding compliance  |
| OBJ-AIC-06  | Constrain inference unit economics  | >=95% of active students served within the 2,000,000 token/student/month cap  | Predictable operating cost (Part 13)  |
| OBJ-AIC-07  | Deliver multilingual tutoring  | English, Arabic, Urdu at launch with >=95% match to the student's set language on sampled QA  | Serves Arabic/Urdu/English student base  |

## 1.3 Scope Statement

### 1.3.1 In Scope — Version 1.0

| **ID**  | **In-Scope Item**  | **Note**  |
| --- | --- | --- |
| IN-01  | Personal AI tutor covering all subjects of the student's enrolled Cambridge stage  | Grounded on licensed/uploaded RAG corpus (DEP-AIC-03)  |
| IN-02  | Adaptive instruction driven by the Student Learning Profile  | Profile sourced from P1 (DEP-AIC-01)  |
| IN-03  | Homework Assistant with Guided mode and Full-solution mode  | Mode selected by P1 assignment context (CON-AIC-09)  |
| IN-04  | Revision Coach: auto-generated quizzes, flashcards, summaries  | Tier-B model generation  |
| IN-05  | Career Coach: psychometrics-informed guidance, university pathways, career options  | Psychometrics read-only from P1  |
| IN-06  | Wellbeing Coach: engagement/motivation/burnout signal detection and escalation  | Detection only; routes to P1 Psychologist (CON-AIC-03)  |
| IN-07  | AI engine: Knowledge Graph, RAG, Memory, Personalization, Recommendation engine  | Architecture in Part 8  |
| IN-08  | Text chat plus multilingual text-to-speech read-aloud  | English, Arabic, Urdu  |
| IN-09  | Client platforms: responsive web, native iOS, native Android  | Single account model via P1 SSO (DEP-AIC-05)  |
| IN-10  | Teacher oversight dashboard with flagged-interaction queue and sampled transcript review  | >=5% random sample + 100% flagged turns  |
| IN-11  | Parental-consent gate and real-time content-safety filtering for under-18 users  | GDPR-K / COPPA / local (ASM-AIC-05)  |
| IN-12  | Integration contract with P1 (read profile/curriculum/assessments/psychometrics; write recommendations/summaries/flags)  | Scoped OAuth2 (DEP-AIC-01)  |
| IN-13  | RTL rendering for Arabic and Urdu  | Per Part 6.6  |

### 1.3.2 Out of Scope

| **ID**  | **Out-of-Scope Item**  | **Owning Product / Reason**  |
| --- | --- | --- |
| OUT-01  | Authoring or storage of curriculum content and lesson materials  | P1 — LMS/SMS  |
| OUT-02  | Grading of formal/graded assessments and gradebook of record  | P1 — gradebook  |
| OUT-03  | Psychological diagnosis, treatment, or therapy  | P1 — Psychologist module  |
| OUT-04  | Marketing, sales, admissions, and lead lifecycle  | P2 — AI RevOps  |
| OUT-05  | Microsoft Dynamics 365 guidance bots  | P4  |
| OUT-06  | Payment processing and fee collection  | P1 — Fee module  |
| OUT-07  | Sourcing or licensing of the Cambridge-aligned content corpus  | Client responsibility (DEP-AIC-03)  |
| OUT-08  | Parent-facing AI assistant  | P1 scope, not P3  |

### 1.3.3 Deferred — Version 2.0

| **ID**  | **Deferred Item**  | **Reason for Deferral**  |
| --- | --- | --- |
| DEF-01  | Two-way conversational voice (speech-to-text dialogue)  | Cost and architecture; v1.0 ships TTS read-aloud only (ASM-AIC-06)  |
| DEF-02  | Languages beyond English, Arabic, Urdu  | Scoped to confirmed student base at v1.0  |
| DEF-03  | Offline mobile tutoring mode  | Requires on-device model packaging  |
| DEF-04  | Peer-group / collaborative tutoring sessions  | Single-student model at v1.0  |

## 1.4 Success Criteria & KPIs

| **KPI ID**  | **Metric**  | **Target**  | **Measurement Method**  | **Review Freq.**  |
| --- | --- | --- | --- | --- |
| KPI-AIC-01  | Weekly active usage  | >=60% of enrolled students by month 6  | Usage events / active enrolled count (analytics)  | Monthly  |
| KPI-AIC-02  | Academic uplift  | +8 pp mean assessment score vs. baseline  | P1 gradebook delta, matched cohort  | Per term  |
| KPI-AIC-03  | Retention contribution  | +5 pp vs. non-users  | P1 enrollment data  | Per term  |
| KPI-AIC-04  | Wellbeing routing SLA  | >=90% of L1 signals to P1 within 1 hour  | Escalation log timestamps  | Weekly  |
| KPI-AIC-05  | Language-match accuracy  | >=95%  | Sampled QA review of responses  | Monthly  |
| KPI-AIC-06  | Homework integrity  | 0 confirmed AIC-facilitated graded-cheating incidents  | Teacher flag review  | Monthly  |
| KPI-AIC-07  | First-token latency  | p95 <=3 seconds  | APM telemetry  | Continuous  |
| KPI-AIC-08  | Token-cap adherence  | >=95% of students within cap  | Billing/usage telemetry  | Monthly  |
| KPI-AIC-09  | RAG groundedness  | >=95% of responses cite a valid source  | AI evaluation harness (Part 15.6)  | Weekly  |
| KPI-AIC-10  | Hallucination rate  | <=2% on evaluation set  | AI evaluation harness (Part 15.6)  | Weekly  |

## 1.5 Business Drivers

| **ID**  | **Category**  | **Driver**  |
| --- | --- | --- |
| DRV-AIC-01  | Strategic  | Client Strategic Goal 4 requires a private AI tutor for every student; human staffing cannot meet this at 100,000+ scale.  |
| DRV-AIC-02  | Operational  | Teaching capacity is fixed; per-student individualized instruction at scale requires automated delivery.  |
| DRV-AIC-03  | Competitive  | The Cambridge online-school segment positions AI-personalized learning as a purchase criterion.  |
| DRV-AIC-04  | Compliance  | Cambridge and Cognia accreditation require evidence of personalized learning support and timely intervention.  |

## 1.6 Expected ROI & Value

Value levers are modeled as formulas with named variables; resolved monetary figures are computed in Part 13 from confirmed tuition, cost, and enrollment inputs.

| **Value Lever**  | **Mechanism**  | **Quantified Model**  | **Basis / Cross-Reference**  |
| --- | --- | --- | --- |
| Tutoring labor avoidance  | AI tutor replaces supplemental human tutoring hours  | Saving = H_avoided x R_tutor x N_students  | H = tutor-hours/student/term; R = hourly rate; Part 13.4  |
| Retention revenue  | Coach users retain at a higher rate (OBJ-AIC-03)  | Value = 0.05 x N_enrolled x T_annual  | T = annual tuition; Part 13.3  |
| Outcome-driven growth  | Higher academic results drive referrals/enrollment  | Value = dEnroll x T_annual  | dEnroll modeled in Part 13.3 against KPI-AIC-02  |
| Earlier intervention  | Reduced churn from at-risk students (OBJ-AIC-05)  | Value = R_recovered x N_at_risk x T_annual  | R = recovery rate; Part 13.4  |
| Inference cost ceiling  | Token cap bounds operating cost per student  | Cost <= 2,000,000 tokens x C_token  | C = blended token cost; Part 13.4  |

## 1.7 Assumptions

| **ID**  | **Assumption**  | **Owner**  | **Sign-off**  | **If False — Impact**  |
| --- | --- | --- | --- | --- |
| ASM-AIC-01  | P1 is live and exposes stable APIs (profile, curriculum, gradebook, psychometrics, attendance) before P3 integration build  | P1 Team  | Part 14 gate  | P3 integration blocked; schedule slip  |
| ASM-AIC-02  | Client confirms anti-cheating thresholds (G2); default Guided mode at >=0.85 similarity applies until then  | Client  | 03 Jul 2026  | Rework of Homework Assistant logic  |
| ASM-AIC-03  | Client + DPO confirm wellbeing escalation wording, regional helplines, and safeguarding lead (G3)  | Client / DPO  | 03 Jul 2026  | Escalation flow non-compliant; cannot launch wellbeing  |
| ASM-AIC-04  | Client supplies/licenses Cambridge-aligned RAG corpus and grants indexing rights (G6); until then RAG indexes P1 materials only  | Client  | 10 Jul 2026  | Reduced subject coverage at launch  |
| ASM-AIC-05  | DPO confirms consent mechanism and applicable child-data regimes (G7)  | DPO  | 03 Jul 2026  | Cannot activate under-18 accounts  |
| ASM-AIC-06  | Two-way voice deferred to v2.0 unless client funds in v1.0 (G5)  | Client  | 03 Jul 2026  | Scope and budget change request  |
| ASM-AIC-07  | Every P1 student record carries a set language and date of birth  | P1 Team  | Part 14 gate  | Language routing and age gating fail  |
| ASM-AIC-08  | LLM provider APIs remain commercially available at projected pricing tiers  | Consultant  | Continuous  | Cost and routing re-plan (Part 16 AI risk)  |

## 1.8 Constraints

| **ID**  | **Constraint**  | **Source**  |
| --- | --- | --- |
| CON-AIC-01  | Inference limited to 2,000,000 tokens per student per month, then throttled to Tier B/C models  | G1 resolution  |
| CON-AIC-02  | P3 must not write to P1 graded records; writes limited to recommendations, summaries, and flags  | G4 resolution  |
| CON-AIC-03  | P3 must not produce psychological diagnosis or therapeutic treatment  | G3 resolution  |
| CON-AIC-04  | Interaction data region-pinned per tenant; 24-month retention then anonymized  | G8 resolution  |
| CON-AIC-05  | Tutoring languages limited to English, Arabic, Urdu at v1.0  | Scope IN-08 / DEF-02  |
| CON-AIC-06  | RTL rendering mandatory for Arabic and Urdu  | Client language requirement  |
| CON-AIC-07  | Supported clients limited to web, iOS, Android  | Scope IN-09  |
| CON-AIC-08  | Under-18 activation blocked without a recorded parental consent  | G7 resolution  |
| CON-AIC-09  | All graded-context tutoring turns logged and visible to the teacher  | G2 / G9 resolution  |

## 1.9 Dependencies

| **ID**  | **Dependency**  | **Type**  | **Owner**  |
| --- | --- | --- | --- |
| DEP-AIC-01  | P1 LMS/SMS API stability: profile, enrollment, curriculum map, gradebook, psychometrics, attendance  | Hard  | P1 Team  |
| DEP-AIC-02  | P1 Psychologist module escalation endpoint for wellbeing routing  | Hard  | P1 Team  |
| DEP-AIC-03  | Cambridge-aligned content license and indexing rights on uploaded materials  | Hard  | Client  |
| DEP-AIC-04  | Model-gateway and LLM provider accounts/keys (OpenAI, Anthropic, Gemini, self-hosted)  | Hard  | Consultant / Client  |
| DEP-AIC-05  | Student identity and SSO from P1  | Hard  | P1 Team  |
| DEP-AIC-06  | Cloud platform selection (Part 8) for RAG store and vector database hosting  | Hard  | Consultant  |
| DEP-AIC-07  | Content-safety classifier (built or third-party) for input/output filtering  | Hard  | Consultant  |

## 1.10 Definitions & Acronyms

| **Term**  | **Definition**  |
| --- | --- |
| AIC  | AI Student Coach — product P3  |
| P1 / P2 / P3 / P4  | Project products: LMS+SMS / AI RevOps / AI Student Coach / Dynamics 365 Guidance Bots  |
| LMS / SMS  | Learning Management System / School Management System (product P1)  |
| LLM  | Large Language Model  |
| RAG  | Retrieval-Augmented Generation — model responses grounded on retrieved source documents  |
| Knowledge Graph  | Linked data model connecting Student, Course, Learning Objectives, Assessments, Tutor, and Recommendations  |
| Student Learning Profile  | Per-student record of academic history, learning style, assessment results, and interaction history  |
| Guided mode  | Homework Assistant behavior that gives hints and altered worked examples, never the exact graded answer  |
| Full-solution mode  | Homework Assistant behavior, for non-graded practice, that may give complete worked solutions  |
| TTS / STT  | Text-to-Speech / Speech-to-Text  |
| Psychometrics  | Personality, aptitude, IQ, EQ, and career assessment data produced in P1  |
| RTL  | Right-to-Left text rendering (Arabic, Urdu)  |
| GDPR-K  | Child-specific provisions of the EU General Data Protection Regulation  |
| COPPA  | US Children's Online Privacy Protection Act  |
| DPO  | Data Protection Officer  |
| WAU  | Weekly Active Users  |
| SLA  | Service Level Agreement  |
| pp  | Percentage points  |
| p95 / p99  | 95th / 99th percentile of a measured distribution  |
| OER  | Open Educational Resources  |
| Cambridge / Cognia  | Curriculum framework / accreditation body the school operates under  |
| Tier A / B / C  | Model-gateway routing tiers: reasoning / synthesis / classification  |