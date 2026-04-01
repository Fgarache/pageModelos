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
      const allUsers = await API_FIREBASE.getAllUsers();
      let todasLasRifas: Rifa[] = [];
      
      for (const user of allUsers) {
        const rifasDelUsuario = await API_FIREBASE.getRifas(user.id);
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
      <div className="rifas-bg-glow"></div>
      
      <div className="rifas-page-container">
        <header className="rifas-page-header">
          <span className="rifas-badge">OPORTUNIDADES ÚNICAS</span>
          <h1 className="rifas-title">RIFAS & <span className="gold-text">SORTEOS</span></h1>
          <p className="rifas-subtitle">
            Participa por premios exclusivos y experiencias inolvidables con nuestras modelos.
          </p>
        </header>

        {loading ? (
          <div className="rifas-loading-container">
            <div className="glass-loader"></div>
            <p>Preparando los boletos...</p>
          </div>
        ) : rifas.length === 0 ? (
          <div className="rifas-empty liquid-glass">
            <p>No hay sorteos activos en este momento. ¡Atento a nuestras redes!</p>
          </div>
        ) : (
          <div className="rifas-list">
            {rifas.map((rifa) => (
              <div key={rifa.idRifa} className="rifa-item-wrapper fade-in">
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