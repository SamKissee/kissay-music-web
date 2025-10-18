import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
  variantId: number;
  syncVariantId: number;
  productId: number;
  name: string;
  size: string;
  color: string;
  price: number;
  quantity: number;
  image: string;
  sku?: string;
}

interface CartStore {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (variantId: number) => void;
  updateQuantity: (variantId: number, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (item) =>
        set((state) => {
          // Check if item already exists in cart
          const existingItemIndex = state.items.findIndex(
            (i) => i.variantId === item.variantId
          );

          if (existingItemIndex > -1) {
            // Update quantity if item exists
            const newItems = [...state.items];
            newItems[existingItemIndex].quantity += item.quantity;
            return { items: newItems };
          } else {
            // Add new item
            return { items: [...state.items, item] };
          }
        }),

      removeItem: (variantId) =>
        set((state) => ({
          items: state.items.filter((item) => item.variantId !== variantId),
        })),

      updateQuantity: (variantId, quantity) =>
        set((state) => {
          if (quantity <= 0) {
            // Remove item if quantity is 0 or less
            return {
              items: state.items.filter((item) => item.variantId !== variantId),
            };
          }

          const newItems = state.items.map((item) =>
            item.variantId === variantId ? { ...item, quantity } : item
          );
          return { items: newItems };
        }),

      clearCart: () => set({ items: [] }),

      getTotalItems: () => {
        const state = get();
        return state.items.reduce((total, item) => total + item.quantity, 0);
      },

      getTotalPrice: () => {
        const state = get();
        return state.items.reduce(
          (total, item) => total + item.price * item.quantity,
          0
        );
      },
    }),
    {
      name: 'kissay-cart-storage', // localStorage key
    }
  )
);
