import { useEffect, useRef } from 'react';
import styles from './ParticleVeil.module.css';

const STRANDS = 4;
const POINTS_PER_STRAND = 46;
const AMPLITUDE = 85;
const WAVELENGTH = 520;
const STRAND_GAP = 95; // separación horizontal entre pliegues del "pañuelo"
const TOP_MARGIN = 110; // que no arranque pegado al Nav
const COLOR = '61, 220, 90'; // --color-accent en rgb

interface Point {
  x: number;
  y: number;
  size: number;
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
 * Canvas 2D puro (sin librerías nuevas). Rombos dibujados solo de
 * contorno (`stroke`, no `fill`) — el aspecto "solo vértices" pedido.
 * Respeta `prefers-reduced-motion`: dibuja un solo frame estático
 * (fase fija en 0) y no arranca el loop.
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
    };

    const strandPoint = (strand: number, i: number, phase: number): Point => {
      const y = TOP_MARGIN + (i / (POINTS_PER_STRAND - 1)) * (height - TOP_MARGIN);
      const strandOffset = (strand - (STRANDS - 1) / 2) * STRAND_GAP;
      // Cada tira con su propia longitud de onda (no un múltiplo
      // exacto de las otras): así se separan y se juntan sin quedar
      // nunca sincronizadas del todo, como pliegues reales de tela —
      // con la misma onda para las 4, convergían en un hilo fino.
      const strandWavelength = WAVELENGTH * (1 + (strand - (STRANDS - 1) / 2) * 0.17);
      const sway =
        Math.sin(y / strandWavelength + phase + strand * 1.3) * AMPLITUDE +
        Math.sin(y / (strandWavelength * 0.37) + phase * 1.6 + strand) * (AMPLITUDE * 0.22);
      return {
        x: centerX + strandOffset + sway,
        y,
        size: 3 + ((i + strand) % 3),
      };
    };

    const drawDiamond = (x: number, y: number, size: number, alpha: number) => {
      ctx.beginPath();
      ctx.moveTo(x, y - size);
      ctx.lineTo(x + size, y);
      ctx.lineTo(x, y + size);
      ctx.lineTo(x - size, y);
      ctx.closePath();
      ctx.strokeStyle = `rgba(${COLOR}, ${alpha})`;
      ctx.lineWidth = 1.2;
      ctx.stroke();
    };

    const draw = (phase: number) => {
      ctx.clearRect(0, 0, width, height);
      for (let s = 0; s < STRANDS; s++) {
        let prev: Point | null = null;
        for (let i = 0; i < POINTS_PER_STRAND; i++) {
          const p = strandPoint(s, i, phase);
          if (prev) {
            ctx.beginPath();
            ctx.moveTo(prev.x, prev.y);
            ctx.lineTo(p.x, p.y);
            ctx.strokeStyle = `rgba(${COLOR}, 0.18)`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
          drawDiamond(p.x, p.y, p.size, 0.6);
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
