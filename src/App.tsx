import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { HOME_REDIRECT_PATH } from './homeconfig';
import Navbar from './components/Navbar';
import MetadataManager from './components/MetadataManager';
import ContentProtection from './components/ContentProtection';
import HomePage from './pages/HomePage';
import ModelosPage from './pages/ModelosPage';
import ModeloDetail from './pages/ModeloDetail';
import ToursPage from './pages/ToursPage';
import RifasPage from './pages/RifasPage';
import TourLocationPage from './pages/toursLocations/TourLocationPage';
import './App.css';

function App() {
  return (
    <Router>
      <MetadataManager />
      <ContentProtection />
      <Navbar />
      <Routes>
        {/* Redirige la raíz a la ruta configurada */}
        <Route path="/" element={<Navigate to={HOME_REDIRECT_PATH} replace />} />
        {/* HomePage accesible en /home */}
        <Route path="/home" element={<HomePage />} />
        <Route path="/modelos" element={<ModelosPage />} />
        <Route path="/:user" element={<ModeloDetail />} />
        <Route path="/tours" element={<ToursPage />} />
        <Route path="/tours/:locationSlug" element={<TourLocationPage />} />
        <Route path="/rifas" element={<RifasPage />} />
      </Routes>
    </Router>
  );
}

export default App;
