import { PRODUCTS, VALID_COUPONS } from '../data/products';
import { Product, FilterState } from '../types/product';
import { Coupon } from '../types/cart';
import { Order } from '../types/order';

const SIMULATE_LATENCY = 250; // ms

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export const api = {
  // Fetch all products or filtered products
  async getProducts(filters?: Partial<FilterState>): Promise<{ products: Product[]; total: number }> {
    await sleep(SIMULATE_LATENCY);

    let result = [...PRODUCTS];

    if (!filters) {
      return { products: result, total: result.length };
    }

    // 1. Search Query
    if (filters.searchQuery && filters.searchQuery.trim() !== '') {
      const q = filters.searchQuery.toLowerCase().trim();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q) ||
          p.colorway.toLowerCase().includes(q) ||
          p.sku.toLowerCase().includes(q)
      );
    }

    // 2. Category
    if (filters.category && filters.category !== 'all') {
      result = result.filter((p) => p.category === filters.category);
    }

    // 3. Brand
    if (filters.brand && filters.brand !== 'all') {
      result = result.filter((p) => p.brand.toLowerCase() === filters.brand?.toLowerCase());
    }

    // 4. In Stock Only
    if (filters.onlyInStock) {
      result = result.filter((p) => p.inStock);
    }

    // 5. Price Range
    if (filters.priceRange) {
      const [min, max] = filters.priceRange;
      result = result.filter((p) => p.price >= min && p.price <= max);
    }

    // 6. Selected Size Available
    if (filters.selectedSize) {
      result = result.filter(
        (p) => p.stockBySize[filters.selectedSize!] && p.stockBySize[filters.selectedSize!] > 0
      );
    }

    // 7. Sorting
    if (filters.sortBy) {
      switch (filters.sortBy) {
        case 'price-asc':
          result.sort((a, b) => a.price - b.price);
          break;
        case 'price-desc':
          result.sort((a, b) => b.price - a.price);
          break;
        case 'rating-desc':
          result.sort((a, b) => b.rating - a.rating || b.reviewCount - a.reviewCount);
          break;
        case 'newest':
          result.sort((a, b) => b.releaseYear - a.releaseYear);
          break;
        case 'featured':
        default:
          result.sort((a, b) => (b.isGrail ? 1 : 0) - (a.isGrail ? 1 : 0));
          break;
      }
    }

    return { products: result, total: result.length };
  },

  // Get product by ID or Slug
  async getProductById(idOrSlug: string): Promise<Product | null> {
    await sleep(SIMULATE_LATENCY);
    const product = PRODUCTS.find((p) => p.id === idOrSlug || p.slug === idOrSlug);
    return product ? { ...product } : null;
  },

  // Get Featured / Grail releases
  async getFeaturedProducts(): Promise<Product[]> {
    await sleep(SIMULATE_LATENCY);
    return PRODUCTS.filter((p) => p.isFeatured || p.isGrail).slice(0, 6);
  },

  // Verify promo coupon code
  async validateCoupon(code: string, currentSubtotal: number): Promise<{ success: boolean; coupon?: Coupon; error?: string }> {
    await sleep(SIMULATE_LATENCY / 2);
    const cleaned = code.trim().toUpperCase();
    const coupon = VALID_COUPONS.find((c) => c.code === cleaned);

    if (!coupon) {
      return { success: false, error: 'Invalid coupon code. Try STREET20 or GRAIL50.' };
    }

    if (coupon.minOrderValue && currentSubtotal < coupon.minOrderValue) {
      return {
        success: false,
        error: `Coupon ${coupon.code} requires a minimum order of $${coupon.minOrderValue}.`,
      };
    }

    return { success: true, coupon };
  },

  // Submit Order
  async placeOrder(order: Omit<Order, 'orderId' | 'verificationBadgeId' | 'status' | 'date'>): Promise<Order> {
    await sleep(800); // Simulate authenticating gateway

    // Generate authenticated order payload
    const orderId = `SHP-${Math.floor(100000 + Math.random() * 900000)}`;
    const verificationBadgeId = `AUTH-NFC-${Math.random().toString(36).substring(2, 9).toUpperCase()}`;

    const completeOrder: Order = {
      ...order,
      orderId,
      date: new Date().toISOString(),
      verificationBadgeId,
      status: 'confirmed',
    };

    // Store in localStorage for persistence and receipt lookup
    try {
      const orders = JSON.parse(localStorage.getItem('shopora_orders') || '[]');
      orders.unshift(completeOrder);
      localStorage.setItem('shopora_orders', JSON.stringify(orders));
    } catch {
      // ignore
    }

    return completeOrder;
  },

  // Get order by ID
  async getOrder(orderId: string): Promise<Order | null> {
    await sleep(150);
    try {
      const orders: Order[] = JSON.parse(localStorage.getItem('shopora_orders') || '[]');
      return orders.find((o) => o.orderId === orderId) || null;
    } catch {
      return null;
    }
  }
};
