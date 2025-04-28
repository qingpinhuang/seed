import { defineConfig } from '@lingui/cli'

export default defineConfig({
  sourceLocale: 'en',
  locales: ['en', 'hk', 'ko', 'jp', 'vi', 'ru'],
  catalogs: [
    {
      path: '<rootDir>/src/locales/{locale}/messages',
      include: ['src'],
    },
  ],
})
