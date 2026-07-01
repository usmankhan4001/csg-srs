# MASTER SRS — P3 AI STUDENT COACH
## Part 9 — Technical Specifications
### 9.6 Security Specifications (closes Part 9)

*Layer 4 — Technical & Architecture*

| Field | Value |
|---|---|
| Product | P3 — AI Student Coach |
| Identifier range (this document) | AIC-TR-225 → AIC-TR-234 |
| Scope note | Expands Section 8.8's architecture into per-control implementation and testing detail. Each row maps to a control already justified in 8.8; this section adds *how it's built* and *how it's verified*. |

---

## 9.6.1  Data Protection Controls

| Control | Standard | Implementation | Testing Method |
|---|---|---|---|
| Transport encryption | TLS 1.3 | Enforced at API Gateway/Front Door and on every zone-to-zone hop (8.8.2) | Automated TLS configuration scan in CI/CD; reject any deploy negotiating below TLS 1.3 or with a weak cipher suite |
| At-rest encryption | AES-256 | Cloud-managed disk/blob/database volume encryption (Azure-managed keys, escalating to customer-managed keys in Key Vault for the highest-sensitivity volumes) | Cloud provider compliance attestation review; quarterly configuration audit confirming encryption remains enabled on every volume |
| Field-level encryption | AES-256, application-layer | Column-level encryption for Wellbeing confidential fields, Psychometric mirror, and Consent Records (AIC-TR-094) | Automated test that queries the raw database directly (bypassing the application layer) and asserts the field value is ciphertext, not plaintext |
| Backup encryption & access | Same as production | Backups inherit volume encryption; backup access requires the same RBAC role as production data (AIC-TR-096) | Quarterly backup-access permission audit; annual restore test in an isolated environment to confirm backups are both secure and usable |
| PII minimization in LLM calls | Minimum necessary data | Scoped prompt assembly (AIC-TR-049/021) | Automated test asserting outbound LLM payloads never contain full profile objects, raw psychometric scores, or unredacted PII fields |

## 9.6.2  Access Control

| Control | Standard | Implementation | Testing Method |
|---|---|---|---|
| Authentication delegation | OIDC/OAuth2 | No local password store; all auth delegates to P1 (AIC-TR-085) | Auth-flow penetration test; token-validation fuzzing at the Gateway |
| MFA enforcement | Mandatory for high-sensitivity roles | TOTP/SMS-based MFA via P1's IdP for Super Admin, School Admin, Psychologist (AIC-TR-086) | QA-environment test attempting login without completing MFA; confirm hard block, not a bypassable warning |
| RBAC | Role-permission matrix | Enforced at Gateway + service layer + DB row-level security (Part 2.4 + module tables) | Automated permission-matrix test suite — one test per matrix cell, asserting both allowed and denied outcomes; manual penetration test for privilege-escalation attempts |
| Tenant isolation | Row-level, mandatory | `tenant_id` row-level security on every table (AIC-TR-053) | Mandatory cross-tenant access-attempt test suite (AIC-TR-103) — every entity from Part 9.3 tested for cross-tenant leakage |
| Session management | Short-lived, role-scoped | Service JWTs expire within minutes (AIC-TR-088); Admin console TTL shorter than Student/Parent (AIC-TR-089) | Token expiry/replay test; session-fixation test |
| Management Zone access | IP allowlist + MFA + standard auth (3 layers) | Admin & Configuration endpoints gated per 8.8.2/AIC-TR-091 | Penetration test specifically targeting the Management Zone path, attempting to bypass any one of the three layers independently |

## 9.6.3  AI-Specific Security Controls

