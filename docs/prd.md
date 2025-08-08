# PRD — AI-first App Builder (Gemini + Next.js + Supabase + shadcn)

**One-liner:** Fast AI scaffold + live-preview for runnable full-stack apps — prompt → deployable Next.js (shadcn) + Supabase projects, paid export via Stripe, orchestrated by Gemini.

# Objective

Enable makers and founders to generate a working, deployable web app from a short natural-language prompt — including DB, auth, UI, CI, and a one-click export to GitHub/Vercel — with minimal friction and high determinism.

# Target users

* Solo founders who need an MVP fast
* Product designers & agencies prototyping for clients
* Internal teams building admin tools

# Key success metrics

* **Prompt → runnable preview rate ≥ 80%**
* **Time to first preview < 5 minutes (typical)**
* **Conversion: free → paid export ≥ 8%**
* **Weekly active projects per user** (retention signal)
* Error auto-fix success rate (auto-patch tests pass)

# Scope — MVP (what we ship first)

* Natural-language prompt UI + optional template picker
* Multi-stage generator: Planner (manifest) → DB SQL → API (OpenAPI) → UI JSON → file patches
* Live sandbox preview iframe (isolated container) showing runnable app
* Supabase integration for DB + Auth + seeded data
* Next.js + TypeScript + Tailwind + shadcn component set as default scaffold
* GitHub export (repo push) + Vercel deploy config
* Stripe checkout for paid exports/credits
* Gemini orchestration with strict schema outputs and low-temp planner calls
* CI smoke tests (tsc, lint, sample Playwright checks) before export

# User stories (MVP)

* As a founder, I write “build a todo app with user auth and tagging” and get a runnable app preview.
* As a designer, I pick “admin dashboard” template and customize fields via chat; preview updates live.
* As a user, I click “Export to GitHub” → repo created + GitHub Actions CI configured → optional Vercel deploy.
* As an admin, I buy credits via Stripe to enable exports and higher-tier preview builds.

# Acceptance criteria (examples)

* Given a prompt, the system returns a manifest (JSON) that lists pages, entities, integrations; manifest must validate against schema.
* Generated project builds (`pnpm build`) and passes basic smoke tests in sandbox.
* Preview loads in iframe without network access to user backend secrets.
* Exported repo includes `README`, `Dockerfile`, GitHub Actions, and Supabase migration SQL.

# Technical overview

**Core components**

* **Frontend UI:** Next.js + shadcn + Tailwind. Prompt/Chat, Template Gallery, Preview iframe, Export modal.
* **Orchestrator (service):** Node TS service that sequences Gemini calls, validates outputs, generates files, runs builds. Uses queue (Redis/Bull) for builds.
* **Generator stages:** Planner (manifest, temp=0.0) → DB SQL (temp=0.0) → API spec (temp=0.0) → UI JSON (temp=0.0) → File gen (temp=0.2, diff-mode).
* **Sandbox runner:** ephemeral container to install, build, and run smoke tests (isolated).
* **Storage:** Supabase for user/app metadata; S3 for artifacts.
* **Integrations:** Supabase (DB/Auth), GitHub (export), Vercel (deploy), Stripe (billing).
* **LLM gateway:** Gemini API client + prompt manager, function-calling schema for deterministic JSON outputs.

**Design system**

* Centralized design tokens in `index.css` + `tailwind.config.ts`. Use shadcn primitives & variants; avoid inline colors/class hacks. Theme via semantic tokens.

# Data model (high level)

* `users` (id, email, name, role)
* `workspaces` (id, owner\_id, name)
* `projects` (id, workspace\_id, manifest json, status)
* `apps` (id, project\_id, repo\_url, deploy\_url, build\_status)
* `billing` (user\_id, credits, subscription\_id)

# Gemini specifics (how we’ll use it)

* Use structured function-calls / JSON schema enforcement for planner + schema outputs.
* Low temperature (0.0) for manifest/schema; slightly higher (0.2) for file-level creative formatting.
* Always validate outputs with JSON Schema; run `tsc` and SQL linter as guardrails.
* Keep generation idempotent: hash manifests and patch only diffs.

# Security & compliance

* Never include secrets in model prompts; redact before logging.
* Preview sandbox must be network-restricted and ephemeral.
* Dependency scans (OSV/Snyk) and static analysis pre-export.
* Export user ownership: generated repo belongs to user account; clearly display license/ownership.

# Observability & QA

* CI checks: `pnpm lint`, `pnpm build`, Playwright smoke tests.
* Monitoring: Sentry for runtime, Prometheus or Vercel metrics for preview infra, PostHog for product analytics.
* Track generator failures and create auto-fix LLM loop for common error classes.

# Monetization model

* Freemium: X free previews/month, limited templates.
* Credits for exports and extra sandbox builds.
* Monthly team plans (more projects, priority builds).
* Paid “Maintenance agent” add-on that auto-updates dependencies & fixes runtime errors.

# Risks & mitigations

* **Hallucinated DB/logic** — mitigate via strict schema + validators + tests.
* **Build costs** — enforce credits, cache node\_modules/artifacts, limit concurrency.
* **Security exposure** — sandboxing + redaction + manual approval for exports.

# Launch deliverables (for a demo)

* Working demo: create a new project from prompt → live preview running example app.
* Export flow: GitHub repo and Vercel deploy completed.
* Billing: Stripe checkout enabling export credits.
* Docs: README with how to run locally and security/ownership notes.

