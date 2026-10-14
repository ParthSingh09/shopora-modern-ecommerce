import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ShoppingBag, Terminal } from 'lucide-react';
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

  const categoryShortcuts = [
    { label: 'Retro Highs', count: '3 drops', path: '/shop?category=retro-high' },
    { label: 'Collabs & Drops', count: '2 drops', path: '/shop?category=collabs' },
    { label: 'Low Runners', count: '4 drops', path: '/shop?category=low-runners' },
    { label: 'Skate', count: '2 drops', path: '/shop?category=skate' },
    { label: 'Designer Street', count: '1 drop', path: '/shop?category=designer-street' },
  ];

  return (
    <div className="space-y-12 sm:space-y-16 py-6" id="main-content">
      {/* Quick View Modal */}
      <QuickViewModal
        product={quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
      />

      {/* Compact Editorial Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" aria-label="Featured Collection Introduction">
        <div className="rounded-3xl bg-shopora-surface border border-shopora-border p-6 sm:p-10 lg:p-12 relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left Copy */}
            <div className="lg:col-span-7 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-shopora-card border border-shopora-border text-xs font-mono text-shopora-accent">
                <span>VOL. 02 • DEADSTOCK ARCHIVE</span>
              </div>

              <h1 className="font-display font-black text-3xl sm:text-5xl lg:text-6xl text-white uppercase tracking-tight leading-[1.08]">
                CURATED SNEAKER VAULT &amp; STREETWEAR
              </h1>

              <p className="text-sm sm:text-base text-slate-300 max-w-xl leading-relaxed">
                An interactive e-commerce frontend built with React 19, TypeScript, Tailwind CSS, and Zustand. Explore authenticated deadstock grails with live multi-condition filtering, variant sizing, and persisted cart state.
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <Link
                  to="/shop"
                  className="px-6 py-3 rounded-xl bg-shopora-accent hover:bg-shopora-accentHover text-black font-display font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition-colors focus-visible:ring-2 focus-visible:ring-shopora-accent"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Browse All Drops</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>

                <Link
                  to="/lookbook"
                  className="px-5 py-3 rounded-xl bg-shopora-card hover:bg-shopora-cardHover border border-shopora-border text-slate-200 text-xs font-semibold uppercase tracking-wider transition-colors"
                >
                  Authentication Standard
                </Link>
              </div>

              {/* Quick Spec Highlights */}
              <div className="flex items-center gap-6 pt-3 text-xs text-shopora-muted font-mono">
                <div>
                  <span className="text-white font-bold">12</span> Curated Silhouettes
                </div>
                <span>•</span>
                <div>
                  <span className="text-shopora-accent font-bold">100%</span> Client State Persistence
                </div>
                <span>•</span>
                <div>
                  <span className="text-white font-bold">13</span> Vitest Unit Tests
                </div>
              </div>
            </div>

            {/* Right Compact Featured Drop Preview Card */}
            <div className="lg:col-span-5">
              <div className="rounded-2xl bg-shopora-card border border-shopora-border p-4 flex flex-col sm:flex-row lg:flex-col gap-4 items-center">
                <div className="w-full sm:w-1/2 lg:w-full aspect-[4/3] rounded-xl overflow-hidden bg-shopora-surface relative group">
                  <img
                    src="https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=1000&q=80"
                    alt="Air Jordan 1 Chicago Lost and Found"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <span className="absolute top-3 left-3 px-2 py-0.5 rounded bg-black/80 text-[10px] font-mono text-shopora-accent border border-white/10 uppercase font-bold">
                    Featured Drop
                  </span>
                </div>

                <div className="w-full sm:w-1/2 lg:w-full flex items-center justify-between gap-3">
                  <div>
                    <span className="text-[11px] font-mono text-shopora-accent uppercase">Air Jordan Retro</span>
                    <h2 className="font-bold text-sm text-white leading-tight">AJ1 "Chicago Lost &amp; Found"</h2>
                    <span className="font-mono font-bold text-white text-sm mt-0.5 block">$485</span>
                  </div>
                  <Link
                    to="/product/air-jordan-1-retro-high-og-chicago-lost-and-found"
                    className="px-3.5 py-2 rounded-xl bg-shopora-accent hover:bg-shopora-accentHover text-black text-xs font-bold uppercase tracking-wider transition-colors shrink-0"
                  >
                    Inspect
                  </Link>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Quick Category Jump Bar */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" aria-label="Browse Categories">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {categoryShortcuts.map((cat) => (
            <Link
              key={cat.label}
              to={cat.path}
              className="p-3.5 rounded-xl bg-shopora-surface hover:bg-shopora-card border border-shopora-border hover:border-shopora-borderLight transition-colors group flex flex-col justify-between"
            >
              <span className="font-display font-bold text-sm text-white group-hover:text-shopora-accent transition-colors">
                {cat.label}
              </span>
              <span className="text-[11px] font-mono text-shopora-muted mt-1">
                {cat.count}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Drops Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" aria-label="Featured Drops">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-6 pb-4 border-b border-shopora-border/60">
          <div>
            <span className="text-xs font-mono text-shopora-accent uppercase tracking-wider block mb-1">
              CURRENT HIGHLIGHTS
            </span>
            <h2 className="font-display font-black text-2xl sm:text-3xl text-white uppercase tracking-tight">
              FEATURED VAULT RELEASES
            </h2>
          </div>
          <Link
            to="/shop"
            className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-shopora-accent hover:text-white transition-colors"
          >
            <span>Explore All 12 Pairs</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div key={n} className="rounded-2xl bg-shopora-card border border-shopora-border h-96 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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

      {/* Portfolio Demo Transparency Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" aria-label="Portfolio Project Details">
        <div className="p-6 sm:p-8 rounded-2xl bg-shopora-surface border border-shopora-border flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-1.5 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 text-xs font-mono text-shopora-accent uppercase">
              <Terminal className="w-3.5 h-3.5" />
              <span>FRONTEND ARCHITECTURE NOTE</span>
            </div>
            <h3 className="font-display font-bold text-lg text-white">
              Built to showcase real-world frontend engineering standards
            </h3>
            <p className="text-xs sm:text-sm text-shopora-muted leading-relaxed">
              This project includes a simulated REST service, persistent cart state across page reloads, responsive grid design, form validation with field error mapping, and automated Vitest testing.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Link
              to="/shop"
              className="px-5 py-2.5 rounded-xl bg-shopora-accent hover:bg-shopora-accentHover text-black text-xs font-bold uppercase tracking-wider transition-colors"
            >
              Test Live Store
            </Link>
            <a
              href="https://github.com/ParthSingh09/shopora-modern-ecommerce"
              target="_blank"
              rel="noreferrer"
              className="px-4 py-2.5 rounded-xl bg-shopora-card hover:bg-shopora-cardHover border border-shopora-border text-slate-200 text-xs font-semibold uppercase tracking-wider transition-colors"
            >
              GitHub Source
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};
