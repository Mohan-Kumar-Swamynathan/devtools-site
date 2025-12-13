import clsx from 'clsx';

interface Props {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  text?: string;
}

export default function LoadingSpinner({ size = 'md', className = '', text }: Props) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  };

  return (
    <div className={clsx('flex flex-col items-center justify-center gap-2', className)}>
      <div
        className={clsx(
          'animate-spin rounded-full border-2 border-t-transparent',
          sizeClasses[size]
        )}
        style={{
          borderColor: 'var(--border-primary)',
          borderTopColor: 'var(--brand-primary)'
        }}
        role="status"
        aria-label="Loading"
      >
        <span className="sr-only">Loading...</span>
      </div>
      {text && (
        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
          {text}
        </p>
      )}
    </div>
  );
}

