import { useCallback, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { API_FIREBASE } from '../data';
import InformacionPerfil from '../components/InformacionPerfil';
import TourModal from '../components/TourModal';
import '../styles/ModeloDetail.css';

const ModeloDetail = () => {
  const { user: userAlias } = useParams();
  const [modelo, setModelo] = useState<any>(null);
  const [tours, setTours] = useState<any[]>([]);
  const [pastOrDisabledTours, setPastOrDisabledTours] = useState<any[]>([]);
  const [rifas, setRifas] = useState<any[]>([]);
  const [pastOrDisabledRifas, setPastOrDisabledRifas] = useState<any[]>([]);
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
      <div className="modelo-detail-page">
        <div className="detail-bg-orb orb-left"></div>
        <div className="detail-bg-orb orb-right"></div>
        <div className="detail-container">
          <div className="skeleton-container liquid-glass" style={{ borderRadius: '18px', padding: '16px', display: 'flex', flexDirection: 'column', gap: '16px', minHeight: '500px' }}>
            <div className="skeleton-pulse" style={{ width: '100%', height: '300px', borderRadius: '12px' }}></div>
            <div className="skeleton-pulse" style={{ width: '60%', height: '24px', borderRadius: '4px' }}></div>
            <div className="skeleton-pulse" style={{ width: '40%', height: '16px', borderRadius: '4px' }}></div>
            <div style={{ display: 'flex', gap: '8px', marginTop: '16px' }}>
              <div className="skeleton-pulse" style={{ width: '80px', height: '30px', borderRadius: '20px' }}></div>
              <div className="skeleton-pulse" style={{ width: '80px', height: '30px', borderRadius: '20px' }}></div>
            </div>
          </div>
        </div>
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
        <InformacionPerfil 
          user={modelo} 
          hasTours={tours.length > 0} 
          activeTours={tours} 
          pastTours={pastOrDisabledTours}
          hasRifas={rifas.length > 0} 
          activeRifas={rifas}
          pastRifas={pastOrDisabledRifas}
          gallery={gallery as Array<{ link?: string; titulo?: string; fecha?: string }>} 
        />

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