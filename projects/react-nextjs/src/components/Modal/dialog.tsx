import { ReactNode } from 'react'
import { twMerge } from 'tailwind-merge'

import FixedModal from './fixed-modal'

import SvgClose from './images/close.svg'

interface DialogProps {
  className?: string
  children: ReactNode
  title?: string
  closable?: boolean
  onHide?: () => void
}

export default function Dialog({
  className,
  children,
  title,
  closable = true,
  onHide,
}: DialogProps) {
  return (
    <FixedModal onMask={onHide}>
      <main
        className={twMerge(
          'relative w-[90%] max-w-[400px] overflow-hidden rounded-2xl bg-white',
          className,
        )}
      >
        <div className="bg-gradient-to-b from-[rgba(1,161,255,0.6)] to-white p-6">
          {closable && (
            <a
              className="absolute top-1 right-1 cursor-pointer p-2"
              onClick={onHide}
            >
              <SvgClose className="w-6" />
            </a>
          )}
          {title && (
            <h1 className="mx-4 text-center text-lg leading-[1.333] font-extrabold text-black">
              {title}
            </h1>
          )}
          {children}
        </div>
      </main>
    </FixedModal>
  )
}
