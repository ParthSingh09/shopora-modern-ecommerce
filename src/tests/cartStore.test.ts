import { describe, it, expect, beforeEach } from 'vitest';
import { useCartStore } from '../store/useCartStore';
import { Product } from '../types/product';

const mockProduct: Product = {
  id: 'test-01',
  name: 'Air Jordan 1 Chicago Lost & Found',
  slug: 'aj1-chicago-lost-found',
  brand: 'Jordan',
  category: 'retro-high',
  price: 400,
  description: 'Test description',
  story: 'Test story',
  images: ['https://images.unsplash.com/photo-1552346154-21d32810aba3'],
  colors: ['Chicago Red'],
  sizes: ['US 9', 'US 10'],
  stockBySize: {
    'US 9': 2,
    'US 10': 0, // Out of stock size
  },
  inStock: true,
  rating: 4.9,
  reviewCount: 10,
  reviews: [],
  sku: 'TEST-001',
  releaseYear: 2022,
  colorway: 'Red/White',
};

describe('useCartStore', () => {
  beforeEach(() => {
    useCartStore.getState().clearCart();
  });

  it('adds an in-stock product to the cart with selected size', () => {
    const result = useCartStore.getState().addToCart(mockProduct, 'US 9');
    expect(result.success).toBe(true);

    const state = useCartStore.getState();
    expect(state.items.length).toBe(1);
    expect(state.items[0].product.name).toBe('Air Jordan 1 Chicago Lost & Found');
    expect(state.items[0].size).toBe('US 9');
    expect(state.items[0].quantity).toBe(1);
    expect(state.getItemCount()).toBe(1);
    expect(state.getSubtotal()).toBe(400);
  });

  it('rejects adding an out-of-stock size to the cart', () => {
    const result = useCartStore.getState().addToCart(mockProduct, 'US 10');
    expect(result.success).toBe(false);
    expect(result.message).toContain('out of stock');

    const state = useCartStore.getState();
    expect(state.items.length).toBe(0);
  });

  it('prevents adding quantity exceeding available size stock', () => {
    // Stock is 2
    useCartStore.getState().addToCart(mockProduct, 'US 9', undefined, 2);
    // Try to add 1 more
    const secondAdd = useCartStore.getState().addToCart(mockProduct, 'US 9', undefined, 1);
    expect(secondAdd.success).toBe(false);
    expect(secondAdd.message).toContain('Only 2 pair(s) available');
  });

  it('updates quantity and recalculates totals', () => {
    useCartStore.getState().addToCart(mockProduct, 'US 9');
    const itemId = useCartStore.getState().items[0].id;

    useCartStore.getState().updateQuantity(itemId, 2);
    expect(useCartStore.getState().getItemCount()).toBe(2);
    expect(useCartStore.getState().getSubtotal()).toBe(800);

    // Reducing to 0 removes the item
    useCartStore.getState().updateQuantity(itemId, 0);
    expect(useCartStore.getState().items.length).toBe(0);
  });

  it('applies percentage coupon correctly', () => {
    useCartStore.getState().addToCart(mockProduct, 'US 9'); // subtotal = 400
    useCartStore.getState().applyCoupon({
      code: 'STREET20',
      discountPercent: 20,
      description: '20% off',
    });

    const state = useCartStore.getState();
    expect(state.getDiscount()).toBe(80); // 20% of 400
    // Orders >= $250 qualify for free shipping ($0)
    expect(state.getShipping()).toBe(0);
  });

  it('charges standard shipping for orders below threshold', () => {
    const cheapProduct = { ...mockProduct, price: 100 };
    useCartStore.getState().addToCart(cheapProduct, 'US 9');

    const state = useCartStore.getState();
    expect(state.getSubtotal()).toBe(100);
    expect(state.getShipping()).toBe(15);
  });
});
