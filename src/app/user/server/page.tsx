import { cookies } from 'next/headers'
 
export default function Page() {
  const cookieStore = cookies()
//   const theme = cookieStore.get('theme')
  return (
    <div>
        <h1>Server Side Rendering</h1>
        <p>cookieStore: {JSON.stringify(cookieStore.getAll())}</p>
    </div>
  )
}