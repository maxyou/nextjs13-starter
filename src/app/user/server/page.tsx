import { headers } from 'next/headers'

export default function Server() {
  const headersList = headers()
  const middlewareSet = headersList.get('middlewareSet')

  return (
    <div>
        <p>middlewareSet: {JSON.stringify(middlewareSet)}</p>        
        <p>headersList: {JSON.stringify(headersList)}</p>
    </div>
  )
}