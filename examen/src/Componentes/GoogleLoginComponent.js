import React from 'react';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';

function GoogleLoginComponent() {
  const handleSuccess = (response) => {
    console.log('Login Success:', response.credential);
    // Aquí puedes enviar el token a tu servidor para validarlo
  };

  const handleError = () => {
    console.error('Login Failed');
  };

  return (
    <GoogleOAuthProvider clientId="316158158631-9n48p9n0tbbhn2b7qrcjvcehrpsl0h5q.apps.googleusercontent.com">
      <div>
        <h1>Iniciar Sesión</h1>
        <GoogleLogin
          onSuccess={handleSuccess}
          onError={handleError}
        />
      </div>
    </GoogleOAuthProvider>
  );
}

export default GoogleLoginComponent;
