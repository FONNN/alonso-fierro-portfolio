import { site } from '../../content/site';
import { useScrollReveal } from '../../hooks/useScrollReveal';
import { useMagneticHover } from '../../hooks/useMagneticHover';
import profilePhoto from '../../assets/profile.webp';
import styles from './Approach.module.css';

export function Approach() {
  const ref = useScrollReveal<HTMLDivElement>();
  const arrowRef = useMagneticHover<HTMLAnchorElement>();

  return (
    <div className={styles.section} ref={ref} id="sobre-mi">
      <div className={styles.intro}>
        <img
          className={styles.photo}
          data-reveal
          src={profilePhoto}
          alt={`Foto de perfil de ${site.name}`}
          width={216}
          height={216}
          loading="lazy"
        />

        <div className={styles.textGroup}>
          <span className={styles.label} data-reveal>
            SOBRE MI ENFOQUE
          </span>

          <p className={styles.copy} data-reveal>
            Soy Alonso Fierro Urrutia, desarrollador web y diseñador UX/UI — Furastudio es donde
            uno ambos mundos.
            <br />
            <br />
            Ya sea una landing de marketing o una plataforma completa, priorizo código mantenible,
            tiempos de carga bajos y una experiencia cuidada de principio a fin.
            <br />
            <br />
            Sin atajos que después haya que pagar con intereses.
          </p>
        </div>
      </div>

      <a
        href="#proyectos"
        ref={arrowRef}
        className={styles.arrow}
        data-reveal
        aria-label="Ir a proyectos"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            d="M12 4v16M12 20l-6-6M12 20l6-6"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </a>
    </div>
  );
}
