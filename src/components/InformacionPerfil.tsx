import { useState } from 'react';
import ProfileCarousel from './profile/ProfileCarousel';
import FloatingContact from './profile/FloatingContact';
import ContactModal from './profile/modals/ContactModal';
import ServiceModal from './profile/modals/ServiceModal';
import TourCard from './TourCard';
import RifaCard from './RifaCard';
import { getWhatsAppLink, renderFormattedText, getRecentStatusLabel, formatDisplayDate, extractWinnerParts, getContactIcon } from '../utils/profileHelpers';

interface InformacionPerfilProps {
  user: any;
  hasTours?: boolean;
  activeTours?: any[];
  pastTours?: any[];
  hasRifas?: boolean;
  activeRifas?: any[];
  pastRifas?: any[];
  gallery?: Array<{ link?: string; titulo?: string; fecha?: string }>;
}

const parseTourDateLocal = (dateString: string | undefined) => {
  if (!dateString) return null;
  const parts = dateString.split('-');
  if (parts.length === 3) {
    return new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
  }
  return new Date(dateString);
};

const isTourToday = (fecha: string) => {
  const date = parseTourDateLocal(fecha);
  if (!date) return false;
  const today = new Date();
  return date.getDate() === today.getDate() &&
         date.getMonth() === today.getMonth() &&
         date.getFullYear() === today.getFullYear();
};

