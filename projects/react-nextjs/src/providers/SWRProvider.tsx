'use client'

import { ReactNode } from 'react'
import { SWRConfig } from 'swr'
import request, { RequestOptions } from '@/utils/request'

export default function SWRProvider({ children }: { children: ReactNode }) {
  // 配置参数：https://swr.nodejs.cn/docs/api#options
  const options = {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    // keepPreviousData: true,
    fetcher: (args: string | [string, RequestOptions, any[]]) => {
      let url: string
      let params: RequestOptions | undefined
      let checks: any[] | undefined

      if (typeof args === 'string') {
        url = args
      } else {
        ;[url, params, checks] = args
      }

      if (!checks || checks.every(Boolean)) {
        return request(url, params)
      }
    },
  }

  return <SWRConfig value={options}>{children}</SWRConfig>
}
