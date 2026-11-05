import React, { useState, useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Info,
  Loader2,
  X,
} from 'lucide-react';
import {
  type Toast,
  type ToastType,
  _registerToastSetter,
  toast as toastApi,
} from '../../hooks/useToast';

/* ─── Icon & colour maps ─────────────────────────────────── */
const CONFIG: Record<
  ToastType,
  { icon: React.ReactNode; bar: string; bg: string; border: string; text: string }
> = {
  success: {
    icon: <CheckCircle2 className="w-5 h-5 text-emerald-600" />,
    bar:  'bg-emerald-500',
    bg:   'bg-white',
    border: 'border-emerald-200',
    text: 'text-stone-800',
  },
  error: {
    icon: <XCircle className="w-5 h-5 text-red-600" />,
    bar:  'bg-red-500',
    bg:   'bg-white',
    border: 'border-red-200',
    text: 'text-stone-800',
  },
  warning: {
    icon: <AlertTriangle className="w-5 h-5 text-amber-500" />,
    bar:  'bg-amber-400',
    bg:   'bg-white',
    border: 'border-amber-200',
    text: 'text-stone-800',
  },
  info: {
    icon: <Info className="w-5 h-5 text-blue-600" />,
    bar:  'bg-blue-500',
    bg:   'bg-white',
    border: 'border-blue-200',
    text: 'text-stone-800',
  },
  loading: {
    icon: <Loader2 className="w-5 h-5 text-stone-500 animate-spin" />,
    bar:  'bg-stone-400',
    bg:   'bg-white',
    border: 'border-stone-200',
    text: 'text-stone-700',
  },
};

/* ─── Single toast item ──────────────────────────────────── */
interface ToastItemProps {
  toast: Toast;
  onDismiss: (id: string) => void;
}

const ToastItem: React.FC<ToastItemProps> = ({ toast: t, onDismiss }) => {
  const cfg = CONFIG[t.type];
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [progress, setProgress] = useState(100);
  const startTime = useRef<number>(Date.now());
  const duration = t.duration ?? 0;

  /* Auto-dismiss with progress bar */
  useEffect(() => {
    if (!duration) return; // 0 means persistent
    startTime.current = Date.now();

    const tick = () => {
      const elapsed = Date.now() - startTime.current;
      const remaining = Math.max(0, 100 - (elapsed / duration) * 100);
      setProgress(remaining);
      if (elapsed >= duration) {
        onDismiss(t.id);
      } else {
        timerRef.current = setTimeout(tick, 50);
      }
    };

    timerRef.current = setTimeout(tick, 50);
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [t.id, t.duration, duration, onDismiss]);

  /* Respect prefers-reduced-motion */
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  return (
    <motion.div
      layout
      role="alert"
      aria-live={t.type === 'error' ? 'assertive' : 'polite'}
      aria-atomic="true"
      initial={prefersReduced ? { opacity: 0 } : { opacity: 0, x: 60, scale: 0.96 }}
      animate={prefersReduced ? { opacity: 1 } : { opacity: 1, x: 0, scale: 1 }}
      exit={prefersReduced ? { opacity: 0 } : { opacity: 0, x: 60, scale: 0.94 }}
      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
      className={`
        relative w-full max-w-sm rounded-2xl border shadow-lg shadow-stone-200/70 overflow-hidden
        ${cfg.bg} ${cfg.border}
        font-['Poppins',sans-serif]
      `}
    >
      {/* Left accent bar */}
      <div className={`absolute inset-y-0 left-0 w-1 ${cfg.bar} rounded-l-2xl`} />

      <div className="flex items-start gap-3 pl-4 pr-3 py-3.5">
        {/* Icon */}
        <div className="mt-0.5 shrink-0">{cfg.icon}</div>

        {/* Message */}
        <div className="flex-1 min-w-0">
          <p className={`text-[13px] font-medium leading-snug ${cfg.text}`}>
            {t.message}
          </p>
          {t.action && (
            <button
              onClick={() => { t.action!.onClick(); onDismiss(t.id); }}
              className="mt-1.5 text-[11px] font-semibold text-emerald-700 hover:text-emerald-800 hover:underline focus:outline-none focus:ring-1 focus:ring-emerald-500 rounded"
            >
              {t.action.label}
            </button>
          )}
        </div>

        {/* Close button */}
        {t.type !== 'loading' && (
          <button
            onClick={() => onDismiss(t.id)}
            aria-label="Tutup notifikasi"
            className="shrink-0 mt-0.5 p-1 rounded-lg text-stone-400 hover:text-stone-600 hover:bg-stone-100 transition-colors focus:outline-none focus:ring-1 focus:ring-stone-300"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Progress bar (only for auto-dismiss) */}
      {!!duration && (
        <div className="h-[2px] bg-stone-100">
          <div
            className={`h-full ${cfg.bar} transition-none`}
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
    </motion.div>
  );
};

/* ─── Toaster container ──────────────────────────────────── */
export const Toaster: React.FC = () => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  /* Register the setter so the imperative API can push to this state */
  useEffect(() => {
    _registerToastSetter(setToasts);
    return () => { _registerToastSetter(() => {}); };
  }, []);

  const dismiss = (id: string) =>
    setToasts((prev) => prev.filter((t) => t.id !== id));

  return (
    <div
      aria-label="Notifikasi sistem"
      className="fixed top-4 right-4 z-[9999] flex flex-col gap-2.5 w-[calc(100vw-2rem)] max-w-sm pointer-events-none"
    >
      <AnimatePresence initial={false} mode="sync">
        {toasts.map((t) => (
          <div key={t.id} className="pointer-events-auto">
            <ToastItem toast={t} onDismiss={dismiss} />
          </div>
        ))}
      </AnimatePresence>
    </div>
  );
};
