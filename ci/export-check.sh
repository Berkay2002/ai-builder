#!/usr/bin/env bash
set -euo pipefail

echo '{"stage":"vuln-scan","tool":"osv-scanner","status":"skipped"}'
echo '{"stage":"license-scan","status":"skipped"}'

./ci/checks.sh

echo '{"status":"ok"}'


