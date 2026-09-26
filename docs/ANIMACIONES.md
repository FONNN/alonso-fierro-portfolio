# Cómo funcionan las animaciones

Todos los elementos del sitio —títulos, texto, imágenes/placeholders y
elementos de fondo como las líneas punteadas— aparecen con el mismo
gesto: **fade + traslación en Y** (entran desde un poco más abajo,
mientras se desvanecen de transparente a opaco). Hay dos variantes de
cuándo se dispara, y es importante no confundirlas porque están
implementadas de forma distinta:

1. **Lo que ya está a la vista al cargar la página** (el Nav, el
   titular del hero, las líneas de fondo) se anima al _montar_ el
   componente — no tiene sentido esperar a un scroll que quizás no
   llegue a pasar por ahí.
2. **Todo lo demás** se anima al _hacer scroll_ — cada elemento
   aparece justo cuando entra en la pantalla.

Además, toda la página tiene **scroll suave** (un efecto tipo
"inercia" al desplazarte, en vez del scroll seco por defecto del
navegador).

## Las piezas

| Archivo                        | Rol                                                                                                              |
| ------------------------------ | ---------------------------------------------------------------------------------------------------------------- |
| `src/lib/gsapConfig.ts`        | Registra los plugins de GSAP **una sola vez** y define la curva de easing `focusPull`. Todo lo demás importa GSAP desde aquí, nunca directo de `'gsap'`. |
| `src/lib/smoothScroll.ts`      | Arranca Lenis (scroll suave) y lo sincroniza con GSAP ScrollTrigger.                                             |
| `src/hooks/useMountReveal.ts`  | Animación de entrada para lo que ya está a la vista al cargar (Nav, Hero, líneas de fondo).                      |
| `src/hooks/useScrollReveal.ts` | Animación de aparición al hacer scroll, reutilizable en cualquier sección.                                       |

## La curva de animación (`focusPull`)

Todas las animaciones de scroll/montaje del sitio, más las transiciones
de hover (links, botones, el ícono del menú mobile), usan la misma
curva: `cubic-bezier(0.52, 0.01, 0, 1)`, registrada como `focusPull` en
`gsapConfig.ts` (para JS/GSAP) y escrita literal en cada `.module.css`
que la necesita (para transiciones CSS — no hay forma de compartir una
constante entre CSS y TypeScript sin herramientas extra, así que se
repite el mismo valor a mano).

Es una curva de "arranque lento, freno decidido" — se toma de una
referencia de estilo que usó este proyecto para su sección de
animaciones (ver el histórico del proyecto), pensada para que el
movimiento se sienta más cinematográfico que la curva por defecto de
GSAP (`power3.out`). Las manchas de `AmbientGlow` además usan esta
curva para un pulso lento continuo (opacidad + escala, ~6.5s, en loop)
independiente del scroll — así el fondo se siente "vivo" incluso sin
que el usuario se mueva.

## Por qué GSAP y no CSS puro, ni Framer Motion

- **CSS puro con `@keyframes`** funciona bien para animaciones simples,
  pero coordinar "esta sección se anima solo cuando el usuario la ve
  por primera vez, y en cascada elemento por elemento" requiere saber
  _cuándo_ un elemento entra en pantalla — eso es JavaScript
  (`IntersectionObserver`), no CSS. GSAP con su plugin **ScrollTrigger**
  ya resuelve ese problema, probado en miles de sitios en producción.
- **Lenis** para el scroll suave: es una librería enfocada en una sola
  cosa (suavizar el scroll) y pesa poco. Se sincroniza con GSAP para
  que ambas cosas compartan el mismo "reloj" de animación en vez de
  competir por el mismo frame.
- GSAP y todos sus plugins (incluido ScrollTrigger) son **gratuitos**
  desde que Webflow adquirió GreenSock en 2024 — antes algunos plugins
  eran de pago, ya no es el caso.
- Se usa `@gsap/react` (el hook oficial `useGSAP`) en vez de escribir
  el `useEffect` a mano: limpia las animaciones automáticamente al
  desmontar un componente, y evita que el modo `StrictMode` de React
  (que en desarrollo monta los componentes dos veces a propósito, para
  detectar bugs) duplique una animación por error.

## Cómo añadir una nueva sección animada

