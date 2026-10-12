import { Product } from './product';

export interface CartItem {
  id: string; // unique combo: `${product.id}-${size}-${color}`
  product: Product;
  size: string;
  color: string;
  quantity: number;
  priceAtAddition: number;
}

export interface Coupon {
  code: string;
  discountPercent?: number;
  discountAmount?: number;
  description: string;
  minOrderValue?: number;
}

export interface CartCalculation {
  subtotal: number;
  discount: number;
  appliedCoupon: Coupon | null;
  shipping: number;
  estimatedTax: number;
  authenticationFee: number;
  total: number;
  freeShippingThreshold: number;
  amountNeededForFreeShipping: number;
}
