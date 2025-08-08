Below is a compact, prioritized checklist and concrete mapping you can act on immediately to make `next-supabase-stripe-starter` usable as the canonical template for your AI agent.

---

## 1) Immediate repo clean-up & parameterization (must-do)

* Replace hardcoded `UPDATE_THIS_*` markers with template placeholders (e.g. `{{SUPABASE_PROJECT_ID}}`) and keep a `.env.template`.
* Make all external integrations configurable via env + `manifest` fields (Supabase, Stripe, Resend, Vercel).
* Add a clear `TEMPLATE.md` that documents where generator will substitute values.

---

## 2) Expose generator hooks (what your agent will call)

Add these files/endpoints so the agent can create runnable apps automatically:

* `generator/manifest.schema.json` — canonical manifest example showing mapping to this starter.
* `generator/transform.sh` (or Node script) — takes a manifest + replacements → applies to a repo copy (replace placeholders, run migrations/fixtures).
* `generator/seed-data.sql` — idempotent seed that the agent can toggle/extend.
* `generator/template-config.json` — fields agent can populate (app\_name, pages, products, plans, auth\_providers).

---

## 3) Manifest → starter mapping (concrete)

Use a manifest that maps directly to the starter’s concepts. Example manifest snippet your agent will produce for this starter:

```json
{
  "app_name":"my-crm",
  "pages":[
    {"id":"home","route":"/"},
    {"id":"pricing","route":"/pricing"},
    {"id":"account","route":"/account","auth":true}
  ],
  "entities":{
    "users":{"fields":[{"name":"email","type":"string","unique":true}]},
    "subscriptions":{"fields":[{"name":"stripe_price_id","type":"string"}]}
  },
  "integrations":{
    "supabase": {"project_id":"{{SUPABASE_PROJECT_ID}}"},
    "stripe": {"product_fixture":"stripe-fixtures.json"}
  },
  "deploy":{"type":"vercel","env":["NEXT_PUBLIC_SUPABASE_URL","NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY"]}
}
```

Agent must be able to:

* populate `.env.local` from `manifest.deploy.env`,
* update `stripe-fixtures.json` and call `stripe fixtures`,
* update Supabase project id in migration config and run migration scripts.

---

## 4) Add validation & smoke tests (required)

* `tests/smoke/playwright.spec.ts` covering: sign-up by email link, purchase flow (4242...), post-checkout account page.
* `ci/checks.sh` that runs: `pnpm install`, `pnpm build`, `pnpm lint`, `pnpm test`, Playwright smoke tests.
* Make CI script return structured JSON logs so the orchestrator can parse failures.

---

## 5) Make the template idempotent & safe (important)

* Migrations and seed fixtures must be idempotent (use `INSERT ... ON CONFLICT DO NOTHING`).
* Add `SECURITY.md` describing secrets handling and that the agent must not hardcode credentials.
* Add license header and `CODE_OWNERS` to clarify ownership of generated code.

---

## 6) Provide quick “preview mode” build target

* Add `package.json` script `preview:container` that builds the app and starts it on a fixed port for sandboxing.
* Add a Dockerfile optimized for quick builds and caching `node_modules` layers. This allows your sandbox runner to spin up previews fast.

---

## 7) CI / Export hooks

* `ci/export-check.sh` — runs security scans (OSV or Snyk), dependency license checks, and outputs a pre-export report.
* `generator/export-preset.json` — GH Actions and Vercel config templates agent will inject into exported repo.

---

## 8) Developer ergonomics for the agent

* Add `generator/example-manifests/` with 3 polished examples (Admin dashboard, SaaS with subscription, CRM). These serve as LLM few-shot examples.
* Add `generator/prompt-presets.md` that describes the concise prompt format the orchestrator will send to Gemini.

---

## 9) Telemetry & observability hooks

* Add an audit log endpoint or file (`logs/generator_events.log`) that the agent writes to for every generation step (manifest SHA, actions applied).
* Ensure build/test outputs are JSON-serializable so orchestration can parse errors and feed them back to the LLM for auto-fix.

---

## 10) Security & governance (gated)

* Add `generator/guardrails.json` listing disallowed operations (e.g., writing secrets, creating external network requests). The agent must consult it before applying patches.
* Add a “diff preview” script that produces a unified diff and an HTML preview the user must explicitly approve before export.

---

## Quick priority roadmap (what to implement in order)

1. Parameterize repo & add `env.template` + placeholder substitution script.
2. Add `manifest.schema.json` + 3 example manifests.
3. Add `generator/transform.js` to materialize a manifest into a repo copy (simple replacements + seed).
4. Add Dockerfile + `preview:container` script.
5. Add Playwright smoke tests and `ci/checks.sh`.
6. Add `ci/export-check.sh` with vulnerability scanning.
7. Add `generator/prompt-presets.md` + `guardrails.json`.
8. Integrate with orchestrator: accept manifest, apply transform, run `ci/checks.sh`, produce preview artifact.
