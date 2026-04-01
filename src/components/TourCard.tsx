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
    profile_pic?: string; // Asegúrate de pasar la foto desde el map en ToursPage
  };
  nombreModelo?: string;
  userAlias?: string;
  isCompact?: boolean;
  onLoadHorarios?: (tourId: string) => Promise<any[]>;
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

  const handleToggleHorarios = async (e: React.MouseEvent) => {
    e.stopPropagation(); // Evita que navegue al perfil al abrir horarios
    if (horariosAbiertos) {
      setHorariosAbiertos(false);
      return;
    }
    if (horarios.length === 0 && onLoadHorarios) {
      setCargando(true);
      try {
        const datos = await onLoadHorarios(tour.id);
        setHorarios(datos);
      } catch (error) { console.error(error); } 
      finally { setCargando(false); }
    }
    setHorariosAbiertos(true);
  };

  // --- VISTA COMPACTA (Estilo Tinder/Rifa para ToursPage) ---
  if (isCompact) {
    return (
      <div className="tour-card-visual animate-in" onClick={() => navigate(`/${modeloAlias}`)}>
        <div className="card-image-background">
          {tour.profile_pic ? (
            <img src={tour.profile_pic} alt={modeloNombre} className="modelo-bg-img" />
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
            <div className="stat-item separator">|</div>
            <div className="stat-item">
              <span className="label">DEPÓSITO</span>
              <span className="value gold">Q{tour.deposito}</span>
            </div>
          </div>
          
          <div className="tour-footer-action">
            <span className="btn-glass-action">Reservar Lugar →</span>
          </div>
        </div>
      </div>
    );
  }

  // --- VISTA DETALLADA (Se mantiene para el perfil de la modelo) ---
  return (
    <div className="tour-card-liquid detailed">
       {/* El código de la vista detallada que ya teníamos configurado */}
       {/* [Mantener el código de la respuesta anterior para 'detailed'] */}
    </div>
  );
}