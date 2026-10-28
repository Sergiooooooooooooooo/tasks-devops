#!/usr/bin/env bash
# Prueba de humo: la URL debe responder 200 y contener el título de la app.
# Uso: bash scripts/smoke-test.sh https://tareas-dev.web.app
set -euo pipefail
URL="${1:?Falta la URL}"

for intento in 1 2 3 4 5; do
  code=$(curl -s -o /tmp/smoke.html -w "%{http_code}" "$URL" || true)
  if [ "$code" = "200" ] && grep -q "<title>Tareas</title>" /tmp/smoke.html; then
    echo "OK: $URL respondió 200 y contiene la app (intento $intento)"
    exit 0
  fi
  echo "Intento $intento: HTTP $code, reintentando en 5 s..."
  sleep 5
done
echo "FALLO: $URL no pasó la prueba de humo"
exit 1
