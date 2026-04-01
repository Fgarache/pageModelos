// src/components/RifaCard.tsx
import { useNavigate } from 'react-router-dom';
import '../styles/RifaCard.css';

interface RifaCardProps {
  rifa: {
    idRifa: string;
    titulo: string;
    premio: string;
    precio: number;
    numerosTotales: number;
    estado: boolean;
    fechaSorteo: string;
    numerosDisponibles?: number[];
    cantidadLibre?: number; // Asegúrate de que este campo venga de Firebase
    nombreModelo?: string;
    userAlias?: string;
    profile_pic?: string; // IMPORTANTE: Necesitamos la foto de la modelo aquí
  };
  nombreModelo?: string;
  userAlias?: string;
  isCompact?: boolean;
}

export default function RifaCard({ 
  rifa, 
  nombreModelo, 
  userAlias,
  isCompact = false
}: RifaCardProps) {
  const navigate = useNavigate();

  const modeloNombre = nombreModelo || rifa.nombreModelo || 'Modelo';
  const modeloAlias = userAlias || rifa.userAlias || '';
  const disponiblesCount = rifa.cantidadLibre || rifa.numerosDisponibles?.length || 0;

  const handleVerDetalles = () => {
    if (modeloAlias) {
      navigate(`/${modeloAlias}`);
    }
  };

  // --- VISTA COMPACTA (Estilo Tinder Card para RifasPage) ---
  if (isCompact) {
    return (
      <div className="rifa-card-visual animate-in" onClick={handleVerDetalles}>
        
        {/* IMAGEN DE FONDO (Igual que Tinder Card) */}
        <div className="card-image-background">
          {rifa.profile_pic ? (
            <img src={rifa.profile_pic} alt={modeloNombre} className="modelo-bg-img" />
          ) : (
            <div className="avatar-placeholder-bg">{modeloNombre[0]}</div>
          )}
          {/* Degradado para oscurecer el fondo y asegurar legibilidad */}
          <div className="card-overlay-gradient"></div>
        </div>

        {/* INFORMACIÓN DE LA RIFA (Encima de la imagen) */}
        <div className="rifa-card-content-overlay">
          <div className="rifa-modelo-header">
            <h4 className="modelo-name">{modeloNombre}</h4>
            <span className="modelo-alias">@{modeloAlias}</span>
          </div>

          <h3 className="rifa-main-title">{rifa.titulo}</h3>
          
          <div className="rifa-prize-badge">
            <span className="icon">🎁</span>
            <span className="prize-text">{rifa.premio}</span>
          </div>

          <div className="rifa-stats-liquid">
            <div className="stat-item">
              <span className="label">PRECIO</span>
              <span className="value gold">Q{rifa.precio}</span>
            </div>
            <div className="stat-item separator">|</div>
            <div className="stat-item">
              <span className="label">BOLETOS LIBRES</span>
              <span className="value">{disponiblesCount} / {rifa.numerosTotales}</span>
            </div>
          </div>
          
          <div className="rifa-footer-action">
            <span className="btn-glass-action">Participar Ahora →</span>
          </div>
        </div>
      </div>
    );
  }

  // --- VISTA DETALLADA (Perfiles - Se mantiene similar o se adapta) ---
  // [Aquí iría tu código de vista detallada si lo usas en perfiles, 
  // pero para RifasPage solo necesitamos la compacta arriba]
  const disponibles = rifa.numerosDisponibles || [];
  const todos = Array.from({ length: rifa.numerosTotales }, (_, i) => i + 1);

  return (
    <div className="rifa-card-liquid detailed">
      {/* Tu código de vista detallada existente va aquí */}
      {/* ... */}
    </div>
  );
}