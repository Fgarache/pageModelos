import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { HOME_CONFIG } from '../data/homeData'; // Importas el nuevo archivo
import '../styles/HomePage.css';

export default function HomePage() {
  const navigate = useNavigate();
  const { style, content, slider, features } = HOME_CONFIG;
  const [sliderReady, setSliderReady] = useState(false);
  const [validImages, setValidImages] = useState<any[]>([]);

  useEffect(() => {
    let isMounted = true;

    const preloadImages = async () => {
      const uniqueUrls = Array.from(new Set(slider.images.map((img) => img.url).filter(Boolean)));

      const loadResults = await Promise.all(
        uniqueUrls.map(
          (url) =>
            new Promise<{ url: string; loaded: boolean }>((resolve) => {
              const image = new Image();
              image.src = url;
              image.onload = () => resolve({ url, loaded: true });
              image.onerror = () => resolve({ url, loaded: false });
            }),
        ),
      );

      // Filtrar solo las imágenes que cargaron correctamente
      const loadedUrls = new Set(loadResults.filter((r) => r.loaded).map((r) => r.url));
      const filtered = slider.images.filter((img) => loadedUrls.has(img.url));

      if (isMounted) {
        setValidImages(filtered.length > 0 ? filtered : slider.images);
        setSliderReady(true);
      }
    };

    const fallback = window.setTimeout(() => {
      if (isMounted) {
        setValidImages(slider.images);
        setSliderReady(true);
      }
    }, 2500);

    preloadImages();

    return () => {
      isMounted = false;
      window.clearTimeout(fallback);
    };
  }, [slider.images]);

  return (
    <div className="home-page">
      {/* Aplicamos claridad y contraste desde el archivo DATA */}
      <div className={`infinite-slider ${sliderReady ? 'is-ready' : 'is-loading'}`}>
        {!sliderReady && <div className="slider-loading-overlay" aria-hidden="true" />}
        <div className="slider-track" style={{ animationDuration: slider.speed }}>
          {validImages.length > 0 && [...validImages, ...validImages].map((img, i) => (
            <div key={i} className="slide">
              <img 
                src={img.url} 
                alt=""
                loading="eager"
                decoding="async"
                style={{ 
                  filter: `brightness(${style.backgroundBrightness}) contrast(${style.backgroundContrast})` 
                }} 
              />
            </div>
          ))}
        </div>
      </div>

      <div className="home-overlay-content">
        <header className="hero-text">
          <h1 className="hero-title" style={{ fontSize: style.heroTitleSize }}>
            <span className="hero-title-brand">
              <img src="/icons/logo.png" alt="LindasGT.com" className="hero-title-icon" />
              <span>
                {content.titlePart1}<span className="gold-glow">{content.titlePart2}</span>
              </span>
            </span>
          </h1>
          <p className="hero-tagline" style={{ letterSpacing: style.heroTaglineSpacing }}>
            {content.tagline}
          </p>
          <p className="hero-description">{content.description}</p>
        </header>

        <nav className="floating-nav-grid">
          {features.map((item) => (
            <button 
              key={item.id} 
              className="liquid-card" 
              onClick={() => navigate(item.path)}
              style={{ backdropFilter: `blur(${style.glassBlur}) saturate(180%)` }}
            >
              <span className="icon">{item.icon}</span>
              <div className="info">
                <h3>{item.title}</h3>
                <p>{item.subtitle}</p>
                <small>{item.desc}</small>
              </div>
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
}