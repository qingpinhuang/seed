import { ReactNode } from 'react'
import { twMerge } from 'tailwind-merge'

import FixedModal from './fixed-modal'

import SvgClose from './images/close-fill.svg'

interface DrawerProps {
  className?: string
  innerClassName?: string
  children: ReactNode
  title?: string
  closable?: boolean
  onHide?: () => void
}

export default function Drawer({
  className,
  innerClassName,
  children,
  title,
  closable = true,
  onHide,
}: DrawerProps) {
  return (
    <FixedModal onMask={onHide}>
      <main
        className={twMerge(
          'fixed bottom-0 left-0 w-full',
          'safe-area-inset-bottom',
          'rounded-tl-2xl rounded-tr-2xl',
          'overflow-hidden bg-white',
          className,
        )}
      >
        <div
          className={twMerge(
            'p-4 pt-8',
            'bg-gradient-to-b from-[rgba(1,161,255,0.6)] to-white',
            innerClassName,
          )}
        >
          {closable && (
            <a
              className="absolute top-2 right-2 cursor-pointer p-2"
              onClick={onHide}
            >
              <SvgClose className="w-6" />
            </a>
          )}
          {title && (
            <h1 className="mx-6 text-center text-lg leading-[1.333] font-extrabold text-black">
              {title}
            </h1>
          )}
          {children}
        </div>
      </main>
    </FixedModal>
  )
}
