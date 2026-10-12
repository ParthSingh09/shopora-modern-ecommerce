import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useToastStore } from '../../store/useToastStore';

export const Footer: React.FC = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const { addToast } = useToastStore();

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && email.includes('@')) {
      setSubscribed(true);
      addToast('Welcome to the Vault Drops List. Check your inbox for secret access.', 'success');
      setEmail('');
    }
  };

  return (
    <footer className="bg-[#07080A] border-t border-shopora-border mt-24 text-slate-400 text-sm">
      {/* Top Banner Feature row */}
      <div className="border-b border-shopora-border/60 py-10 bg-shopora-dark/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="flex items-start gap-4 p-4 rounded-xl bg-shopora-card/40 border border-shopora-border/40">
            <div className="p-3 rounded-xl bg-shopora-accent/10 text-shopora-accent shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-display font-bold text-white text-base">PHYSICAL AUTHENTICATION</h4>
              <p className="text-xs text-shopora-muted mt-1 leading-relaxed">
                Every sneaker undergoes a rigorous 14-point physical verification inspection with UV light and digital NFC tagging.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-4 rounded-xl bg-shopora-card/40 border border-shopora-border/40">
            <div className="p-3 rounded-xl bg-shopora-cyan/10 text-shopora-cyan shrink-0">
              <span className="font-mono font-bold text-base">100%</span>
            </div>
            <div>
              <h4 className="font-display font-bold text-white text-base">DEADSTOCK GUARANTEE</h4>
              <p className="text-xs text-shopora-muted mt-1 leading-relaxed">
                Factory-laced, unworn condition with original manufacturer box, tissue wrap, and extra accessories included.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-4 rounded-xl bg-shopora-card/40 border border-shopora-border/40">
            <div className="p-3 rounded-xl bg-shopora-crimson/10 text-shopora-crimson shrink-0">
              <span className="font-mono font-bold text-base">FAST</span>
            </div>
            <div>
              <h4 className="font-display font-bold text-white text-base">INSURED VAULT SHIPPING</h4>
              <p className="text-xs text-shopora-muted mt-1 leading-relaxed">
                Dispatched in reinforced discreet double boxes with signature delivery and full insurance coverage.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-shopora-accent flex items-center justify-center font-display font-black text-black">
                S
              </div>
              <span className="font-display font-black text-2xl text-white tracking-tighter">
                SHOPORA<span className="text-shopora-accent font-mono text-sm ml-0.5">®</span>
              </span>
            </div>
            <p className="text-sm text-slate-400 max-w-sm leading-relaxed">
              Curating rare sneaker grails, hyper-limited streetwear drops, and archived silhouettes for collectors worldwide.
            </p>
            
            {/* Social Icons */}
            <div className="flex items-center gap-3 pt-2">
              <a href="https://instagram.com" target="_blank" rel="noreferrer" className="p-2.5 rounded-lg bg-shopora-card hover:bg-shopora-cardHover text-slate-300 hover:text-shopora-accent transition-colors" aria-label="Instagram">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
              </a>
              <a href="https://twitter.com" target="_blank" rel="noreferrer" className="p-2.5 rounded-lg bg-shopora-card hover:bg-shopora-cardHover text-slate-300 hover:text-shopora-accent transition-colors" aria-label="X Twitter">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
              </a>
              <a href="https://github.com" target="_blank" rel="noreferrer" className="p-2.5 rounded-lg bg-shopora-card hover:bg-shopora-cardHover text-slate-300 hover:text-shopora-accent transition-colors" aria-label="GitHub">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
              </a>
            </div>
          </div>

          {/* Quick Links 1 */}
          <div>
            <h5 className="font-display font-bold text-white text-sm uppercase tracking-wider mb-4">
              Explore Drops
            </h5>
            <ul className="space-y-2.5 text-xs">
              <li><Link to="/shop" className="hover:text-shopora-accent transition-colors">All New Releases</Link></li>
              <li><Link to="/shop?category=retro-high" className="hover:text-shopora-accent transition-colors">Air Jordan Retro Highs</Link></li>
              <li><Link to="/shop?category=collabs" className="hover:text-shopora-accent transition-colors">Travis Scott &amp; Off-White</Link></li>
              <li><Link to="/shop?category=low-runners" className="hover:text-shopora-accent transition-colors">Yeezy &amp; New Balance</Link></li>
              <li><Link to="/shop?category=skate" className="hover:text-shopora-accent transition-colors">Nike SB Dunk Lows</Link></li>
            </ul>
          </div>

          {/* Quick Links 2 */}
          <div>
            <h5 className="font-display font-bold text-white text-sm uppercase tracking-wider mb-4">
              Customer Vault
            </h5>
            <ul className="space-y-2.5 text-xs">
              <li><Link to="/lookbook" className="hover:text-shopora-accent transition-colors">Authentication Process</Link></li>
              <li><Link to="/cart" className="hover:text-shopora-accent transition-colors">Cart &amp; Order Bag</Link></li>
              <li><Link to="/checkout" className="hover:text-shopora-accent transition-colors">Express Checkout</Link></li>
              <li><a href="#size-guide" className="hover:text-shopora-accent transition-colors">International Size Charts</a></li>
              <li><span className="text-shopora-muted cursor-not-allowed">24/7 Concierge Support</span></li>
            </ul>
          </div>

          {/* Newsletter Signup */}
          <div>
            <h5 className="font-display font-bold text-white text-sm uppercase tracking-wider mb-4">
              Secret Drops Alert
            </h5>
            <p className="text-xs text-shopora-muted mb-3 leading-relaxed">
              Get secret drop links 15 minutes before public release. No spam ever.
            </p>
            {subscribed ? (
              <div className="flex items-center gap-2 p-3 rounded-xl bg-shopora-accent/15 border border-shopora-accent/40 text-shopora-accent text-xs">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>You are on the VIP Vault list!</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-2">
                <div className="relative">
                  <input
                    type="email"
                    required
                    placeholder="Enter email for VIP access"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-shopora-card border border-shopora-border rounded-xl text-xs text-white placeholder:text-shopora-muted focus:outline-none focus:border-shopora-accent"
                  />
                  <button
                    type="submit"
                    className="absolute right-1.5 top-1.5 p-1.5 rounded-lg bg-shopora-accent text-black hover:bg-shopora-accentHover transition-colors"
                    aria-label="Subscribe"
                  >
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
                <p className="text-[10px] text-shopora-muted">
                  By joining, you agree to drop notifications &amp; privacy terms.
                </p>
              </form>
            )}
          </div>
        </div>

        {/* Bottom Credits */}
        <div className="mt-14 pt-8 border-t border-shopora-border flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-shopora-muted">
          <p>© {new Date().getFullYear()} SHOPORA VAULT INC. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span className="font-mono text-[11px] px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-slate-300">
              Built with React • TypeScript • Tailwind CSS • Zustand
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
