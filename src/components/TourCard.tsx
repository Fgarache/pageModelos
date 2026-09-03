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
  const [profilPic] = useState<string>(() => { return modelInfo?.fotoPerfil || tour.fotoPerfil || ''; });
  const whatsAppLink = modelInfo?.redes?.whatsapp || '';
  const places = [tour.lugar, tour.lugarDisponible].filter(Boolean);
  const uniquePlaces = Array.from(new Set(places.map((p: any) => p.trim())));
  const fallbackLabel = uniquePlaces.join(' / ');
  const locationsToShow = (Array.isArray(tour.ubicacionesTour) ? tour.ubicacionesTour : [])
    .filter((item: any) => item?.label && item?.href);
  const primaryLocation = locationsToShow[0];
  const primaryLocationText = 'Ver ubicación';

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
          {fallbackLabel && (
            <div style={{
              position: 'absolute',
              top: '8px',
              left: '50%',
              transform: 'translateX(-50%)',
              zIndex: 2,
              background: 'rgba(0, 0, 0, 0.75)',
              backdropFilter: 'blur(8px)',
              border: '1px solid rgba(212, 175, 55, 0.4)',
              borderRadius: '6px',
              padding: '4px 10px',
              color: '#d4af37',
              fontWeight: '800',
              fontSize: 'clamp(0.65rem, 2.5vw, 0.75rem)',
              textTransform: 'uppercase',
              letterSpacing: '0.02em',
              textAlign: 'center',
              maxWidth: '85%',
              lineHeight: '1.2'
            }}>
              {fallbackLabel}
            </div>
          )}
        </div>

        <div className="tour-card-content-overlay">
          <div className="tour-modelo-header">
            <h4 className="modelo-name">{modeloNombre}</h4>
            <span className="modelo-alias">@{modeloAlias}</span>
          </div>

          <h3 className="tour-main-title">{tour.titulo}</h3>
          
          {locationsToShow.length > 0 && (
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
          )}

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
      background: '#0d1117',
      transition: 'all 0.3s ease',
      alignSelf: 'stretch',
      cursor: 'default',
      display: 'flex',
      flexDirection: 'column'
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
        padding: '6px clamp(8px, 2.8vw, 12px) 8px',
        display: 'flex',
        flexDirection: 'column',
        flex: 1
      }}>
        {fallbackLabel && (
          <div style={{
            alignSelf: 'center',
            marginBottom: '10px',
            background: 'rgba(0, 0, 0, 0.75)',
            backdropFilter: 'blur(8px)',
            border: '1px solid rgba(212, 175, 55, 0.4)',
            borderRadius: '6px',
            padding: '4px 10px',
            color: '#d4af37',
            fontWeight: '800',
            fontSize: 'clamp(0.7rem, 2.5vw, 0.85rem)',
            textTransform: 'uppercase',
            letterSpacing: '0.02em',
            textAlign: 'center',
            lineHeight: '1.2'
          }}>
            {fallbackLabel}
          </div>
        )}

        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <h3 style={{ 
          margin: '0 0 4px 0', 
          color: '#fff',
          fontWeight: '800',
          fontSize: 'clamp(0.6rem, 2vw, 0.75rem)',
          lineHeight: '1.02',
          textTransform: 'uppercase'
        }}>
          {tour.titulo}
        </h3>

        <div style={{ marginBottom: '6px' }}>
          {tourDetailItems.length > 0 ? (
            <ul style={{ margin: 0, paddingLeft: '10px', color: '#ccc', fontSize: 'clamp(0.64rem, 2.2vw, 0.76rem)', lineHeight: '1.15', display: 'grid', gap: '2px' }}>
              {tourDetailItems.map((item, index) => (
                <li key={`${item}-${index}`} style={{ margin: 0 }}>
                  {item}
                </li>
              ))}
            </ul>
          ) : null}
        </div>

        {locationsToShow.length > 0 && (
          <div style={{ marginBottom: '6px' }} data-ignore-mobile-expand="true" onClick={(event) => event.stopPropagation()}>
            <p style={{ margin: '0 0 6px 0', color: '#aaa', fontSize: 'clamp(0.6rem, 2.1vw, 0.68rem)', fontWeight: '600', textTransform: 'uppercase' }}>
              Ubicaciones
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {locationsToShow.map((location: any, index: number) => (
                <span key={`${location.label}-${index}`} style={{ margin: 0, color: '#fff', fontSize: 'clamp(0.58rem, 2vw, 0.68rem)' }}>
                  {location.href ? (
                    <a href={location.href} target="_blank" rel="noreferrer" className="tour-location-link-inline" title={location.label}>
                      {locationsToShow.length > 1 ? `Ver ubicación ${index + 1}` : 'Ver ubicación'}
                    </a>
                  ) : <span title={location.label}>{locationsToShow.length > 1 ? `Ver ubicación ${index + 1}` : 'Ver ubicación'}</span>}
                </span>
              ))}
            </div>
          </div>
        )}
        </div>

        <div>
          <div style={{ marginBottom: '0' }} data-ignore-mobile-expand="true" onClick={(event) => event.stopPropagation()}>
            <div style={{ marginBottom: '6px' }}>
              <p style={{ margin: 0, color: '#aaa', fontSize: 'clamp(0.6rem, 2.1vw, 0.68rem)', fontWeight: '600', textTransform: 'uppercase' }}>
                Horarios
              </p>
            </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '6px',
            marginTop: '4px'
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
                    fontSize: 'clamp(0.5rem, 1.8vw, 0.58rem)',
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
                    fontSize: 'clamp(0.5rem, 1.8vw, 0.58rem)',
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
          <p style={{ margin: '6px 0 0 0', color: 'rgba(255, 255, 255, 0.6)', fontSize: '0.62rem', textAlign: 'center', fontWeight: '500' }}>
            Toca un horario para agendar
          </p>
          </div>
        </div>
      </div>

    </div>
  );
}