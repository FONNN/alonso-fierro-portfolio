# Portafolio — Alonso Fierro

Sitio de portafolio personal construido con **Vite + React + TypeScript**.
Estilo inspirado en landing pages de producto (fondo negro, tipografía
gigante, animaciones al hacer scroll) pero adaptado a un perfil
profesional en vez de un producto.

Esta guía asume que quien la lee es junior: cada decisión explica no
solo el "qué" sino el "por qué".

## Requisitos

- Node.js 20 o superior (se probó con Node 24).
- npm (viene con Node).

## Cómo levantar el proyecto

```bash
npm install
npm run dev
```

Esto abre un servidor local en `http://localhost:5173`. Los cambios en
el código se reflejan al instante en el navegador (Hot Module
Replacement de Vite), sin recargar la página a mano.

## Scripts disponibles

| Comando                | Qué hace                                                                    |
| ---------------------- | --------------------------------------------------------------------------- |
| `npm run dev`          | Servidor de desarrollo con recarga instantánea.                             |
| `npm run build`        | Compila TypeScript y genera la versión de producción en `dist/`.            |
| `npm run preview`      | Sirve localmente el contenido de `dist/`, tal cual quedaría en producción.  |
| `npm run lint`         | Revisa el código con [oxlint](https://oxc.rs) (reglas de React/TypeScript). |
| `npm run typecheck`    | Verifica los tipos de TypeScript sin generar archivos.                      |
| `npm run format`       | Formatea todo el código con Prettier.                                       |
| `npm run format:check` | Verifica el formato sin modificar archivos (útil en CI).                    |

Antes de subir un cambio, conviene correr `npm run typecheck && npm run lint && npm run build` para asegurarse de que todo compila.

## Editar el contenido real

**Todo el texto del sitio vive en un solo archivo:**
[`src/content/site.ts`](src/content/site.ts). Ahí están el nombre, el
correo, y los datos del proyecto destacado. Para añadir un proyecto
nuevo o cambiar el correo de contacto, se edita ese archivo — no hace
falta tocar ningún componente.

Los textos entre corchetes, como `[Descripción breve: ...]`, son
placeholders: avisan dónde falta un dato real. Reemplázalos antes de
publicar el sitio. Por las mismas reglas del proyecto, nunca se
inventan datos (ni testimonios, ni cifras, ni capturas) — si no hay un
dato real todavía, se deja el placeholder marcado.

## Estructura del proyecto

```
web/
├── index.html              # Punto de entrada HTML (meta tags, título)
├── public/
│   ├── favicon.svg
│   └── _headers            # Cabeceras de seguridad (ver docs/SEGURIDAD-Y-RENDIMIENTO.md)
├── src/
│   ├── main.tsx             # Arranque de React
│   ├── App.tsx              # Compone todas las secciones de la página
│   ├── content/
│   │   └── site.ts          # Todo el contenido real (nombre, correo, proyectos)
│   ├── sections/             # Una carpeta por sección de la página
│   │   ├── Nav/
│   │   ├── Hero/
│   │   ├── IntroPreview/
│   │   ├── Approach/
│   │   ├── FeaturedProject/
│   │   ├── Philosophy/
│   │   ├── AlwaysUpdated/
│   │   └── Footer/
│   ├── components/
│   │   └── GuideLines/       # Las líneas verticales punteadas decorativas
│   ├── hooks/
│   │   ├── useScrollReveal.ts   # Anima una sección al entrar en pantalla
│   │   └── useHeroIntro.ts      # Anima el titular al cargar la página
│   ├── lib/
│   │   ├── gsapConfig.ts     # Registro central de GSAP (un solo lugar)
│   │   ├── smoothScroll.ts   # Scroll suave (Lenis) + GSAP
│   │   └── motionPreference.ts # Detecta "reducir movimiento" del sistema
│   └── styles/
│       └── tokens.css        # Colores, tipografía y espaciados (design tokens)
└── docs/
    ├── ARQUITECTURA.md
    ├── ANIMACIONES.md
    └── SEGURIDAD-Y-RENDIMIENTO.md
```

Cada sección (`src/sections/<Nombre>/`) tiene dos archivos: el
componente (`.tsx`) y sus estilos (`.module.css`). Esto se llama **CSS
Modules**: las clases que escribes en el `.css` solo aplican dentro de
ese componente (Vite les añade un sufijo único por debajo), así que no
hay riesgo de que un `.title` de una sección choque con el `.title` de
otra.

## Documentación técnica

- [`docs/ARQUITECTURA.md`](docs/ARQUITECTURA.md) — por qué el proyecto
  está organizado así, y las decisiones de stack (por qué Vite, por
  qué CSS Modules y no Tailwind, etc).
- [`docs/ANIMACIONES.md`](docs/ANIMACIONES.md) — cómo funciona el
  sistema de animaciones de scroll, y cómo añadir una nueva sección
  animada.
- [`docs/SEGURIDAD-Y-RENDIMIENTO.md`](docs/SEGURIDAD-Y-RENDIMIENTO.md)
  — cabeceras de seguridad, presupuesto de rendimiento y checklist
  antes de publicar.

## Publicar el sitio

Este proyecto genera un sitio estático (`npm run build` produce
`dist/`), así que funciona en cualquier hosting de archivos estáticos:
[Netlify](https://netlify.com) (ya incluye `public/_headers` con las
cabeceras de seguridad listas para Netlify), Vercel, Cloudflare Pages,
GitHub Pages, etc. Sube la carpeta `dist/` generada por `npm run
build`, no el código fuente.
