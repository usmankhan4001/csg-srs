# PART 7 — SCREEN SPECIFICATIONS
## SCR-P2-004: Active Conversations
### Product: P2 — AI Marketing & Sales RevOps Engine | Layer 3 — UI/UX & Experience

---

## Purpose
Give Sales Ops Manager and Human Agent a live view of all in-progress chat/voice conversations, with sentiment indicators, so they can monitor or intervene.

## Wireframe — Desktop
- **Top filter bar**: status (AI-handled / Human-handled), channel, language, sentiment trend.
- **Main list**: table — Lead name, channel, stage, current handler (AI/Human), sentiment indicator icon, duration, last message preview.
- **Right side panel** (opens on row select): live transcript view (read-only unless the viewer is the assigned Human Agent), with a "Take Over" button shown only if eligible.

## Wireframe — Tablet
- Side panel becomes a slide-over overlay, dismissible via a close icon.

## Wireframe — Mobile
- List rows become stacked cards. Tapping opens the transcript as a full-screen view.

## Components List

| Component | Type | Data Source | States |
|---|---|---|---|
| Filter bar | Multi-select inputs | User input | Default, active-filter |
| Conversations list/table | Table | Module 3/9, live | Loading, loaded, error, empty |
| Sentiment indicator icon | Icon + color, per row | Module 3 | Positive, stable, declining, not-scored |
| Live transcript side panel | Threaded view | Module 3/10 | Loading, loaded, error |
| "Take Over" button | Button, conditional | Module 9 | Hidden (ineligible), visible, claiming, claimed |

## Actions Available

| Action | Trigger | Outcome | Permission Required |
|---|---|---|---|
| Select a conversation row | Click/tap | Opens transcript in side panel/full-screen | "View pipeline" / assigned ownership |
| Click "Take Over" | Click/tap | Claims the conversation; first claim wins | "Claim an escalation" |
| Filter by sentiment | Select filter | List narrows to matching conversations | Same as list view access |
| Click "Escalate manually" | Click/tap | Creates an escalation event without an automatic trigger | "View escalation queue" or assigned ownership |

## Validation Rules
No free-text input fields; filter selections are constrained to enum/multi-select values.

## Loading State
List rows render with skeleton placeholders.

## Empty State
"No active conversations right now" shown when zero conversations match the current filter.

## Error State
"Unable to load active conversations — retry." A transcript-panel-only failure does not affect the list's usability.

---

**Layer 3 Gate Check:** ✅ All gates passed.
