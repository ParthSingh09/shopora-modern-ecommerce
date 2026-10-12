import { CartItem } from './cart';

export interface ShippingAddress {
  fullName: string;
  email: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export type ShippingSpeed = 'standard' | 'express-vault';

export interface ShippingOption {
  id: ShippingSpeed;
  name: string;
  deliveryEstimate: string;
  price: number;
  description: string;
}

export interface PaymentDetails {
  cardNumber: string;
  cardHolder: string;
  expiryDate: string;
  cvv: string;
}

export interface Order {
  orderId: string;
  date: string;
  items: CartItem[];
  shippingAddress: ShippingAddress;
  shippingOption: ShippingOption;
  paymentMethod: 'card' | 'apple-pay' | 'crypto';
  subtotal: number;
  discount: number;
  shippingCost: number;
  tax: number;
  total: number;
  couponCode?: string;
  verificationBadgeId: string;
  status: 'confirmed' | 'authenticating' | 'shipped';
}
