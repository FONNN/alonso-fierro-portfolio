# Arquitectura y decisiones de stack

Este documento explica el "por qué" detrás de las herramientas
elegidas. La idea es que si en el futuro alguien (incluido tú mismo,
en seis meses) se pregunta "¿por qué está armado así?", la respuesta
esté escrita.

## Vite en vez de Create React App / Next.js

El sitio es un portafolio: no necesita renderizado en servidor (SSR),
rutas dinámicas ni una API propia. Es contenido estático que se lee de
arriba hacia abajo. Para ese caso, **Vite** da lo que hace falta —
recarga instantánea en desarrollo y un build de producción optimizado
— sin la complejidad de un framework full-stack como Next.js. Create
React App está descontinuado desde hace tiempo, así que ni entra en la
comparación.

## TypeScript

Atrapa errores (un nombre de prop mal escrito, un `undefined` que se
te escapó) _antes_ de que lleguen al navegador, en vez de descubrirlos
en producción. Para un proyecto que una sola persona mantiene, esto
importa más, no menos: no hay un segundo par de ojos revisando cada
cambio en un code review.

## CSS Modules en vez de Tailwind o styled-components

Se evaluaron tres caminos:

1. **Tailwind**: rápido para prototipar, pero el diseño de este sitio
   usa muchos valores específicos y poco convencionales (tamaños de
   fuente enormes y fluidos con `clamp()`, posiciones absolutas para
   las formas decorativas). Terminaría siendo `className="text-[clamp(2.75rem,2rem+6vw,8.25rem)]"`
   por todos lados, lo que anula la ventaja de Tailwind (clases
   cortas y reutilizables).
2. **styled-components / CSS-in-JS**: añade una librería en tiempo de
   ejecución y complejidad extra para algo que CSS ya resuelve solo.
3. **CSS Modules** (elegido): es CSS normal — cualquiera que sepa CSS
   puede leerlo sin aprender una sintaxis nueva — pero cada archivo
   `.module.css` está automáticamente aislado por componente. Cero
   configuración adicional: Vite lo soporta de fábrica.

## Design tokens (`src/styles/tokens.css`)

Todos los colores, tamaños de fuente y espaciados salen de variables
CSS (`--color-bg`, `--fs-hero`, etc.) definidas en un solo archivo.
Ventaja concreta: si mañana el acento verde de "disponible" pasa a ser
azul, se cambia **una línea** en `tokens.css` en vez de buscar el color
`#3ddc5a` repetido en ocho archivos.

## Tipografía fluida con `clamp()`

El diseño original (la referencia de Dribbble) usa tamaños de letra
gigantes pensados para pantallas de escritorio. En vez de definir un
tamaño fijo y otro distinto por cada punto de quiebre (`@media`), se
usa `clamp(mínimo, valor-fluido, máximo)`: el tamaño de letra crece o
decrece junto con el ancho de la ventana, dentro de un rango. Esto
evita saltos bruscos entre "tamaño de celular" y "tamaño de
escritorio" y reduce la cantidad de media queries que hay que
mantener.

## GSAP + Lenis para animaciones (detalle en `docs/ANIMACIONES.md`)

Se explica en su propio documento porque es la parte más particular
del proyecto.

## Fuentes auto-hospedadas (`@fontsource/*`) en vez de Google Fonts

`@fontsource/anton` y `@fontsource/work-sans` empaquetan los archivos
de fuente como parte del proyecto, en vez de pedirlos a
`fonts.googleapis.com` en cada visita. Dos ventajas concretas:

- Una conexión externa menos en la carga de la página (mejor
  rendimiento, ver `docs/SEGURIDAD-Y-RENDIMIENTO.md`).
- El sitio sigue funcionando igual si Google Fonts cae o si el
  visitante tiene bloqueadores de rastreo que cortan conexiones a
  dominios de Google.

## Estructura por secciones, no por tipo de archivo

Podríamos haber organizado todo en `components/`, `styles/`, etc. por
separado. En cambio, cada sección de la página (`Hero`, `Footer`, ...)
tiene su propia carpeta con su componente y su CSS juntos:

```
src/sections/Hero/
├── Hero.tsx
└── Hero.module.css
```

Esto significa que para entender o cambiar la sección "Hero" solo hay
que abrir una carpeta, no saltar entre `components/Hero.tsx` y
`styles/hero.css` en partes distintas del árbol de archivos.
