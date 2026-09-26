import { useRef } from 'react';
import { gsap, useGSAP } from '../lib/gsapConfig';

interface RevealOptions {
  /** Distancia (px) desde la que entran los elementos. */
  y?: number;
  duration?: number;
  /** Retraso entre elementos cuando hay más de uno marcado con data-reveal. */
  stagger?: number;
  /**
   * Si es true, la animación se repite cada vez que el elemento entra o
   * sale de pantalla (fade-in al aparecer, fade-out al salir por
   * cualquiera de los dos bordes), en vez de dispararse una sola vez.
   * Pensado para bloques que el usuario puede cruzar varias veces yendo
   * y volviendo con el scroll (ej. el bento grid de IntroPreview).
   */
  repeat?: boolean;
}

/**
 * Revela una sección cuando entra en pantalla al hacer scroll.
 *
 * Cómo usarlo en un componente:
 *   const ref = useScrollReveal<HTMLElement>();
 *   <section ref={ref}> ... </section>
 *
 * Si dentro de esa sección marcas varios elementos con
 * `data-reveal="true"`, cada uno se anima en cascada (stagger) en vez
 * de moverse todos a la vez. Con `repeat: true` los hijos van marcados
 * `data-reveal-repeat` (no `data-reveal`) — un atributo distinto a
 * propósito: si un `useScrollReveal({ repeat: true })` queda anidado
 * dentro de otro `useScrollReveal()` normal (ej. el bento grid dentro
 * de la sección completa), `querySelectorAll` del hook de afuera
 * también encontraría esos hijos si compartieran el mismo atributo,
 * animándolos dos veces con dos ScrollTriggers distintos.
 *
 * El elemento SIEMPRE es visible por CSS (opacity: 1 por defecto).
 * Este hook solo añade el estado "oculto" justo antes de animar, con
 * JavaScript. Así, si el script todavía no cargó, el contenido nunca
 * queda invisible por accidente.
 *
 * Nota: a pedido explícito del proyecto, esta animación se muestra
 * siempre, sin excepción para `prefers-reduced-motion` (ver
 * docs/ANIMACIONES.md para el detalle de esa decisión).
 *
 * Usa `useGSAP` (el hook oficial de GSAP para React) en vez de un
 * `useEffect` a mano: limpia las animaciones automáticamente al
 * desmontar y evita que el modo StrictMode de React duplique la
 * animación en desarrollo.
 */
export function useScrollReveal<T extends HTMLElement>({
  y = 70,
  duration = 1.1,
  stagger = 0.1,
  repeat = false,
}: RevealOptions = {}) {
  const ref = useRef<T | null>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;

      const items = el.querySelectorAll(repeat ? '[data-reveal-repeat]' : '[data-reveal]');
      const targets = items.length > 0 ? items : el;

      gsap.fromTo(
        targets,
        { opacity: 0, y },
        {
          opacity: 1,
          y: 0,
          duration,
          stagger,
          ease: 'focusPull',
          scrollTrigger: repeat
            ? {
                // Un solo punto de referencia (48%, un poco antes de la
                // mitad de pantalla) para las dos direcciones: bajando,
                // cruzarlo hace fade-in (onEnter); volviendo a subir y
                // cruzándolo de nuevo hace fade-out (onLeaveBack). Tiene
                // que ser menor a la posición de reposo del elemento en
                // scrollY=0 (medido: 62% desktop, 55% mobile, porque el
                // Hero no ocupa el 100vh) — si no, GSAP encuentra la
                // condición ya cumplida al montar y dispara el fade-in
                // sin que el usuario haya scrolleado (bug real, visto en
                // la verificación).
                trigger: el,
                start: 'top 48%',
                toggleActions: 'play none none reverse',
              }
            : {
                trigger: el,
                start: 'top 82%',
                once: true,
              },
        },
      );
    },
    { scope: ref },
  );

  return ref;
}
