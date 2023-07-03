import { headers, cookies } from 'next/headers'
import PageClient from './clientpage'
import { JwtUser, joseVerify } from '@/common/tool/calc';
// import GoogleLoginButtonJs from '@/common/component/googlebuttonjs';
import GoogleLoginButtonHtml from '@/common/component/googlebuttonhtml';

export default async function PageServer() {

  console.log(`JWT_SECRET: ${process.env.JWT_SECRET as string}`);
  console.log(`gsi_src: ${process.env.GOOGLE_ACCOUNT_GSI_CLIENT as string}`);
  console.log(`login_uri: ${process.env.GOOGLE_LOGIN_URI_HTML}`);
  console.log(`client_id: ${process.env.GOOGLE_CLIENT_ID}`);

  return (
    <div>
        <div>
          <GoogleLoginButtonHtml 
            gsi_src={process.env.GOOGLE_ACCOUNT_GSI_CLIENT!}
            server_login_uri={process.env.GOOGLE_LOGIN_URI_HTML!} 
            client_id={process.env.GOOGLE_CLIENT_ID!}
          />
        </div>
      
        <div>
          <PageClient />
        </div>
    </div>
  )
}