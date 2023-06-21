import React from 'react'
import { headers, cookies } from 'next/headers'
import PageClient from './pageclient'
import { JwtUser } from '@/common/tool/calc';

export default function PageServer() {

  const headersList = headers()
  const middlewareSet = headersList.get('middlewareSet') || ''
  const jwtUser = JSON.parse(middlewareSet) as JwtUser

  return (
    <div>
      
        <div>
          <br />
          <p>middlewareSet: {JSON.stringify(middlewareSet)}</p>
          <p>jwtUser: {JSON.stringify(jwtUser)}</p>
          <br />
          <PageClient jwtUser={jwtUser} />
        </div>
    </div>
  )
}