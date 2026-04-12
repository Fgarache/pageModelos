export interface TourLocationInfo {
  slug: string;
  aliases?: string[];
  title: string;
  headline: string;
  description: string;
  highlights: string[];
}

export const TOUR_LOCATIONS: TourLocationInfo[] = [
  {
    slug: 'guatemala',
    aliases: ['guate', 'gt', '502', 'ciudad-de-guatemala', 'guatemala-city'],
    title: 'Tours en Ciudad de Guatemala',
    headline: 'Agenda premium en Ciudad de Guatemala',
    description:
      'Conecta con experiencias VIP en zonas exclusivas de Ciudad de Guatemala. Perfiles verificados, coordinación discreta y atención personalizada.',
    highlights: [
      'Cobertura en zonas premium y hoteles ejecutivos',
      'Atención privada con coordinación por agenda',
      'Perfiles activos con verificación de identidad',
    ],
  },
  {
    slug: 'antigua',
    aliases: ['antigua-guatemala'],
    title: 'Tours en Antigua Guatemala',
    headline: 'Experiencias exclusivas en Antigua',
    description:
      'Descubre una agenda premium en Antigua Guatemala con servicio elegante, discreto y enfocado en experiencias memorables para visitantes nacionales e internacionales.',
    highlights: [
      'Cobertura en hoteles boutique y áreas céntricas',
      'Reservas por horario con confirmación rápida',
      'Atención discreta y trato profesional',
    ],
  },
  {
    slug: 'quetzaltenango',
    aliases: ['xela'],
    title: 'Tours en Quetzaltenango',
    headline: 'Agenda VIP en Quetzaltenango',
    description:
      'Accede a tours premium en Quetzaltenango con perfiles seleccionados y coordinación segura para encuentros exclusivos en la región occidental.',
    highlights: [
      'Disponibilidad por temporada y agenda activa',
      'Perfiles premium para experiencias privadas',
      'Confirmación de horarios y ubicaciones seguras',
    ],
  },
  {
    slug: 'escuintla',
    aliases: ['escuintla-guatemala'],
    title: 'Tours en Escuintla',
    headline: 'Cobertura premium en Escuintla',
    description:
      'Encuentra disponibilidad VIP en Escuintla con atención de alto nivel, coordinación reservada y servicio enfocado en privacidad.',
    highlights: [
      'Agenda en zonas estratégicas de Escuintla',
      'Servicio discreto con logística coordinada',
      'Perfiles verificados y comunicación directa',
    ],
  },
  {
    slug: 'coban',
    aliases: ['coban-guatemala', 'coban-alta-verapaz'],
    title: 'Tours en Coban',
    headline: 'Agenda VIP en Coban',
    description:
      'Encuentra experiencias premium en Coban con coordinación discreta, atención personalizada y perfiles verificados.',
    highlights: [
      'Cobertura en Coban y Alta Verapaz',
      'Reservas con confirmación de agenda',
      'Privacidad y trato profesional',
    ],
  },
  {
    slug: 'quiche',
    aliases: ['santa-cruz-del-quiche', 'santa-cruz-quiche'],
    title: 'Tours en Quiche',
    headline: 'Agenda VIP en Santa Cruz del Quiche',
    description:
      'Disponibilidad premium en Santa Cruz del Quiche y alrededores, con atención discreta y coordinación ejecutiva.',
    highlights: [
      'Cobertura en Quiche y municipios cercanos',
      'Atención privada y confidencial',
      'Perfiles con agenda activa y verificada',
    ],
  },
  {
    slug: 'mazatenango',
    aliases: ['mazate'],
    title: 'Tours en Mazatenango',
    headline: 'Experiencias VIP en Mazatenango',
    description:
      'Conecta con tours exclusivos en Mazatenango con logística discreta y atención premium para clientes nacionales e internacionales.',
    highlights: [
      'Cobertura en Mazatenango y Suchitepequez',
      'Agenda por horario y atención personalizada',
      'Coordinación segura y reservada',
    ],
  },
  {
    slug: 'peten',
    aliases: ['peten-guatemala'],
    title: 'Tours en Peten',
    headline: 'Experiencias VIP en Peten',
    description:
      'Descubre tours exclusivos en Peten para visitantes que buscan atención premium con privacidad y excelente coordinación.',
    highlights: [
      'Cobertura en áreas turísticas y hoteleras',
      'Agenda flexible según disponibilidad',
      'Atención cuidada para experiencias discretas',
    ],
  },
  {
    slug: 'izabal',
    aliases: ['puerto-barrios'],
    title: 'Tours en Izabal',
    headline: 'Agenda premium en Izabal',
    description:
      'Accede a experiencias VIP en Izabal con perfiles seleccionados, atención profesional y servicio orientado a privacidad.',
    highlights: [
      'Coordinación en zonas clave de Izabal',
      'Reservas directas con confirmación de agenda',
      'Atención personalizada y discreta',
    ],
  },
];

export const TOUR_LOCATION_MAP = Object.fromEntries(
  TOUR_LOCATIONS.flatMap((location) => {
    const allSlugs = [location.slug, ...(location.aliases || [])];
    return allSlugs.map((slug) => [slug, location]);
  }),
) as Record<string, TourLocationInfo>;
