'use client'

import Link from 'next/link'

export default function Home() {
  const LINKS = [
    { text: 'GSAP', href: '/gsap' },
    { text: 'PAG', href: '/pag' },
  ]

  return (
    <main className="p-4">
      <h1 className="my-10 text-center text-4xl font-bold">
        React + Next.js Template
      </h1>
      <section className="mx-auto mt-20 max-w-7xl text-2xl">
        <div>
          {LINKS.map((link, index) => (
            <Link
              key={index}
              className="m-6 inline-block text-blue-500 hover:underline"
              href={link.href}
            >
              {link.text}
            </Link>
          ))}
        </div>
      </section>
    </main>
  )
}
