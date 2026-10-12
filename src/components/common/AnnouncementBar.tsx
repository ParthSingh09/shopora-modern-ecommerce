import React from 'react';
import { ShieldCheck, Sparkles, Truck, Tag } from 'lucide-react';

export const AnnouncementBar: React.FC = () => {
  return (
    <aside aria-label="Store Announcements" className="bg-gradient-to-r from-[#0D0F14] via-[#141822] to-[#0D0F14] border-b border-shopora-border/60 text-xs py-2 px-4 overflow-hidden relative">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="hidden md:flex items-center gap-6 text-slate-300">
          <span className="flex items-center gap-1.5 text-shopora-accent">
            <ShieldCheck className="w-3.5 h-3.5" />
            <strong className="tracking-wider uppercase">100% Authenticity Guaranteed</strong>
          </span>
          <span className="flex items-center gap-1.5 text-shopora-muted">
            <Truck className="w-3.5 h-3.5" />
            <span>Free Armored Shipping on Orders Over $250</span>
          </span>
        </div>

        <div className="flex items-center justify-center w-full md:w-auto gap-2">
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-shopora-accent/15 text-shopora-accent font-semibold font-mono text-[11px] border border-shopora-accent/30">
            <Tag className="w-3 h-3" />
            STREET20
          </span>
          <span className="text-slate-200">Take 20% off drops with code</span>
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
        </div>

        <div className="hidden lg:flex items-center gap-4 text-shopora-muted">
          <span>Global Vault Dispatch: Tokyo • NYC • Paris</span>
        </div>
      </div>
    </aside>
  );
};
