import React from 'react';

interface BadgeProps {
  variant?: 'grail' | 'limited' | 'sale' | 'out-of-stock' | 'verified' | 'neutral';
  children: React.ReactNode;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ variant = 'neutral', children, className = '' }) => {
  let style = 'bg-white/10 text-white border-white/20';

  switch (variant) {
    case 'grail':
      style = 'bg-shopora-accent/15 text-shopora-accent border-shopora-accent/40 font-semibold shadow-glow-accent';
      break;
    case 'limited':
      style = 'bg-shopora-crimson/15 text-shopora-crimson border-shopora-crimson/40 font-semibold shadow-glow-crimson';
      break;
    case 'sale':
      style = 'bg-amber-400/15 text-amber-300 border-amber-400/30 font-medium';
      break;
    case 'out-of-stock':
      style = 'bg-red-950/50 text-red-400 border-red-800/40 line-through';
      break;
    case 'verified':
      style = 'bg-cyan-950/60 text-shopora-cyan border-shopora-cyan/30 font-medium';
      break;
    case 'neutral':
    default:
      style = 'bg-shopora-border/60 text-slate-300 border-shopora-border';
      break;
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs uppercase tracking-wider border backdrop-blur-sm ${style} ${className}`}
    >
      {children}
    </span>
  );
};
