import { useState, useRef, useEffect } from 'react';
import clsx from 'clsx';

interface Props {
  content: string;
  children: React.ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
  delay?: number;
}

export default function Tooltip({ content, children, position = 'top', delay = 300 }: Props) {
  const [isVisible, setIsVisible] = useState(false);
  const [showTimeout, setShowTimeout] = useState<NodeJS.Timeout | null>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  const handleMouseEnter = () => {
    const timeout = setTimeout(() => {
      setIsVisible(true);
    }, delay);
    setShowTimeout(timeout);
  };

  const handleMouseLeave = () => {
    if (showTimeout) {
      clearTimeout(showTimeout);
      setShowTimeout(null);
    }
    setIsVisible(false);
  };

  useEffect(() => {
    return () => {
      if (showTimeout) {
        clearTimeout(showTimeout);
      }
    };
  }, [showTimeout]);

  const positionClasses = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2'
  };

  const arrowClasses = {
    top: 'top-full left-1/2 -translate-x-1/2 border-t-[var(--bg-elevated)] border-t-4 border-x-transparent border-x-4',
    bottom: 'bottom-full left-1/2 -translate-x-1/2 border-b-[var(--bg-elevated)] border-b-4 border-x-transparent border-x-4',
    left: 'left-full top-1/2 -translate-y-1/2 border-l-[var(--bg-elevated)] border-l-4 border-y-transparent border-y-4',
    right: 'right-full top-1/2 -translate-y-1/2 border-r-[var(--bg-elevated)] border-r-4 border-y-transparent border-y-4'
  };

  return (
    <div
      className="relative inline-block"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children}
      {isVisible && (
        <div
          ref={tooltipRef}
          className={clsx(
            'absolute z-50 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap pointer-events-none animate-fade-in',
            positionClasses[position]
          )}
          style={{
            backgroundColor: 'var(--bg-elevated)',
            color: 'var(--text-primary)',
            border: '1px solid var(--border-primary)',
            boxShadow: 'var(--shadow-lg)'
          }}
          role="tooltip"
        >
          {content}
          <div
            className={clsx('absolute', arrowClasses[position])}
            style={{ borderColor: 'var(--border-primary)' }}
          />
        </div>
      )}
    </div>
  );
}

