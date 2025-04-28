import { useEffect } from 'react'
import { create } from 'zustand'
import useSWR, { SWRConfiguration } from 'swr'
import useSWRMutation from 'swr/mutation'
import request, { RequestOptions } from '@/utils/request'
import { useUserStore, UserInfo } from '@/apis/user'

export const useAuthStore = create<{
  /**
   * Telegram Mini-App 的初始化信息
   * https://docs.telegram-mini-apps.com/zh/platform/init-data
   */
  rawInitData: string | null | undefined
  setRawInitData: (rawInitData: string | null | undefined) => void
}>((set) => ({
  rawInitData: null,
  setRawInitData: (rawInitData) => set({ rawInitData }),
}))

/**
 * 请求时附带用户认证信息：{ header: { authorization: `tma ${rawInitData}` }}
 */
export default function useAuthSWR<
  Data = any,
  Error = any,
  Params extends Record<string, any> = any,
>(
  url: string,
  options: RequestOptions<Params> & { checks?: any[] } = {},
  config?: SWRConfiguration<Data, Error>,
) {
  const rawInitData = useAuthStore((state) => state.rawInitData)
  const userInfo = useUserStore((state) => state.userInfo)

  const { headers, checks, ..._options } = options

  // 采用多参数的方式发起请求，注意 fetcher 要适配处理：
  // https://swr.nodejs.cn/docs/arguments#multiple-arguments
  return useSWR<Data, Error>(
    [
      url,
      {
        headers: {
          authorization: `tma ${rawInitData}`,
          ...headers,
        },
        ..._options,
      },
      // 接口需要登录后才能发起请求（有用户身份信息即为已登录）
      [!!userInfo, ...(checks || [])],
    ],
    config,
  )
}

/**
 * 获取用户信息（自动注册并登录，故而需要最优先发起请求）
 */
export function useUserInfo() {
  const rawInitData = useAuthStore((state) => state.rawInitData)
  const initUserInfo = useUserStore((state) => state.initUserInfo)

  const { data, mutate } = useSWR<{ userInfo: UserInfo }>([
    '/user/info',
    { headers: { authorization: `tma ${rawInitData}` } },
    [rawInitData],
  ])

  useEffect(
    () => {
      initUserInfo({
        userInfo: data?.userInfo,
        refetch: mutate,
      })
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [data],
  )

  return { userInfo: data?.userInfo, refetch: mutate }
}

export function useAuthSWRMutation<
  Data = any,
  Error = any,
  Params extends Record<string, any> = any,
>(key: string) {
  const rawInitData = useAuthStore((state) => state.rawInitData)

  return useSWRMutation<
    Data | null,
    Error,
    string,
    RequestOptions<Params, Data> | undefined
  >(key, (url, { arg }) => {
    const { headers, ...options } = arg || {}

    if (!rawInitData) {
      console.error('Not user rawInitData')
      return null
    }

    return request<Data>(url, {
      headers: {
        authorization: `tma ${rawInitData}`,
        ...headers,
      },
      ...options,
    })
  })
}
