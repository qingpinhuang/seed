'use client'

import gsap from 'gsap'
import { useEffect, useRef } from 'react'

export default function GSAP() {
  const ref = useRef(null)

  useEffect(() => {
    if (!ref.current) return

    // 对 HTML 元素执行动画
    gsap.to(ref.current, {
      x: '50vw',
      rotation: 360,
      duration: 2,
      delay: 1,
      yoyo: true,
      repeat: -1,
    })

    // 对 Svg 图形执行动画

    // 对任意对象执行动画
    const position = { x: 0, y: 0 }
    gsap.to(position, {
      x: 50,
      y: 100,
      duration: 2,
      onUpdate: () => {
        console.log('---', position)
      },
    })
  }, [])

  return (
    <main className="p-4">
      <h1 className="my-10 text-center text-4xl font-bold">GSAP</h1>
      <div className="mt-20">
        <div ref={ref} className="h-32 w-32 bg-green-500"></div>
      </div>
    </main>
  )
}
