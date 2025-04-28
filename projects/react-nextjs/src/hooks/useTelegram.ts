import { useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { useAuthStore } from './useAuthSWR'
import {
  mockTelegramEnv,
  isTMA,
  init,
  retrieveRawInitData,
  miniApp,
  viewport,
  closingBehavior,
  swipeBehavior,
  backButton,
} from '@telegram-apps/sdk-react'

/**
 * Telegram 环境初始化
 *
 * @see
 * 1. Launch Parameters: https://docs.telegram-mini-apps.com/packages/telegram-apps-bridge/2-x/launch-parameters
 * 2. Initializing: https://docs.telegram-mini-apps.com/packages/telegram-apps-sdk/3-x/initializing
 */

export default function useTelegram() {
  const setRawInitData = useAuthStore((state) => state.setRawInitData)

  const onBack = useBackButton()

  useEffect(
    () => {
      if (process.env.NEXT_PUBLIC_ENV === 'DEV') {
        const launchParams = process.env.NEXT_PUBLIC_TG_LAUNCH_PARAMS
        if (!isEmpty(launchParams, 'Not user launchParams')) {
          mockTelegramEnv({ launchParams })

          const rawInitData = retrieveRawInitData()
          if (!isEmpty(rawInitData, 'Not user rawInitData')) {
            setRawInitData(rawInitData)
          }
        }

        return
      }

      let timer = null
      ;(async function autoInit() {
        if (timer) clearTimeout(timer)

        const isTG = await isTMA()
        if (typeof window !== 'undefined' && isTG) {
          init()

          initMiniApp()
          initViewPort()
          initClosingBehavior()
          initSwipeBehavior()
          initBackButton(onBack)

          const rawInitData = retrieveRawInitData()
          if (!isEmpty(rawInitData, 'Not user rawInitData')) {
            setRawInitData(rawInitData)
          }
        } else {
          timer = setTimeout(autoInit, 1000)
        }
      })()
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  )
}

/**
 * 验空，当为空值时输出控制台警告
 */
function isEmpty(value?: string | null, message?: string) {
  if (!value) {
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    message && console.error(message)
    return true
  }

  return false
}

async function initMiniApp() {
  await miniApp.mount()
  miniApp.ready()
}

async function initViewPort() {
  await viewport.mount()
  viewport.expand()
}

function initClosingBehavior() {
  closingBehavior.mount()
  closingBehavior.enableConfirmation()
}

function initSwipeBehavior() {
  swipeBehavior.mount()
  swipeBehavior.disableVertical()
}

function initBackButton(onClick: () => void) {
  if (!backButton.isSupported()) return

  backButton.mount()
  backButton.onClick(onClick)
}

function useBackButton() {
  const router = useRouter()
  const pathname = usePathname()
  const PAGE_NEED_BACK = ['/profile']

  useEffect(
    () => {
      if (!backButton.isMounted()) return

      if (PAGE_NEED_BACK.includes(pathname)) {
        backButton.show()
      } else {
        backButton.hide()
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [pathname],
  )

  return () => {
    if (window.history.length > 1) {
      router.back()
    } else {
      router.push('/')
    }
  }
}
