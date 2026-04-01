import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/TourCard.css';

interface TourCardProps {
  tour: {
    id: string;
    lugar: string;
    titulo: string;
    fecha: string;
    deposito: number;
    estado: boolean;
    lugarAtencion: string;
    detalles: string;
    nombreModelo?: string;
    userAlias?: string;
  };
  nombreModelo?: string;
  userAlias?: string;
  isCompact?: boolean;
  onLoadHorarios?: (tourId: string) => Promise<any[]>;
}

const convertTo12Hours = (hora: string) => {
  const [horaStr] = hora.split(':');
  const horaNum = parseInt(horaStr);
  
  if (horaNum === 0) return '12:00 AM';
  if (horaNum < 12) return `${horaNum}:00 AM`;
  if (horaNum === 12) return '12:00 PM';
  return `${horaNum - 12}:00 PM`;
};

export default function TourCard({ 
  tour, 
  nombreModelo, 
  userAlias,
  isCompact = false,
  onLoadHorarios
}: TourCardProps) {
  const navigate = useNavigate();
  const [horariosAbiertos, setHorariosAbiertos] = useState(false);
  const [horarios, setHorarios] = useState<any[]>([]);
  const [cargando, setCargando] = useState(false);

  const modeloNombre = nombreModelo || tour.nombreModelo || 'Modelo';
  const modeloAlias = userAlias || tour.userAlias || '';

  const handleToggleHorarios = async () => {
    if (horariosAbiertos) {
      setHorariosAbiertos(false);
      return;
    }

    if (horarios.length === 0 && onLoadHorarios) {
      setCargando(true);
      try {
        const datos = await onLoadHorarios(tour.id);
        setHorarios(datos);
      } catch (error) {
        console.error('Error cargando horarios:', error);
      } finally {
        setCargando(false);
      }
    }
    setHorariosAbiertos(true);
  };

  const horariosDisponibles = horarios.filter(h => h.estado === true);

  const handleVerDetalles = () => {
    if (modeloAlias) {
      navigate(`/${modeloAlias}`);
    }
  };

  // Vista Compacta - Para ToursPage y RifasPage
  if (isCompact) {
    return (
      <div className="tour-card-simple">
        {/* Avatar */}
        <div className="tour-card-avatar">
          {modeloNombre[0]?.toUpperCase() || 'M'}
        </div>

        {/* Info básica */}
        <div className="tour-card-body">
          <h3 className="tour-card-modelo">{modeloNombre}</h3>
          <p className="tour-card-alias">@{modeloAlias}</p>
          
          <div className="tour-card-details-mini">
            <p className="tour-card-title">
              {tour.titulo}
            </p>
            <div className="tour-card-meta">
              <span className="tour-meta-item">📍 {tour.lugar}</span>
              <span className="tour-meta-item">💵 Q{tour.deposito}</span>
            </div>
          </div>
        </div>

        {/* Botón */}
        <button 
          className="btn-ver-detalles"
          onClick={handleVerDetalles}
        >
          Ver Detalles →
        </button>
      </div>
    );
  }

  // Vista Detallada - Para ModeloDetail (perfil)
  return (
    <div className="tour-card-wrapper">
      {/* Información del Modelo */}
      <div className="tour-card-modelo">
        <div className="tour-modelo-avatar">
          {modeloNombre[0]?.toUpperCase() || 'M'}
        </div>
        <div className="tour-modelo-info">
          <h4 className="tour-modelo-nombre">{modeloNombre}</h4>
          <p className="tour-modelo-alias">@{modeloAlias}</p>
        </div>
      </div>

      {/* Contenido del Tour */}
      <div className="tour-card-content">
        <h3 className="tour-titulo">{tour.titulo}</h3>
        
        <div className="tour-card-info">
          <div className="tour-item">
            <span className="tour-label">📍</span>
            <span className="tour-value">{tour.lugar}</span>
          </div>
          <div className="tour-item">
            <span className="tour-label">📅</span>
            <span className="tour-value">{tour.fecha}</span>
          </div>
          <div className="tour-item">
            <span className="tour-label">💵</span>
            <span className="tour-value">Q{tour.deposito}</span>
          </div>
        </div>

        {tour.detalles && (
          <p className="tour-detalles-mini">{tour.detalles}</p>
        )}

        <div className="tour-card-actions">
          <button 
            className="btn-horarios-tour"
            onClick={handleToggleHorarios}
            disabled={cargando}
          >
            {cargando ? '⏳' : horariosAbiertos ? '▼' : '▶'} 
            {cargando ? ' Cargando...' : horariosAbiertos ? ' Ocultar horarios' : ' Ver horarios'}
          </button>
        </div>

        {horariosAbiertos && (
          <div className="horarios-tour-section">
            {horariosDisponibles.length === 0 ? (
              <p className="sin-horarios">No hay horarios disponibles</p>
            ) : (
              <div className="horarios-inline">
                {horariosDisponibles.map(h => (
                  <div key={h.idHora} className="horario-badge-disponible">
                    {convertTo12Hours(h.hora)}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

