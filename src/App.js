import './App.css';
import PantallaInicio from './Ventanas/PantallaInicio';
import GoogleLoginComponent from './Componentes/GoogleLoginComponent';

function App() {
  return (
    <div className="App">
      <PantallaInicio /> {/* Llama al componente */}
      
      <GoogleLoginComponent />
    </div>
  );
}

export default App;
