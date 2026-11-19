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

# mkdir es atómico en POSIX (a diferencia de "test -e" + touch, que
# deja una ventana entre chequear y crear): confirmado con un caso
# real, dos commits a segundos de distancia alcanzaron a pasar el
# chequeo "[ -e ... ]" los dos antes de que ninguno tocara el lock.
LOCK=".git/deploy.lock"
if ! mkdir "$LOCK" 2>/dev/null; then
  echo "$(date -Iseconds) deploy ya en curso (lock presente), se omite este commit" >> .git/deploy.log
  exit 0
fi

# shortcut: el lock lo borra el propio proceso de fondo al terminar: si
# muere sin limpiar (ej. kill -9 o corte de luz), queda huerfano -- en
# ese caso borrar el directorio .git/deploy.lock a mano antes del
# siguiente commit.
(
  trap 'rmdir .git/deploy.lock' EXIT
  {
    echo "=== $(date -Iseconds) deploy commit $(git rev-parse --short HEAD) ==="
    # MSYS_NO_PATHCONV=1: sin esto, Git Bash reescribe "/publicar" como
    # una ruta de Windows (ej. C:/Program Files/Git/publicar) antes de
    # que llegue a claude -p -- confirmado en una corrida real del
    # gancho, donde solo funcionó porque el subproceso adivinó la
    # intención.
    MSYS_NO_PATHCONV=1 claude -p "/publicar" --allowedTools "Bash(npm ci:*)" "Bash(npm run build:*)" "Bash(curl:*)" "mcp__hostinger-hosting__execute"
    echo "=== fin $(date -Iseconds) ==="
  } >> .git/deploy.log 2>&1
) &

exit 0
