import React from 'react';
import '../styles/ModeloDetail.css'; // Reutilizamos estilos de detalle para coherencia

interface Grupo {
  titulo: string;
  link: string;
}

interface Redes {
  whatsapp: string;
  telegram: string;
  instagram: string;
  facebook: string;
  x: string;
}

interface UserProps {
  user: {
    nombre: string;
    user_alias?: string;
    fotoPerfil: string;
    verificado: boolean;
    info?: string;
    disponible?: boolean;
    disponibleLugar?: string;
    numero?: string;
    metodosPago?: string;
    redes?: Redes;
    grupos?: Grupo[];
  };
}

const InformacionPerfil: React.FC<UserProps> = ({ user }) => {
  return (
    <div className="informacion-perfil-card">
      <div className="perfil-header">
        <div className="avatar-container">
          <img 
            src={user.fotoPerfil} 
            alt={user.nombre} 
            className={`perfil-avatar ${user.verificado ? 'border-verified' : ''}`} 
          />
          {user.verificado && (
            <span className="badge-verificado" title="Perfil Verificado">
              <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
                <path d="M23,12L20.56,9.22L20.9,5.54L17.29,4.72L15.4,1.54L12,3L8.6,1.54L6.71,4.72L3.1,5.53L3.44,9.21L1,12L3.44,14.78L3.1,18.47L6.71,19.29L8.6,22.47L12,21L15.4,22.46L17.29,19.28L20.9,18.46L20.56,14.78L23,12M10,17L6,13L7.41,11.59L10,14.17L16.59,7.58L18,9L10,17Z" />
              </svg>
            </span>
          )}
        </div>

        <div className="perfil-nombres">
          <h2>{user.nombre}</h2>
          {user.user_alias && <p className="alias">@{user.user_alias}</p>}
          <span className={`status-tag ${user.disponible ? 'online' : 'offline'}`}>
            {user.disponible ? `Disponible en ${user.disponibleLugar || 'Cualquier lugar'}` : 'No disponible'}
          </span>
        </div>
      </div>

      <div className="perfil-body">
        {user.info && (
          <div className="info-section">
            <p className="bio-text">{user.info}</p>
          </div>
        )}

        {/* REDES SOCIALES - Solo se muestran si el campo no está vacío */}
        <div className="redes-sociales-grid">
          {user.redes?.whatsapp && (
            <a href={user.redes.whatsapp} target="_blank" rel="noreferrer" className="red-link wa">WhatsApp</a>
          )}
          {user.redes?.telegram && (
            <a href={user.redes.telegram} target="_blank" rel="noreferrer" className="red-link tg">Telegram</a>
          )}
          {user.redes?.instagram && (
            <a href={user.redes.instagram} target="_blank" rel="noreferrer" className="red-link ig">Instagram</a>
          )}
          {user.redes?.x && (
            <a href={user.redes.x} target="_blank" rel="noreferrer" className="red-link x">X (Twitter)</a>
          )}
          {user.redes?.facebook && (
            <a href={user.redes.facebook} target="_blank" rel="noreferrer" className="red-link fb">Facebook</a>
          )}
        </div>

        {/* GRUPOS Y CANALES */}
        {user.grupos && user.grupos.length > 0 && (
          <div className="grupos-section">
            <h4>Grupos y Canales:</h4>
            <div className="grupos-list">
              {user.grupos.map((grupo, idx) => (
                <a key={idx} href={grupo.link} target="_blank" rel="noreferrer" className="btn-grupo">
                  🔗 {grupo.titulo}
                </a>
              ))}
            </div>
          </div>
        )}

        <div className="detalles-adicionales">
          {user.metodosPago && (
            <p><strong>Pagos:</strong> {user.metodosPago}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default InformacionPerfil;