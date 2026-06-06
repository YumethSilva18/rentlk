import { create } from 'zustand'

interface CartItem {
  vehicleId: string
  vehicleName: string
  vehicleImage: string
  startDate: string
  endDate: string
  dailyRate: number
  totalAmount: number
  pickupLocation: string
  addOns: string[]
  notes?: string
}

interface CartState {
  items: CartItem[]
  itemCount: number

  // Actions
  addItem: (item: CartItem) => void
  removeItem: (vehicleId: string) => void
  updateItem: (vehicleId: string, data: Partial<CartItem>) => void
  clearCart: () => void
  getItem: (vehicleId: string) => CartItem | undefined
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  itemCount: 0,

  addItem: (item) =>
    set((state) => {
      const existing = state.items.find((i) => i.vehicleId === item.vehicleId)
      if (existing) {
        return {
          items: state.items.map((i) => (i.vehicleId === item.vehicleId ? item : i)),
        }
      }
      return {
        items: [...state.items, item],
        itemCount: state.itemCount + 1,
      }
    }),

  removeItem: (vehicleId) =>
    set((state) => ({
      items: state.items.filter((i) => i.vehicleId !== vehicleId),
      itemCount: state.itemCount - 1,
    })),

  updateItem: (vehicleId, data) =>
    set((state) => ({
      items: state.items.map((i) => (i.vehicleId === vehicleId ? { ...i, ...data } : i)),
    })),

  clearCart: () => set({ items: [], itemCount: 0 }),

  getItem: (vehicleId) => get().items.find((i) => i.vehicleId === vehicleId),
}))
