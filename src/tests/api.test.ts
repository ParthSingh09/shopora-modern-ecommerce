import { describe, it, expect } from 'vitest';
import { api } from '../services/api';

describe('api service', () => {
  it('returns all products when no filters are applied', async () => {
    const res = await api.getProducts();
    expect(res.products.length).toBeGreaterThan(0);
    expect(res.total).toBe(res.products.length);
  });

  it('filters products by brand correctly', async () => {
    const res = await api.getProducts({ brand: 'Jordan' });
    expect(res.products.length).toBeGreaterThan(0);
    res.products.forEach((p) => {
      expect(p.brand).toBe('Jordan');
    });
  });

  it('filters products by category correctly', async () => {
    const res = await api.getProducts({ category: 'retro-high' });
    expect(res.products.length).toBeGreaterThan(0);
    res.products.forEach((p) => {
      expect(p.category).toBe('retro-high');
    });
  });

  it('searches products by keyword', async () => {
    const res = await api.getProducts({ searchQuery: 'Travis' });
    expect(res.products.length).toBeGreaterThan(0);
    res.products.forEach((p) => {
      const match =
        p.name.toLowerCase().includes('travis') ||
        p.brand.toLowerCase().includes('travis');
      expect(match).toBe(true);
    });
  });

  it('validates coupons and enforces minimum order rules', async () => {
    // STREET20 has $100 min order
    const validRes = await api.validateCoupon('STREET20', 300);
    expect(validRes.success).toBe(true);
    expect(validRes.coupon?.code).toBe('STREET20');

    // Below min order
    const invalidMin = await api.validateCoupon('STREET20', 50);
    expect(invalidMin.success).toBe(false);
    expect(invalidMin.error).toContain('minimum order');

    // Invalid code
    const invalidCode = await api.validateCoupon('FAKECODE99', 500);
    expect(invalidCode.success).toBe(false);
  });

  it('filters by price bracket correctly', async () => {
    // Under $250
    const under250 = await api.getProducts({ priceBracket: 'under-250' });
    expect(under250.products.length).toBeGreaterThan(0);
    under250.products.forEach((p) => {
      expect(p.price).toBeLessThan(250);
    });

    // $250 - $500
    const mid250to500 = await api.getProducts({ priceBracket: '250-500' });
    expect(mid250to500.products.length).toBeGreaterThan(0);
    mid250to500.products.forEach((p) => {
      expect(p.price).toBeGreaterThanOrEqual(250);
      expect(p.price).toBeLessThanOrEqual(500);
    });

    // $1000+
    const over1000 = await api.getProducts({ priceBracket: '1000-plus' });
    expect(over1000.products.length).toBeGreaterThan(0);
    over1000.products.forEach((p) => {
      expect(p.price).toBeGreaterThanOrEqual(1000);
    });
  });

  it('filters in-stock products only', async () => {
    const res = await api.getProducts({ onlyInStock: true });
    expect(res.products.length).toBeGreaterThan(0);
    res.products.forEach((p) => {
      expect(p.inStock).toBe(true);
    });
  });

  it('sorts products by price ascending and descending', async () => {
    const ascRes = await api.getProducts({ sortBy: 'price-asc' });
    for (let i = 0; i < ascRes.products.length - 1; i++) {
      expect(ascRes.products[i].price).toBeLessThanOrEqual(ascRes.products[i + 1].price);
    }

    const descRes = await api.getProducts({ sortBy: 'price-desc' });
    for (let i = 0; i < descRes.products.length - 1; i++) {
      expect(descRes.products[i].price).toBeGreaterThanOrEqual(descRes.products[i + 1].price);
    }
  });

  it('sorts products by customer rating', async () => {
    const ratingRes = await api.getProducts({ sortBy: 'rating-desc' });
    for (let i = 0; i < ratingRes.products.length - 1; i++) {
      expect(ratingRes.products[i].rating).toBeGreaterThanOrEqual(ratingRes.products[i + 1].rating);
    }
  });

  it('retrieves single product by slug and handles unknown slug', async () => {
    const existing = await api.getProductById('air-jordan-1-retro-high-og-chicago-lost-and-found');
    expect(existing).not.toBeNull();
    expect(existing?.brand).toBe('Jordan');

    const nonExistent = await api.getProductById('non-existent-sneaker-slug-xyz');
    expect(nonExistent).toBeNull();
  });

  it('creates and persists demo orders in localStorage simulation', async () => {
    const dummyOrder = {
      items: [],
      shippingAddress: {
        fullName: 'Test Collector',
        email: 'collector@example.com',
        phone: '555-0199',
        addressLine1: '742 Evergreen Terrace',
        city: 'Springfield',
        state: 'OR',
        zipCode: '97477',
        country: 'US',
      },
      shippingOption: {
        id: 'standard' as const,
        name: 'Standard Delivery',
        deliveryEstimate: '3-5 Business Days',
        price: 15,
        description: 'Standard insured delivery',
      },
      paymentMethod: 'card' as const,
      subtotal: 300,
      discount: 0,
      shippingCost: 15,
      tax: 24,
      total: 339,
    };

    const created = await api.placeOrder(dummyOrder);
    expect(created.orderId).toMatch(/^SHP-/);
    expect(created.verificationBadgeId).toMatch(/^AUTH-/);

    const fetched = await api.getOrder(created.orderId);
    expect(fetched).not.toBeNull();
    expect(fetched?.orderId).toBe(created.orderId);
    expect(fetched?.shippingAddress.fullName).toBe('Test Collector');
  });
});
