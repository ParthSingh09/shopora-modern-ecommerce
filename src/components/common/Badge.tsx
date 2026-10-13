import React from 'react';

interface BadgeProps {
  variant?: 'grail' | 'limited' | 'sale' | 'out-of-stock' | 'verified' | 'neutral' | 'demo';
  children: React.ReactNode;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ variant = 'neutral', children, className = '' }) => {
  let style = 'bg-white/10 text-white border-white/20';

  switch (variant) {
    case 'grail':
      style = 'bg-shopora-accent/15 text-shopora-accent border-shopora-accent/40 font-bold';
      break;
    case 'limited':
      style = 'bg-shopora-crimson/15 text-red-300 border-red-500/30 font-bold';
      break;
    case 'sale':
      style = 'bg-amber-400/15 text-amber-300 border-amber-400/40 font-bold';
      break;
    case 'out-of-stock':
      style = 'bg-red-950/60 text-red-300 border-red-800/60 line-through';
      break;
    case 'verified':
      style = 'bg-cyan-950/60 text-shopora-cyan border-shopora-cyan/40 font-medium';
      break;
    case 'demo':
      style = 'bg-blue-950/50 text-blue-300 border-blue-800/40 font-mono text-[11px]';
      break;
    case 'neutral':
    default:
      style = 'bg-shopora-surface text-slate-300 border-shopora-border';
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
