'use client'

import Link from "next/link"


export default function Home() {

  return (
    <main className="w-full h-full flex flex-col items-center justify-between p-24">

      <div>
        <Link href="/biz/todolist">
          <button className='bg-blue-500 min-w-fit hover:bg-blue-700 text-white p-2 m-2 rounded'>goto todolist</button>
        </Link>
      </div>
      <div>
        <Link href="/user/login">
          <button className='bg-blue-500 min-w-fit hover:bg-blue-700 text-white p-2 m-2 rounded'>goto login</button>
        </Link>
      </div>

    </main>
  )
}
