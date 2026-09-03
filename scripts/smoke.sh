#!/usr/bin/env bash
# Smoke: a static-export site has no server to probe, so the gate is "the
# turbo build completes and the exported site exists". Repo-local smoke;
# the template's standalone-server smoke does not apply to output:export.
set -euo pipefail

echo "building..."
npm run build

echo "checking static export..."
test -f apps/web/out/index.html
echo "smoke: all green (export present)"
