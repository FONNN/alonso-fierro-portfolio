import { useRef } from 'react';
import { gsap, useGSAP } from '../lib/gsapConfig';

interface ColorTarget {
  /** Selector CSS, evaluado dentro de la sección (no global). */
  selector: string;
  /** Color final hacia el que se anima (scrub 1:1 con el scroll). */
  to: string;
}

interface ColumnParallaxOptions {
  /** Color final del fondo de la sección. */
  backgroundTo: string;
  /** Uno o más grupos de texto/ícono que invierten de color junto al fondo. */
  colorTargets: ColorTarget[];
  /** Distancia base (px) de la columna más rápida (speed = 1) en desktop. */
  baseDistance?: number;
  /**
   * Distancia base en mobile (<= 719.98px, mismo corte que el resto del
   * sitio). Por defecto es 1/4 de `baseDistance`: en mobile el gap entre
   * el texto y la galería es mucho más chico, así que el mismo recorrido
   * que en desktop hace que las columnas más rápidas terminen tapando el
   * headline (bug real, visto en la verificación).
   */
  mobileBaseDistance?: number;
  /**
   * Punto (0-1) del recorrido total en el que RECIÉN empieza a cambiar
   * el color. Antes de este punto el fondo se queda en su valor inicial
   * (default 0: empieza de inmediato). Importante: el trigger arranca
   * ('top bottom') una altura de viewport ANTES de que la sección sea
   * visible, así que con colorStart en 0 la sección ya aparece a medio
   * transicionar (gris lavado, texto sin contraste) apenas se empieza a
   * ver. Con colorStart > 0 se queda oscura un tramo después de
   * aparecer, y el cambio de color pasa rápido en vez de arrastrarse.
   */
  colorStart?: number;
  /** Cuánto dura el tramo de cambio de color (0-1), a partir de `colorStart`. */
  colorDuration?: number;
}

const MOBILE_BREAKPOINT = 719.98;

/**
 * Galería de columnas con parallax a distintas velocidades + scrub de
 * color de fondo y texto, investigado a partir de `section_parallax`
 * en creativegiants.art (ver docs/ANIMACIONES.md). Cada columna recibe
 * su propio factor en `speeds`. A diferencia de un fade a opacity 0,
 * `colorTargets` anima el color del texto en paralelo al fondo para
 * que quede legible durante todo el scroll ("tema invertido": termina
 * con los colores de fondo/texto del sitio intercambiados).
 *
 * Ojo con la duración de cada tween: todas llevan una `duration`
 * explícita. Sin esto GSAP usa 0.5 por defecto y, al ser el tween más
 * largo el que define la duración total del timeline, el fondo y las
 * columnas terminaban de animarse a la mitad del scroll en vez de a lo
 * largo de todo el recorrido de la sección (bug real, visto en la
 * verificación). Las columnas usan `duration: 1` (todo el recorrido);
 * el color usa `colorDuration` para poder terminar antes.
 */
export function useColumnParallax<T extends HTMLElement>(
  speeds: number[],
  {
    backgroundTo,
    colorTargets,
    baseDistance = 260,
    mobileBaseDistance,
    colorStart = 0,
    colorDuration = 1,
  }: ColumnParallaxOptions,
) {
  const sectionRef = useRef<T | null>(null);
  const columnRefs = useRef<(HTMLElement | null)[]>([]);

  useGSAP(
    () => {
      const section = sectionRef.current;
      if (!section) return;

      const isMobile = window.innerWidth <= MOBILE_BREAKPOINT;
      const distance = isMobile ? (mobileBaseDistance ?? baseDistance / 4) : baseDistance;

      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        },
      });

      columnRefs.current.forEach((column, index) => {
        if (!column) return;
        const speed = speeds[index] ?? 1;
        timeline.to(column, { y: -distance * speed, ease: 'none', duration: 1 }, 0);
      });

      timeline.to(
        section,
        { backgroundColor: backgroundTo, ease: 'none', duration: colorDuration },
        colorStart,
      );

      colorTargets.forEach(({ selector, to }) => {
        const els = section.querySelectorAll(selector);
        if (els.length > 0) {
          timeline.to(els, { color: to, ease: 'none', duration: colorDuration }, colorStart);
        }
      });
    },
    { scope: sectionRef },
  );

  const setColumnRef = (index: number) => (el: HTMLElement | null) => {
    columnRefs.current[index] = el;
  };

  return { sectionRef, setColumnRef };
}
