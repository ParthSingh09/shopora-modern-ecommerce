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
});
