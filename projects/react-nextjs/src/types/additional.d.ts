/**
 * 额外的全局类型声明
 */

/**
 * 合并两个类型，并且 N 的声明覆盖 M 的同名声明
 */
type Merge<M, N> = Omit<M, Extract<keyof M, keyof N>> & N

/**
 * .mp4 文件支持
 */
declare module '*.mp4' {
  export default string
}

declare module '*.svg' {
  import { FC, SVGProps } from 'react'
  const content: FC<SVGProps<SVGElement>>
  export default content
}

declare module '*.svg?url' {
  const content: any
  export default content
}
