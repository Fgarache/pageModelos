// src/components/InformacionPerfil.tsx

interface Props {
  user: any;
  hasTours: boolean;
  hasRifas: boolean;
}

export default function InformacionPerfil({ user, hasTours, hasRifas }: Props) {
  if (!user) return null;

  const handleScroll = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleWhatsApp = () => {
    if (user.numero) {
      window.open(`https://wa.me/${user.numero}`, '_blank');
    }
  };

  return (
    <section className="profile-hero-section-compact">
      <style>
        {`
          .profile-hero-section-compact {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
            margin-bottom: 40px;
            width: 100%;
            max-width: 950px;
            margin-left: auto;
            margin-right: auto;
          }

          .hero-visual-card-mini {
            height: 400px;
            border-radius: 30px;
            position: relative;
            overflow: hidden;
            border: 1px solid rgba(255, 255, 255, 0.12);
            background: #0a0a0a;
            box-shadow: 0 10px 30px rgba(0,0,0,0.5);
          }

          .hero-main-img {
            width: 100%;
            height: 100%;
            object-fit: cover;
          }

          .hero-text-overlay-mini {
            position: absolute;
            bottom: 0;
            width: 100%;
            height: 70%;
            background: linear-gradient(to top, rgba(0,0,0,0.95) 15%, transparent 100%);
            padding: 25px;
            display: flex;
            flex-direction: column;
            justify-content: flex-end;
          }

          .hero-name-mini {
            font-size: 2.2rem;
            font-weight: 900;
            margin: 0;
            line-height: 1;
            color: #fff;
            text-transform: uppercase;
          }

          .hero-username-mini {
            color: #d4af37;
            font-size: 1rem;
            font-weight: 700;
            margin: 5px 0 15px;
          }

          /* --- BARRA DE ACCIONES RÁPIDAS --- */
          .quick-actions-bar {
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
            margin-top: 10px;
          }

          .action-chip {
            background: rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.1);
            color: white;
            padding: 6px 12px;
            border-radius: 12px;
            font-size: 0.7rem;
            font-weight: 700;
            cursor: pointer;
            display: flex;
            align-items: center;
            gap: 5px;
            transition: 0.3s;
            text-transform: uppercase;
          }

          .action-chip:hover {
            background: rgba(255, 255, 255, 0.2);
            transform: translateY(-2px);
          }

          .action-chip.whatsapp {
            background: #25d36622;
            border-color: #25d36644;
            color: #25d366;
          }

          .action-chip.whatsapp:hover {
            background: #25d366;
            color: white;
          }

          /* --- INFO CARD --- */
          .hero-info-card-mini {
            background: rgba(255, 255, 255, 0.02);
            backdrop-filter: blur(20px);
            border: 1px solid rgba(255, 255, 255, 0.08);
            border-radius: 30px;
            padding: 30px;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
          }

          .gold-label-mini {
            display: block;
            color: #d4af37;
            font-size: 0.65rem;
            letter-spacing: 2px;
            font-weight: 800;
            margin-bottom: 8px;
            text-transform: uppercase;
          }

          .bio-text-mini {
            font-size: 0.9rem;
            line-height: 1.5;
            color: rgba(255, 255, 255, 0.7);
          }

          .sub-box-mini {
            background: rgba(255, 255, 255, 0.03);
            padding: 15px;
            border-radius: 18px;
            margin-top: 10px;
            border: 1px solid rgba(255, 255, 255, 0.05);
          }

          .sub-box-mini p {
            margin: 0;
            font-size: 0.9rem;
            font-weight: 600;
            color: #fff;
          }

          @media (max-width: 850px) {
            .profile-hero-section-compact { grid-template-columns: 1fr; }
          }
        `}
      </style>

      {/* PARTE VISUAL */}
      <div className="hero-visual-card-mini">
        {user.profile_pic ? (
          <img src={user.profile_pic} alt={user.nombre} className="hero-main-img" />
        ) : (
          <div className="hero-placeholder" style={{fontSize: '5rem'}}>{user.nombre?.charAt(0)}</div>
        )}
        <div className="hero-text-overlay-mini">
          <h1 className="hero-name-mini">{user.nombre}</h1>
          <p className="hero-username-mini">@{user.user_alias}</p>
          
          <div className="quick-actions-bar">
            {user.disponibleLugar && (
              <div className="action-chip" style={{cursor: 'default', background: 'rgba(255,255,255,0.05)'}}>
                📍 {user.disponibleLugar}
              </div>
            )}

            {hasTours && (
              <button className="action-chip" onClick={() => handleScroll('seccion-tours')}>
                🎫 Tours
              </button>
            )}

            {hasRifas && (
              <button className="action-chip" onClick={() => handleScroll('seccion-rifas')}>
                🎰 Rifas
              </button>
            )}

            {user.numero && (
              <button className="action-chip whatsapp" onClick={handleWhatsApp}>
                💬 Agendar
              </button>
            )}
          </div>
        </div>
      </div>

      {/* PARTE INFO */}
      <div className="hero-info-card-mini">
        <div className="info-section">
          <span className="gold-label-mini">Bio</span>
          <p className="bio-text-mini">{user.info || "Perfil verificado."}</p>
        </div>

        <div className="info-footer">
          <div className="sub-box-mini">
            <span className="gold-label-mini">Pagos</span>
            <p>💳 {user.metodosPago || "Efectivo / Transferencia"}</p>
          </div>
          <div className="sub-box-mini">
            <span className="gold-label-mini">Ubicación</span>
            <p>🌍 {user.lugarTours || "Consultar disponibilidad"}</p>
          </div>
        </div>
      </div>
    </section>
  );
}