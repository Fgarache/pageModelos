import { useState, useEffect } from 'react';
import { API_FIREBASE } from '../data';
import RifaCard from '../components/RifaCard';
import '../styles/RifasPage.css';

interface Rifa {
  idRifa: string;
  titulo: string;
  premio: string;
  precio: number;
  numerosTotales: number;
  estado: boolean;
  fechaSorteo: string;
  numerosDisponibles: number[];
  cantidadLibre: number;
  idUser: string;
  nombreModelo?: string;
  userAlias?: string;
}

export default function RifasPage() {
  const [rifas, setRifas] = useState<Rifa[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRifas();
  }, []);

  const fetchRifas = async () => {
    try {
      setLoading(true);
      
      // Obtener todos los usuarios
      const allUsers = await API_FIREBASE.getAllUsers();
      
      // Para cada usuario, obtener sus rifas
      let todasLasRifas: Rifa[] = [];
      
      for (const user of allUsers) {
        const rifasDelUsuario = await API_FIREBASE.getRifas(user.id);
        
        // Agregar información del usuario a cada rifa
        const rifasConDatos = rifasDelUsuario.map((rifa: any) => ({
          ...rifa,
          nombreModelo: user.nombre,
          userAlias: user.user_alias,
          idUser: user.id,
        }));
        
        todasLasRifas = [...todasLasRifas, ...rifasConDatos];
      }
      
      setRifas(todasLasRifas);
    } catch (error) {
      console.error('Error cargando rifas:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rifas-page">
      <div className="rifas-page-container">
        <div className="rifas-page-header">
          <h1>🎰 Rifas y Sorteos</h1>
          <p className="rifas-subtitle">
            Todos los sorteos disponibles con nuestras modelos
          </p>
        </div>

        {loading ? (
          <div className="rifas-loading">
            <p>Cargando rifas...</p>
          </div>
        ) : rifas.length === 0 ? (
          <div className="rifas-empty">
            <p>No hay rifas disponibles en este momento</p>
          </div>
        ) : (
          <div className="rifas-list">
            {rifas.map((rifa) => (
              <div key={rifa.idRifa} className="rifa-item-wrapper">
                <RifaCard
                  rifa={rifa}
                  nombreModelo={rifa.nombreModelo}
                  userAlias={rifa.userAlias}
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
