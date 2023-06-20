import { headers } from 'next/headers'
import React from 'react'
import ClientPage from './clientpage'

export default function Server() {
  const headersList = headers()
  const middlewareSet = headersList.get('middlewareSet')

  return (
    <div>
        <p>middlewareSet: {JSON.stringify(middlewareSet)}</p>        
        <p>headersList: {JSON.stringify(headersList)}</p>
        <ClientPage middlewareSet={middlewareSet} />
    </div>
  )
}