import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Flame, ShieldCheck, Sparkles, Zap, Award, CheckCircle } from 'lucide-react';
import { ProductCard } from '../components/product/ProductCard';
import { QuickViewModal } from '../components/product/QuickViewModal';
import { Product } from '../types/product';
import { api } from '../services/api';

export const HomePage: React.FC = () => {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  useEffect(() => {
    let isMounted = true;
    api.getFeaturedProducts().then((data) => {
      if (isMounted) {
        setFeaturedProducts(data);
        setLoading(false);
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="space-y-20 sm:space-y-28">
      {/* Quick View Modal */}
      <QuickViewModal
        product={quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
      />

      {/* Hero Section */}
      <section className="relative pt-6 sm:pt-12 overflow-hidden">
        {/* Glow background ambiance */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-shopora-accent/10 blur-[130px] rounded-full pointer-events-none" />
        <div className="absolute top-1/3 right-10 w-[400px] h-[300px] bg-shopora-crimson/10 blur-[120px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Copy */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              {/* Drop Tag */}
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-shopora-card border border-shopora-border/80 text-xs font-mono">
                <span className="w-2 h-2 rounded-full bg-shopora-accent animate-ping" />
                <span className="text-shopora-accent font-semibold uppercase tracking-wider">
                  Vault Drop 049
                </span>
                <span className="text-shopora-muted">•</span>
                <span className="text-slate-300">Live Release Now Open</span>
              </div>

              {/* Main Headline */}
              <h1 className="font-display font-black text-4xl sm:text-6xl lg:text-7xl tracking-tighter text-white uppercase leading-[1.05]">
                AUTHENTICATED <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-shopora-accent via-white to-shopora-accent">
                  GRAILS &amp; CULTURE
                </span>
              </h1>

              {/* Subtitle */}
              <p className="text-base sm:text-lg text-slate-300 max-w-xl mx-auto lg:mx-0 leading-relaxed font-normal">
                Deadstock luxury footwear, ultra-rare collaborations, and curated streetwear artifacts. Verified in-hand by certified master authenticators.
              </p>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                <Link
                  to="/shop"
                  className="w-full sm:w-auto px-8 py-4 rounded-xl bg-shopora-accent hover:bg-shopora-accentHover text-black font-display font-bold text-sm tracking-wider uppercase flex items-center justify-center gap-2.5 shadow-glow-accent transition-all hover:scale-105"
                >
                  <Flame className="w-4 h-4" />
                  <span>Explore All Drops</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  to="/lookbook"
                  className="w-full sm:w-auto px-7 py-4 rounded-xl bg-shopora-card hover:bg-shopora-cardHover border border-shopora-border text-slate-200 font-semibold text-sm tracking-wide uppercase transition-all"
                >
                  Legit Check Standard
                </Link>
              </div>

              {/* Micro Stats */}
              <div className="grid grid-cols-3 gap-6 pt-6 border-t border-shopora-border/50 max-w-lg mx-auto lg:mx-0">
                <div>
                  <div className="font-mono font-bold text-2xl text-white">100%</div>
                  <div className="text-xs text-shopora-muted uppercase font-medium">Physical Verification</div>
                </div>
                <div>
                  <div className="font-mono font-bold text-2xl text-shopora-accent">14-Point</div>
                  <div className="text-xs text-shopora-muted uppercase font-medium">Tamper Inspection</div>
                </div>
                <div>
                  <div className="font-mono font-bold text-2xl text-white">&lt; 24h</div>
                  <div className="text-xs text-shopora-muted uppercase font-medium">Insured Vault Dispatch</div>
                </div>
              </div>
            </div>

            {/* Right Hero Visual Card */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md lg:max-w-none rounded-3xl p-3 bg-gradient-to-b from-white/10 to-transparent border border-white/10 shadow-2xl backdrop-blur-sm">
                <div className="relative rounded-2xl overflow-hidden bg-shopora-card aspect-[4/5] group">
                  <img
                    src="https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=1200&q=80"
                    alt="Featured Sneaker Grail"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  
                  {/* Floating Holographic Badge */}
                  <div className="absolute top-4 left-4 p-3 rounded-2xl bg-black/75 backdrop-blur-md border border-white/15 flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-shopora-accent text-black font-black text-xs">
                      OG
                    </div>
                    <div>
                      <p className="text-[11px] font-mono uppercase text-shopora-accent font-bold">
                        GRAIL HIGHLIGHT
                      </p>
                      <p className="text-xs text-white font-semibold">AJ1 Chicago Lost &amp; Found</p>
                    </div>
                  </div>

                  {/* Bottom Price banner */}
                  <div className="absolute bottom-4 inset-x-4 p-4 rounded-2xl bg-shopora-dark/90 backdrop-blur-md border border-shopora-border flex items-center justify-between">
                    <div>
                      <span className="text-[10px] uppercase font-mono text-shopora-muted">Deadstock Pair</span>
                      <p className="font-mono font-bold text-xl text-white">$485 USD</p>
                    </div>
                    <Link
                      to="/product/air-jordan-1-retro-high-og-chicago-lost-and-found"
                      className="px-4 py-2 rounded-xl bg-shopora-accent hover:bg-shopora-accentHover text-black text-xs font-bold uppercase tracking-wider transition-colors"
                    >
                      Inspect Pair
                    </Link>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Brand Street Banner Marquee */}
      <section className="border-y border-shopora-border/60 py-6 bg-shopora-card/40 overflow-hidden">
        <div className="flex items-center gap-12 whitespace-nowrap animate-marquee">
          {[
            'AIR JORDAN',
            'TRAVIS SCOTT',
            'OFF-WHITE',
            'BALENCIAGA',
            'NEW BALANCE',
            'SALOMON ADVANCED',
            'NIKE SB',
            'YEEZY ARCHIVE',
            'AIR JORDAN',
            'TRAVIS SCOTT',
            'OFF-WHITE',
            'BALENCIAGA',
            'NEW BALANCE',
          ].map((brand, i) => (
            <div key={i} className="flex items-center gap-12 font-display font-black text-lg tracking-widest text-slate-500 uppercase">
              <span>{brand}</span>
              <span className="text-shopora-accent">•</span>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Drops Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-mono text-shopora-accent uppercase tracking-wider mb-2">
              <Zap className="w-4 h-4" />
              <span>CURRENT INVENTORY</span>
            </div>
            <h2 className="font-display font-black text-3xl sm:text-4xl text-white uppercase tracking-tight">
              FEATURED GRAILS &amp; VAULT DROPS
            </h2>
          </div>
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 text-sm font-semibold text-shopora-accent hover:text-white transition-colors"
          >
            <span>View All 12 Curated Pairs</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div key={n} className="rounded-2xl bg-shopora-card/50 border border-shopora-border h-96 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {featuredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onQuickView={(p) => setQuickViewProduct(p)}
              />
            ))}
          </div>
        )}
      </section>

      {/* Legit-Check Protocol Spotlight Feature */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-gradient-to-b from-[#13151D] to-[#0D0E12] border border-shopora-border p-8 sm:p-14 relative overflow-hidden">
          <div className="max-w-3xl space-y-6 relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-shopora-accent/15 border border-shopora-accent/30 text-shopora-accent text-xs font-mono">
              <ShieldCheck className="w-4 h-4" />
              <span>ZERO TOLERANCE REPLICA POLICY</span>
            </div>

            <h2 className="font-display font-black text-3xl sm:text-5xl text-white uppercase tracking-tight leading-tight">
              THE SHOPORA 14-POINT <br />
              PHYSICAL VERIFICATION PROTOCOL
            </h2>

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Every sneaker passing through our vault is physically dissected across 14 checkpoints by veteran authenticators with decades of experience:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              {[
                'UV Light Blacklight Stitch Analysis',
                'Digital NFC Cryptographic Certificate Tag',
                'Midsole Density & Rubber Scent Verification',
                'Box Label Typography & Barcode Alignment',
                'Factory Lacing Pattern & Paper Tissue Inspection',
                'Deadstock Sole Traction Zero-Wear Guarantee',
              ].map((point, index) => (
                <div key={index} className="flex items-center gap-3 p-3 rounded-xl bg-shopora-dark/60 border border-shopora-border/60 text-xs sm:text-sm text-slate-200">
                  <CheckCircle className="w-4 h-4 text-shopora-accent shrink-0" />
                  <span>{point}</span>
                </div>
              ))}
            </div>

            <div className="pt-4">
              <Link
                to="/lookbook"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs tracking-wider uppercase transition-colors"
              >
                <span>Read Full Legit Check Standard</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Collector Testimonials */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="font-display font-black text-3xl text-white uppercase tracking-tight">
            WHAT THE SNEAKER COMMUNITY SAYS
          </h2>
          <p className="text-xs sm:text-sm text-shopora-muted mt-2">
            Trusted by verified collectors, pro athletes, and streetwear enthusiasts across 42 countries.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              author: 'Julian B.',
              role: 'Verified Grail Collector, Tokyo',
              text: 'Secured the Off-White Presto The Ten. The packaging was military grade, and the NFC tag instantly pulled up the authentication history.',
              grail: 'Off-White Presto',
            },
            {
              author: 'Elena R.',
              role: 'Fashion Stylist, New York',
              text: 'In an industry plagued by fakes, Shopora is the only platform where I can buy with complete peace of mind. Delivery was within 48 hours.',
              grail: 'Jordan 1 Chicago L&F',
            },
            {
              author: 'Marcus K.',
              role: 'Sneaker Archivist, London',
              text: 'Reverse Mocha Travis 1s came in flawless condition. The leather scent and factory laces were 100% factory original.',
              grail: 'Travis Scott Lows',
            },
          ].map((t, i) => (
            <div key={i} className="p-6 rounded-2xl bg-shopora-card border border-shopora-border flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-1 text-amber-400 mb-3">
                  {[...Array(5)].map((_, idx) => (
                    <Sparkles key={idx} className="w-4 h-4 fill-amber-400" />
                  ))}
                </div>
                <p className="text-sm text-slate-200 leading-relaxed italic">"{t.text}"</p>
              </div>

              <div className="mt-6 pt-4 border-t border-shopora-border/60 flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-white text-xs">{t.author}</h4>
                  <p className="text-[11px] text-shopora-muted">{t.role}</p>
                </div>
                <span className="text-[11px] font-mono text-shopora-accent px-2 py-0.5 rounded bg-shopora-accent/10 border border-shopora-accent/30">
                  {t.grail}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Bottom Promo VIP Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-shopora-card via-[#1A1D27] to-shopora-card border border-shopora-accent/30 shadow-glow-accent flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <div className="inline-flex items-center gap-1.5 text-xs font-mono text-shopora-accent uppercase tracking-wider font-bold">
              <Award className="w-4 h-4" />
              <span>LIMITED TIME PROMO</span>
            </div>
            <h3 className="font-display font-black text-2xl sm:text-3xl text-white uppercase tracking-tight">
              TAKE 20% OFF YOUR FIRST VAULT ORDER
            </h3>
            <p className="text-xs sm:text-sm text-slate-300">
              Apply coupon <code className="px-2 py-0.5 rounded bg-black/60 border border-shopora-accent/40 text-shopora-accent font-mono font-bold">STREET20</code> in your bag before checkout.
            </p>
          </div>

          <Link
            to="/shop"
            className="px-8 py-4 rounded-xl bg-shopora-accent hover:bg-shopora-accentHover text-black font-display font-bold text-xs uppercase tracking-wider whitespace-nowrap shadow-glow-accent transition-transform hover:scale-105"
          >
            Claim 20% Discount
          </Link>
        </div>
      </section>
    </div>
  );
};
