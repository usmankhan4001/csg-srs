# PART 13 — BUDGET PLAN
## Product: P2 — AI Marketing & Sales RevOps Engine
### Layer 5 — Project & Financial | Audience: PMO, Finance, Client

*Hourly rates: Solution Architect $120/hr, Backend Lead/Engineer $80/hr (blended), AI/ML Engineer $110/hr, Frontend Lead/Engineer $75/hr (blended), UI/UX Designer $70/hr, DevOps Engineer $95/hr, QA Engineer $65/hr, Project Manager $90/hr, Compliance Advisor $150/hr.*

---

## 13.1 Cost per Module

| Module | Backend ($80/hr) | Frontend ($75/hr) | AI/ML ($110/hr) | QA ($65/hr) | Design ($70/hr) | Total |
|---|---|---|---|---|---|---|
| 1 — Lead Intake | $4,800 | $1,500 | $1,100 | $1,300 | $560 | $9,260 |
| 2 — Qualification Agent | $4,000 | $1,125 | $6,600 | $1,625 | $350 | $13,700 |
| 3 — Voice & Chat Engagement | $6,400 | $2,250 | $7,700 | $2,275 | $1,050 | $19,675 |
| 4 — Research Agent | $4,000 | $1,500 | $6,600 | $1,300 | $560 | $13,960 |
| 5 — Marketing Agent | $4,000 | $1,875 | $5,500 | $1,300 | $700 | $13,375 |
| 6 — Copywriting Agent | $3,200 | $1,500 | $5,500 | $1,170 | $560 | $11,930 |
| 7 — Deal-Closing Agent | $4,800 | $1,500 | $2,200 | $1,625 | $560 | $10,685 |
| 8 — CRM / Pipeline Management | $7,200 | $3,000 | $550 | $1,950 | $840 | $13,540 |
| 9 — Escalation & Human Handoff | $4,800 | $1,875 | $1,650 | $1,625 | $560 | $10,510 |
| 10 — Conversation Memory | $5,600 | $750 | $4,400 | $1,300 | $280 | $12,330 |
| 11 — Admin Configuration | $4,800 | $2,625 | $550 | $1,625 | $840 | $10,440 |
| 12 — Analytics & Reporting | $4,000 | $3,375 | $550 | $1,625 | $1,050 | $10,600 |
| 13 — Integration & Sync | $5,600 | $1,125 | $0 | $1,625 | $280 | $8,630 |
| 14 — Consent & Compliance | $4,000 | $1,875 | $550 | $1,625 | $560 | $8,610 |
| 15 — Knowledge Base | $4,800 | $1,875 | $5,500 | $1,430 | $560 | $14,165 |
| 16 — Notification & Alerting | $3,200 | $1,500 | $0 | $1,170 | $420 | $6,290 |
| 17 — Language & Localization | $4,000 | $1,500 | $1,650 | $1,300 | $420 | $8,870 |
| **Module Subtotal** | **$79,200** | **$30,750** | **$50,600** | **$25,870** | **$10,150** | **$196,570** |

## 13.2 Cost per Phase

| Phase | Modules Included | Total Cost | Duration |
|---|---|---|---|
| Phase 1 — Foundation & Architecture | 1, 8, 11, 13 + Architecture ($14,400) + DevOps ($9,500) | $65,770 | 6 weeks |
| Phase 2 — Core Agent Pipeline | 2, 3, 9, 10 | $56,215 | 8 weeks |
| Phase 3 — Content & Marketing Agents | 4, 5, 6, 15 | $53,430 | 6 weeks |
| Phase 4 — Deal Closing & Compliance | 7, 14 + Compliance Advisory ($3,000) | $22,295 | 4 weeks |
| Phase 5 — Analytics, Alerts & Localization | 12, 16, 17 | $25,760 | 4 weeks |
| Phase 6 — Testing, UAT, Launch | Covered under module QA costs | Included above | 4 weeks |

*Project Management ($13,500) runs continuously across all phases and is shown once in Section 13.3 rather than allocated per phase.*

## 13.3 Total Project Budget

| Category | Cost |
|---|---|
| Development (Backend $79,200 + Frontend $30,750 + AI/ML $50,600 + Architecture $14,400) | $174,950 |
| Design | $10,150 |
| Infrastructure (DevOps labor $9,500 + dev/QA/UAT environment cloud costs $5,000) | $14,500 |
| Testing (QA) | $25,870 |
| PM & Governance (PM $13,500 + Compliance Advisory $3,000) | $16,500 |
| **Subtotal** | **$241,970** |
| Contingency (15%, Section 13.6) | $36,300 |
| **Total Project Budget** | **$278,270** |

## 13.4 Operational Costs (Post-Launch, Monthly)

| Cost Item | Estimate | Notes |
|---|---|---|
| GPU instance (self-hosted LLM tier) | $300–$400 | Part 1, Constraint 1 |
| Commercial LLM API (overflow tier) | $200 | OpenAI/Anthropic/Gemini, complex reasoning only |
| Telnyx SIP usage | $50–$100 | Pay-per-minute, varies with call volume |
| **AI + Voice subtotal** | **$550–$700** | **Held under the locked $1,000/month ceiling, with headroom** |
| General cloud infrastructure (PostgreSQL, Redis, Kubernetes, object storage, load balancer) | $400–$500 | Separate from the AI/voice ceiling |
| SMS gateway (Critical alerts) | $20 | Module 16 |
| Monitoring (Prometheus/Grafana, self-hosted) | $0–$50 | |
| **Total operational cost** | **$970–$1,270/month** | |

## 13.5 License & Infrastructure Costs

| Item | License/Cost |
|---|---|
| Jambonz | Open source, $0 |
| LangGraph | Open source, $0 |
| PostgreSQL, Redis | Open source, $0 (managed-service fees counted in 13.4) |
| React, FastAPI, SQLAlchemy | Open source, $0 |
| Figma (design tool) | ~$15/seat/month |
| Source control / CI/CD (GitHub/GitLab team plan) | ~$20–$40/month |
| Monitoring (Grafana Cloud free tier, or self-hosted) | $0–$50/month |

## 13.6 Contingency

**15% applied to the development subtotal ($36,300).**

Justification:
1. AI/LLM project with an evolving model pricing and capability landscape — provider pricing changes are outside this project's control.
2. Multi-language (including RTL) and voice integration (Jambonz/Telnyx) carry integration-risk uncertainty not fully resolvable until implementation.
3. The vertical-agnostic CRM (Module 8) is a first-of-its-kind build for this team — some design rework risk during early modules is expected.

15% sits within the typical 10–20% range for a medium-risk software project.

---

**Layer 5 Gate Check, Part 13:** ✅ All modules costed. ✅ Operational costs and contingency included. ✅ Cost-per-phase and cost-per-module reconcile to the same totals.

*P2 Master SRS — Part 13 of 17 + Appendices.*
