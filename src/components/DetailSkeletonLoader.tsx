import '../styles/DetailSkeletonLoader.css';

export default function DetailSkeletonLoader() {
  return (
    <div className="detail-skeleton">
      <div className="detail-skeleton-main">
        <div className="skeleton-avatar-detail"></div>

        <div className="skeleton-info">
          <div className="skeleton-line skeleton-title-detail"></div>
          <div className="skeleton-line skeleton-text-detail"></div>
          <div className="skeleton-line skeleton-text-detail short"></div>
          <div className="skeleton-divider"></div>
          <div className="skeleton-line skeleton-text-detail"></div>
          <div className="skeleton-line skeleton-text-detail"></div>
        </div>
      </div>

      <div className="detail-skeleton-section">
        <div className="skeleton-line skeleton-heading"></div>
        <div className="skeleton-card-detail"></div>
        <div className="skeleton-card-detail"></div>
      </div>
    </div>
  );
}
