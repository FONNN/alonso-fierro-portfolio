import { featuredProjects } from '../../content/site';
import { useScrollReveal } from '../../hooks/useScrollReveal';
import { ProjectBento, type ProjectBentoItem } from '../../components/ProjectBento/ProjectBento';
import kadigestionShot from '../../assets/bento/kadigestion-scroll.webp';
import saborYRomanceShot from '../../assets/bento/saboryromance-scroll.webp';
import styles from './FeaturedProject.module.css';

// Mapeo manual por nombre (no por índice): con solo 2-3 proyectos reales
// es más simple y a prueba de reordenamientos en `featuredProjects` que
// un arreglo paralelo de capturas.
const SHOT_BY_NAME: Record<string, string> = {
  KadiGestión: kadigestionShot,
  'Sabor & Romance': saborYRomanceShot,
};

const items: ProjectBentoItem[] = featuredProjects.flatMap((project, index) => {
  const src = SHOT_BY_NAME[project.name];
  if (!src) return [];
  return [{ project, src, size: index === 0 ? 'lg' : 'md' }];
});

export function FeaturedProject() {
  const ref = useScrollReveal<HTMLDivElement>();

  return (
    <section
      className={styles.section}
      ref={ref}
      id="proyectos"
      aria-labelledby="proyectos-destacados"
    >
      <p className={styles.eyebrow} data-reveal id="proyectos-destacados">
        PROYECTOS DESTACADOS
      </p>

      <div data-reveal>
        <ProjectBento items={items} />
      </div>
    </section>
  );
}
