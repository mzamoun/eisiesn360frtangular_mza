#!/usr/bin/env bash
# ci.sh — pipeline qualité local : lint → test → build → coverage summary
set -e

NODE="c:/nvm4w/nodejs/node"
NG="$NODE ./node_modules/@angular/cli/bin/ng"

echo "=== [1/3] Build (configuration development) ==="
$NG build --configuration development

echo "=== [2/3] Tests (ChromeHeadless + couverture) ==="
$NG test --watch=false --browsers=ChromeHeadless --code-coverage

echo "=== [3/3] CI terminée avec succès ==="
echo "Rapport de couverture disponible dans : coverage/"
