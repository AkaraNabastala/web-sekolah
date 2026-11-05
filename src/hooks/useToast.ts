import { useState, useCallback, useRef } from 'react';

export type ToastType = 'success' | 'error' | 'warning' | 'info' | 'loading';

export interface Toast {
  id: string;
  message: string;
  type: ToastType;
  duration?: number; // ms, 0 = persists until manually dismissed
  action?: { label: string; onClick: () => void };
}

let externalSetToasts: React.Dispatch<React.SetStateAction<Toast[]>> | null = null;
let toastIdCounter = 0;

/** Register the setter from the Toaster component (called once on mount). */
export function _registerToastSetter(
  setter: React.Dispatch<React.SetStateAction<Toast[]>>
) {
  externalSetToasts = setter;
}

function generateId(): string {
  return `toast-${Date.now()}-${++toastIdCounter}`;
}

function getDefaultDuration(type: ToastType): number {
  switch (type) {
    case 'success': return 4500;
    case 'info':    return 5000;
    case 'warning': return 7000;
    case 'error':   return 0;    // persists until dismissed
    case 'loading': return 0;    // persists until replaced
    default:        return 4500;
  }
}

function pushToast(toast: Omit<Toast, 'id'>): string {
  const id = generateId();
  const newToast: Toast = {
    id,
    duration: getDefaultDuration(toast.type),
    ...toast,
  };
  if (externalSetToasts) {
    externalSetToasts((prev) => {
      // Max 5 toasts visible at a time — remove oldest non-loading/error
      if (prev.length >= 5) {
        const removable = prev.find((t) => t.type !== 'error' && t.type !== 'loading');
        if (removable) {
          return [...prev.filter((t) => t.id !== removable.id), newToast];
        }
      }
      return [...prev, newToast];
    });
  }
  return id;
}

function dismissToast(id: string) {
  if (externalSetToasts) {
    externalSetToasts((prev) => prev.filter((t) => t.id !== id));
  }
}

function updateToast(id: string, updates: Partial<Omit<Toast, 'id'>>) {
  if (externalSetToasts) {
    externalSetToasts((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...updates } : t))
    );
  }
}

/** Imperative API — usable outside React components too */
export const toast = {
  success: (message: string, action?: Toast['action']) =>
    pushToast({ type: 'success', message, action }),

  error: (message: string, action?: Toast['action']) =>
    pushToast({ type: 'error', message, action }),

  warning: (message: string, action?: Toast['action']) =>
    pushToast({ type: 'warning', message, action }),

  info: (message: string, action?: Toast['action']) =>
    pushToast({ type: 'info', message, action }),

  loading: (message: string) =>
    pushToast({ type: 'loading', message }),

  dismiss: (id: string) => dismissToast(id),

  /**
   * Wraps a promise: shows loading → resolves to success or error.
   * Returns the promise result.
   */
  promise: async <T>(
    promise: Promise<T>,
    messages: { loading: string; success: string | ((data: T) => string); error: string | ((err: unknown) => string) }
  ): Promise<T> => {
    const id = pushToast({ type: 'loading', message: messages.loading });
    try {
      const data = await promise;
      const successMsg = typeof messages.success === 'function'
        ? messages.success(data)
        : messages.success;
      updateToast(id, { type: 'success', message: successMsg, duration: 4500 });
      return data;
    } catch (err) {
      const errMsg = typeof messages.error === 'function'
        ? messages.error(err)
        : messages.error;
      updateToast(id, { type: 'error', message: errMsg, duration: 0 });
      throw err;
    }
  },
};

/** React hook — provides the same API + access to current toasts */
export function useToast() {
  return toast;
}
