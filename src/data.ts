import { getApps, initializeApp } from 'firebase/app';
import { child, get, getDatabase, ref, set, increment } from 'firebase/database';
import { firebaseConfig } from './firebase.config';

const app = getApps().length > 0 ? getApps()[0] : initializeApp(firebaseConfig);
const db = getDatabase(app);
const dbRef = ref(db);

type FirebaseMap = Record<string, any>;

const toArray = <T = any>(value: FirebaseMap | null | undefined): T[] => Object.values(value || {}) as T[];

const normalizeComparable = (value: string | undefined) =>
  (value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9]/g, '')
    .toLowerCase();



const normalizeAllSocials = (raw: any) => {
  const socials: Array<{ tipo: string; titulo: string; url: string; icon?: any }> = [];
  
  if (!raw?.redes) return socials;

  // Extraer todas las redes del objeto - RECURSIVAMENTE
  const procesarRedes = (obj: any) => {
    Object.entries(obj || {}).forEach(([key, item]: [string, any]) => {
      if (!item) return;

      // Caso 1: Item es un objeto con tipo, titulo, url
      if (item?.tipo && item?.url) {
        const urlStr = typeof item.url === 'string' ? item.url.trim() : '';
        if (urlStr) {
          socials.push({
            tipo: String(item.tipo).trim(),
            titulo: item.titulo ? String(item.titulo).trim() : String(item.tipo).trim(),
            url: urlStr,
          });
        }
      }
      // Caso 2: Item es una string URL (red como string directo)
      else if (typeof item === 'string' && item.trim()) {
        const url = item.trim();
        // Detectar el tipo por el contenido de la URL
        let tipo = key; // Usar el nombre de la llave como tipo por defecto
        if (url.includes('wa.me') || url.includes('whatsapp')) tipo = 'whatsapp';
        else if (url.includes('t.me')) tipo = 'telegram';
        else if (url.includes('instagram.com')) tipo = 'instagram';
        else if (url.includes('facebook.com')) tipo = 'facebook';
        else if (url.includes('twitter.com') || url.includes('x.com')) tipo = 'x';

        // Evitar duplicados
        if (!socials.some(s => s.url === url)) {
          socials.push({
            tipo,
            titulo: tipo.charAt(0).toUpperCase() + tipo.slice(1),
            url,
          });
        }
      }
      // Caso 3: Objeto anidado, procesar recursivamente (máximo 1 nivel)
      else if (typeof item === 'object' && item !== null && !Array.isArray(item)) {
        // No hacer recursión infinita, solo un nivel
      }
    });
  };

  procesarRedes(raw.redes);
  return socials;
};

const normalizeFotos = (fotos: FirebaseMap | undefined) => {
  if (!fotos) return {};

  return Object.fromEntries(
    Object.entries(fotos).map(([key, foto]) => [
      key,
      {
        ...foto,
        link: foto.link || foto.url || '',
      },
    ]),
  );
};

const normalizeGroups = (grupos: any) => {
  if (!grupos) return [] as Array<{ titulo: string; link: string }>;

  return toArray<any>(grupos)
    .map((grupo) => ({
      titulo: grupo?.titulo || grupo?.nombre || 'Grupo',
      link: grupo?.link || grupo?.url || '',
    }))
    .filter((grupo) => grupo.link);
};

const normalizeServices = (servicios: any) => {
  if (!servicios) {
    return [] as Array<{ nombre: string; detalles: string; precio: string; link: string }>;
  }

  return toArray<any>(servicios)
    .map((servicio) => {
      if (typeof servicio === 'string') {
        const nombre = servicio.trim();
        return {
          nombre,
          detalles: '',
          precio: '',
          link: '',
        };
      }

      if (typeof servicio === 'object' && servicio !== null) {
        const nombre = getFirstString(servicio.nombre, servicio.titulo, servicio.servicio, servicio.name);
        return {
          nombre,
          detalles: getFirstString(servicio.detalles, servicio.descripcion, servicio.info),
          precio: getFirstString(servicio.precio, servicio.costo, servicio.valor),
          link: getFirstString(servicio.link, servicio.url),
        };
      }

      return {
        nombre: '',
        detalles: '',
        precio: '',
        link: '',
      };
    })
    .filter((servicio) => servicio.nombre);
};

