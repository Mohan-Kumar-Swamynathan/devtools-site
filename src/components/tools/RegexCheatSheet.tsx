import { useState } from 'react';
import ToolShell from './ToolShell';
import { useToast } from '@/hooks/useToast';

const cheatSheet = {
  'Character Classes': [
    { pattern: '.', description: 'Any character except newline' },
    { pattern: '\\d', description: 'Digit (0-9)' },
    { pattern: '\\D', description: 'Not a digit' },
    { pattern: '\\w', description: 'Word character (a-z, A-Z, 0-9, _)' },
    { pattern: '\\W', description: 'Not a word character' },
    { pattern: '\\s', description: 'Whitespace' },
    { pattern: '\\S', description: 'Not whitespace' }
  ],
  'Anchors': [
    { pattern: '^', description: 'Start of string' },
    { pattern: '$', description: 'End of string' },
    { pattern: '\\b', description: 'Word boundary' },
    { pattern: '\\B', description: 'Not a word boundary' }
  ],
  'Quantifiers': [
    { pattern: '*', description: 'Zero or more' },
    { pattern: '+', description: 'One or more' },
    { pattern: '?', description: 'Zero or one' },
    { pattern: '{n}', description: 'Exactly n times' },
    { pattern: '{n,}', description: 'n or more times' },
    { pattern: '{n,m}', description: 'Between n and m times' }
  ],
  'Groups': [
    { pattern: '()', description: 'Capturing group' },
    { pattern: '(?:)', description: 'Non-capturing group' },
    { pattern: '(?=)', description: 'Positive lookahead' },
    { pattern: '(?!)', description: 'Negative lookahead' }
  ],
  'Flags': [
    { pattern: 'g', description: 'Global (find all matches)' },
    { pattern: 'i', description: 'Case insensitive' },
    { pattern: 'm', description: 'Multiline' },
    { pattern: 's', description: 'Dot matches newline' }
  ]
};

export default function RegexCheatSheet() {
  const [search, setSearch] = useState('');

  const filtered = Object.entries(cheatSheet).map(([category, items]) => ({
    category,
    items: items.filter(item => 
      item.pattern.toLowerCase().includes(search.toLowerCase()) ||
      item.description.toLowerCase().includes(search.toLowerCase())
    )
  })).filter(section => section.items.length > 0);

  const controls = null;

  return (
    <ToolShell className="space-y-6" controls={controls}>
      <div>
        <label className="label">Search</label>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search patterns..."
          className="input-base"
        />
      </div>

      <div className="space-y-6">
        {filtered.map(({ category, items }) => (
          <div key={category}>
            <h3 className="text-lg font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>
              {category}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {items.map((item, i) => (
                <div
                  key={i}
                  className="p-3 rounded-lg border"
                  style={{ borderColor: 'var(--border-primary)' }}
                >
                  <code className="font-mono text-sm font-bold" style={{ color: 'var(--text-primary)' }}>
                    {item.pattern}
                  </code>
                  <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </ToolShell>
  );
}

