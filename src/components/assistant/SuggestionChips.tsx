import { getPopularTools } from '@/lib/tools';

interface Props {
  onSelect: (text: string) => void;
}

const quickSuggestions = [
  'Show me all tools',
  'Find JSON formatter',
  'Help me encode base64',
  'What tools do you have?'
];

export default function SuggestionChips({ onSelect }: Props) {
  const popularTools = getPopularTools().slice(0, 4);

  return (
    <div className="px-4 pb-2 space-y-3">
      <div>
        <p className="text-xs font-medium mb-2" style={{ color: 'var(--text-muted)' }}>Quick Questions:</p>
        <div className="flex flex-wrap gap-2">
          {quickSuggestions.map((s, i) => (
            <button
              key={i}
              onClick={() => onSelect(s)}
              className="px-3 py-1.5 text-xs rounded-full border transition-colors hover:bg-[var(--bg-secondary)]"
              style={{
                borderColor: '#444',
                color: '#e0e0e0',
                backgroundColor: '#222'
              }}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {popularTools.length > 0 && (
        <div>
          <p className="text-xs font-medium mb-2" style={{ color: 'var(--text-muted)' }}>Popular Tools:</p>
          <div className="flex flex-wrap gap-2">
            {popularTools.map((tool) => (
              <button
                key={tool.id}
                onClick={() => onSelect(`Take me to ${tool.name}`)}
                className="px-3 py-1.5 text-xs rounded-lg border transition-all hover:scale-105 flex items-center gap-1.5"
                style={{
                  borderColor: 'var(--border-primary)',
                  color: 'var(--text-primary)',
                  backgroundColor: 'var(--bg-primary)'
                }}
              >
                <span>{tool.icon}</span>
                <span>{tool.name}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