const getFirstString = (...values: any[]) => {
  const match = values.find((value) => typeof value === 'string' && value.trim() !== '');
  return typeof match === 'string' ? match.trim() : '';
};

const normalizeTimestamp = (value: any) => {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value < 1_000_000_000_000 ? value * 1000 : value;
  }

  if (typeof value === 'string' && value.trim() !== '') {
    const numericValue = Number(value);
    if (Number.isFinite(numericValue) && numericValue > 0) {
      return numericValue < 1_000_000_000_000 ? numericValue * 1000 : numericValue;
    }

    const parsed = Date.parse(value);
    return Number.isNaN(parsed) ? null : parsed;
  }

  return null;
};

const normalizeBooleanFlag = (value: any, fallback = true) => {
  if (typeof value === 'boolean') return value;
  if (typeof value === 'number') return value !== 0;

  if (typeof value === 'string') {
    const normalized = value.trim().toLowerCase();
    if (['false', '0', 'no', 'off', 'inactive', 'inactivo'].includes(normalized)) return false;
    if (['true', '1', 'yes', 'on', 'active', 'activo'].includes(normalized)) return true;
  }

  return fallback;
};

const normalizeProfile = (id: string, raw: any) => {
  const estadoTexto = getFirstString(raw.estado_texto, raw.texto_estado, raw.estadoTexto, raw.estado?.texto, raw.status_text);
  const estadoActualizadoAt = normalizeTimestamp(
    raw.estado_actualizado_en
      ?? raw.estado_timestamp
      ?? raw.actualizado_en
      ?? raw.updated_at
      ?? raw.ultima_actualizacion
      ?? raw.fecha_estado
      ?? raw.estado?.fecha
      ?? raw.estado?.updated_at,
  );

  const allSocials = normalizeAllSocials(raw);
  
  // Compatibilidad: crear propiedades individuales a partir del array
  const redesMap = Object.fromEntries(
    allSocials.map(red => [red.tipo, red.url])
  );

  return {
    id,
    googleId: id,
    nombre: raw.nombre || raw.nombre_completo || 'Perfil',
    user_alias: raw.user_alias || raw.nombre_usuario || '',
    email: raw.email || '',
    fotoPerfil: raw.fotoPerfil || raw.foto_perfil || raw.profile_pic || '',
    rol: raw.rol || 'user',
    verificado: raw.verificado === true,
    perfilActivo: raw.perfil_activo !== false,
    disponible: normalizeBooleanFlag(raw.disponible, true),
    info: raw.info || raw.descripcion || '',
    disponibleLugar: raw.disponibleLugar || raw.disponible_hoy_en || '',
    estadoTexto,
    estadoActualizadoAt,
    ubicaciones: toArray<string>(raw.ubicaciones),
    servicios: normalizeServices(raw.servicios),
    grupos: normalizeGroups(raw.grupos),
    fotos: normalizeFotos(raw.fotos),
    redes: {
      whatsapp: redesMap['whatsapp'] || '',
      telegram: redesMap['telegram'] || '',
      instagram: redesMap['instagram'] || '',
      facebook: redesMap['facebook'] || '',
      x: redesMap['x'] || '',
    },
    redesArray: allSocials,
  };
};

const normalizeTourAvailability = (raw: any) => {
  if (raw.disponibilidad && typeof raw.disponibilidad === 'object') {
    return raw.disponibilidad as Record<string, boolean>;
  }

  if (raw.disponibles && typeof raw.disponibles === 'object') {
    return Object.values(raw.disponibles).reduce<Record<string, boolean>>((acc, hour) => {
      if (typeof hour === 'string' && hour) {
        acc[hour] = true;
      }
      return acc;
    }, {});
  }

  return {};
};

