# Template parameterization

The generator replaces the following placeholders across the repo:

- {{APP_NAME}}
- {{APP_DISPLAY_NAME}}
- {{APP_TAGLINE}}
- {{SUPABASE_PROJECT_ID}}
- {{STRIPE_CLI_PROJECT_NAME}}
- {{STRIPE_APP_NAME}}
- {{NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY}}

Populate `.env.local` from `.env.template` via `generator/transform.js`.


