import Lenis from 'lenis';
import { gsap, ScrollTrigger } from './gsapConfig';

/**
 * La instancia de Lenis vive en una sola variable de módulo para que
 * cualquier componente (ej. el menú mobile, que necesita bloquear el
 * scroll mientras está abierto) pueda pausarla sin tener que pasarla
 * por props desde App.
 */
let lenisInstance: Lenis | null = null;

/**
 * Pausa el scroll suave (lo usa el menú mobile mientras está abierto,
 * para que no se pueda scrollear la página de fondo). No afecta al
 * `overflow` del body — Lenis reimplementa el scroll a mano, así que
 * hay que pausar a Lenis mismo, no solo el CSS.
 */
export function pauseSmoothScroll(): void {
  lenisInstance?.stop();
}

export function resumeSmoothScroll(): void {
  lenisInstance?.start();
}

/**
 * Arranca el scroll suave (Lenis) y lo sincroniza con GSAP ScrollTrigger.
 *
 * Por qué existe este archivo: si cada componente creara su propia
 * instancia de Lenis tendríamos varios "motores" de scroll peleando
 * entre sí. Se llama una sola vez, desde App, y todas las animaciones
 * de scroll (useScrollReveal) quedan sincronizadas automáticamente
 * porque comparten el mismo ScrollTrigger.
 *
 * Devuelve una función de limpieza para usar en el `return` de un
 * `useEffect`.
 */
export function startSmoothScroll(): () => void {
  const lenis = new Lenis({
    duration: 1.1,
    smoothWheel: true,
  });
  lenisInstance = lenis;

  // Cada vez que Lenis mueve la página, ScrollTrigger debe enterarse
  // para recalcular qué elementos entraron o salieron de la vista.
  lenis.on('scroll', ScrollTrigger.update);

  // GSAP tiene su propio loop de animación (ticker); enganchamos a
  // Lenis ahí en vez de un setInterval propio para evitar dos loops
  // de render compitiendo por el mismo frame.
  const update = (time: number) => {
    lenis.raf(time * 1000);
  };
  gsap.ticker.add(update);
  // Lenis ya suaviza el scroll; si además dejamos el "lag smoothing"
  // de GSAP activo, los picos de carga generan saltos en vez de
  // ayudar.
  gsap.ticker.lagSmoothing(0);

  return () => {
    gsap.ticker.remove(update);
    lenis.destroy();
    lenisInstance = null;
  };
}