const getGoogleMapsLocationLabel = (value: string) => {
  try {
    const url = new URL(value);
    const host = url.hostname.toLowerCase();
    const isGoogleMapsLink = host.includes('google.') || host.includes('maps.app.goo.gl');

    if (!isGoogleMapsLink) return '';

    const pathParts = decodeURIComponent(url.pathname)
      .split('/')
      .filter(Boolean)
      .map((part) => part.replace(/\+/g, ' ').trim());

    const placeIndex = pathParts.findIndex((part) => part.toLowerCase() === 'place');
    if (placeIndex >= 0 && pathParts[placeIndex + 1]) {
      return pathParts[placeIndex + 1];
    }

    const queryCandidate =
      url.searchParams.get('q')
      || url.searchParams.get('query')
      || url.searchParams.get('destination')
      || url.searchParams.get('daddr')
      || '';

    if (queryCandidate.trim() !== '') {
      return decodeURIComponent(queryCandidate).replace(/\+/g, ' ').trim();
    }

    return 'Ubicacion en Google Maps';
  } catch {
    return '';
  }
};

const isHttpUrl = (value: string) => /^https?:\/\//i.test(value.trim());

const getGoogleMapsSearchUrl = (label: string) => {
  if (!label.trim()) return '';
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(label.trim())}`;
};

const resolveLocationHref = (rawUrl: string, label: string) => {
  try {
    const parsed = new URL(rawUrl);
    const host = parsed.hostname.toLowerCase();

    const deepLink =
      parsed.searchParams.get('link')
      || parsed.searchParams.get('deep_link_id')
      || '';

    if (deepLink) {
      const decoded = decodeURIComponent(deepLink);
      if (isHttpUrl(decoded)) {
        return decoded;
      }
    }

    const isMapsShort = host.includes('maps.app.goo.gl');
    const isFirebaseDynamic = host.includes('page.link') || host.includes('app.goo.gl');
    const pathLooksIncomplete = parsed.pathname === '/' || parsed.pathname.trim() === '';

    if ((isMapsShort || isFirebaseDynamic) && pathLooksIncomplete) {
      const fallback = getGoogleMapsSearchUrl(label);
      return fallback || rawUrl;
    }

    return rawUrl;
  } catch {
    return getGoogleMapsSearchUrl(label);
  }
};

const normalizeLocationLabel = (value: any) => {
  if (typeof value !== 'string') return '';

  const cleaned = value.trim();
  if (cleaned === '') return '';

  if (/^https?:\/\//i.test(cleaned)) {
    const mapsLabel = getGoogleMapsLocationLabel(cleaned);
    return mapsLabel || 'Ubicacion en Google Maps';
  }

  return cleaned;
};

const normalizeLocationField = (value: any, fallbackLabel = '') => {
  const rawValue = typeof value === 'string' ? value.trim() : '';
  if (rawValue === '') return { label: '', href: '' };

  const normalizedValue = normalizeLocationLabel(rawValue);
  const locationLabel = normalizedValue || fallbackLabel || '';
  const preparedUrl = isHttpUrl(rawValue) ? rawValue : (rawValue.includes('.') ? `https://${rawValue}` : '');
  const href = preparedUrl ? resolveLocationHref(preparedUrl, locationLabel) : '';

  return {
    label: locationLabel || (href ? 'Ver ubicacion' : ''),
    href,
  };
};

const normalizeLocationEntry = (entry: any, fallbackLabel = '') => {
  if (typeof entry === 'string') {
    return normalizeLocationField(entry, fallbackLabel);
  }

  if (!entry || typeof entry !== 'object') {
    return { label: '', href: '' };
  }

  const linkValue = getFirstString(
    entry.link,
    entry.url,
    entry.href,
    entry.maps,
    entry.google_maps,
    entry.ubicacion_maps,
    entry.mapa,
  );

  const labelValue = getFirstString(
    entry.nombre,
    entry.titulo,
    entry.lugar,
    entry.direccion,
    entry.ubicacion,
    entry.label,
    entry.texto,
    fallbackLabel,
  );

  if (linkValue || labelValue) {
    return normalizeLocationField(linkValue || labelValue, labelValue);
  }

  return { label: '', href: '' };
};

const extractUrlsFromText = (value: string) => {
  const matches = value.match(/https?:\/\/[^\s]+/gi) || [];
  return matches
    .map((url) => url.trim().replace(/[),.;]+$/g, ''))
    .filter(Boolean);
};

