'use client'

import Pag from '@/components/Pag'

export default function PAG() {
  return (
    <main className="p-4">
      <h1 className="my-10 text-center text-4xl font-bold">PAG</h1>
      <div className="">
        <Pag
          className="mx-auto h-[600px] w-[600px]"
          pagFilePath="/pag/pag-logo.pag"
          iterationCount={0}
        />
      </div>
    </main>
  )
}
