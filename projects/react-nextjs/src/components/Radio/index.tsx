import { InputHTMLAttributes } from 'react'
import { twMerge } from 'tailwind-merge'

type RadioProps = Merge<
  InputHTMLAttributes<HTMLInputElement>,
  {
    innerClassName?: string
  }
>

export default function Radio({
  className,
  innerClassName,
  ...restProps
}: RadioProps) {
  return (
    <div
      className={twMerge(
        'relative h-6 w-12 rounded-full bg-[#94C7E5]',
        'before:absolute before:top-0.5 before:left-0.5 before:h-5 before:w-5 before:rounded-full before:bg-white',
        'has-checked:bg-[#01A1FF] has-checked:before:left-6.5',
        'transition-all before:transition-all before:duration-300',
        className,
      )}
    >
      <input
        className={twMerge(
          'absolute top-0 left-0 h-full w-full opacity-0',
          innerClassName,
        )}
        type="radio"
        {...restProps}
      />
    </div>
  )
}
