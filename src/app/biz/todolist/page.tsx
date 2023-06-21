import React, {useEffect} from 'react'
import { headers, cookies } from 'next/headers'
import PageClient from './pageclient'
import { JwtUser, joseVerify } from '@/common/tool/calc';

export default async function PageServer() {
  
  const headersList = headers()
  const middlewareSet = headersList.get('middlewareSet') || ''
  const jwtUser = JSON.parse(middlewareSet) as JwtUser

  const cookiesList = cookies()
  const jwtCookie = cookiesList.get('jwt')?.value || ''
  console.log('todolist/page.tsx, jwtCookie:', jwtCookie)

  const secret = process.env.JWT_SECRET as string;
  const decodedToken = await joseVerify(jwtCookie, secret);
  console.log('todolist/page.tsx, decodedToken:', JSON.stringify(decodedToken))
  
  // if(decodedToken.code !== 0) {     
  //   console.log('middleware.ts, decodedToken.code !== 0, redirect to /user/login')    
  // }
  // const jwtUserFromCookie = decodedToken.jwtPayloadWithUser!.jwtUser;

  return (
    <div>
      
        <div>
          <br />
          <p>middlewareSet: {JSON.stringify(middlewareSet)}</p>
          <p>jwtUser: {JSON.stringify(jwtUser)}</p>
          <br />
          <p>decodedToken from cookie: {JSON.stringify(decodedToken)}</p>
          <br />
          <PageClient jwtUser={jwtUser} />
        </div>
    </div>
  )
}