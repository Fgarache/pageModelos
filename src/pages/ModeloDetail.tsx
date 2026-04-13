import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { API_FIREBASE } from '../data';
import InformacionPerfil from '../components/InformacionPerfil';
import PageSectionHeader from '../components/PageSectionHeader';
import TourCard from '../components/TourCard';
import TourModal from '../components/TourModal';
import RifaCard from '../components/RifaCard';
import '../styles/ModeloDetail.css';

const ModeloDetail = () => {
  const { user: userAlias } = useParams();
  const [modelo, setModelo] = useState<any>(null);
  const [tours, setTours] = useState<any[]>([]);
  const [rifas, setRifas] = useState<any[]>([]);
  const [selectedTour, setSelectedTour] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
        
        const rifasData = await API_FIREBASE.getRifas(modelData.id);
        setRifas(rifasData);
        
        setLoading(false);
      } catch (err) {
        console.error('Error cargando datos del modelo:', err);
        setError('Error al cargar los datos');
        setLoading(false);
      }
    };

    loadData();
  }, [userAlias]);

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
              description="Explora las fechas, ubicaciones y horarios activos de esta modelo."
              compact
            />
            <div className="detail-card-grid detail-card-grid--tours">
              {tours.map((tour) => (
                <TourCard key={tour.id} tour={tour} modelInfo={modelo} onShowModal={setSelectedTour} />
              ))}
            </div>
          </section>
        )}

        {rifas.length > 0 && (
          <section className="detail-section" id="detail-rifas">
            <PageSectionHeader
              title="RIFAS"
              accent="ABIERTAS"
              description="Participa en sorteos activos y revisa cada premio disponible."
              compact
            />
            <div className="detail-card-grid detail-card-grid--rifas">
              {rifas.map((rifa) => (
                <RifaCard key={rifa.id} rifa={rifa} modelInfo={modelo} />
              ))}
            </div>
          </section>
        )}

        {tours.length === 0 && rifas.length === 0 && (
          <div className="detail-empty-card liquid-glass">
            Este perfil todavía no tiene tours ni rifas públicas activas.
          </div>
        )}

        <TourModal
          isOpen={!!selectedTour}
          tour={selectedTour}
          modelInfo={modelo}
          onClose={() => setSelectedTour(null)}
        />
      </div>
    </div>
  );
};

export default ModeloDetail;