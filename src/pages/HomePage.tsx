import { useNavigate } from 'react-router-dom';
import { HOME_CONFIG } from '../data/homeData'; // Importas el nuevo archivo
import '../styles/HomePage.css';

export default function HomePage() {
  const navigate = useNavigate();
  const { style, content, slider, features } = HOME_CONFIG;

  return (
    <div className="home-page">
      {/* Aplicamos claridad y contraste desde el archivo DATA */}
      <div className="infinite-slider">
        <div className="slider-track" style={{ animationDuration: slider.speed }}>
          {[...slider.images, ...slider.images].map((img, i) => (
            <div key={i} className="slide">
              <img 
                src={img.url} 
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
            {content.titlePart1}<span className="gold-glow">{content.titlePart2}</span>
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