const collectTourLocations = (value: any, fallbackLabel = ''): Array<{ label: string; href: string }> => {
  if (!value) return [];

  if (typeof value === 'string') {
    const trimmed = value.trim();
    const urls = extractUrlsFromText(trimmed);

    if (urls.length > 1) {
      return urls
        .map((url, index) => normalizeLocationField(url, `${fallbackLabel || 'Ubicacion'} ${index + 1}`))
        .filter((item) => item.label);
    }

    const normalized = normalizeLocationField(trimmed, fallbackLabel);
    return normalized.label ? [normalized] : [];
  }

  if (Array.isArray(value)) {
    return value.flatMap((item) => collectTourLocations(item, fallbackLabel));
  }

  if (typeof value === 'object') {
    const direct = normalizeLocationEntry(value, fallbackLabel);
    const hasDirectValues = Boolean(direct.label || direct.href);
    if (hasDirectValues) {
      return direct.label ? [direct] : [];
    }

    return Object.values(value).flatMap((item) => collectTourLocations(item, fallbackLabel));
  }

  return [];
};

const parseTourDate = (value: string | undefined) => {
  const rawValue = String(value || '').trim();
  if (!rawValue) return null;

  const normalized = rawValue.split('T')[0];

  if (/^\d{4}-\d{2}-\d{2}$/.test(normalized)) {
    const date = new Date(`${normalized}T00:00:00`);
    return Number.isNaN(date.getTime()) ? null : date;
  }

  const match = normalized.match(/^(\d{1,2})[/-](\d{1,2})[/-](\d{4})$/);
  if (match) {
    const day = Number(match[1]);
    const month = Number(match[2]);
    const year = Number(match[3]);
    const date = new Date(year, month - 1, day);
    return Number.isNaN(date.getTime()) ? null : date;
  }

  const parsed = new Date(rawValue);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
};

const isPastTourDate = (value: string | undefined) => {
  const parsedDate = parseTourDate(value);
  if (!parsedDate) return false;

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  parsedDate.setHours(0, 0, 0, 0);

  return parsedDate.getTime() < today.getTime();
};

const parseHour = (hourStr: string) => {
  const match = hourStr.match(/(\d{1,2}):(\d{2})\s*(AM|PM|am|pm)?/i);
  if (!match) return null;
  let hours = parseInt(match[1], 10);
  const minutes = parseInt(match[2], 10);
  const ampm = match[3]?.toUpperCase();

  if (ampm === 'PM' && hours < 12) hours += 12;
  if (ampm === 'AM' && hours === 12) hours = 0;

  return { hours, minutes };
};

const getValidAvailableHours = (fecha: string | undefined, disponibilidad: Record<string, boolean>) => {
  const tourDate = parseTourDate(fecha);
  if (!tourDate) return disponibilidad; 

  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const tourDay = new Date(tourDate.getFullYear(), tourDate.getMonth(), tourDate.getDate());

  if (tourDay.getTime() < today.getTime()) return {};

  const isToday = tourDay.getTime() === today.getTime();
  
  const validDisponibilidad: Record<string, boolean> = {};
  
  for (const [hourStr, isAvailable] of Object.entries(disponibilidad)) {
    if (!isAvailable) {
      validDisponibilidad[hourStr] = false;
      continue;
    }

    if (isToday) {
      const parsedTime = parseHour(hourStr);
      if (parsedTime) {
        const tourTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), parsedTime.hours, parsedTime.minutes, 0, 0);
        
        if (tourTime.getTime() <= now.getTime()) {
           validDisponibilidad[hourStr] = false;
           continue;
        }
      }
    }

    validDisponibilidad[hourStr] = true;
  }

  return validDisponibilidad;
};

const uniqueLocations = (items: Array<{ label: string; href: string }>) => {
  const seen = new Set<string>();

  return items.filter((item) => {
    const normalizedLabel = (item.label || '').trim().toLowerCase();
    const normalizedHref = (item.href || '').trim().toLowerCase();
    const key = `${normalizedLabel}|${normalizedHref}`;

    if (!normalizedLabel || seen.has(key)) return false;

    seen.add(key);
    return true;
  });
};

