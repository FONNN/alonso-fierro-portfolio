# Seguridad y rendimiento

Este proyecto es un sitio estático (sin backend propio, sin base de
datos, sin login), así que la superficie de ataque es chica. Aun así,
se aplican las prácticas que sí corresponden a este tipo de sitio.

## Cabeceras de seguridad (`public/_headers`)

El archivo [`public/_headers`](../public/_headers) usa la sintaxis de
[Netlify](https://docs.netlify.com/manage/routing/headers/) (se copia
tal cual a `dist/` en el build) y define:

- **`Content-Security-Policy` (CSP)**: le dice al navegador de qué
  orígenes puede cargar cada tipo de recurso. Aquí está configurada
  como `'self'` en casi todo — es decir, "solo desde este mismo
  sitio" — porque las fuentes están auto-hospedadas (ver
  `docs/ARQUITECTURA.md`) y no hay scripts ni estilos de terceros. Una
  CSP así de estricta bloquea de raíz ataques de tipo XSS que dependan
  de cargar un script desde un dominio externo. La única excepción es
  `img-src`, que además de `'self' data:` permite `picsum.photos` y
  `fastly.picsum.photos` (este último es adonde Picsum redirige la
  imagen real): son las fotos genéricas de relleno del bento grid en
  `IntroPreview` (ver `web/src/sections/IntroPreview/IntroPreview.tsx`)
  — sin esta excepción el navegador las bloquea silenciosamente aunque
  el código esté bien.
- **`X-Frame-Options: DENY`** y **`frame-ancestors 'none'`**: impiden
  que el sitio se pueda incrustar en un `<iframe>` en otra página
  (protección contra _clickjacking_, donde un sitio malicioso superpone
  botones invisibles sobre el tuyo).
- **`X-Content-Type-Options: nosniff`**: evita que el navegador
  intente "adivinar" el tipo de un archivo distinto al declarado.
- **`Referrer-Policy: strict-origin-when-cross-origin`**: cuando
  alguien hace clic en un link que sale del sitio, solo se comparte el
  dominio de origen, no la URL completa (que podría filtrar
  información innecesaria al sitio de destino).
- **`Permissions-Policy`**: desactiva explícitamente el acceso a
  cámara, micrófono y geolocalización, que este sitio no usa.

Si el sitio se publica en un hosting distinto a Netlify (Vercel,
Cloudflare Pages, etc.), hay que trasladar estas mismas cabeceras al
formato de configuración de ese proveedor — el archivo `_headers` tal
cual solo lo interpreta Netlify.

## Buenas prácticas ya aplicadas en el código

- **Ningún estilo inline (`style="..."`)** en el HTML final: todo pasa
  por CSS Modules. Esto es lo que permite que la CSP no necesite
  `'unsafe-inline'` en `style-src` — cada excepción que se le agrega a
  una CSP es una puerta menos cerrada.
- **`target="_blank"` siempre junto con `rel="noopener noreferrer"`**
  (ver `FeaturedProject.tsx`): sin esto, una pestaña abierta con
  `target="_blank"` puede acceder a `window.opener` y redirigir la
  pestaña original a un sitio de phishing (ataque conocido como
  _reverse tabnabbing_).
- **Sin `dangerouslySetInnerHTML`** en ningún componente: todo el texto
  se renderiza como texto, nunca como HTML crudo. Si en el futuro se
  agrega un formulario de contacto o un CMS, cualquier contenido que
  venga de un usuario o de una API externa debe seguir esta misma
  regla — nunca insertarlo como HTML sin sanitizar antes.
- **`.gitignore`** ya excluye `node_modules`, `dist` y `*.local`
  (donde Vite espera variables de entorno sensibles si se agregan más
  adelante, ej. `.env.local`).

## Rendimiento

- **Fuentes auto-hospedadas** (`@fontsource`): una petición externa
  menos, ver `docs/ARQUITECTURA.md`.
- **Tipografía fluida con `clamp()`**: evita cargar tamaños de fuente
  redundantes por breakpoint.
- **Animaciones solo con `opacity`/`transform`**, aceleradas por GPU,
  y que corren una sola vez por sección (`once: true`) — detalle
  completo en `docs/ANIMACIONES.md`.
- **`prefers-reduced-motion`** desactiva el scroll suave y las
  animaciones para quien lo pida, ahorrando CPU en equipos modestos.
- **CSS Modules** en vez de una librería de estilos en tiempo de
  ejecución: el CSS final es un archivo estático que el navegador
  cachea, sin costo de JavaScript para aplicar estilos.

### Números actuales (`npm run build`)

- JavaScript: ~363 KB (~121 KB con gzip) — incluye React 19, GSAP,
  ScrollTrigger y Lenis.
- CSS: ~17 KB (~3.6 KB con gzip).
- Fuentes: se generan varios archivos `.woff2`/`.woff` por familia y
  variante de idioma (esto es normal en `@fontsource`), pero el
  navegador **solo descarga el o los que realmente necesita** según
  los caracteres del texto (gracias a `unicode-range` en cada
  `@font-face`) — no se transfieren todos.

### Qué falta para cuando haya contenido real

Estos puntos no se resolvieron ahora porque todavía no hay archivos
reales que optimizar (fotos, capturas de proyectos):

- Cuando se agreguen imágenes reales (capturas de proyectos, foto de
  perfil), usarlas en formato **WebP o AVIF**, con los atributos
  `width` y `height` siempre presentes (evita saltos de layout
  mientras cargan) y `loading="lazy"` en las que están más abajo en la
  página.
- Si el bundle de JavaScript crece bastante más allá de los ~121 KB
  actuales, considerar cargar GSAP de forma diferida (ver la nota al
  final de `docs/ANIMACIONES.md`).

## Checklist antes de publicar

- [x] Reemplazar los placeholders de `src/content/site.ts` (descripción
      y tecnologías del proyecto destacado) — completado 2026-09-18
      revisando el preview real de KadiGestión.
- [ ] Reemplazar `[Vista previa de un proyecto]` y
      `[Captura del proyecto]` por capturas reales, en WebP/AVIF.
- [ ] Reemplazar `[Foto de proceso]` y `[Detalle de código]` si se
      quiere usar fotos reales (si no, se puede dejar la sección sin
      esas fotos — ver la regla del proyecto de no usar contenido de
      relleno).
- [ ] Agregar `public/og-image.png` (1200×630) — es la imagen que se
      muestra al compartir el link en LinkedIn/WhatsApp/X. Sin este
      archivo, esas vistas previas salen sin imagen.
- [ ] Reemplazar `[URL_DEL_SITIO_PUBLICADO]` en `index.html`
      (etiqueta `og:url`) por el dominio real una vez publicado.
- [ ] Correr `npm run typecheck && npm run lint && npm run build`
      sin errores.
- [ ] Revisar el sitio en un teléfono real (no solo en el navegador
      de escritorio) antes de publicar.
- [ ] Si se publica en un hosting que no sea Netlify, trasladar las
      cabeceras de `public/_headers` al formato de ese proveedor.
