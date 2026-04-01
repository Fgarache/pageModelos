import '../styles/LoadingSkeleton.css';

export default function LoadingSkeleton() {
  return (
    <div className="modelos-grid">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="skeleton-card-visual liquid-glass-shimmer">
          {/* Espacio para la imagen grande */}
          <div className="skeleton-image-area"></div>
          
          {/* Espacio para la info inferior */}
          <div className="skeleton-info-overlay">
            <div className="skeleton-line-glass title"></div>
            <div className="skeleton-line-glass subtitle"></div>
            <div className="skeleton-footer-flex">
              <div className="skeleton-pill"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}