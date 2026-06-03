import { useState, useEffect, useMemo } from 'react';

interface ProfileCarouselProps {
  user: any;
  gallery: Array<{ link?: string; titulo?: string; fecha?: string }>;
  hasTours: boolean;
  hasRifas: boolean;
  onScrollToServices: () => void;
  footerChipLabel: string;
}

// 1. FUNCIÓN PARA AHORRAR COSTOS (CDN)
// Reemplaza "tu_usuario" con tu ID de ImageKit cuando crees la cuenta.
// Si no lo cambias, simplemente devolverá la imagen original de Firebase.
const getOptimizedImage = (url: string | undefined) => {
  if (!url) return '';
  
  // Ejemplo de cómo activar ImageKit para no pagar ancho de banda en Firebase:
  // return url.replace('https://firebasestorage.googleapis.com', 'https://ik.imagekit.io/tu_usuario');
  
  return url; 
};

export default function ProfileCarousel({ user, gallery, hasTours, hasRifas, onScrollToServices, footerChipLabel }: ProfileCarouselProps) {
  const [activeSlide, setActiveSlide] = useState(0);
  const [slideDirection, setSlideDirection] = useState<'next' | 'prev'>('next');
  const servicios = user.servicios || [];
  const profileWatermark = user.user_alias ? `LindasGT.com/${user.user_alias}` : 'LindasGT.com';

  const preventImageActions = (event: React.SyntheticEvent) => {
    event.preventDefault();
  };

  // 2. LÓGICA DE 4 FOTOS MÁXIMO (ALEATORIAS)
  const slides = useMemo(() => {
    const seen = new Set<string>();
    
    // Filtramos la galería para quitar imágenes vacías, duplicadas o iguales a la foto de perfil
    const validGalleryImages = (gallery || []).filter((item) => {
      if (!item?.link || seen.has(item.link) || item.link === user.fotoPerfil) return false;
      seen.add(item.link);
      return true;
    });

    // Mezclamos la galería de forma aleatoria
    const shuffledGallery = [...validGalleryImages].sort(() => Math.random() - 0.5);

    const finalSlides = [];

    // Siempre intentamos poner la foto de perfil como la primera
    if (user.fotoPerfil) {
      finalSlides.push({ link: user.fotoPerfil, titulo: user.nombre });
      // Y agregamos hasta 3 fotos aleatorias más de la galería (Total = 4)
      finalSlides.push(...shuffledGallery.slice(0, 3));
    } else {
      // Si no tiene foto de perfil, tomamos hasta 4 aleatorias de la galería
      finalSlides.push(...shuffledGallery.slice(0, 4));
    }

    return finalSlides;
  }, [gallery, user.fotoPerfil, user.nombre]);

  useEffect(() => {
    if (slides.length <= 1) return;
    const intervalId = window.setInterval(() => {
      setSlideDirection('next');
      setActiveSlide((current) => (current + 1) % slides.length);
    }, 7000);
    return () => window.clearInterval(intervalId);
  }, [slides.length]);

  const goToPreviousSlide = () => {
    setSlideDirection('prev');
    setActiveSlide((current) => (current - 1 + slides.length) % slides.length);
  };

  const goToNextSlide = () => {
    setSlideDirection('next');
    setActiveSlide((current) => (current + 1) % slides.length);
  };

  const currentSlide = slides[activeSlide];

  return (
    <div className="profile-visual-panel" onContextMenu={preventImageActions}>
      {(hasTours || hasRifas || servicios.length > 0) && (
        <div className="profile-image-jump-nav">
          {hasTours && <a href="#detail-tours" className="profile-image-jump-link">Tours</a>}
          {hasRifas && <a href="#detail-rifas" className="profile-image-jump-link">Rifas</a>}
          {servicios.length > 0 && (
            <button type="button" className="profile-image-jump-link" onClick={onScrollToServices}>
              Servicios
            </button>
          )}
        </div>
      )}

      {currentSlide ? (
        <>
          {/* 3. OPTIMIZACIONES DE CARGA (Lazy y Async) */}
          <img
            key={currentSlide.link}
            src={getOptimizedImage(currentSlide.link)}
            alt={currentSlide.titulo || user.nombre}
            className={`profile-main-image profile-main-image--animated ${slideDirection === 'prev' ? 'profile-main-image--from-prev' : 'profile-main-image--from-next'}`}
            loading="lazy"
            decoding="async"
            draggable={false}
            onDragStart={preventImageActions}
            onContextMenu={preventImageActions}
          />
          <div className="profile-main-image-guard" aria-hidden="true" />
          <div className="profile-watermark">{profileWatermark}</div>

          {slides.length > 1 && (
            <div className="profile-carousel-controls">
              <button type="button" className="profile-carousel-button" onClick={goToPreviousSlide} aria-label="Foto anterior">‹</button>
              <button type="button" className="profile-carousel-button" onClick={goToNextSlide} aria-label="Foto siguiente">›</button>
            </div>
          )}
        </>
      ) : (
        <div className="profile-main-image profile-main-image--placeholder">{user.nombre?.charAt(0)}</div>
      )}

      <div className="profile-visual-footer">
        <div className="profile-visual-overlay">
          <span className={`profile-status-chip ${user.disponible ? 'is-available' : 'is-busy'}`}>
            {user.disponible ? footerChipLabel : 'Agenda cerrada'}
          </span>
        </div>
      </div>
    </div>
  );
}