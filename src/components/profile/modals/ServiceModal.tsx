import { renderFormattedText, normalizeExternalLink, getWhatsAppLink } from '../../../utils/profileHelpers';

interface ServiceModalProps {
  service: any;
  user: any;
  defaultContactHref: string;
  onClose: () => void;
}

export default function ServiceModal({ service, user, defaultContactHref, onClose }: ServiceModalProps) {
  const getServiceAction = () => {
    const directServiceLink = normalizeExternalLink(service.link);
    if (directServiceLink) return { href: directServiceLink, label: 'Link' };
    
    const fallbackWhatsAppLink = getWhatsAppLink(user.redes?.whatsapp, `Hola, me gustaria contactar el servicio ${service.nombre}.`);
    if (fallbackWhatsAppLink) return { href: fallbackWhatsAppLink, label: 'Contactar por WhatsApp' };
    
    return { href: defaultContactHref, label: defaultContactHref ? 'Contactar' : 'Sin enlace disponible' };
  };

  const serviceAction = getServiceAction();

  return (
    <div className="profile-groups-modal-backdrop" onClick={onClose}>
      <div className="profile-groups-modal liquid-glass" onClick={(e) => e.stopPropagation()}>
        <div className="profile-groups-modal-header">
          <div>
            <span className="profile-meta-label">Servicio</span>
            <h3>{service.nombre}</h3>
          </div>
          <button type="button" className="profile-groups-close" onClick={onClose}>Cerrar</button>
        </div>
        <div className="profile-service-modal-body">
          {service.detalles && (
            <p className="profile-service-modal-copy">
              {renderFormattedText(service.detalles, 'profile-service-modal-line', 'profile-service-modal-emphasis')}
            </p>
          )}
          {service.precio && <p className="profile-service-modal-price">Precio: Q{service.precio}</p>}
          {serviceAction.href ? (
            <a href={serviceAction.href} target="_blank" rel="noreferrer" className="profile-service-cta">
              {serviceAction.label}
            </a>
          ) : (
            <button type="button" className="profile-service-cta is-disabled" disabled>
              {serviceAction.label}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}