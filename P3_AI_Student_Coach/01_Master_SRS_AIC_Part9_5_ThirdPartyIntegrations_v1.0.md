# MASTER SRS — P3 AI STUDENT COACH
## Part 9 — Technical Specifications
### 9.5 Third-Party Integrations

*Layer 4 — Technical & Architecture*

| Field | Value |
|---|---|
| Product | P3 — AI Student Coach |
| Identifier range (this document) | AIC-TR-211 → AIC-TR-224 |
| Scope note | Expands the Section 8.5 integration map into full per-integration detail. Cross-references 8.5 rather than restating the data-flow diagram (Rule 5). |

---

## 9.5.1  P1 — LMS/SMS

| Field | Detail |
|---|---|
| Purpose | System-of-record sync: identity, enrollment, curriculum, assessments, psychometrics, attendance (read); recommendations, summaries, flags (write) |
| API type | REST/GraphQL (per P1's own API design, consumed as-is) |
| Auth method | OAuth2 client-credentials grant, scoped token per calling P3 service (AIC-TR-088) |
| Data exchanged | Read: per Section 8.6.1 mirrored domains. Write: recommendation objects, session summaries, escalation case references only (BR-AIC-011) |
| Frequency | Read: on-demand per request with short-TTL caching (8.6.3). Write: per recommendation-generation or escalation event |
| Failure handling | Read failure → serve last-known cached value marked stale (8.6.3); block activation-dependent actions (e.g., DOB-dependent consent gating) rather than guessing. Write failure → cache locally, retry with backoff, never block the student-facing response on a write-back success |

**AIC-TR-211:** A P1 write failure (recommendation/summary/flag) shall never cause the originating student-facing request to fail or delay; the write is queued for retry independently of the response already returned to the student.

---

## 9.5.2  Anthropic API (Tier A — primary)

| Field | Detail |
|---|---|
| Purpose | Primary reasoning model for tutoring, homework hints, career guidance, wellbeing classification support |
| API type | REST (Anthropic Messages API) |
| Auth method | API key (stored in Azure Key Vault, AIC-TR-095), referenced by the Model Gateway's Provider Adapter — never embedded in calling service code |
| Data exchanged | Outbound: scoped prompt (system instructions + retrieved chunks + minimal profile context + conversation turns, per AIC-TR-049/021). Inbound: completion text, token usage metadata |
| Frequency | Per Tier A request (Section 8.1.1) |
| Failure handling | Timeout/error → Failover Manager (8.4.2) routes to GPT-5.4 (documented Tier A failover); failure logged with provider, reason (AIC-TR-034) |

## 9.5.3  OpenAI API (Tier A — failover)

| Field | Detail |
|---|---|
| Purpose | Tier A failover, provider diversity |
| API type | REST (Chat Completions / Responses API) |
| Auth method | API key (Key Vault), Provider Adapter pattern as above |
| Data exchanged | Same scope discipline as 9.5.2 |
| Frequency | Only on Anthropic failover, or per configured routing split if dual-active routing is later enabled (Super Admin config, 8.4.2) |
| Failure handling | If both Tier A providers fail, request returns the standard `PROVIDER_UNAVAILABLE` error (9.4.6) and the relevant module's defined fallback message displays (e.g., Tutor Engine's 4.1.9 error state) |

## 9.5.4  Google Gemini API (Tier B)

| Field | Detail |
|---|---|
| Purpose | Long-context synthesis: revision generation, summaries, corpus-heavy processing |
| API type | REST (Gemini API) |
| Auth method | API key (Key Vault); this is the one integration crossing cloud boundaries (Azure-hosted P3 → Google Cloud), monitored separately per AIC-TR-105 |
| Data exchanged | Scoped prompt context, larger context windows for long-document synthesis |
| Frequency | Per Tier B request (revision/summary generation, Section 8.1.1) |
| Failure handling | Failover to Gemini Flash variant or, if the entire Tier B path is down, degrade to a Tier A model for the specific request with a cost-flag logged (since this is an unplanned cross-tier substitution) |

## 9.5.5  Self-Hosted Model (Tier C)

