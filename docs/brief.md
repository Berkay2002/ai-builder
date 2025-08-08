# Project brief — AI-first app generator (Gemini + Next.js + Supabase)

**One-liner:** Instant, production-capable web apps from a single prompt — generate, preview, and export deployable Next.js (shadcn/Tailwind) + Supabase projects with Gemini orchestration.

# Who it’s for

* Solo founders who need an investable MVP fast.
* Designers/agencies wanting production-ready prototypes.
* Internal teams building admin tools and dashboards.

# Core promise

Turn natural-language requirements into a runnable, sandboxed app preview and a CI-ready GitHub repo (optionally deployed to Vercel) — with deterministic manifests, automated validation, and a paid export pipeline.

# MVP scope (what you must deliver)

* Prompt → canonical `manifest.json` (pages, entities, roles, integrations).
* Deterministic staged generation: DB SQL → OpenAPI → UI JSON → code patches.
* Live sandbox preview (iframe) running a containerized build.
* Supabase integration (DB + Auth + seed data).
* Export to GitHub + Vercel deploy config.
* Stripe-based credit/checkout for exports.
* Gemini used for planning and file gen (low-temp manifest + controlled file generation).

# Core capabilities (short)

* Strict schema-driven planner (idempotent).
* File diff/patch mode (only change minimal files).
* Build & smoke-test gate (`pnpm build`, `tsc`, Playwright checks) before preview/export.
* Auto-fix loop: targeted LLM patches for failing tests.
* User ownership: full repo zip + push to user’s GitHub.

# Tech stack

* Frontend: Next.js + TypeScript + Tailwind + shadcn.
* Backend/orchestrator: Node.js/TypeScript service, job queue (Redis/Bull).
* DB/Auth: Supabase.
* LLM: Gemini API (function-calling + JSON schema).
* CI/Deploy: GitHub Actions → Vercel.
* Billing: Stripe.

# Architecture (concise)

* **API**: orchestrator accepts prompt → enqueues generation job.
* **Generator**: sequential LLM stages (planner → schema → api → ui → files).
* **Validation**: static checks + containerized smoke tests.
* **Preview**: ephemeral sandbox per project with network restrictions.
* **Export**: gated by credits; scans & dependency checks pre-push.

# Differentiators

* Idempotent manifest-first pipeline (reliable, repeatable app generation).
* Minimal patching: keep user codebase small and human-readable.
* Auto-maintenance agent (paid add-on) that proactively patches builds and deps.

# Key success metrics

* Prompt → runnable-preview rate (target: ≥80%).
* Export conversion (free → paid) (target: ≥8%).
* Median time-to-preview (target: minutes).
* Auto-fix success rate (tests passing after first auto-patch).

# Major risks & mitigations

* LLM hallucinations → strict low-temp manifest + JSON schema validation + tests.
* Build cost → credit model, caching, concurrency limits.
* Security exposure → sandboxing, redaction of secrets, dependency scanning.

# Monetization

* Freemium previews + paid credits for exports and priority builds.
* Monthly team plans (more projects, private models, SLA).
* Maintenance agent and template marketplace as add-ons.

# Immediate next actions (do now)

1. Finalize `manifest.json` schema and Gemini system prompt (strict, low-temp).
2. Implement orchestrator skeleton: prompt intake → planner → manifest validation.
3. Wire a minimal generator that emits a runnable Next.js scaffold + Supabase SQL and runs `pnpm build` in a sandbox.
4. Add GitHub export + Stripe checkout gate.
5. Create 3 polished templates (Admin dashboard, SaaS starter, CRM) to maximize prompt success.

If you want, I’ll produce the **manifest.json schema + Gemini system prompt** and a **copy-paste orchestrator workflow** next — ready to plug into your runner. Which one should I generate now?
