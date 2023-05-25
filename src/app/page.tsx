'use client'

import Link from "next/link"


export default function Home() {

  return (
    <main className="w-full h-full flex flex-col items-center justify-between p-24">

      <div>
        <Link href="/rest">
          <button className='bg-blue-500 min-w-fit hover:bg-blue-700 text-white p-2 m-2 rounded'>use restful api</button>
        </Link>
      </div>
      <div>
        <Link href="/graphql">
          <button className='bg-blue-500 min-w-fit hover:bg-blue-700 text-white p-2 m-2 rounded'>use graphql api</button>
        </Link>
      </div>

    </main>
  )
}