| Field | Detail |
|---|---|
| Purpose | High-volume classification: language detection, intent classification, safety pre-screening |
| API type | Internal REST call within the private Application Zone (8.8.2) — not a public internet-facing third-party call, included here because it is a distinct inference provider in the routing scheme |
| Auth method | Internal service-to-service JWT (no external API key) |
| Data exchanged | Short text snippets in, classification labels out |
| Frequency | High — every message passes through Tier C classification before Tier A/B routing |
| Failure handling | If the self-hosted model is unavailable, classification-dependent logic (e.g., language detection) falls back to the student's stored `set_language` preference rather than blocking; safety pre-screening failure specifically routes to the fail-closed path (AIC-TR-198), not a degraded-but-permissive mode |

## 9.5.6  OCR Service — Azure AI Vision (Read API)

| Field | Detail |
|---|---|
| Purpose | Homework problem image-to-text extraction |
| API type | REST (Azure AI Vision Read API) |
| Auth method | Managed identity / API key via Azure Key Vault (same-cloud integration, simpler trust boundary than cross-cloud calls) |
| Data exchanged | Outbound: homework image (ephemeral). Inbound: extracted text only |
| Frequency | Per image upload (AIC-FR-037) |
| Failure handling | Extraction failure → 4.2.9's "couldn't read that image" message; image is deleted regardless of success/failure outcome within the AIC-TR-057 window |

## 9.5.7  SMS Provider (Twilio or local Pakistani gateway)

| Field | Detail |
|---|---|
| Purpose | Wellbeing/consent/reminder delivery |
| API type | REST |
| Auth method | API key (Key Vault), held only by the Notification Service (AIC-TR-045) |
| Data exchanged | Outbound: recipient number, rendered message. Inbound: delivery-status webhook |
| Frequency | Per triggered notification event |
| Failure handling | Delivery failure → retry per BullMQ backoff policy (9.2.2); for Wellbeing-path notifications specifically, failure triggers the backup-recipient mechanism (BR-AIC-W-05) rather than a simple retry-and-wait, given the time-criticality |

**AIC-TR-212:** The choice between Twilio and a local Pakistani SMS gateway shall be finalized based on delivery reliability testing within Pakistan specifically, since international SMS gateways can have inconsistent deliverability to local carriers — this is a pre-launch validation item, not assumed from provider marketing claims.

## 9.5.8  Email Provider (Azure Communication Services)

| Field | Detail |
|---|---|
| Purpose | Reports, summaries, consent requests |
| API type | REST |
| Auth method | Managed identity (same-cloud integration) |
| Data exchanged | Outbound: recipient address, rendered message. Inbound: delivery/bounce webhook |
| Frequency | Per triggered notification event (weekly digests are the highest-volume case) |
| Failure handling | Bounce → flag the recipient address for review (e.g., guardian contact may be outdated in P1, surfaced to School Admin); retry transient failures |

## 9.5.9  Push Provider (FCM + APNs)

| Field | Detail |
|---|---|
| Purpose | In-app/mobile alerts |
| API type | REST (FCM HTTP v1 API, APNs HTTP/2 API) |
| Auth method | Service account / certificate-based auth (Key Vault-stored) |
| Data exchanged | Outbound: device token, payload. Inbound: delivery receipt (best-effort; push delivery confirmation is inherently less reliable than SMS/email) |
| Frequency | Per triggered in-app event |
| Failure handling | Push delivery is treated as best-effort only; any safety-critical notification (Wellbeing L2/L3) never relies on push alone — it is always paired with a more reliable channel (SMS/email) per the recipient's configured channel preference |

**AIC-TR-213:** Push notification shall never be the sole delivery channel for a Wellbeing L2/L3 escalation recipient alert; at least one of SMS or email shall be configured as a parallel or fallback channel for every Psychologist/School Admin/Safeguarding Lead recipient.

## 9.5.10  Cambridge/Cognia Evidence Export

