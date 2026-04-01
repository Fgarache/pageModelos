import { useState, useEffect } from 'react';
import { API_FIREBASE } from '../data';
import TourCard from '../components/TourCard';
import '../styles/ToursPage.css';

interface Tour {
  id: string;
  lugar: string;
  titulo: string;
  fecha: string;
  deposito: number;
  estado: boolean;
  detalles: string;
  lugarAtencion: string;
  nombreModelo?: string;
  userAlias?: string;
  idUser?: string;
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
      
      // Obtener todos los usuarios
      const allUsers = await API_FIREBASE.getAllUsers();
      
      // Para cada usuario, obtener sus tours
      let todosLosTours: Tour[] = [];
      
      for (const user of allUsers) {
        const toursDelUsuario = await API_FIREBASE.getTours(user.id);
        
        // Agregar información del usuario a cada tour
        const toursConDatos = toursDelUsuario.map((tour: any) => ({
          ...tour,
          nombreModelo: user.nombre,
          userAlias: user.user_alias,
          idUser: user.id,
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
      <div className="tours-page-container">
        <div className="tours-page-header">
          <h1>✈️ Tours y Experiencias</h1>
          <p className="tours-subtitle">
            Todos los tours disponibles con nuestras modelos
          </p>
        </div>

        {loading ? (
          <div className="tours-loading">
            <p>Cargando tours...</p>
          </div>
        ) : tours.length === 0 ? (
          <div className="tours-empty">
            <p>No hay tours disponibles en este momento</p>
          </div>
        ) : (
          <div className="tours-list">
            {tours.map((tour) => (
              <div key={tour.id} className="tour-item-wrapper">
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
