# CLAUDE.md

## Despliegue

Cada commit en `master` dispara un deploy automático a `furastudio.org` (Hostinger), vía un hook de git:

- `.githooks/post-commit` llama a `scripts/deploy-on-commit.sh`, que lanza `claude -p "/publicar"` **en segundo plano** (no bloquea el commit) si la rama es `master`.
- `/publicar` (`.claude/commands/publicar.md`) corre `npm ci && npm run build`, verifica `dist/`, y despliega con la herramienta MCP `hosting_deploy` de `hostinger-hosting` — **reemplaza todo el contenido del sitio**, no es incremental.
- El hook usa un lock (`.git/deploy.lock`, un directorio — `mkdir` es atómico, a diferencia de un archivo) para no lanzar dos despliegues a la vez.

**Omitir el deploy en un commit puntual:**
```
SKIP_DEPLOY=1 git commit -m "wip, no publicar"
```

**Desplegar a mano** (sin esperar a un commit): `/publicar` desde una sesión de Claude Code en este proyecto.

**Ver qué pasó / errores:** `.git/deploy.log` (se va acumulando, no se limpia solo).

**Nota sobre `core.hooksPath`:** es una config *local* de este clon del repo (`git config core.hooksPath .githooks`), no viaja con el repo. Si cloneas este proyecto en otra máquina, hay que correr ese comando de nuevo ahí para que el hook quede activo.
