# PART 7 — SCREEN SPECIFICATIONS
## SCR-P2-010: Knowledge Base Entry Management
### Product: P2 — AI Marketing & Sales RevOps Engine | Layer 3 — UI/UX & Experience

---

## Purpose
Let Marketing Manager and System Admin create, edit, and delete Knowledge Base entries, manage multi-language coverage, and clear staleness flags.

## Wireframe — Desktop
- **Top filter bar**: category, language coverage status, staleness status.
- **Main entry list table**: title/summary, category, per-language coverage badges, last-reviewed date, staleness flag, Edit/Delete icons.
- **Edit panel** (opens on row click): per-language tabs for entry text, category selector, version history list, "Mark Reviewed" button.

## Wireframe — Tablet
- Edit panel becomes a slide-over.

## Wireframe — Mobile
- List becomes cards; Edit opens full-screen with language tabs as a horizontally scrollable strip.

## Components List

| Component | Type | Data Source | States |
|---|---|---|---|
| Filter bar | Multi-select inputs | User input | Default, active-filter |
| Entry list table | Table | Module 15 | Loading, loaded, error, empty |
| Language coverage badge | Badge | Module 15 | Native, translated-unreviewed, missing |
| Staleness flag | Icon + label | Module 15 | Fresh, stale |
| Edit panel | Tabbed form | Module 15 | Loading, loaded, error, saving |
| Version history list | List | Module 15 | Loaded, empty (new entry) |
| "Mark Reviewed" button | Button | Module 15 | Idle, saving |
| Delete confirmation dialog | Modal | Module 15 | Standard, in-use-warning |

## Actions Available

| Action | Trigger | Outcome | Permission Required |
|---|---|---|---|
| Click "New Entry" | Click/tap | Opens a blank Edit panel | "Create/edit Knowledge Base entries" |
| Edit and save an entry | Form submit | New version saved, prior version retained | Same as above |
| Delete an entry | Click delete icon | Confirmation dialog; in-use entries show count warning | Same as above |
| Click "Mark Reviewed" | Click/tap | Clears staleness flag, updates last-reviewed date | "Review/clear staleness flag" |
| Switch language tab without native content | Click/tap | Shows machine-translated text with "Translated, Unreviewed" indicator | Same as above |

## Validation Rules

| Field | Type | Format | Required | Min/Max |
|---|---|---|---|---|
| Entry text | String, per language | Free text | Yes, at least one language | Max 2,000 chars per entry |
| Category | Enum | Fact/FAQ/Pricing/Offer | Yes | N/A |

## Loading State
Entry list and edit panel load independently.

## Empty State
"No Knowledge Base entries yet" shown for a brand-new deployment.

## Error State
"Unable to load Knowledge Base entries — retry." Deletion of an in-use entry shows the in-use warning dialog rather than a generic error.

---

**Layer 3 Gate Check:** ✅ All gates passed.
