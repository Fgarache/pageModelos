import { useState, useEffect } from 'react';
import { API_FIREBASE } from '../data';
import TourCard from '../components/TourCard';
import '../styles/ToursPage.css';

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
  profile_pic?: string;
}

export default function ToursPage() {
  const [tours, setTours] = useState<Tour[]>([]);
  const [loading, setLoading] = useState(true);

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
          profile_pic: user.fotoPerfil
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

  return (
    <div className="tours-page">
      {/* Elementos decorativos de fondo */}
      <div className="tours-bg-blob"></div>

      <div className="tours-page-container">
        <header className="tours-page-header">
          <span className="tours-badge">DESTINOS EXCLUSIVOS</span>
          <h1 className="tours-title">TOURS & <span className="gold-text">EXPERIENCIAS</span></h1>
          <p className="tours-subtitle">
            Acompaña a nuestras modelos en sus próximas paradas internacionales.
          </p>
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
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}