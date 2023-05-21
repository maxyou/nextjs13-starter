'use client'

import { ApiDef } from '../../common'
import { Client, Provider, cacheExchange, fetchExchange } from 'urql'
import { gql, useQuery } from 'urql'

const TodosQuery = gql`
  query {
    hello
  }
`

export default function Home() {

  const [result, reexecuteQuery] = useQuery({
    query: TodosQuery,
  });

  const { data, fetching, error } = result;

  if (fetching) return <p>Loading...</p>;
  if (error) return <p>Oh no... {error.message}</p>;

  //console.log(`graphql get : ${JSON.stringify(data)}`)
  console.log(`graphql get : ${data.hello}`)

  return (
    <main className="w-full h-full flex flex-col items-center justify-between p-24">
      
        <div className="flex flex-col items-center justify-between">
          <div>
            <p className="text-2xl font-bold">{data.hello}</p>
          </div>
        </div>      

    </main>
  )
}
