import React from 'react';
import { useRouteWise } from '../../context/RouteWiseContext';
import { CheckCircle2, AlertTriangle, Info, AlertOctagon, X } from 'lucide-react';

export default function ToastContainer() {
  const { toasts, removeToast } = useRouteWise();

  if (!toasts.length) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => {
        let borderClass = 'border-cyan-500/40 bg-slate-900/95 text-cyan-200';
        let Icon = Info;
        let iconColor = 'text-cyan-400';

        if (toast.type === 'success') {
          borderClass = 'border-emerald-500/40 bg-slate-900/95 text-emerald-200';
          Icon = CheckCircle2;
          iconColor = 'text-emerald-400';
        } else if (toast.type === 'warning') {
          borderClass = 'border-amber-500/40 bg-slate-900/95 text-amber-200';
          Icon = AlertTriangle;
          iconColor = 'text-amber-400';
        } else if (toast.type === 'critical') {
          borderClass = 'border-red-500/50 bg-slate-900/95 text-red-200 animate-pulse';
          Icon = AlertOctagon;
          iconColor = 'text-red-400';
        }

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 p-3.5 rounded-xl border shadow-2xl backdrop-blur-md text-xs transition-all duration-300 transform translate-y-0 opacity-100 ${borderClass}`}
          >
            <Icon className={`w-4 h-4 mt-0.5 shrink-0 ${iconColor}`} />
            <div className="flex-1">
              <div className="font-bold text-slate-100">{toast.title}</div>
              {toast.message && <div className="text-slate-300 mt-0.5 leading-relaxed">{toast.message}</div>}
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
