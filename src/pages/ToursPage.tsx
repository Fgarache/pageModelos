import { useState, useEffect } from 'react';
import { API_FIREBASE } from '../data';
import PageSectionHeader from '../components/PageSectionHeader';
import TourCard from '../components/TourCard';
import TourModal from '../components/TourModal';
import '../styles/ToursPage.css';

const DEPARTAMENTOS_GUATEMALA = [
  'Guatemala',
  'Sacatepequez',
  'Escuintla',
  'Chimaltenango',
  'Santa Rosa',
  'Solola',
  'Totonicapan',
  'Quetzaltenango',
  'Suchitepequez',
  'Retalhuleu',
  'San Marcos',
  'Huehuetenango',
  'Quiche',
  'Baja Verapaz',
  'Alta Verapaz',
  'Peten',
  'Izabal',
  'Zacapa',
  'Chiquimula',
  'Jalapa',
  'Jutiapa',
  'El Progreso',
];

interface Tour {
  id: string;
  lugar: string;
  titulo: string;
  fecha: string;
  estado: boolean;
  detalles: string;
  lugarDisponible: string;
  nombreModelo?: string;
  userAlias?: string;
  idUser?: string;
  fotoPerfil?: string;
}

export default function ToursPage() {
  const [tours, setTours] = useState<Tour[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTour, setSelectedTour] = useState<Tour | null>(null);
  const [modelInfo, setModelInfo] = useState<any>(null);

  useEffect(() => {
    fetchTours();
  }, []);

  const fetchTours = async () => {
    try {
      setLoading(true);
      const allUsers = await API_FIREBASE.getAllUsers();
      let todosLosTours: Tour[] = [];
      
      for (const user of allUsers) {
        const toursDelUsuario = await API_FIREBASE.getTours(user.id);
        const toursConDatos = toursDelUsuario.map((tour: any) => ({
          ...tour,
          nombreModelo: user.nombre,
          userAlias: user.user_alias,
          idUser: user.id,
          fotoPerfil: user.fotoPerfil
        }));
        todosLosTours = [...todosLosTours, ...toursConDatos];
      }
      setTours(todosLosTours);
    } catch (error) {
      console.error('Error cargando tours:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleShowTourModal = async (tour: Tour) => {
    setSelectedTour(tour);
    if (tour.idUser) {
      try {
        const allUsers = await API_FIREBASE.getAllUsers();
        const model = allUsers.find((u: any) => u.id === tour.idUser);
        if (model) {
          setModelInfo(model);
        }
      } catch (error) {
        console.error('Error loading model info:', error);
      }
    }
  };

  return (
    <div className="tours-page">
      {/* Elementos decorativos de fondo */}
      <div className="tours-bg-blob"></div>

      <div className="tours-page-container">
        <header className="tours-page-header">
          <PageSectionHeader
            title="TOURS &"
            accent="EXPERIENCIAS"
            description="Tours VIP en Guatemala: Ciudad de Guatemala, Antigua, Quetzaltenango, Escuintla, San Marcos, Peten, Izabal y más departamentos del país."
          />
          <details className="tours-seo-departments">
            <summary>Ver todos los departamentos de cobertura</summary>
            <p>
              Cobertura en {DEPARTAMENTOS_GUATEMALA.join(', ')}.
            </p>
          </details>
        </header>

        {loading ? (
          <div className="tours-loading-container">
            <div className="glass-loader"></div>
            <p>Sincronizando agendas...</p>
          </div>
        ) : tours.length === 0 ? (
          <div className="tours-empty liquid-glass">
            <p>No hay tours programados en este momento. Vuelve pronto.</p>
          </div>
        ) : (
          <div className="tours-list">
            {tours.map((tour) => (
              <div key={tour.id} className="tour-item-wrapper animate-card">
                <TourCard 
                  tour={tour} 
                  nombreModelo={tour.nombreModelo}
                  userAlias={tour.userAlias}
                  isCompact={true}
                  onShowModal={handleShowTourModal}
                />
              </div>
            ))}
          </div>
        )}

        <TourModal
          isOpen={!!selectedTour}
          tour={selectedTour}
          modelInfo={modelInfo}
          onClose={() => {
            setSelectedTour(null);
            setModelInfo(null);
          }}
        />
      </div>
    </div>
  );
}