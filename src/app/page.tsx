import Image from 'next/image'

export default function Home() {



  
  return (
    <main className="w-full h-full flex flex-col items-center justify-between p-24">
      <div className="flex flex-row items-center justify-between">
          <input className="w-1/2 h-12 px-4 py-2 text-lg text-gray-700 placeholder-gray-500 border rounded-lg focus:shadow-outline" placeholder="input at here" />
          <button className="px-4 py-2 ml-2 text-lg font-bold text-white bg-blue-500 rounded-lg hover:bg-blue-700">Submit</button>
      </div>

      <div className="flex flex-col items-center justify-between">

        <div>
          <p className="text-2xl font-bold">Documentation 1</p>
        </div>
        <div>
          <p className="text-2xl font-bold">Documentation 2</p>
        </div>
        <div>
          <p className="text-2xl font-bold">Documentation 3</p>
        </div>
        <div>
          <p className="text-2xl font-bold">Documentation 4</p>
        </div>

      </div>
    </main>
  )
}