export default function InformacionPerfil({ user, hasTours = false, activeTours = [], pastTours = [], hasRifas = false, activeRifas = [], pastRifas = [], gallery = [] }: InformacionPerfilProps) {
  const [showFullBio, setShowFullBio] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);
  const [selectedService, setSelectedService] = useState<any | null>(null);
  const [activeTab, setActiveTab] = useState<'info' | 'tours' | 'rifas'>('info');
  const [showAllPastTours, setShowAllPastTours] = useState(false);
  const [showAllPastRifas, setShowAllPastRifas] = useState(false);

  if (!user) return null;

  const todayTour = activeTours.find(t => t.estado && isTourToday(t.fecha));
  const isAvailableToday = todayTour ? true : user.disponible;
  
  // If there's a tour today, get its locations
  let todayTourPlaces: string[] = [];
  if (todayTour) {
    todayTourPlaces = [todayTour.lugar, todayTour.lugarDisponible].filter(Boolean);
    todayTourPlaces = Array.from(new Set(todayTourPlaces.map(p => p.trim())));
  }
  
  const availableLocation = todayTour 
    ? (todayTourPlaces.join(' / ') || 'Tour de hoy') 
    : (user.disponibleLugar || 'Guatemala');

  const ubicaciones = user.ubicaciones || [];
  const servicios = user.servicios || [];
  const bioLines = (user.info || 'Perfil público activo en la plataforma.').split('\n');
  const visibleBio = showFullBio || bioLines.length <= 10 ? bioLines.join('\n') : bioLines.slice(0, 10).join('\n');

  // Redes
  const socialLinks = (user.redesArray || []).map((red: any) => ({ label: red.titulo || red.tipo, href: red.url, tipo: red.tipo })).filter((i: any) => i.href?.trim());
  const groupLinks = (user.grupos || []).map((grupo: any) => ({ label: grupo.titulo || 'Grupo', href: grupo.link, tipo: 'grupos' })).filter((i: any) => i.href?.trim());
  const contactLinks = [...socialLinks, ...groupLinks];
  
  const defaultContactHref = getWhatsAppLink(user.redes?.whatsapp, 'Hola, me gustaria contactar contigo.') || contactLinks[0]?.href || '';
  const normalizedLocation = String(availableLocation).normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  const availabilityFloatingMessage = normalizedLocation.includes('capital') ? 'Hoy estoy disponible en la capital' : `Solo por hoy estoy disponible en ${availableLocation}`;
  const recentStatusLabel = getRecentStatusLabel(user.estadoTexto, user.estadoActualizadoAt);
  const footerChipLabel = isAvailableToday ? `Hoy disponible en: ${availableLocation}` : 'No disponible';

  const hasActiveTourInLocation = (loc: string) => {
    const locLower = loc.toLowerCase().trim();
    return activeTours.some(tour => {
      const places = [tour.lugar, tour.lugarDisponible].filter(Boolean).map(p => p.toLowerCase().trim());
      if (places.includes(locLower)) return true;
      if (Array.isArray(tour.ubicacionesTour)) {
        return tour.ubicacionesTour.some((ut: any) => ut.label?.toLowerCase().trim() === locLower);
      }
      return false;
    });
  };





  return (
    <>
      <section className="profile-hero-card">
        <ProfileCarousel 
          user={user} 
          gallery={gallery} 
          footerChipLabel={footerChipLabel}
          isAvailableToday={isAvailableToday}
        />

        <div className="profile-copy-panel liquid-glass" style={{ display: 'flex', flexDirection: 'column', overflowX: 'hidden' }}>
          <div className="profile-tabs">
            <button className={`profile-tab-btn ${activeTab === 'info' ? 'active' : ''}`} onClick={() => setActiveTab('info')}>
              Información
            </button>
            {(hasTours || pastTours.length > 0) && (
              <button className={`profile-tab-btn ${activeTab === 'tours' ? 'active' : ''}`} onClick={() => setActiveTab('tours')}>
                Tours
              </button>
            )}
            {(hasRifas || pastRifas.length > 0) && (
              <button className={`profile-tab-btn ${activeTab === 'rifas' ? 'active' : ''}`} onClick={() => setActiveTab('rifas')}>
                Rifas
              </button>
            )}
          </div>

          <div style={{ flex: 1, overflowY: 'auto' }}>
            {activeTab === 'info' && (
              <div className="profile-tab-content">
                <div className="profile-copy-top">
                  <div className="profile-heading-row">
                    <div className="profile-name-block">
                      <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
                        <h1 className="profile-name-heading" style={{ display: 'flex', alignItems: 'center', marginBottom: 0 }}>
                          {user.nombre}
                          {user.verificado && (
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" style={{ width: 'clamp(22px, 3.5vw, 26px)', height: 'clamp(22px, 3.5vw, 26px)', marginLeft: '10px', flexShrink: 0 }}>
                              <path fill="#0866FF" d="M512 256c0-37.7-22.3-71.1-55.9-86.8 5.7-16.7 8.7-34.6 8.7-53.2 0-88.4-71.6-160-160-160-18.6 0-36.5 3-53.2 8.7C235.9 22.3 202.5 0 164.8 0 76.4 0 4.8 71.6 4.8 160c0 18.6 3 36.5 8.7 53.2C22.3 227.1 0 260.5 0 298.2c0 88.4 71.6 160 160 160 18.6 0 36.5-3 53.2-8.7 15.7 33.6 49.1 55.9 86.8 55.9 88.4 0 160-71.6 160-160 0-18.6-3-36.5-8.7-53.2 33.6-15.7 55.9-49.1 55.9-86.8z"/>
                              <path fill="#FFFFFF" d="M226.7 369.3c-7.3 7.3-19.1 7.3-26.4 0l-96-96c-7.3-7.3-7.3-19.1 0-26.4l26.4-26.4c7.3-7.3 19.1-7.3 26.4 0l56.4 56.4 135.6-135.6c7.3-7.3 19.1-7.3 26.4 0l26.4 26.4c7.3 7.3 7.3 19.1 0 26.4L226.7 369.3z"/>
                            </svg>
                          )}
                        </h1>
                        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                          {socialLinks.filter((l: any) => {
                            const t = (l.tipo || '').toLowerCase().trim();
                            return ['whatsapp', 'wa', 'telegram', 'tg', 'facebook', 'fb', 'x', 'twitter'].includes(t);
                          }).map((link: any, idx: number) => {
                            const Icon = getContactIcon(link.tipo);
                            const t = link.tipo.toLowerCase();
                            let color = 'rgba(255,255,255,0.8)';
                            if (t === 'whatsapp' || t === 'wa') color = '#25D366';
                            if (t === 'telegram' || t === 'tg') color = '#0088cc';
                            if (t === 'facebook' || t === 'fb') color = '#1877F2';
                            
                            return (
                              <a key={idx} href={link.href} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', color, transition: 'transform 0.2s' }} onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.15)'} onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}>
                                <Icon size={22} />
                              </a>
                            );
                          })}
                        </div>
                      </div>
                      {recentStatusLabel && <span className="profile-name-status">{recentStatusLabel}</span>}
                    </div>
                  </div>

                  {servicios.length > 0 && (
                    <div className="profile-services-block" id="detail-services" style={{ marginTop: '12px', marginBottom: '16px' }}>
                      <span className="profile-meta-label">Servicios</span>
                      <div className="profile-services-row">
                        {servicios.map((servicio: any, index: number) => (
                          <button key={`${servicio.nombre}-${index}`} type="button" className="profile-service-button" onClick={() => setSelectedService(servicio)}>
                            {servicio.nombre}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="profile-bio-copy">
                    {renderFormattedText(visibleBio, 'profile-bio-line', 'profile-bio-emphasis')}
                  </div>
                  {bioLines.length > 10 && (
                    <button type="button" className="profile-expand-button" onClick={() => setShowFullBio(!showFullBio)}>
                      {showFullBio ? 'Ver menos' : 'Ver más'}
                    </button>
                  )}
                </div>

                <div className="profile-meta-grid">
                  <article className="profile-meta-card profile-location-card">
                    {ubicaciones.length > 0 && (
                      <div className="profile-location-extra">
                        <span className="profile-location-extra-label">Lugares que también visito</span>
                        <div className="profile-services-row">
                          {ubicaciones.map((ubicacion: string) => {
                            const isTourActive = hasActiveTourInLocation(ubicacion);
                            return (
                              <span 
                                key={ubicacion} 
                                className="profile-service-button"
                                onClick={isTourActive ? () => setActiveTab('tours') : undefined}
                                style={isTourActive ? { 
                                  background: 'rgba(37, 211, 102, 0.15)', 
                                  borderColor: 'rgba(37, 211, 102, 0.4)', 
                                  color: '#7af0a5', 
                                  cursor: 'pointer' 
                                } : { opacity: 0.4, cursor: 'default' }}
                                title={isTourActive ? 'Ver tour disponible' : ''}
                              >
                                {ubicacion}
                              </span>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </article>
                </div>
              </div>
            )}

            {activeTab === 'tours' && (
              <div className="profile-tab-content edge-to-edge">
                {activeTours.length > 0 ? (
                  <div className="detail-card-grid detail-card-grid--tours">
                    {activeTours.map((tour) => (
                      <TourCard key={tour.id} tour={tour} modelInfo={user} />
                    ))}
                  </div>
                ) : (
                  <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.8rem', margin: '0 16px' }}>No hay tours activos en este momento.</p>
                )}

                {pastTours.length > 0 && (
                  <div className="liquid-glass past-items-box" style={{ marginTop: "24px" }}>
                    <h4 style={{ margin: '0 0 6px 0', color: '#f3d77c', fontSize: '0.64rem', letterSpacing: '0.04em', textTransform: 'uppercase', lineHeight: 1.05 }}>
                      Visita a departamentos pasados
                    </h4>
                    <div style={{ display: 'grid', gap: '4px' }}>
                      {(showAllPastTours ? pastTours : pastTours.slice(0, 1)).map((tour) => (
                        <div key={`past-${tour.id}`} style={{ display: 'flex', justifyContent: 'space-between', gap: '8px', color: 'rgba(255,255,255,0.85)', fontSize: '0.68rem', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '4px', lineHeight: 1.1 }}>
                          <span style={{ fontWeight: 700 }}>{tour.titulo || 'Tour'}</span>
                          <span style={{ color: 'rgba(255,255,255,0.65)', fontSize: '0.62rem', lineHeight: 1 }}>{formatDisplayDate(tour.fecha)}</span>
                        </div>
                      ))}
                    </div>

                    {pastTours.length > 1 && (
                      <button
                        type="button"
                        onClick={() => setShowAllPastTours((current) => !current)}
                        style={{ marginTop: '8px', padding: '5px 8px', borderRadius: '8px', border: '1px solid rgba(243, 215, 124, 0.35)', background: 'rgba(243, 215, 124, 0.08)', color: '#f3d77c', cursor: 'pointer', fontSize: '0.62rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.03em', lineHeight: 1 }}
                      >
                        {showAllPastTours ? 'Ver menos' : 'Ver más'}
                      </button>
                    )}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'rifas' && (
              <div className="profile-tab-content edge-to-edge">
                {activeRifas.length > 0 ? (
                  <div className="detail-card-grid detail-card-grid--rifas">
                    {activeRifas.map((rifa) => (
                      <RifaCard key={rifa.id} rifa={rifa} modelInfo={user} />
                    ))}
                  </div>
                ) : (
                  <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.8rem', margin: '0 16px' }}>No hay rifas activas en este momento.</p>
                )}

                {pastRifas.length > 0 && (
                  <div className="liquid-glass past-items-box">
                    <h4 style={{ margin: '0 0 6px 0', color: '#f3d77c', fontSize: '0.64rem', letterSpacing: '0.04em', textTransform: 'uppercase', lineHeight: 1.05 }}>
                      Rifas pasadas
                    </h4>
                    <div style={{ display: 'grid', gap: '4px' }}>
                      {(showAllPastRifas ? pastRifas : pastRifas.slice(0, 1)).map((rifa) => {
                        const winners = extractWinnerParts(rifa.ganadores);
                        const winnersText = winners.length > 0 ? winners.join(' ').replace(/\s+/g, ' ').trim() : 'Sin ganadores';
                        return (
                          <div key={`past-rifa-${rifa.id}`} style={{ display: 'grid', gap: '2px', color: 'rgba(255,255,255,0.85)', fontSize: '0.66rem', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '4px', lineHeight: 1.1 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '8px', alignItems: 'flex-start' }}>
                              <span style={{ fontWeight: 700 }}>{rifa.titulo || 'Rifa'}</span>
                              <span style={{ color: 'rgba(255,255,255,0.62)', fontSize: '0.62rem', lineHeight: 1 }}>{formatDisplayDate(rifa.fechaSorteo)}</span>
                            </div>
                            <span style={{ color: 'rgba(255,255,255,0.75)' }}>Premio: {rifa.premio || 'Sin premio'}</span>
                            <span style={{ color: 'rgba(255,255,255,0.92)', fontWeight: 800, fontSize: '0.78rem', lineHeight: 1.15, whiteSpace: 'pre-wrap', fontFamily: 'Segoe UI Emoji, Apple Color Emoji, Noto Color Emoji, Segoe UI, sans-serif' }}>
                              Ganadores: {winnersText}
                            </span>
                          </div>
                        );
                      })}
                    </div>

                    {pastRifas.length > 1 && (
                      <button
                        type="button"
                        onClick={() => setShowAllPastRifas((current) => !current)}
                        style={{ marginTop: '8px', padding: '5px 8px', borderRadius: '8px', border: '1px solid rgba(243, 215, 124, 0.35)', background: 'rgba(243, 215, 124, 0.08)', color: '#f3d77c', cursor: 'pointer', fontSize: '0.62rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.03em', lineHeight: 1 }}
                      >
                        {showAllPastRifas ? 'Ver menos' : 'Ver más'}
                      </button>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </section>

      <FloatingContact 
        contactLinks={contactLinks}
        availabilityFloatingMessage={availabilityFloatingMessage}
        hasTours={hasTours}
        hasRifas={hasRifas}
        onOpenContactModal={() => setShowContactModal(true)}
      />

      {showContactModal && (
        <ContactModal 
          contactLinks={contactLinks} 
          onClose={() => setShowContactModal(false)} 
        />
      )}

      {selectedService && (
        <ServiceModal 
          service={selectedService} 
          user={user}
          defaultContactHref={defaultContactHref}
          onClose={() => setSelectedService(null)} 
        />
      )}
    </>
  );
}