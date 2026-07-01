# PART 7 — SCREEN SPECIFICATIONS
## SCR-P2-021: Prospect Chat Widget | SCR-P2-022: Prospect Voice Call Indicator
### Product: P2 — AI Marketing & Sales RevOps Engine | Layer 3 — UI/UX & Experience

---

## SCR-P2-021: Prospect Chat Widget

### Purpose
The embeddable chat interface where a Prospect interacts with the AI Lead Qualification and Voice & Chat Engagement agents, across web, WhatsApp, and other configured channels.

### Wireframe — Desktop
- **Collapsed state**: floating chat bubble icon, typically bottom-right corner.
- **Expanded state**: header (deployment branding + language indicator/switcher), scrollable message thread (agent + prospect messages with timestamps), typing indicator below the last message, input box with send button at the bottom, dynamic quick-reply buttons above the input when the agent is asking a qualifying question, "Switch to Voice Call" button in the header (visible only if voice is configured).

### Wireframe — Tablet
- Same structure as desktop; touch targets enlarged (min. 44px height).

### Wireframe — Mobile
- Collapsed bubble same as desktop; expanded state becomes a full-screen takeover.

### RTL Behavior
Entire widget mirrors for Arabic/Urdu — message thread alignment flips, input box and send button swap sides, quick-reply buttons read right-to-left.

### Components List

| Component | Type | Data Source | States |
|---|---|---|---|
| Chat bubble toggle | Icon button | N/A | Collapsed, expanded, unread-indicator |
| Header (branding, language switcher) | Static + dropdown | Module 17 | Default |
| Message thread | Scrollable list | Module 3/10, live | Loading, loaded, error |
| Typing indicator | Animated dots | Module 3 | Hidden, visible |
| Input box + send button | Text input + button | User input | Default, sending, error |
| Quick-reply buttons | Button row, dynamic | Module 2 | Hidden, visible |
| "Switch to Voice Call" button | Button | Navigates to SCR-P2-022 | Hidden (voice not configured), visible |

### Actions Available

| Action | Trigger | Outcome | Permission Required |
|---|---|---|---|
| Send a message | Type + click Send or Enter | Message sent to agent, response streams back | None — public-facing |
| Click a quick-reply button | Click/tap | Sends the predefined response | None |
| Click "Switch to Voice Call" | Click/tap | Opens SCR-P2-022 (consent notice first) | None |
| Switch language | Select from language switcher | Overrides auto-detected language for the rest of the session | None |

### Validation Rules

| Field | Type | Format | Required | Min/Max |
|---|---|---|---|---|
| Message text | String | Free text | Yes, non-empty to send | Max 2,000 chars |

### Loading State
Typing indicator shows while the agent composes a response; send button disables briefly after sending.

### Empty State
First open shows an initial greeting message rather than a literal blank state.

### Error State
"Message failed to send — retry" on network failure. If the agent backend times out: "We're having trouble responding — a team member will follow up shortly."

---

## SCR-P2-022: Prospect Voice Call Indicator

### Purpose
The consent notice and minimal call-status surface shown when a Prospect initiates or receives a voice call.

### Wireframe — Desktop / Tablet / Mobile
Identical structure across breakpoints (compact modal/overlay, not content-heavy):
- **Pre-call**: Consent Notice modal — jurisdiction-specific consent text, "I Agree, Continue" and "No Thanks, Continue by Chat" buttons.
- **During call**: call status bar — connection indicator, duration timer, mute/unmute (web-based call), live captions/transcript toggle, "End Call" button.
- **Post-call**: brief summary line with a button to return to SCR-P2-021.

### Components List

| Component | Type | Data Source | States |
|---|---|---|---|
| Consent Notice modal | Modal, text + buttons | Module 14 | Visible (pre-call only) |
| "I Agree" / "No Thanks" buttons | Buttons | User input | Idle, selected |
| Call status bar | Status indicator + timer | Module 3, live | Connecting, connected, dropped |
| Mute/unmute toggle | Toggle | User input | Muted, unmuted |
| Live captions/transcript toggle | Toggle | Module 3 | Off, on |
| "End Call" button | Button | User input | Idle, ending |
| Post-call summary | Text + button | N/A | Visible (post-call only) |

### Actions Available

| Action | Trigger | Outcome | Permission Required |
|---|---|---|---|
| Click "I Agree, Continue" | Click/tap | Consent logged with timestamp; call proceeds and is recorded | None — public-facing |
| Click "No Thanks, Continue by Chat" | Click/tap | Call does not proceed; returns to SCR-P2-021 | None |
| Toggle mute | Click/tap | Mutes/unmutes the Prospect's microphone | None |
| Toggle live captions | Click/tap | Shows/hides real-time transcript text | None |
| Click "End Call" | Click/tap | Ends the call session, returns to chat | None |

### Validation Rules
No form input fields — button-driven only.

### Loading State
"Connecting…" shown between call initiation and connection.

### Empty State
Not applicable — this screen only exists during an active or just-completed call.

### Error State
"Call failed to connect" with a fallback to continue by chat. If a connected call drops: "We seem to have lost the connection — we'll call back shortly," returning to the chat widget.

---

**Layer 3 Gate Check, SCR-P2-021 and SCR-P2-022:** ✅ All gates passed.

**Part 7 — Screen Specifications complete: all 22 screens specified. Layer 3 (Parts 6–7) is content-complete for P2.**
