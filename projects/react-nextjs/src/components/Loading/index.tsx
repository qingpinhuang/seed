import { twMerge } from 'tailwind-merge'

interface LoadingProps {
  className?: string
}

export default function Loading({ className }: LoadingProps) {
  return (
    <svg
      className={twMerge('text-gray-400', className)}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 100 100"
      preserveAspectRatio="xMidYMid"
    >
      <circle
        strokeDasharray="188 64"
        strokeWidth="12"
        stroke="currentColor"
        fill="none"
        cy="50"
        cx="50"
        r="40"
      >
        <animateTransform
          attributeName="transform"
          attributeType="XML"
          type="rotate"
          from="0 50 50"
          to="360 50 50"
          dur="1s"
          repeatCount="indefinite"
        />
      </circle>
    </svg>
  )
}
