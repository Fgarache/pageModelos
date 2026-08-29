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
  const [numerosAbiertos, setNumerosAbiertos] = useState(true);

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
              <span className="label">PRECIO POR NUMERO</span>
              <span className="value gold">Q{rifa.precio}</span>
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
    <div className="liquid-glass" style={{
      borderRadius: '12px',
      padding: '10px',
      transition: 'all 0.3s ease'
    }}>
      <div style={{ marginBottom: '6px' }}>
        <h3 style={{ 
          margin: '0 0 4px 0', 
          color: '#fff',
          fontWeight: '800',
          fontSize: 'clamp(0.65rem, 2vw, 0.75rem)',
          textTransform: 'uppercase',
          lineHeight: 1.1
        }}>
          {rifa.titulo}
        </h3>
        <p style={{ margin: 0, color: '#d4af37', fontWeight: '600', fontSize: 'clamp(0.55rem, 2vw, 0.65rem)' }}>
          🎁 {rifa.premio}
        </p>
      </div>

      <div style={{ marginBottom: '8px', paddingBottom: '6px', borderBottom: '1px solid rgba(212, 175, 55, 0.1)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
          <div>
            <p style={{ margin: '0 0 2px 0', color: '#aaa', fontSize: '9px', fontWeight: '600', textTransform: 'uppercase' }}>
              Precio por numero
            </p>
            <p style={{ margin: 0, color: '#d4af37', fontSize: '14px', fontWeight: '800' }}>
              Q{rifa.precio}
            </p>
          </div>
          <div>
            <p style={{ margin: '0 0 2px 0', color: '#aaa', fontSize: '9px', fontWeight: '600', textTransform: 'uppercase' }}>
              Fecha del Sorteo
            </p>
            <p style={{ margin: 0, color: '#fff', fontSize: '10px' }}>
              {rifa.fechaSorteo}
            </p>
          </div>
        </div>
      </div>

      {rifaDetailItems.length > 0 && (
        <div style={{ marginBottom: '8px', paddingBottom: '6px', borderBottom: '1px solid rgba(212, 175, 55, 0.1)' }}>
          <p style={{ margin: '0 0 4px 0', color: '#aaa', fontSize: '9px', fontWeight: '600', textTransform: 'uppercase' }}>
            Detalles
          </p>
          <ul style={{ margin: 0, paddingLeft: '12px', color: '#ccc', fontSize: 'clamp(0.55rem, 1.8vw, 0.6rem)', display: 'grid', gap: '2px', lineHeight: 1.15 }}>
            {rifaDetailItems.map((item: string, index: number) => (
              <li key={`${item}-${index}`} style={{ marginBottom: 0, lineHeight: '1.15' }}>{item}</li>
            ))}
          </ul>
        </div>
      )}

      {rifaTerms.length > 0 && (
        <div style={{ marginBottom: '8px', paddingBottom: '6px', borderBottom: '1px solid rgba(212, 175, 55, 0.1)' }}>
          <p style={{ margin: '0 0 4px 0', color: '#aaa', fontSize: '9px', fontWeight: '600', textTransform: 'uppercase' }}>
            Términos y Condiciones
          </p>
          <ul style={{ margin: 0, paddingLeft: '12px', color: '#ccc', fontSize: 'clamp(0.55rem, 1.8vw, 0.6rem)', lineHeight: 1.15 }}>
            {rifaTerms.map((t: string, i: number) => (
              <li key={`${t}-${i}`} style={{ marginBottom: '2px', lineHeight: '1.15' }}>{t}</li>
            ))}
          </ul>
        </div>
      )}

      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
          <p style={{ margin: 0, color: '#aaa', fontSize: '9px', fontWeight: '600', textTransform: 'uppercase' }}>
            Distribución de Boletos
          </p>
          <button 
            onClick={() => setNumerosAbiertos(!numerosAbiertos)}
            style={{
              background: 'rgba(212, 175, 55, 0.2)',
              border: '1px solid rgba(212, 175, 55, 0.4)',
              color: '#d4af37',
              padding: '2px 6px',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '9px',
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
            gridTemplateColumns: 'repeat(auto-fill, minmax(30px, 1fr))',
            gap: '4px',
            marginTop: '6px'
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
                      padding: '3px 0',
                      textAlign: 'center',
                      borderRadius: '4px',
                      background: 'rgba(76, 175, 80, 0.2)',
                      border: '1px solid rgba(76, 175, 80, 0.4)',
                      color: '#4caf50',
                      fontSize: '9px',
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
                      padding: '3px 0',
                      textAlign: 'center',
                      borderRadius: '4px',
                      background: 'rgba(244, 67, 54, 0.14)',
                      border: '1px solid rgba(244, 67, 54, 0.4)',
                      color: '#ff6b6b',
                      fontSize: '9px',
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

      {availableCta && disponiblesCount > 0 && (
        <a
          href={availableCta}
          target="_blank"
          rel="noreferrer"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginTop: '8px',
            width: '100%',
            padding: '8px',
            borderRadius: '6px',
            textDecoration: 'none',
            fontWeight: '800',
            letterSpacing: '0.04em',
            fontSize: '10px',
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