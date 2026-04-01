import { useNavigate } from 'react-router-dom';
import '../styles/HomePage.css';

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="home-page">
      <div className="home-container">
        <div className="home-hero">
          <h1 className="home-title">✨ PageModelos</h1>
          <p className="home-subtitle">
            Descubre los mejores modelos disponibles
          </p>
          <p className="home-description">
            Explora nuestro catálogo de modelos profesionales, tours disponibles
            y mucho más.
          </p>
        </div>

        <div className="home-features">
          <div 
            className="feature-card"
            onClick={() => navigate('/modelos')}
            style={{ cursor: 'pointer' }}
          >
            <div className="feature-icon">👥</div>
            <h3>Modelos Disponibles</h3>
            <p>Explora nuestro catálogo de modelos profesionales</p>
          </div>

          <div 
            className="feature-card"
            onClick={() => navigate('/tours')}
            style={{ cursor: 'pointer' }}
          >
            <div className="feature-icon">✈️</div>
            <h3>Tours Exclusivos</h3>
            <p>Reserva tours con tus modelos favoritos</p>
          </div>

          <div 
            className="feature-card"
            onClick={() => navigate('/rifas')}
            style={{ cursor: 'pointer' }}
          >
            <div className="feature-icon">🎰</div>
            <h3>Rifas Especiales</h3>
            <p>Participa en nuestras rifas y gana premios</p>
          </div>
        </div>

        <div className="home-cta">
          <a href="/modelos" className="cta-button">
            Explorar Modelos →
          </a>
        </div>
      </div>
    </div>
  );
}
