'use client'

import { Client, Provider, cacheExchange, fetchExchange } from 'urql';

const client = new Client({
  url: '/api/biz/todolist',
  exchanges: [cacheExchange, fetchExchange],
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <Provider value={client}>
        <div>
          {children}
        </div>
      </Provider>
    </div>
  )
}
