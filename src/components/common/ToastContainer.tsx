import React from 'react';
import { useToastStore } from '../../store/useToastStore';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useToastStore();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 max-w-md w-full pointer-events-none px-4 sm:px-0">
      {toasts.map((toast) => {
        let Icon = CheckCircle2;
        let borderClass = 'border-shopora-accent/40 bg-shopora-card/95 text-slate-100';
        let iconClass = 'text-shopora-accent';

        if (toast.type === 'error') {
          Icon = AlertCircle;
          borderClass = 'border-shopora-crimson/50 bg-shopora-card/95 text-slate-100';
          iconClass = 'text-shopora-crimson';
        } else if (toast.type === 'info') {
          Icon = Info;
          borderClass = 'border-shopora-cyan/40 bg-shopora-card/95 text-slate-100';
          iconClass = 'text-shopora-cyan';
        }

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-center justify-between p-4 rounded-xl border backdrop-blur-md shadow-2xl transition-all duration-300 animate-scale-in ${borderClass}`}
          >
            <div className="flex items-center gap-3">
              <Icon className={`w-5 h-5 shrink-0 ${iconClass}`} />
              <p className="text-sm font-medium leading-snug">{toast.message}</p>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="ml-3 p-1 rounded-md text-shopora-muted hover:text-white transition-colors"
              aria-label="Dismiss notification"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
