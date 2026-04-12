import { useEffect, useMemo, useState } from 'react';
import { FaUsers } from 'react-icons/fa';
import SocialLinksRow from './SocialLinksRow';

interface InformacionPerfilProps {
  user: any;
  hasTours?: boolean;
  hasRifas?: boolean;
  gallery?: Array<{ link?: string; titulo?: string; fecha?: string }>;
}

const getWhatsAppLink = (whatsAppUrl: string | undefined, message: string) => {
  if (!whatsAppUrl) return '';

  const encodedMessage = encodeURIComponent(message);

  if (whatsAppUrl.includes('wa.me/')) {
    return `${whatsAppUrl}${whatsAppUrl.includes('?') ? '&' : '?'}text=${encodedMessage}`;
  }

  const phone = whatsAppUrl.replace(/\D/g, '');
  return phone ? `https://wa.me/${phone}?text=${encodedMessage}` : '';
};

const renderFormattedBio = (text: string) => {
  return text.split('\n').map((line, index) => {
    const parts = line.split(/(\*[^*]+\*)/g).filter(Boolean);

    return (
      <span key={`${line}-${index}`} className="profile-bio-line">
        {parts.length > 0 ? parts.map((part, partIndex) => {
          if (part.startsWith('*') && part.endsWith('*')) {
            return (
              <strong key={`${part}-${partIndex}`} className="profile-bio-emphasis">
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

const getRecentStatusLabel = (statusText: string | undefined, statusTimestamp: number | null | undefined) => {
  if (!statusText || !statusTimestamp) return '';

  const diffMs = Date.now() - statusTimestamp;
  if (diffMs < 0 || diffMs > 24 * 60 * 60 * 1000) {
    return '';
  }

  const diffHours = Math.floor(diffMs / (60 * 60 * 1000));
  const relativeLabel = diffHours < 1 ? 'hace un momento' : `hace ${diffHours} hora${diffHours === 1 ? '' : 's'}`;

  return `${statusText} · ${relativeLabel}`;
};

export default function InformacionPerfil({ user, hasTours = false, hasRifas = false, gallery = [] }: InformacionPerfilProps) {
  const [showFullBio, setShowFullBio] = useState(false);
  const [showGroupsModal, setShowGroupsModal] = useState(false);
  const [activeSlide, setActiveSlide] = useState(0);

  if (!user) return null;

  const ubicaciones = user.ubicaciones || [];
  const servicios = user.servicios || [];
  const grupos = user.grupos || [];
  const bioLines = (user.info || 'Perfil público activo en la plataforma.').split('\n');
  const visibleBio = showFullBio || bioLines.length <= 10
    ? bioLines.join('\n')
    : bioLines.slice(0, 10).join('\n');

  // Preparar redes sociales para el componente SocialLinksRow
  const socialLinks = (user.redesArray || [])
    .map((red: any) => ({
      label: red.titulo || red.tipo,
      href: red.url,
      tipo: red.tipo,
    }))
    .filter((item: any) => item.href && item.href.trim());

  const serviceLinks = servicios.map((servicio: string) => ({
    servicio,
    href: getWhatsAppLink(user.redes?.whatsapp, `Hola, ${user.nombre} quieroo mas informacion sobre ${servicio}`),
  }));
  const recentStatusLabel = getRecentStatusLabel(user.estadoTexto, user.estadoActualizadoAt);
  const footerChipLabel = `Disponible hoy en ${user.disponibleLugar || 'Guatemala'}`;

  const slides = useMemo(() => {
    const items = [
      user.fotoPerfil ? { link: user.fotoPerfil, titulo: user.nombre } : null,
      ...gallery,
    ].filter((item): item is { link?: string; titulo?: string; fecha?: string } => Boolean(item?.link));

    const seen = new Set<string>();

    return items.filter((item) => {
      if (!item.link || seen.has(item.link)) return false;
      seen.add(item.link);
      return true;
    });
  }, [gallery, user.fotoPerfil, user.nombre]);

  useEffect(() => {
    if (slides.length <= 1) return undefined;

    const intervalId = window.setInterval(() => {
      setActiveSlide((current) => (current + 1) % slides.length);
    }, 7000);

    return () => window.clearInterval(intervalId);
  }, [slides.length]);

  useEffect(() => {
    if (activeSlide >= slides.length) {
      setActiveSlide(0);
    }
  }, [activeSlide, slides.length]);

  const currentSlide = slides[activeSlide];
  const goToPreviousSlide = () => {
    setActiveSlide((current) => (current - 1 + slides.length) % slides.length);
  };

  const goToNextSlide = () => {
    setActiveSlide((current) => (current + 1) % slides.length);
  };

  const handleScrollToServices = () => {
    const servicesSection = document.getElementById('detail-services');
    servicesSection?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const preventImageActions = (event: React.SyntheticEvent) => {
    event.preventDefault();
  };

  return (
    <>
      <section className="profile-hero-card">
        <div className="profile-visual-panel" onContextMenu={preventImageActions}>
          {(hasTours || hasRifas || servicios.length > 0) && (
            <div className="profile-image-jump-nav">
              {hasTours && (
                <a href="#detail-tours" className="profile-image-jump-link">
                  Tours
                </a>
              )}
              {hasRifas && (
                <a href="#detail-rifas" className="profile-image-jump-link">
                  Rifas
                </a>
              )}
              {servicios.length > 0 && (
                <button type="button" className="profile-image-jump-link" onClick={handleScrollToServices}>
                  Servicios
                </button>
              )}
            </div>
          )}

          {currentSlide ? (
            <>
              <img
                key={currentSlide.link}
                src={currentSlide.link}
                alt={currentSlide.titulo || user.nombre}
                className="profile-main-image profile-main-image--animated"
                draggable={false}
                onDragStart={preventImageActions}
                onContextMenu={preventImageActions}
              />
              <div className="profile-main-image-guard" aria-hidden="true" />
              <div className="profile-watermark">LindasGT.com</div>

              {slides.length > 1 && (
                <>
                  <div className="profile-carousel-controls">
                    <button type="button" className="profile-carousel-button" onClick={goToPreviousSlide} aria-label="Foto anterior">
                      ‹
                    </button>
                    <button type="button" className="profile-carousel-button" onClick={goToNextSlide} aria-label="Foto siguiente">
                      ›
                    </button>
                  </div>
                </>
              )}

              <div className="profile-visual-footer">
                <div className="profile-visual-overlay">
                  <span className={`profile-status-chip ${user.disponible ? 'is-available' : 'is-busy'}`}>
                    {user.disponible ? footerChipLabel : 'Agenda cerrada'}
                  </span>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="profile-main-image profile-main-image--placeholder">{user.nombre?.charAt(0)}</div>
              <div className="profile-visual-footer">
                <div className="profile-visual-overlay">
                  <span className={`profile-status-chip ${user.disponible ? 'is-available' : 'is-busy'}`}>
                    {user.disponible ? footerChipLabel : 'Agenda cerrada'}
                  </span>
                </div>
              </div>
            </>
          )}

        </div>

        <div className="profile-copy-panel liquid-glass">
          <div className="profile-copy-top">
            <span className="profile-kicker">Perfil Verificado</span>
            <div className="profile-heading-row">
              <div className="profile-name-block">
                <h1 className="profile-name-heading">
                  {user.nombre}
                  {user.verificado && <span className="profile-verified-mark">✓</span>}
                </h1>
                {recentStatusLabel && <span className="profile-name-status">{recentStatusLabel}</span>}
              </div>

              <div className="profile-name-icons">
                {socialLinks.length > 0 && <SocialLinksRow links={socialLinks} />}

                {grupos.length > 0 && (
                  <button type="button" className="profile-social-link profile-groups-trigger" onClick={() => setShowGroupsModal(true)} aria-label="Grupos" title="Grupos">
                    <FaUsers className="profile-social-icon" />
                    <span className="profile-social-label">Grupos</span>
                  </button>
                )}
              </div>
            </div>
            <div className="profile-bio-copy">{renderFormattedBio(visibleBio)}</div>
            {bioLines.length > 10 && (
              <button type="button" className="profile-expand-button" onClick={() => setShowFullBio((current) => !current)}>
                {showFullBio ? 'Ver menos' : 'Ver más'}
              </button>
            )}
          </div>

          <div className="profile-meta-grid">
            <article className="profile-meta-card profile-location-card">
              <div className="profile-location-current">
                <span className="profile-meta-label">Hoy disponible en</span>
                <strong>{user.disponibleLugar || 'Guatemala'}</strong>
              </div>

              {ubicaciones.length > 0 && (
                <div className="profile-location-extra">
                  <span className="profile-location-extra-label">Lugares que también visito</span>
                  <div className="profile-tag-row">
                    {ubicaciones.map((ubicacion: string) => (
                      <span key={ubicacion} className="profile-tag-chip">{ubicacion}</span>
                    ))}
                  </div>
                </div>
              )}
            </article>
          </div>

          {serviceLinks.length > 0 && (
            <div className="profile-services-block" id="detail-services">
              <span className="profile-meta-label">Servicios</span>
              <div className="profile-services-row">
                {serviceLinks.map(({ servicio, href }: { servicio: string; href: string }) => (
                  href ? (
                    <a key={servicio} href={href} target="_blank" rel="noreferrer" className="profile-service-button">
                      {servicio}
                    </a>
                  ) : (
                    <span key={servicio} className="profile-service-button is-disabled">
                      {servicio}
                    </span>
                  )
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {showGroupsModal && (
        <div className="profile-groups-modal-backdrop" onClick={() => setShowGroupsModal(false)}>
          <div className="profile-groups-modal liquid-glass" onClick={(event) => event.stopPropagation()}>
            <div className="profile-groups-modal-header">
              <div>
                <span className="profile-meta-label">Grupos</span>
                <h3>Canales y grupos</h3>
              </div>
              <button type="button" className="profile-groups-close" onClick={() => setShowGroupsModal(false)}>
                Cerrar
              </button>
            </div>

            <div className="profile-groups-list">
              {grupos.map((grupo: { titulo: string; link: string }) => (
                <a key={`${grupo.titulo}-${grupo.link}`} href={grupo.link} target="_blank" rel="noreferrer" className="profile-group-item">
                  <strong>{grupo.titulo}</strong>
                  <span>{grupo.link}</span>
                </a>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}