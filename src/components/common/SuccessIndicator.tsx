import { useEffect, useState } from 'react';
import { CheckCircle } from 'lucide-react';
import clsx from 'clsx';

interface Props {
  message?: string;
  show: boolean;
  duration?: number;
  className?: string;
}

export default function SuccessIndicator({ 
  message = 'Success!', 
  show, 
  duration = 2000,
  className = '' 
}: Props) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (show) {
      setIsVisible(true);
      const timer = setTimeout(() => {
        setIsVisible(false);
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [show, duration]);

  if (!isVisible) return null;

  return (
    <div
      className={clsx(
        'fixed top-20 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 px-4 py-3 rounded-xl shadow-lg animate-fade-in',
        className
      )}
      style={{
        backgroundColor: 'var(--status-success-bg)',
        border: '1px solid var(--status-success)',
        color: 'var(--status-success)'
      }}
      role="alert"
      aria-live="polite"
    >
      <CheckCircle size={20} />
      <span className="text-sm font-medium">{message}</span>
    </div>
  );
}

