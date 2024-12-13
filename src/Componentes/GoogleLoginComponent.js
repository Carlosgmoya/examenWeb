import React, { useState } from 'react';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';

function GoogleLoginComponent() {
  const [user] = useState(null); // Estado para manejar datos del usuario

  const handleSuccess = async (response) => {
    const idToken = response.credential;
  
    try {
      const res = await fetch('http://127.0.0.1:8000/api/auth/google', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token: idToken }),
      });
  
      if (!res.ok) throw new Error('Error al validar el token');
      const userData = await res.json();
      console.log('Usuario autenticado:', userData);
    } catch (error) {
      console.error('Error en autenticación:', error);
    }
  };
  
  

  const handleError = () => {
    console.error('Login Failed');
  };

  return (
    <GoogleOAuthProvider clientId="316158158631-9n48p9n0tbbhn2b7qrcjvcehrpsl0h5q.apps.googleusercontent.com">
      <div>
        <h1>Iniciar Sesión</h1>
        {user ? (
          <div>
            <h2>Bienvenido, {user.name}</h2>
            <img src={user.picture} alt="Perfil" />
          </div>
        ) : (
          <GoogleLogin
            onSuccess={handleSuccess}
            onError={handleError}
          />
        )}
      </div>
    </GoogleOAuthProvider>
  );
}

export default GoogleLoginComponent;
