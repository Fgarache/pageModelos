// src/components/RifasDisponibles.tsx
import { useState } from 'react';

interface Props {
  rifas: any[];
  user: any;
}

export default function RifasDisponibles({ rifas, user }: Props) {
  if (!rifas || rifas.length === 0) return null;

  return (
    <section className="rifas-section-wrapper">
      <style>
        {`
          .rifas-section-wrapper {
            margin-top: 50px;
            width: 100%;
          }

          .rifas-stack-full {
            display: flex;
            flex-direction: column;
            gap: 25px;
            width: 100%;
          }

          /* --- TARJETA DE RIFA (ANCHO COMPLETO) --- */
          .rifa-full-card {
            position: relative;
            width: 100%;
            border-radius: 35px;
            overflow: hidden;
            background: #111;
            border: 1px solid rgba(255, 255, 255, 0.1);
            display: flex;
            flex-direction: column;
            box-shadow: 0 20px 40px rgba(0,0,0,0.5);
            transition: border-color 0.3s ease;
          }

          .rifa-full-card:hover {
            border-color: rgba(212, 175, 55, 0.4);
          }

          /* Imagen de Fondo */
          .rifa-visual-bg {
            position: absolute;
            top: 0; left: 0; width: 100%; height: 100%;
            z-index: 1;
          }
          .rifa-img {
            width: 100%; height: 100%;
            object-fit: cover;
            filter: brightness(0.35) contrast(1.1);
          }
          .rifa-overlay {
            position: absolute;
            bottom: 0; width: 100%; height: 100%;
            background: linear-gradient(to top, rgba(0,0,0,1) 10%, transparent 90%);
          }

          /* Contenido de la Rifa */
          .rifa-main-content {
            position: relative;
            z-index: 2;
            padding: 35px;
            display: flex;
            justify-content: space-between;
            align-items: center;
          }

          .rifa-titles h3 { font-size: 1.8rem; margin: 0; color: #fff; text-transform: uppercase; }
          .rifa-titles p { color: #d4af37; font-weight: 700; margin: 8px 0 0; font-size: 1.1rem; }

          .rifa-side-info {
            text-align: right;
            display: flex;
            flex-direction: column;
            gap: 15px;
            align-items: flex-end;
          }

          .rifa-price-tag {
            background: rgba(212, 175, 55, 0.1);
            backdrop-filter: blur(10px);
            padding: 12px 25px;
            border-radius: 20px;
            border: 1px solid rgba(212, 175, 55, 0.3);
          }
          .price-val { display: block; font-size: 1.6rem; font-weight: 900; color: #d4af37; }
          .price-lbl { font-size: 0.6rem; letter-spacing: 2px; color: #fff; opacity: 0.7; }

          /* Botón Mostrar Números */
          .btn-toggle-numbers {
            background: rgba(255, 255, 255, 0.05);
            border: 1px solid rgba(255, 255, 255, 0.1);
            color: #fff;
            padding: 10px 20px;
            border-radius: 50px;
            font-size: 0.75rem;
            font-weight: 800;
            cursor: pointer;
            text-transform: uppercase;
            letter-spacing: 1px;
            transition: 0.3s;
          }
          .btn-toggle-numbers.active {
            background: #d4af37;
            color: #000;
            border-color: #d4af37;
          }

          /* Cuadrícula Desplegable */
          .rifa-numbers-drawer {
            position: relative;
            z-index: 2;
            padding: 0 35px 35px;
            animation: slideDown 0.4s cubic-bezier(0.23, 1, 0.32, 1);
          }

          @keyframes slideDown {
            from { opacity: 0; transform: translateY(-10px); }
            to { opacity: 1; transform: translateY(0); }
          }

          .numbers-grid-compact {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(42px, 1fr));
            gap: 8px;
            background: rgba(255, 255, 255, 0.03);
            padding: 20px;
            border-radius: 25px;
            border: 1px solid rgba(255, 255, 255, 0.05);
          }

          .num-ball {
            aspect-ratio: 1;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 12px;
            font-size: 0.8rem;
            font-weight: 800;
          }
          .num-ball.free { background: rgba(212, 175, 55, 0.1); border: 1px solid rgba(212, 175, 55, 0.3); color: #fff; }
          .num-ball.taken { background: rgba(255,255,255,0.02); color: rgba(255,255,255,0.1); text-decoration: line-through; border: 1px solid rgba(255,255,255,0.03); }

          @media (max-width: 768px) {
            .rifa-main-content { flex-direction: column; align-items: flex-start; gap: 20px; padding: 25px; }
            .rifa-side-info { align-items: flex-start; text-align: left; width: 100%; }
            .rifa-titles h3 { font-size: 1.4rem; }
            .numbers-grid-compact { grid-template-columns: repeat(5, 1fr); }
            .rifa-numbers-drawer { padding: 0 25px 25px; }
          }
        `}
      </style>

      <h2 className="section-heading">
        SORTEOS <span className="gold-span">ACTIVOS</span>
      </h2>

      <div className="rifas-stack-full">
        {rifas.map((rifa) => (
          <RifaItem key={rifa.idRifa} rifa={rifa} user={user} />
        ))}
      </div>
    </section>
  );
}

/* Sub-componente interno para manejar el despliegue de cada rifa */
function RifaItem({ rifa, user }: { rifa: any, user: any }) {
  const [showNumbers, setShowNumbers] = useState(false);
  const todos = Array.from({ length: rifa.numerosTotales }, (_, i) => i + 1);

  return (
    <div className="rifa-full-card">
      <div className="rifa-visual-bg">
        <img src={user.fotoPerfil || 'https://via.placeholder.com/800'} alt="bg" className="rifa-img" />
        <div className="rifa-overlay"></div>
      </div>

      <div className="rifa-main-content">
        <div className="rifa-titles">
          <h3>{rifa.titulo}</h3>
          <p>🎁 PREMIO: {rifa.premio}</p>
        </div>

        <div className="rifa-side-info">
          <div className="rifa-price-tag">
            <span className="price-lbl">VALOR BOLETO</span>
            <span className="price-val">Q{rifa.precio}</span>
          </div>
          <button 
            className={`btn-toggle-numbers ${showNumbers ? 'active' : ''}`}
            onClick={() => setShowNumbers(!showNumbers)}
          >
            {showNumbers ? 'NÚMEROS Disponibles' : 'MOSTRAR NÚMEROS'}
          </button>
        </div>
      </div>

      {showNumbers && (
        <div className="rifa-numbers-drawer">
          <div className="numbers-grid-compact">
            {todos.map((num) => {
              const isLibre = rifa.numerosDisponibles?.includes(num);
              return (
                <div key={num} className={`num-ball ${isLibre ? 'free' : 'taken'}`}>
                  {num}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}