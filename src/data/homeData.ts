// src/data/homeData.ts

export const HOME_CONFIG = {
  // CONFIGURACIÓN VISUAL (Para ajustar sin tocar CSS)
  style: {
    heroTitleSize: "clamp(3.5rem, 10vw, 6rem)", // Tamaño responsivo
    heroTaglineSpacing: "19px",                 // Espaciado de letras
    backgroundBrightness: "0.9",                // 0.1 (muy oscuro) a 1.0 (normal). 0.5 es un punto medio ideal.
    backgroundContrast: "1.2",                  // Realza los colores de las fotos
    glassBlur: "25px",                          // Intensidad del efecto cristal
  },

  // CONTENIDO DE TEXTO
  content: {
    titlePart1: "PAGE",
    titlePart2: "MODELOS",
    tagline: "EXCLUSIVIDAD EN CADA DETALLE",
    description: "La plataforma premium que redefine la conexión con el talento más selecto de la región, bajo un estándar de elegancia y privacidad.",
  },

  // ETIQUETAS SEO (Para Helmet o Meta tags)
  seo: {
    title: "PageModelos | Agencia de Modelos Premium & Tours VIP",
    description: "Descubre las mejores modelos profesionales, tours exclusivos y eventos de gala. Seguridad, exclusividad y talento verificado.",
    keywords: "modelos, tours VIP, rifas exclusivas, agencia de modelos, eventos premium",
    ogImage: "https://tu-dominio.com/preview-image.jpg",
  },

  // CONFIGURACIÓN DEL CARRETE (SLIDER)
  slider: {
    speed: "50s", // Cuánto tarda en dar una vuelta completa
    images: [
      { id: 1, url: 'https://images.pexels.com/photos/15321479/pexels-photo-15321479.jpeg' },
      { id: 2, url: 'https://images.pexel.com/photos/8780222/pexels-photo-8780222.jpeg' },
      { id: 3, url: 'https://images.pexels.com/photos/5218957/pexels-photo-5218957.jpeg' },
      { id: 4, url: 'https://images.pexels.com/photos/15674306/pexels-photo-15674306.jpeg' },
      { id: 5, url: 'https://images.pexels.com/photos/12357725/pexels-photo-12357725.jpeg' },
    ]
  },

  // SECCIONES DE NAVEGACIÓN (Botones)
  features: [
    {
      id: 'modelos',
      icon: '💎',
      title: 'MODELOS',
      subtitle: 'PERFILES VERIFICADOS',
      desc: 'Explora galerías exclusivas de alto nivel profesional.',
      path: '/modelos'
    },
    {
      id: 'tours',
      icon: '✈️',
      title: 'TOURS',
      subtitle: 'AGENDAS VIP',
      desc: 'Reserva encuentros internacionales en las sedes más exclusivas.',
      path: '/tours'
    },
    {
      id: 'rifas',
      icon: '🎰',
      title: 'RIFAS',
      subtitle: 'GANA EXPERIENCIAS',
      desc: 'Participa por premios premium y cenas de gala inolvidables.',
      path: '/rifas'
    }
  ]
};