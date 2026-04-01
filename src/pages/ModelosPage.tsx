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
}

export default function ModelosPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const abortController = new AbortController();

    const fetchUsers = async () => {
      try {
        setLoading(true);
        const data = await API_FIREBASE.getAllUsers();
        setUsers(Array.isArray(data) ? data : []);
        setError(null);
      } catch (err) {
        if (err instanceof Error && err.name !== 'AbortError') {
          setError('Error al cargar los modelos. Intenta de nuevo.');
          console.error(err);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();

    return () => abortController.abort();
  }, []);

  if (loading) {
    return (
      <div className="modelos-page">
        <div className="modelos-container">
          <div className="modelos-header">
            <h1>Nuestros Modelos Disponibles</h1>
            <p>Selecciona un modelo para ver más detalles</p>
          </div>
          <LoadingSkeleton />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="modelos-page error-page">
        <div className="error-message">
          <p>{error}</p>
          <button onClick={() => window.location.reload()} className="retry-button">
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="modelos-page">
      <div className="modelos-container">
        <div className="modelos-header">
          <h1>Nuestros Modelos Disponibles</h1>
          <p>Selecciona un modelo para ver más detalles</p>
        </div>

        <div className="modelos-grid">
          {users.map((user) => (
            <Link
              key={user.id}
              to={`/${user.user_alias}`}
              className="modelo-card-link"
            >
              <div className="modelo-card">
                <div className="modelo-avatar-container">
                  <div className="modelo-avatar">
                    {user.nombre?.charAt(0).toUpperCase() ||
                      user.user_alias?.charAt(0).toUpperCase() ||
                      'U'}
                  </div>
                  <span className="online-badge">●</span>
                </div>

                <div className="modelo-card-content">
                  <h3 className="modelo-name">{user.nombre || user.user_alias}</h3>
                  <p className="modelo-username">@{user.user_alias}</p>

                  {user.disponibleLugar && (
                    <p className="modelo-location">📍 {user.disponibleLugar}</p>
                  )}

                  {user.info && (
                    <p className="modelo-bio">{user.info.substring(0, 80)}...</p>
                  )}

                  <div className="modelo-card-footer">
                    <span className="view-details">Ver detalles →</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {users.length === 0 && (
          <div className="empty-state">
            <p>No hay modelos disponibles en este momento</p>
          </div>
        )}
      </div>
    </div>
  );
}
