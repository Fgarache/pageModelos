// src/data/homeData.ts

export const HOME_CONFIG = {
  // CONFIGURACIÓN VISUAL (Para ajustar sin tocar CSS)
  style: {
    heroTitleSize: "clamp(3.5rem, 10vw, 6rem)", // Tamaño responsivo
    heroTaglineSpacing: "19px",                 // Espaciado de letras
    glassBlur: "25px",                          // Intensidad del efecto cristal
  },

  // CONTENIDO DE TEXTO
  content: {
    titlePart1: "LindasGT",
    titlePart2: ".com",
    tagline: "EXCLUSIVIDAD EN CADA DETALLE",
    description: "Chicas verificadas en Guatemala, con atención discreta, elegante y de alto nivel para experiencias exclusivas.",
  },

  // ETIQUETAS SEO (Para Helmet o Meta tags)
  seo: {
    title: "LindasGT.com | Agencia de Modelos Premium & Tours VIP",
    description: "Descubre las mejores modelos profesionales, tours exclusivos y eventos de gala. Seguridad, exclusividad y talento verificado.",
    keywords: "modelos, tours VIP, rifas exclusivas, agencia de modelos, eventos premium",
    ogImage: "https://tu-dominio.com/preview-image.jpg",
  },

  // SECCIONES DE NAVEGACIÓN (Botones)
  features: [
    {
      id: 'modelos',
      icon: '💎',
      title: 'MODELOS',
      subtitle: 'EJECUTIVAS ESCORT PREMIUM',
      desc: 'Modelos ejecutivas premium en Guatemala, con atención discreta y exclusiva.',
      path: '/modelos'
    },
    {
      id: 'tours',
      icon: '✈️',
      title: 'TOURS',
      subtitle: 'TOURS VIP EN GUATEMALA',
      desc: 'Disponibles en Ciudad de Guatemala, Antigua, Quetzaltenango, Escuintla, Peten, Izabal y mas departamentos.',
      path: '/tours'
    },
    {
      id: 'rifas',
      icon: '🎰',
      title: 'RIFAS',
      subtitle: 'GANA EXPERIENCIAS',
      desc: 'Rifas activas de nuestras modelos.',
      path: '/rifas'
    }
  ]
};