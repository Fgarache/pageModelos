// src/components/ToursDisponibles.tsx
import { useState } from 'react';
import TourCard from './TourCard'; 

interface Props {
  tours: any[];
  user: any;
}

export default function ToursDisponibles({ tours, user }: Props) {
  if (!tours || tours.length === 0) return null;

  return (
    <section className="tours-section-wrapper">
      <style>
        {`
          .tours-section-wrapper {
            margin-top: 50px;
            width: 100%;
          }

          .tours-grid-4-cols {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 15px;
            width: 100%;
          }

          /* --- TARJETA VERTICAL --- */
          .tour-vertical-card {
            background: rgba(255, 255, 255, 0.03);
            backdrop-filter: blur(15px);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 25px;
            overflow: hidden;
            display: flex;
            flex-direction: column;
            transition: transform 0.3s ease, border-color 0.3s ease;
          }

          .tour-vertical-card:hover {
            transform: translateY(-5px);
            border-color: #d4af37;
          }

          /* Imagen Arriba */
          .tour-img-container {
            width: 100%;
            height: 180px;
            overflow: hidden;
            position: relative;
          }

          .tour-img-container img {
            width: 100%;
            height: 100%;
            object-fit: cover;
          }

          .tour-price-tag {
            position: absolute;
            top: 15px;
            right: 15px;
            background: rgba(0, 0, 0, 0.6);
            backdrop-filter: blur(5px);
            color: #d4af37;
            padding: 5px 12px;
            border-radius: 10px;
            font-weight: 800;
            font-size: 0.8rem;
            border: 1px solid rgba(212, 175, 55, 0.3);
          }

          /* Detalles Abajo */
          .tour-details-container {
            padding: 20px;
            flex-grow: 1;
            display: flex;
            flex-direction: column;
            gap: 8px;
          }

          .tour-title-text {
            font-size: 1rem;
            font-weight: 800;
            color: #fff;
            margin: 0;
            text-transform: uppercase;
          }

          .tour-location-text {
            font-size: 0.8rem;
            color: rgba(255, 255, 255, 0.5);
            font-weight: 500;
          }

          /* Botón y Horarios */
          .tour-actions-container {
            padding: 0 20px 20px;
            display: flex;
            flex-direction: column;
            gap: 10px;
          }

          .btn-reserve-tour {
            width: 100%;
            padding: 12px;
            background: #d4af37;
            color: #000;
            border: none;
            border-radius: 12px;
            font-weight: 800;
            font-size: 0.75rem;
            cursor: pointer;
            text-transform: uppercase;
            letter-spacing: 1px;
          }

          .btn-view-hours {
            background: transparent;
            border: 1px solid rgba(255, 255, 255, 0.1);
            color: rgba(255, 255, 255, 0.7);
            padding: 8px;
            border-radius: 10px;
            font-size: 0.7rem;
            cursor: pointer;
            transition: 0.3s;
          }

          .btn-view-hours.active {
            color: #d4af37;
            border-color: #d4af37;
            background: rgba(212, 175, 55, 0.05);
          }

          .horarios-list-mini {
            margin-top: 10px;
            display: flex;
            flex-wrap: wrap;
            gap: 5px;
            padding: 10px;
            background: rgba(255, 255, 255, 0.03);
            border-radius: 10px;
          }

          .hour-chip {
            font-size: 0.65rem;
            background: rgba(255, 255, 255, 0.05);
            padding: 4px 8px;
            border-radius: 5px;
            color: #fff;
          }

          /* RESPONSIVE */
          @media (max-width: 1024px) {
            .tours-grid-4-cols { grid-template-columns: repeat(3, 1fr); }
          }
          @media (max-width: 768px) {
            .tours-grid-4-cols { grid-template-columns: repeat(2, 1fr); gap: 10px; }
            .tour-img-container { height: 140px; }
            .tour-title-text { font-size: 0.85rem; }
          }
        `}
      </style>

      <h2 className="section-heading">
        TOURS <span className="gold-span">DISPONIBLES</span>
      </h2>

      <div className="tours-grid-4-cols">
        {tours.map((tour) => (
          <TourItem key={tour.id} tour={tour} user={user} />
        ))}
      </div>
    </section>
  );
}

/* Sub-componente interno para manejar el estado de los horarios */
function TourItem({ tour, user }: { tour: any, user: any }) {
  const [showHours, setShowHours] = useState(false);

  return (
    <div className="tour-vertical-card">
      <div className="tour-img-container">
        <img src={user.profile_pic || 'https://via.placeholder.com/300'} alt={tour.titulo} />
        <div className="tour-price-tag">Q{tour.deposito}</div>
      </div>

      <div className="tour-details-container">
        <h4 className="tour-title-text">{tour.titulo}</h4>
        <span className="tour-location-text">📍 {tour.lugar}</span>
      </div>

      <div className="tour-actions-container">
        <button className="btn-reserve-tour">Reservar Lugar</button>
        
        <button 
          className={`btn-view-hours ${showHours ? 'active' : ''}`} 
          onClick={() => setShowHours(!showHours)}
        >
          {showHours ? 'HORARIOS DISPONIBLES' : 'VER HORARIOS DISPONIBLES'}
        </button>

        {showHours && (
          <div className="horarios-list-mini fade-in">
             {/* Aquí mapearías los horarios reales si los pasas desde ModeloDetail */}
             <span className="hour-chip">10:00 AM</span>
             <span className="hour-chip">02:00 PM</span>
             <span className="hour-chip">06:00 PM</span>
          </div>
        )}
      </div>
    </div>
  );
}