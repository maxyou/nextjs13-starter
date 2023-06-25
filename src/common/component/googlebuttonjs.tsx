'use client'

import React, { useEffect } from 'react';

declare global {
  interface Window {
    google: any;
  }
}

const GoogleLoginButton: React.FC = () => {
  useEffect(() => {
    function handleCredentialResponse(response: any) {
      console.log("Encoded JWT ID token: " + response.credential);
    }

    function initializeGoogleLogin() {
      window.google.accounts.id.initialize({
        client_id: "YOUR_GOOGLE_CLIENT_ID",
        callback: handleCredentialResponse
      });
      window.google.accounts.id.renderButton(
        document.getElementById("buttonDiv"),
        { theme: "outline", size: "large" }
      );
      window.google.accounts.id.prompt();
    }

    if (typeof window.google !== 'undefined') {
      initializeGoogleLogin();
    } else {
      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      script.onload = initializeGoogleLogin;
      document.body.appendChild(script);
    }
  }, []);

  return <div id="buttonDiv"></div>;
};

export default GoogleLoginButton;
