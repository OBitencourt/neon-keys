import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Product } from "@/src/types/product";
import type { CartItem } from "@/src/types/cart";

export const MAX_QUANTITY = 10;

interface CartState {
  items: CartItem[];
  hydrated: boolean;
  isOpen: boolean;
  setHydrated: () => void;
  openCart: () => void;
  closeCart: () => void;
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      hydrated: false,
      isOpen: false,
      setHydrated: () => set({ hydrated: true }),
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      addItem: (product, quantity = 1) =>
        set((state) => {
          const exists = state.items.some((i) => i.product.id === product.id);
          const items = exists
            ? state.items.map((item) =>
                item.product.id === product.id
                  ? { ...item, quantity: Math.min(item.quantity + quantity, MAX_QUANTITY) }
                  : item,
              )
            : [...state.items, { product, quantity: Math.min(quantity, MAX_QUANTITY) }];
          return { items, isOpen: true };
        }),
      removeItem: (id) =>
        set((state) => ({ items: state.items.filter((i) => i.product.id !== id) })),
      updateQuantity: (id, quantity) =>
        set((state) => ({
          items:
            quantity < 1
              ? state.items.filter((item) => item.product.id !== id)
              : state.items.map((item) =>
                  item.product.id === id
                    ? { ...item, quantity: Math.min(quantity, MAX_QUANTITY) }
                    : item,
                ),
        })),
      clearCart: () => set({ items: [] }),
    }),
    {
      name: "neonkeys-cart",
      skipHydration: true, // evita erro de hydration no Next
      partialize: (state) => ({ items: state.items }), // só os itens vão para o localStorage
      onRehydrateStorage: () => (state) => state?.setHydrated(),
    },
  ),
);

// Mesma API de antes: itemCount e subtotal calculados
export function useCart() {
  const state = useCartStore();
  const itemCount = state.items.reduce((n, i) => n + i.quantity, 0);
  const subtotal =
    Math.round(
      state.items.reduce((sum, i) => sum + i.product.price * i.quantity, 0) * 100,
    ) / 100;
  return { ...state, itemCount, subtotal };
}