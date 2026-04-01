import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_FIREBASE } from '../data';
import '../styles/TourCard.css';

interface TourCardProps {
  tour: any;
  modelInfo?: any;
  nombreModelo?: string;
  userAlias?: string;
  isCompact?: boolean;
}

const convertTo12Hours = (hora: string) => {
  const [horaStr] = hora.split(':');
  const horaNum = parseInt(horaStr);
  if (horaNum === 0) return '12 AM';
  if (horaNum < 12) return `${horaNum} AM`;
  if (horaNum === 12) return '12 PM';
  return `${horaNum - 12} PM`;
};

export default function TourCard({ 
  tour, 
  modelInfo,
  nombreModelo, 
  userAlias,
  isCompact = false
}: TourCardProps) {
  const navigate = useNavigate();
  const [horariosAbiertos, setHorariosAbiertos] = useState(false);
  const [horarios, setHorarios] = useState<any[]>([]);
  const [cargando, setCargando] = useState(false);

  const modeloNombre = nombreModelo || modelInfo?.nombre || 'Modelo';
  const modeloAlias = userAlias || modelInfo?.user_alias || '';
  const profilPic = modelInfo?.fotoPerfil || tour.profile_pic;

  const handleToggleHorarios = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (horariosAbiertos) {
      setHorariosAbiertos(false);
      return;
    }
    if (horarios.length === 0) {
      setCargando(true);
      try {
        const datos = await API_FIREBASE.getAllHorariosByTour(tour.id);
        setHorarios(datos);
      } catch (error) {
        console.error(error);
      } finally {
        setCargando(false);
      }
    }
    setHorariosAbiertos(true);
  };

  // --- VISTA COMPACTA (Para listados en ToursPage) ---
  if (isCompact) {
    return (
      <div 
        className="tour-card-visual animate-in" 
        onClick={() => navigate(`/${modeloAlias}`)}
        style={{ cursor: 'pointer' }}
      >
        <div className="card-image-background">
          {profilPic ? (
            <img src={profilPic} alt={modeloNombre} className="modelo-bg-img" />
          ) : (
            <div className="avatar-placeholder-bg">{modeloNombre[0]}</div>
          )}
          <div className="card-overlay-gradient"></div>
        </div>

        <div className="tour-card-content-overlay">
          <div className="tour-modelo-header">
            <h4 className="modelo-name">{modeloNombre}</h4>
            <span className="modelo-alias">@{modeloAlias}</span>
          </div>

          <h3 className="tour-main-title">{tour.titulo}</h3>
          
          <div className="tour-info-badge">
            <span className="icon">📍</span>
            <span className="info-text">{tour.lugar}</span>
          </div>

          <div className="tour-stats-liquid">
            <div className="stat-item">
              <span className="label">FECHA</span>
              <span className="value">{tour.fecha}</span>
            </div>
          </div>
          
          <div className="tour-footer-action">
            <span className="btn-glass-action">Ver Detalles →</span>
          </div>
        </div>
      </div>
    );
  }

  // --- VISTA DETALLADA (Para perfil de la modelo) ---
  const horariosDisponibles = tour.disponibilidad ? 
    Object.entries(tour.disponibilidad)
      .filter(([_, libre]) => libre === true)
      .map(([hora]) => hora)
      .sort()
    : [];

  const horariosOcupados = tour.disponibilidad ? 
    Object.entries(tour.disponibilidad)
      .filter(([_, libre]) => libre === false)
      .map(([hora]) => hora)
      .sort()
    : [];

  return (
    <div className="tour-card-liquid detailed" style={{
      background: 'rgba(15, 52, 96, 0.4)',
      border: '1px solid rgba(212, 175, 55, 0.2)',
      borderRadius: '15px',
      padding: '20px',
      backdropFilter: 'blur(10px)',
      transition: 'all 0.3s ease'
    }}>
      <div style={{ marginBottom: '15px' }}>
        <h3 style={{ 
          margin: '0 0 8px 0', 
          color: '#fff',
          fontWeight: '800',
          fontSize: '20px',
          textTransform: 'uppercase'
        }}>
          {tour.titulo}
        </h3>
        <p style={{ margin: 0, color: '#d4af37', fontWeight: '600', fontSize: '14px' }}>
          📍 {tour.lugar}
        </p>
      </div>

      <div style={{ marginBottom: '15px' }}>
        <p style={{ margin: 0, color: '#ccc', fontSize: '13px', lineHeight: '1.6' }}>
          {tour.detalles}
        </p>
      </div>

      {tour.lugarDisponible && (
        <div style={{ marginBottom: '15px', paddingBottom: '15px', borderBottom: '1px solid rgba(212, 175, 55, 0.1)' }}>
          <p style={{ margin: '0 0 5px 0', color: '#aaa', fontSize: '12px', fontWeight: '600', textTransform: 'uppercase' }}>
            Lugar de Atención
          </p>
          <p style={{ margin: 0, color: '#fff', fontSize: '14px' }}>
            {tour.lugarDisponible}
          </p>
        </div>
      )}

      <div style={{ marginBottom: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <p style={{ margin: 0, color: '#aaa', fontSize: '12px', fontWeight: '600', textTransform: 'uppercase' }}>
            Horarios Disponibles
          </p>
          <button 
            onClick={handleToggleHorarios}
            style={{
              background: 'rgba(212, 175, 55, 0.2)',
              border: '1px solid rgba(212, 175, 55, 0.4)',
              color: '#d4af37',
              padding: '5px 15px',
              borderRadius: '5px',
              cursor: 'pointer',
              fontSize: '12px',
              fontWeight: '600',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(212, 175, 55, 0.3)';
              e.currentTarget.style.borderColor = 'rgba(212, 175, 55, 0.6)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(212, 175, 55, 0.2)';
              e.currentTarget.style.borderColor = 'rgba(212, 175, 55, 0.4)';
            }}
          >
            {horariosAbiertos ? '▼ Cerrar' : '► Expandir'}
          </button>
        </div>

        {horariosAbiertos && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(90px, 1fr))',
            gap: '8px',
            marginTop: '12px'
          }}>
            {cargando ? (
              <p style={{ color: '#aaa' }}>Cargando horarios...</p>
            ) : horarios.length > 0 ? (
              horarios.map((h) => (
                <div key={h.hora} style={{
                  padding: '10px',
                  textAlign: 'center',
                  borderRadius: '8px',
                  background: h.disponible ? 'rgba(76, 175, 80, 0.2)' : 'rgba(244, 67, 54, 0.2)',
                  border: `1px solid ${h.disponible ? 'rgba(76, 175, 80, 0.4)' : 'rgba(244, 67, 54, 0.4)'}`,
                  color: h.disponible ? '#4caf50' : '#f44336',
                  fontSize: '13px',
                  fontWeight: '600'
                }}>
                  <div>{h.hora}</div>
                  <small style={{ fontSize: '11px' }}>{h.disponible ? 'Libre' : 'Ocupado'}</small>
                </div>
              ))
            ) : (
              Object.entries(tour.disponibilidad || {}).map(([hora, libre]) => (
                <div key={hora} style={{
                  padding: '10px',
                  textAlign: 'center',
                  borderRadius: '8px',
                  background: libre ? 'rgba(76, 175, 80, 0.2)' : 'rgba(244, 67, 54, 0.2)',
                  border: `1px solid ${libre ? 'rgba(76, 175, 80, 0.4)' : 'rgba(244, 67, 54, 0.4)'}`,
                  color: libre ? '#4caf50' : '#f44336',
                  fontSize: '13px',
                  fontWeight: '600'
                }}>
                  <div>{hora}</div>
                  <small style={{ fontSize: '11px' }}>{libre ? 'Libre' : 'Ocupado'}</small>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '10px'
      }}>
        <div style={{
          padding: '12px',
          background: 'rgba(76, 175, 80, 0.1)',
          border: '1px solid rgba(76, 175, 80, 0.2)',
          borderRadius: '8px',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '12px', color: '#aaa', marginBottom: '5px', textTransform: 'uppercase', fontWeight: '600' }}>
            Disponibles
          </div>
          <div style={{ fontSize: '18px', color: '#4caf50', fontWeight: '800' }}>
            {horariosDisponibles.length}
          </div>
        </div>
        <div style={{
          padding: '12px',
          background: 'rgba(244, 67, 54, 0.1)',
          border: '1px solid rgba(244, 67, 54, 0.2)',
          borderRadius: '8px',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '12px', color: '#aaa', marginBottom: '5px', textTransform: 'uppercase', fontWeight: '600' }}>
            Ocupados
          </div>
          <div style={{ fontSize: '18px', color: '#f44336', fontWeight: '800' }}>
            {horariosOcupados.length}
          </div>
        </div>
      </div>
    </div>
  );
}