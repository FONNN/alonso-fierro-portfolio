# CLAUDE.md

## Despliegue

Los commits a `master` **no** disparan deploy automático — se probó esa vía (gancho de post-commit) y se decidió volver a manual, para que el despliegue a `furastudio.org` solo pase cuando se pida explícitamente.

**Desplegar a mano:** `/publicar` desde una sesión de Claude Code en este proyecto.

- `.claude/commands/publicar.md` corre `npm ci && npm run build`, verifica `dist/`, y despliega con la herramienta MCP `hosting_deploy` de `hostinger-hosting` (ruta **absoluta** a `dist/`, no relativa) — **reemplaza todo el contenido del sitio**, no es incremental.
- Después confirma que `https://furastudio.org` responde 200.

No hay gancho de git activo para esto (`core.hooksPath` no está seteado).
