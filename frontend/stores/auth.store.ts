import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { User } from '@/types/user.types'

// ============================================================================
// Auth Store - Mock authentication using localStorage
// All mock users have password: "password123"
// ============================================================================

interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean

  // Actions
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  signup: (data: { name: string; email: string; phone: string; password: string }) => Promise<{ success: boolean; error?: string }>
  logout: () => void
  updateUser: (updates: Partial<User>) => void
  setUser: (user: User) => void
}

// Mock users stored in memory (imported separately to avoid circular deps)
const MOCK_USERS_DATA = [
  {
    id: 'user-001',
    email: 'kasun@example.com',
    password: 'password123',
    name: 'Kasun Perera',
    phone: '+94 71 234 5678',
    avatar: null as string | null,
    kycStatus: 'approved' as const,
    isVerified: true,
    role: 'user' as const,
    rating: 4.8,
    totalReviews: 23,
    joinedAt: '2025-01-15T10:00:00Z',
    lastActive: new Date().toISOString(),
  },
  {
    id: 'user-002',
    email: 'nimal@example.com',
    password: 'password123',
    name: 'Nimal Silva',
    phone: '+94 77 456 7890',
    avatar: null as string | null,
    kycStatus: 'pending' as const,
    isVerified: false,
    role: 'user' as const,
    rating: 4.5,
    totalReviews: 8,
    joinedAt: '2025-03-20T10:00:00Z',
    lastActive: new Date().toISOString(),
  },
  {
    id: 'user-003',
    email: 'dilini@example.com',
    password: 'password123',
    name: 'Dilini Fernando',
    phone: '+94 76 789 0123',
    avatar: null as string | null,
    kycStatus: 'approved' as const,
    isVerified: true,
    role: 'user' as const,
    rating: 4.9,
    totalReviews: 41,
    joinedAt: '2024-11-05T10:00:00Z',
    lastActive: new Date().toISOString(),
  },
  {
    id: 'user-004',
    email: 'ruwan@example.com',
    password: 'password123',
    name: 'Ruwan Jayawardena',
    phone: '+94 70 123 4567',
    avatar: null as string | null,
    kycStatus: 'not_started' as const,
    isVerified: false,
    role: 'user' as const,
    rating: undefined as number | undefined,
    totalReviews: 0,
    joinedAt: '2026-05-28T10:00:00Z',
    lastActive: new Date().toISOString(),
  },
  {
    id: 'admin-001',
    email: 'admin@rentlk.com',
    password: 'password123',
    name: 'Admin User',
    phone: '+94 11 234 5678',
    avatar: null as string | null,
    kycStatus: 'approved' as const,
    isVerified: true,
    role: 'admin' as const,
    rating: undefined as number | undefined,
    totalReviews: 0,
    joinedAt: '2024-01-01T10:00:00Z',
    lastActive: new Date().toISOString(),
  },
]

function stripPassword(user: typeof MOCK_USERS_DATA[number]): User {
  const { password, ...safeUser } = user
  return safeUser as User
}

function generateMockToken(userId: string): string {
  return `mock-jwt-${userId}-${Date.now()}`
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,

      login: async (email: string, password: string) => {
        set({ isLoading: true })

        // Simulate network delay
        await new Promise((resolve) => setTimeout(resolve, 500))

        const found = MOCK_USERS_DATA.find(
          (u) => u.email.toLowerCase() === email.toLowerCase()
        )

        if (!found) {
          set({ isLoading: false })
          return { success: false, error: 'No account found with this email' }
        }

        if (found.password !== password) {
          set({ isLoading: false })
          return { success: false, error: 'Incorrect password' }
        }

        const user = stripPassword(found)
        set({
          user,
          token: generateMockToken(user.id),
          isAuthenticated: true,
          isLoading: false,
        })

        return { success: true }
      },

      signup: async (data) => {
        set({ isLoading: true })

        // Simulate network delay
        await new Promise((resolve) => setTimeout(resolve, 500))

        const exists = MOCK_USERS_DATA.find(
          (u) => u.email.toLowerCase() === data.email.toLowerCase()
        )

        if (exists) {
          set({ isLoading: false })
          return { success: false, error: 'An account with this email already exists' }
        }

        const newUser: User = {
          id: `user-${Date.now()}`,
          email: data.email,
          name: data.name,
          phone: data.phone,
          avatar: undefined,
          kycStatus: 'not_started',
          isVerified: false,
          role: 'user',
          rating: undefined,
          totalReviews: 0,
          joinedAt: new Date().toISOString(),
          lastActive: new Date().toISOString(),
        }

        // Add to mock users array
        MOCK_USERS_DATA.push({
          ...newUser,
          password: data.password,
          rating: undefined,
        } as typeof MOCK_USERS_DATA[number])

        set({
          user: newUser,
          token: generateMockToken(newUser.id),
          isAuthenticated: true,
          isLoading: false,
        })

        return { success: true }
      },

      logout: () => {
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          isLoading: false,
        })
      },

      updateUser: (updates) => {
        const current = get().user
        if (current) {
          set({ user: { ...current, ...updates } })
        }
      },

      setUser: (user) => {
        set({ user, isAuthenticated: true })
      },
    }),
    {
      name: 'rentlk-auth-storage',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
)

// Helper: get all mock users for quick login UI
export function getMockUsers() {
  return MOCK_USERS_DATA.map((u) => ({
    id: u.id,
    email: u.email,
    name: u.name,
    role: u.role,
    kycStatus: u.kycStatus,
    avatar: u.avatar,
  }))
}
