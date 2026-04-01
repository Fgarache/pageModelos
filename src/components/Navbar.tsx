import { Link, useLocation } from 'react-router-dom';
import '../styles/Navbar.css';

export default function Navbar() {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          ✨ PageModelos
        </Link>

        <ul className="nav-menu">
          <li className="nav-item">
            <Link
              to="/"
              className={`nav-link ${isActive('/') ? 'active' : ''}`}
            >
              Home
            </Link>
          </li>
          <li className="nav-item">
            <Link
              to="/modelos"
              className={`nav-link ${isActive('/modelos') ? 'active' : ''}`}
            >
              Modelos
            </Link>
          </li>
          <li className="nav-item">
            <Link
              to="/tours"
              className={`nav-link ${isActive('/tours') ? 'active' : ''}`}
            >
              Tours
            </Link>
          </li>
          <li className="nav-item">
            <Link
              to="/rifas"
              className={`nav-link ${isActive('/rifas') ? 'active' : ''}`}
            >
              Rifas
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}
