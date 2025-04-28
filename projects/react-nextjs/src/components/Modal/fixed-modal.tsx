import { useEffect, useRef, useState } from 'react'
import Modal, { ModalProps } from './modal'

/**
 * fixed 定位受祖先元素 transform、backdrop-filter 等样式的影响限制，
 * 只能固定在有此样式的祖先元素内，而不是固定到全屏的位置，导致展示异常；
 * 这里添加方法调整其 DOM 元素的位置，使其符合预期的效果
 */
function useFixed() {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const parent = document.querySelector('#fixed-wrap') || document.body
    const modal = ref.current
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    modal && parent.appendChild(modal)

    setVisible(true)

    return () => {
      modal?.remove()
    }
  }, [])

  return { ref, visible }
}

export default function FixedModal({ children, ...props }: ModalProps) {
  const { ref, visible } = useFixed()

  return (
    // Modal 外必须添加 div 包裹，避免手动操作 DOM 后与 React 管理的 DOM 节点不一致而导致页面崩溃
    <div className="invisible absolute h-0 w-0 overflow-hidden">
      <Modal ref={ref} className={visible ? '' : 'invisible'} {...props}>
        {children}
      </Modal>
    </div>
  )
}
