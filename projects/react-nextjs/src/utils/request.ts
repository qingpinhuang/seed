import { translate } from '@/constants/message'
import { toast } from '@/components/Modal'

interface ResponseData<Data = any> {
  code: number | string
  data: Data
  message: string
}

export interface RequestOptions<
  Params extends Record<string, any> = any,
  Data = any,
> extends Omit<RequestInit, 'body'> {
  trim?: boolean
  body?: Params
  rawJson?: Params
  formData?: Params
  formUrlencoded?: Params
  handleSuccessMessage?: (response: ResponseData<Data>) => any
  handleErrorMessage?: (response: ResponseData<Data>) => any
  handleCatchMessage?: (error: Error) => any
}

export function isValid(val: any): boolean {
  if (Array.isArray(val)) return val.length > 0

  return (
    val !== '' &&
    val !== null &&
    val !== undefined &&
    JSON.stringify(val) !== '{}'
  )
}

export function trimParams(
  arg: Record<string, any> = {},
  callback?: (value: [string, any]) => void,
) {
  const params: Record<string, any> = {}

  Object.entries(arg).forEach(([key, value]) => {
    if (value !== undefined && value !== '') {
      params[key] = value
      callback?.([key, value])
    }
  })

  return params
}

export function encodeParams(arg: Record<string, any> = {}) {
  const params: string[] = []

  trimParams(arg, ([key, value]: [string, any]) => {
    params.push(`${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
  })

  return params.join('&')
}

export function formDataParams(arg: Record<string, any> = {}) {
  const formData = new FormData()

  trimParams(arg, ([key, value]: [string, any]) => {
    if (value instanceof File) {
      if (Array.isArray(value)) {
        value.forEach((v) => formData.append(key, v))
      } else {
        formData.append(key, value)
      }
    } else if (value instanceof Object) {
      formData.append(key, JSON.stringify(value))
    } else {
      formData.append(key, value)
    }
  })

  return formData
}

function optionInit(
  url: string,
  params: RequestOptions,
): [
  string,
  RequestInit,
  Required<
    Pick<
      RequestOptions,
      'handleSuccessMessage' | 'handleErrorMessage' | 'handleCatchMessage'
    >
  >,
] {
  const defaultConfig = {
    method: 'GET',
    mode: 'cors',
    headers: {},
    credentials: 'include',
    redirect: 'follow',
    handleSuccessMessage() {},
    handleErrorMessage() {},
    handleCatchMessage() {},
  }

  const {
    trim = true,
    body,
    rawJson,
    formData,
    formUrlencoded,
    handleSuccessMessage,
    handleErrorMessage,
    handleCatchMessage,
    ...others
  } = Object.assign({}, defaultConfig, params)

  const options: RequestInit = { ...others }

  if (body) {
    url += '?' + encodeParams(body)
  }

  options.headers = new Headers(params.headers)

  if (options.method === 'POST') {
    if (rawJson) {
      options.headers.append('Content-Type', 'application/json; charset=utf-8')
      options.body = JSON.stringify(trim ? trimParams(rawJson) : rawJson)
    } else if (formUrlencoded) {
      options.headers.append(
        'Content-Type',
        'application/x-www-form-urlencoded; charset=utf-8',
      )
      options.body = encodeParams(formUrlencoded)
    } else if (formData) {
      options.headers.append(
        'Content-Type',
        'multipart/form-data; charset=utf-8',
      )
      options.body = formDataParams(formData)
    }
  }

  if (process.env.NEXT_PUBLIC_ENV === 'DEV') {
    // 接口本地代理
    options.headers.append('X-Fetch-Type', 'API')
  }

  return [
    url.match(/https?:\/\//) ? url : process.env.NEXT_PUBLIC_API_BASE + url,
    options,
    { handleSuccessMessage, handleErrorMessage, handleCatchMessage },
  ]
}

export default async function request<Data>(
  url: string,
  options?: RequestOptions,
) {
  const [_url, init, callback] = optionInit(url, options ?? {})

  try {
    const response = await fetch(_url, init)
    const res: ResponseData<Data> = await response.json()

    if (!response.ok) {
      throw new Error(res.code.toString())
    }

    if (res.code === 200) {
      callback.handleSuccessMessage(res)
      return res.data
    } else if (res.code === 701) {
      // code === 701: 与后台约定的可以弹出的错误提示
      console.warn(res)
      toast(translate(res.message))
      return null
    } else {
      console.warn(res)
      callback.handleErrorMessage(res)
      return null
    }
  } catch (error: any) {
    callback.handleCatchMessage(error)
    return null
  }
}
