import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { API_FIREBASE } from '../data'; // Verifica que esta ruta sea correcta
import DetailSkeletonLoader from '../components/DetailSkeletonLoader';
import InformacionPerfil from '../components/InformacionPerfil';
import ToursDisponibles from '../components/ToursDisponibles';
import RifasDisponibles from '../components/RifasDisponibles';
import '../styles/ModeloDetail.css';

interface UserData {
  user: any | null;
  tours: any[];
  rifas: any[];
}

export default function ModeloDetail() {
  const { user: userParam } = useParams();
  const [data, setData] = useState<UserData>({ user: null, tours: [], rifas: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setLoading(true);
        if (!userParam) return;

        // 1. Obtener todos para filtrar por alias
        const allUsers = await API_FIREBASE.getAllUsers();
        const foundUser = allUsers.find((u: any) => u.user_alias === userParam);

        if (!foundUser) {
          setError('Perfil no encontrado');
          return;
        }

        const userId = foundUser.id;

        // 2. CORRECCIÓN: Usar API_FIREBASE uniformemente
        const [userData, toursData, rifasData] = await Promise.all([
          API_FIREBASE.getUserInfo(userId),
          API_FIREBASE.getTours(userId),
          API_FIREBASE.getRifas(userId),
        ]);

        setData({
          user: { ...foundUser, ...userData },
          tours: Array.isArray(toursData) ? toursData : [],
          rifas: Array.isArray(rifasData) ? rifasData : []
        });

        setError(null);
      } catch (err) {
        console.error("Error en fetchData:", err);
        setError('Error al conectar con el servidor');
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
    window.scrollTo(0, 0);
  }, [userParam]);

  if (loading) return <DetailSkeletonLoader />;

  if (error || !data.user) {
    return (
      <div className="error-screen">
        <div className="liquid-glass error-card">
          <p>{error || 'Modelo no encontrado'}</p>
          <button onClick={() => window.history.back()} className="back-link-glass" style={{marginTop: '20px', cursor: 'pointer'}}>
            ← VOLVER ATRÁS
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="modelo-detail-page">
      {/* Ambiente Liquid Glass */}
      <div style={styles.blob1}></div>
      <div style={styles.blob2}></div>

      <div className="detail-container">
        
        {/* Perfil con botones de Tours, Rifas y WhatsApp integrados */}
        <InformacionPerfil 
          user={data.user} 
          hasTours={data.tours.length > 0} 
          hasRifas={data.rifas.length > 0} 
        />
        
        {/* Sección de Tours con ancla para el botón */}
        {data.tours.length > 0 && (
          <div id="seccion-tours" style={{ scrollMarginTop: '100px' }}>
            <ToursDisponibles tours={data.tours} user={data.user} />
          </div>
        )}
        
        {/* Sección de Rifas con ancla para el botón */}
        {data.rifas.length > 0 && (
          <div id="seccion-rifas" style={{ scrollMarginTop: '100px' }}>
            <RifasDisponibles rifas={data.rifas} user={data.user} />
          </div>
        )}

        {/* Estado vacío sutil */}
        {data.tours.length === 0 && data.rifas.length === 0 && (
          <div className="empty-profile-notice liquid-glass" style={styles.emptyNotice}>
            <p>Próximamente más eventos disponibles.</p>
          </div>
        )}
      </div>
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  blob1: {
    position: 'absolute',
    top: '-5%',
    left: '-10%',
    width: '70vw',
    height: '70vw',
    background: 'radial-gradient(circle, rgba(212, 175, 55, 0.07) 0%, transparent 70%)',
    borderRadius: '50%',
    filter: 'blur(120px)',
    zIndex: 0,
    pointerEvents: 'none',
  },
  blob2: {
    position: 'absolute',
    bottom: '10%',
    right: '-5%',
    width: '50vw',
    height: '50vw',
    background: 'radial-gradient(circle, rgba(255, 255, 255, 0.02) 0%, transparent 70%)',
    borderRadius: '50%',
    filter: 'blur(100px)',
    zIndex: 0,
    pointerEvents: 'none',
  },
  emptyNotice: {
    padding: '30px',
    textAlign: 'center',
    marginTop: '40px',
    borderRadius: '25px',
    color: 'rgba(255,255,255,0.4)',
    fontSize: '0.9rem'
  }
};