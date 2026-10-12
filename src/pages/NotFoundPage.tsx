import React from 'react';
import { Link } from 'react-router-dom';
import { Flame, ArrowRight } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="max-w-xl mx-auto px-4 py-28 text-center animate-fade-in space-y-6">
      <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-shopora-card border border-shopora-border text-shopora-crimson font-display font-black text-4xl shadow-glow-crimson">
        404
      </div>
      <h1 className="font-display font-black text-3xl sm:text-4xl text-white uppercase tracking-tight">
        GRAIL NOT FOUND IN VAULT
      </h1>
      <p className="text-sm text-shopora-muted max-w-sm mx-auto leading-relaxed">
        The drop page or sneaker archive link you followed does not exist or has been relocated to another vault shelf.
      </p>
      <div>
        <Link
          to="/shop"
          className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-shopora-accent hover:bg-shopora-accentHover text-black font-display font-bold text-xs uppercase tracking-wider shadow-glow-accent transition-transform hover:scale-105"
        >
          <Flame className="w-4 h-4" />
          <span>Return to All Drops</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
};
