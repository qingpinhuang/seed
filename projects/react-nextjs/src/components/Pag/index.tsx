'use client'

import { useEffect, useRef } from 'react'
import { twMerge } from 'tailwind-merge'
import { PAGInit } from 'libpag'
import { PAG } from 'libpag/types/types'

interface PagProps {
  className?: string
  pagFilePath: string
  /** 循环次数：默认为 1，表示播放一次；0 表示播放无数次 */
  iterationCount?: number
}

let wasmPromise: Promise<PAG> | undefined
const pagPromiseMap: Record<
  string,
  { buffer: Promise<ArrayBuffer>; draw: Promise<void> | undefined } | undefined
> = {}

export default function Pag({
  className,
  pagFilePath,
  iterationCount = 1,
}: PagProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (wasmPromise) return

    // 全局只初始化一次（多次初始化会报错）
    wasmPromise = PAGInit({
      locateFile: (file: 'libpag.wasm') => `/pag/${file}`,
    })
  }, [])

  useEffect(
    () => {
      const canvas = canvasRef.current
      let pagPromise = pagPromiseMap[pagFilePath]
      if (!canvas || !wasmPromise || !pagFilePath || pagPromise?.draw) return

      canvas.style.display = 'block'

      if (!pagPromise?.buffer) {
        // 按文件路径缓存 pag 文件（后面相同的文件路径将不再请求）
        pagPromise = pagPromiseMap[pagFilePath] = {
          buffer: fetch(pagFilePath).then((response) => response.arrayBuffer()),
          draw: undefined,
        }
      }

      pagPromise.draw = pagPromise.buffer.then(async (buffer) => {
        const pag = await wasmPromise
        if (!pag) return

        const pagFile = await pag.PAGFile.load(buffer)
        const pagView = await pag.PAGView.init(pagFile, canvas)
        if (!pagView) return

        pagView.setRepeatCount(iterationCount)
        pagView.addListener('onAnimationEnd', () => {
          pagView.destroy()
          canvas.style.display = 'none'
          pagPromise.draw = undefined
        })

        await pagView.play()
      })

      return () => {
        pagPromise.draw = undefined
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [pagFilePath],
  )

  return (
    <canvas
      className={twMerge('h-40 w-40', className)}
      ref={canvasRef}
    ></canvas>
  )
}
