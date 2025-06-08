import { create } from 'zustand'

interface AuthState {
  user: null | { id: string; name: string }
  setUser: (user: AuthState['user']) => void
}

export const useAuth = create<AuthState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
}))
