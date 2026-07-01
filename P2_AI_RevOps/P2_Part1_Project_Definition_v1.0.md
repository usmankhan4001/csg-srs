# PART 1 — PROJECT DEFINITION
## Product: P2 — AI Marketing & Sales RevOps Engine
### Layer 1 — Business & Strategy | Audience: CEO, Board, Client, Investors

---

## 1.1 Product Vision

The system shall automate market research, campaign creation, and multilingual sales engagement for any defined product or service line, without dependency on a specific vertical, business, or deployed instance of any other Lighthouse system. The system shall qualify, engage, and convert leads through coordinated AI agents operating across chat and voice channels, escalating to human staff only per defined rules.

This product is vertical-agnostic by design. It is not a school-admissions tool; school is not referenced as a use case anywhere in this specification.

## 1.2 Strategic Objectives

1. The system shall reduce sales/marketing staffing requirement by 70% relative to a defined manual-process baseline, for any product line it is configured to support.
2. The system shall qualify 100% of inbound leads within 5 minutes of first contact, 24/7, in English, Arabic, and Urdu.
3. The system shall generate a market research report and marketing plan for any new target product, market, or geography within 48 hours of request, without manual analyst input.
4. The system shall maintain a single CRM record per lead/customer, with a configurable pipeline structure independent of any specific industry's terminology.
5. The system shall achieve a Lead-to-Conversion rate of 8% (months 1–3) → 12% (months 4–6) → 15% (month 12+), against whichever product/service line it is deployed for.

## 1.3 Scope Statement

### IN SCOPE — Version 1.0

| Item | Detail |
|---|---|
| Research Agent | Market/competitor/pricing research for any configured product or service |
| Marketing Agent | Campaign, funnel, landing page, email sequence generation |
| Copywriting Agent | Ad copy, social content, email copy in EN/AR/UR |
| Lead Qualification Agent | Chat-based intake, scoring, routing — product-agnostic intake logic |
| Voice Agent | Outbound/inbound multilingual voice calls (EN/AR/UR) |
| Deal-Closing Agent | Payment link delivery, meeting booking, handoff to fulfillment system |
| Lead Intake | Multi-channel: web forms, paid ad landing pages, WhatsApp Business API, referral links, inbound email parsing |
| CRM | Configurable pipeline: Lead → Qualified → Interested → Engaged → Submitted → Converted (stage labels configurable per deployment) |
| Conversation Memory | Customer profile, interaction history, stated preferences — generic entity model, not tied to any one vertical's data fields |
| LLM routing layer | Hybrid: self-hosted open models (high-volume tasks) + commercial APIs (OpenAI/Anthropic/Gemini, complex reasoning) |
| Voice infrastructure | Jambonz (open-source, self-hosted orchestration) + Telnyx SIP trunk + self-hosted STT/TTS |
| Human escalation | Per AI-BR-001–005 (confidence threshold, high-value flag, sentiment, explicit complaint, no autonomous final close) |

### OUT OF SCOPE — Version 1.0

| Item | Reason |
|---|---|
| Outbound cold-calling to non-inquiring contacts | Compliance risk pending legal review per jurisdiction |
| Autonomous final deal-closing above a configurable threshold without human review | Liability — AI-BR-005 |
| Paid media buying/spend automation | Requires separate budget authority, ad account access |
| Hard-coded business rules specific to any single vertical (education, retail, etc.) | Would break reusability — all vertical-specific logic must be configuration, not code |

### DEFERRED — Version 2.0

| Item | Reason |
|---|---|
| Predictive churn/retention modeling | Requires 12+ months of production data across deployed verticals |
| Autonomous ad-spend optimization | Requires v1.0 attribution data first |
| Multi-tenant marketplace of pre-built vertical templates | Requires v1.0 proven on first deployment before generalizing further |

## 1.4 Success Criteria & KPIs

| KPI | Target Value | Measurement Method | Review Frequency |
|---|---|---|---|
| Lead response time | < 5 minutes, 24/7 | Timestamp: lead created → first agent contact | Weekly |
| Lead Conversion Rate (Lead → Converted) | 8% (M1–3) → 12% (M4–6) → 15% (M12+) | CRM funnel stage tracking | Monthly |
| Staffing reduction | 70% vs. current baseline | Headcount comparison, baseline confirmed at discovery | Quarterly |
| Voice agent call completion rate | ≥ 90% calls completed without failure/drop | Call log analysis | Weekly |
| Multilingual accuracy (intent recognition) | ≥ 95% correct intent classification per language | Sampled QA, 50 calls/chats per language/month | Monthly |
| AI API + voice cost | < $1,000/month at launch scale | Provider billing dashboards, monthly reconciliation | Monthly |
| Human escalation rate | Tracked, no fixed ceiling — governed by AI-BR-001–004 | Escalation event count ÷ total conversations | Weekly |