| Control | Standard | Implementation | Testing Method |
|---|---|---|---|
| Prompt-injection resistance | Defense-in-depth (8.7.5) | Data/instruction separation in prompt assembly; deterministic Layer-2 checks independent of model behavior (AIC-TR-073/074) | Adversarial test suite simulating injection via direct chat input, OCR-extracted text, and uploaded corpus content (AIC-TR-076) |
| Content safety filtering | Fail-closed | Consent & Safety Service screens all input/output; `503` from the classifier is treated as `allowed: false` by every caller (AIC-TR-198) | Red-team testing with known harmful-content vectors; classifier-outage simulation confirming no unscreened content reaches a student |
| Integrity deterministic checks | Independent of model instruction-following | Graded-answer match check (Homework), diagnostic-language classifier (Wellbeing), citation-only-from-retrieved-chunks (Tutor) — all run regardless of system-prompt behavior (AIC-TR-073) | Test suite that deliberately instructs the model (via crafted input) to violate each rule, confirming the deterministic layer still blocks the output |
| Cross-tenant AI context isolation | No shared context across tenants | Model Gateway scopes every request's context (profile, retrieval, conversation history) to a single tenant/student; no shared cache or batched-context optimization mixes tenants | Concurrent test issuing Tenant A and Tenant B requests simultaneously, asserting no cross-contamination in either response |
| Model version upgrade gating | Re-evaluation before deploy | Full Part 15.6 evaluation suite required before any provider model-version upgrade reaches production (AIC-TR-080) | Evaluation suite run against the candidate model version in a staging environment before the routing config (8.4.2) is updated |

## 9.6.4  Infrastructure & Operational Security

| Control | Standard | Implementation | Testing Method |
|---|---|---|---|
| Network segmentation | 4-zone model | Public/Application/Data/Management zones with default-deny firewall rules (8.8.2) | Network penetration test attempting direct access to the Data Zone from the public internet; confirm failure at every attempted path |
| Secrets management | No plaintext secrets | All keys retrieved at runtime from Azure Key Vault (AIC-TR-095) | Automated secret-scanning in CI (e.g., pattern-based scanning for committed credentials); Key Vault access-log audit |
| Webhook authentication | Signature verification | SMS/Email/Push delivery-status webhooks verified before processing (AIC-TR-046/201) | Send a deliberately spoofed/unsigned webhook payload in QA; confirm `401` rejection and no delivery-status update applied |
| Audit log integrity | Append-only, immutable | No UPDATE/DELETE grant for any application role on `audit_log` or `homework_turn` (AIC-TR-009/144/149) | Attempt UPDATE/DELETE as the application's own database role in QA; confirm database-level rejection (not merely application-level refusal) |
| Dependency/supply-chain security | Continuous scanning | CI pipeline dependency scanning, lockfiles pinned (AIC-TR-128/135) | Scheduled vulnerability scan (e.g., weekly); SBOM generated per release |
| Rate limiting / availability | Per-identity limiting | Gateway-enforced per-service limits (9.4.17), with Wellbeing/Safety bypass | Load test simulating burst traffic; confirm standard endpoints throttle correctly while the Wellbeing/Safety bypass path remains fully responsive under the same load |
| OWASP Top 10 | Full coverage | Per 8.8.4's mapping | Re-validated as part of the Part 15.5 security test plan before each major release (AIC-TR-097) |
| Penetration testing cadence | Annual minimum, plus pre-major-release | Third-party engagement covering the Management Zone and AI-specific vectors (AIC-TR-101) | External penetration test report reviewed by the consultant and client before each major release sign-off |

## 9.6.5  Incident & Breach Response

| Control | Standard | Implementation | Testing Method |
|---|---|---|---|
| Incident detection | Continuous monitoring | Part 11.5 monitoring stack alerts on anomalous access patterns, repeated auth failures, classifier-outage events | Simulated incident injection (e.g., a controlled burst of failed logins) to confirm alerting fires within the defined threshold |
| Wellbeing/Consent breach acceleration | Accelerated DPO path | Any incident touching these two domains triggers a distinct, faster notification path to the DPO than standard incident handling (AIC-TR-100) | Tabletop exercise specifically simulating a Wellbeing-domain incident, timing the actual notification path against the target |
| Regulatory breach notification | Jurisdiction-specific timeline | Process defined per applicable jurisdiction (GDPR 72-hour where applicable; local standard otherwise) — exact timelines pending DPO/legal confirmation (AIC-TR-104) | Tabletop exercise validating the end-to-end notification workflow meets the confirmed timeline once finalized |
| Post-incident review | Mandatory root-cause documentation | Every confirmed incident produces a documented root cause and remediation, logged to the decision log (Part 17.5 cross-reference) | Review of the post-incident documentation against a defined completeness checklist |

