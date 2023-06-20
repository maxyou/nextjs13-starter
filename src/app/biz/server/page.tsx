import { headers, cookies } from 'next/headers'
import React from 'react'
import ClientPage from './clientpage'

export default function Server() {
  const headersList = headers()
  const middlewareSet = headersList.get('middlewareSet')

  const cookiesList = cookies()
  const jwt = cookiesList.get('jwt')

  return (
    <div>
      <br/>
        <p>middlewareSet: {JSON.stringify(middlewareSet)}</p>        
        <p>headersList: {JSON.stringify(headersList)}</p>
        <p>jwt: {JSON.stringify(jwt)}</p>
      <br/>
        <ClientPage middlewareSet={middlewareSet} />
    </div>
  )
}