import '../styles/PageSectionHeader.css';

interface PageSectionHeaderProps {
  title: string;
  accent?: string;
  description: string;
  compact?: boolean;
}

export default function PageSectionHeader({ title, accent, description, compact = false }: PageSectionHeaderProps) {
  return (
    <header className={`page-section-header ${compact ? 'is-compact' : ''}`}>
      <h1 className="page-section-title">
        {title}{' '}
        {accent ? <span className="page-section-title-accent">{accent}</span> : null}
      </h1>
      <p className="page-section-description">{description}</p>
    </header>
  );
}
