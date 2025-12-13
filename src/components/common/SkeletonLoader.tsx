import clsx from 'clsx';

interface Props {
  className?: string;
  lines?: number;
  width?: string;
  height?: string;
}

export default function SkeletonLoader({ 
  className = '', 
  lines = 1, 
  width = '100%',
  height = '1rem'
}: Props) {
  if (lines > 1) {
    return (
      <div className={clsx('space-y-2', className)}>
        {Array.from({ length: lines }).map((_, i) => (
          <div
            key={i}
            className="skeleton rounded"
            style={{
              width: i === lines - 1 ? '80%' : width,
              height
            }}
          />
        ))}
      </div>
    );
  }

  return (
    <div
      className={clsx('skeleton rounded', className)}
      style={{ width, height }}
    />
  );
}

