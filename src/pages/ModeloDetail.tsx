import { useCallback, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { API_FIREBASE } from '../data';
import InformacionPerfil from '../components/InformacionPerfil';
import PageSectionHeader from '../components/PageSectionHeader';
import TourCard from '../components/TourCard';
import TourModal from '../components/TourModal';
import RifaCard from '../components/RifaCard';
import '../styles/ModeloDetail.css';

const formatDisplayDate = (value: string | undefined) => {
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

const extractWinnerParts = (value: any): string[] => {
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

const ModeloDetail = () => {
  const { user: userAlias } = useParams();
  const [modelo, setModelo] = useState<any>(null);
  const [tours, setTours] = useState<any[]>([]);
  const [pastOrDisabledTours, setPastOrDisabledTours] = useState<any[]>([]);
  const [rifas, setRifas] = useState<any[]>([]);
  const [pastOrDisabledRifas, setPastOrDisabledRifas] = useState<any[]>([]);
  const [showAllPastTours, setShowAllPastTours] = useState(false);
  const [showAllPastRifas, setShowAllPastRifas] = useState(false);
  const [selectedTour, setSelectedTour] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const closeTourModal = useCallback(() => {
    setSelectedTour(null);
  }, []);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        
        const modelData = await API_FIREBASE.getUserInfo(userAlias || '');
        if (!modelData) {
          setError('Modelo no encontrado');
          setLoading(false);
          return;
        }
        
        setModelo(modelData);
        
        const toursData = await API_FIREBASE.getTours(modelData.id);
        setTours(toursData);

        const pastToursData = await API_FIREBASE.getToursPastOrDisabled(modelData.id);
        setPastOrDisabledTours(pastToursData);
        
        const rifasData = await API_FIREBASE.getRifas(modelData.id);
        setRifas(rifasData);

        const pastRifasData = await API_FIREBASE.getRifasPastOrDisabled(modelData.id);
        setPastOrDisabledRifas(pastRifasData);
        
        setLoading(false);
      } catch (err) {
        console.error('Error cargando datos del modelo:', err);
        setError('Error al cargar los datos');
        setLoading(false);
      }
    };

    loadData();
  }, [userAlias]);

  useEffect(() => {
    if (!selectedTour || typeof window === 'undefined') return undefined;

    const currentState = (window.history.state && typeof window.history.state === 'object')
      ? window.history.state
      : {};

    window.history.pushState({ ...currentState, __tourModalOpen: true }, '');

    const handlePopState = () => {
      setSelectedTour(null);
    };

    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [selectedTour]);

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="error-card liquid-glass">Cargando perfil...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-screen">
        <div className="error-card liquid-glass">
          <p>{error}</p>
          <Link to="/modelos" className="back-link-glass">Volver al catálogo</Link>
        </div>
      </div>
    );
  }

  if (!modelo) {
    return (
      <div className="error-screen">
        <div className="error-card liquid-glass">Modelo no encontrado</div>
      </div>
    );
  }

  const gallery = Object.values(modelo.fotos || {});
  const visiblePastTours = showAllPastTours ? pastOrDisabledTours : pastOrDisabledTours.slice(0, 3);
  const visiblePastRifas = showAllPastRifas ? pastOrDisabledRifas : pastOrDisabledRifas.slice(0, 3);

  return (
    <div className="modelo-detail-page">
      <div className="detail-bg-orb orb-left"></div>
      <div className="detail-bg-orb orb-right"></div>

      <div className="detail-container">
        <InformacionPerfil user={modelo} hasTours={tours.length > 0} hasRifas={rifas.length > 0} gallery={gallery as Array<{ link?: string; titulo?: string; fecha?: string }>} />

        {tours.length > 0 && (
          <section className="detail-section" id="detail-tours">
            <PageSectionHeader
              title="TOURS"
              accent="DISPONIBLES"
              description="Ubicaciones y horarios activos."
              compact
            />
            <div className="detail-card-grid detail-card-grid--tours">
              {tours.map((tour) => (
                <TourCard key={tour.id} tour={tour} modelInfo={modelo} onShowModal={setSelectedTour} />
              ))}
            </div>

            {pastOrDisabledTours.length > 0 && (
              <div className="liquid-glass" style={{ marginTop: '12px', borderRadius: '14px', padding: '10px' }}>
                <h4 style={{ margin: '0 0 6px 0', color: '#f3d77c', fontSize: '0.64rem', letterSpacing: '0.04em', textTransform: 'uppercase', lineHeight: 1.05 }}>
                  Visita a departamentos pasados
                </h4>
                <div style={{ display: 'grid', gap: '4px' }}>
                  {visiblePastTours.map((tour) => (
                    <div key={`past-${tour.id}`} style={{ display: 'flex', justifyContent: 'space-between', gap: '8px', color: 'rgba(255,255,255,0.85)', fontSize: '0.68rem', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '4px', lineHeight: 1.1 }}>
                      <span style={{ fontWeight: 700 }}>{tour.titulo || 'Tour'}</span>
                      <span style={{ color: 'rgba(255,255,255,0.65)', fontSize: '0.62rem', lineHeight: 1 }}>{formatDisplayDate(tour.fecha)}</span>
                    </div>
                  ))}
                </div>

                {pastOrDisabledTours.length > 3 && (
                  <button
                    type="button"
                    onClick={() => setShowAllPastTours((current) => !current)}
                    style={{
                      marginTop: '8px',
                      padding: '5px 8px',
                      borderRadius: '8px',
                      border: '1px solid rgba(243, 215, 124, 0.35)',
                      background: 'rgba(243, 215, 124, 0.08)',
                      color: '#f3d77c',
                      cursor: 'pointer',
                      fontSize: '0.62rem',
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      letterSpacing: '0.03em',
                      lineHeight: 1,
                    }}
                  >
                    {showAllPastTours ? 'Ver menos' : 'Ver más'}
                  </button>
                )}
              </div>
            )}
          </section>
        )}

        {(rifas.length > 0 || pastOrDisabledRifas.length > 0) && (
          <section className="detail-section" id="detail-rifas">
            <PageSectionHeader
              title="Rifas"
              accent="Disponibles"
              description="Participa en sorteos activos."
              compact
            />
            {rifas.length > 0 && (
              <div className="detail-card-grid detail-card-grid--rifas">
                {rifas.map((rifa) => (
                  <RifaCard key={rifa.id} rifa={rifa} modelInfo={modelo} />
                ))}
              </div>
            )}

            {pastOrDisabledRifas.length > 0 && (
              <div className="liquid-glass" style={{ marginTop: '12px', borderRadius: '14px', padding: '10px' }}>
                <h4 style={{ margin: '0 0 6px 0', color: '#f3d77c', fontSize: '0.64rem', letterSpacing: '0.04em', textTransform: 'uppercase', lineHeight: 1.05 }}>
                  Rifas pasadas
                </h4>
                <div style={{ display: 'grid', gap: '4px' }}>
                  {visiblePastRifas.map((rifa) => {
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

                {pastOrDisabledRifas.length > 3 && (
                  <button
                    type="button"
                    onClick={() => setShowAllPastRifas((current) => !current)}
                    style={{
                      marginTop: '8px',
                      padding: '5px 8px',
                      borderRadius: '8px',
                      border: '1px solid rgba(243, 215, 124, 0.35)',
                      background: 'rgba(243, 215, 124, 0.08)',
                      color: '#f3d77c',
                      cursor: 'pointer',
                      fontSize: '0.62rem',
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      letterSpacing: '0.03em',
                      lineHeight: 1,
                    }}
                  >
                    {showAllPastRifas ? 'Ver menos' : 'Ver más'}
                  </button>
                )}
              </div>
            )}
          </section>
        )}

        {tours.length === 0 && rifas.length === 0 && pastOrDisabledTours.length === 0 && pastOrDisabledRifas.length === 0 && (
          <div className="detail-empty-card liquid-glass">
            Este perfil todavía no tiene tours ni rifas públicas activas.
          </div>
        )}

        <TourModal
          isOpen={!!selectedTour}
          tour={selectedTour}
          modelInfo={modelo}
          onClose={closeTourModal}
        />
      </div>
    </div>
  );
};

export default ModeloDetail;