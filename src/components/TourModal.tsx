import { useEffect, useState } from 'react';
import { SiWhatsapp, SiTelegram } from 'react-icons/si';
import { API_FIREBASE } from '../data';
import '../styles/TourModal.css';

interface TourModalProps {
  isOpen: boolean;
  tour: any;
  modelInfo?: any;
  onClose: () => void;
}

const getTextListItems = (text: string | undefined) =>
  (text || '')
    .split(/\r?\n/)
    .map((item) => item.trim())
    .filter(Boolean)
    .map((item) => item.replace(/^[\-•*\d.)\s]+/, '').trim())
    .filter(Boolean);

const formatHour12 = (time?: string | null) => {
  if (!time || typeof time !== 'string') return 'Horario por confirmar';

  const [hourText, minuteText = '00'] = time.split(':');
  const hour = Number(hourText);

  if (Number.isNaN(hour)) return time;

  const period = hour >= 12 ? 'PM' : 'AM';
  const normalizedHour = hour % 12 || 12;
  return `${normalizedHour}:${minuteText} ${period}`;
};

const WEEKDAY_FORMATTER = new Intl.DateTimeFormat('es-GT', { weekday: 'long' });
const MONTH_NAMES = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];

const getDateInfo = (rawDate?: string) => {
  if (!rawDate) {
    return 'Fecha por confirmar';
  }

  const trimmedDate = rawDate.trim();
  const isoCandidate = new Date(`${trimmedDate}T00:00:00`);

  if (!Number.isNaN(isoCandidate.getTime())) {
    const weekday = WEEKDAY_FORMATTER.format(isoCandidate);
    const day = isoCandidate.getDate().toString().padStart(2, '0');
    const month = MONTH_NAMES[isoCandidate.getMonth()];
    return `Fecha ${weekday} ${day} de ${month}`;
  }

  const slashMatch = trimmedDate.match(/^(\d{1,2})\/(\d{1,2})\/(\d{2,4})$/);
  if (slashMatch) {
    const [, dayText, monthText, yearText] = slashMatch;
    const year = yearText.length === 2 ? `20${yearText}` : yearText;
    const parsedDate = new Date(`${year}-${monthText.padStart(2, '0')}-${dayText.padStart(2, '0')}T00:00:00`);

    if (!Number.isNaN(parsedDate.getTime())) {
      const weekday = WEEKDAY_FORMATTER.format(parsedDate);
      const day = parsedDate.getDate().toString().padStart(2, '0');
      const month = MONTH_NAMES[parsedDate.getMonth()];
      return `Fecha ${weekday} ${day} de ${month}`;
    }
  }

  return 'Fecha por confirmar';
};

