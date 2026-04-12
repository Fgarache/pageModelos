export interface MetadataPayload {
  title: string;
  description: string;
  image: string;
  url: string;
  type?: string;
  keywords?: string;
}

export const METADATA_CONFIG = {
  siteName: 'LindasGT.com',
  baseUrl: 'https://lindasgt.com',
  defaultImage: '/icons/logo.png',
  twitterCard: 'summary_large_image',
  defaultKeywords:
    'LindasGT, chicas en guatemala, chicas chapinas, ejecutivas guatemala, escort guatemala, scort guatemala, angelitas guatemala, casa cerrada guatemala, tours VIP Guatemala, modelos premium Guatemala, guate, gt guatemala, 502 guatemala, Antigua Guatemala, Quetzaltenango, Xela, Escuintla, Coban, Santa Cruz del Quiche, Quiche, Mazatenango, Mazate, Peten, Izabal, San Marcos, Huehuetenango, Chiquimula, Zacapa',
};

export const GLOBAL_METADATA: Omit<MetadataPayload, 'url'> = {
  title: 'LindasGT.com | Exclusividad en cada detalle',
  description:
    'Descubre perfiles verificados, tours VIP y rifas activas en LindasGT.com. Elegancia, privacidad y atencion premium.',
  image: '/icons/logo.png',
  type: 'website',
  keywords: METADATA_CONFIG.defaultKeywords,
};

const isAbsoluteUrl = (value: string) => /^https?:\/\//i.test(value);

const normalizePath = (path: string) => {
  if (!path) return '/';
  const clean = path.split('?')[0].split('#')[0];
  return clean.startsWith('/') ? clean : `/${clean}`;
};

const toAbsoluteUrl = (value: string) => {
  if (!value) return `${METADATA_CONFIG.baseUrl}/icons/logo.png`;
  if (isAbsoluteUrl(value)) return value;

  const base = METADATA_CONFIG.baseUrl.replace(/\/$/, '');
  const path = value.startsWith('/') ? value : `/${value}`;
  return `${base}${path}`;
};

const upsertMetaTag = (selector: string, attrs: Record<string, string>) => {
  let element = document.querySelector(selector) as HTMLMetaElement | null;

  if (!element) {
    element = document.createElement('meta');
    document.head.appendChild(element);
  }

  Object.entries(attrs).forEach(([key, val]) => element?.setAttribute(key, val));
};

const upsertCanonical = (url: string) => {
  let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;

  if (!canonical) {
    canonical = document.createElement('link');
    canonical.setAttribute('rel', 'canonical');
    document.head.appendChild(canonical);
  }

  canonical.setAttribute('href', url);
};

export const getPageMetadata = (pathname: string): MetadataPayload => {
  const normalizedPath = normalizePath(pathname);

  return {
    title: GLOBAL_METADATA.title,
    description: GLOBAL_METADATA.description,
    image: toAbsoluteUrl(GLOBAL_METADATA.image),
    url: toAbsoluteUrl(normalizedPath),
    type: GLOBAL_METADATA.type || 'website',
    keywords: GLOBAL_METADATA.keywords || METADATA_CONFIG.defaultKeywords,
  };
};

export const getModelMetadata = (pathname: string, model: any): MetadataPayload => {
  const modelName = model?.nombre || 'Modelo';
  const modelDescription =
    model?.info?.split('\n')?.[0]?.trim() ||
    `Conoce el perfil de ${modelName} en LindasGT.com.`;

  return {
    title: `${modelName} | LindasGT.com`,
    description: modelDescription,
    image: toAbsoluteUrl(model?.fotoPerfil || METADATA_CONFIG.defaultImage),
    url: toAbsoluteUrl(normalizePath(pathname)),
    type: 'profile',
    keywords: METADATA_CONFIG.defaultKeywords,
  };
};

export const getTourLocationMetadata = (
  pathname: string,
  locationName: string,
): MetadataPayload => {
  const cleanLocation = locationName || 'Guatemala';

  return {
    title: `Tours en ${cleanLocation} | LindasGT.com`,
    description: `Tours VIP y experiencias premium en ${cleanLocation}. Busquedas frecuentes: chicas en Guatemala, ejecutivas Guatemala, chicas chapinas y escort Guatemala.`,
    image: toAbsoluteUrl(METADATA_CONFIG.defaultImage),
    url: toAbsoluteUrl(normalizePath(pathname)),
    type: 'website',
    keywords: `${METADATA_CONFIG.defaultKeywords}, tours en ${cleanLocation.toLowerCase()}, chicas en ${cleanLocation.toLowerCase()}`,
  };
};

export const applyMetadata = (metadata: MetadataPayload) => {
  document.title = metadata.title;

  upsertMetaTag('meta[name="description"]', {
    name: 'description',
    content: metadata.description,
  });

  upsertMetaTag('meta[name="keywords"]', {
    name: 'keywords',
    content: metadata.keywords || METADATA_CONFIG.defaultKeywords,
  });

  upsertMetaTag('meta[property="og:title"]', {
    property: 'og:title',
    content: metadata.title,
  });

  upsertMetaTag('meta[property="og:description"]', {
    property: 'og:description',
    content: metadata.description,
  });

  upsertMetaTag('meta[property="og:image"]', {
    property: 'og:image',
    content: metadata.image,
  });

  upsertMetaTag('meta[property="og:url"]', {
    property: 'og:url',
    content: metadata.url,
  });

  upsertMetaTag('meta[property="og:type"]', {
    property: 'og:type',
    content: metadata.type || 'website',
  });

  upsertMetaTag('meta[property="og:site_name"]', {
    property: 'og:site_name',
    content: METADATA_CONFIG.siteName,
  });

  upsertMetaTag('meta[name="twitter:card"]', {
    name: 'twitter:card',
    content: METADATA_CONFIG.twitterCard,
  });

  upsertMetaTag('meta[name="twitter:title"]', {
    name: 'twitter:title',
    content: metadata.title,
  });

  upsertMetaTag('meta[name="twitter:description"]', {
    name: 'twitter:description',
    content: metadata.description,
  });

  upsertMetaTag('meta[name="twitter:image"]', {
    name: 'twitter:image',
    content: metadata.image,
  });

  upsertCanonical(metadata.url);
};
