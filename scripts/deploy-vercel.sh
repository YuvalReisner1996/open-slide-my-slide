#!/usr/bin/env bash
# Redeploy production after editing slides. Requires: npx vercel login (once).
set -euo pipefail
cd "$(dirname "$0")/.."
npx vercel@latest pull --yes --environment=production
npx vercel@latest build --yes --prod
npx vercel@latest deploy --prebuilt --prod --yes
