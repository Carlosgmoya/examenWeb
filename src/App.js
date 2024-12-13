import './App.css';
import PantallaInicio from './Ventanas/PantallaInicio';
import GoogleLoginComponent from './Componentes/GoogleLoginComponent';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import miMapa from './Ventanas/miMapa';

function App() {
  return (
    <Router>
      <div><GoogleLoginComponent/>
      <Routes>
        <Route path="/" element={<PantallaInicio />} />
        <Route path="/mapa" element={<miMapa />} />
      </Routes>
      </div>
    </Router>
  );
}

export default App;
