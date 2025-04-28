import { ReactNode } from 'react'
import { createRoot } from 'react-dom/client'

export function show(node: ReactNode, el?: Element | null) {
  const container = document.createElement('div')

  const parent = el || document.body
  parent.appendChild(container)

  const root = createRoot(container)
  root.render(node)

  return () => {
    root.unmount()
    container.remove()
  }
}

export default show
