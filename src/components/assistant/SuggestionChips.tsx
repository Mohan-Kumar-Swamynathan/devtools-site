interface Props {
  onSelect: (text: string) => void;
}

const suggestions = [
  'What tools do you have?',
  'Help me format JSON',
  'How do I decode JWT?',
  'Find a password generator'
];

export default function SuggestionChips({ onSelect }: Props) {
  return (
    <div className="px-4 pb-2 flex flex-wrap gap-2">
      {suggestions.map((s, i) => (
        <button
          key={i}
          onClick={() => onSelect(s)}
          className="px-3 py-1.5 text-xs rounded-full border transition-colors hover:bg-[var(--bg-secondary)]"
          style={{ 
            borderColor: 'var(--border-primary)', 
            color: 'var(--text-secondary)',
            backgroundColor: 'var(--bg-primary)'
          }}
        >
          {s}
        </button>
      ))}
    </div>
  );
}

