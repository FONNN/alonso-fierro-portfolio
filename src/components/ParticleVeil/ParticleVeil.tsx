import { useEffect, useRef } from 'react';
import styles from './ParticleVeil.module.css';

const STRANDS = 6;
const POINTS_PER_STRAND = 46;
const AMPLITUDE = 85;
const WAVELENGTH = 520;
// Con más tiras, menos separación entre ellas (antes 95 para 4) —
// mantiene el mismo ancho total del pañuelo pero más tupido/denso,
// que es lo que lo hace leerse más como tela y menos como hilos
// sueltos.
const STRAND_GAP = 58;
const TOP_MARGIN = 110; // que no arranque pegado al Nav
const COLOR = '61, 220, 90'; // --color-accent en rgb, fijo para todo el sitio
const HERO_ANCHOR_Y = 400; // centro visual aproximado del Hero, donde el pañuelo arranca "armado"
const SCATTER_STRENGTH = 130; // cuánto se dispersa cada punto en el tramo entre los dos anclajes

interface PointSeed {
  strand: number;
  index: number;
  size: number;
  scatterX: number;
  scatterY: number;
}

/**
 * El "pañuelo": no es polvo de partículas sueltas, es una tela que
 * fluye — varias tiras (`STRANDS`) de rombos conectados por una línea
 * fina, cada una ondulando con su propia onda senoidal (como pliegues
 * de un pañuelo de mago). Versión propia del efecto de constelación
 * de la referencia (Dala): misma idea de figura geométrica animada de
 * fondo, pero con la forma (rombo, del propio logo) y el color del
 * sitio, sin recrear la figura cerebral.
 *
 * El scroll es lo que mueve la ola, no solo el tiempo: `scrollY` entra
 * directo en la fase de la onda, así que al scrollear el pañuelo
 * ondula de verdad en respuesta — "acompaña" el recorrido en vez de
 * solo flotar aparte. Un reloj lento se suma para que también se vea
 * vivo sin scrollear.
 *
 * Se arma en el Hero, se dispersa al bajar, y se vuelve a armar justo
 * en Approach (`#sobre-mi`) — cada punto tiene su propio desvío fijo
 * (`scatterX/scatterY`, generado una sola vez) que se mezcla según
 * qué tan lejos esté de alguno de los dos anclajes; entre ambos el
 * desvío llega a su máximo (sensación de "se desarma"), en los
 * anclajes vuelve a 0 (forma limpia). Después de Approach sigue como
 * cinta continua por el resto del sitio, sin más dispersión.
 *
 * Un solo color fijo para todo el sitio (no cambia por sección): se
 * probó que cambiara de color sobre las secciones con tema claro,
 * pero para eso la capa tenía que ir POR ENCIMA del contenido en vez
 * de detrás, y terminaba traslapándose visualmente con otras
 * estructuras. Vuelve a ir detrás (como el resto de las capas
 * ambiente del sitio) — invisible sobre AlwaysUpdated, que tiene
 * fondo opaco propio, pero sin pisar nada en el resto del recorrido.
 *
 * Canvas 2D puro (sin librerías nuevas). Rombos dibujados solo de
 * contorno (`stroke`, no `fill`) — el aspecto "solo vértices" pedido.
 * Respeta `prefers-reduced-motion`: dibuja un solo frame estático
 * (fase y dispersión fijas en su valor de reposo) y no arranca el
 * loop.
 */