const normalizeTour = (id: string, raw: any) => {
  const lugarRaw =
    raw.lugar
    || raw.ubicacion
    || raw.ubicacion_tour
    || raw.ubicacion_maps
    || raw.ciudad
    || raw.disponible_hoy_en
    || '';

  const lugarDisponibleRaw =
    raw.lugarDisponible
    || raw.lugar_disponible
    || raw.ubicacion_disponible
    || raw.direccion
    || '';

  const lugar = normalizeLocationField(
    lugarRaw,
    getFirstString(
      raw.lugar_nombre,
      raw.nombre_lugar,
      raw.ubicacion_nombre,
      raw.nombre_ubicacion,
      raw.titulo_ubicacion,
      raw.ubicacion_titulo,
    ),
  );

  const lugarDisponible = normalizeLocationField(
    lugarDisponibleRaw,
    getFirstString(
      raw.lugar_disponible_nombre,
      raw.nombre_lugar_disponible,
      raw.ubicacion_disponible_nombre,
      raw.nombre_ubicacion_disponible,
      raw.titulo_ubicacion_disponible,
    ),
  );

  const extraLocations = uniqueLocations([
    ...collectTourLocations(raw.ubicaciones),
    ...collectTourLocations(raw.lugares),
    ...collectTourLocations(raw.ubicacion_maps),
    ...collectTourLocations(raw.ubicacion_disponible),
    ...collectTourLocations(raw.lugar_link, lugar.label),
    ...collectTourLocations(raw.lugar_disponible_link, lugarDisponible.label),
  ]);

  const disponibilidadOriginal = normalizeTourAvailability(raw);
  const disponibilidad = getValidAvailableHours(raw.fecha, disponibilidadOriginal);

  const parsedPrimaryLocations = uniqueLocations([
    ...collectTourLocations(lugarRaw, lugar.label),
    ...collectTourLocations(lugarDisponibleRaw, lugarDisponible.label),
  ]);

  const ubicacionesTour = uniqueLocations([
    ...parsedPrimaryLocations,
    ...extraLocations,
  ]);

  const fallbackLocations = uniqueLocations([lugar, lugarDisponible]);
  const finalLocations = ubicacionesTour.length > 0 ? ubicacionesTour : fallbackLocations;

  const primaryLocation = finalLocations[0] || { label: '', href: '' };
  const secondaryLocation = finalLocations[1] || { label: '', href: '' };

  return {
    id,
    idUser: raw.idUser || raw.creado_por_uid || '',
    titulo: raw.titulo || 'Tour',
    detalles: raw.detalles || '',
    fecha: raw.fecha || '',
    lugar: primaryLocation.label,
    lugarLink: primaryLocation.href,
    lugarDisponible: secondaryLocation.label,
    lugarDisponibleLink: secondaryLocation.href,
    ubicacionesTour: finalLocations,
    estado: normalizeBooleanFlag(raw.estado ?? raw.activo, false),
    disponibilidadOriginal,
    disponibilidad,
  };
};

const parseTerms = (value: any) => {
  if (Array.isArray(value)) return value;
  if (typeof value !== 'string' || value.trim() === '') return [];

  const numberedTerms = value
    .split(/\s*\d+\.\s*/)
    .map((item) => item.trim())
    .filter(Boolean);

  return numberedTerms.length > 0 ? numberedTerms : [value.trim()];
};

const normalizeRifaAvailability = (raw: any) => {
  if (raw.disponibilidad && typeof raw.disponibilidad === 'object') {
    return raw.disponibilidad as Record<string, boolean>;
  }

  const total = Number(raw.numerosTotales || raw.total_numeros || 0);
  const occupiedKeys = Object.keys(raw.numeros_ocupados || {});
  const occupiedNumbers = new Set(
    occupiedKeys
      .map((key) => Number(key.replace(/\D/g, '')))
      .filter((value) => !Number.isNaN(value) && value > 0),
  );

  return Array.from({ length: total }, (_, index) => index + 1).reduce<Record<string, boolean>>((acc, number) => {
    acc[String(number)] = !occupiedNumbers.has(number);
    return acc;
  }, {});
};

