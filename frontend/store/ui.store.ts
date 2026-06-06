import { create } from 'zustand'

interface UIState {
  isSidebarOpen: boolean
  isMobileNavOpen: boolean
  isSearchModalOpen: boolean
  theme: 'light' | 'dark' | 'system'
  language: string
  toasts: Toast[]

  // Actions
  toggleSidebar: () => void
  setSidebarOpen: (open: boolean) => void
  toggleMobileNav: () => void
  setMobileNavOpen: (open: boolean) => void
  setSearchModalOpen: (open: boolean) => void
  setTheme: (theme: UIState['theme']) => void
  setLanguage: (language: string) => void
  addToast: (toast: Omit<Toast, 'id'>) => void
  removeToast: (id: string) => void
  clearToasts: () => void
}

interface Toast {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  title: string
  message?: string
  duration?: number
}

export const useUIStore = create<UIState>((set) => ({
  isSidebarOpen: false,
  isMobileNavOpen: false,
  isSearchModalOpen: false,
  theme: 'system',
  language: 'en',
  toasts: [],

  toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),

  setSidebarOpen: (open) => set({ isSidebarOpen: open }),

  toggleMobileNav: () => set((state) => ({ isMobileNavOpen: !state.isMobileNavOpen })),

  setMobileNavOpen: (open) => set({ isMobileNavOpen: open }),

  setSearchModalOpen: (open) => set({ isSearchModalOpen: open }),

  setTheme: (theme) => set({ theme }),

  setLanguage: (language) => set({ language }),

  addToast: (toast) =>
    set((state) => ({
      toasts: [
        ...state.toasts,
        { ...toast, id: `toast-${Date.now()}-${Math.random().toString(36).substring(2, 7)}` },
      ],
    })),

  removeToast: (id) =>
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    })),

  clearToasts: () => set({ toasts: [] }),
}))
