import { FaGift, FaCalendarAlt, FaChevronRight } from 'react-icons/fa';
import { formatDisplayDate } from '../../utils/profileHelpers';

interface ProfileRifaCardProps {
  activeRifas?: any[];
  setActiveTab: (tab: 'info' | 'tours' | 'rifas') => void;
}

export default function ProfileRifaCard({
  activeRifas = [],
  setActiveTab,
}: ProfileRifaCardProps) {
  if (!activeRifas || activeRifas.length === 0) {
    return null;
  }

  return (
    <>
      {activeRifas.map((rifa) => {
        const dateText = formatDisplayDate(rifa.fechaSorteo).replace(
          / de \d{4}$/,
          ''
        );

        return (
          <article key={`promo-rifa-${rifa.id}`} className="profile-rifa-card">
            <div className="profile-rifa-header-row">
              <div className="profile-rifa-header-left">
                <FaGift className="profile-rifa-icon" />
                <span className="profile-meta-label" style={{ margin: 0 }}>
                  Rifa disponible
                </span>
              </div>
              <span className="profile-rifa-badge">¡Activa!</span>
            </div>

            <h3 className="profile-rifa-title">{rifa.titulo}</h3>

            <div className="profile-rifa-meta-grid">
              <div className="profile-rifa-meta-item">
                <span className="profile-rifa-meta-label">Precio por número</span>
                <span className="profile-rifa-meta-value price">Q{rifa.precio}</span>
              </div>
              <div className="profile-rifa-meta-item">
                <span className="profile-rifa-meta-label">Fecha del sorteo</span>
                <span className="profile-rifa-meta-value">
                  <FaCalendarAlt
                    size={11}
                    style={{ color: '#d4af37', flexShrink: 0 }}
                  />
                  <span>{dateText}</span>
                </span>
              </div>
            </div>

            <button
              type="button"
              className="profile-rifa-cta-btn"
              onClick={() => setActiveTab('rifas')}
            >
              <span>Ver detalles</span>
              <FaChevronRight size={10} className="cta-arrow" />
            </button>
          </article>
        );
      })}
    </>
  );
}
