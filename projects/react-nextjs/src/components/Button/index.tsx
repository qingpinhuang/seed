/* eslint-disable @typescript-eslint/no-unused-expressions */

import {
  AnchorHTMLAttributes,
  ButtonHTMLAttributes,
  MouseEventHandler,
  MouseEvent,
  useState,
  RefObject,
} from 'react'
import { twMerge } from 'tailwind-merge'
import { cva } from 'class-variance-authority'
import Loading from '@/components/Loading'

const buttonClassName = cva(
  [
    'box-border shadow-none outline-none cursor-pointer transition-all',
    'flex items-center justify-center gap-1',
    'h-14 rounded-2xl px-2 text-base text-white font-bold',
  ],
  {
    variants: {
      intent: {
        black: ['bg-black'],
        blue: ['bg-[#01A1FF]'],
        red: ['bg-[#FF7033]'],
        gradient: [
          'bg-gradient-to-r from-[#01C4FF] to-[#5CFF3F]',
          'text-black',
        ],
      },
      disabled: {
        false: null,
        true: ['opacity-60'],
      },
      flash: {
        false: null,
        true: ['button-flash'],
      },
    },
    compoundVariants: [
      {
        intent: 'blue',
        disabled: true,
        className: ['bg-[#66C6FF]'],
      },
    ],
    defaultVariants: {
      intent: 'black',
      disabled: false,
      flash: false,
    },
  },
)

export type ButtonProps = Merge<
  | AnchorHTMLAttributes<HTMLAnchorElement>
  | ButtonHTMLAttributes<HTMLButtonElement>,
  {
    ref?: RefObject<HTMLAnchorElement | HTMLButtonElement | null>
    type?: 'anchor' | 'button'
    variant?: 'black' | 'blue' | 'red' | 'gradient'
    flash?: boolean
    disabled?: boolean
    loader?: boolean
  }
>

export default function Button({
  ref,
  className,
  type,
  variant,
  flash,
  disabled,
  loader,
  children,
  onClick,
  ...restProps
}: ButtonProps) {
  const [loading, setLoading] = useState(false)

  const _className = twMerge(
    buttonClassName({ intent: variant, disabled, flash }),
    className,
  )

  let _children = children
  if (loading) {
    _children = <Loading className="h-1/2 w-1/2 text-inherit opacity-60" />
  }

  const _onClick = async (
    evt: MouseEvent<HTMLAnchorElement> & MouseEvent<HTMLButtonElement>,
  ) => {
    if (disabled || loading) return

    try {
      loader && setLoading(true)
      await onClick?.(evt)
    } catch (err) {
      throw err
    } finally {
      loader && setLoading(false)
    }
  }

  let button = null
  if (type === 'button') {
    button = (
      <button
        ref={ref as RefObject<HTMLButtonElement>}
        className={_className}
        onClick={_onClick as MouseEventHandler<HTMLButtonElement>}
        {...(restProps as ButtonHTMLAttributes<HTMLButtonElement>)}
      >
        {_children}
      </button>
    )
  } else {
    button = (
      <a
        ref={ref as RefObject<HTMLAnchorElement>}
        className={_className}
        onClick={_onClick as MouseEventHandler<HTMLAnchorElement>}
        {...(restProps as AnchorHTMLAttributes<HTMLAnchorElement>)}
      >
        {_children}
      </a>
    )
  }

  return button
}
