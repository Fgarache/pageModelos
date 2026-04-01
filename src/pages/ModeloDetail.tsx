import { useParams, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { API_FIREBASE } from '../data';
import DetailSkeletonLoader from '../components/DetailSkeletonLoader';
import TourCard from '../components/TourCard';
import RifaCard from '../components/RifaCard';
import '../styles/ModeloDetail.css';

interface User {
  id: string;
  user_alias: string;
  nombre: string;
  numero?: number;
  disponibleLugar?: string;
  info?: string;
  metodosPago?: string;
  lugarTours?: string;
}

interface Tour {
  id: string;
  lugar: string;
  titulo: string;
  deposito: number;
  fecha: string;
  estado: boolean;
  lugarAtencion: string;
  detalles: string;
}

interface Rifa {
  idRifa: string;
  titulo: string;
  premio: string;
  precio: number;
  numerosTotales: number;
  estado: boolean;
  fechaSorteo: string;
  numerosDisponibles: number[];
  cantidadLibre: number;
}

export default function ModeloDetail() {
  const { user: userParam } = useParams();
  const [user, setUser] = useState<User | null>(null);
  const [tours, setTours] = useState<Tour[]>([]);
  const [rifas, setRifas] = useState<Rifa[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, [userParam]);

  const fetchData = async () => {
    try {
      setLoading(true);
      if (!userParam) {
        setError('Usuario no válido');
        return;
      }

      // Obtener todos los usuarios para encontrar por user_alias
      const allUsers = await API_FIREBASE.getAllUsers();
      const foundUser = allUsers.find((u: User) => u.user_alias === userParam);

      if (!foundUser) {
        setError('Usuario no encontrado');
        return;
      }

      const userId = foundUser.id;
      setUser(foundUser);

      // Hacer todos los fetches en paralelo después de encontrar el usuario
      const [userData, toursData, rifasData] = await Promise.all([
        API_FIREBASE.getUserInfo(userId),
        API_FIREBASE.getTours(userId),
        API_FIREBASE.getRifas(userId),
      ]);

      setUser(userData);
      setTours(Array.isArray(toursData) ? toursData : []);
      setRifas(Array.isArray(rifasData) ? rifasData : []);
    } catch (err) {
      setError('Error al cargar los detalles del modelo');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="modelo-detail">
        <div className="detail-container">
          <Link to="/modelos" className="back-link">
            ← Volver a Modelos
          </Link>
          <DetailSkeletonLoader />
        </div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="modelo-detail">
        <div className="detail-container">
          <div className="error-state">
            <p className="error-text">{error || 'Modelo no encontrado'}</p>
            <Link to="/modelos" className="back-button">
              ← Volver a Modelos
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="modelo-detail">
      <div className="detail-container">
        {/* Header con botón de volver */}
        <Link to="/modelos" className="back-link">
          ← Volver a Modelos
        </Link>

        {/* Sección principal */}
        <div className="detail-main">
          <div className="detail-avatar-section">
            <div className="detail-avatar-container">
              <div className="detail-avatar">
                {user.nombre?.charAt(0).toUpperCase() ||
                  user.user_alias?.charAt(0).toUpperCase() ||
                  'U'}
              </div>
            </div>
          </div>

          <div className="detail-info-section">
            <h1 className="detail-title">{user.nombre || user.user_alias}</h1>
            <p className="detail-username">@{user.user_alias}</p>

            {user.disponibleLugar && (
              <p className="detail-location">📍 {user.disponibleLugar}</p>
            )}

            {user.numero && (
              <p className="detail-phone">📞 {user.numero}</p>
            )}

            {user.info && (
              <div className="detail-bio">
                <h3>Acerca de</h3>
                <p>{user.info}</p>
              </div>
            )}

            {user.metodosPago && (
              <div className="detail-payment">
                <h3>Métodos de Pago</h3>
                <p>💳 {user.metodosPago}</p>
              </div>
            )}

            {user.lugarTours && (
              <div className="detail-lugares">
                <h3>Lugares de Tours</h3>
                <p>🌍 {user.lugarTours}</p>
              </div>
            )}
          </div>
        </div>

        {/* Tours Section */}
        {tours.length > 0 && (
          <div className="detail-section">
            <h2>🎫 Tours Disponibles</h2>
            <div className="tours-grid">
              {tours.map((tour) => (
                <TourCard
                  key={tour.id}
                  tour={tour}
                  nombreModelo={user.nombre}
                  userAlias={user.user_alias}
                />
              ))}
            </div>
          </div>
        )}

        {/* Rifas Section */}
        {rifas.length > 0 && (
          <div className="detail-section">
            <h2>🎰 Rifas y Sorteos</h2>
            <div className="rifas-section">
              {rifas.map((rifa) => (
                <RifaCard
                  key={rifa.idRifa}
                  rifa={{
                    idRifa: rifa.idRifa,
                    titulo: rifa.titulo,
                    premio: rifa.premio,
                    precio: rifa.precio,
                    numerosTotales: rifa.numerosTotales,
                    estado: rifa.estado,
                    fechaSorteo: rifa.fechaSorteo,
                    numerosDisponibles: rifa.numerosDisponibles,
                  }}
                  nombreModelo={user.nombre}
                  userAlias={user.user_alias}
                />
              ))}
            </div>
          </div>
        )}

        {/* Empty states */}
        {tours.length === 0 && rifas.length === 0 && (
          <div className="empty-sections">
            <p>No hay tours o rifas disponibles en este momento</p>
          </div>
        )}
      </div>
    </div>
  );
}
