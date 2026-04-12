import { useState, useEffect } from 'react';
import { API_FIREBASE } from '../data';
import '../styles/TinderCards.css';

export default function TinderCards() {
  const [users, setUsers] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [likedUsers, setLikedUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
    } finally {
      setLoading(false);
    }
  };

  const handleAction = (type: 'like' | 'dislike') => {
    if (currentIndex < users.length) {
      if (type === 'like') setLikedUsers([...likedUsers, users[currentIndex]]);
      if (currentIndex < users.length - 1) {
        setCurrentIndex(currentIndex + 1);
      } else {
        setCurrentIndex(users.length); // Finalizado
      }
    }
  };

  if (loading) return <div className="tinder-loading liquid-glass">Sincronizando perfiles...</div>;

  const isFinished = currentIndex >= users.length;

  return (
    <div className="tinder-page">
      <div className="tinder-bg-glow"></div>
      
      <div className="tinder-container">
        {!isFinished ? (
          <>
            <div className="tinder-header">
              <span className="tinder-badge">DESCUBRE TALENTO</span>
              <h2 className="tinder-counter">{currentIndex + 1} <span>/ {users.length}</span></h2>
            </div>

            <div className="tinder-stack">
              {users.slice(currentIndex, currentIndex + 1).map((user) => (
                <div key={user.id} className="tinder-card liquid-glass animate-in">
                  <div className="card-image-section">
                    {user.fotoPerfil ? (
                      <img src={user.fotoPerfil} alt={user.nombre} />
                    ) : (
                      <div className="avatar-placeholder">{user.nombre?.charAt(0)}</div>
                    )}
                    <div className="card-overlay-gradient"></div>
                  </div>
                  
                  <div className="card-info-section">
                    <h3 className="card-name">{user.nombre || user.user} <span className="age">24</span></h3>
                    <p className="card-alias">@{user.user_alias || user.user}</p>
                    <div className="card-meta">
                      <span>📍 {user.disponibleLugar || 'Disponible por confirmar'}</span>
                    </div>
                    <p className="card-bio">{user.info?.substring(0, 120) || "Sin descripción disponible."}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="tinder-controls">
              <button className="ctrl-btn btn-dislike" onClick={() => handleAction('dislike')}>✕</button>
              <button className="ctrl-btn btn-reset" onClick={() => setCurrentIndex(0)}>↺</button>
              <button className="ctrl-btn btn-like" onClick={() => handleAction('like')}>♥</button>
            </div>
          </>
        ) : (
          <div className="tinder-finished liquid-glass">
            <div className="icon">✨</div>
            <h2>¡Exploración terminada!</h2>
            <p>Has encontrado {likedUsers.length} perfiles interesantes.</p>
            <button className="btn-restart" onClick={() => {setCurrentIndex(0); setLikedUsers([]);}}>
              Volver a empezar
            </button>
          </div>
        )}
      </div>
    </div>
  );
}