Copia este patrón (ya usado en `Approach.tsx`, `Philosophy.tsx`, etc.):

```tsx
import { useScrollReveal } from '../../hooks/useScrollReveal';
import styles from './MiSeccion.module.css';

export function MiSeccion() {
  const ref = useScrollReveal<HTMLDivElement>();

  return (
    <div className={styles.section} ref={ref}>
      <h2 data-reveal>Este título se anima</h2>
      <p data-reveal>Este párrafo se anima un poco después (cascada)</p>
    </div>
  );
}
```

Reglas:

- El `ref` va en el contenedor de la sección completa.
- Cada elemento que quieras animar por separado lleva el atributo
  `data-reveal` — un título, un párrafo, una imagen, un ícono, una
  forma decorativa de fondo: todos usan el mismo atributo. Si no
  marcas ningún hijo, se anima la sección entera como un solo bloque.
- El orden en el HTML determina el orden de la cascada (stagger).

Si el elemento ya está a la vista al cargar la página (como el Nav),
usa `useMountReveal` en vez de `useScrollReveal` — mismo patrón,
misma animación, pero se dispara al montar en vez de con
ScrollTrigger (ver `Nav.tsx` y `GuideLines.tsx` como ejemplo).

## Por qué esto NO ralentiza el sitio (rendimiento)

Este es el punto que más importa para un sitio que se promociona por
ser rápido:

1. **Solo se anima `opacity` y `transform` (traslación en Y).** Estas
   son las dos únicas propiedades que el navegador puede animar sin
   recalcular el layout de la página (se resuelven directo en la GPU).
   Animar `width`, `height`, `top`/`left` o `margin` obliga al
   navegador a recalcular la posición de todo lo que está alrededor en
   cada fotograma — eso es lo que hace que una animación se sienta
   "trabada". Aquí no se hace en ningún lado.
2. **`once: true` en cada ScrollTrigger.** Cada sección se anima **una
   sola vez** la primera vez que aparece en pantalla. Si el usuario
   sube y baja la página, no se vuelve a calcular ni animar — ScrollTrigger
   directamente deja de escuchar esa sección después de la primera vez.
3. **El contenido siempre es visible por CSS, incluso sin JavaScript.**
   El estado "invisible" (`opacity: 0`) lo aplica GSAP con JavaScript
   _justo antes_ de animar, nunca por CSS. Si por algún motivo el
   JavaScript tarda en cargar (o falla), el contenido nunca queda
   oculto por accidente — se ve directamente, sin animación. Esto es
   lo opuesto a la técnica (más común, y más frágil) de esconder todo
   con CSS por defecto y esperar a que JavaScript lo revele.
4. **Decisión consciente: `prefers-reduced-motion` NO se respeta aquí.**
   Es una preferencia que cualquier persona puede activar en su
   sistema operativo (Ajustes de accesibilidad) para pedir menos
   movimiento en pantalla — algunas personas la activan porque el
   movimiento les genera mareo real (vestibular disorders), no solo
   por gusto. Lo normal, y lo que este mismo proyecto tenía antes, es
   respetarla y desactivar animaciones cuando está activa. Para este
   sitio se decidió explícitamente lo contrario, a pedido directo:
   las animaciones se ven siempre, igual para todo el mundo, para que
   el sitio se vea consistente con la referencia de diseño. Si en el
   futuro se quiere revertir esto, la forma correcta es volver a
   consultar `window.matchMedia('(prefers-reduced-motion: reduce)')`
   dentro de `useMountReveal` y `useScrollReveal` antes de animar (así
   estaba implementado originalmente).

## Un número real: cuánto pesan estas librerías

`npm run build` reporta un bundle de JavaScript de **~363 KB**
(**~121 KB comprimido con gzip**, que es lo que de verdad viaja por la
red). Ahí entra React 19 + GSAP + ScrollTrigger + Lenis. Es un peso
razonable para un sitio con animación real (muchos sitios de agencia
pesan 2-3 veces más), pero si en el futuro se vuelve un problema, el
siguiente paso sería cargar GSAP de forma diferida (`import()` en vez
de `import` estático) para que no bloquee el primer render — no se
hizo ahora porque hoy no hace falta, y añadir ese código antes de
necesitarlo sería complejidad de más.
