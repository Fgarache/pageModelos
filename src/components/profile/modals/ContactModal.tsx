import { getContactIcon, getContactIconToneClass, getContactExtraLabel } from '../../../utils/profileHelpers';

interface ContactModalProps {
  contactLinks: any[];
  onClose: () => void;
}

export default function ContactModal({ contactLinks, onClose }: ContactModalProps) {
  return (
    <div className="profile-groups-modal-backdrop" onClick={onClose}>
      <div className="profile-groups-modal liquid-glass" onClick={(event) => event.stopPropagation()}>
        <div className="profile-groups-modal-header">
          <div>
            <span className="profile-meta-label">Contacto</span>
            <h3>Redes disponibles</h3>
          </div>
          <button type="button" className="profile-groups-close" onClick={onClose}>
            Cerrar
          </button>
        </div>

        <div className="profile-groups-list">
          {contactLinks.map((item) => {
            const Icon = getContactIcon(item.tipo);
            const extraLabel = getContactExtraLabel(item.tipo, item.href);

            return (
              <a key={`${item.tipo}-${item.href}`} href={item.href} target="_blank" rel="noreferrer" className="profile-group-item profile-contact-item">
                <strong>
                  <Icon className={`profile-contact-item-icon ${getContactIconToneClass(item.tipo)}`} />
                  {item.label}
                </strong>
                {extraLabel && <span className="profile-contact-item-subtle">{extraLabel}</span>}
              </a>
            );
          })}
        </div>
      </div>
    </div>
  );
}