import { useEffect, useRef, type RefObject } from 'react';
import styles from './Reflector.module.css';

/**
 * Esfera de puntos (estilo "constelación") dibujada en Canvas 2D sobre
 * el mismo círculo que ocupa el blur de Reflector — a propósito sin
 * WebGL/Three.js: con ~100 partículas el costo de las conexiones
 * (O(n²)) es trivial incluso en mobile, y evita duplicar el peso del
 * bundle que ya tiene el sitio.
 *
 * El color (verde/dorado) se lee directamente de las clases que
 * Reflector ya alterna en `wrapperRef` (`.light`/`.hidden`), así no
 * hace falta un segundo IntersectionObserver ni estado compartido.
 */
const PARTICLE_COUNT = 110;
const SPHERE_RADIUS_RATIO = 0.42;
// El giro ambiental es casi imperceptible a propósito: el movimiento
// real que se nota es el del scroll (ver SCROLL_ROTATION_FACTOR) y el
// bamboleo vertical (FLOAT_*), que juntos dan la sensación de "flota"
// en vez de "gira solo".
const IDLE_ROTATION_SPEED = 0.00008;
const SCROLL_ROTATION_FACTOR = 0.0009;
const FLOAT_AMPLITUDE = 10;
const FLOAT_SPEED = 0.0006;
// 0.5 conectaba casi cualquier par de puntos: red densa tapando texto
// detrás (ej. "AL DÍA."). 0.27 se quedó corto (casi sin líneas). 0.34
// es el punto medio: se lee la constelación sin volverse malla sólida.
const CONNECT_DISTANCE = 0.34;
const POINTER_RADIUS = 90;
const POINTER_STRENGTH = 14;
const DAMPING = 0.9;

interface Particle {
  x: number;
  y: number;
  z: number;
  offsetX: number;
  offsetY: number;
}

function createParticles(count: number): Particle[] {
  const particles: Particle[] = [];
  const goldenAngle = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < count; i++) {
    const y = 1 - (i / (count - 1)) * 2;
    const radiusAtY = Math.sqrt(Math.max(0, 1 - y * y));
    const theta = goldenAngle * i;
    particles.push({
      x: Math.cos(theta) * radiusAtY,
      y,
      z: Math.sin(theta) * radiusAtY,
      offsetX: 0,
      offsetY: 0,
    });
  }
  return particles;
}

interface ParticleSphereProps {
  wrapperRef: RefObject<HTMLDivElement | null>;
}

export function ParticleSphere({ wrapperRef }: ParticleSphereProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    const particles = createParticles(PARTICLE_COUNT);
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let width = 0;
    let height = 0;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener('resize', resize);

    const pointer = { x: 0, y: 0, active: false };
    const onPointerMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      pointer.x = e.clientX - rect.left;
      pointer.y = e.clientY - rect.top;
      pointer.active = true;
    };
    const onPointerOff = () => {
      pointer.active = false;
    };
    // Eventos en window (no en el canvas, que tiene pointer-events: none):
    // en mobile `pointermove` solo dispara mientras el dedo toca la
    // pantalla (no hay hover), así que la interacción se "apaga" sola
    // entre toques sin lógica extra.
    window.addEventListener('pointermove', onPointerMove, { passive: true });
    window.addEventListener('pointerup', onPointerOff);
    window.addEventListener('pointercancel', onPointerOff);
    window.addEventListener('pointerleave', onPointerOff);

    let angle = 0;
    let lastTime = performance.now();
    let lastScrollY = window.scrollY;
    let frameId = 0;

    const projected = particles.map(() => ({ sx: 0, sy: 0, scale: 0 }));

    const draw = (time: number) => {
      const dt = time - lastTime;
      lastTime = time;
      const scrollDelta = window.scrollY - lastScrollY;
      lastScrollY = window.scrollY;
      angle += IDLE_ROTATION_SPEED * dt + scrollDelta * SCROLL_ROTATION_FACTOR;

      ctx.clearRect(0, 0, width, height);

      const isLight = wrapperRef.current?.classList.contains(styles.light);
      const [r, g, b] = isLight ? [212, 175, 55] : [61, 220, 90];

      const cx = width / 2;
      // Bamboleo vertical lento, independiente del giro: es lo que lee
      // como "flotando" en vez de solo "rotando en el sitio".
      const cy = height / 2 + Math.sin(time * FLOAT_SPEED) * FLOAT_AMPLITUDE;
      const radiusPx = Math.min(width, height) * SPHERE_RADIUS_RATIO;
      const focal = radiusPx * 2.2;
      const cos = Math.cos(angle);
      const sin = Math.sin(angle);

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        const rx = p.x * cos - p.z * sin;
        const rz = p.x * sin + p.z * cos;
        const scale = focal / (focal + rz * radiusPx);
        const baseX = cx + rx * radiusPx * scale;
        const baseY = cy + p.y * radiusPx * scale;

        if (pointer.active) {
          const dx = baseX - pointer.x;
          const dy = baseY - pointer.y;
          const dist = Math.hypot(dx, dy) || 1;
          if (dist < POINTER_RADIUS) {
            const force = (1 - dist / POINTER_RADIUS) * POINTER_STRENGTH;
            p.offsetX += (dx / dist) * force;
            p.offsetY += (dy / dist) * force;
          }
        }
        p.offsetX *= DAMPING;
        p.offsetY *= DAMPING;

        const proj = projected[i];
        proj.sx = baseX + p.offsetX;
        proj.sy = baseY + p.offsetY;
        proj.scale = scale;
      }

      ctx.lineWidth = 1;
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const a = particles[i];
          const b = particles[j];
          const d3 = Math.hypot(a.x - b.x, a.y - b.y, a.z - b.z);
          if (d3 < CONNECT_DISTANCE) {
            const pa = projected[i];
            const pb = projected[j];
            const depth = (pa.scale + pb.scale) / 2;
            const alpha = (1 - d3 / CONNECT_DISTANCE) * 0.22 * depth;
            ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${alpha})`;
            ctx.beginPath();
            ctx.moveTo(pa.sx, pa.sy);
            ctx.lineTo(pb.sx, pb.sy);
            ctx.stroke();
          }
        }
      }

      for (const p of projected) {
        const alpha = Math.min(1, p.scale) * 0.9;
        const size = Math.max(1, p.scale * 2.2);
        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${alpha})`;
        ctx.beginPath();
        ctx.arc(p.sx, p.sy, size, 0, Math.PI * 2);
        ctx.fill();
      }

      frameId = requestAnimationFrame(draw);
    };

    frameId = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener('resize', resize);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerOff);
      window.removeEventListener('pointercancel', onPointerOff);
      window.removeEventListener('pointerleave', onPointerOff);
    };
  }, [wrapperRef]);

  return <canvas className={styles.sphereCanvas} ref={canvasRef} aria-hidden="true" />;
}
