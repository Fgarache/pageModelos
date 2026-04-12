import { useState } from 'react';
import { FaFacebookF, FaInstagram, FaTelegramPlane, FaUsers, FaWhatsapp, FaLink } from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';

interface SocialLink {
  label: string;
  href: string;
  tipo: string;
}

interface SocialLinksRowProps {
  links: SocialLink[];
}

const getSocialIcon = (tipo: string) => {
  const lowerTipo = (tipo || '').toLowerCase().trim();

  const iconMap: Record<string, typeof FaWhatsapp> = {
    'whatsapp': FaWhatsapp,
    'wa': FaWhatsapp,
    'telegram': FaTelegramPlane,
    'tg': FaTelegramPlane,
    'instagram': FaInstagram,
    'ig': FaInstagram,
    'facebook': FaFacebookF,
    'fb': FaFacebookF,
    'x': FaXTwitter,
    'twitter': FaXTwitter,
  };

  if (iconMap[lowerTipo]) {
    return iconMap[lowerTipo];
  }

  for (const [key, icon] of Object.entries(iconMap)) {
    if (lowerTipo.includes(key) || key.includes(lowerTipo)) {
      return icon;
    }
  }

  return FaLink;
};

const isPrimaryNetwork = (tipo: string): boolean => {
  const lowerTipo = (tipo || '').toLowerCase().trim();
  const primaryTypes = ['whatsapp', 'wa', 'telegram', 'tg', 'instagram', 'ig', 'facebook', 'fb', 'x', 'twitter'];
  
  // Es primario si es exactamente uno de los tipos principales
  return primaryTypes.includes(lowerTipo);
};

const getGroupIcon = (tipo: string) => {
  const lowerTipo = (tipo || '').toLowerCase().trim();
  
  if (lowerTipo.includes('telegram')) return FaTelegramPlane;
  if (lowerTipo.includes('whatsapp') || lowerTipo.includes('wa')) return FaWhatsapp;
  
  return FaUsers;
};

export default function SocialLinksRow({ links }: SocialLinksRowProps) {
  const [showGroups, setShowGroups] = useState(false);

  if (!links || links.length === 0) {
    return null;
  }

  // Separar redes principales de grupos
  const primaryLinks = links.filter(link => isPrimaryNetwork(link.tipo));
  const groupLinks = links.filter(link => !isPrimaryNetwork(link.tipo));

  return (
    <div className="profile-name-icons">
      {/* Redes principales - mostrar normalmente */}
      {primaryLinks.map((item) => {
        const Icon = getSocialIcon(item.tipo);
        return (
          <a
            key={`${item.tipo}-${item.href}`}
            href={item.href}
            target="_blank"
            rel="noreferrer"
            className="profile-social-link"
            aria-label={item.label}
            title={item.label}
          >
            <Icon className="profile-social-icon" />
            <span className="profile-social-label">{item.label}</span>
          </a>
        );
      })}

      {/* Botón Grupos - si hay canales/grupos */}
      {groupLinks.length > 0 && (
        <div className="profile-social-group">
          <button
            type="button"
            className={`profile-social-group-trigger ${showGroups ? 'is-expanded' : ''}`}
            onClick={() => setShowGroups(!showGroups)}
            aria-label="Grupos y canales"
            title="Grupos y canales"
          >
            <FaUsers className="profile-social-icon" />
            <span className="profile-social-label">Grupos</span>
          </button>

          {/* Desplegable de grupos */}
          {showGroups && (
            <div className="profile-social-group-content">
              {groupLinks.map((link) => {
                const Icon = getGroupIcon(link.tipo);
                return (
                  <a
                    key={`${link.tipo}-${link.href}`}
                    href={link.href}
                    target="_blank"
                    rel="noreferrer"
                    className="profile-social-group-link"
                    aria-label={link.label}
                    title={link.label}
                  >
                    <Icon className="profile-social-group-link-icon" />
                    <span className="profile-social-group-link-label">{link.label}</span>
                  </a>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}


