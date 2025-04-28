import { useEffect } from 'react'
import { create } from 'zustand'

export const useDeviceStore = create<{
  clientWidth: number | null
  isMobile: boolean | null
  setClientWidth: (clientWidth: number | null) => void
  setIsMobile: (isMobile: boolean | null) => void
}>((set) => ({
  clientWidth: null,
  isMobile: null,
  setClientWidth: (clientWidth) => set({ clientWidth }),
  setIsMobile: (isMobile) => set({ isMobile }),
}))

export default function useDevice(autoFontSize?: boolean) {
  const { clientWidth, isMobile, setClientWidth, setIsMobile } =
    useDeviceStore()

  useEffect(() => {
    if (autoFontSize && typeof window !== 'undefined' && clientWidth) {
      window.document.documentElement.style.fontSize =
        (isMobile ? clientWidth / 375 : 1) * 16 + 'px'
    }
  }, [autoFontSize, clientWidth, isMobile])

  useEffect(
    () => {
      function handleResize() {
        setClientWidth(window.innerWidth)
        setIsMobile(window.matchMedia(`(max-width: 768px)`).matches)
      }

      handleResize()

      window.addEventListener('resize', handleResize)

      return () => window.removeEventListener('resize', handleResize)
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  )

  return { clientWidth, isMobile }
}
