# PART 10 — NON-FUNCTIONAL REQUIREMENTS
## Product: P2 — AI Marketing & Sales RevOps Engine
### Layer 4 — Technical & Architecture | Audience: Architects, Developers, DevOps, Security

*All metrics stated as exact targets — no ranges where a single number is achievable.*

---

## 10.1 Performance

| Metric | Target |
|---|---|
| API response time (non-LLM endpoints), p50 | < 150ms |
| API response time (non-LLM endpoints), p95 | < 300ms |
| API response time (non-LLM endpoints), p99 | < 800ms |
| Agent response time (LLM-bound: chat/voice), p50 | < 2s |
| Agent response time (LLM-bound), p95 | < 5s |
| Agent response time (LLM-bound), p99 | < 8s |
| Admin web app page load time | < 2s on broadband; Largest Contentful Paint < 2.5s |
| Database query time (indexed queries), p95 | < 100ms |
| Voice call connect latency (initiation to first audio) | < 2s |
| Voice audio round-trip latency | < 300ms |

## 10.2 Scalability

| Metric | Launch | Year 1 | Year 3 |
|---|---|---|---|
| Concurrent internal admin users | 50 | 200 | 1,000 |
| Concurrent prospect conversations (chat+voice) | 100 | 500 | 2,000 |
| Total lead records | 50,000 | 500,000 | 5,000,000 |

**Auto-scaling triggers**: Agent service pods scale horizontally when CPU utilization exceeds 70% sustained for 5 minutes, or when conversation queue depth exceeds 100 pending. GPU inference tier does not auto-scale (single instance, Part 1 Constraint 1); load beyond GPU capacity overflows to the commercial API tier via the LLM Router.

## 10.3 Availability

| Metric | Target |
|---|---|
| Uptime | 99.5% per month at launch (single-region) |
| Planned maintenance window | ≤ 4 hours/month, scheduled during the deployment's lowest-traffic window |
| Unplanned downtime limit | < 3.6 hours/month |

## 10.4 Disaster Recovery

| Metric | Target |
|---|---|
| RPO (max data loss) | 1 hour, via continuous WAL archiving |
| RTO (max recovery time) | 4 hours, full service restoration |
| Backup frequency | Continuous WAL streaming + daily full snapshot |
| Backup retention | 30 days |

## 10.5 Security

| Metric | Target |
|---|---|
| Encryption at rest | AES-256 |
| Encryption in transit | TLS 1.3 |
| Auth token expiry | JWT expires after 8 hours, refresh token rotation enforced |
| Admin session idle timeout | 30 minutes |
| Penetration test frequency | Annual, plus after any major architecture change |

## 10.6 Usability

| Metric | Target |
|---|---|
| Max clicks to primary admin action | 2 clicks from Dashboard |
| Time to Interactive (admin web app, 4G) | < 3s |
| Mobile performance score (Google Lighthouse) | ≥ 85 |
| Prospect chat widget interactive load time (3G-equivalent) | < 2s |

---

**Layer 4 Gate Check, Part 10:** ✅ All 6 categories present. ✅ Every metric has a single exact target value.

*P2 Master SRS — Part 10 of 17 + Appendices.*
