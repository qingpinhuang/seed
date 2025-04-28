'use client'

import { ReactNode } from 'react'

import I18nProvider from '@/providers/I18nProvider'
import SWRProvider from '@/providers/SWRProvider'

function Main({ children }: { children: ReactNode }) {
  return <>{children}</>
}

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <I18nProvider>
      <SWRProvider>
        <Main>{children}</Main>
      </SWRProvider>
    </I18nProvider>
  )
}
