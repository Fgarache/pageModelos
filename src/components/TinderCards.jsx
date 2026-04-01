import { useState, useEffect } from 'react';
import { API_FIREBASE } from '../data';
import '../styles/TinderCards.css';

export default function TinderCards() {
  const [users, setUsers] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [likedUsers, setLikedUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await API_FIREBASE.getAllUsers();
      setUsers(data);
    } catch (err) {
      setError('Error al cargar los usuarios');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = () => {
    if (currentIndex < users.length) {
      setLikedUsers([...likedUsers, users[currentIndex]]);
    }
    handleNext();
  };

  const handleDislike = () => {
    handleNext();
  };

  const handleNext = () => {
    if (currentIndex < users.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleReset = () => {
    setCurrentIndex(0);
    setLikedUsers([]);
  };

  if (loading) {
    return <div className="tinder-container loading">Cargando usuarios...</div>;
  }

  if (error) {
    return <div className="tinder-container error">{error}</div>;
  }

  if (users.length === 0) {
    return <div className="tinder-container empty">No hay usuarios disponibles</div>;
  }

  const currentUser = users[currentIndex];
  const isLastCard = currentIndex === users.length - 1;

  return (
    <div className="tinder-container">
      {/* Vista Móvil */}
      <div className="tinder-mobile">
        <div className="mobile-header">
          <h2>Descubre</h2>
          <span className="card-counter">
            {currentIndex + 1} / {users.length}
          </span>
        </div>

        <div className="tinder-stack">
          {users.slice(currentIndex, currentIndex + 2).map((user, idx) => (
            <div
              key={user.id}
              className={`tinder-card ${idx === 0 ? 'active' : 'next'}`}
            >
              <div className="card-content">
                <div className="card-image-placeholder">
                  <div className="user-avatar">
                    {user.nombre?.charAt(0).toUpperCase() || 'U'}
                  </div>
                </div>
                <div className="card-info">
                  <h3 className="card-name">{user.nombre || user.user}</h3>
                  <p className="card-username">@{user.user}</p>
                  {user.disponibleLugar && (
                    <p className="card-location">📍 {user.disponibleLugar}</p>
                  )}
                  {user.info && <p className="card-bio">{user.info}</p>}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="tinder-buttons">
          <button
            className="btn btn-dislike"
            onClick={handleDislike}
            aria-label="No me gusta"
          >
            ✕
          </button>
          <button
            className="btn btn-reset"
            onClick={handleReset}
            title="Reiniciar"
            aria-label="Reiniciar"
          >
            ↺
          </button>
          <button
            className="btn btn-like"
            onClick={handleLike}
            aria-label="Me gusta"
          >
            ♥
          </button>
        </div>

        {isLastCard && likedUsers.length > 0 && (
          <div className="completion-message">
            ¡Hiciste {likedUsers.length} match{likedUsers.length > 1 ? 'es' : ''}!
          </div>
        )}
      </div>

      {/* Vista Web */}
      <div className="tinder-web">
        <div className="web-header">
          <h2>Todos los modelos disponibles</h2>
          <p className="total-count">Total: {users.length} usuarios</p>
        </div>

        <div className="users-grid">
          {users.map((user) => (
            <div key={user.id} className="user-card">
              <div className="user-card-image">
                <div className="user-avatar-large">
                  {user.nombre?.charAt(0).toUpperCase() ||
                    user.user?.charAt(0).toUpperCase() ||
                    'U'}
                </div>
              </div>
              <div className="user-card-body">
                <h3 className="user-card-name">{user.nombre || user.user}</h3>
                <p className="user-card-username">@{user.user}</p>
                {user.disponibleLugar && (
                  <p className="user-card-location">📍 {user.disponibleLugar}</p>
                )}
                {user.info && <p className="user-card-bio">{user.info}</p>}
                {user.metodosPago && (
                  <p className="user-card-payment">💳 {user.metodosPago}</p>
                )}
              </div>
              <div className="user-card-footer">
                <button className="btn-sm btn-like-sm">Me gusta</button>
              </div>
            </div>
          ))}
        </div>

        <div className="web-footer">
          <p>{likedUsers.length > 0 ? `${likedUsers.length} Me gusta` : ''}</p>
        </div>
      </div>
    </div>
  );
}
