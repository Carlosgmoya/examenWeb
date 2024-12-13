import React from 'react';
import { useNavigate } from 'react-router-dom';

function PantallaInicio() {
  const navigate = useNavigate();

  return (
    <div>
      <h1>Bienvenido a la Pantalla de Inicio</h1>
    {/* Aquí colocas el GoogleLoginComponent */}
      <button onClick={() => navigate('/mapa')}>Ir al mapa</button>
    </div>
  );
}

export default PantallaInicio;

