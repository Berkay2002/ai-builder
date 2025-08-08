# Architecture Overview

An AI-first app generator that converts a natural-language prompt into a runnable Next.js + shadcn + Supabase project, runs deterministic validations in an ephemeral sandbox, and exports a CI-ready repo. Core goals: idempotent manifest-first generation, minimal diff patches, secure sandboxing, predictable costs (credits), and high automation (auto-fix loops).

# High-level components

* **Frontend (UI)** — Next.js + TypeScript + shadcn/Tailwind: Prompt/chat, template picker, preview iframe, export & billing UI.
* **Orchestrator API** — Node.js/TypeScript service: accepts prompts, validates requests, enqueues jobs, serves status.
* **Job Queue & Workers** — Redis + Bull (or similar): generation workers, build/smoke-test workers, export workers.
* **LLM Gateway** — Gemini wrapper + prompt manager: structured function-calling, schema validation, retry/backoff.
* **Generator Engine** — staged generators: Planner → DB SQL → OpenAPI → UI JSON → File generator (diff-mode).
* **File Store / Repo Store** — S3 or object storage for artifacts; Supabase for metadata; ephemeral git repos for user projects.
* **Sandbox Runner** — ephemeral containers (Docker) for `pnpm install` → `pnpm build` → Playwright smoke tests; strict network egress rules.
* **Export & CI** — GitHub integration (repo push), GitHub Actions / Vercel deployment pipeline.
* **Billing & Credits** — Stripe for purchases; credit accounting in Supabase.
* **Security & Scans** — static analysis, dependency vulnerability scans (OSV/Snyk), and prettier/tsc/lint gates.
* **Observability** — PostHog / Segment for product analytics, Sentry for runtime errors, Prometheus/Cloud metrics for infrastructure.

# Sequence (data flow)

1. User submits prompt via UI.
2. Orchestrator validates auth/credits and creates `project` record (Supabase).
3. Orchestrator enqueues a **Planner** job with prompt and templates.
4. **Planner** (Gemini, temp=0.0) returns canonical `manifest.json`. Persist manifest and hash.
5. If manifest passes JSON Schema → enqueue stage jobs: DB, API, UI.
6. Each generator stage (low-temp) emits structured artifacts. Store artifacts and compute diffs vs existing project.
7. File generator (temp \~0.2) emits minimal file patches `{path, content, sha}`. Worker applies patches to ephemeral git repo.
8. Sandbox worker runs `pnpm install`, `pnpm build`, `tsc`, `pnpm test` + Playwright smoke tests inside an isolated container.
9. If build/tests pass → save preview artifact and start ephemeral preview instance (iframe with proxy). If fail → capture logs and run auto-fix LLM loop limited to implicated files.
10. On user “Export” action: run export pipeline (dependency scan → security checks → git push to user’s GitHub → create GitHub Actions + Vercel config). Charge credits via Stripe if required.

# Generator stages (contract + guardrails)

* **Planner** → output: `manifest.json` (pages, entities, roles, integrations, routes). *Must* validate against JSON Schema.
* **DB** → output: normalized Postgres SQL + seed data. Validate with SQL linter.
* **API** → output: OpenAPI v3 spec (endpoints, RBAC) and tRPC/trpc-stub.
* **UI** → output: UI JSON (component tree, bindings) mapped to shadcn components.
* **Filegen** → output: file-level JSON array `{path, diff_or_full, sha}`. Only patch minimal lines; always include `sha` to prevent race conditions.

# Preview sandbox rules

* Ephemeral container per preview (TTL: short).
* Strict egress policy — only allow internal service calls (no arbitrary external network).
* Mount ephemeral object storage for assets.
* Resource quotas per user and queue-based concurrency.
* UI preview served via secure proxy to iframe; sandbox origin isolated.

# Export pipeline (pre-export checks)

* Run `pnpm build`, `tsc`, eslint, Playwright smoke tests.
* Run dependency vulnerability scan and license check.
* Produce a pre-export diff and security report for user approval.
* Push repo to user GitHub or provide ZIP. Optionally trigger Vercel deploy.

# Auth & Permissions

* Use Supabase Auth + JWT for user sessions.
* Orchestrator RBAC: `owner`, `editor`, `viewer`. Only owners can export or charge credits.
* Model-use logging is redacted: never store raw prompts containing secrets; use redaction pipeline.

# Credits & Billing

* Preview builds consume credits; small free quota per month.
* Export/priority builds consume larger credits.
* Stripe integration: one-time credit purchases, recurring plans. All purchases recorded in Supabase billing table.

# Resilience, scaling & cost controls

* Use Redis+Bull for backpressure and priority queues (preview < export priority).
* Cache node\_modules/artifacts between builds (layered Docker, S3 for `node_modules` cache shards).
* Autoscale worker pool by queue length; enforce per-user concurrency limits.
* Implement cold/warm pools for sandbox containers to reduce startup latency.

# Security & compliance

* Redact secrets from prompts & logs.
* Static analysis + dependency scanning pre-export.
* Provide SOC/enterprise SLA as paid offering (private models, VPC connectors).
* Data retention policy and audit logs for actions that modify repos or export code.

# Observability & metrics

* Track: prompt→manifest success rate, manifest→preview success rate, time-to-preview, export conversion, auto-fix success rate, credits consumption.
* Tools: PostHog for product metrics, Sentry for errors, Prometheus/CloudWatch for infra, and centralized log store (ELK).

# Minimal API surface (examples)

* `POST /api/projects` — start generation (body: prompt, template\_id).
* `GET  /api/projects/:id/status` — job status & artifacts.
* `POST /api/projects/:id/export` — trigger export (requires credits).
* `GET  /api/projects/:id/preview` — signed URL for iframe preview.
* Webhook: `POST /webhooks/github` — handle repo creation callbacks.

# Deployment topology (diagram)

```mermaid
graph LR
  UI[Next.js UI] --> ORC[Orchestrator API]
  ORC --> Q[Redis / Bull Queue]
  Q --> W1[Generator Worker]
  Q --> W2[Sandbox Worker]
  subgraph LLM
    GG[Gemini Gateway]
  end
  W1 --> GG
  W1 --> Store[S3 (artifacts) / Supabase]
  W2 --> Store
  W2 --> Preview[Preview Proxy / Ephemeral Instance]
  ORC --> Stripe
  ORC --> GitHub
  GitHub --> Vercel
  ORC --> Observability[Sentry / PostHog / Prometheus]
```

# Implementation notes / best practices

* Use strict JSON Schema and low-temperature LLM calls for manifest & schema stages.
* Keep filegen idempotent by hashing manifests and storing per-project `manifest_sha`. Reject filegen if manifest changed mid-job.
* Always present diffs before applying patches or exporting.
* Limit auto-fix loops (e.g., max 2 auto-patch attempts) and surface results to the user.
* Instrument every generation step with telemetry so you can improve templates and prompts.

---

If you want, I’ll convert this into a concise sequence of infra IaC primitives (Terraform module list + Docker base images) or produce the `manifest.json` schema next — tell me which.
