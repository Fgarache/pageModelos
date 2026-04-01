import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FiMenu, FiX } from 'react-icons/fi';
import '../styles/Navbar.css';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;
  const toggleMenu = () => setIsOpen(!isOpen);

  // Efecto para cambiar opacidad al hacer scroll
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="navbar-glass-container">
        <Link to="/" className="navbar-logo" onClick={() => setIsOpen(false)}>
          <span className="logo-sparkle">✨</span> 
          PAGE<span className="logo-gold">MODELOS</span>
        </Link>

        {/* Icono Hamburguesa */}
        <div className="mobile-icon" onClick={toggleMenu}>
          {isOpen ? <FiX /> : <FiMenu />}
        </div>

        {/* Menú de Navegación */}
        <ul className={`nav-menu ${isOpen ? 'active' : ''}`}>
          <li className="nav-item">
            <Link to="/" className={`nav-link ${isActive('/') ? 'active' : ''}`} onClick={() => setIsOpen(false)}>
              Inicio
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/modelos" className={`nav-link ${isActive('/modelos') ? 'active' : ''}`} onClick={() => setIsOpen(false)}>
              Modelos
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/tours" className={`nav-link ${isActive('/tours') ? 'active' : ''}`} onClick={() => setIsOpen(false)}>
              Tours
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/rifas" className={`nav-link ${isActive('/rifas') ? 'active' : ''}`} onClick={() => setIsOpen(false)}>
              Rifas
            </Link>
          </li>
          <li className="nav-btn-container">
            <Link to="/vip" className="nav-vip-btn" onClick={() => setIsOpen(false)}>
              ACCESO VIP
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}