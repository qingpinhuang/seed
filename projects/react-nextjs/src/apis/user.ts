import { create } from 'zustand'
import { KeyedMutator } from 'swr'

export interface UserInfo {
  userId: string
  userName: string
  avatar: string
}

export const useUserStore = create<{
  userInfo: UserInfo | null | undefined
  refetch: KeyedMutator<{ userInfo: UserInfo }> | (() => void)
  initUserInfo: (state: {
    userInfo: UserInfo | null | undefined
    refetch: KeyedMutator<{ userInfo: UserInfo }>
  }) => void
}>((set) => ({
  userInfo: null,
  refetch: () => {},
  initUserInfo: (state) => set(state),
}))
