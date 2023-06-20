'use client'

// import { headers, cookies } from 'next/headers'
import React from 'react'
import TodoListPage from './todolist'
import { Client, Provider, cacheExchange, fetchExchange } from 'urql';
import { JwtUser } from '@/common/tool/calc';
import { useSearchParams  } from 'next/navigation';

const client = new Client({
  url: '/api/biz/todolist',
  exchanges: [cacheExchange, fetchExchange],
});

export default function Page() {

  const searchParams = useSearchParams()
  console.log(`searchParams: ${JSON.stringify(searchParams)}`);
  const user = searchParams.get('user')
  console.log(`user: ${JSON.stringify(user)}`);
  const jwtUser = JSON.parse(decodeURIComponent(user as string));

  // const { user } = props
  // const headersList = headers()
  // const middlewareSet = headersList.get('middlewareSet')

  return (
    <div>
      <Provider value={client}>
        <div>
          <br />
          {/* <p>middlewareSet: {JSON.stringify(middlewareSet)}</p>
          <p>headersList: {JSON.stringify(headersList)}</p> */}
          <p>user: {JSON.stringify(user)}</p>
          <p>jwtUser: {JSON.stringify(jwtUser)}</p>
          <br />
          <TodoListPage user={jwtUser} />
        </div>
      </Provider>
    </div>
  )
}