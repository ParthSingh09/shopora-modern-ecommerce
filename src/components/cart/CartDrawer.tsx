import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, ShoppingBag, ArrowRight, Tag, ShieldCheck, Check, Sparkles } from 'lucide-react';
import { useCartStore } from '../../store/useCartStore';
import { useToastStore } from '../../store/useToastStore';
import { CartItemCard } from './CartItemCard';
import { api } from '../../services/api';

export const CartDrawer: React.FC = () => {
  const navigate = useNavigate();
  const {
    items,
    isDrawerOpen,
    setDrawerOpen,
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

  // Close on ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setDrawerOpen(false);
    };
    if (isDrawerOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isDrawerOpen, setDrawerOpen]);

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
      addToast(result.error || 'Failed to apply coupon.', 'error');
    }
  };

  const handleCheckout = () => {
    setDrawerOpen(false);
    navigate('/checkout');
  };

  const handleViewCart = () => {
    setDrawerOpen(false);
    navigate('/cart');
  };

  if (!isDrawerOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity animate-fade-in"
        onClick={() => setDrawerOpen(false)}
      />

      {/* Slide-over panel */}
      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <aside
          aria-label="Shopping Bag Drawer"
          className="w-screen max-w-md bg-shopora-dark border-l border-shopora-border flex flex-col shadow-2xl animate-fade-in"
        >
          {/* Header */}
          <div className="p-5 border-b border-shopora-border flex items-center justify-between bg-shopora-card/50">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-lg bg-shopora-accent/15 text-shopora-accent">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-display font-bold text-lg text-white">YOUR VAULT BAG</h3>
                <p className="text-xs text-shopora-muted font-mono">
                  {itemCount} {itemCount === 1 ? 'ITEM' : 'ITEMS'} RESERVED
                </p>
              </div>
            </div>
            <button
              onClick={() => setDrawerOpen(false)}
              className="p-2 text-shopora-muted hover:text-white rounded-lg hover:bg-white/5 transition-colors"
              aria-label="Close bag drawer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Progress Indicator */}
          <div className="px-5 py-3.5 bg-shopora-card/20 border-b border-shopora-border text-xs">
            {qualified ? (
              <div className="flex items-center gap-2 text-shopora-accent font-medium">
                <Sparkles className="w-4 h-4 shrink-0" />
                <span>Unlocked! You qualify for FREE Authenticated Shipping.</span>
              </div>
            ) : (
              <div>
                <div className="flex justify-between text-slate-300 font-medium mb-1.5">
                  <span>Free Insured Shipping</span>
                  <span className="text-shopora-accent font-mono font-bold">
                    Add ${remaining.toLocaleString()} more
                  </span>
                </div>
                <div className="w-full h-1.5 bg-shopora-border rounded-full overflow-hidden">
                  <div
                    className="h-full bg-shopora-accent transition-all duration-500 rounded-full"
                    style={{ width: `${percent}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-3">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12">
                <div className="w-16 h-16 rounded-2xl bg-shopora-card border border-shopora-border flex items-center justify-center text-shopora-muted mb-4">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h4 className="font-display font-bold text-lg text-white">Your bag is empty</h4>
                <p className="text-xs text-shopora-muted max-w-xs mt-1 mb-6 leading-relaxed">
                  You haven't locked in any grails yet. Explore our deadstock catalog and grab your size before it sells out.
                </p>
                <button
                  onClick={() => {
                    setDrawerOpen(false);
                    navigate('/shop');
                  }}
                  className="px-6 py-2.5 rounded-xl bg-shopora-accent text-black font-semibold text-xs tracking-wider uppercase hover:bg-shopora-accentHover transition-all shadow-glow-accent"
                >
                  Explore Drops
                </button>
              </div>
            ) : (
              items.map((item) => (
                <CartItemCard
                  key={item.id}
                  item={item}
                  onCloseDrawer={() => setDrawerOpen(false)}
                />
              ))
            )}
          </div>

          {/* Footer & Checkout Area */}
          {items.length > 0 && (
            <div className="p-5 border-t border-shopora-border bg-shopora-card/60 space-y-4">
              
              {/* Promo Coupon Form */}
              {appliedCoupon ? (
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-shopora-accent/10 border border-shopora-accent/30 text-xs">
                  <div className="flex items-center gap-2 text-shopora-accent">
                    <Check className="w-4 h-4 shrink-0" />
                    <span className="font-mono font-bold tracking-wider">{appliedCoupon.code}</span>
                    <span className="text-slate-300">({appliedCoupon.description})</span>
                  </div>
                  <button
                    onClick={removeCoupon}
                    className="text-shopora-muted hover:text-shopora-crimson font-medium text-[11px]"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <div className="relative flex-1">
                    <input
                      type="text"
                      placeholder="Promo code (try STREET20)"
                      value={couponCodeInput}
                      onChange={(e) => setCouponCodeInput(e.target.value)}
                      className="w-full pl-8 pr-3 py-2 bg-shopora-dark border border-shopora-border rounded-xl text-xs text-white placeholder:text-shopora-muted uppercase font-mono focus:outline-none focus:border-shopora-accent"
                    />
                    <Tag className="w-3.5 h-3.5 text-shopora-muted absolute left-2.5 top-2.5" />
                  </div>
                  <button
                    type="submit"
                    disabled={couponLoading || !couponCodeInput.trim()}
                    className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold disabled:opacity-50 transition-colors"
                  >
                    {couponLoading ? '...' : 'Apply'}
                  </button>
                </form>
              )}

              {/* Order Calculations */}
              <div className="space-y-1.5 text-xs text-slate-300">
                <div className="flex justify-between">
                  <span className="text-shopora-muted">Subtotal</span>
                  <span className="font-mono text-white">${subtotal.toLocaleString()}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-shopora-accent">
                    <span>Discount</span>
                    <span className="font-mono">-${discount.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-shopora-muted">Insured Vault Shipping</span>
                  <span className="font-mono text-white">
                    {shipping === 0 ? (
                      <span className="text-shopora-accent font-semibold">FREE</span>
                    ) : (
                      `$${shipping}`
                    )}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-shopora-muted">Est. Sales Tax (8%)</span>
                  <span className="font-mono text-white">${tax.toLocaleString()}</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-shopora-border text-sm font-bold text-white">
                  <span>Total</span>
                  <span className="font-mono text-shopora-accent text-base">
                    ${total.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-1">
                <button
                  id="drawer-checkout-button"
                  onClick={handleCheckout}
                  className="w-full py-3.5 rounded-xl bg-shopora-accent hover:bg-shopora-accentHover text-black font-display font-bold text-sm uppercase tracking-wider flex items-center justify-center gap-2 transition-transform hover:scale-[1.01] focus-visible:ring-2 focus-visible:ring-shopora-accent"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  onClick={handleViewCart}
                  className="w-full py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 font-semibold text-xs tracking-wider uppercase transition-colors focus-visible:ring-2 focus-visible:ring-shopora-accent"
                >
                  View Full Bag &amp; Details
                </button>
              </div>

              {/* Authenticity Guarantee Note */}
              <div className="flex items-center justify-center gap-2 text-[11px] text-shopora-muted pt-1">
                <ShieldCheck className="w-3.5 h-3.5 text-shopora-accent" />
                <span>All items checked and authenticated before dispatch</span>
              </div>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
};
