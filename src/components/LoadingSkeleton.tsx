import '../styles/LoadingSkeleton.css';

export default function LoadingSkeleton() {
  return (
    <div className="modelos-grid">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="skeleton-card">
          <div className="skeleton-avatar"></div>
          <div className="skeleton-content">
            <div className="skeleton-line skeleton-title"></div>
            <div className="skeleton-line skeleton-text"></div>
            <div className="skeleton-line skeleton-text short"></div>
          </div>
        </div>
      ))}
    </div>
  );
}
