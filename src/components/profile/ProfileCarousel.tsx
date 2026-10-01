import { useState, useEffect, useMemo } from 'react';

interface ProfileCarouselProps {
  user: any;
  gallery: Array<{ link?: string; titulo?: string; fecha?: string }>;
  footerChipLabel?: string;
  isAvailableToday?: boolean;
  vistas?: number;
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

export default function ProfileCarousel({ user, gallery, footerChipLabel = '', isAvailableToday, vistas }: ProfileCarouselProps) {
  const [activeSlide, setActiveSlide] = useState(0);
  const [slideDirection, setSlideDirection] = useState<'next' | 'prev'>('next');

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
      {vistas !== undefined && vistas >= 0 && (
        <div className="profile-views-badge" style={{ position: 'absolute', top: '16px', right: '16px', background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', color: '#fff', padding: '6px 12px', borderRadius: '20px', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', fontWeight: 600, zIndex: 10 }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
          {vistas}
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
              <button type="button" className="profile-carousel-button" onClick={goToPreviousSlide} aria-label="Foto anterior" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)', borderRadius: '50%', width: '38px', height: '38px', padding: 0, color: 'rgba(255,255,255,0.9)' }}><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg></button>
              <button type="button" className="profile-carousel-button" onClick={goToNextSlide} aria-label="Foto siguiente" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)', borderRadius: '50%', width: '38px', height: '38px', padding: 0, color: 'rgba(255,255,255,0.9)' }}><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg></button>
            </div>
          )}
        </>
      ) : (
        <div className="profile-main-image profile-main-image--placeholder">{user.nombre?.charAt(0)}</div>
      )}

      <div className="profile-visual-footer">
        <div className="profile-visual-overlay">
          <span className={`profile-status-chip ${(isAvailableToday ?? user.disponible) ? 'is-available' : 'is-busy'}`}>
            {footerChipLabel || ((isAvailableToday ?? user.disponible) ? 'Disponible' : 'No disponible')}
          </span>
        </div>
      </div>
    </div>
  );
}