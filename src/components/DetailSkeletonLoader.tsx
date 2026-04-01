import '../styles/DetailSkeletonLoader.css';

export default function DetailSkeletonLoader() {
  return (
    <div className="detail-skeleton-page">
      <div className="detail-skeleton-container">
        {/* Cabecera del Perfil */}
        <div className="skeleton-hero liquid-glass-skeleton">
          <div className="skeleton-avatar-circle"></div>
          <div className="skeleton-text-group">
            <div className="skeleton-line title"></div>
            <div className="skeleton-line subtitle"></div>
          </div>
        </div>

        {/* Sección de Info / Bio */}
        <div className="detail-skeleton-section">
          <div className="skeleton-line heading"></div>
          <div className="skeleton-line body-text"></div>
          <div className="skeleton-line body-text short"></div>
        </div>

        {/* Grid de Tarjetas (Tours/Rifas) */}
        <div className="detail-skeleton-grid">
          <div className="skeleton-card-visual liquid-glass-skeleton"></div>
          <div className="skeleton-card-visual liquid-glass-skeleton"></div>
          <div className="skeleton-card-visual liquid-glass-skeleton"></div>
        </div>
      </div>
    </div>
  );
}