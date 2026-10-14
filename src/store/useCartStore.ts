import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CartItem, Coupon } from '../types/cart';
import { Product } from '../types/product';

export const FREE_SHIPPING_THRESHOLD = 250;
export const STANDARD_SHIPPING_RATE = 15;
export const ESTIMATED_TAX_RATE = 0.08; // 8%

const subtotalOf = (items: CartItem[]) =>
  items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

// A coupon stays applied only while the bag still meets its minimum order value
const eligibleCoupon = (coupon: Coupon | null, items: CartItem[]) =>
  coupon && subtotalOf(items) >= (coupon.minOrderValue ?? 0) ? coupon : null;

interface CartStoreState {
  items: CartItem[];
  appliedCoupon: Coupon | null;
  isDrawerOpen: boolean;

  // Actions
  addToCart: (product: Product, size: string, color?: string, quantity?: number) => { success: boolean; message: string };
  removeFromCart: (cartItemId: string) => void;
  updateQuantity: (cartItemId: string, newQuantity: number) => { success: boolean; message?: string };
  clearCart: () => void;
  applyCoupon: (coupon: Coupon) => void;
  removeCoupon: () => void;
  setDrawerOpen: (isOpen: boolean) => void;
  toggleDrawer: () => void;

  // Computed Getters
  getItemCount: () => number;
  getSubtotal: () => number;
  getDiscount: () => number;
  getShipping: () => number;
  getEstimatedTax: () => number;
  getTotal: () => number;
  getFreeShippingProgress: () => { percent: number; remaining: number; qualified: boolean };
}

export const useCartStore = create<CartStoreState>()(
  persist(
    (set, get) => ({
      items: [],
      appliedCoupon: null,
      isDrawerOpen: false,

      addToCart: (product, size, color = product.colors[0], quantity = 1) => {
        // Check if size is valid and in stock
        const availableStock = product.stockBySize[size] ?? 0;
        if (availableStock <= 0) {
          return {
            success: false,
            message: `Size ${size} is currently out of stock.`,
          };
        }

        const cartItemId = `${product.id}-${size}-${color}`;
        const existing = get().items.find((i) => i.id === cartItemId);
        const currentQty = existing ? existing.quantity : 0;
        const targetQty = currentQty + quantity;

        if (targetQty > availableStock) {
          return {
            success: false,
            message: `Only ${availableStock} pair(s) available in size ${size}.`,
          };
        }

        if (existing) {
          set({
            items: get().items.map((i) =>
              i.id === cartItemId ? { ...i, quantity: targetQty } : i
            ),
          });
        } else {
          const newItem: CartItem = {
            id: cartItemId,
            product,
            size,
            color,
            quantity,
            priceAtAddition: product.price,
          };
          set({ items: [...get().items, newItem] });
        }

        return {
          success: true,
          message: `Added ${product.name} (${size}) to your bag.`,
        };
      },

      removeFromCart: (cartItemId) => {
        const items = get().items.filter((i) => i.id !== cartItemId);
        set({ items, appliedCoupon: eligibleCoupon(get().appliedCoupon, items) });
      },

      updateQuantity: (cartItemId, newQuantity) => {
        const item = get().items.find((i) => i.id === cartItemId);
        if (!item) return { success: false, message: 'Item not found.' };

        if (newQuantity <= 0) {
          get().removeFromCart(cartItemId);
          return { success: true, message: 'Item removed from bag.' };
        }

        const maxAvailable = item.product.stockBySize[item.size] ?? 0;
        if (newQuantity > maxAvailable) {
          return {
            success: false,
            message: `Cannot add more. Only ${maxAvailable} available in stock.`,
          };
        }

        const items = get().items.map((i) =>
          i.id === cartItemId ? { ...i, quantity: newQuantity } : i
        );
        set({ items, appliedCoupon: eligibleCoupon(get().appliedCoupon, items) });

        return { success: true };
      },

      clearCart: () => {
        set({ items: [], appliedCoupon: null });
      },

      applyCoupon: (coupon) => {
        set({ appliedCoupon: coupon });
      },

      removeCoupon: () => {
        set({ appliedCoupon: null });
      },

      setDrawerOpen: (isOpen) => {
        set({ isDrawerOpen: isOpen });
      },

      toggleDrawer: () => {
        set({ isDrawerOpen: !get().isDrawerOpen });
      },

      getItemCount: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },

      getSubtotal: () => {
        return subtotalOf(get().items);
      },

      getDiscount: () => {
        const subtotal = get().getSubtotal();
        const coupon = eligibleCoupon(get().appliedCoupon, get().items);
        if (!coupon) return 0;

        if (coupon.discountPercent) {
          return Math.round(subtotal * (coupon.discountPercent / 100));
        }
        if (coupon.discountAmount) {
          return Math.min(coupon.discountAmount, subtotal);
        }
        return 0;
      },

      getShipping: () => {
        const subtotal = get().getSubtotal();
        if (subtotal === 0) return 0;
        if (subtotal >= FREE_SHIPPING_THRESHOLD) return 0;
        // Check if FREESHIP coupon applied
        if (eligibleCoupon(get().appliedCoupon, get().items)?.code === 'FREESHIP') return 0;
        return STANDARD_SHIPPING_RATE;
      },

      getEstimatedTax: () => {
        const subtotal = get().getSubtotal();
        const discount = get().getDiscount();
        const taxableAmount = Math.max(0, subtotal - discount);
        return Math.round(taxableAmount * ESTIMATED_TAX_RATE * 100) / 100;
      },

      getTotal: () => {
        const subtotal = get().getSubtotal();
        if (subtotal === 0) return 0;
        const discount = get().getDiscount();
        const shipping = get().getShipping();
        const tax = get().getEstimatedTax();
        return Math.max(0, subtotal - discount + shipping + tax);
      },

      getFreeShippingProgress: () => {
        const subtotal = get().getSubtotal();
        const remaining = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
        const percent = Math.min(100, Math.round((subtotal / FREE_SHIPPING_THRESHOLD) * 100));
        return {
          percent,
          remaining,
          qualified: subtotal >= FREE_SHIPPING_THRESHOLD,
        };
      },
    }),
    {
      name: 'shopora_cart_storage',
      // Persist only items and coupon
      partialize: (state) => ({
        items: state.items,
        appliedCoupon: state.appliedCoupon,
      }),
    }
  )
);
