---
description: Build y deploy de este proyecto a furastudio.org (Hostinger)
---

Despliega el sitio a producción (`furastudio.org`, hosting compartido en Hostinger). Hacé esto en orden, sin saltarte pasos, y sin pedir confirmación intermedia (esto corre tanto a mano como desde el hook de post-commit):

1. **Build**: corré `npm ci && npm run build` en la raíz del proyecto (`web/`). Si falla, parate ahí y reportá el error completo — no sigas al deploy con un build roto.

2. **Verificá `dist/`**: confirmá que existen `dist/index.html`, `dist/assets/` (con al menos un archivo adentro) y `dist/.htaccess`. Si falta alguno, parate y decí cuál.

3. **Deploy**: usá la herramienta MCP de Hostinger — operación `hosting_deploy`, servidor `hostinger-hosting` — con:
   - `domain: "furastudio.org"`
   - `path: "dist"` (ruta local; la herramienta arma el paquete sola, no hace falta comprimir nada a mano)
   - `message`: una línea corta describiendo el cambio (ej. el resumen del último commit)

   Esta operación **reemplaza todo el contenido del sitio** — es la operación de despliegue real, no una de prueba. Solo usá `hosting_deploy`; no uses ninguna otra operación de `hostinger-hosting` (nada de crear sitios, bases de datos, cron jobs, etc.) ni ningún otro servidor de Hostinger (DNS, dominios, facturación).

4. **Verificá**: hacé una petición a `https://furastudio.org` y confirmá que responde `200`. Si no, reportalo — no asumas que salió bien solo porque `hosting_deploy` no tiró error (el deploy estático es inmediato según la propia herramienta, pero igual verificá).

5. **Cerrá con un resumen de una sola línea**: algo como `✅ Deploy OK — furastudio.org responde 200 (commit <hash corto>)` o, si algo falló, en qué paso y por qué.
