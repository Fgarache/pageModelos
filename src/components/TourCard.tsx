import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_FIREBASE } from '../data';
import '../styles/TourCard.css';

interface TourCardProps {
  tour: any;
  modelInfo?: any;
  nombreModelo?: string;
  userAlias?: string;
  isCompact?: boolean;
  onShowModal?: (tour: any) => void;
}

const formatHour12 = (time: string) => {
  const [hourText, minuteText = '00'] = time.split(':');
  const hour = Number(hourText);

  if (Number.isNaN(hour)) return time;

  const period = hour >= 12 ? 'PM' : 'AM';
  const normalizedHour = hour % 12 || 12;
  return `${normalizedHour}:${minuteText} ${period}`;
};

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

export default function TourCard({ 
  tour, 
  modelInfo,
  nombreModelo, 
  userAlias,
  isCompact = false
}: TourCardProps) {
  const navigate = useNavigate();
  const [horarios, setHorarios] = useState<any[]>([]);
  const [cargando, setCargando] = useState(false);

  const modeloNombre = nombreModelo || modelInfo?.nombre || 'Modelo';
  const modeloAlias = userAlias || modelInfo?.user_alias || '';
  const profilPic = modelInfo?.fotoPerfil || tour.fotoPerfil;
  const whatsAppLink = modelInfo?.redes?.whatsapp || '';
  const normalizedLocations = (Array.isArray(tour.ubicacionesTour) ? tour.ubicacionesTour : [])
    .filter((item: any) => item?.label);
  const fallbackPrimary = {
    label: tour.lugar || tour.lugarDisponible || 'Ubicacion por confirmar',
    href: tour.lugarLink || '',
  };
  const locationsToShow = normalizedLocations.length > 0 ? normalizedLocations : [fallbackPrimary];
  const primaryLocation = locationsToShow[0];
  const primaryLocationText = 'Ubicacion 1';

  useEffect(() => {
    if (isCompact || !tour?.id) return;

    let isActive = true;

    const loadHorarios = async () => {
      setCargando(true);
      try {
        const datos = await API_FIREBASE.getAllHorariosByTour(tour.id);
        if (isActive) {
          setHorarios(datos);
        }
      } catch (error) {
        console.error(error);
      } finally {
        if (isActive) {
          setCargando(false);
        }
      }
    };

    loadHorarios();

    return () => {
      isActive = false;
    };
  }, [isCompact, tour?.id]);

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
            {primaryLocation.href ? (
              <a href={primaryLocation.href} target="_blank" rel="noreferrer" className="tour-location-link" title={primaryLocation.label}>
                {primaryLocationText}
              </a>
            ) : (
              <span className="info-text" title={primaryLocation.label}>{primaryLocationText}</span>
            )}
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

  const horariosDisponiblesDetalle = (horarios.length > 0 ? horarios : horariosDisponibles.map((hora) => ({ hora, disponible: true })))
    .filter((item: any) => item.disponible);
  const tourDetailItems = getTextListItems(tour.detalles);

  return (
    <div className="tour-card-liquid detailed" style={{
      position: 'relative',
      overflow: 'hidden',
      border: '1px solid rgba(212, 175, 55, 0.2)',
      borderRadius: '18px',
      minHeight: 'clamp(320px, 62vw, 420px)',
      background: '#0d1117',
      transition: 'all 0.3s ease',
      alignSelf: 'start'
    }}>
      {profilPic ? (
        <>
          <img
            src={profilPic}
            alt={modeloNombre}
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              filter: 'brightness(0.68) contrast(1.04) saturate(1.02)'
            }}
          />
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(180deg, rgba(8, 10, 14, 0.14), rgba(8, 10, 14, 0.42) 44%, rgba(8, 10, 14, 0.68))'
          }} />
        </>
      ) : null}

      <div style={{
        position: 'relative',
        zIndex: 1,
        padding: 'clamp(10px, 2.8vw, 16px)',
        minHeight: 'clamp(320px, 62vw, 420px)',
        display: 'flex',
        flexDirection: 'column'
      }}>
        <h3 style={{ 
          margin: '0 0 8px 0', 
          color: '#fff',
          fontWeight: '800',
          fontSize: 'clamp(0.88rem, 3.2vw, 1.08rem)',
          lineHeight: '1.02',
          textTransform: 'uppercase'
        }}>
          {tour.titulo}
        </h3>

        <div style={{ marginBottom: '15px' }}>
          {tourDetailItems.length > 0 ? (
            <ul style={{ margin: 0, paddingLeft: '16px', color: '#ccc', fontSize: 'clamp(0.68rem, 2.35vw, 0.8rem)', lineHeight: '1.35', display: 'grid', gap: '4px' }}>
              {tourDetailItems.map((item, index) => (
                <li key={`${item}-${index}`} style={{ margin: 0 }}>
                  {item}
                </li>
              ))}
            </ul>
          ) : null}
        </div>

        <div style={{ marginBottom: '12px' }}>
          <p style={{ margin: '0 0 6px 0', color: '#aaa', fontSize: 'clamp(0.6rem, 2.1vw, 0.68rem)', fontWeight: '600', textTransform: 'uppercase' }}>
            Ubicaciones
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
            {locationsToShow.map((location: any, index: number) => (
              <span key={`${location.label}-${index}`} style={{ margin: 0, color: '#fff', fontSize: 'clamp(0.58rem, 2vw, 0.68rem)' }}>
                {location.href ? (
                  <a href={location.href} target="_blank" rel="noreferrer" className="tour-location-link-inline" title={location.label}>
                    {`Ubicacion ${index + 1}`}
                  </a>
                ) : <span title={location.label}>{`Ubicacion ${index + 1}`}</span>}
              </span>
            ))}
          </div>
        </div>

        <div style={{ marginTop: 'auto' }}>
          <div style={{ marginBottom: '20px' }}>
            <div style={{ marginBottom: '12px' }}>
              <p style={{ margin: 0, color: '#aaa', fontSize: 'clamp(0.6rem, 2.1vw, 0.68rem)', fontWeight: '600', textTransform: 'uppercase' }}>
                Horarios
              </p>
            </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '6px',
            marginTop: '12px'
          }}>
            {cargando ? (
              <p style={{ color: '#aaa', fontSize: 'clamp(0.6rem, 2vw, 0.68rem)', margin: 0 }}>Cargando horarios...</p>
            ) : horariosDisponiblesDetalle.length > 0 ? (
              horariosDisponiblesDetalle.map((h: any) => {
                const href = getWhatsAppLink(
                  whatsAppLink,
                  `Hola quiero agendar el horario ${formatHour12(h.hora)} para ${tour.titulo}`,
                );

                return href ? (
                  <a key={h.hora} href={href} target="_blank" rel="noreferrer" style={{
                    padding: '6px 5px',
                    textAlign: 'center',
                    borderRadius: '8px',
                    background: 'rgba(76, 175, 80, 0.2)',
                    border: '1px solid rgba(76, 175, 80, 0.4)',
                    color: '#7af0a5',
                    fontSize: 'clamp(0.56rem, 2vw, 0.64rem)',
                    fontWeight: '700',
                    textDecoration: 'none'
                  }}>
                    <div>{formatHour12(h.hora)}</div>
                  </a>
                ) : (
                  <div key={h.hora} style={{
                    padding: '6px 5px',
                    textAlign: 'center',
                    borderRadius: '8px',
                    background: 'rgba(76, 175, 80, 0.2)',
                    border: '1px solid rgba(76, 175, 80, 0.4)',
                    color: '#7af0a5',
                    fontSize: 'clamp(0.56rem, 2vw, 0.64rem)',
                    fontWeight: '700'
                  }}>
                    <div>{formatHour12(h.hora)}</div>
                  </div>
                );
              })
            ) : (
              <p style={{ color: '#aaa', fontSize: 'clamp(0.6rem, 2vw, 0.68rem)', margin: 0 }}>No hay horarios visibles.</p>
            )}
          </div>
          </div>
        </div>
      </div>

    </div>
  );
}