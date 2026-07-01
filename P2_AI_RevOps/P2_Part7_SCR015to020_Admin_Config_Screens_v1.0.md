# PART 7 — SCREEN SPECIFICATIONS
## SCR-P2-015 to SCR-P2-020: Admin Configuration Screens
### Product: P2 — AI Marketing & Sales RevOps Engine | Layer 3 — UI/UX & Experience

---

All six screens share one structural pattern — specified once here, with per-screen field/action differences below.

## Shared Wireframe Pattern

**Desktop**: Left rail lists Admin sub-sections (Intake Channels, Escalation Rules, Integration & Sync, Consent & Compliance, Language & Localization, Alerts & Notifications); main panel shows the form for the selected sub-section; Save button fixed at the bottom of the panel; "View Audit Log" link in the top-right of each panel.

**Tablet**: Left rail collapses into a dropdown selector at the top of the main panel.

**Mobile**: Each sub-section is its own full screen, reached via an Admin menu list; a back arrow returns to that list.

## Shared Components

| Component | Type | States |
|---|---|---|
| Sub-section nav (rail/dropdown/list) | Navigation | Default, active-selection |
| Settings form | Varies per screen (below) | Loading, loaded, saving, error |
| Save button | Button | Idle, saving, saved, error |
| "View Audit Log" link | Link | Opens a filtered view of Module 11's configuration audit trail |
| Confirmation toast | Toast | Shown on successful save |

## Shared Actions

| Action | Trigger | Outcome | Permission Required |
|---|---|---|---|
| Edit a field, click Save | Form submit | Change applied immediately, no code deployment needed; logged to audit trail | Per-screen permission (below) |
| Click "View Audit Log" | Click/tap | Opens filtered audit log for this sub-section | Same as edit, or read-only audit access for Compliance Officer |

## Shared Loading / Empty / Error States
- **Loading**: form fields show skeleton placeholders while current configuration loads.
- **Empty**: not generally applicable — settings screens have defaults always present.
- **Error**: "Unable to load configuration — retry" on load failure; field-level validation errors shown inline per each screen's table below.

---

## SCR-P2-015: Admin — Intake Channels (Module 1)

| Field | Type | Format | Required | Min/Max |
|---|---|---|---|---|
| Channel toggle (Web/Ads/WhatsApp/Referral/Email) | Toggle, one per channel | On/Off | Yes, per channel | N/A |
| Email intake address | String | RFC 5322 | Yes, if Email channel on | Max 254 chars |
| WhatsApp Business API credentials | Masked string | Provider-specific | Yes, if WhatsApp channel on | N/A, masked after entry |

**Screen-specific exception**: Disabling the last remaining active channel shows a warning but does not block the save.

**Permission**: System Administrator only.

---

## SCR-P2-016: Admin — Escalation Rules (Module 9, ties to Modules 2/3)

| Field | Type | Format | Required | Min/Max |
|---|---|---|---|---|
| Confidence threshold | Percentage | 0–100% | Yes, default 70% | Min 0, Max 100 |
| High-value threshold | Configurable, deployment-defined | Numeric or rule-based | Yes | N/A |
| Sentiment trigger toggle | Toggle | On/Off | Yes, default On | N/A |
| SLA threshold | Integer (minutes) | Whole number | Yes, default 10 | Min 1, Max 60 |
| Routing criteria builder | Structured (team, language, load) | N/A | Yes | N/A |

**Permission**: Sales Ops Manager (thresholds), System Administrator (full access).

---

## SCR-P2-017: Admin — Integration & Sync (Module 13)

| Field | Type | Format | Required | Min/Max |
|---|---|---|---|---|
| Field mapping table | Structured key-value rows | P2 field → Host field, direction | Yes, per mapped field | N/A |
| Sync trigger type | Enum | Webhook / Scheduled batch | Yes | N/A |
| Sync latency threshold | Integer (seconds) | Whole number | Yes, default 30 | Min 1, Max 3600 |
| Conflict resolution rule | Enum | Most-recent-wins / Source-of-truth-per-field / Manual review | Yes, default Most-recent-wins | N/A |

**Additional component**: Sync health status indicator showing last-successful-sync timestamp, with a "Mapped field no longer exists" warning state if schema drift is detected.

**Permission**: System Administrator only.

---

## SCR-P2-018: Admin — Consent & Compliance (Module 14)

| Field | Type | Format | Required | Min/Max |
|---|---|---|---|---|
| Consent notice text, per jurisdiction | String, list with "Add jurisdiction" action | Free text | Yes, per configured jurisdiction | Max 500 chars |
| Call audio retention window | Integer (days) | Whole number | Yes, default 90 | Min 1, Max 365 |
| Chat transcript retention window | Integer (days) | Whole number | Yes, default 90 | Min 1, Max 365 |

**Additional sub-panels**: Legal Hold Management (list of held records with apply/remove controls, reason field required) and Right-to-be-Forgotten Request Queue (incoming requests with identity-verification status).

**Permission**: Compliance Officer (full); System Administrator (implementation-level fields only).

---

## SCR-P2-019: Admin — Language & Localization (Module 17)

| Field | Type | Format | Required | Min/Max |
|---|---|---|---|---|
| Active language registry | Toggle, per language, with RTL flag | On/Off + Boolean | Yes, per language | At least one language active |
| New language onboarding wizard | Multi-step flow | N/A | N/A | N/A |

**Additional components**: Translation status mini-dashboard link and a per-pending-language readiness gate status (Knowledge Base ✅/⏳, Voice support ✅/⏳) — activation blocked until both show ✅.

**Permission**: System Administrator (onboarding, scoping); Compliance Officer (sign-off on activation).

---

## SCR-P2-020: Admin — Alerts & Notifications Config (Module 16)

| Field | Type | Format | Required | Min/Max |
|---|---|---|---|---|
| Alert rule list, severity per type | Table, editable severity dropdown per row | Info/Warning/Critical | Yes, per alert type | N/A |
| Delivery channel per severity | Checkbox group (Email/SMS/Dashboard) | N/A | Yes, at least one channel per severity | N/A |
| Acknowledgment escalation threshold | Integer (minutes) | Whole number | Yes, default 15 | Min 1, Max 120 |
| Notification template editor | Rich text with merge-field syntax | Free text | Yes, per template | Max 1,000 chars |

**Permission**: System Administrator only.

---

**Layer 3 Gate Check, SCR-P2-015 to SCR-P2-020:** ✅ All six screens specified with shared structural pattern plus distinct fields, validation, and permissions per module.