export function ParticleVeil() {
  const layerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const layer = layerRef.current;
    if (!canvas || !layer) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let width = 0;
    let height = 0;
    let frameId: number | undefined;
    let centerX = 0;
    let approachAnchorY = 1400;
    let seeds: PointSeed[] = [];

    const makeSeeds = () => {
      const result: PointSeed[] = [];
      for (let s = 0; s < STRANDS; s++) {
        for (let i = 0; i < POINTS_PER_STRAND; i++) {
          result.push({
            strand: s,
            index: i,
            size: 3 + ((i + s) % 3),
            scatterX: (Math.random() - 0.5) * 2,
            scatterY: (Math.random() - 0.5) * 2,
          });
        }
      }
      return result;
    };

    const resize = () => {
      width = layer.offsetWidth;
      height = layer.offsetHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      // El pañuelo cae sobre el lado derecho, donde el resto de las
      // secciones dejan más espacio libre (el texto suele ir a la
      // izquierda) — así no compite con el contenido.
      centerX = width * 0.76;
      seeds = makeSeeds();

      const layerTop = layer.getBoundingClientRect().top + window.scrollY;
      const approach = document.getElementById('sobre-mi');
      approachAnchorY = approach
        ? approach.getBoundingClientRect().top + window.scrollY - layerTop + approach.offsetHeight / 2
        : 1400;
    };

    // 0 en los dos anclajes (forma limpia), máximo a mitad de camino
    // entre ambos (dispersión total); 0 fuera de ese tramo.
    const scatterFactor = (y: number) => {
      if (y <= HERO_ANCHOR_Y || y >= approachAnchorY) return 0;
      const t = (y - HERO_ANCHOR_Y) / (approachAnchorY - HERO_ANCHOR_Y);
      return Math.sin(t * Math.PI);
    };

    const strandPosition = (seed: PointSeed, phase: number) => {
      const baseY = TOP_MARGIN + (seed.index / (POINTS_PER_STRAND - 1)) * (height - TOP_MARGIN);
      const strandOffset = (seed.strand - (STRANDS - 1) / 2) * STRAND_GAP;
      // Cada tira con su propia longitud de onda (no un múltiplo
      // exacto de las otras): así se separan y se juntan sin quedar
      // nunca sincronizadas del todo, como pliegues reales de tela —
      // con la misma onda para todas, convergían en un hilo fino.
      const strandWavelength = WAVELENGTH * (1 + (seed.strand - (STRANDS - 1) / 2) * 0.17);
      const sway =
        Math.sin(baseY / strandWavelength + phase + seed.strand * 1.3) * AMPLITUDE +
        Math.sin(baseY / (strandWavelength * 0.37) + phase * 1.6 + seed.strand) * (AMPLITUDE * 0.22);
      const scatterAmount = scatterFactor(baseY);
      const scatter = scatterAmount * SCATTER_STRENGTH;
      return {
        x: centerX + strandOffset + sway + seed.scatterX * scatter,
        y: baseY + seed.scatterY * scatter,
        scatterAmount,
      };
    };

    const drawDiamond = (x: number, y: number, size: number, alpha: number, color: string) => {
      ctx.beginPath();
      ctx.moveTo(x, y - size);
      ctx.lineTo(x + size, y);
      ctx.lineTo(x, y + size);
      ctx.lineTo(x - size, y);
      ctx.closePath();
      ctx.strokeStyle = `rgba(${color}, ${alpha})`;
      ctx.lineWidth = 1.2;
      ctx.stroke();
    };

    const draw = (phase: number) => {
      ctx.clearRect(0, 0, width, height);
      for (let s = 0; s < STRANDS; s++) {
        let prev: { x: number; y: number } | null = null;
        for (let i = 0; i < POINTS_PER_STRAND; i++) {
          const seed = seeds[s * POINTS_PER_STRAND + i];
          const p = strandPosition(seed, phase);
          // La línea que conecta con el punto anterior se desvanece
          // con la dispersión: a tela entera se ven las líneas, a
          // dispersión máxima solo quedan los rombos sueltos — así
          // "se desarma" en vez de verse como una maraña de hilos
          // cruzados.
          if (prev) {
            ctx.beginPath();
            ctx.moveTo(prev.x, prev.y);
            ctx.lineTo(p.x, p.y);
            ctx.strokeStyle = `rgba(${COLOR}, ${0.18 * (1 - p.scatterAmount)})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
          drawDiamond(p.x, p.y, seed.size, 0.6, COLOR);
          prev = p;
        }
      }
    };

    const tick = (t: number) => {
      const phase = window.scrollY / 260 + t / 7000;
      draw(phase);
      frameId = requestAnimationFrame(tick);
    };

    resize();

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion) {
      draw(0);
    } else {
      frameId = requestAnimationFrame(tick);
    }

    const onResize = () => {
      resize();
      if (reduceMotion) draw(0);
    };
    window.addEventListener('resize', onResize);

    return () => {
      window.removeEventListener('resize', onResize);
      if (frameId) cancelAnimationFrame(frameId);
    };
  }, []);

  return (
    <div className={styles.layer} aria-hidden="true" ref={layerRef}>
      <canvas className={styles.canvas} ref={canvasRef} />
    </div>
  );
}
