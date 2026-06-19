# APPENDIX G — OPEN SOURCE PLATFORM EVALUATION REPORT
## P1 — Learning Management System + School Management System
### Full scoring matrix for all platforms evaluated before the custom build decision (DEC-P1-024)

**Status:** ✅ Complete

---

## G.1 Evaluation Methodology

Nine platforms were evaluated across two categories — LMS-focused and SMS/SIS-focused — since real-world deployments typically pair one platform from each category rather than using a single platform for both functions. Each platform was scored against 10 criteria on a 1-5 scale (5 = fully meets requirement, 1 = does not meet requirement). The overall recommendation and DEC-P1-024 are documented in Part 8.1.

**Scoring scale:** 5 = Fully meets requirement with no customisation | 4 = Meets requirement with minor configuration | 3 = Partial — meets 50-75% with moderate customisation | 2 = Significant gaps requiring major custom development | 1 = Does not meet requirement

---

## G.2 LMS-Focused Platform Scoring

| Criterion | Weight | Moodle | Open edX | Canvas LMS |
|---|---|---|---|---|
| Multi-tenant SaaS architecture | 15% | 2 | 3 | 4 |
| Live class integration (Zoom/Meet/Teams) | 10% | 3 | 3 | 4 |
| Cambridge curriculum structure support | 10% | 2 | 2 | 2 |
| Psychological assessment module | 10% | 1 | 1 | 1 |
| Arabic/Urdu RTL support | 10% | 3 | 2 | 2 |
| Mobile apps (iOS + Android) | 10% | 2 | 3 | 4 |
| AI quiz generation capability | 10% | 1 | 2 | 1 |
| Fee management + local payment gateways | 10% | 2 | 1 | 2 |
| Cognia evidence management | 10% | 1 | 1 | 1 |
| Long-term community + commercial support | 5% | 5 | 4 | 4 |
| **Weighted Total (/5)** | | **2.05** | **2.05** | **2.45** |
| **Licence** | | Open source (GPL) | Open source (AGPL) | Commercial SaaS |
| **Hosting** | | Self-hosted | Self-hosted / SaaS | SaaS only |
| **Estimated customisation to meet P1 scope** | | Very high — most differentiating features require new plugins or forks | Very high — academic-only focus; SMS features absent | High — LMS features strong but SMS, psychologist portal, and local payment gateways not available |

**LMS category verdict:** None of the three reaches a weighted score above 2.5 for the combined P1 scope. All three are strong in their native domain (Moodle: community/plugins; Open edX: video-first content delivery; Canvas: UX polish) but require substantial custom development for the SMS, psychological assessment, multi-currency local payments, and Cognia evidence features. The customisation cost approaches the custom build cost while introducing licence constraints and upgrade risk.

---

## G.3 SMS/SIS-Focused Platform Scoring

| Criterion | Weight | Frappe/ERPNext | Fedena | OpenSIS | Gibbon | RosarioSIS |
|---|---|---|---|---|---|---|
| Multi-tenant SaaS architecture | 15% | 3 | 2 | 2 | 1 | 2 |
| Fee management + local payment gateways | 12% | 4 | 3 | 3 | 2 | 3 |
| Arabic/Urdu RTL support | 12% | 3 | 2 | 2 | 2 | 4 |
| Cambridge curriculum structure support | 10% | 2 | 2 | 2 | 2 | 2 |
| HR and payroll module | 10% | 5 | 3 | 2 | 2 | 2 |
| Admissions workflow | 10% | 3 | 4 | 4 | 3 | 3 |
| Timetable/scheduling module | 8% | 3 | 4 | 3 | 4 | 3 |
| Mobile app (iOS + Android) | 8% | 2 | 2 | 1 | 1 | 1 |
| Cognia evidence management | 8% | 1 | 1 | 1 | 1 | 1 |
| Long-term community + commercial support | 7% | 4 | 3 | 3 | 3 | 3 |
| **Weighted Total (/5)** | | **2.96** | **2.54** | **2.27** | **1.99** | **2.52** |
| **Licence** | | Open source (LGPL/MIT) | Open source (GPL) / commercial | Open source (GPL) / commercial | Open source (GPL) | Open source (GPL) |
| **Notable strength** | | Full ERP with accounting, HR, payroll built-in | Mature school admin workflows | Straightforward SIS core | Only platform with native virtual classroom | Only platform with confirmed RTL Arabic/Persian support |
| **Critical gap** | | Multi-tenancy requires significant architecture work; no psychological assessment or Cognia features | No psychological assessment; weak mobile; no Cognia | Minimal LMS capability; weak mobile; no Cognia | No mobile apps; no fee-to-accounting integration; no Cognia | No mobile; no psychological assessment; no Cognia |

**SMS category verdict:** Frappe/ERPNext is the strongest SMS-focused option (2.96/5) due to its built-in accounting, HR, and payroll. However, converting it to a multi-tenant SaaS platform is a non-trivial architectural undertaking, and it still requires complete new development for the psychological assessment portal, Cognia evidence management, and AI quiz service — the three most differentiating features of this system.

---

## G.4 Combined Assessment: LMS + SMS Pairing

The best realistic pairing of available platforms would be **Open edX (LMS) + Frappe/ERPNext (SMS)** — a combined weighted average of approximately 2.5/5. This pairing would require:

| Gap Requiring Custom Development | Estimated Complexity |
|---|---|
| Integration layer between Open edX and Frappe/ERPNext (single SSO, unified student record) | High |
| Psychological assessment portal (M14) — absent from both platforms | Very High |
| Cognia evidence management (M16) — absent from both platforms | Medium |
| AI quiz service integration | Medium |
| Multi-tenant isolation across both platforms simultaneously | Very High |
| JazzCash/Easypaisa payment gateway for Frappe | Medium |
| RTL support in Open edX | Medium |
| Cambridge curriculum structure in Open edX | Medium |

**Estimated build effort for the gap list above:** comparable to building the custom microservices system from scratch, with the additional constraint of working within both platforms' architecture boundaries, GPL/AGPL licence obligations on modifications, and dependency on both platforms' release cycles for future maintenance.

---

## G.5 Final Recommendation

**Decision: Custom microservices build (DEC-P1-024)**

The custom build is recommended over any platform combination because:

1. The combined weighted score of the best available pairing (2.5/5) means half the P1 scope requires custom development regardless — the platform saves little build effort while adding licence constraints and two-platform integration complexity.
2. The three most differentiating features of this system (Psychological Assessment Portal, Cognia Evidence Management, AI Quiz Service) do not exist in any evaluated platform and must be built from scratch in either approach.
3. The multi-tenant SaaS architecture required for Lighthouse's growth model (100,000+ students, unlimited schools) is achievable in all three evaluated LMS platforms and Frappe only with significant architectural customisation — not materially less work than building it natively.
4. A custom build on the confirmed stack (NestJS/React/React Native, Part 9.1/9.2) produces a codebase fully owned by Lighthouse with no GPL/AGPL licence obligations, no dependency on external platform release cycles, and no architectural constraints inherited from a platform designed for a different use case.

---

*Lighthouse Global School System — P1 Master SRS — Appendix G — Internal — v1.0*
