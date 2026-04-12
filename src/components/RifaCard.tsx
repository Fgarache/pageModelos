// src/components/RifaCard.tsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/RifaCard.css';

interface RifaCardProps {
  rifa: any;
  modelInfo?: any;
  nombreModelo?: string;
  userAlias?: string;
  isCompact?: boolean;
}

const getWhatsAppLink = (whatsAppUrl: string | undefined, message: string) => {
  if (!whatsAppUrl) return '';

  const encodedMessage = encodeURIComponent(message);

  if (whatsAppUrl.includes('wa.me/')) {
    return `${whatsAppUrl}${whatsAppUrl.includes('?') ? '&' : '?'}text=${encodedMessage}`;
  }

  const phone = whatsAppUrl.replace(/\D/g, '');
  return phone ? `https://wa.me/${phone}?text=${encodedMessage}` : '';
};

const getTextListItems = (text: string | undefined) =>
  (text || '')
    .split(/\r?\n/)
    .map((item) => item.trim())
    .filter(Boolean)
    .map((item) => item.replace(/^[\-•*\d.)\s]+/, '').trim())
    .filter(Boolean);

export default function RifaCard({ 
  rifa, 
  modelInfo,
  nombreModelo, 
  userAlias,
  isCompact = false
}: RifaCardProps) {
  const navigate = useNavigate();
  const [numerosAbiertos, setNumerosAbiertos] = useState(false);

  const modeloNombre = nombreModelo || modelInfo?.nombre || 'Modelo';
  const modeloAlias = userAlias || modelInfo?.user_alias || '';
  const profilPic = modelInfo?.fotoPerfil || rifa.fotoPerfil;
  const disponiblesCount = rifa.cantidadLibre || (rifa.numerosDisponibles?.length || 0);
  const availableCta = getWhatsAppLink(
    modelInfo?.redes?.whatsapp,
    `Hola quiero comprar un número para la rifa ${rifa.titulo}`,
  );
  const getNumberPurchaseLink = (numero: number) => getWhatsAppLink(
    modelInfo?.redes?.whatsapp,
    `Hola quiero comprar el número ${numero} de la rifa ${rifa.titulo}`,
  );

  const handleVerDetalles = () => {
    if (modeloAlias) {
      navigate(`/${modeloAlias}`);
    }
  };

  // --- VISTA COMPACTA (Estilo Tinder Card para RifasPage) ---
  if (isCompact) {
    return (
      <div 
        className="rifa-card-visual animate-in" 
        onClick={handleVerDetalles}
        style={{ cursor: 'pointer' }}
      >
        
        {/* IMAGEN DE FONDO */}
        <div className="card-image-background">
          {profilPic ? (
            <img src={profilPic} alt={modeloNombre} className="modelo-bg-img" />
          ) : (
            <div className="avatar-placeholder-bg">{modeloNombre[0]}</div>
          )}
          <div className="card-overlay-gradient"></div>
        </div>

        {/* INFORMACIÓN DE LA RIFA */}
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
              <span className="label">DISPONIBLES</span>
              <span className="value">{disponiblesCount}/{rifa.numerosTotales}</span>
            </div>
          </div>
          
          <div className="rifa-footer-action">
            <span className="btn-glass-action">Ver Detalles →</span>
          </div>
        </div>
      </div>
    );
  }

  // --- VISTA DETALLADA (Para perfil de la modelo) ---
  const disponibles = rifa.numerosDisponibles || [];
  const todos = Array.from({ length: rifa.numerosTotales }, (_, i) => i + 1);
  const rifaDetailItems = getTextListItems(rifa.detalles || rifa.descripcion);
  const rifaTerms = Array.isArray(rifa.terminos)
    ? rifa.terminos.flatMap((term: string) => getTextListItems(term))
    : [];

  return (
    <div style={{
      background: 'rgba(15, 52, 96, 0.4)',
      border: '1px solid rgba(212, 175, 55, 0.2)',
      borderRadius: '12px',
      padding: '14px',
      backdropFilter: 'blur(10px)',
      transition: 'all 0.3s ease'
    }}>
      <div style={{ marginBottom: '10px' }}>
        <h3 style={{ 
          margin: '0 0 6px 0', 
          color: '#fff',
          fontWeight: '800',
          fontSize: '16px',
          textTransform: 'uppercase'
        }}>
          {rifa.titulo}
        </h3>
        <p style={{ margin: 0, color: '#d4af37', fontWeight: '600', fontSize: '12px' }}>
          🎁 {rifa.premio}
        </p>
      </div>

      <div style={{ marginBottom: '14px', paddingBottom: '10px', borderBottom: '1px solid rgba(212, 175, 55, 0.1)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
          <div>
            <p style={{ margin: '0 0 4px 0', color: '#aaa', fontSize: '10px', fontWeight: '600', textTransform: 'uppercase' }}>
              Precio por Boleto
            </p>
            <p style={{ margin: 0, color: '#d4af37', fontSize: '18px', fontWeight: '800' }}>
              Q{rifa.precio}
            </p>
          </div>
          <div>
            <p style={{ margin: '0 0 4px 0', color: '#aaa', fontSize: '10px', fontWeight: '600', textTransform: 'uppercase' }}>
              Fecha del Sorteo
            </p>
            <p style={{ margin: 0, color: '#fff', fontSize: '12px' }}>
              {rifa.fechaSorteo}
            </p>
          </div>
        </div>
      </div>

      {rifaDetailItems.length > 0 && (
        <div style={{ marginBottom: '14px', paddingBottom: '10px', borderBottom: '1px solid rgba(212, 175, 55, 0.1)' }}>
          <p style={{ margin: '0 0 8px 0', color: '#aaa', fontSize: '10px', fontWeight: '600', textTransform: 'uppercase' }}>
            Detalles
          </p>
          <ul style={{ margin: 0, paddingLeft: '16px', color: '#ccc', fontSize: '11px', display: 'grid', gap: '4px' }}>
            {rifaDetailItems.map((item: string, index: number) => (
              <li key={`${item}-${index}`} style={{ marginBottom: 0, lineHeight: '1.35' }}>{item}</li>
            ))}
          </ul>
        </div>
      )}

      {rifaTerms.length > 0 && (
        <div style={{ marginBottom: '14px', paddingBottom: '10px', borderBottom: '1px solid rgba(212, 175, 55, 0.1)' }}>
          <p style={{ margin: '0 0 8px 0', color: '#aaa', fontSize: '10px', fontWeight: '600', textTransform: 'uppercase' }}>
            Términos y Condiciones
          </p>
          <ul style={{ margin: 0, paddingLeft: '16px', color: '#ccc', fontSize: '11px' }}>
            {rifaTerms.map((t: string, i: number) => (
              <li key={`${t}-${i}`} style={{ marginBottom: '4px', lineHeight: '1.35' }}>{t}</li>
            ))}
          </ul>
        </div>
      )}

      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
          <p style={{ margin: 0, color: '#aaa', fontSize: '10px', fontWeight: '600', textTransform: 'uppercase' }}>
            Distribución de Boletos
          </p>
          <button 
            onClick={() => setNumerosAbiertos(!numerosAbiertos)}
            style={{
              background: 'rgba(212, 175, 55, 0.2)',
              border: '1px solid rgba(212, 175, 55, 0.4)',
              color: '#d4af37',
              padding: '4px 10px',
              borderRadius: '5px',
              cursor: 'pointer',
              fontSize: '10px',
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
            {numerosAbiertos ? '▼ Cerrar' : '► Expandir'}
          </button>
        </div>

        {numerosAbiertos && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(40px, 1fr))',
            gap: '5px',
            marginTop: '8px'
          }}>
            {todos.map((numero) => {
              const isDisponible = disponibles.includes(numero);
              const purchaseLink = isDisponible ? getNumberPurchaseLink(numero) : '';
              return (
                purchaseLink ? (
                  <a
                    key={numero}
                    href={purchaseLink}
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      padding: '6px',
                      textAlign: 'center',
                      borderRadius: '6px',
                      background: 'rgba(76, 175, 80, 0.2)',
                      border: '1px solid rgba(76, 175, 80, 0.4)',
                      color: '#4caf50',
                      fontSize: '10px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      textDecoration: 'none'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'rgba(76, 175, 80, 0.3)';
                      e.currentTarget.style.borderColor = 'rgba(76, 175, 80, 0.6)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'rgba(76, 175, 80, 0.2)';
                      e.currentTarget.style.borderColor = 'rgba(76, 175, 80, 0.4)';
                    }}
                  >
                    {numero}
                  </a>
                ) : (
                  <div
                    key={numero}
                    style={{
                      padding: '6px',
                      textAlign: 'center',
                      borderRadius: '6px',
                      background: 'rgba(244, 67, 54, 0.14)',
                      border: '1px solid rgba(244, 67, 54, 0.4)',
                      color: '#ff6b6b',
                      fontSize: '10px',
                      fontWeight: '800',
                      cursor: 'not-allowed',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    X
                  </div>
                )
              );
            })}
          </div>
        )}
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '8px',
        marginTop: '14px'
      }}>
        <div style={{
          padding: '10px',
          background: 'rgba(76, 175, 80, 0.1)',
          border: '1px solid rgba(76, 175, 80, 0.2)',
          borderRadius: '8px',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '10px', color: '#aaa', marginBottom: '4px', textTransform: 'uppercase', fontWeight: '600' }}>
            Disponibles
          </div>
          <div style={{ fontSize: '15px', color: '#4caf50', fontWeight: '800' }}>
            {disponiblesCount}
          </div>
        </div>
        <div style={{
          padding: '10px',
          background: 'rgba(244, 67, 54, 0.1)',
          border: '1px solid rgba(244, 67, 54, 0.2)',
          borderRadius: '8px',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '10px', color: '#aaa', marginBottom: '4px', textTransform: 'uppercase', fontWeight: '600' }}>
            Vendidos
          </div>
          <div style={{ fontSize: '15px', color: '#f44336', fontWeight: '800' }}>
            {rifa.numerosTotales - disponiblesCount}
          </div>
        </div>
      </div>

      {availableCta && disponiblesCount > 0 && (
        <a
          href={availableCta}
          target="_blank"
          rel="noreferrer"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginTop: '12px',
            width: '100%',
            padding: '10px 12px',
            borderRadius: '8px',
            textDecoration: 'none',
            fontWeight: '800',
            letterSpacing: '0.06em',
            fontSize: '11px',
            textTransform: 'uppercase',
            background: 'rgba(76, 175, 80, 0.16)',
            border: '1px solid rgba(76, 175, 80, 0.35)',
            color: '#8af0b0'
          }}
        >
          Comprar número
        </a>
      )}
    </div>
  );
}