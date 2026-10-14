import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  CreditCard,
  AlertCircle,
  ArrowRight,
  ChevronLeft,
  Loader2,
  Terminal,
  Zap,
} from 'lucide-react';
import { useCartStore } from '../store/useCartStore';
import { useToastStore } from '../store/useToastStore';
import { ShippingAddress, ShippingSpeed, ShippingOption } from '../types/order';
import { api } from '../services/api';

export const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    items,
    getSubtotal,
    getDiscount,
    getShipping,
    getEstimatedTax,
    appliedCoupon,
    clearCart,
  } = useCartStore();

  const { addToast } = useToastStore();

  // Form Fields State
  const [formData, setFormData] = useState<ShippingAddress>({
    fullName: '',
    email: '',
    phone: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'United States',
  });

  // Validation Errors State
  const [errors, setErrors] = useState<Partial<Record<keyof ShippingAddress | 'cardNumber' | 'expiry' | 'cvv', string>>>({});

  // Shipping Speed
  const [shippingSpeed, setShippingSpeed] = useState<ShippingSpeed>('standard');

  // Payment Method
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'apple-pay'>('card');
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');

  // Processing state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [processingStage, setProcessingStage] = useState('');

  // Calculations
  const baseSubtotal = getSubtotal();
  const baseDiscount = getDiscount();
  const baseShipping = getShipping();
  const expressSurcharge = shippingSpeed === 'express-vault' ? 35 : 0;
  const finalShippingCost = baseShipping + expressSurcharge;
  const tax = getEstimatedTax();
  const finalTotal = Math.max(0, baseSubtotal - baseDiscount + finalShippingCost + tax);

  // If bag is empty
  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-24 text-center" id="main-content">
        <AlertCircle className="w-12 h-12 text-shopora-crimson mx-auto mb-4" />
        <h1 className="text-2xl font-display font-bold text-white uppercase">Your Bag is Empty</h1>
        <p className="text-sm text-shopora-muted mt-2 mb-6">
          You must have at least one silhouette in your bag before proceeding to checkout.
        </p>
        <Link
          to="/shop"
          className="px-6 py-3 rounded-xl bg-shopora-accent text-black font-bold uppercase text-xs tracking-wider"
        >
          Explore Drops
        </Link>
      </div>
    );
  }

  // Pre-fill valid sample details for convenient reviewer testing
  const handleAutofillDemo = () => {
    setFormData({
      fullName: 'Alex Vance',
      email: 'alex.vance@example.com',
      phone: '5550192834',
      addressLine1: '742 Evergreen Terrace',
      addressLine2: 'Apt 4B',
      city: 'Los Angeles',
      state: 'CA',
      zipCode: '90210',
      country: 'United States',
    });
    setCardNumber('4242 4242 4242 4242');
    setExpiry(`12/${String((new Date().getFullYear() + 2) % 100).padStart(2, '0')}`);
    setCvv('123');
    setErrors({});
    addToast('Demo shipping and test payment details filled!', 'info');
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, '').slice(0, 16);
    const formatted = raw.replace(/(\d{4})(?=\d)/g, '$1 ');
    setCardNumber(formatted);
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, '').slice(0, 4);
    if (raw.length >= 3) {
      setExpiry(`${raw.slice(0, 2)}/${raw.slice(2)}`);
    } else {
      setExpiry(raw);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.fullName.trim() || formData.fullName.trim().length < 3) {
      newErrors.fullName = 'Full legal name is required (min 3 characters).';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim() || !emailRegex.test(formData.email.trim())) {
      newErrors.email = 'Please provide a valid email address.';
    }

    const phoneClean = formData.phone.replace(/\D/g, '');
    if (!formData.phone.trim() || phoneClean.length < 10) {
      newErrors.phone = 'Valid 10-digit phone number required.';
    }

    if (!formData.addressLine1.trim() || formData.addressLine1.trim().length < 5) {
      newErrors.addressLine1 = 'Street address is required.';
    }

    if (!formData.city.trim()) {
      newErrors.city = 'City is required.';
    }

    if (!formData.state.trim()) {
      newErrors.state = 'State / Province is required.';
    }

    const zipRegex = /^\d{5}(-\d{4})?$/;
    if (!formData.zipCode.trim() || !zipRegex.test(formData.zipCode.trim())) {
      newErrors.zipCode = 'Enter a valid 5-digit ZIP code (e.g. 90210).';
    }

    if (paymentMethod === 'card') {
      const rawCard = cardNumber.replace(/\s/g, '');
      if (rawCard.length < 15) {
        newErrors.cardNumber = 'Enter a valid 15-16 digit test card number.';
      }

      const expiryMatch = /^(\d{2})\/(\d{2})$/.exec(expiry);
      const expMonth = expiryMatch ? Number(expiryMatch[1]) : 0;
      if (!expiryMatch || expMonth < 1 || expMonth > 12) {
        newErrors.expiry = 'MM/YY required.';
      } else {
        // Card is valid through the last day of its expiry month
        const expYear = 2000 + Number(expiryMatch[2]);
        if (new Date(expYear, expMonth, 1) <= new Date()) {
          newErrors.expiry = 'Card has expired.';
        }
      }

      if (!cvv || cvv.length < 3) {
        newErrors.cvv = '3-4 digits required.';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      addToast('Please complete all required shipping & payment fields.', 'error');
      window.scrollTo({ top: 100, behavior: 'smooth' });
      return;
    }

    setIsSubmitting(true);

    try {
      setProcessingStage('Simulating order validation...');
      await new Promise((r) => setTimeout(r, 600));

      setProcessingStage('Securing demo inventory reservation...');
      await new Promise((r) => setTimeout(r, 600));

      const shippingOptionObj: ShippingOption = {
        id: shippingSpeed,
        name: shippingSpeed === 'express-vault' ? 'Priority Overnight Armored Flight' : 'Standard Insured Courier',
        deliveryEstimate: shippingSpeed === 'express-vault' ? '1-2 Business Days' : '3-5 Business Days',
        price: finalShippingCost,
        description: 'Discreet double-box packaging with tracking confirmation',
      };

      const orderResult = await api.placeOrder({
        items,
        shippingAddress: formData,
        shippingOption: shippingOptionObj,
        paymentMethod: paymentMethod,
        subtotal: baseSubtotal,
        discount: baseDiscount,
        shippingCost: finalShippingCost,
        tax: tax,
        total: finalTotal,
        couponCode: appliedCoupon?.code,
      });

      // Clear the cart on successful checkout
      clearCart();

      // Navigate to order confirmation
      navigate(`/order-success?orderId=${orderResult.orderId}`);
    } catch {
      setIsSubmitting(false);
      addToast('Order simulation failed. Please try again.', 'error');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 animate-fade-in" id="main-content">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-shopora-border/60 pb-4">
        <div className="flex items-center gap-3">
          <Link
            to="/cart"
            className="p-2 rounded-xl bg-shopora-surface hover:bg-shopora-card text-shopora-muted hover:text-white transition-colors"
            title="Return to Bag"
          >
            <ChevronLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="font-display font-black text-2xl sm:text-3xl text-white uppercase tracking-tight">
              DEMO CHECKOUT
            </h1>
            <p className="text-xs text-shopora-muted font-mono mt-0.5">
              Frontend Demonstration • Simulated Order Processing
            </p>
          </div>
        </div>

        {/* Quick Autofill Helper Button */}
        <button
          type="button"
          onClick={handleAutofillDemo}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-shopora-surface hover:bg-shopora-card border border-shopora-border text-shopora-accent text-xs font-mono font-bold transition-colors"
        >
          <Zap className="w-3.5 h-3.5" />
          <span>Autofill Demo Details</span>
        </button>
      </div>

      {/* Demo Notice Banner */}
      <div className="p-3.5 rounded-xl bg-blue-950/30 border border-blue-900/40 text-xs text-blue-200 flex items-start gap-2.5">
        <Terminal className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
        <p>
          <strong>Portfolio Demo Mode:</strong> This checkout validates form logic, handles client state, and produces an order receipt. No real financial transactions or live card charges occur.
        </p>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Form Column (7 Cols) */}
        <form onSubmit={handleSubmitOrder} className="lg:col-span-7 space-y-6" noValidate>
          
          {/* Step 1: Contact Information */}
          <section className="p-5 sm:p-6 rounded-2xl bg-shopora-surface border border-shopora-border space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-shopora-border">
              <span className="w-5 h-5 rounded-full bg-shopora-accent text-black font-display font-bold text-xs flex items-center justify-center">
                1
              </span>
              <h2 className="font-display font-bold text-sm text-white uppercase tracking-wider">
                Contact &amp; Delivery Address
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {/* Full Name */}
              <div className="sm:col-span-2">
                <label htmlFor="fullName" className="block text-xs font-semibold text-slate-300 mb-1">
                  Full Name *
                </label>
                <input
                  id="fullName"
                  type="text"
                  placeholder="e.g. Alex Vance"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  aria-invalid={Boolean(errors.fullName)}
                  aria-describedby={errors.fullName ? 'fullName-error' : undefined}
                  className={`w-full px-3 py-2 bg-shopora-dark border rounded-xl text-xs text-white placeholder:text-shopora-muted focus:outline-none ${
                    errors.fullName ? 'border-shopora-crimson' : 'border-shopora-border focus:border-shopora-accent'
                  }`}
                />
                {errors.fullName && (
                  <p id="fullName-error" className="text-[11px] text-shopora-crimson mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> {errors.fullName}
                  </p>
                )}
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-xs font-semibold text-slate-300 mb-1">
                  Email Address *
                </label>
                <input
                  id="email"
                  type="email"
                  placeholder="alex@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  aria-invalid={Boolean(errors.email)}
                  aria-describedby={errors.email ? 'email-error' : undefined}
                  className={`w-full px-3 py-2 bg-shopora-dark border rounded-xl text-xs text-white placeholder:text-shopora-muted focus:outline-none ${
                    errors.email ? 'border-shopora-crimson' : 'border-shopora-border focus:border-shopora-accent'
                  }`}
                />
                {errors.email && (
                  <p id="email-error" className="text-[11px] text-shopora-crimson mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> {errors.email}
                  </p>
                )}
              </div>

              {/* Phone */}
              <div>
                <label htmlFor="phone" className="block text-xs font-semibold text-slate-300 mb-1">
                  Phone Number *
                </label>
                <input
                  id="phone"
                  type="tel"
                  placeholder="5550192834"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  aria-invalid={Boolean(errors.phone)}
                  aria-describedby={errors.phone ? 'phone-error' : undefined}
                  className={`w-full px-3 py-2 bg-shopora-dark border rounded-xl text-xs text-white placeholder:text-shopora-muted focus:outline-none ${
                    errors.phone ? 'border-shopora-crimson' : 'border-shopora-border focus:border-shopora-accent'
                  }`}
                />
                {errors.phone && (
                  <p id="phone-error" className="text-[11px] text-shopora-crimson mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> {errors.phone}
                  </p>
                )}
              </div>

              {/* Address Line 1 */}
              <div className="sm:col-span-2">
                <label htmlFor="addressLine1" className="block text-xs font-semibold text-slate-300 mb-1">
                  Street Address *
                </label>
                <input
                  id="addressLine1"
                  type="text"
                  placeholder="742 Evergreen Terrace, Apt 4B"
                  value={formData.addressLine1}
                  onChange={(e) => setFormData({ ...formData, addressLine1: e.target.value })}
                  aria-invalid={Boolean(errors.addressLine1)}
                  aria-describedby={errors.addressLine1 ? 'addressLine1-error' : undefined}
                  className={`w-full px-3 py-2 bg-shopora-dark border rounded-xl text-xs text-white placeholder:text-shopora-muted focus:outline-none ${
                    errors.addressLine1 ? 'border-shopora-crimson' : 'border-shopora-border focus:border-shopora-accent'
                  }`}
                />
                {errors.addressLine1 && (
                  <p id="addressLine1-error" className="text-[11px] text-shopora-crimson mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> {errors.addressLine1}
                  </p>
                )}
              </div>

              {/* City */}
              <div>
                <label htmlFor="city" className="block text-xs font-semibold text-slate-300 mb-1">City *</label>
                <input
                  id="city"
                  type="text"
                  placeholder="Los Angeles"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  aria-invalid={Boolean(errors.city)}
                  aria-describedby={errors.city ? 'city-error' : undefined}
                  className={`w-full px-3 py-2 bg-shopora-dark border rounded-xl text-xs text-white placeholder:text-shopora-muted focus:outline-none ${
                    errors.city ? 'border-shopora-crimson' : 'border-shopora-border focus:border-shopora-accent'
                  }`}
                />
                {errors.city && (
                  <p id="city-error" className="text-[11px] text-shopora-crimson mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> {errors.city}
                  </p>
                )}
              </div>

              {/* State & ZIP */}
              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label htmlFor="state" className="block text-xs font-semibold text-slate-300 mb-1">State *</label>
                  <input
                    id="state"
                    type="text"
                    placeholder="CA"
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    aria-invalid={Boolean(errors.state)}
                    aria-describedby={errors.state ? 'state-error' : undefined}
                    className={`w-full px-3 py-2 bg-shopora-dark border rounded-xl text-xs text-white placeholder:text-shopora-muted focus:outline-none ${
                      errors.state ? 'border-shopora-crimson' : 'border-shopora-border focus:border-shopora-accent'
                    }`}
                  />
                  {errors.state && (
                    <p id="state-error" className="text-[11px] text-shopora-crimson mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" /> {errors.state}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="zipCode" className="block text-xs font-semibold text-slate-300 mb-1">ZIP *</label>
                  <input
                    id="zipCode"
                    type="text"
                    placeholder="90210"
                    value={formData.zipCode}
                    onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}
                    aria-invalid={Boolean(errors.zipCode)}
                    aria-describedby={errors.zipCode ? 'zipCode-error' : undefined}
                    className={`w-full px-3 py-2 bg-shopora-dark border rounded-xl text-xs text-white placeholder:text-shopora-muted focus:outline-none ${
                      errors.zipCode ? 'border-shopora-crimson' : 'border-shopora-border focus:border-shopora-accent'
                    }`}
                  />
                  {errors.zipCode && (
                    <p id="zipCode-error" className="text-[11px] text-shopora-crimson mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" /> {errors.zipCode}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </section>

          {/* Step 2: Shipping Method */}
          <section className="p-5 sm:p-6 rounded-2xl bg-shopora-surface border border-shopora-border space-y-3">
            <div className="flex items-center gap-2 pb-3 border-b border-shopora-border">
              <span className="w-5 h-5 rounded-full bg-shopora-accent text-black font-display font-bold text-xs flex items-center justify-center">
                2
              </span>
              <h2 className="font-display font-bold text-sm text-white uppercase tracking-wider">
                Shipping Speed
              </h2>
            </div>

            <div className="space-y-2.5">
              <label
                className={`flex items-center justify-between p-3.5 rounded-xl border cursor-pointer transition-colors ${
                  shippingSpeed === 'standard'
                    ? 'border-shopora-accent bg-shopora-accent/10'
                    : 'border-shopora-border bg-shopora-dark/60 hover:border-slate-500'
                }`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="shippingSpeed"
                    checked={shippingSpeed === 'standard'}
                    onChange={() => setShippingSpeed('standard')}
                    className="accent-[#CCFF00] w-4 h-4 cursor-pointer"
                  />
                  <div>
                    <span className="font-bold text-xs text-white block">Standard Insured Courier</span>
                    <span className="text-[11px] text-shopora-muted">3-5 Business Days • Tracking Included</span>
                  </div>
                </div>
                <span className="font-mono font-bold text-xs text-white">
                  {baseShipping === 0 ? 'FREE' : `$${baseShipping}`}
                </span>
              </label>

              <label
                className={`flex items-center justify-between p-3.5 rounded-xl border cursor-pointer transition-colors ${
                  shippingSpeed === 'express-vault'
                    ? 'border-shopora-accent bg-shopora-accent/10'
                    : 'border-shopora-border bg-shopora-dark/60 hover:border-slate-500'
                }`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="shippingSpeed"
                    checked={shippingSpeed === 'express-vault'}
                    onChange={() => setShippingSpeed('express-vault')}
                    className="accent-[#CCFF00] w-4 h-4 cursor-pointer"
                  />
                  <div>
                    <span className="font-bold text-xs text-white block">Priority Vault Flight Overnight</span>
                    <span className="text-[11px] text-shopora-muted">1-2 Business Days • Expedited Dispatch</span>
                  </div>
                </div>
                <span className="font-mono font-bold text-xs text-white">
                  +${expressSurcharge}
                </span>
              </label>
            </div>
          </section>

          {/* Step 3: Demo Payment Simulation */}
          <section className="p-5 sm:p-6 rounded-2xl bg-shopora-surface border border-shopora-border space-y-3">
            <div className="flex items-center gap-2 pb-3 border-b border-shopora-border">
              <span className="w-5 h-5 rounded-full bg-shopora-accent text-black font-display font-bold text-xs flex items-center justify-center">
                3
              </span>
              <h2 className="font-display font-bold text-sm text-white uppercase tracking-wider">
                Simulated Payment Method
              </h2>
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setPaymentMethod('card')}
                className={`flex-1 py-2.5 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors ${
                  paymentMethod === 'card'
                    ? 'border-shopora-accent bg-shopora-accent/10 text-white font-bold'
                    : 'border-shopora-border bg-shopora-dark/60 text-slate-400'
                }`}
              >
                <CreditCard className="w-4 h-4" />
                <span>Simulated Card</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('apple-pay')}
                className={`flex-1 py-2.5 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors ${
                  paymentMethod === 'apple-pay'
                    ? 'border-shopora-accent bg-shopora-accent/10 text-white font-bold'
                    : 'border-shopora-border bg-shopora-dark/60 text-slate-400'
                }`}
              >
                <span>Demo Apple Pay</span>
              </button>
            </div>

            {paymentMethod === 'card' ? (
              <div className="space-y-3 pt-2">
                <div>
                  <label htmlFor="cardNumber" className="block text-xs font-semibold text-slate-300 mb-1">
                    Card Number (Demo Test Number) *
                  </label>
                  <input
                    id="cardNumber"
                    type="text"
                    placeholder="4242 4242 4242 4242"
                    value={cardNumber}
                    onChange={handleCardNumberChange}
                    className={`w-full px-3 py-2 bg-shopora-dark border rounded-xl text-xs font-mono text-white placeholder:text-shopora-muted focus:outline-none ${
                      errors.cardNumber ? 'border-shopora-crimson' : 'border-shopora-border focus:border-shopora-accent'
                    }`}
                  />
                  {errors.cardNumber && (
                    <p className="text-[11px] text-shopora-crimson mt-1">{errors.cardNumber}</p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label htmlFor="expiry" className="block text-xs font-semibold text-slate-300 mb-1">
                      Expiry (MM/YY) *
                    </label>
                    <input
                      id="expiry"
                      type="text"
                      placeholder="12/28"
                      value={expiry}
                      onChange={handleExpiryChange}
                      className={`w-full px-3 py-2 bg-shopora-dark border rounded-xl text-xs font-mono text-white placeholder:text-shopora-muted focus:outline-none ${
                        errors.expiry ? 'border-shopora-crimson' : 'border-shopora-border focus:border-shopora-accent'
                      }`}
                    />
                    {errors.expiry && (
                      <p className="text-[11px] text-shopora-crimson mt-1">{errors.expiry}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="cvv" className="block text-xs font-semibold text-slate-300 mb-1">
                      CVV *
                    </label>
                    <input
                      id="cvv"
                      type="password"
                      maxLength={4}
                      placeholder="•••"
                      value={cvv}
                      onChange={(e) => setCvv(e.target.value.replace(/\D/g, ''))}
                      className={`w-full px-3 py-2 bg-shopora-dark border rounded-xl text-xs font-mono text-white placeholder:text-shopora-muted focus:outline-none ${
                        errors.cvv ? 'border-shopora-crimson' : 'border-shopora-border focus:border-shopora-accent'
                      }`}
                    />
                    {errors.cvv && (
                      <p className="text-[11px] text-shopora-crimson mt-1">{errors.cvv}</p>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-4 rounded-xl bg-shopora-dark/60 border border-shopora-border text-center text-xs text-shopora-muted">
                One-Click biometric touch simulated. Click Complete Demo Order below.
              </div>
            )}
          </section>

          {/* Place Order CTA */}
          <div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 rounded-xl bg-shopora-accent hover:bg-shopora-accentHover text-black font-display font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>{processingStage}</span>
                </>
              ) : (
                <>
                  <span>Complete Demo Order (${finalTotal.toLocaleString()})</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </form>

        {/* Right Sidebar Summary */}
        <aside className="lg:col-span-5 p-5 rounded-2xl bg-shopora-surface border border-shopora-border space-y-5 lg:sticky lg:top-24">
          <div className="flex items-center justify-between pb-3 border-b border-shopora-border">
            <h2 className="font-display font-bold text-sm text-white uppercase tracking-wider">
              ORDER SUMMARY ({items.length})
            </h2>
            <Link to="/cart" className="text-xs text-shopora-accent hover:underline">
              Edit Bag
            </Link>
          </div>

          {/* Items Preview */}
          <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
            {items.map((item) => (
              <div key={item.id} className="flex gap-3 items-center text-xs">
                <img
                  src={item.product.images[0]}
                  alt={item.product.name}
                  className="w-12 h-12 object-cover rounded-lg bg-shopora-dark border border-shopora-border shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-white truncate">{item.product.name}</h3>
                  <div className="flex items-center gap-2 text-shopora-muted mt-0.5 font-mono text-[11px]">
                    <span>Size: {item.size}</span>
                    <span>•</span>
                    <span>Qty: {item.quantity}</span>
                  </div>
                </div>
                <div className="font-mono font-bold text-white shrink-0">
                  ${(item.product.price * item.quantity).toLocaleString()}
                </div>
              </div>
            ))}
          </div>

          {/* Pricing Totals */}
          <div className="space-y-2 pt-3 border-t border-shopora-border text-xs text-slate-300">
            <div className="flex justify-between">
              <span className="text-shopora-muted">Subtotal</span>
              <span className="font-mono text-white">${baseSubtotal.toLocaleString()}</span>
            </div>

            {baseDiscount > 0 && (
              <div className="flex justify-between text-shopora-accent">
                <span>Discount ({appliedCoupon?.code})</span>
                <span className="font-mono">-${baseDiscount.toLocaleString()}</span>
              </div>
            )}

            <div className="flex justify-between">
              <span className="text-shopora-muted">Insured Courier Shipping</span>
              <span className="font-mono text-white">
                {finalShippingCost === 0 ? (
                  <span className="text-shopora-accent font-semibold">FREE</span>
                ) : (
                  `$${finalShippingCost}`
                )}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-shopora-muted">Estimated Tax (8%)</span>
              <span className="font-mono text-white">${tax.toLocaleString()}</span>
            </div>

            <div className="flex justify-between pt-3 border-t border-shopora-border text-sm font-bold text-white">
              <span>Order Total</span>
              <span className="font-mono text-shopora-accent text-lg">
                ${finalTotal.toLocaleString()}
              </span>
            </div>
          </div>
        </aside>

      </div>
    </div>
  );
};
