import { Link, useParams } from 'react-router-dom';
import { TOUR_LOCATION_MAP } from './locationData';
import '../../styles/TourLocationPage.css';

export default function TourLocationPage() {
  const { locationSlug } = useParams();
  const locationInfo = locationSlug ? TOUR_LOCATION_MAP[locationSlug] : null;

  if (!locationInfo) {
    return (
      <main className="tour-location-page">
        <section className="tour-location-card">
          <span className="tour-location-badge">Ubicacion no encontrada</span>
          <h1 className="tour-location-title">No encontramos esta ubicacion</h1>
          <p className="tour-location-description">
            Esta ruta de tours no existe o fue movida. Puedes volver al inicio para seguir explorando.
          </p>
          <Link to="/" className="tour-location-button">
            Ver pagina principal
          </Link>
        </section>
      </main>
    );
  }

  return (
    <main className="tour-location-page">
      <section className="tour-location-card">
        <span className="tour-location-badge">Destino destacado</span>
        <h1 className="tour-location-title">{locationInfo.title}</h1>
        <p className="tour-location-subtitle">{locationInfo.headline}</p>
        <p className="tour-location-description">{locationInfo.description}</p>

        {locationInfo.aliases && locationInfo.aliases.length > 0 && (
          <p className="tour-location-aliases">
            Tambien buscado como: {locationInfo.aliases.join(', ')}.
          </p>
        )}

        <ul className="tour-location-list">
          {locationInfo.highlights.map((highlight) => (
            <li key={highlight}>{highlight}</li>
          ))}
        </ul>

        <Link to="/" className="tour-location-button">
          Ver pagina principal
        </Link>
      </section>
    </main>
  );
}