| Field | Detail |
|---|---|
| Purpose | Accreditation evidence (RPT-AIC-06) |
| API type | None — generated export artifact (PDF/CSV bundle), not a live API integration at v1.0 (AIC-TR-047/023) |
| Auth method | N/A (artifact retrieved by authenticated School Admin via the standard API Gateway auth) |
| Data exchanged | Session summaries, recommendations, intervention records — export only, no inbound data from the accreditation body |
| Frequency | Per term or on demand |
| Failure handling | Generation failure → standard retry; this integration carries no real-time dependency, so failure has no time-critical impact |

## 9.5.11  Career/University Dataset (planned, inactive — Gap G11)

| Field | Detail |
|---|---|
| Purpose | Sourced career/salary/entry-requirement data |
| API type | TBD — pending vendor/license selection |
| Auth method | TBD |
| Data exchanged | TBD — qualitative-only output until licensed (BR-AIC-C-03/AIC-TR-048) |
| Frequency | Inactive — no calls made until Gap G11 resolves |
| Failure handling | N/A while inactive; once activated, failure handling shall follow the same pattern as other read-only data integrations (cache last-known, degrade to qualitative-only on failure) |

---

## 9.5.12  Cross-Integration Requirements

**AIC-TR-214:** Every integration in this section shall have a documented timeout value (specific milliseconds/seconds finalized in Part 11 configuration) and a maximum retry count, to prevent an unresponsive third party from holding a request thread indefinitely.
**AIC-TR-215:** All outbound third-party calls shall log the provider, endpoint, latency, and outcome (success/failure/timeout) to the Part 11.5 monitoring stack, regardless of which language track (9.2.1/9.2.2) the calling service uses.
**AIC-TR-216:** No third-party integration credential shall be shared across more than one logical purpose (e.g., the SMS provider key used for notifications shall not also be reused for any unrelated future SMS use case) — each integration's credential is scoped to its documented purpose only.
**AIC-TR-217:** Cross-cloud integrations (Gemini API specifically, per AIC-TR-105) shall have their egress cost and latency reviewed quarterly against the same metrics for same-cloud integrations, to catch any drift in the original Section 8.1 cost/latency assumptions.
**AIC-TR-218:** A new third-party integration proposed after v1.0 (per AIC-TR-052) shall be documented in this section's format (purpose/API type/auth/data/frequency/failure handling) before implementation, not retrofitted into documentation after the fact.
**AIC-TR-219:** Every integration's failure-handling behavior described in this section shall have a corresponding automated test in the Part 15 test plan (simulated timeout, simulated auth failure, simulated malformed response), not validated only through manual testing.
**AIC-TR-220:** The Failover Manager's logged failover events (AIC-TR-034) shall be reviewed on a defined cadence (Part 11.5) to detect a provider degrading gradually rather than failing outright, since gradual degradation may not trip a hard failover threshold while still harming user experience.
**AIC-TR-221:** Provider Terms of Service for each LLM integration (9.5.2–9.5.4) shall be reviewed for data-training-use clauses before contractual sign-off, confirming the enterprise/business tier (not the free/consumer tier) is used for every provider, consistent with the no-training-on-customer-data requirement noted in Section 8.1.1.
**AIC-TR-222:** The OCR integration (9.5.6) shall not be substituted with a different provider without re-validating Urdu/Arabic handwriting and print recognition accuracy specifically, since OCR quality varies significantly by script and provider.
**AIC-TR-223:** SMS deliverability testing (AIC-TR-212) shall be repeated if the SMS provider is changed post-launch, not assumed to carry over from the original provider's results.
**AIC-TR-224:** This Part 9.5 integration detail and the Section 8.5 integration map shall be kept synchronized; any change to one without the other is treated as a documentation defect to be corrected before the next release.

---

### Layer 4 gate status — Part 9.5

| Gate item | Minimum Standard | Status |
|---|---|---|
| Third-party integrations | Per integration: purpose/API type/auth method/data exchanged/frequency/failure handling | Pass — 11 integrations (9 active, 1 internal-classified, 1 planned-inactive), full detail each |

*Next: 9.6 — Security Specifications (per control: standard/implementation/testing method — expanding Section 8.8's architecture into per-control detail). This is the final sub-section of Part 9.*
