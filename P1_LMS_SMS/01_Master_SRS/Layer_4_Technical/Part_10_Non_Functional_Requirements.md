# PART 10 — NON-FUNCTIONAL REQUIREMENTS
## P1 — Learning Management System + School Management System
### Layer 4 — Technical & Architecture

**Status:** 🟡 Content Complete — Layer Gate Not Yet Passed

*Every metric below is a single exact value, not a range, per the writing standard governing this section. Where a setting is genuinely school-configurable (e.g. session timeout), the configurable range and its default are both stated explicitly rather than left as an open range.*

---

## 10.1 Performance

| Metric | Target Value | Measurement Method |
|---|---|---|
| API response time — p50 | < 100 ms | Application Performance Monitoring (APM) tooling per Part 11.5, measured at the API Gateway |
| API response time — p95 | < 300 ms | Same |
| API response time — p99 | < 800 ms | Same |
| Page load time — First Contentful Paint | < 1.5 s | Real User Monitoring (RUM) on 4G connection profile |
| Page load time — Time to Interactive | < 2.0 s | Same |
| Database query time — p95 (indexed queries) | < 50 ms | Database query monitoring (PostgreSQL `pg_stat_statements`) |
| Live class video latency (glass-to-glass) | < 500 ms | Synthetic monitoring against the Jitsi self-hosted instance and each integrated provider |
| AI quiz question generation — p95 | < 8 s per batch of 10 questions | APM on the AI Quiz Service (Part 8.8) |
| Bulk invoice generation throughput | ≥ 50 invoices/second | Load test against the async job queue (Section 9.2) |

## 10.2 Scalability

| Metric | Target Value | Measurement Method |
|---|---|---|
| Concurrent active users — Launch | 2,000 | Load testing prior to go-live (Part 15.4) |
| Concurrent active users — Year 1 | 20,000 | Load testing at each major scaling milestone |
| Concurrent active users — Year 3 | 100,000 | Load testing at each major scaling milestone |
| Concurrent live-class participants — single session | 49 (per Old SRS 4.1.1 tiled-grid limit) | Load test against the Live Class Service |
| Concurrent live-class sessions — platform-wide at Year 1 scale | 500 simultaneous sessions | Load test against the Live Class Service |
| Database read replica count — Year 1 | 2 | Infrastructure configuration (Part 11.1) |
| Auto-scaling trigger — CPU | Scale out at sustained CPU > 70% for 5 minutes | Infrastructure monitoring (Part 11.5) |
| Auto-scaling trigger — job queue depth | Scale out worker count at queue depth > 500 pending jobs | BullMQ/RabbitMQ queue monitoring |
| File storage growth — Year 1 projection | 50 TB (driven primarily by class recordings) | Storage utilisation monitoring |

## 10.3 Availability

| Metric | Target Value | Measurement Method |
|---|---|---|
| Uptime | 99.9% per calendar month | Uptime monitoring (synthetic checks every 60 seconds against the API Gateway and primary web app) |
| Maximum unplanned downtime | 43.2 minutes per calendar month (the residual of the 99.9% uptime target) | Same |
| Planned maintenance window | 1 window per month, maximum 2 hours, scheduled 02:00–04:00 in the school's configured timezone | Maintenance calendar (Part 11.2); planned windows are excluded from the uptime calculation above, per standard SLA convention, and communicated to School Admin at least 72 hours in advance |

## 10.4 Disaster Recovery

| Metric | Target Value | Measurement Method |
|---|---|---|
| RPO (Recovery Point Objective) | ≤ 15 minutes | Continuous PostgreSQL WAL archiving enabling point-in-time recovery (Part 11.6) |
| RTO (Recovery Time Objective) | ≤ 4 hours for full regional failover | Disaster recovery drill, conducted per the schedule in Part 11.6 |
| Backup frequency | Continuous WAL archiving + 1 full snapshot per day | Backup job monitoring |
| Backup retention | 35 days rolling | Backup retention policy (Part 11.6) |
| Disaster recovery drill frequency | 2 per year | Drill log and after-action report |

## 10.5 Security

*Encryption standards, authentication mechanisms, and OWASP-mapped controls are fully specified in Part 8.7 and Part 9.6 and are not restated here per Rule 5. This section states the numeric targets governing those controls.*

| Metric | Target Value | Measurement Method |
|---|---|---|
| Session timeout — default | 30 minutes of inactivity | Session monitoring; school-configurable within the 5–120 minute range already defined in Part 4, LMS-FR-185 |
| Access token lifetime | 15 minutes | Per Section 9.4.1 |
| Refresh token lifetime | 7 days, rotated on every use | Per Section 9.4.1 |
| Failed login lockout threshold | 5 consecutive failed attempts within 15 minutes | Authentication service logging |
| Failed login lockout duration | 15 minutes | Same |
| Full penetration test frequency | 2 per year, plus 1 additional test after any major architectural change | Third-party penetration test reports, logged against the audit trail |
| Dependency vulnerability scan frequency | Every CI/CD build (Part 11.3) | Automated SAST/dependency scanning tool output |
| Critical vulnerability patch SLA | 48 hours from disclosure | Patch deployment log |

## 10.6 Usability

| Metric | Target Value | Measurement Method |
|---|---|---|
| Maximum clicks to any primary dashboard action | 2 clicks from the relevant portal's dashboard | UI/UX design review against Part 7's screen specifications |
| Largest Contentful Paint (Core Web Vitals) | < 2.5 s | Lighthouse CI, run on every production deployment |
| Cumulative Layout Shift (Core Web Vitals) | < 0.1 | Same |
| Interaction to Next Paint (Core Web Vitals) | < 200 ms | Same |
| Mobile performance score | Lighthouse Performance score ≥ 90, measured on a mid-tier device profile (Moto G Power equivalent, simulated 4G) | Lighthouse CI |
| Onboarding completion rate (new School Admin) | ≥ 90% of onboarding wizard steps (Section 7.1.1) completed without abandonment | Funnel analytics on the onboarding wizard |

---

*Lighthouse Global School System — P1 Master SRS — Part 10 — Layer 4 — Internal — v1.0*
