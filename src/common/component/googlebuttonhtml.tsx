'use client'

import React, { useEffect } from 'react';
// import { GoogleLoginButtonProps } from '../interface';


const GoogleLoginButton: React.FC<GoogleLoginButtonProps> = ({
  gsi_src,
  server_login_uri,
  client_id
}) => {

  console.log(`gsi_src: ${gsi_src}`);
  console.log(`server_login_uri: ${server_login_uri}`);
  console.log(`client_id: ${client_id}`);

  useEffect(() => {
    function initializeGoogleLogin() {
      const script = document.createElement('script');
      script.src = gsi_src;
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
        data-client_id={client_id}
        data-login_uri={server_login_uri}
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

export interface GoogleLoginButtonProps {
  gsi_src: string;
  client_id: string;  
  server_login_uri?: string;
  after_login_jump_uri?: string;
}
