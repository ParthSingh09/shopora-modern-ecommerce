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
        <div className="w-16 h-16 rounded-3xl bg-shopora-accent/15 border border-shopora-accent/40 text-shopora-accent flex items-center justify-center mx-auto shadow-glow-accent">
          <CheckCircle2 className="w-8 h-8" />
        </div>

        <h1 className="font-display font-black text-3xl sm:text-5xl text-white uppercase tracking-tight print:text-black">
          VAULT ORDER CONFIRMED
        </h1>
        <p className="text-xs sm:text-sm text-shopora-muted max-w-lg mx-auto print:text-gray-700">
          Your reservation is physically locked into the Shopora vault. You have been issued a cryptographic ownership tag.
        </p>

        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-shopora-card border border-shopora-border text-xs font-mono">
          <span className="text-shopora-muted">ORDER ID:</span>
          <span className="text-shopora-accent font-bold print:text-black">{orderId || '#SHP-892410'}</span>
        </div>
      </div>

      {/* Certificate Card */}
      <div className="rounded-3xl bg-gradient-to-br from-shopora-card to-[#0F1117] border border-shopora-accent/30 p-6 sm:p-8 shadow-2xl space-y-6 relative overflow-hidden print:border-black">
        {/* Verification Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-shopora-border/60">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-shopora-accent text-black font-black">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h2 className="font-display font-black text-lg text-white uppercase tracking-wider print:text-black">
                NFC AUTHENTICITY CERTIFICATE
              </h2>
              <p className="text-xs text-shopora-muted font-mono">
                REGISTRY ID: {order?.verificationBadgeId || 'AUTH-NFC-74X92Q'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-mono text-xs font-semibold">
              DEADSTOCK VERIFIED
            </span>
          </div>
        </div>

        {/* 4-Step Dispatch Progression Tracker */}
        <div className="p-5 rounded-2xl bg-shopora-dark/70 border border-shopora-border space-y-4">
          <h3 className="font-display font-bold text-xs uppercase tracking-wider text-slate-300">
            DISPATCH PROTOCOL PROGRESS
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-shopora-accent/10 border border-shopora-accent/40 text-shopora-accent space-y-1">
              <div className="flex items-center gap-1.5 font-bold font-mono">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>1. Confirmed</span>
              </div>
              <p className="text-[10px] text-slate-300">Transaction authorized</p>
            </div>

            <div className="p-3 rounded-xl bg-shopora-card border border-shopora-border space-y-1">
              <div className="flex items-center gap-1.5 font-bold font-mono text-white">
                <PackageCheck className="w-3.5 h-3.5 text-shopora-accent" />
                <span>2. Legit Check</span>
              </div>
              <p className="text-[10px] text-shopora-muted">14-point UV verification</p>
            </div>

            <div className="p-3 rounded-xl bg-shopora-card border border-shopora-border space-y-1">
              <div className="flex items-center gap-1.5 font-bold font-mono text-slate-400">
                <Lock className="w-3.5 h-3.5" />
                <span>3. Vault Seal</span>
              </div>
              <p className="text-[10px] text-shopora-muted">Tamper tag attached</p>
            </div>

            <div className="p-3 rounded-xl bg-shopora-card border border-shopora-border space-y-1">
              <div className="flex items-center gap-1.5 font-bold font-mono text-slate-400">
                <Truck className="w-3.5 h-3.5" />
                <span>4. Armored Transit</span>
              </div>
              <p className="text-[10px] text-shopora-muted">Estimated in 2-4 days</p>
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
                <span>Total Paid</span>
                <span className="font-mono text-shopora-accent text-base">
                  ${order.total.toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 print:hidden">
        <button
          onClick={handlePrint}
          className="w-full sm:w-auto px-6 py-3 rounded-xl bg-shopora-card hover:bg-shopora-cardHover border border-shopora-border text-slate-200 text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors"
        >
          <Printer className="w-4 h-4" />
          <span>Print Physical Receipt</span>
        </button>

        <Link
          to="/shop"
          className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-shopora-accent hover:bg-shopora-accentHover text-black text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-glow-accent transition-all hover:scale-105"
        >
          <span>Explore More Grails</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
};
