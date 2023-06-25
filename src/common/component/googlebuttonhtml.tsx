'use client'

import React, { useEffect } from 'react';

const GoogleLoginButton: React.FC = () => {
  useEffect(() => {
    function initializeGoogleLogin() {
      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      document.body.appendChild(script);
    }

    if (typeof window !== 'undefined' && typeof window.google === 'undefined') {
      initializeGoogleLogin();
    }
  }, []);

  return (
    <div>
      <div
        id="g_id_onload"
        data-client_id="YOUR_GOOGLE_CLIENT_ID"
        data-login_uri="https://your.domain/your_login_endpoint"
        data-auto_prompt="false"
      ></div>
      <div
        className="g_id_signin"
        data-type="standard"
        data-size="large"
        data-theme="outline"
        data-text="sign_in_with"
        data-shape="rectangular"
        data-logo_alignment="left"
      ></div>
    </div>
  );
};

export default GoogleLoginButton;
