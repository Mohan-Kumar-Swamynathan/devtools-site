import { useState, useCallback } from 'react';
import type { Toast, ToastType } from '@/components/common/Toast';

let toastId = 0;

export function useToast() {
  const [toast, setToast] = useState<Toast | null>(null);

  const showToast = useCallback((message: string, type: ToastType = 'info', duration?: number) => {
    const id = `toast-${++toastId}`;
    setToast({ id, message, type, duration });
  }, []);

  const hideToast = useCallback(() => {
    setToast(null);
  }, []);

  return {
    toast,
    showToast,
    hideToast,
    success: (message: string, duration?: number) => showToast(message, 'success', duration),
    error: (message: string, duration?: number) => showToast(message, 'error', duration),
    warning: (message: string, duration?: number) => showToast(message, 'warning', duration),
    info: (message: string, duration?: number) => showToast(message, 'info', duration)
  };
}

