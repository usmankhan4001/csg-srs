# PART 7 — SCREEN SPECIFICATIONS
## SCR-P2-003: Lead/Deal Detail
### Product: P2 — AI Marketing & Sales RevOps Engine | Layer 3 — UI/UX & Experience

---

## Purpose
Show the complete record for a single lead/deal — profile, conversation history, stage, and available actions — to authorized roles.

## Wireframe — Desktop
- **Header band**: lead name, contact info, current stage badge, channel-origin tag, assigned owner.
- **Left column**: Profile & Preferences panel (Module 10); below it, Stage Transition History/Audit list.
- **Main column (right, wider)**: Conversation transcript viewer (chat + voice turns interleaved) with the generated interaction summary pinned at the top.
- **Bottom action bar**: Manual stage override, Escalate manually, Apply/Remove Legal Hold (Compliance Officer only), Payment/Fulfillment status panel (visible only if stage is Submitted/Converted).

## Wireframe — Tablet
- Left column collapses into a collapsible accordion panel above the conversation viewer.
- Action bar remains fixed at the bottom but icons replace labels where space is tight.

## Wireframe — Mobile
- Layout becomes tabbed: "Profile," "History," "Conversation" as separate tabs.
- Action bar becomes a floating action button that expands a menu on tap.

## Components List

| Component | Type | Data Source | States |
|---|---|---|---|
| Lead header | Static info band | Module 8 | Loading, loaded, error |
| Profile & Preferences panel | Key-value list | Module 10 | Loading, loaded, error, empty |
| Stage Transition History/Audit | List | Module 8 | Loading, loaded, error, empty |
| Conversation transcript viewer | Threaded list, chat + voice | Module 3/10 | Loading, loaded, error, empty |
| Interaction summary | Text block | Module 10 (generated) | Loading, loaded, fallback-to-raw-transcript |
| Manual stage override control | Dropdown | Module 8 | Default, saving, error |
| Escalate manually button | Button | Module 9 | Idle, escalating, escalated |
| Legal hold toggle | Toggle + reason field | Module 14 (Compliance Officer only) | Off, on, saving |
| Payment/fulfillment status panel | Status card | Module 7 | Hidden (if stage < Submitted), visible, error |

## Actions Available

| Action | Trigger | Outcome | Permission Required |
|---|---|---|---|
| Edit a lead/deal field | Inline edit | Field updated, logged | "Manually edit lead/deal record" |
| Manual stage override | Select new stage | Override applied, takes precedence over automated transitions | "Manually edit lead/deal record" |
| Escalate manually | Click "Escalate" | Creates an escalation event even without an automatic trigger | "View escalation queue" or assigned ownership |
| Apply/remove legal hold | Toggle + enter reason | Overrides scheduled deletion | Compliance Officer only |
| View call recording | Click a voice turn | Plays/streams the recording | Per Module 3 permission table |

## Validation Rules

| Field | Type | Format | Required | Min/Max |
|---|---|---|---|---|
| Edited contact fields | Per field type | Same as Module 1 validation rules | Per original field requirement | Per original field |
| Legal hold reason | String | Free text | Yes, when applying a hold | Max 500 chars |

## Loading State
Header, Profile panel, History list, and Conversation viewer each load independently.

## Empty State
"No conversation history yet" shown for a lead just captured via Module 1.

## Error State
"Unable to load this record" with retry, scoped to whichever panel failed.

---

**Layer 3 Gate Check:** ✅ All gates passed.
