#!/usr/bin/env bash
# Dispara /publicar en segundo plano después de un commit a master.
# Pensado para correr desde .githooks/post-commit (ver ese archivo y
# CLAUDE.md, sección "Despliegue").
set -euo pipefail

cd "$(git rev-parse --show-toplevel)"

# Este repo no tiene rama "main" -- la principal se llama "master".
branch="$(git rev-parse --abbrev-ref HEAD)"
if [ "$branch" != "master" ]; then
  exit 0
fi

# Via de escape para commits que no se quieren publicar:
#   SKIP_DEPLOY=1 git commit -m "wip, no publicar"
if [ "${SKIP_DEPLOY:-0}" = "1" ]; then
  exit 0
fi

LOCK=".git/deploy.lock"
if [ -e "$LOCK" ]; then
  echo "$(date -Iseconds) deploy ya en curso (lock presente), se omite este commit" >> .git/deploy.log
  exit 0
fi
touch "$LOCK"

# shortcut: el lock lo borra el propio proceso de fondo al terminar: si
# muere sin limpiar (ej. kill -9 o corte de luz), queda huerfano -- en
# ese caso borrar .git/deploy.lock a mano antes del siguiente commit.
(
  trap 'rm -f .git/deploy.lock' EXIT
  {
    echo "=== $(date -Iseconds) deploy commit $(git rev-parse --short HEAD) ==="
    claude -p "/publicar" --allowedTools "Bash(npm ci:*)" "Bash(npm run build:*)" "Bash(curl:*)" "mcp__hostinger-hosting__execute"
    echo "=== fin $(date -Iseconds) ==="
  } >> .git/deploy.log 2>&1
) &

exit 0
