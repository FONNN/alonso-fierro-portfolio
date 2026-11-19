/**
 * Todo el contenido real del sitio vive en este archivo.
 *
 * La idea es que para cambiar el nombre, el correo o añadir un
 * proyecto nuevo NO haga falta tocar ningún componente: solo editar
 * los valores de aquí.
 *
 * Los textos entre corchetes, ej. "[algo]", son placeholders: todavía
 * no hay un dato real para ese campo. Reemplázalos antes de publicar
 * el sitio.
 */

export const site = {
  name: 'Alonso Fierro',
  role: 'Desarrollador Web Full-Stack',
  email: 'contacto@furastudio.org',
  available: true,
  location: 'Remoto',
  bookingUrl: 'https://calendar.app.google/fzyqRiMxs83sZEh59',
  // Número personal por ahora (ver WhatsAppButton.tsx), formato wa.me
  // (sin "+", sin espacios).
  whatsapp: '56942304695',
};

export interface ProjectHighlight {
  alt: string;
  caption: string;
}

export interface Project {
  name: string;
  url?: string;
  description: string;
  /** Una línea corta para la tarjeta del bento (ver ProjectVideoBento), distinta de `description`. */
  tagline: string;
  tags: string[];
  /** Capturas reales del proyecto para la galería tipo highlights (ver HighlightsGallery, hoy sin uso). */
  highlights?: ProjectHighlight[];
}

/**
 * Datos reales revisados directamente en el preview del sitio
 * (https://kadigestion-preview.netlify.app) el 2026-09-18: sitio
 * estático (HTML/CSS/JS, sin framework detectado), tipografías
 * Fraunces + Inter vía Google Fonts, alojado en Netlify. Reserva de
 * hora integrada con Google Calendar/Meet (widget embebido en la
 * sección de contacto) y contacto directo por WhatsApp Business.
 */
const kadigestion: Project = {
  name: 'KadiGestión',
  url: 'https://www.kadigestion.cl',
  description:
    'Sitio para una firma de auditoría, contabilidad, finanzas y RR.HH. que entrega transparencia financiera y cumplimiento normativo a comunidades (condominios) y pymes en Santiago de Chile. Permite agendar una reunión por Google Calendar/Meet o escribir directo por WhatsApp desde el mismo sitio.',
  tagline: 'Transparencia financiera para condominios y pymes en Santiago de Chile.',
  tags: ['HTML/CSS/JS', 'Google Calendar', 'WhatsApp Business'],
  // Los archivos de imagen correspondientes (en orden) están en
  // web/src/assets/gallery/kadi-0{1..4}-*.jpg — se importan directo en
  // FeaturedProject.tsx (Vite necesita imports estáticos para poder
  // procesar/optimizar las imágenes, no funciona con rutas dinámicas).
  // Sin uso desde que ProjectVideoBento reemplazó al carrusel de
  // HighlightsGallery, se deja tal cual por si se vuelve a necesitar.
  highlights: [
    {
      alt: 'Sección de inicio de KadiGestión',
      caption: 'Transparencia financiera para condominios y pymes en Santiago de Chile.',
    },
    {
      alt: 'Sección de pilares de KadiGestión',
      caption: 'Tres pilares: área financiera, gestión de RR.HH. y cumplimiento normativo.',
    },
    {
      alt: 'Sección de equipo de KadiGestión',
      caption: 'Más de 13 años de trayectoria conjunta de sus socios fundadores.',
    },
    {
      alt: 'Sección de contacto de KadiGestión',
      caption: 'Agenda una reunión por Google Calendar o escribe directo por WhatsApp.',
    },
  ],
};

/**
 * Datos reales revisados directamente en el preview del sitio
 * (https://saboryromance-preview.netlify.app/es/landing/) el
 * 2026-11-12: Astro (rutas de assets bajo /_astro/, confirmado también
 * por el spec del proyecto) + GSAP, alojado en Netlify. La cotización
 * se arma en el mismo sitio (servicios, tipo de evento, invitados) y se
 * envía por WhatsApp con el link `wa.me` y el mensaje ya redactado, sin
 * backend propio. Sin `url`: el dominio oficial (saboryromances.cl)
 * todavía muestra una versión anterior y distinta del sitio, así que
 * por ahora no se linkea para no mandar a un visitante a algo que no
 * coincide con esta descripción.
 */
const saborYRomance: Project = {
  name: 'Sabor & Romance',
  description:
    'Bar romántico para matrimonios y celebraciones en Chile. Arman su propia carta de cócteles (tres paquetes a elegir) y suman charcutería fina o café de especialidad como extras. La cotización se arma en el mismo sitio y se envía directo por WhatsApp con el detalle y el total estimado.',
  tagline: 'Bar romántico, charcutería fina y café de especialidad para matrimonios y eventos.',
  tags: ['Astro', 'GSAP', 'WhatsApp Business'],
};

export const featuredProjects: Project[] = [kadigestion, saborYRomance];
