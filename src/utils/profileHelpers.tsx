import { FaFacebookF, FaInstagram, FaLink, FaTelegramPlane, FaUsers, FaWhatsapp } from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';

export const getWhatsAppLink = (whatsAppUrl: string | undefined, message: string) => {
  if (!whatsAppUrl) return '';

  const encodedMessage = encodeURIComponent(message);

  if (whatsAppUrl.includes('wa.me/')) {
    return `${whatsAppUrl}${whatsAppUrl.includes('?') ? '&' : '?'}text=${encodedMessage}`;
  }

  const phone = whatsAppUrl.replace(/\D/g, '');
  return phone ? `https://wa.me/${phone}?text=${encodedMessage}` : '';
};

export const normalizeExternalLink = (value: string | undefined) => {
  const trimmedValue = String(value || '').trim();
  if (!trimmedValue) return '';

  if (/^https?:\/\//i.test(trimmedValue)) return trimmedValue;
  return `https://${trimmedValue}`;
};

export const renderFormattedText = (text: string, lineClass: string, emphasisClass: string) => {
  return text.split('\n').map((line, index) => {
    const parts = line.split(/(\*[^*]+\*)/g).filter(Boolean);

    return (
      <span key={`${line}-${index}`} className={lineClass}>
        {parts.length > 0 ? parts.map((part, partIndex) => {
          if (part.startsWith('*') && part.endsWith('*')) {
            return (
              <strong key={`${part}-${partIndex}`} className={emphasisClass}>
                {part.slice(1, -1)}
              </strong>
            );
          }

          return <span key={`${part}-${partIndex}`}>{part}</span>;
        }) : <span>&nbsp;</span>}
      </span>
    );
  });
};

export const getRecentStatusLabel = (statusText: string | undefined, statusTimestamp: number | null | undefined) => {
  if (!statusText || !statusTimestamp) return '';

  const diffMs = Date.now() - statusTimestamp;
  if (diffMs < 0 || diffMs > 24 * 60 * 60 * 1000) {
    return '';
  }

  const diffHours = Math.floor(diffMs / (60 * 60 * 1000));
  const relativeLabel = diffHours < 1 ? 'hace un momento' : `hace ${diffHours} hora${diffHours === 1 ? '' : 's'}`;

  return `${statusText} · ${relativeLabel}`;
};

export const getContactIcon = (tipo: string) => {
  const lowerTipo = (tipo || '').toLowerCase().trim();

  const iconMap: Record<string, typeof FaWhatsapp> = {
    whatsapp: FaWhatsapp,
    wa: FaWhatsapp,
    telegram: FaTelegramPlane,
    tg: FaTelegramPlane,
    instagram: FaInstagram,
    ig: FaInstagram,
    facebook: FaFacebookF,
    fb: FaFacebookF,
    x: FaXTwitter,
    twitter: FaXTwitter,
    grupos: FaUsers,
    grupo: FaUsers,
  };

  if (iconMap[lowerTipo]) return iconMap[lowerTipo];

  for (const [key, icon] of Object.entries(iconMap)) {
    if (lowerTipo.includes(key) || key.includes(lowerTipo)) {
      return icon;
    }
  }

  return FaLink;
};

export const getContactIconToneClass = (tipo: string) => {
  const lowerTipo = (tipo || '').toLowerCase().trim();

  if (lowerTipo.includes('whatsapp') || lowerTipo === 'wa') return 'is-whatsapp';
  if (lowerTipo.includes('telegram') || lowerTipo === 'tg') return 'is-telegram';
  if (lowerTipo.includes('instagram') || lowerTipo === 'ig') return 'is-instagram';
  if (lowerTipo.includes('facebook') || lowerTipo === 'fb') return 'is-facebook';
  if (lowerTipo === 'x' || lowerTipo.includes('twitter')) return 'is-x';
  if (lowerTipo.includes('grupo')) return 'is-group';

  return 'is-default';
};

export const getContactExtraLabel = (tipo: string, href: string) => {
  const lowerTipo = (tipo || '').toLowerCase().trim();

  if (!href) return '';

  try {
    const url = new URL(href);
    const host = url.hostname.toLowerCase();

    if (lowerTipo.includes('whatsapp') || lowerTipo === 'wa' || host.includes('wa.me') || host.includes('whatsapp')) {
      const waPath = url.pathname.split('/').filter(Boolean)[0] || '';
      const waPhone = host.includes('wa.me') ? waPath : (url.searchParams.get('phone') || '');
      const number = waPhone.replace(/\D/g, '');
      return number || '';
    }

    if (lowerTipo.includes('telegram') || lowerTipo === 'tg' || host.includes('t.me') || host.includes('telegram')) {
      const tgUser = url.pathname.split('/').filter(Boolean)[0] || '';
      return tgUser ? `@${tgUser.replace(/^@+/, '')}` : '';
    }
  } catch {
    // Ignore malformed URLs and skip extra label.
  }

  return '';
};

export const formatDisplayDate = (value: string | undefined) => {
  const raw = String(value || '').trim();
  if (!raw) return 'Sin fecha';

  const normalized = raw.split('T')[0];
  let parsedDate: Date | null = null;

  if (/^\d{4}-\d{2}-\d{2}$/.test(normalized)) {
    parsedDate = new Date(`${normalized}T00:00:00`);
  } else {
    const match = normalized.match(/^(\d{1,2})[/-](\d{1,2})[/-](\d{4})$/);
    if (match) {
      const day = Number(match[1]);
      const month = Number(match[2]);
      const year = Number(match[3]);
      parsedDate = new Date(year, month - 1, day);
    } else {
      const fallbackDate = new Date(raw);
      parsedDate = Number.isNaN(fallbackDate.getTime()) ? null : fallbackDate;
    }
  }

  if (!parsedDate || Number.isNaN(parsedDate.getTime())) return raw;

  const dayName = parsedDate.toLocaleDateString('es-ES', { weekday: 'short' }).replace('.', '');
  const day = parsedDate.getDate();
  const month = parsedDate.toLocaleDateString('es-ES', { month: 'long' });
  const year = parsedDate.getFullYear();

  return `${dayName} ${day} de ${month} de ${year}`;
};

export const extractWinnerParts = (value: any): string[] => {
  if (value == null) return [];

  if (typeof value === 'string' || typeof value === 'number') {
    const text = String(value).trim();
    return text ? [text] : [];
  }

  if (Array.isArray(value)) {
    return value.flatMap((item) => extractWinnerParts(item));
  }

  if (typeof value === 'object') {
    const preferredName = String(
      value?.nombre
      ?? value?.name
      ?? value?.usuario
      ?? value?.user
      ?? '',
    ).trim();
    const preferredEmoji = String(value?.emoji ?? value?.emoticono ?? '').trim();

    if (preferredName || preferredEmoji) {
      return [`${preferredName}${preferredEmoji ? ` ${preferredEmoji}` : ''}`.trim()];
    }

    return Object.values(value).flatMap((item) => extractWinnerParts(item));
  }

  return [];
};