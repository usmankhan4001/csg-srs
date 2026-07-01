# MASTER SRS — P3 AI STUDENT COACH
## Part 9 — Technical Specifications
### 9.1 Frontend Stack · 9.2 Backend Stack

*Layer 4 — Technical & Architecture*

| Field | Value |
|---|---|
| Product | P3 — AI Student Coach |
| Identifier range (this document) | AIC-TR-119 → AIC-TR-138 |
| Version currency note | Runtime/framework versions below were verified against official release sources on 29 June 2026 (Node.js 24 confirmed Active LTS; React 19.0.7 confirmed latest stable; Python 3.14.6 confirmed latest stable). Re-verify before contractual lock, given each project's typical multi-month gap between SRS sign-off and build start. |

---

## 9.1  Frontend Stack

### 9.1.1  Web (Student/Parent web app, Teacher/School Admin/Super Admin consoles)

| Element | Choice | Justification |
|---|---|---|
| Framework | React 19 | Current stable major (19.0.7 confirmed June 2026); concurrent rendering features suit the streaming-token chat UI (Tutor Engine) |
| Language | TypeScript 5.x | Type safety across a large multi-surface codebase (5 surfaces, Part 6/7); shared types with NestJS backend services (9.2) |
| Build tool | Vite | Fast HMR for iterative UI development against the Part 6/7 design system |
| Styling | Tailwind CSS, tokens mapped to Part 6.3 (typography/colour/spacing scales) | Utility-first approach matches the token-driven design system already specified; avoids component-library lock-in that might fight the custom token set |
| State management — server state | TanStack Query | Purpose-built for API data caching/refetching (recommendations, profile, conversation history) — avoids hand-rolled cache logic |
| State management — client/UI state | Zustand | Lightweight; avoids Redux boilerplate for what is mostly local UI state (active screen, modal state, in-progress form values) |
| Real-time/streaming | Native WebSocket client (token-by-token streaming from Tutor Engine) | Matches the chat-streaming UX implied by Part 7 wireframes (typing indicator → progressive response) |
| Localization | i18next | Mature EN/UR/AR support; integrates with the RTL rules in Part 6.6 |
| Charting (Admin/Teacher consoles) | Recharts | Used for usage/cost dashboards (SCR-SUSAGE-001, SCR-XUSAGE-001) |
| Accessibility tooling | axe-core (CI-integrated), react-aria primitives where custom components need keyboard/screen-reader behaviour | Supports the WCAG 2.1 AA conformance target (Part 2.5/6.5) |
| PWA | **Not implemented at v1.0** | Offline mobile mode is deferred to v2.0 (DEF-03, Part 1.3.3); a standard responsive web app is sufficient until offline tutoring is in scope |

### 9.1.2  Mobile (Student App, Parent App)

**AIC-TR-119:** The mobile frontend framework for the Student and Parent apps shall be **React Native (TypeScript)**, sharing business-logic and API-client code with the web React codebase, rather than fully separate native Swift/Kotlin implementations.

**Justification:** P1's SRS specifies native Swift (iOS) and Kotlin (Android) for the full LMS/SMS app, which carries heavy native requirements (live video classes, biometric attendance, camera-based proctoring). P3's mobile surface is comparatively light — text/voice chat, forms, simple image capture for OCR upload, and TTS playback — none of which requires native-only capability. A shared React Native codebase reduces the engineering team size and budget (Part 13) needed to maintain feature parity across iOS and Android, and lets the same engineers who build the web app contribute to mobile.

| Element | Choice |
|---|---|
| Framework | React Native (latest stable line, paired with the React 19 core per 9.1.1) |
| Native modules required | Camera/image-picker (homework photo capture), push-notification bridge (FCM/APNs, per Section 8.5), TTS playback (platform TTS APIs wrapped via a native module) |
| Build tooling | Metro bundler; native shell builds via Xcode (iOS) and Gradle (Android) remain necessary even with React Native |

**Gap G15 — flagged for client confirmation:** This recommendation **diverges from P1's native-only mobile strategy**. Confirm whether the client prefers (a) this lighter, lower-cost React Native approach specifically for P3, or (b) native Swift/Kotlin for P3 as well, for consistency with the P1 mobile team's existing skillset and to avoid maintaining two different mobile toolchains across products. **Owner: Client/PM. Target: before Part 12 resource planning, since this materially changes the mobile team's skill requirements and Part 13 cost.**