const normalizeRifa = (id: string, raw: any) => {
  const disponibilidad = normalizeRifaAvailability(raw);
  const numerosDisponibles = Object.entries(disponibilidad)
    .filter(([, available]) => available === true)
    .map(([number]) => Number(number))
    .sort((a, b) => a - b);
  const premios = toArray<string>(raw.premios);

  return {
    id,
    idUser: raw.idUser || raw.creado_por_uid || '',
    titulo: raw.titulo || 'Rifa',
    detalles: raw.detalles || '',
    premio: raw.premio || premios[0] || 'Premio por anunciar',
    premios,
    ganadores: toArray<string>(raw.ganadores),
    fechaSorteo: raw.fechaSorteo || raw.fecha_sorteo || '',
    horaSorteo: raw.horaSorteo || raw.hora_sorteo || '',
    precio: Number(raw.precio || 0),
    numerosTotales: Number(raw.numerosTotales || raw.total_numeros || 0),
    estado: raw.estado ?? raw.activo ?? raw.activa ?? true,
    terminos: parseTerms(raw.terminos || raw.terminos_condiciones),
    disponibilidad,
    numerosDisponibles,
    cantidadLibre: numerosDisponibles.length,
  };
};

const sortByDate = (items: any[], field: string) =>
  [...items].sort((a, b) => String(a[field] || '').localeCompare(String(b[field] || '')));



const readFirstExistingPath = async (paths: string[]) => {
  for (const path of paths) {
    const snapshot = await get(child(dbRef, path));
    if (snapshot.exists()) {
      return snapshot;
    }
  }

  return null;
};

const readPublicProfiles = async () => {
  const snapshot = await readFirstExistingPath(['perfil', 'models']);
  if (!snapshot) return [] as Array<[string, any]>;

  return Object.entries(snapshot.val() || {}) as Array<[string, any]>;
};

const findMatchingProfile = (profiles: Array<[string, any]>, userIdOrAlias: string) => {
  const normalizedTarget = normalizeComparable(userIdOrAlias);

  return profiles.find(([id, raw]) => {
    const profile = normalizeProfile(id, raw);
    const candidates = [
      id,
      profile.user_alias,
      profile.nombre,
      profile.nombre?.replace(/\s+/g, ''),
    ].map((value) => normalizeComparable(value));

    return candidates.includes(normalizedTarget);
  });
};