---

## 9.6.6  Cross-Cutting Security Requirements

**AIC-TR-225:** Every control in 9.6.1–9.6.5 shall have its testing method executed at least once before production launch, with results recorded against this section's control list as the acceptance checklist.
**AIC-TR-226:** Controls marked with a database-level enforcement mechanism (audit log immutability, tenant isolation, field-level encryption) shall be tested at the database-permission level directly, not only through the application's API — a control that only the application layer enforces is not equivalent to one the database itself enforces, and this distinction shall be preserved in test design.
**AIC-TR-227:** The AI-specific controls in 9.6.3 shall be re-tested after any model-version upgrade (per AIC-TR-080), any prompt-template change, and any change to the Knowledge Graph & RAG retrieval logic, since all three can alter the behavior these controls are designed to catch.
**AIC-TR-228:** Security testing results for controls touching the Wellbeing & Safety or Consent Records domains shall be reviewed by the DPO specifically, in addition to the standard technical review, before sign-off.
**AIC-TR-229:** This section's control list shall be treated as a living checklist — any new functional requirement added to Part 4 after v1.0 sign-off shall be assessed for whether it introduces a new control needed here, as part of the Part 17 change-request process.
**AIC-TR-230:** Penetration test findings rated Critical or High shall block production launch until remediated and re-tested; Medium/Low findings shall be logged to the Part 16 risk register with a remediation timeline, not silently deferred.
**AIC-TR-231:** The full security specification (9.6) shall be reviewed against the Part 10 NFR security targets (once finalized) to confirm no contradiction between this section's implementation detail and Part 10's stated numeric targets (e.g., session timeout values, encryption standards).
**AIC-TR-232:** Security test automation (where feasible — permission-matrix tests, tenant-isolation tests, webhook signature tests) shall run in the CI/CD pipeline on every deploy, not only during periodic manual review, given how many of these controls are regression-prone as the codebase evolves.
**AIC-TR-233:** Any control in this section found to be untestable as currently implemented (i.e., no practical way to verify it) shall be flagged and either redesigned for testability or explicitly accepted as a documented residual risk in Part 16 — it shall not simply remain marked "Pass" without a real testing method behind it.
**AIC-TR-234:** This Part 9.6 control list and Section 8.8's architecture shall be kept synchronized; a control added here without a corresponding architectural basis in 8.8 (or vice versa) is treated as a documentation defect requiring reconciliation.

---

### Layer 4 gate status — Part 9.6

| Gate item | Minimum Standard | Status |
|---|---|---|
| Security specifications | Per control: standard / implementation / testing method | Pass — 22 controls across 5 categories, all three columns populated |

---

## PART 9 — CLOSE-OUT (All Sub-Sections)

| Section | Title | AIC-TR Range | Count |
|---|---|---|---|
| 9.1 | Frontend Stack | AIC-TR-119–120 (shared with 9.2) | — |
| 9.2 | Backend Stack | AIC-TR-119–138 | 20 |
| 9.3 | Database Design (Batches A–C) | AIC-TR-139–172 | 34 |
| 9.4 | API Specifications (Batches A–C) | AIC-TR-173–210 | 38 |
| 9.5 | Third-Party Integrations | AIC-TR-211–224 | 14 |
| 9.6 | Security Specifications | AIC-TR-225–234 | 10 |
| **Total** | **6 sub-sections** | **AIC-TR-119–234** | **116 technical requirements** |

*Part 9 complete. Combined with Part 8 (AIC-TR-001–118), Layer 4's technical requirement base now stands at 234 (AIC-TR-001–234). Next: Part 10 — Non-Functional Requirements (performance, scalability, availability, disaster recovery, security, usability — all as exact numeric targets, no ranges where a single target is achievable).*
