import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import confetti from 'canvas-confetti';
import {
  ShieldCheck,
  CheckCircle2,
  PackageCheck,
  Truck,
  Printer,
  ArrowRight,
  QrCode,
  Calendar,
  Lock,
} from 'lucide-react';
import { Order } from '../types/order';
import { api } from '../services/api';

export const OrderSuccessPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('orderId');

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Launch celebratory confetti burst
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#CCFF00', '#00F0FF', '#FF3366', '#FFFFFF'],
    });

    if (orderId) {
      api.getOrder(orderId).then((found) => {
        setOrder(found);
        setLoading(false);
      });
    } else {
      setLoading(false);
    }
  }, [orderId]);

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-24 text-center">
        <p className="text-shopora-muted">Retrieving order verification...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 animate-fade-in print:bg-white print:text-black print:p-0">
      {/* Top Success Badge Banner */}
      <div className="text-center space-y-3">
        <div className="w-16 h-16 rounded-2xl bg-shopora-accent/15 border border-shopora-accent/40 text-shopora-accent flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-8 h-8" />
        </div>

        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-shopora-card border border-shopora-border text-xs font-mono text-slate-400">
          <span className="w-2 h-2 rounded-full bg-shopora-accent animate-pulse" />
          <span>PORTFOLIO DEMO ORDER COMPLETE</span>
        </div>

        <h1 className="font-display font-black text-3xl sm:text-4xl text-white uppercase tracking-tight print:text-black">
          ORDER CONFIRMATION
        </h1>
        <p className="text-xs sm:text-sm text-shopora-muted max-w-lg mx-auto print:text-gray-700">
          Thank you for testing the Shopora checkout flow! This transaction is a client-side simulation. No real payment was charged.
        </p>

        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-shopora-card border border-shopora-border text-xs font-mono">
          <span className="text-shopora-muted">ORDER REFERENCE:</span>
          <span className="text-shopora-accent font-bold print:text-black">{orderId || '#SHP-DEMO-892410'}</span>
        </div>
      </div>

      {/* Certificate Card */}
      <div className="rounded-2xl bg-shopora-card border border-shopora-border p-6 sm:p-8 shadow-xl space-y-6 relative overflow-hidden print:border-black">
        {/* Verification Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-shopora-border/60">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-shopora-accent text-black font-black">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h2 className="font-display font-black text-base sm:text-lg text-white uppercase tracking-wider print:text-black">
                SIMULATED ORDER RECEIPT
              </h2>
              <p className="text-xs text-shopora-muted font-mono">
                DEMO SLIP ID: {order?.verificationBadgeId || 'DEMO-AUTH-74X92Q'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-mono text-xs font-semibold">
              SIMULATION VERIFIED
            </span>
          </div>
        </div>

        {/* 4-Step Dispatch Progression Tracker */}
        <div className="p-5 rounded-xl bg-shopora-dark/70 border border-shopora-border space-y-4">
          <h3 className="font-display font-bold text-xs uppercase tracking-wider text-slate-300">
            SIMULATED DISPATCH PROTOCOL
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-shopora-accent/10 border border-shopora-accent/40 text-shopora-accent space-y-1">
              <div className="flex items-center gap-1.5 font-bold font-mono">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>1. Confirmed</span>
              </div>
              <p className="text-[10px] text-slate-300">Demo checkout completed</p>
            </div>

            <div className="p-3 rounded-xl bg-shopora-card border border-shopora-border space-y-1">
              <div className="flex items-center gap-1.5 font-bold font-mono text-white">
                <PackageCheck className="w-3.5 h-3.5 text-shopora-accent" />
                <span>2. Inspection</span>
              </div>
              <p className="text-[10px] text-shopora-muted">Mock quality audit</p>
            </div>

            <div className="p-3 rounded-xl bg-shopora-card border border-shopora-border space-y-1">
              <div className="flex items-center gap-1.5 font-bold font-mono text-slate-400">
                <Lock className="w-3.5 h-3.5" />
                <span>3. Vault Seal</span>
              </div>
              <p className="text-[10px] text-shopora-muted">Simulated tamper tag</p>
            </div>

            <div className="p-3 rounded-xl bg-shopora-card border border-shopora-border space-y-1">
              <div className="flex items-center gap-1.5 font-bold font-mono text-slate-400">
                <Truck className="w-3.5 h-3.5" />
                <span>4. Demo Transit</span>
              </div>
              <p className="text-[10px] text-shopora-muted">Mock dispatch tracker</p>
            </div>
          </div>
        </div>

        {/* Ordered Items Table */}
        {order && (
          <div className="space-y-3">
            <h3 className="font-display font-bold text-xs uppercase tracking-wider text-slate-300">
              ACQUIRED DEADSTOCK PAIRS
            </h3>
            <div className="divide-y divide-shopora-border/60 rounded-2xl border border-shopora-border bg-shopora-dark/50 overflow-hidden">
              {order.items.map((item) => (
                <div key={item.id} className="p-4 flex items-center justify-between gap-4 text-xs">
                  <div className="flex items-center gap-3">
                    <img
                      src={item.product.images[0]}
                      alt={item.product.name}
                      className="w-14 h-14 object-cover rounded-xl bg-shopora-card border border-shopora-border"
                    />
                    <div>
                      <h4 className="font-bold text-white text-sm print:text-black">
                        {item.product.name}
                      </h4>
                      <p className="text-shopora-muted font-mono mt-0.5">
                        Size: {item.size} • Color: {item.color} • Qty: {item.quantity}
                      </p>
                    </div>
                  </div>
                  <div className="text-right font-mono font-bold text-sm text-white print:text-black">
                    ${(item.product.price * item.quantity).toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Shipping Destination & Cost Breakdown */}
        {order && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
            {/* Address */}
            <div className="p-4 rounded-2xl bg-shopora-dark/60 border border-shopora-border text-xs space-y-2">
              <h4 className="font-mono font-bold text-shopora-accent uppercase">
                DELIVERY DESTINATION
              </h4>
              <p className="font-semibold text-white print:text-black">{order.shippingAddress.fullName}</p>
              <p className="text-slate-300">{order.shippingAddress.addressLine1}</p>
              <p className="text-slate-300">
                {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}
              </p>
              <p className="text-shopora-muted mt-1">{order.shippingAddress.email}</p>
            </div>

            {/* Financials */}
            <div className="p-4 rounded-2xl bg-shopora-dark/60 border border-shopora-border text-xs space-y-1.5">
              <h4 className="font-mono font-bold text-shopora-accent uppercase">
                SETTLEMENT SUMMARY
              </h4>
              <div className="flex justify-between text-slate-300">
                <span>Subtotal</span>
                <span className="font-mono text-white">${order.subtotal.toLocaleString()}</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-shopora-accent">
                  <span>Discount</span>
                  <span className="font-mono">-${order.discount.toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between text-slate-300">
                <span>Shipping ({order.shippingOption.id})</span>
                <span className="font-mono text-white">
                  {order.shippingCost === 0 ? 'FREE' : `$${order.shippingCost}`}
                </span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>Sales Tax</span>
                <span className="font-mono text-white">${order.tax.toLocaleString()}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-shopora-border font-bold text-white text-sm">
                <span>Total Simulated Amount</span>
                <span className="font-mono text-shopora-accent text-base">
                  ${order.total.toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Portfolio Demo Notice */}
        <div className="p-4 rounded-xl bg-shopora-dark/80 border border-shopora-border text-xs text-shopora-muted flex items-start gap-3 print:hidden">
          <QrCode className="w-4 h-4 text-shopora-accent shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <strong className="text-white">Developer Portfolio Demo:</strong> This checkout journey demonstrates form validation, order payload creation, state clearing, receipt printing, and route navigation. No real bank or credit card was charged.
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2 print:hidden">
        <button
          onClick={handlePrint}
          className="w-full sm:w-auto px-6 py-3 rounded-xl bg-shopora-card hover:bg-shopora-cardHover border border-shopora-border text-slate-200 text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors focus-visible:ring-2 focus-visible:ring-shopora-accent"
        >
          <Printer className="w-4 h-4" />
          <span>Print Receipt</span>
        </button>

        <Link
          to="/shop"
          className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-shopora-accent hover:bg-shopora-accentHover text-black text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-transform hover:scale-[1.02] focus-visible:ring-2 focus-visible:ring-shopora-accent"
        >
          <span>Continue Shopping</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
};
