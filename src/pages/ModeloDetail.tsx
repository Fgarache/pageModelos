import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { API_FIREBASE } from '../data';
import InformacionPerfil from '../components/InformacionPerfil';
import TourCard from '../components/TourCard';
import RifaCard from '../components/RifaCard';

const ModeloDetail: React.FC = () => {
  const { user: userAlias } = useParams();
  const [modelo, setModelo] = useState<any>(null);
  const [tours, setTours] = useState<any[]>([]);
  const [rifas, setRifas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        
        // 1. Obtener info del modelo por user_alias o googleId
        const modelData = await API_FIREBASE.getUserInfo(userAlias || '');
        if (!modelData) {
          setError('Modelo no encontrado');
          setLoading(false);
          return;
        }
        
        setModelo(modelData);
        
        // 2. Obtener tours del modelo usando id (que es googleId)
        const toursData = await API_FIREBASE.getTours(modelData.id);
        setTours(toursData);
        
        // 3. Obtener rifas del modelo usando id (que es googleId)
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

  if (loading) return <p style={{ padding: '20px' }}>Cargando perfil...</p>;
  if (error) return <p style={{ padding: '20px', color: '#721c24' }}>{error}</p>;
  if (!modelo) return <p style={{ padding: '20px' }}>Modelo no encontrado</p>;

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      {/* Información del Perfil */}
      <InformacionPerfil user={modelo} />
      
      {/* Galería de Fotos */}
      {modelo.fotos && Object.keys(modelo.fotos).length > 0 && (
        <>
          <h3 style={{ marginTop: '40px', color: '#d4af37' }}>Galería de Fotos</h3>
          <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', padding: '10px 0' }}>
            {Object.values(modelo.fotos).map((f: any, i: number) => (
              <img 
                key={i} 
                src={f.link} 
                alt={f.titulo || 'Foto'} 
                style={{ height: '300px', borderRadius: '8px', objectFit: 'cover' }} 
              />
            ))}
          </div>
        </>
      )}

      {/* Sección de Tours */}
      {tours.length > 0 && (
        <>
          <h3 style={{ marginTop: '40px', color: '#d4af37' }}>Tours Disponibles</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '20px', margin: '20px 0' }}>
            {tours.map(tour => (
              <TourCard 
                key={tour.id} 
                tour={tour} 
                modelInfo={modelo}
              />
            ))}
          </div>
        </>
      )}

      {/* Sección de Rifas */}
      {rifas.length > 0 && (
        <>
          <h3 style={{ marginTop: '40px', color: '#d4af37' }}>Rifas Disponibles</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '20px', margin: '20px 0' }}>
            {rifas.map(rifa => (
              <RifaCard 
                key={rifa.id} 
                rifa={rifa} 
                modelInfo={modelo}
              />
            ))}
          </div>
        </>
      )}

      {tours.length === 0 && rifas.length === 0 && (
        <p style={{ marginTop: '40px', textAlign: 'center', color: '#888' }}>
          Este modelo no tiene tours ni rifas disponibles en este momento.
        </p>
      )}
    </div>
  );
};

export default ModeloDetail;