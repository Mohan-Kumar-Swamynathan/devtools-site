import { FileQuestion, Search } from 'lucide-react';

interface Props {
  title?: string;
  description?: string;
  icon?: 'search' | 'empty';
  action?: {
    label: string;
    onClick: () => void;
  };
}

export default function EmptyState({ 
  title = 'No data found',
  description = 'Get started by adding some content.',
  icon = 'empty',
  action
}: Props) {
  const Icon = icon === 'search' ? Search : FileQuestion;

  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      <div 
        className="w-16 h-16 rounded-full flex items-center justify-center mb-4"
        style={{ 
          backgroundColor: 'var(--bg-secondary)',
          color: 'var(--text-muted)'
        }}
      >
        <Icon size={32} />
      </div>
      <h3 
        className="text-lg font-semibold mb-2"
        style={{ color: 'var(--text-primary)' }}
      >
        {title}
      </h3>
      <p 
        className="text-sm max-w-md mb-4"
        style={{ color: 'var(--text-secondary)' }}
      >
        {description}
      </p>
      {action && (
        <button
          onClick={action.onClick}
          className="btn-primary"
          aria-label={action.label}
        >
          {action.label}
        </button>
      )}
    </div>
  );
}






