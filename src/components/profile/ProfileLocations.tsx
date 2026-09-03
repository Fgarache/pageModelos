import { FaMapMarkerAlt, FaCalendarAlt, FaChevronRight } from 'react-icons/fa';
import { formatDisplayDate } from '../../utils/profileHelpers';

interface ProfileLocationsProps {
  user: any;
  activeTours: any[];
  ubicaciones: string[];
  setActiveTab: (tab: 'info' | 'tours' | 'rifas') => void;
}

export default function ProfileLocations({
  activeTours,
  ubicaciones,
  setActiveTab,
}: ProfileLocationsProps) {
  // Solo se muestra si hay tours activos
  if (!activeTours || activeTours.length === 0) {
    return null;
  }

  const hasActiveTourInLocation = (loc: string) => {
    const locLower = loc.toLowerCase().trim();
    return activeTours.some((tour) => {
      const places = [tour.lugar, tour.lugarDisponible]
        .filter(Boolean)
        .map((p) => p.toLowerCase().trim());
      if (places.includes(locLower)) return true;
      if (Array.isArray(tour.ubicacionesTour)) {
        return tour.ubicacionesTour.some(
          (ut: any) => ut.label?.toLowerCase().trim() === locLower
        );
      }
      return false;
    });
  };

  const inactiveLocations = ubicaciones.filter(
    (loc: string) => !hasActiveTourInLocation(loc)
  );

  return (
    <article className="profile-locations-card">
      <section className="profile-locations-section">
        <div className="profile-locations-header-row">
          <div className="profile-locations-header-left">
            <FaCalendarAlt className="profile-locations-icon" />
            <span className="profile-meta-label" style={{ margin: 0 }}>
              Próximas visitas a departamentos
            </span>
          </div>
        </div>

        <div className="profile-tours-list">
          {activeTours.map((tour) => {
            const places = [tour.lugar, tour.lugarDisponible].filter(Boolean);
            const uniquePlaces = Array.from(
              new Set(places.map((p: any) => p.trim()))
            );
            let locName = uniquePlaces.join(' / ');
            if (
              !locName &&
              Array.isArray(tour.ubicacionesTour) &&
              tour.ubicacionesTour.length > 0
            ) {
              locName = tour.ubicacionesTour.map((u: any) => u.label).join(' / ');
            }
            locName = locName || tour.titulo || 'Tour';
            const dateText = formatDisplayDate(tour.fecha).replace(
              / de \d{4}$/,
              ''
            );

            return (
              <button
                key={`upcoming-${tour.id}`}
                type="button"
                className="profile-tour-item-btn"
                onClick={() => setActiveTab('tours')}
                title={`Ver detalles del tour en ${locName}`}
              >
                <span className="profile-tour-destination">
                  <FaMapMarkerAlt className="profile-tour-destination-icon" />
                  <span className="profile-tour-name-text">{locName}</span>
                </span>

                <div className="profile-tour-right-meta">
                  <span className="profile-tour-date-badge">
                    {dateText}
                  </span>
                  <FaChevronRight className="profile-tour-arrow" />
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {inactiveLocations.length > 0 && (
        <>
          <div className="profile-locations-divider" />
          <section className="profile-locations-section profile-locations-section--compact">
            <div className="profile-locations-header-row">
              <div className="profile-locations-header-left">
                <FaMapMarkerAlt className="profile-locations-icon-small" />
                <span className="profile-meta-label profile-meta-label--small" style={{ margin: 0 }}>
                  Lugares que también visito
                </span>
              </div>
            </div>

            <div className="profile-inactive-chips-row">
              {inactiveLocations.map((ubicacion: string) => (
                <span key={ubicacion} className="profile-inactive-chip">
                  <span className="profile-inactive-chip-dot" />
                  {ubicacion}
                </span>
              ))}
            </div>
          </section>
        </>
      )}
    </article>
  );
}
