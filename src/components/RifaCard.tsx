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
    nombreModelo?: string;
    userAlias?: string;
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
  const disponibles = rifa.numerosDisponibles || [];

  const handleVerDetalles = () => {
    if (modeloAlias) {
      navigate(`/${modeloAlias}`);
    }
  };

  // Vista Compacta - Para RifasPage
  if (isCompact) {
    return (
      <div className="rifa-card-simple">
        {/* Avatar */}
        <div className="rifa-card-avatar">
          {modeloNombre[0]?.toUpperCase() || 'M'}
        </div>

        {/* Info básica */}
        <div className="rifa-card-body">
          <h3 className="rifa-card-modelo">{modeloNombre}</h3>
          <p className="rifa-card-alias">@{modeloAlias}</p>
          
          <div className="rifa-card-details-mini">
            <p className="rifa-card-title">
              {rifa.titulo}
            </p>
            <p className="rifa-card-prize">
              🎁 {rifa.premio}
            </p>
            <div className="rifa-card-meta">
              <span className="rifa-meta-item">💵 Q{rifa.precio}</span>
              <span className="rifa-meta-item">✓ {disponibles.length} disponibles</span>
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
  const generarNumeros = () => {
    const numeros = [];
    for (let i = 1; i <= rifa.numerosTotales; i++) {
      numeros.push(i);
    }
    return numeros;
  };

  const todos = generarNumeros();
  const ocupados = todos.filter(n => !disponibles.includes(n));

  return (
    <div className="rifa-card-full">
      <div className="rifa-card-header">
        <div className="rifa-info-left">
          <h3 className="rifa-titulo">{rifa.titulo}</h3>
          <p className="rifa-premio">🎁 {rifa.premio}</p>
        </div>
        <div className="rifa-info-right">
          <div className="rifa-item">
            <span className="rifa-label">💵 Precio</span>
            <span className="rifa-valor">Q{rifa.precio}</span>
          </div>
          <div className="rifa-item">
            <span className="rifa-label">📅 Sorteo</span>
            <span className="rifa-valor">{rifa.fechaSorteo}</span>
          </div>
        </div>
      </div>

      <div className="rifa-numeros-section">
        <h4 className="rifa-numeros-titulo">Números Disponibles</h4>
        <div className="rifa-numeros-grid">
          {todos.map(numero => (
            <div
              key={numero}
              className={`numero-item ${
                disponibles.includes(numero)
                  ? 'disponible'
                  : 'no-disponible'
              }`}
            >
              {disponibles.includes(numero) ? numero : '✗'}
            </div>
          ))}
        </div>
        <div className="rifa-stats">
          <span className="stat disponible-stat">
            ✓ {disponibles.length} Disponibles
          </span>
          <span className="stat ocupado-stat">
            ✗ {ocupados.length} Vendidos
          </span>
        </div>
      </div>
    </div>
  );
}