export const API_FIREBASE = {
  getAllUsers: async (includeUnavailable = true) => {
    try {
      const profiles = await readPublicProfiles();
      if (profiles.length === 0) return [];

      return profiles
        .map(([id, raw]) => normalizeProfile(id, raw))
        .filter((profile) => {
          if (!profile.user_alias || !profile.perfilActivo || profile.rol !== 'model') {
            return false;
          }
          if (!includeUnavailable && !profile.disponible) {
            return false;
          }
          return true;
        });
    } catch (error) {
      console.warn('Firebase error al leer perfiles públicos:', error);
      return [];
    }
  },

  getAllPublicTours: async () => {
    try {
      const [profiles, snapshot] = await Promise.all([
        readPublicProfiles(),
        readFirstExistingPath(['tour', 'tours']),
      ]);

      if (!snapshot || profiles.length === 0) return [];

      const modelsMap = new Map<string, any>();
      profiles.forEach(([id, raw]) => {
        const profile = normalizeProfile(id, raw);
        if (profile.perfilActivo && profile.rol === 'model') {
          modelsMap.set(id, profile);
          if (profile.id) modelsMap.set(profile.id, profile);
          if (profile.googleId) modelsMap.set(profile.googleId, profile);
          if (profile.user_alias) modelsMap.set(profile.user_alias, profile);
        }
      });

      const getModelForTour = (idUser: string) => {
        if (!idUser) return null;
        if (modelsMap.has(idUser)) return modelsMap.get(idUser);
        const matched = findMatchingProfile(profiles, idUser);
        if (matched) {
          const prof = normalizeProfile(matched[0], matched[1]);
          modelsMap.set(idUser, prof);
          return prof;
        }
        return null;
      };

      const rawTours = Object.entries(snapshot.val() || {})
        .map(([id, raw]) => normalizeTour(id, raw))
        .filter((tour) => tour.estado);

      const activeTours = rawTours.filter((tour) => {
        if (isPastTourDate(tour.fecha)) return false;

        const definedHoursCount = Object.keys(tour.disponibilidadOriginal || {}).length;
        if (definedHoursCount > 0) {
          const hasAvailableHours = Object.values(tour.disponibilidad).some((v: any) => v === true);
          if (!hasAvailableHours) return false;
        }

        const model = getModelForTour(tour.idUser);
        // El tour es válido si pertenece a un modelo activo, independientemente de si la modelo está disponible hoy o no
        return Boolean(model && model.perfilActivo);
      });

      const toursWithModelData = activeTours.map((tour) => {
        const model = getModelForTour(tour.idUser);
        return {
          ...tour,
          nombreModelo: model?.nombre || (tour as any).nombreModelo || 'Modelo',
          userAlias: model?.user_alias || (tour as any).userAlias || '',
          idUser: model?.id || tour.idUser,
          fotoPerfil: (tour as any).fotoPerfil || model?.fotoPerfil || '',
        };
      });

      return sortByDate(toursWithModelData, 'fecha');
    } catch (error) {
      console.warn('Firebase error al leer todos los tours públicos:', error);
      return [];
    }
  },

  getAllPublicRifas: async () => {
    try {
      const [profiles, snapshot] = await Promise.all([
        readPublicProfiles(),
        readFirstExistingPath(['rifa', 'rifas']),
      ]);

      if (!snapshot || profiles.length === 0) return [];

      const modelsMap = new Map<string, any>();
      profiles.forEach(([id, raw]) => {
        const profile = normalizeProfile(id, raw);
        if (profile.perfilActivo && profile.rol === 'model') {
          modelsMap.set(id, profile);
          if (profile.id) modelsMap.set(profile.id, profile);
          if (profile.googleId) modelsMap.set(profile.googleId, profile);
          if (profile.user_alias) modelsMap.set(profile.user_alias, profile);
        }
      });

      const getModelForRifa = (idUser: string) => {
        if (!idUser) return null;
        if (modelsMap.has(idUser)) return modelsMap.get(idUser);
        const matched = findMatchingProfile(profiles, idUser);
        if (matched) {
          const prof = normalizeProfile(matched[0], matched[1]);
          modelsMap.set(idUser, prof);
          return prof;
        }
        return null;
      };

      const rawRifas = Object.entries(snapshot.val() || {})
        .map(([id, raw]) => normalizeRifa(id, raw))
        .filter((rifa) => rifa.estado);

      const activeRifas = rawRifas.filter((rifa) => {
        if (isPastTourDate(rifa.fechaSorteo)) return false;

        const model = getModelForRifa(rifa.idUser);
        // La rifa es válida si pertenece a una modelo activa, independientemente de si la modelo está disponible hoy o no
        return Boolean(model && model.perfilActivo);
      });

      const rifasWithModelData = activeRifas.map((rifa) => {
        const model = getModelForRifa(rifa.idUser);
        return {
          ...rifa,
          nombreModelo: model?.nombre || (rifa as any).nombreModelo || 'Modelo',
          userAlias: model?.user_alias || (rifa as any).userAlias || '',
          idUser: model?.id || rifa.idUser,
          fotoPerfil: (rifa as any).fotoPerfil || model?.fotoPerfil || '',
        };
      });

      return sortByDate(rifasWithModelData, 'fechaSorteo');
    } catch (error) {
      console.warn('Firebase error al leer todas las rifas públicas:', error);
      return [];
    }
  },

  getUserInfo: async (userIdOrAlias: string) => {
    try {
      const profiles = await readPublicProfiles();
      if (profiles.length === 0) return null;

      const directMatch = profiles.find(([id]) => id === userIdOrAlias);
      if (directMatch) {
        return normalizeProfile(directMatch[0], directMatch[1]);
      }

      const firstMatch = findMatchingProfile(profiles, userIdOrAlias);

      return firstMatch ? normalizeProfile(firstMatch[0], firstMatch[1]) : null;
    } catch (error) {
      console.warn('Firebase error al leer perfil público:', error);
      return null;
    }
  },

  getTours: async (userId: string) => {
    try {
      const snapshot = await readFirstExistingPath(['tour', 'tours']);
      if (!snapshot) return [];

      const tours = Object.entries(snapshot.val() || {})
        .map(([id, raw]) => normalizeTour(id, raw))
        .filter((tour) => tour.idUser === userId && tour.estado);

      const activeTours = tours.filter((tour) => {
         if (isPastTourDate(tour.fecha)) return false;
         
         const definedHoursCount = Object.keys(tour.disponibilidadOriginal || {}).length;
         if (definedHoursCount > 0) {
             const hasAvailableHours = Object.values(tour.disponibilidad).some((v: any) => v === true);
             if (!hasAvailableHours) return false;
         }

         return true;
      });

      return sortByDate(activeTours, 'fecha');
    } catch (error) {
      console.warn('Firebase error al leer tours públicos:', error);
      return [];
    }
  },

  getToursPastOrDisabled: async (userId: string) => {
    try {
      const snapshot = await readFirstExistingPath(['tour', 'tours']);
      if (!snapshot) return [];

      const tours = Object.entries(snapshot.val() || {})
        .map(([id, raw]) => normalizeTour(id, raw))
        .filter((tour) => tour.idUser === userId);

      const pastTours = tours.filter((tour) => {
        if (!tour.estado || isPastTourDate(tour.fecha)) return true;
        
        const definedHoursCount = Object.keys(tour.disponibilidadOriginal || {}).length;
        if (definedHoursCount > 0) {
           const hasAvailableHours = Object.values(tour.disponibilidad).some((v: any) => v === true);
           if (!hasAvailableHours) return true;
        }

        return false;
      });

      return [...pastTours].sort((a, b) => {
        const timeA = parseTourDate(a.fecha)?.getTime() || 0;
        const timeB = parseTourDate(b.fecha)?.getTime() || 0;
        return timeB - timeA;
      });
    } catch (error) {
      console.warn('Firebase error al leer tours pasados/desactivados:', error);
      return [];
    }
  },

  getHorarios: async (tourId: string) => {
    const horarios = await API_FIREBASE.getAllHorariosByTour(tourId);
    return horarios.filter((slot) => slot.disponible);
  },

  getAllHorariosByTour: async (tourId: string) => {
    try {
      const snapshot = await readFirstExistingPath([`tour/${tourId}`, `tours/${tourId}`]);
      if (!snapshot) return [];

      const tour = normalizeTour(tourId, snapshot.val());
      return Object.entries(tour.disponibilidad)
        .map(([hora, disponible]) => ({ hora, disponible, reserva: null }))
        .sort((a, b) => a.hora.localeCompare(b.hora));
    } catch (error) {
      console.warn('Firebase error al leer horarios públicos del tour:', error);
      return [];
    }
  },

  getRifas: async (userId: string) => {
    try {
      const snapshot = await readFirstExistingPath(['rifa', 'rifas']);
      if (!snapshot) return [];

      const rifas = Object.entries(snapshot.val() || {})
        .map(([id, raw]) => normalizeRifa(id, raw))
        .filter((rifa) => rifa.idUser === userId && rifa.estado)
        .filter((rifa) => !isPastTourDate(rifa.fechaSorteo));

      return sortByDate(rifas, 'fechaSorteo');
    } catch (error) {
      console.warn('Firebase error al leer rifas públicas:', error);
      return [];
    }
  },

  getRifasPastOrDisabled: async (userId: string) => {
    try {
      const snapshot = await readFirstExistingPath(['rifa', 'rifas']);
      if (!snapshot) return [];

      const rifas = Object.entries(snapshot.val() || {})
        .map(([id, raw]) => normalizeRifa(id, raw))
        .filter((rifa) => rifa.idUser === userId)
        .filter((rifa) => !rifa.estado || isPastTourDate(rifa.fechaSorteo));

      return [...rifas].sort((a, b) => {
        const timeA = parseTourDate(a.fechaSorteo)?.getTime() || 0;
        const timeB = parseTourDate(b.fechaSorteo)?.getTime() || 0;
        return timeB - timeA;
      });
    } catch (error) {
      console.warn('Firebase error al leer rifas pasadas/desactivadas:', error);
      return [];
    }
  },

  getProfileViews: async (userId: string) => {
    try {
      const snapshot = await get(child(dbRef, `estadisticas_perfil/${userId}/vistas`));
      return snapshot.exists() ? snapshot.val() : 0;
    } catch (error) {
      console.warn('Firebase error al leer vistas:', error);
      return 0;
    }
  },

  incrementProfileView: async (userId: string) => {
    try {
      await set(ref(db, `estadisticas_perfil/${userId}/vistas`), increment(1));
    } catch (error) {
      console.warn('Firebase error al incrementar vistas:', error);
    }
  }
};
