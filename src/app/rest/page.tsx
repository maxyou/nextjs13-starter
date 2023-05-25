'use client'

import useSWR from 'swr'
import { Fetcher } from "swr";
import { ApiDef } from '../../common'

export default function RestAPI() {

  const fetcher: Fetcher<ApiDef.User> = async (url:string) => {
    const response = await fetch(url);
    const data = await response.json();
    return data;
  };

  const { data, error, isLoading } = useSWR('/api', fetcher)
 
  if (error) return <div>failed to load</div>
  if (isLoading) return <div>loading...</div>

  return (
    <main className="w-full h-full flex flex-col items-center justify-between p-24">
      
        <div>
          <p className="text-2xl font-bold">{data?.name}</p>
        </div>

    </main>
  )
}
