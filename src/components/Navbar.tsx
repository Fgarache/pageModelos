import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FiMenu, FiX } from 'react-icons/fi';
import '../styles/Navbar.css';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showPublishModal, setShowPublishModal] = useState(false);
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;
  const toggleMenu = () => setIsOpen(!isOpen);
  const publishWhatsAppLink =
    'https://wa.me/50243391342?text=Hola%20Linda%2C%20quiero%20publicarme%20en%20LindasGT.com';

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
          <img src="/icons/logo.png" alt="LindasGT" className="navbar-logo-icon" />
          <span className="logo-white">Lindas</span><span className="logo-gold">GT</span>
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
            <button
              type="button"
              className="nav-vip-btn"
              onClick={() => {
                setShowPublishModal(true);
                setIsOpen(false);
              }}
            >
              PUBLICATE
            </button>
          </li>
        </ul>
      </div>

      {showPublishModal && (
        <div className="publish-modal-backdrop" onClick={() => setShowPublishModal(false)}>
          <div className="publish-modal" onClick={(event) => event.stopPropagation()}>
            <h3>Terminos y condiciones</h3>
            <ul>
              <li>Solo se aceptan perfiles reales y verificados.</li>
              <li>Solo se aceptan chicas que brinden servicios presenciales o escort.</li>
              <li>Las fotos deben estar sin marca de agua y en buena calidad.</li>
              <li>La informacion publicada debe ser verdadera y actualizada.</li>
              <li>No se permite contenido ilegal, fraudulento o engañoso.</li>
              <li>Nos reservamos el derecho de aprobar, pausar o remover anuncios.</li>
              <li>El contacto y la negociacion final son responsabilidad de cada usuario.</li>
            </ul>

            <h4 className="publish-modal-subtitle">Beneficios</h4>
            <ul className="publish-modal-benefits">
              <li>Link personalizado para tu perfil con catalogo, info y redes.</li>
              <li>Herramientas para crear y publicar tours fuera de tu ciudad.</li>
              <li>Soporte para rifas activas y promociones especiales.</li>
              <li>Agenda privada adaptada al uso de chicas escort.</li>
              <li>Mayor visibilidad en busquedas por ciudad y departamento.</li>
              <li>Panel simple para mantener tu perfil actualizado.</li>
            </ul>

            <p className="publish-modal-contact">Contactar con Linda</p>

            <a className="publish-modal-whatsapp" href={publishWhatsAppLink} target="_blank" rel="noreferrer">
              Contacto
            </a>

            <button type="button" className="publish-modal-close" onClick={() => setShowPublishModal(false)}>
              Cerrar
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}