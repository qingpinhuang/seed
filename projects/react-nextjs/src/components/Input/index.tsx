import { InputHTMLAttributes, ReactNode } from 'react'
import { twMerge } from 'tailwind-merge'

type InputProps = Merge<
  InputHTMLAttributes<HTMLInputElement>,
  {
    prefix?: ReactNode
    suffix?: ReactNode
    innerClassName?: string
  }
>

export default function Input({
  className,
  prefix,
  suffix,
  innerClassName,
  ...restProps
}: InputProps) {
  return (
    <div
      className={twMerge(
        'box-border flex items-center',
        'h-14 gap-2 rounded-2xl bg-[rgba(255,255,255,.6)] px-2 text-base',
        className,
      )}
    >
      {prefix}
      <input
        className={twMerge(
          'bg-transparent text-inherit shadow-none outline-none',
          'box-border h-full w-24 flex-1 border-0',
          innerClassName,
        )}
        type="text"
        {...restProps}
      />
      {suffix}
    </div>
  )
}
