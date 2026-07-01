# MASTER SRS — P3 AI STUDENT COACH
## Part 8 — Solution Architecture
### 8.1 Platform Analysis

*Layer 4 — Technical & Architecture*

| Field | Value |
|---|---|
| Product | P3 — AI Student Coach |
| Document | Master SRS — Part 8 of 17 |
| Version | 1.0 (Draft — Layer 4 in progress) |
| Classification | Internal — Consultant Use Only |
| Identifier prefix | AIC-TR (Technical Requirement) |
| Pricing currency note | All LLM provider figures below were verified against official provider pricing pages on 29 June 2026. LLM pricing changes frequently (multiple revisions occurred in April–June 2026 alone); confirm current rates against the live provider pricing page before locking Part 13 budget figures. |

---

## 8.1.1  LLM Provider Platform Comparison

Anthropic, OpenAI, and Google each restructured their model lineups between April and June 2026. As of the current rate cards, Anthropic's Claude API pricing centers on three tiers: Opus 4.8 at $5/$25 per million input/output tokens, Sonnet 4.6 at $3/$15, and Haiku 4.5 at $1/$5, with cache-hit reads priced at roughly 10% of the standard input rate and the Batch API offering a 50% discount on both input and output tokens. OpenAI's current lineup runs from GPT-5.4-nano at $0.20/$1.25 per million tokens up to the GPT-5.5 flagship at $5/$30, with GPT-5.4 mini available at $0.75/$4.50 as a strong low-cost production option. Google's Gemini lineup is the most fragmented of the three: Gemini 3.1 Pro costs $2/$12 per million tokens up to 200K context, stepping to $4/$18 above that threshold, with cached input priced at $0.20, while Gemini 2.5 Flash-Lite sits at roughly $0.10 input and $0.40 output as the budget option. All three providers offer a Batch/asynchronous discount near 50%, which matters directly for non-real-time P3 workloads (revision-item pre-generation, corpus reindexing).

| Criterion | Anthropic (Claude) | OpenAI (GPT) | Google (Gemini) | Self-hosted open model |
|---|---|---|---|---|
| Current flagship / mid / budget tiers (per 1M tokens, input/output) | Opus 4.8 $5/$25 · Sonnet 4.6 $3/$15 · Haiku 4.5 $1/$5 | GPT-5.5 $5/$30 · GPT-5.4 $2.50/$15 · GPT-5.4-mini $0.75/$4.50 · nano $0.20/$1.25 | Gemini 3.1 Pro $2–4/$12–18 · 3.5 Flash $1.50/$9 · 2.5 Flash-Lite $0.10/$0.40 | Hosting cost only (GPU/inference infra); no per-token license fee |
| Context window (flagship) | 1M tokens, flat-rate, no surcharge | ~270K–1M depending on model | 1M–2M tokens (largest in market) | Model-dependent (e.g., Llama 3.x 128K) |
| Caching discount | ~90% off cache-hit input | Up to 90% off cached input | ~90% off cached input | N/A (self-managed) |
| Batch/async discount | 50% | 50% (Batch/Flex) | 50% | N/A |
| Licence / data terms | Commercial API, no training on customer data (enterprise tier) | Commercial API, no training on customer data (enterprise tier) | Commercial API; free-tier data may train models — paid tier required for P3 | Open-weight licence varies (Llama, Mistral, Qwen); full data control |
| Multilingual quality (EN/UR/AR) | Strong on EN/AR; UR coverage adequate but not class-leading | Strong on EN/AR; UR coverage comparable to Claude | Strong multilingual breadth, large training data diversity | Variable; smaller open models weaker on UR/AR than frontier APIs |
| Ecosystem / community / tooling | Mature agent/tool-use ecosystem, strong safety documentation | Largest ecosystem, broadest third-party tooling | Strong Google-ecosystem integration (less relevant for a non-Google-stack product) | Requires in-house MLOps; community varies by model |
| Fit for P3 role | Tier A reasoning (tutoring, career, wellbeing classification accuracy) | Tier A/B alternative; strong failover diversity | Tier B synthesis (long-context corpus work) and budget Tier C | Tier C classification/intent only, to control cost at scale |