## 1.5 Business Drivers

1. Manual sales/marketing processes cannot provide 24/7, multilingual coverage at scale.
2. Market entry into a new product, market, or geography currently requires manual research with no standardized output format.
3. Inbound inquiries arrive in multiple languages, exceeding typical staff language coverage.

## 1.6 Expected ROI & Value

| Value Driver | Quantified Impact |
|---|---|
| Staffing cost reduction | 70% reduction in sales/marketing FTE requirement (locked target) |
| 24/7 lead coverage | Eliminates lead loss during non-business hours — baseline currently unmeasured; **[TBD — Client: confirm current after-hours lead volume]** |
| Faster market entry | Research-to-plan cycle reduced to 48 hours from manual baseline **[TBD — Client: confirm current manual research duration]** |

## 1.7 Assumptions

1. A host CRM/data model (e.g., from a connected system such as P1) is not required for P2 to function — P2 owns its own CRM.
2. Where P2 is deployed alongside another system, an API sync contract will be defined before integration testing (see Section 1.9).
3. Voice telephony (Jambonz + Telnyx) will support outbound/inbound calling in English, Arabic, and Urdu with acceptable speech quality.
4. The client holds or will obtain legal consent mechanisms required for AI voice calls in each deployed jurisdiction.
5. LLM provider API access (OpenAI, Anthropic, Gemini) will be provisioned with sufficient quota before integration testing.

## 1.8 Constraints

1. AI API + voice monthly spend is constrained to < $1,000 at launch scale, achieved through a hybrid model architecture: self-hosted open-weight models (single GPU instance, RTX 4090 or spot A100) for high-volume routine tasks, commercial LLM APIs reserved for complex reasoning tasks.
2. Voice and chat agents operate only in English, Arabic, Urdu at v1.0.
3. P2's CRM data model is vertical-agnostic (generic entities: Lead, Account, Contact, Deal, Stage — not tied to any single industry's terminology).
4. The AI agent shall not autonomously finalize a deal or alter pricing (AI-BR-005).

## 1.9 Dependencies

1. P2's CRM database (generic entity model) must be designed and provisioned independently of any host system's schema before any sync integration is built.
2. A defined sync contract (which fields, which direction, conflict-resolution rule) must exist before any P2-to-host-system integration testing begins.
3. Telephony provider account and number provisioning (per jurisdiction) must be completed before Voice Agent integration testing.
4. LLM provider contracts/API keys must be active before Research, Marketing, Copywriting, and Voice agents can be load-tested.

## 1.10 Definitions & Acronyms

| Term | Definition |
|---|---|
| RevOps | Revenue Operations |
| LLM | Large Language Model |
| RAG | Retrieval-Augmented Generation |
| STT | Speech-to-Text |
| TTS | Text-to-Speech |
| CRM | Customer Relationship Management |
| TCPA | Telephone Consumer Protection Act (referenced for telemarketing compliance scoping) |
| FTE | Full-Time Equivalent |
| SIP | Session Initiation Protocol (telephony signaling) |

## Business Rules Defined in This Part

1. **AI-BR-001**: The system shall escalate to a human agent when intent-classification confidence score is < 70% for two consecutive conversation turns.
2. **AI-BR-002**: The system shall escalate to a human agent when a lead is flagged "high-value" per a configurable threshold parameter, set independently for each product/deployment by an authorized admin user. No fixed dollar value is hardcoded in the specification.
3. **AI-BR-003**: The system shall escalate to a human agent when negative sentiment is detected in two or more turns within a single conversation session.
4. **AI-BR-004**: The system shall escalate to a human agent on any explicit request involving refund, legal complaint, or formal grievance.
5. **AI-BR-005**: The AI agent shall send payment links and book meetings autonomously; the AI agent shall NOT confirm final enrollment/conversion or modify pricing without a human-approved action, regardless of lead value.
6. **AI-BR-006**: The Research Agent shall accept any target country, city, or region as a configurable input parameter at deployment or per-request time. No market or geography is hardcoded into the system.
7. **AI-BR-007**: The system shall play a recorded-call consent notice at the start of every voice interaction and log consent acknowledgment with a timestamp against the call record.
8. **AI-BR-008**: The system shall delete raw call audio recordings 90 days after call completion unless flagged under legal hold.

---
*P2 Master SRS — Part 1 of 17 + Appendices. See Part 2 for Stakeholders & Users.*
