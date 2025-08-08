# Security notes

- Do not commit real secrets. Use `.env.local` (gitignored) derived from `env.template`.
- The generator never writes secrets to the repo; it only substitutes placeholders in memory and writes `.env.local` locally.
- Preview containers run with restricted egress.


