import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ShoppingBag,
  ArrowRight,
  ShieldCheck,
  Tag,
  Check,
  Sparkles,
  ArrowLeft,
} from 'lucide-react';
import { useCartStore } from '../store/useCartStore';
import { useToastStore } from '../store/useToastStore';
import { CartItemCard } from '../components/cart/CartItemCard';
import { api } from '../services/api';

export const CartPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    items,
    getItemCount,
    getSubtotal,
    getDiscount,
    getShipping,
    getEstimatedTax,
    getTotal,
    getFreeShippingProgress,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    clearCart,
  } = useCartStore();

  const { addToast } = useToastStore();
  const [couponCodeInput, setCouponCodeInput] = useState('');
  const [couponLoading, setCouponLoading] = useState(false);

  const itemCount = getItemCount();
  const subtotal = getSubtotal();
  const discount = getDiscount();
  const shipping = getShipping();
  const tax = getEstimatedTax();
  const total = getTotal();
  const { percent, remaining, qualified } = getFreeShippingProgress();

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCodeInput.trim()) return;

    setCouponLoading(true);
    const result = await api.validateCoupon(couponCodeInput, subtotal);
    setCouponLoading(false);

    if (result.success && result.coupon) {
      applyCoupon(result.coupon);
      addToast(`Promo code '${result.coupon.code}' applied!`, 'success');
      setCouponCodeInput('');
    } else {
      addToast(result.error || 'Invalid coupon code.', 'error');
    }
  };

  if (items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center animate-fade-in">
        <div className="w-20 h-20 rounded-3xl bg-shopora-card border border-shopora-border flex items-center justify-center text-shopora-muted mx-auto mb-6 shadow-2xl">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <h1 className="font-display font-black text-3xl sm:text-4xl text-white uppercase tracking-tight">
          YOUR BAG IS EMPTY
        </h1>
        <p className="text-sm text-shopora-muted max-w-md mx-auto mt-2 mb-8 leading-relaxed">
          Looks like you haven't reserved any deadstock sneakers yet. Explore our vault catalogue and secure your size.
        </p>
        <Link
          to="/shop"
          className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-shopora-accent hover:bg-shopora-accentHover text-black font-display font-bold text-xs uppercase tracking-wider transition-transform hover:scale-[1.02] focus-visible:ring-2 focus-visible:ring-shopora-accent"
        >
          <span>Explore All Drops</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-shopora-border/60 pb-6">
        <div>
          <h1 className="font-display font-black text-3xl sm:text-4xl text-white uppercase tracking-tight">
            YOUR VAULT BAG
          </h1>
          <p className="text-xs sm:text-sm text-shopora-muted mt-1 font-mono">
            {itemCount} {itemCount === 1 ? 'PAIR' : 'PAIRS'} RESERVED • SAVED IN LOCALSTORAGE
          </p>
        </div>
        <Link
          to="/shop"
          className="inline-flex items-center gap-1.5 text-xs text-shopora-accent hover:underline font-semibold"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Continue Shopping Drops</span>
        </Link>
      </div>

      {/* Free Shipping Meter */}
      <div className="p-4 rounded-2xl bg-shopora-card border border-shopora-border text-xs">
        {qualified ? (
          <div className="flex items-center gap-2 text-shopora-accent font-semibold">
            <Sparkles className="w-4 h-4 shrink-0" />
            <span>You unlocked FREE Insured Vault Shipping!</span>
          </div>
        ) : (
          <div className="space-y-2">
            <div className="flex justify-between text-slate-300 font-medium">
              <span>Free Insured Armored Shipping</span>
              <span className="text-shopora-accent font-mono font-bold">
                Add ${remaining.toLocaleString()} more to unlock
              </span>
            </div>
            <div className="w-full h-2 bg-shopora-dark rounded-full overflow-hidden border border-shopora-border/50">
              <div
                className="h-full bg-shopora-accent rounded-full transition-all duration-500"
                style={{ width: `${percent}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Main Bag Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Bag Items List */}
        <div className="lg:col-span-7 space-y-3">
          {items.map((item) => (
            <CartItemCard key={item.id} item={item} />
          ))}

          <div className="pt-3 flex justify-between items-center text-xs text-shopora-muted">
            <button
              onClick={clearCart}
              className="text-shopora-muted hover:text-shopora-crimson transition-colors"
            >
              Clear Entire Bag
            </button>
            <span className="font-mono">Vault items reserved for 15 minutes</span>
          </div>
        </div>

        {/* Right: Order Summary */}
        <div className="lg:col-span-5 p-6 rounded-3xl bg-shopora-card border border-shopora-border space-y-6">
          <h2 className="font-display font-bold text-lg text-white uppercase tracking-wider">
            ORDER BREAKDOWN
          </h2>

          {/* Promo Coupon Form */}
          {appliedCoupon ? (
            <div className="flex items-center justify-between p-3 rounded-xl bg-shopora-accent/10 border border-shopora-accent/30 text-xs">
              <div className="flex items-center gap-2 text-shopora-accent">
                <Check className="w-4 h-4 shrink-0" />
                <span className="font-mono font-bold">{appliedCoupon.code}</span>
                <span className="text-slate-300">({appliedCoupon.description})</span>
              </div>
              <button
                onClick={removeCoupon}
                className="text-shopora-muted hover:text-shopora-crimson font-medium text-xs"
              >
                Remove
              </button>
            </div>
          ) : (
            <form onSubmit={handleApplyCoupon} className="flex gap-2">
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder="Promo Code (STREET20 or GRAIL50)"
                  value={couponCodeInput}
                  onChange={(e) => setCouponCodeInput(e.target.value)}
                  className="w-full pl-8 pr-3 py-2.5 bg-shopora-dark border border-shopora-border rounded-xl text-xs text-white placeholder:text-shopora-muted uppercase font-mono focus:outline-none focus:border-shopora-accent"
                />
                <Tag className="w-4 h-4 text-shopora-muted absolute left-2.5 top-3" />
              </div>
              <button
                type="submit"
                disabled={couponLoading || !couponCodeInput.trim()}
                className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold disabled:opacity-50 transition-colors"
              >
                {couponLoading ? '...' : 'Apply'}
              </button>
            </form>
          )}

          {/* Calculation Details */}
          <div className="space-y-2.5 text-xs text-slate-300 pt-2 border-t border-shopora-border/60">
            <div className="flex justify-between">
              <span className="text-shopora-muted">Bag Subtotal</span>
              <span className="font-mono text-white text-sm">${subtotal.toLocaleString()}</span>
            </div>

            {discount > 0 && (
              <div className="flex justify-between text-shopora-accent">
                <span>Promotional Discount</span>
                <span className="font-mono text-sm">-${discount.toLocaleString()}</span>
              </div>
            )}

            <div className="flex justify-between">
              <span className="text-shopora-muted">Authenticity Physical Verification</span>
              <span className="font-mono text-emerald-400 font-semibold">FREE ($0)</span>
            </div>

            <div className="flex justify-between">
              <span className="text-shopora-muted">Insured Armored Shipping</span>
              <span className="font-mono text-white text-sm">
                {shipping === 0 ? (
                  <span className="text-shopora-accent font-semibold">FREE</span>
                ) : (
                  `$${shipping}`
                )}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-shopora-muted">Estimated Tax (8%)</span>
              <span className="font-mono text-white text-sm">${tax.toLocaleString()}</span>
            </div>

            <div className="flex justify-between pt-4 border-t border-shopora-border text-base font-bold text-white">
              <span>Estimated Order Total</span>
              <span className="font-mono text-shopora-accent text-xl">
                ${total.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Checkout CTA */}
          <button
            id="proceed-to-checkout-button"
            onClick={() => navigate('/checkout')}
            className="w-full py-4 rounded-xl bg-shopora-accent hover:bg-shopora-accentHover text-black font-display font-black text-sm uppercase tracking-wider flex items-center justify-center gap-2 transition-transform hover:scale-[1.01] focus-visible:ring-2 focus-visible:ring-shopora-accent"
          >
            <span>Proceed to Checkout</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          {/* Authenticity Guarantee Note */}
          <div className="p-3 rounded-xl bg-shopora-dark/60 border border-shopora-border text-[11px] text-shopora-muted flex items-start gap-2.5">
            <ShieldCheck className="w-4 h-4 text-shopora-accent shrink-0 mt-0.5" />
            <p>
              Your order is protected by the Shopora Guarantee. Every sneaker is inspected for quality and authenticity before dispatch.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
