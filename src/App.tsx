import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import ModelosPage from './pages/ModelosPage';
import ModeloDetail from './pages/ModeloDetail';
import ToursPage from './pages/ToursPage';
import RifasPage from './pages/RifasPage';
import './App.css';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/modelos" element={<ModelosPage />} />
        <Route path="/:user" element={<ModeloDetail />} />
        <Route path="/tours" element={<ToursPage />} />
        <Route path="/rifas" element={<RifasPage />} />
      </Routes>
    </Router>
  );
}

export default App;
