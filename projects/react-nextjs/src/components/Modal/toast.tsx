import { ReactNode, useEffect, useState } from 'react'
import { twMerge } from 'tailwind-merge'
import Modal from './modal'
import show from './show'

import SvgSuccess from './images/success.svg'
import SvgError from './images/error.svg'

const ICON = {
  success: <SvgSuccess />,
  error: <SvgError />,
}

interface ToastProps {
  text: string | ReactNode
  duration: number
  onHide: () => void
}

function Toast({ text, duration, onHide }: ToastProps) {
  const [visible, setVisible] = useState(true)
  const [animate, setAnimate] = useState('in')

  useEffect(
    () => {
      setTimeout(() => {
        setAnimate('out')
        setTimeout(() => {
          setVisible(false)
          onHide()
        }, 300)
      }, duration)
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  )

  if (!visible) return

  return (
    <Modal
      className="bottom-auto h-0 items-start overflow-visible"
      mask={false}
    >
      <div
        className={twMerge(
          'mt-20 inline-block max-w-[80%] px-5 py-3',
          'rounded-2xl bg-[rgba(0,0,0,.99)]',
          'text-base leading-[1.375] text-white',
          animate === 'in'
            ? 'animate-[toast-in_0.15s_ease-out_both]'
            : 'animate-[toast-out_0.15s_ease-in_both]',
        )}
      >
        {text}
      </div>
    </Modal>
  )
}

export function toast({
  type,
  text,
  duration,
}: {
  type?: 'success' | 'error'
  text: string | ReactNode
  duration?: number
}): () => void
export function toast(text: string): () => void
export function toast(option: any) {
  let type: 'success' | 'error' | undefined
  let text
  let duration

  if (typeof option === 'string') {
    text = option
  } else {
    ;({ text, type, duration } = option)
  }

  const icon = (type && ICON[type]) || null

  const hide = show(
    <Toast
      text={
        <div className="flex gap-1">
          {icon}
          {text}
        </div>
      }
      duration={duration || 2000}
      onHide={() => hide()}
    />,
  )
  return hide
}
