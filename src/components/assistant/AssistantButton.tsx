import { MessageCircle } from 'lucide-react';

interface Props {
  onClick: () => void;
}

export default function AssistantButton({ onClick }: Props) {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full flex items-center justify-center ripple touch-target transition-material elevation-4 hover:elevation-8 active:elevation-2"
      style={{ 
        backgroundColor: 'var(--brand-primary)',
        transition: 'transform var(--duration-standard) var(--ease-standard), box-shadow var(--duration-standard) var(--ease-standard)'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'scale(1.1)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'scale(1)';
      }}
      aria-label="Open chat assistant"
      title="Open chat assistant"
    >
      <MessageCircle size={24} style={{ color: 'white' }} />
    </button>
  );
}

