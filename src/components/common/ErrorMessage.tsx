import { AlertCircle, X } from 'lucide-react';
import { useState } from 'react';
import clsx from 'clsx';

interface Props {
  message: string;
  title?: string;
  onDismiss?: () => void;
  className?: string;
  type?: 'error' | 'warning' | 'info';
}

export default function ErrorMessage({ 
  message, 
  title, 
  onDismiss, 
  className = '',
  type = 'error'
}: Props) {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  const handleDismiss = () => {
    setDismissed(true);
    onDismiss?.();
  };

  const typeStyles = {
    error: {
      bg: 'var(--status-error-bg)',
      border: 'var(--status-error)',
      text: 'var(--status-error)',
      icon: <AlertCircle size={20} />
    },
    warning: {
      bg: 'var(--status-warning-bg)',
      border: 'var(--status-warning)',
      text: 'var(--status-warning)',
      icon: <AlertCircle size={20} />
    },
    info: {
      bg: 'var(--status-info-bg)',
      border: 'var(--status-info)',
      text: 'var(--status-info)',
      icon: <AlertCircle size={20} />
    }
  };

  const styles = typeStyles[type];

  return (
    <div
      className={clsx(
        'rounded-lg border p-4 flex items-start gap-3',
        className
      )}
      style={{
        backgroundColor: styles.bg,
        borderColor: styles.border
      }}
      role="alert"
      aria-live="polite"
    >
      <div style={{ color: styles.text }} className="flex-shrink-0 mt-0.5">
        {styles.icon}
      </div>
      <div className="flex-1 min-w-0">
        {title && (
          <h3 className="font-semibold mb-1" style={{ color: styles.text }}>
            {title}
          </h3>
        )}
        <p className="text-sm" style={{ color: 'var(--text-primary)' }}>
          {message}
        </p>
      </div>
      {onDismiss && (
        <button
          onClick={handleDismiss}
          className="flex-shrink-0 btn-icon p-1"
          aria-label="Dismiss error"
          style={{ color: styles.text }}
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
}

