import { useEffect, useState } from 'react';
import { FiX } from 'react-icons/fi';
import { API_FIREBASE } from '../data';
import '../styles/TourModal.css';

interface TourModalProps {
  isOpen: boolean;
  tour: any;
  modelInfo?: any;
  onClose: () => void;
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

export default function TourModal({ isOpen, tour, modelInfo, onClose }: TourModalProps) {
  const [horarios, setHorarios] = useState<any[]>([]);
  const [cargando, setCargando] = useState(false);

  useEffect(() => {
    if (isOpen && tour?.id) {
      loadHorarios();
    }
  }, [isOpen, tour?.id]);

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
  const whatsAppLink = modelInfo?.redes?.whatsapp || '';
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
        <button className="tour-modal-close" onClick={onClose} aria-label="Cerrar modal">
          <FiX size={24} />
        </button>

        <div className="tour-modal-header">
          <h2>{tour.titulo}</h2>
          <p className="tour-modal-model">{modeloNombre}</p>
        </div>

        <div className="tour-modal-body">
          <div className="tour-modal-section">
            <h3 className="tour-modal-section-title">Información del Tour</h3>
            <div className="tour-modal-info-grid">
              <div className="tour-modal-info-item">
                <span className="tour-modal-label">Fecha</span>
                <span className="tour-modal-value">{tour.fecha || 'Por confirmar'}</span>
              </div>
              <div className="tour-modal-info-item">
                <span className="tour-modal-label">Estado</span>
                <span className={`tour-modal-badge ${tour.estado ? 'active' : 'inactive'}`}>
                  {tour.estado ? 'Activo' : 'Inactivo'}
                </span>
              </div>
            </div>

            <div className="tour-modal-description">
              <span className="tour-modal-label">Detalles</span>
              <p>{tour.detalles || 'Sin detalles adicionales'}</p>
            </div>
          </div>

          <div className="tour-modal-section">
            <h3 className="tour-modal-section-title">Ubicaciones</h3>
            <div className="tour-modal-locations">
              {locationsToShow.map((loc: any, idx: number) => (
                <div key={idx} className="tour-modal-location-item">
                  {loc.href ? (
                    <a href={loc.href} target="_blank" rel="noopener noreferrer" className="tour-modal-location-link">
                      📍 {loc.label}
                    </a>
                  ) : (
                    <span className="tour-modal-location-text">📍 {loc.label}</span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {horarios.length > 0 && (
            <div className="tour-modal-section">
              <h3 className="tour-modal-section-title">Horarios Disponibles</h3>
              <div className="tour-modal-horarios-grid">
                {horarios.map((horario, idx) => (
                  <div key={idx} className="tour-modal-horario-card">
                    <div className="tour-modal-horario-time">
                      {formatHour12(horario.horaInicio)} - {formatHour12(horario.horaFin)}
                    </div>
                    <div className="tour-modal-horario-location">{horario.lugar || 'Ubicación'}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {cargando && (
            <div className="tour-modal-loading">
              <p>Cargando horarios...</p>
            </div>
          )}
        </div>

        <div className="tour-modal-footer">
          {whatsAppLink && (
            <a
              href={getWhatsAppLink(whatsAppLink, `Hola, me interesa el tour "${tour.titulo}" de ${modeloNombre}`)}
              target="_blank"
              rel="noopener noreferrer"
              className="tour-modal-cta-button"
            >
              Contactar por WhatsApp
            </a>
          )}
          <button className="tour-modal-close-button" onClick={onClose}>
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}
