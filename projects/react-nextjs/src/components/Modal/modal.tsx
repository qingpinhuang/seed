import { ReactNode, Ref } from 'react'
import { twMerge } from 'tailwind-merge'

export interface ModalProps {
  ref?: Ref<HTMLDivElement>
  className?: string
  children: ReactNode
  mask?: boolean
  onMask?: () => void
}

export default function Modal({
  ref,
  className,
  children,
  mask = true,
  onMask,
}: ModalProps) {
  return (
    <div
      ref={ref}
      className={twMerge(
        'fixed top-0 right-0 bottom-0 left-0 z-50',
        'flex items-center justify-center overflow-auto',
        className,
      )}
    >
      {mask && (
        <div
          className={twMerge(
            'fixed top-0 right-0 bottom-0 left-0 -z-10',
            'bg-[rgba(0,0,0,0.8)]',
          )}
          onClick={onMask}
        ></div>
      )}
      {children}
    </div>
  )
}
