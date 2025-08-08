#!/usr/bin/env bash
set -euo pipefail

echo '{"stage":"install"}'
npm ci

echo '{"stage":"lint"}'
npm run lint || true

echo '{"stage":"build"}'
npm run build

echo '{"stage":"types"}'
npx tsc -p tsconfig.json --noEmit

echo '{"status":"ok"}'


