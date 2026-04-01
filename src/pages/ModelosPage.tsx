import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { API_FIREBASE } from '../data';
import LoadingSkeleton from '../components/LoadingSkeleton';
import '../styles/ModelosPage.css';

interface User {
  id: string;
  user_alias: string;
  nombre: string;
  disponibleLugar?: string;
  info?: string;
  profile_pic?: string; // Añadimos campo para foto
}

export default function ModelosPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const data = await API_FIREBASE.getAllUsers();
        setUsers(Array.isArray(data) ? data : []);
        setError(null);
      } catch (err) {
        setError('Error al cargar los modelos. Intenta de nuevo.');
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  if (loading) return <div className="modelos-page"><LoadingSkeleton /></div>;

  return (
    <div className="modelos-page">
      <div className="bg-glow"></div>
      
      <div className="modelos-container">
        <header className="modelos-header">
          <h1 className="title-glow">CATÁLOGO <span className="gold">EXCLUSIVO</span></h1>
          <p className="subtitle">Descubre el talento verificado de PageModelos</p>
        </header>

        <div className="modelos-grid">
          {users.map((user) => (
            <Link key={user.id} to={`/${user.user_alias}`} className="modelo-card-link">
              <div className="modelo-card liquid-glass">
                <div className="modelo-image-wrapper">
                  {user.profile_pic ? (
                    <img src={user.profile_pic} alt={user.nombre} className="modelo-img" />
                  ) : (
                    <div className="modelo-avatar-placeholder">
                      {user.nombre?.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div className="status-badge">DISPONIBLE</div>
                </div>

                <div className="modelo-info-glass">
                  <h3 className="modelo-name">{user.nombre || user.user_alias}</h3>
                  <div className="modelo-meta">
                    <span className="location">📍 {user.disponibleLugar || 'Consultar'}</span>
                  </div>
                  <p className="modelo-bio-short">
                    {user.info ? `${user.info.substring(0, 60)}...` : 'Sin descripción disponible.'}
                  </p>
                  <div className="modelo-card-footer">
                    <span className="btn-details">VER PERFIL</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {users.length === 0 && (
          <div className="empty-state liquid-glass">
            <p>No hay modelos disponibles en este momento.</p>
          </div>
        )}
      </div>
    </div>
  );
}