**AIC-TR-120:** Regardless of the G15 outcome, the Teacher, School Admin, and Super Admin consoles remain web-only (per the Part 6 navigation trees) and are unaffected by the mobile framework decision.

---

## 9.2  Backend Stack

P3's backend is **polyglot by design** (AIC-TR-004 already permits independent technology choice per service). Two language/framework tracks are used, split by the nature of each service's workload.

### 9.2.1  AI-Orchestration Services (Tutor Engine, Homework Assistant, Revision Coach, Career Coach, Wellbeing Coach, Knowledge Graph & RAG, Personalization, Model Gateway)

| Element | Choice | Justification |
|---|---|---|
| Language | Python 3.13 | Dominant ecosystem for LLM/RAG tooling (embedding libraries, provider SDKs); 3.13 chosen over the newer 3.14.6 (latest stable as of June 2026) to allow library/dependency ecosystem time to catch up before this product adopts the newest release — standard production practice, re-evaluated at Part 11 build start |
| Framework | FastAPI | Async-native, suits I/O-bound LLM provider calls; built-in OpenAPI schema generation supports the Part 9.4 API catalog directly |
| ASGI server | Uvicorn (behind Gunicorn for process management) | Standard production pairing for FastAPI |
| Validation | Pydantic v2 | Type-safe request/response models, shared schema source for OpenAPI docs |
| Database access | SQLAlchemy (async) + asyncpg driver | Async Postgres access matching FastAPI's async model |
| Vector/embedding | pgvector Python client, provider embedding SDKs (wrapped behind the Knowledge Graph & RAG service's Embedding Service component, 8.4.2) | Matches the pgvector storage decision (8.1.3) |
| HTTP client (outbound to LLM providers) | httpx (async) | Async-compatible outbound calls through the Model Gateway's Provider Adapters (8.4.2) |
| Background jobs | Celery (with Redis as broker) or arq | Reindexing (8.4.2 Ingestion Pipeline), batch revision-item pre-generation, scheduled reports |

### 9.2.2  CRUD / Integration Services (Student Learning Profile, Teacher Oversight, Consent & Safety, Admin & Configuration, Notification)

| Element | Choice | Justification |
|---|---|---|
| Language | TypeScript | Shared type discipline with the frontend (9.1); these services are more conventional REST/CRUD workloads where Node's ecosystem is mature |
| Runtime | Node.js 24 (Active LTS, confirmed June 2026) | Current recommended LTS for new projects; Node 22 (Maintenance LTS) retained as a documented fallback if a specific dependency lags Node 24 support |
| Framework | NestJS | Structured, modular architecture suits services with significant CRUD/permission logic (Teacher Oversight, Admin & Configuration); built-in support for guards/interceptors maps naturally onto the RBAC enforcement required in Part 2.4 |
| ORM | Prisma | Type-safe schema access, migrations aligned with the Part 9.3 data dictionary |
| Job queue (notification dispatch) | BullMQ (Redis-backed) | Matches the Redis cache layer already chosen (8.1.3/8.6.3); handles retry/backoff for SMS/Email/Push delivery (Section 8.5) |
| Validation | class-validator / class-transformer | Standard NestJS-ecosystem request validation |

### 9.2.3  Cross-Cutting Backend Decisions

| Decision | Detail |
|---|---|
| API protocol | RESTful APIs (OpenAPI/Swagger-documented, per the Part 9.4 catalog) for all request/response operations |
| Real-time protocol | WebSocket for Tutor Engine response streaming and Wellbeing Coach real-time alert delivery to Teacher/Admin consoles; standard REST polling is not used for these two time-sensitive paths |
| Inter-service communication | Synchronous REST for read operations; message-queue-based events (via Redis/BullMQ) for cross-service notifications not requiring an immediate response (restates AIC-TR-013) |
| Containerization | Each service (Python/FastAPI or Node/NestJS) ships as its own container image, consistent with AIC-TR-004's independent-deployability requirement; full CI/CD detail in Part 11.3 |

**AIC-TR-121:** Python-based and Node-based services shall communicate only via their documented REST/event contracts (Part 9.4/8.5), never via direct in-process calls or shared language-specific libraries, since they run in different runtimes.
**AIC-TR-122:** All backend services shall expose health-check and readiness endpoints in a consistent format regardless of language, so the API Gateway's routing/failover logic (AIC-TR-012) does not need language-specific handling.
**AIC-TR-123:** Database schema migrations shall be coordinated across the SQLAlchemy (Python) and Prisma (Node) services sharing the same PostgreSQL instance, with a single migration-ownership convention (one tool of record per schema, documented in Part 9.3) to avoid migration conflicts.
**AIC-TR-124:** Background job processing (Celery/arq for Python services, BullMQ for Node services) shall use logically separate Redis key namespaces, even though they may share the same Redis instance, to avoid cross-framework key collisions.
**AIC-TR-125:** WebSocket connections shall be authenticated using the same token validation as REST requests (8.8.1) before a streaming session is established; an unauthenticated WebSocket upgrade request shall be rejected at the Gateway.
**AIC-TR-126:** API responses across all services shall follow a consistent JSON error-response shape regardless of backend language, to keep frontend error handling (Part 7 error states) uniform.
**AIC-TR-127:** All backend services shall log in a structured (JSON) format compatible with the Part 11.5 monitoring stack, regardless of language-specific default logging conventions.
**AIC-TR-128:** Dependency versions (Python packages, npm packages) shall be pinned with lockfiles in every service repository, and scanned for vulnerabilities in CI (Part 11.3), consistent with the OWASP "Vulnerable & Outdated Components" control (8.8.4).
**AIC-TR-129:** Any service migration between the Python and Node tracks (e.g., if a CRUD service later needs heavier AI-orchestration logic) shall be treated as a new service build, not an in-place language rewrite, and shall require a Part 17 change request.
**AIC-TR-130:** The Model Gateway's provider adapter layer (8.4.2) shall isolate provider-SDK version upgrades (Anthropic/OpenAI/Google client libraries) from the rest of the Python codebase, so a provider SDK update does not require changes outside the adapter.
**AIC-TR-131:** FastAPI services shall generate their OpenAPI schema directly from Pydantic models (not maintained as a hand-written separate spec), ensuring the Part 9.4 API catalog stays synchronized with actual request/response shapes.
**AIC-TR-132:** NestJS services shall use the equivalent OpenAPI decorator-based generation (e.g., `@nestjs/swagger`) for the same synchronization guarantee on the Node side.
**AIC-TR-133:** Node.js 22 (Maintenance LTS) is the documented fallback runtime if a critical dependency has not yet validated support for Node 24 at build start; this shall be re-checked at the start of Part 11 environment build, not assumed fixed at SRS sign-off.
**AIC-TR-134:** Python 3.13 is the target runtime; adoption of 3.14 or later shall be re-evaluated once the project's core dependencies (FastAPI, SQLAlchemy, provider SDKs, pgvector client) confirm compatibility, not adopted automatically on release.
**AIC-TR-135:** Each backend service's container base image shall be scanned and rebuilt on a defined cadence (finalized in Part 11.3) to pick up security patches, independent of feature release cycles.
**AIC-TR-136:** Service-level configuration (non-secret) shall be environment-variable-driven and version-controlled; secrets shall be retrieved from the key vault (AIC-TR-095), never from environment files committed to source control.
**AIC-TR-137:** Each AI-orchestration service shall expose its inference-call latency as a first-class metric distinct from its own processing latency, so a slow LLM provider response is distinguishable from slow application code in monitoring (Part 11.5).
**AIC-TR-138:** The frontend (9.1) and backend (9.2) technology choices in this section shall be reviewed for currency at the start of Part 11 environment build, given the version-currency note at the top of this document.

---

### Layer 4 gate status — Part 9.1–9.2

| Gate item | Status |
|---|---|
| 9.1 Frontend stack — framework, language, version, libraries, state management, build tools | Pass |
| 9.2 Backend stack — language, framework, version, runtime, dependencies, API protocol | Pass |

*Open item: Gap G15 (mobile framework — React Native vs. native) requires client confirmation before Part 12 resourcing. Next: 9.3 — Database Design (ER diagrams, full data dictionary, table specs, indexes, constraints).*
