import React from 'react';
import { Tag, Sparkles, Terminal } from 'lucide-react';

export const AnnouncementBar: React.FC = () => {
  return (
    <aside
      aria-label="Portfolio Notice & Promotions"
      className="bg-[#0e1015] border-b border-shopora-border/70 text-xs py-2 px-4 relative text-slate-300"
    >
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-4">
        {/* Left: Project context */}
        <div className="flex items-center gap-2 text-shopora-muted">
          <Terminal className="w-3.5 h-3.5 text-shopora-accent" />
          <span className="font-mono text-[11px] uppercase tracking-wide">
            Portfolio Demo • Frontend E-Commerce Experience
          </span>
        </div>

        {/* Center: Promo coupon tag */}
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-shopora-accent/15 text-shopora-accent font-semibold font-mono text-[11px] border border-shopora-accent/30">
            <Tag className="w-3 h-3" />
            STREET20
          </span>
          <span className="text-slate-200">20% off demo order total</span>
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
        </div>

        {/* Right: Free shipping policy */}
        <div className="hidden lg:flex items-center gap-1.5 text-shopora-muted text-[11px] font-mono">
          <span>Complimentary insured shipping on orders over $250</span>
        </div>
      </div>
    </aside>
  );
};
