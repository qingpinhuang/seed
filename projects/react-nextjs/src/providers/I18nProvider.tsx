'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { ReactNode } from 'react'

import { i18n } from '@lingui/core'
import { I18nProvider as LinguiI18nProvider } from '@lingui/react'
import { messages as enMessages } from '@/locales/en/messages'
import { messages as hkMessages } from '@/locales/hk/messages'
import { messages as koMessages } from '@/locales/ko/messages'
import { messages as jpMessages } from '@/locales/jp/messages'
import { messages as viMessages } from '@/locales/vi/messages'
import { messages as ruMessages } from '@/locales/ru/messages'

i18n.load({
  en: enMessages,
  hk: hkMessages,
  ko: koMessages,
  jp: jpMessages,
  vi: viMessages,
  ru: ruMessages,
})
i18n.activate('en')

export type Locale = 'en' | 'hk' | 'ko' | 'jp' | 'vi' | 'ru'

interface Language {
  locale: Locale | null
  activate: (locale: Locale) => void
}

export const useLanguage = create<Language>()(
  persist(
    (set) => ({
      locale: null,
      activate: (locale) => {
        set({ locale })
        i18n.activate(locale)
      },
    }),
    {
      name: 'locale',
      onRehydrateStorage() {
        // hydration starts

        return (state) => {
          // hydration finished
          state?.activate(state?.locale || 'en')
        }
      },
    },
  ),
)

export default function I18nProvider({ children }: { children: ReactNode }) {
  const { locale } = useLanguage()
  if (!locale) return null

  return <LinguiI18nProvider i18n={i18n}>{children}</LinguiI18nProvider>
}
