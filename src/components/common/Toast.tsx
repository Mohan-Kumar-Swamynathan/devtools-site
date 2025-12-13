import { useEffect, useState } from 'react';
import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react';
import clsx from 'clsx';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

interface Toast {
  id: string;
  message: string;
  type: ToastType;
  duration?: number;
}

interface Props {
  toast: Toast | null;
  onClose: () => void;
}

const icons = {
  success: CheckCircle,
  error: XCircle,
  warning: AlertCircle,
  info: Info
};

const typeStyles = {
  success: {
    bg: 'var(--status-success-bg)',
    border: 'var(--status-success)',
    text: 'var(--status-success)',
    icon: CheckCircle
  },
  error: {
    bg: 'var(--status-error-bg)',
    border: 'var(--status-error)',
    text: 'var(--status-error)',
    icon: XCircle
  },
  warning: {
    bg: 'var(--status-warning-bg)',
    border: 'var(--status-warning)',
    text: 'var(--status-warning)',
    icon: AlertCircle
  },
  info: {
    bg: 'var(--status-info-bg)',
    border: 'var(--status-info)',
    text: 'var(--status-info)',
    icon: Info
  }
};

export default function Toast({ toast, onClose }: Props) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (toast) {
      setIsVisible(true);
      const timer = setTimeout(() => {
        setIsVisible(false);
        setTimeout(onClose, 300); // Wait for animation
      }, toast.duration || 3000);

      return () => clearTimeout(timer);
    }
  }, [toast, onClose]);

  if (!toast) return null;

  const styles = typeStyles[toast.type];
  const Icon = styles.icon;

  return (
    <div
      className={clsx(
        'fixed bottom-6 left-1/2 -translate-x-1/2 z-50 transition-all duration-300',
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 pointer-events-none'
      )}
      role="alert"
      aria-live="polite"
    >
      <div
        className={clsx(
          'flex items-center gap-3 px-4 py-3 rounded-xl border shadow-lg min-w-[300px] max-w-[90vw]',
          'animate-fade-in'
        )}
        style={{
          backgroundColor: styles.bg,
          borderColor: styles.border
        }}
      >
        <Icon size={20} style={{ color: styles.text }} className="flex-shrink-0" />
        <p className="flex-1 text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
          {toast.message}
        </p>
        <button
          onClick={() => {
            setIsVisible(false);
            setTimeout(onClose, 300);
          }}
          className="btn-icon p-1 flex-shrink-0"
          aria-label="Close notification"
          style={{ color: styles.text }}
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
}

