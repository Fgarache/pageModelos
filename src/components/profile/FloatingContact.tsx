import { useState, useEffect } from 'react';
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
  const [visibleFloatingMessages, setVisibleFloatingMessages] = useState<string[]>([]);
  const [isTypingIcon, setIsTypingIcon] = useState(false);

  useEffect(() => {
    if (contactLinks.length === 0) return;

    setVisibleFloatingMessages([]);
    // Inicia la animación de escribiendo al montar el componente
    setIsTypingIcon(true);

    // =========================================================================
    // LISTA DE MENSAJES FLOTANTES
    // =========================================================================
    const chatMessages = [
      'Hola 😄',
      
      // Mensaje dinámico: "Hoy estoy disponible en la capital" o "Solo por hoy disponible en [lugar]"
      availabilityFloatingMessage, 
      'Escribeme al whatsapp o telegram 📩',
      'Revisa mi canal de fotos en telegram🔥',
      
      ...(hasTours ? ['voy a los departamento frecuentemente 😊'] : []),
      ...(hasRifas ? ['También tengo una rifa disponible 🎟️'] : []),
      
      'Escribeme para agendar o para más información🥰',
    ];
    // =========================================================================

    const revealStartMs = 3000;
    const revealStepMs = 4000;
    
    const revealTimeouts = chatMessages.map((_, index) => window.setTimeout(() => {
      
      // Mantiene la animación de "escribiendo..." hasta que sale el ÚLTIMO mensaje
      if (index === chatMessages.length - 1) {
        setIsTypingIcon(false);
      } else {
        setIsTypingIcon(true);
      }
      
      // Mantiene un máximo de 2 mensajes visibles a la vez
      const startIndex = Math.max(0, index - 1); 
      setVisibleFloatingMessages(chatMessages.slice(startIndex, index + 1));
      
    }, revealStartMs + (index * revealStepMs)));

    const hideTimeout = window.setTimeout(() => {
      setVisibleFloatingMessages([]);
      setIsTypingIcon(false);
    }, revealStartMs + (chatMessages.length * revealStepMs) + 3800);

    return () => {
      revealTimeouts.forEach((timeoutId) => window.clearTimeout(timeoutId));
      window.clearTimeout(hideTimeout);
    };
  }, [availabilityFloatingMessage, contactLinks.length, hasRifas, hasTours]);

  if (contactLinks.length === 0) return null;

  return (
    <div className="floating-contact-cta" aria-label="Contacto">
      {visibleFloatingMessages.length > 0 && (
        <div className="floating-contact-messages" aria-hidden="false">
          {visibleFloatingMessages.map((message, index) => (
            <button
              key={`${message}-${index}`}
              type="button"
              className="floating-contact-message"
              onClick={onOpenContactModal}
              aria-label={message}
              title="Abrir redes disponibles"
            >
              {message}
            </button>
          ))}
        </div>
      )}

      <button
        type="button"
        className="floating-contact-button"
        onClick={onOpenContactModal}
        aria-label="Contactame"
        title="Contactame"
      >
        <FaWhatsapp className={`floating-contact-button-icon ${isTypingIcon ? 'is-typing' : ''}`} />
        {isTypingIcon && (
          <span className="floating-contact-typing-dots" aria-hidden="true">
            <span></span><span></span><span></span>
          </span>
        )}
        <span>Contactame</span>
      </button>
    </div>
  );
}