import { useEffect, useState } from 'react';
import { API_FIREBASE } from '../data';
import PageSectionHeader from '../components/PageSectionHeader';
import RifaCard from '../components/RifaCard';
import '../styles/RifasPage.css';

interface Rifa {
  id: string;
  titulo: string;
  premio: string;
  precio: number;
  numerosTotales: number;
  estado: boolean;
  fechaSorteo: string;
  terminos?: string[];
  nombreModelo?: string;
  userAlias?: string;
  idUser?: string;
  fotoPerfil?: string;
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
          fotoPerfil: user.fotoPerfil
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
      {/* Elementos decorativos de fondo */}
      <div className="rifas-bg-blob"></div>

      <div className="rifas-page-container">
        <PageSectionHeader
          title="RIFAS &"
          accent="SORTEOS"
          description="Gana experiencias inolvidables con nuestras modelos."
        />

        {loading ? (
          <div className="rifas-loading-container">
            <div className="glass-loader"></div>
            <p>Cargando sorteos...</p>
          </div>
        ) : rifas.length === 0 ? (
          <div className="rifas-empty liquid-glass">
            <p>No hay rifas activas en este momento. Vuelve pronto.</p>
          </div>
        ) : (
          <div className="rifas-list">
            {rifas.map((rifa) => (
              <div key={rifa.id} className="rifa-item-wrapper animate-card">
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