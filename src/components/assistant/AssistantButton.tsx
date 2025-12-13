import { MessageCircle } from 'lucide-react';

interface Props {
  onClick: () => void;
}

export default function AssistantButton({ onClick }: Props) {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-transform hover:scale-110 active:scale-95 touch-target"
      style={{ backgroundColor: 'var(--brand-primary)' }}
      aria-label="Open assistant"
    >
      <MessageCircle size={24} className="text-white" />
    </button>
  );
}

