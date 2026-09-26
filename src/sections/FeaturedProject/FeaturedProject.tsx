import { featuredProject } from '../../content/site';
import { useScrollReveal } from '../../hooks/useScrollReveal';
import { HighlightsGallery } from '../../components/HighlightsGallery/HighlightsGallery';
import kadiHero from '../../assets/gallery/kadi-01-hero.webp';
import kadiPilares from '../../assets/gallery/kadi-02-pilares.webp';
import kadiEquipo from '../../assets/gallery/kadi-03-equipo.webp';
import kadiContacto from '../../assets/gallery/kadi-04-contacto.webp';
import styles from './FeaturedProject.module.css';

const GALLERY_IMAGES = [kadiHero, kadiPilares, kadiEquipo, kadiContacto];

const slides = (featuredProject.highlights ?? []).map((highlight, index) => ({
  src: GALLERY_IMAGES[index],
  width: 1200,
  height: 670,
  alt: highlight.alt,
  caption: highlight.caption,
}));

export function FeaturedProject() {
  const ref = useScrollReveal<HTMLDivElement>();

  return (
    <section
      className={styles.section}
      ref={ref}
      id="proyectos"
      aria-labelledby="proyecto-destacado"
    >
      <p className={styles.eyebrow} data-reveal id="proyecto-destacado">
        PROYECTO DESTACADO
      </p>

      {slides.length > 0 && (
        <div className={styles.galleryWrap} data-reveal>
          <HighlightsGallery slides={slides} />
        </div>
      )}

      <div className={styles.meta}>
        <div>
          <h2 className={styles.name} data-reveal>
            {featuredProject.url ? (
              <a href={featuredProject.url} target="_blank" rel="noopener noreferrer">
                {featuredProject.name}
              </a>
            ) : (
              featuredProject.name
            )}
          </h2>
          <p className={styles.description} data-reveal>
            {featuredProject.description}
          </p>
          <div className={styles.tags} data-reveal>
            {featuredProject.tags.map((tag) => (
              <span key={tag} className={styles.tag}>
                {tag}
              </span>
            ))}
          </div>
        </div>

        {featuredProject.url && (
          <a
            href={featuredProject.url}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.link}
            aria-label={`Ver ${featuredProject.name}`}
            data-reveal
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path
                d="M4 12h16M14 6l6 6-6 6"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </a>
        )}
      </div>
    </section>
  );
}
