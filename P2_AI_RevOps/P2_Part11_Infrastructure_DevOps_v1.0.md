# PART 11 — INFRASTRUCTURE & DEVOPS
## Product: P2 — AI Marketing & Sales RevOps Engine
### Layer 4 — Technical & Architecture | Audience: Architects, Developers, DevOps

---

## 11.1 Cloud Infrastructure

| Service | Purpose | Sizing (Launch) |
|---|---|---|
| Managed PostgreSQL | Primary data store | 4 vCPU / 16GB RAM, multi-AZ |
| Managed Redis | Session/short-term memory cache | 2GB memory, primary + replica |
| Object storage (S3-compatible) | Call recordings, versioned | Lifecycle policy tied to retention rules (AI-BR-008/032) |
| Container orchestration (managed Kubernetes) | Hosts all stateless agent services | 2–10 pods autoscaled, 2 vCPU / 4GB RAM per pod |
| API Gateway / Load Balancer | Public ingress, auth, rate limiting | Per Part 9.4 rate limits |
| GPU instance (neocloud provider) | Self-hosted LLM inference tier | 1× RTX 4090 or A100 40GB spot |

**Regions**: Deployment-configurable, defaulting to the region nearest the first configured target market (AI-BR-006) — no hardcoded region.

**Availability zones**: Multi-AZ for PostgreSQL and Redis; single-AZ for the GPU instance, with API-tier fallback via the LLM Router.

## 11.2 Environment Strategy

| Environment | Purpose | Access Control | Data Policy |
|---|---|---|---|
| Dev | Active development | Engineering team only, VPN | Synthetic/seed data only — no real PII |
| QA | Automated + manual testing | Engineering + QA team, VPN | Synthetic/seed data, refreshed weekly |
| UAT | Client acceptance testing | Client + consultant, SSO | Anonymized/sample data, client-approved |
| Production | Live deployment | RBAC per Part 2.4, SSO, fully audit-logged | Real data; full compliance controls (Module 14) active |

## 11.3 CI/CD Pipeline

**Stages**: Lint/Static Analysis → Unit Tests → Build Container Image → Integration Tests (against QA env) → Security Scan (SAST/dependency scan) → Deploy to QA → Manual QA Sign-off → Deploy to UAT → Client Acceptance → Deploy to Production (approval gate).

**Triggers**:
- Push to feature branch → lint + unit tests only.
- Merge to main → full pipeline through QA.
- Tagged release → UAT/Production promotion (manual approval gate required).

**Automated tests per stage**: Unit tests on every commit; integration tests on every merge to main; end-to-end tests nightly and pre-release; security scan on every build.

**Approval gates**: QA sign-off required before UAT promotion; client acceptance sign-off required before Production promotion.

**Rollback procedure**: Blue-green deployment. Automatic rollback triggers if the post-deploy health check fails within 5 minutes of cutover. A manual rollback control remains available for 24 hours post-deploy.

## 11.4 Containerization

| Item | Specification |
|---|---|
| Container strategy | One Docker image per service (Part 8.4 component list), versioned and immutable |
| Orchestration platform | Managed Kubernetes |
| Scaling policy | Horizontal Pod Autoscaler, triggers per Part 10.2 (CPU > 70% sustained 5 min, or queue depth > 100) |
| Health check — liveness | `/healthz`, probed every 10s |
| Health check — readiness | `/readyz`, probed every 5s before receiving traffic |
| Health check — GPU inference service | Custom probe verifying model is loaded and responsive, not just process liveness |

## 11.5 Monitoring & Alerting

| Item | Detail |
|---|---|
| Metrics tooling | Prometheus + Grafana |
| Logging | Centralized structured logging |
| Tracing | OpenTelemetry, distributed across agent service calls |
| Metrics monitored | API latency (p50/p95/p99), error rate per endpoint, GPU utilization/queue depth, LLM API cost burn rate, escalation queue wait time, sync lag |
| Alert threshold — Warning | API p95 latency exceeds target for 5 min sustained; cost burn rate projected to exceed monthly threshold by >20% |
| Alert threshold — Critical | Error rate > 5% over 5 min; GPU instance unreachable; sync failure persists beyond Module 13's configured threshold |
| Escalation path | Warning → on-call engineer (Slack/email). Critical → on-call engineer + System Admin (SMS), within 1 minute — feeds into Module 16's alert rule registry (AI-BR-044) |

## 11.6 Backup & Recovery

| Item | Detail |
|---|---|
| What is backed up | PostgreSQL (full), Redis (snapshot), object storage (versioned, lifecycle-managed per Module 14 retention) |
| Frequency | PostgreSQL: continuous WAL + daily full snapshot. Redis: hourly snapshot. Object storage: versioning enabled |
| Retention period | PostgreSQL backups: 30 days. Redis snapshots: 7 days. Object storage: per Module 14 retention rules (90-day default, configurable) |
| Restoration procedure | Point-in-time recovery from WAL, documented runbook, target RTO 4 hours |
| Test schedule | Quarterly disaster-recovery drill — restore to staging, verify RPO/RTO targets met, results logged |

---

**Layer 4 Gate Check, Part 11:** ✅ All 6 sub-sections present with concrete, specific detail.

**Layer 4 (Parts 8–11) is now content-complete for P2.**

*P2 Master SRS — Part 11 of 17 + Appendices.*
