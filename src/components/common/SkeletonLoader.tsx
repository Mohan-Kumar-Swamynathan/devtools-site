interface Props {
  lines?: number;
  className?: string;
  showAvatar?: boolean;
}

export default function SkeletonLoader({ 
  lines = 3, 
  className = '',
  showAvatar = false 
}: Props) {
  return (
    <div className={`animate-pulse space-y-3 ${className}`} role="status" aria-label="Loading">
      {showAvatar && (
        <div className="flex items-center space-x-4">
          <div 
            className="rounded-full h-12 w-12"
            style={{ backgroundColor: 'var(--bg-tertiary)' }}
          />
          <div className="flex-1 space-y-2">
            <div 
              className="h-4 rounded w-3/4"
              style={{ backgroundColor: 'var(--bg-tertiary)' }}
            />
            <div 
              className="h-4 rounded w-1/2"
              style={{ backgroundColor: 'var(--bg-tertiary)' }}
            />
          </div>
        </div>
      )}
      {Array.from({ length: lines }).map((_, i) => (
        <div 
          key={i}
          className={`h-4 rounded ${i === lines - 1 ? 'w-5/6' : 'w-full'}`}
          style={{ backgroundColor: 'var(--bg-tertiary)' }}
        />
      ))}
      <span className="sr-only">Loading content...</span>
    </div>
  );
}
