'use client'

import { Client, Provider, cacheExchange, fetchExchange } from 'urql';

const client = new Client({
  url: 'http://localhost:3000/api/graphql',
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
