import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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
        <Route path="/" element={<HomePage />} />
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
