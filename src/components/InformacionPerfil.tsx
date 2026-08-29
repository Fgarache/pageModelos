import { useState } from 'react';
import ProfileCarousel from './profile/ProfileCarousel';
import FloatingContact from './profile/FloatingContact';
import ContactModal from './profile/modals/ContactModal';
import ServiceModal from './profile/modals/ServiceModal';
import { getWhatsAppLink, renderFormattedText, getRecentStatusLabel } from '../utils/profileHelpers';

interface InformacionPerfilProps {
  user: any;
  hasTours?: boolean;
  activeTours?: any[];
  hasRifas?: boolean;
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

export default function InformacionPerfil({ user, hasTours = false, activeTours = [], hasRifas = false, gallery = [] }: InformacionPerfilProps) {
  const [showFullBio, setShowFullBio] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);
  const [selectedService, setSelectedService] = useState<any | null>(null);

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

  const handleScrollToServices = () => {
    document.getElementById('detail-services')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <>
      <section className="profile-hero-card">
        <ProfileCarousel 
          user={user} 
          gallery={gallery} 
          hasTours={hasTours} 
          hasRifas={hasRifas} 
          onScrollToServices={handleScrollToServices}
          footerChipLabel={footerChipLabel}
          isAvailableToday={isAvailableToday}
        />

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
            </div>
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
                  <div className="profile-tag-row">
                    {ubicaciones.map((ubicacion: string) => (
                      <span key={ubicacion} className="profile-tag-chip">{ubicacion}</span>
                    ))}
                  </div>
                </div>
              )}
            </article>
          </div>

          {servicios.length > 0 && (
            <div className="profile-services-block" id="detail-services">
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