import { useEffect } from 'react';
import { FaWhatsapp } from 'react-icons/fa';

interface FloatingContactProps {
  contactLinks: any[];
  availabilityFloatingMessage: string;
  hasTours: boolean;
  hasRifas: boolean;
  onOpenContactModal: () => void;
}

export default function FloatingContact({ 
  contactLinks, 
  availabilityFloatingMessage, 
  hasTours, 
  hasRifas, 
  onOpenContactModal 
}: FloatingContactProps) {


  useEffect(() => {
    // Si queremos efectos de aparición del botón, van aquí.
  }, [availabilityFloatingMessage, contactLinks.length, hasRifas, hasTours]);

  if (contactLinks.length === 0) return null;

  return (
    <div className="floating-contact-cta" aria-label="Contacto">


      <button
        type="button"
        className="floating-contact-button"
        onClick={onOpenContactModal}
        aria-label="Contactame"
        title="Contactame"
      >
        <FaWhatsapp className="floating-contact-button-icon" />
        <span>Contactame</span>
      </button>
    </div>
  );
}