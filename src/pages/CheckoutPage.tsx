import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  ShieldCheck,
  Lock,
  Truck,
  CreditCard,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  ChevronLeft,
  Loader2,
  Clock,
  Sparkles,
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
    getTotal,
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
  const [cardHolder, setCardHolder] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');

  // Processing state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [processingStage, setProcessingStage] = useState('');

  // Calculate costs with shipping speed
  const baseSubtotal = getSubtotal();
  const baseDiscount = getDiscount();
  const baseShipping = getShipping();
  const expressSurcharge = shippingSpeed === 'express-vault' ? 35 : 0;
  const finalShippingCost = baseShipping + expressSurcharge;
  const tax = getEstimatedTax();
  const finalTotal = Math.max(0, baseSubtotal - baseDiscount + finalShippingCost + tax);

  // If bag is empty, guide user back
  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-24 text-center">
        <AlertCircle className="w-12 h-12 text-shopora-crimson mx-auto mb-4" />
        <h2 className="text-2xl font-display font-bold text-white uppercase">Your Bag is Empty</h2>
        <p className="text-sm text-shopora-muted mt-2 mb-6">
          You must have at least one authenticated pair in your bag before proceeding to checkout.
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

  // Format Card Number (XXXX XXXX XXXX XXXX)
  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, '').slice(0, 16);
    const formatted = raw.replace(/(\d{4})(?=\d)/g, '$1 ');
    setCardNumber(formatted);
  };

  // Format Expiry (MM/YY)
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

    // Name
    if (!formData.fullName.trim() || formData.fullName.trim().length < 3) {
      newErrors.fullName = 'Full legal name is required (minimum 3 characters).';
    }

    // Email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim() || !emailRegex.test(formData.email.trim())) {
      newErrors.email = 'Please provide a valid email for drop receipt and tracking.';
    }

    // Phone
    const phoneClean = formData.phone.replace(/\D/g, '');
    if (!formData.phone.trim() || phoneClean.length < 10) {
      newErrors.phone = 'Valid 10-digit phone number required for courier dispatch.';
    }

    // Address Line 1
    if (!formData.addressLine1.trim() || formData.addressLine1.trim().length < 5) {
      newErrors.addressLine1 = 'Street address is required.';
    }

    // City
    if (!formData.city.trim()) {
      newErrors.city = 'City is required.';
    }

    // State
    if (!formData.state.trim()) {
      newErrors.state = 'State / Province is required.';
    }

    // ZIP Code
    const zipRegex = /^\d{5}(-\d{4})?$/;
    if (!formData.zipCode.trim() || !zipRegex.test(formData.zipCode.trim())) {
      newErrors.zipCode = 'Enter a valid 5-digit ZIP code (e.g. 90210).';
    }

    // Payment validation if card is selected
    if (paymentMethod === 'card') {
      const rawCard = cardNumber.replace(/\s/g, '');
      if (rawCard.length < 15) {
        newErrors.cardNumber = 'Enter a valid 15-16 digit card number.';
      }

      if (!expiry || !expiry.includes('/') || expiry.length !== 5) {
        newErrors.expiry = 'MM/YY required.';
      } else {
        const [month, year] = expiry.split('/').map(Number);
        if (month < 1 || month > 12) {
          newErrors.expiry = 'Invalid month.';
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
      addToast('Please complete all required shipping & payment fields correctly.', 'error');
      // Scroll to the first error
      window.scrollTo({ top: 100, behavior: 'smooth' });
      return;
    }

    setIsSubmitting(true);

    try {
      // Stage 1
      setProcessingStage('Authenticating encrypted payment gateway...');
      await new Promise((r) => setTimeout(r, 600));

      // Stage 2
      setProcessingStage('Securing deadstock vault reservation...');
      await new Promise((r) => setTimeout(r, 700));

      // Stage 3
      setProcessingStage('Minting cryptographic NFC authentication badge...');
      await new Promise((r) => setTimeout(r, 600));

      const shippingOptionObj: ShippingOption = {
        id: shippingSpeed,
        name: shippingSpeed === 'express-vault' ? 'Priority Armored Flight Dispatch' : 'Standard Insured Vault Dispatch',
        deliveryEstimate: shippingSpeed === 'express-vault' ? '1-2 Business Days' : '3-5 Business Days',
        price: finalShippingCost,
        description: 'Discreet double-box packaging with signature delivery confirmation',
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
      addToast('Payment gateway timeout. Please try again.', 'error');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-shopora-border/60 pb-5">
        <div className="flex items-center gap-3">
          <Link
            to="/cart"
            className="p-2 rounded-xl bg-shopora-card hover:bg-shopora-cardHover text-shopora-muted hover:text-white transition-colors"
            title="Return to Bag"
          >
            <ChevronLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="font-display font-black text-2xl sm:text-3xl text-white uppercase tracking-tight">
              ENCRYPTED VAULT CHECKOUT
            </h1>
            <p className="text-xs text-shopora-muted font-mono flex items-center gap-1.5 mt-0.5">
              <Lock className="w-3.5 h-3.5 text-shopora-accent" />
              <span>256-Bit SSL Encryption • Tamper-Evident Packaging</span>
            </p>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        
        {/* Left Form Column (7 Cols) */}
        <form onSubmit={handleSubmitOrder} className="lg:col-span-7 space-y-8">
          
          {/* Step 1: Contact Information */}
          <section className="p-6 rounded-3xl bg-shopora-card border border-shopora-border space-y-4">
            <div className="flex items-center gap-2.5 pb-3 border-b border-shopora-border">
              <div className="w-6 h-6 rounded-full bg-shopora-accent text-black font-display font-black text-xs flex items-center justify-center">
                1
              </div>
              <h2 className="font-display font-bold text-base text-white uppercase tracking-wider">
                Contact &amp; Delivery Destination
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Full Name */}
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Alexander Vance"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className={`w-full px-3.5 py-2.5 bg-shopora-dark border rounded-xl text-xs text-white placeholder:text-shopora-muted focus:outline-none ${
                    errors.fullName ? 'border-shopora-crimson' : 'border-shopora-border focus:border-shopora-accent'
                  }`}
                />
                {errors.fullName && (
                  <p className="text-[11px] text-shopora-crimson mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> {errors.fullName}
                  </p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Email Address (for Certificate) *
                </label>
                <input
                  type="email"
                  placeholder="alexander@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className={`w-full px-3.5 py-2.5 bg-shopora-dark border rounded-xl text-xs text-white placeholder:text-shopora-muted focus:outline-none ${
                    errors.email ? 'border-shopora-crimson' : 'border-shopora-border focus:border-shopora-accent'
                  }`}
                />
                {errors.email && (
                  <p className="text-[11px] text-shopora-crimson mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> {errors.email}
                  </p>
                )}
              </div>

              {/* Phone */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Phone Number (Courier SMS) *
                </label>
                <input
                  type="tel"
                  placeholder="(555) 000-1234"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className={`w-full px-3.5 py-2.5 bg-shopora-dark border rounded-xl text-xs text-white placeholder:text-shopora-muted focus:outline-none ${
                    errors.phone ? 'border-shopora-crimson' : 'border-shopora-border focus:border-shopora-accent'
                  }`}
                />
                {errors.phone && (
                  <p className="text-[11px] text-shopora-crimson mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> {errors.phone}
                  </p>
                )}
              </div>

              {/* Address Line 1 */}
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Street Address *
                </label>
                <input
                  type="text"
                  placeholder="742 Evergreen Terrace, Apt 4B"
                  value={formData.addressLine1}
                  onChange={(e) => setFormData({ ...formData, addressLine1: e.target.value })}
                  className={`w-full px-3.5 py-2.5 bg-shopora-dark border rounded-xl text-xs text-white placeholder:text-shopora-muted focus:outline-none ${
                    errors.addressLine1 ? 'border-shopora-crimson' : 'border-shopora-border focus:border-shopora-accent'
                  }`}
                />
                {errors.addressLine1 && (
                  <p className="text-[11px] text-shopora-crimson mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> {errors.addressLine1}
                  </p>
                )}
              </div>

              {/* City */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">City *</label>
                <input
                  type="text"
                  placeholder="Los Angeles"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className={`w-full px-3.5 py-2.5 bg-shopora-dark border rounded-xl text-xs text-white placeholder:text-shopora-muted focus:outline-none ${
                    errors.city ? 'border-shopora-crimson' : 'border-shopora-border focus:border-shopora-accent'
                  }`}
                />
                {errors.city && (
                  <p className="text-[11px] text-shopora-crimson mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> {errors.city}
                  </p>
                )}
              </div>

              {/* State & ZIP */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">State *</label>
                  <input
                    type="text"
                    placeholder="CA"
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    className={`w-full px-3.5 py-2.5 bg-shopora-dark border rounded-xl text-xs text-white placeholder:text-shopora-muted focus:outline-none ${
                      errors.state ? 'border-shopora-crimson' : 'border-shopora-border focus:border-shopora-accent'
                    }`}
                  />
                  {errors.state && (
                    <p className="text-[11px] text-shopora-crimson mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" /> {errors.state}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">ZIP *</label>
                  <input
                    type="text"
                    placeholder="90210"
                    value={formData.zipCode}
                    onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}
                    className={`w-full px-3.5 py-2.5 bg-shopora-dark border rounded-xl text-xs text-white placeholder:text-shopora-muted focus:outline-none ${
                      errors.zipCode ? 'border-shopora-crimson' : 'border-shopora-border focus:border-shopora-accent'
                    }`}
                  />
                  {errors.zipCode && (
                    <p className="text-[11px] text-shopora-crimson mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" /> {errors.zipCode}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </section>

          {/* Step 2: Shipping Method */}
          <section className="p-6 rounded-3xl bg-shopora-card border border-shopora-border space-y-4">
            <div className="flex items-center gap-2.5 pb-3 border-b border-shopora-border">
              <div className="w-6 h-6 rounded-full bg-shopora-accent text-black font-display font-black text-xs flex items-center justify-center">
                2
              </div>
              <h2 className="font-display font-bold text-base text-white uppercase tracking-wider">
                Select Vault Shipping Speed
              </h2>
            </div>

            <div className="space-y-3">
              {/* Standard */}
              <label
                className={`flex items-center justify-between p-4 rounded-2xl border cursor-pointer transition-all ${
                  shippingSpeed === 'standard'
                    ? 'border-shopora-accent bg-shopora-accent/10 shadow-glow-accent'
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
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-white">Standard Armored Courier</span>
                      <Truck className="w-4 h-4 text-shopora-accent" />
                    </div>
                    <p className="text-xs text-shopora-muted mt-0.5">
                      3-5 Business Days • Reinforced double packaging • Signature required
                    </p>
                  </div>
                </div>
                <span className="font-mono font-bold text-sm text-white">
                  {baseShipping === 0 ? 'FREE' : `$${baseShipping}`}
                </span>
              </label>

              {/* Express Vault Flight */}
              <label
                className={`flex items-center justify-between p-4 rounded-2xl border cursor-pointer transition-all ${
                  shippingSpeed === 'express-vault'
                    ? 'border-shopora-accent bg-shopora-accent/10 shadow-glow-accent'
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
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-white">Priority Vault Flight Overnight</span>
                      <Sparkles className="w-4 h-4 text-amber-400" />
                    </div>
                    <p className="text-xs text-shopora-muted mt-0.5">
                      1-2 Business Days • Dedicated vault handling • Real-time GPS flight tracker
                    </p>
                  </div>
                </div>
                <span className="font-mono font-bold text-sm text-white">
                  +${expressSurcharge}
                </span>
              </label>
            </div>
          </section>

          {/* Step 3: Payment Method */}
          <section className="p-6 rounded-3xl bg-shopora-card border border-shopora-border space-y-4">
            <div className="flex items-center gap-2.5 pb-3 border-b border-shopora-border">
              <div className="w-6 h-6 rounded-full bg-shopora-accent text-black font-display font-black text-xs flex items-center justify-center">
                3
              </div>
              <h2 className="font-display font-bold text-base text-white uppercase tracking-wider">
                Payment Method
              </h2>
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setPaymentMethod('card')}
                className={`flex-1 py-3 px-4 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
                  paymentMethod === 'card'
                    ? 'border-shopora-accent bg-shopora-accent/10 text-white font-bold'
                    : 'border-shopora-border bg-shopora-dark/60 text-slate-400'
                }`}
              >
                <CreditCard className="w-4 h-4" />
                <span>Credit / Debit Card</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('apple-pay')}
                className={`flex-1 py-3 px-4 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
                  paymentMethod === 'apple-pay'
                    ? 'border-shopora-accent bg-shopora-accent/10 text-white font-bold'
                    : 'border-shopora-border bg-shopora-dark/60 text-slate-400'
                }`}
              >
                <span>Apple Pay / One-Click</span>
              </button>
            </div>

            {paymentMethod === 'card' ? (
              <div className="space-y-4 pt-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Card Number *
                  </label>
                  <input
                    type="text"
                    placeholder="4242 4242 4242 4242"
                    value={cardNumber}
                    onChange={handleCardNumberChange}
                    className={`w-full px-3.5 py-2.5 bg-shopora-dark border rounded-xl text-xs font-mono text-white placeholder:text-shopora-muted focus:outline-none ${
                      errors.cardNumber ? 'border-shopora-crimson' : 'border-shopora-border focus:border-shopora-accent'
                    }`}
                  />
                  {errors.cardNumber && (
                    <p className="text-[11px] text-shopora-crimson mt-1">{errors.cardNumber}</p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Expiration (MM/YY) *
                    </label>
                    <input
                      type="text"
                      placeholder="12/28"
                      value={expiry}
                      onChange={handleExpiryChange}
                      className={`w-full px-3.5 py-2.5 bg-shopora-dark border rounded-xl text-xs font-mono text-white placeholder:text-shopora-muted focus:outline-none ${
                        errors.expiry ? 'border-shopora-crimson' : 'border-shopora-border focus:border-shopora-accent'
                      }`}
                    />
                    {errors.expiry && (
                      <p className="text-[11px] text-shopora-crimson mt-1">{errors.expiry}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      CVV Code *
                    </label>
                    <input
                      type="password"
                      maxLength={4}
                      placeholder="•••"
                      value={cvv}
                      onChange={(e) => setCvv(e.target.value.replace(/\D/g, ''))}
                      className={`w-full px-3.5 py-2.5 bg-shopora-dark border rounded-xl text-xs font-mono text-white placeholder:text-shopora-muted focus:outline-none ${
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
              <div className="p-6 rounded-2xl bg-shopora-dark/60 border border-shopora-border text-center space-y-2">
                <CheckCircle className="w-8 h-8 text-shopora-accent mx-auto" />
                <p className="text-xs font-semibold text-white">Apple Pay Ready</p>
                <p className="text-[11px] text-shopora-muted">
                  Your device biometric touch will authenticate upon clicking Complete Order.
                </p>
              </div>
            )}
          </section>

          {/* Submit Order Action Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 rounded-xl bg-shopora-accent hover:bg-shopora-accentHover text-black font-display font-black text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-glow-accent transition-all hover:scale-[1.01] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>{processingStage || 'Authorizing Drop...'}</span>
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  <span>Complete &amp; Authenticate Order (${finalTotal.toLocaleString()})</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            <p className="text-center text-[11px] text-shopora-muted mt-3 font-mono">
              By authorizing this transaction, you lock in physical ownership of this authenticated deadstock pair.
            </p>
          </div>
        </form>

        {/* Right Summary Sidebar (5 Cols) */}
        <aside className="lg:col-span-5 p-6 rounded-3xl bg-shopora-card border border-shopora-border space-y-6 lg:sticky lg:top-28">
          <div className="flex items-center justify-between pb-3 border-b border-shopora-border">
            <h2 className="font-display font-bold text-base text-white uppercase tracking-wider">
              ORDER SUMMARY ({items.length})
            </h2>
            <Link to="/cart" className="text-xs text-shopora-accent hover:underline">
              Edit Bag
            </Link>
          </div>

          {/* Items Preview */}
          <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
            {items.map((item) => (
              <div key={item.id} className="flex gap-3 items-center text-xs">
                <img
                  src={item.product.images[0]}
                  alt={item.product.name}
                  className="w-14 h-14 object-cover rounded-lg bg-shopora-dark border border-shopora-border shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-white truncate">{item.product.name}</h4>
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
          <div className="space-y-2 pt-4 border-t border-shopora-border text-xs text-slate-300">
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
              <span className="text-shopora-muted">14-Point Authentication</span>
              <span className="font-mono text-emerald-400 font-semibold">FREE ($0)</span>
            </div>

            <div className="flex justify-between">
              <span className="text-shopora-muted">Insured Vault Shipping</span>
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

            <div className="flex justify-between pt-3 border-t border-shopora-border text-base font-bold text-white">
              <span>Final Total</span>
              <span className="font-mono text-shopora-accent text-xl">
                ${finalTotal.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Legit Check Seal Badge */}
          <div className="p-4 rounded-2xl bg-shopora-dark border border-shopora-border text-xs space-y-2">
            <div className="flex items-center gap-2 text-shopora-accent font-bold font-mono">
              <ShieldCheck className="w-4 h-4" />
              <span>SHOPORA VAULT GUARANTEE</span>
            </div>
            <p className="text-[11px] text-shopora-muted leading-relaxed">
              Every parcel includes a physical tamper-evident NFC tag verifying deadstock authentication against our global registry.
            </p>
          </div>
        </aside>

      </div>
    </div>
  );
};
