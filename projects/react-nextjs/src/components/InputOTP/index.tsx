import { ChangeEvent, useEffect, useRef, useState } from 'react'
import { twMerge } from 'tailwind-merge'

const PIN_LENGTH = 6

interface InputOTPProps {
  value: string
  onChange: (value: string) => void
  autoFocus?: boolean
  onFocus?: () => void
  onBlur?: () => void
}

export function InputOTP({
  value,
  onChange,
  autoFocus,
  onFocus,
  onBlur,
}: InputOTPProps) {
  const inputRef = useRef<HTMLInputElement | null>(null)
  const [isFocus, setIsFocus] = useState(false)

  useEffect(
    () => {
      const input = inputRef.current
      if (input && autoFocus) {
        setTimeout(() => {
          input.focus()
        }, 100)
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  )

  function handleFocus() {
    setIsFocus(true)
    onFocus?.()
  }

  function handleBlur() {
    setIsFocus(false)
    onBlur?.()
  }

  function handleChange(evt: ChangeEvent<HTMLInputElement>) {
    const val = evt.target.value || ''
    if ((/^[0-9]*$/.test(val) && !/^\d{7}$/.test(val)) || !val) {
      onChange?.(val)
    }
  }

  return (
    <div className="relative flex flex-nowrap items-center justify-center gap-2">
      <input
        ref={inputRef}
        className="absolute h-0 w-full opacity-0 outline-none select-none"
        type="password"
        // type="number"
        // pattern="\d*"
        value={value}
        onChange={handleChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
      />
      {Array.from({ length: PIN_LENGTH }).map((_, index) => {
        return (
          <input
            key={index}
            className={twMerge(
              'h-10 w-10 outline-none',
              'flex items-center justify-center rounded-lg',
              'border border-white bg-white',
              'text-center text-xl',
              isFocus &&
                (value.length >= 6 ? 5 : value.length) === index &&
                'border-[#01A1FF]',
            )}
            onClick={() => {
              if (inputRef.current) {
                inputRef.current.focus()
              }
            }}
            value={value[index] || ''}
            type={'password'}
            readOnly
          />
        )
      })}
    </div>
  )
}