**AIC-TR-001:** The model-gateway architecture (4.1/4.11) shall support all three commercial providers plus one self-hosted open model behind a single routing abstraction, with no module calling a provider SDK directly.

**Recommendation:** No single provider is used exclusively. Tier A (tutoring reasoning, wellbeing classification, career explainability) routes primarily to **Claude Sonnet 4.6**, justified by its flat 1M-token context at standard pricing (no long-context surcharge, unlike Gemini's step-up above 200K), its 90% cache-hit discount benefiting P3's repeated system-prompt pattern (curriculum context, safety instructions), and Anthropic's published emphasis on safety documentation relevant to a child-facing product. **GPT-5.4** is configured as the Tier A failover, since OpenAI's pricing and capability sit close to Sonnet 4.6 and provider diversity protects against a single-vendor outage (CON-AIC: availability). Tier B (revision generation, summaries, long-document corpus synthesis) routes to **Gemini 2.5 Flash / 3.5 Flash**, justified by Google's large context window suiting long curriculum documents and its competitive per-token rate at that capability level. Tier C (language detection, intent classification, safety pre-screening) routes to a **self-hosted open model** (e.g., a fine-tuned Llama/Qwen-class model), justified by the high call volume of classification tasks making per-token commercial pricing the dominant cost driver at scale — self-hosting amortizes that cost once volume crosses the break-even point modeled in Part 13.

---

## 8.1.2  Cloud Infrastructure Platform Comparison

| Criterion | AWS | Microsoft Azure | Google Cloud Platform |
|---|---|---|---|
| Pakistan / South Asia region presence | No native PK region; nearest is Mumbai (ap-south-1) | No native PK region; nearest is UAE (uaenorth) or India Central | No native PK region; nearest is Mumbai (asia-south1) |
| Managed vector search | OpenSearch Service (vector engine), or pgvector on RDS/Aurora PostgreSQL | Azure AI Search (vector support), or pgvector on Azure Database for PostgreSQL | Vertex AI Vector Search, or pgvector on Cloud SQL for PostgreSQL |
| LLM-gateway-friendly managed AI service | Bedrock (multi-model proxy, incl. Anthropic) | Azure AI Foundry (multi-model, incl. OpenAI + Anthropic) | Vertex AI (multi-model, incl. Gemini + partner models) |
| Compliance / data residency tooling | Mature; broad compliance certification catalog | Mature; strong enterprise/education sector presence (Education-specific offerings) | Mature; strong AI/data-analytics tooling |
| Cost model transparency | Granular, well-documented; reserved-instance discounts | Granular; education/non-profit credit programs available | Granular; sustained-use discounts |
| Existing P1 (LMS/SMS) alignment | Compatible — no hard dependency | Compatible — Microsoft ecosystem also used by P4 (Dynamics 365), creating cross-product synergy | Compatible — no hard dependency |
| Fit for P3 | Strong, especially via Bedrock for Claude access | Strong, with the added benefit of shared platform familiarity with P4 | Strong, especially given Gemini Tier B routing locality |

**AIC-TR-002:** Primary application hosting and the vector store shall reside in a single cloud region closest to the tenant's data-residency requirement, defaulting to the nearest available region to Pakistan until a Pakistan-local region is offered by a Tier-1 provider.

**Recommendation:** **Microsoft Azure** is recommended as the primary cloud platform, with the application layer hosted in the **UAE North** region as the closest currently available Tier-1 region to Pakistan with strong compliance tooling. Justification: (1) Azure AI Foundry provides native multi-model routing including both OpenAI and Anthropic models, simplifying the Tier A/B failover design in 8.1.1; (2) Microsoft's established education-sector offerings and compliance certifications align with the Cambridge/Cognia accreditation evidence requirements (CMP-AIC-06/07); (3) sharing a cloud ecosystem with P4 (Dynamics 365 Guidance Bots, which is Microsoft-native) creates operational synergy for the consultant's team without forcing P3's architecture to depend on P4. AWS Bedrock is retained as the documented alternative if contract terms or regional latency testing favor it during Part 11 environment build-out; this decision is not locked until a latency test against Lahore/Karachi endpoints is run (flagged as Gap G12 below).

---

## 8.1.3  Vector Database / RAG Infrastructure Comparison

| Criterion | pgvector (managed Postgres) | Pinecone | Weaviate | Milvus / Zilliz Cloud |
|---|---|---|---|---|
| Licence | Open-source (PostgreSQL licence) | Proprietary SaaS | Open-source core + managed cloud option | Open-source (Apache 2.0) + managed cloud option |
| Multi-tenancy isolation model | Native via schema/row-level isolation (fits BR-AIC-K-07) | Namespace-per-tenant | Multi-tenancy class support | Partition-per-tenant |
| Operational overhead | Lowest — same database already used for relational data (6.3 of original SMS architecture) | Low — fully managed | Medium — self-host or managed | Medium — self-host or managed |
| Cost at P3's scale (500–2,000 students now, 100,000+ target) | Low at current scale; scales with Postgres instance sizing | Per-vector/query pricing scales with growth; can become significant at 100,000+ students | Comparable to Milvus; managed tier adds cost | Comparable to Weaviate; managed tier adds cost |
| Community / maturity | Very mature (Postgres ecosystem); pgvector itself is newer but widely adopted | Mature, vector-search-specialist | Mature, vector-search-specialist | Mature, vector-search-specialist |
| Fit for P3 | Strong at current scale; consolidates with existing relational data layer | Strong if pure vector-search performance becomes the bottleneck at 100,000+ scale | Viable alternative if hybrid search (vector + keyword) becomes a priority | Viable alternative; less common in Azure-first deployments |

**AIC-TR-003:** The vector store shall enforce tenant isolation at the storage layer (not application-layer filtering alone), consistent with BR-AIC-K-07.

**Recommendation:** **pgvector on a managed PostgreSQL instance** (Azure Database for PostgreSQL) is recommended for v1.0, justified by: (1) it consolidates the RAG vector store with the relational data layer already required for the Student Learning Profile and Knowledge Graph (4.6/4.7), reducing operational surface area; (2) at the confirmed launch scale (500–2,000 students), pgvector's performance is more than sufficient, and the cost model avoids per-query vector-search fees that would compound at the 100,000+ target scale; (3) tenant isolation maps naturally onto Postgres's existing row-level security model. **Migration trigger:** if query latency or index size at 100,000+ students degrades p95 response time below the Part 10 NFR target, the architecture shall migrate to a dedicated vector-search service (Pinecone or Azure AI Search) — this is documented as a scaling decision point, not a v1.0 commitment.

---

## 8.1.4  Open Items From This Section

| Ref | Gap | Resolution needed | Owner | Target |
|---|---|---|---|---|
| G12 | Cloud region latency for Pakistan-based users | Run a latency test from Lahore/Karachi against Azure UAE North vs. AWS Mumbai vs. GCP Mumbai before locking the cloud provider decision | Consultant (technical) | Before Part 11 environment build |
| G13 | LLM pricing volatility | Re-verify all Section 8.1.1 rates immediately before Part 13 budget finalization, given multiple rate revisions observed between April and June 2026 alone | Consultant | Before Part 13 |

---

### Layer 4 gate status — Part 8.1

| Gate item | Minimum Standard | Status |
|---|---|---|
| Platform analysis | All options evaluated, comparison table, recommendation with written justification | Pass — 3 categories (LLM, cloud, vector store), 3–4 options each, written justification per recommendation |

*Next: 8.2 — High-Level Architecture (architecture diagram showing all major system components and connections).*