const getHorarioLabel = (horario: any) => {
  if (horario?.horaInicio && horario?.horaFin) {
    return `${formatHour12(horario.horaInicio)} - ${formatHour12(horario.horaFin)}`;
  }

  if (horario?.hora) {
    return formatHour12(horario.hora);
  }

  return 'Horario por confirmar';
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

const getExternalLink = (url: string | undefined) => {
  if (!url) return '';
  if (/^https?:\/\//i.test(url)) return url;
  return `https://${url}`;
};

const getProfileImageUrl = (item: any) => {
  if (typeof item === 'string') return item.trim();
  if (item && typeof item === 'object') {
    return item.link || item.url || item.src || '';
  }
  return '';
};

const collectProfileImages = (modelInfo: any, tour: any) => {
  const galleryItems = Object.values(modelInfo?.fotos || {}).flatMap((item: any) => {
    if (Array.isArray(item)) {
      return item.map((entry) => getProfileImageUrl(entry)).filter(Boolean);
    }

    const imageUrl = getProfileImageUrl(item);
    return imageUrl ? [imageUrl] : [];
  });

  return Array.from(
    new Set([
      modelInfo?.fotoPerfil || '',
      tour?.fotoPerfil || '',
      ...galleryItems,
    ].filter(Boolean)),
  );
};

export default function TourModal({ isOpen, tour, modelInfo, onClose }: TourModalProps) {
  const [horarios, setHorarios] = useState<any[]>([]);
  const [cargando, setCargando] = useState(false);
  const [heroImage, setHeroImage] = useState('');

  useEffect(() => {
    if (!isOpen || typeof document === 'undefined') return undefined;

    const previousBodyOverflow = document.body.style.overflow;
    const previousHtmlOverflow = document.documentElement.style.overflow;

    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = previousBodyOverflow;
      document.documentElement.style.overflow = previousHtmlOverflow;
    };
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && tour?.id) {
      loadHorarios();
    }
  }, [isOpen, tour?.id]);

  useEffect(() => {
    if (!isOpen) return;

    const uniqueImages = collectProfileImages(modelInfo, tour);
    const fallbackImage = modelInfo?.fotoPerfil || tour?.fotoPerfil || uniqueImages[0] || '';

    if (uniqueImages.length === 0) {
      setHeroImage(fallbackImage);
      return;
    }

    const randomIndex = Math.floor(Math.random() * uniqueImages.length);
    setHeroImage(uniqueImages[randomIndex] || fallbackImage);
  }, [isOpen]);

  const loadHorarios = async () => {
    if (!tour?.id) return;
    setCargando(true);
    try {
      const datos = await API_FIREBASE.getAllHorariosByTour(tour.id);
      setHorarios(datos);
    } catch (error) {
      console.error(error);
    } finally {
      setCargando(false);
    }
  };

  if (!isOpen || !tour) return null;

  const modeloNombre = modelInfo?.nombre || 'Modelo';
  const modeloAlias = modelInfo?.user_alias || tour?.user_alias || '';
  const whatsAppLink = modelInfo?.redes?.whatsapp || '';
  const telegramLink = getExternalLink(modelInfo?.redes?.telegram || '');
  const visibleHeroImage = heroImage || modelInfo?.fotoPerfil || tour?.fotoPerfil || collectProfileImages(modelInfo, tour)[0] || '';
  const dateInfo = getDateInfo(tour.fecha);
  const profileWatermark = modeloAlias ? `LindasGT.com/${modeloAlias}` : 'LindasGT.com';
  const detailItems = getTextListItems(tour.detalles);
  const normalizedLocations = (Array.isArray(tour.ubicacionesTour) ? tour.ubicacionesTour : [])
    .filter((item: any) => item?.label);
  const fallbackPrimary = {
    label: tour.lugar || tour.lugarDisponible || 'Ubicacion por confirmar',
    href: tour.lugarLink || '',
  };
  const locationsToShow = normalizedLocations.length > 0 ? normalizedLocations : [fallbackPrimary];

  return (
    <div className="tour-modal-overlay" onClick={onClose}>
      <div className="tour-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="tour-modal-body tour-modal-body-card">
          <div className="tour-modal-image-shell">
            <div className="tour-modal-image-overlay">
              <strong className="tour-modal-date-value">{dateInfo}</strong>
            </div>
            {visibleHeroImage ? (
              <img src={visibleHeroImage} alt={modeloNombre} className="tour-modal-square-image" />
            ) : (
              <div className="tour-modal-square-placeholder">{modeloNombre.charAt(0)}</div>
            )}
            <div className="tour-modal-watermark">{profileWatermark}</div>
          </div>

          <div className="tour-modal-header tour-modal-header-inline">
            <h2>{tour.titulo}</h2>
          </div>

          <div className="tour-modal-section">
            <h3 className="tour-modal-section-title">Detalles</h3>
            {detailItems.length > 0 ? (
              <ul className="tour-modal-detail-list">
                {detailItems.map((item, index) => (
                  <li key={`${item}-${index}`}>{item}</li>
                ))}
              </ul>
            ) : (
              <div className="tour-modal-description">
                <p>{tour.detalles || 'Sin detalles adicionales'}</p>
              </div>
            )}
          </div>

          <div className="tour-modal-section">
            <div className="tour-modal-locations-and-contact">
              <div className="tour-modal-column-block">
                <h3 className="tour-modal-section-title">Ubicaciones</h3>
                <div className="tour-modal-locations">
                  {locationsToShow.map((loc: any, idx: number) => (
                    <div key={idx} className="tour-modal-location-item">
                      {loc.href ? (
                        <a href={loc.href} target="_blank" rel="noopener noreferrer" className="tour-modal-location-link">
                          {`Ubicacion ${idx + 1}`}
                        </a>
                      ) : (
                        <span className="tour-modal-location-text">{loc.label}</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="tour-modal-column-block">
                <h3 className="tour-modal-section-title">Agendar</h3>
                <div className="tour-modal-contact-icons">
                  {whatsAppLink && (
                    <a
                      href={getWhatsAppLink(whatsAppLink, `Hola, me interesa el tour "${tour.titulo}" de ${modeloNombre}`)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="tour-modal-icon-link"
                      title="WhatsApp"
                    >
                      <SiWhatsapp size={16} />
                      <span className="tour-modal-contact-label">WhatsApp</span>
                    </a>
                  )}
                  {telegramLink && (
                    <a
                      href={telegramLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="tour-modal-icon-link"
                      title="Telegram"
                    >
                      <SiTelegram size={16} />
                      <span className="tour-modal-contact-label">Telegram</span>
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>

          {horarios.length > 0 && (
            <div className="tour-modal-section">
              <h3 className="tour-modal-section-title">Horarios Disponibles</h3>
              <div className="tour-modal-horarios-grid">
                {horarios.map((horario, idx) => (
                  (() => {
                    const horarioLabel = getHorarioLabel(horario);
                    const horarioWhatsAppLink = getWhatsAppLink(
                      whatsAppLink,
                      `Hola, quiero agendar el horario ${horarioLabel} para ${tour.titulo}`,
                    );

                    if (horarioWhatsAppLink) {
                      return (
                        <a
                          key={idx}
                          href={horarioWhatsAppLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="tour-modal-horario-card tour-modal-horario-card-link"
                        >
                          <div className="tour-modal-horario-time">
                            {horarioLabel}
                          </div>
                        </a>
                      );
                    }

                    return (
                      <div key={idx} className="tour-modal-horario-card">
                        <div className="tour-modal-horario-time">
                          {horarioLabel}
                        </div>
                      </div>
                    );
                  })()
                ))}
              </div>
            </div>
          )}

          {cargando && (
            <div className="tour-modal-loading">
              <p>Cargando horarios...</p>
            </div>
          )}

          <div className="tour-modal-bottom-actions">
            <button className="tour-modal-close-button-primary" onClick={onClose}>
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
