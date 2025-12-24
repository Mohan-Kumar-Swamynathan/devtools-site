import { useState, useCallback } from 'react';
import { Search, Copy } from 'lucide-react';
import ToolShell from './ToolShell';
import { useToast } from '@/hooks/useToast';

const UNICODE_RANGES = [
  { name: 'Basic Latin', start: 0x0020, end: 0x007F },
  { name: 'Latin-1 Supplement', start: 0x00A0, end: 0x00FF },
  { name: 'Latin Extended-A', start: 0x0100, end: 0x017F },
  { name: 'General Punctuation', start: 0x2000, end: 0x206F },
  { name: 'Mathematical Operators', start: 0x2200, end: 0x22FF },
  { name: 'Arrows', start: 0x2190, end: 0x21FF },
  { name: 'Box Drawing', start: 0x2500, end: 0x257F },
  { name: 'Block Elements', start: 0x2580, end: 0x259F },
  { name: 'Geometric Shapes', start: 0x25A0, end: 0x25FF },
  { name: 'Misc Symbols', start: 0x2600, end: 0x26FF },
  { name: 'Dingbats', start: 0x2700, end: 0x27BF },
];

export default function UnicodeLookup() {
  const [search, setSearch] = useState('');
  const [selectedRange, setSelectedRange] = useState(UNICODE_RANGES[0]);
  const { showToast } = useToast();

  const generateChars = (start: number, end: number) => {
    const chars = [];
    for (let i = start; i <= end && i <= start + 200; i++) {
      try {
        const char = String.fromCharCode(i);
        if (char.trim() || char === ' ') {
          chars.push({ code: i, char });
        }
      } catch (e) {
        // Skip invalid characters
      }
    }
    return chars;
  };

  const chars = generateChars(selectedRange.start, selectedRange.end);
  const filteredChars = chars.filter(({ char, code }) =>
    !search || char.includes(search) || code.toString(16).includes(search.toLowerCase()) || code.toString().includes(search)
  );

  const handleCopy = useCallback((text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      showToast('Copied to clipboard!', 'success');
    });
  }, [showToast]);

  
  const controls = (
          <div className="flex items-center gap-3">
        <div className="flex-1 min-w-[200px]">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2" size={18} style={{ color: 'var(--text-muted)' }} />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input w-full pl-10"
              placeholder="Search by character or code point..."
            />
          </div>
        </div>
      </div>
  );

  return (
    <ToolShell className="space-y-6" controls={controls}>
{/* Controls moved to header */}














      <div className="flex flex-wrap gap-2 mb-4">
        {UNICODE_RANGES.map(range => (
          <button
            key={range.name}
            onClick={() => {
              setSelectedRange(range);
              setSearch('');
            }}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              selectedRange.name === range.name
                ? 'btn-primary'
                : 'btn-secondary'
            }`}
          >
            {range.name}
          </button>
        ))}
      </div>

      <div className="p-4 rounded-xl border" style={{
        backgroundColor: 'var(--bg-secondary)',
        borderColor: 'var(--border-primary)'
      }}>
        <div className="grid grid-cols-8 sm:grid-cols-10 md:grid-cols-12 gap-2 max-h-96 overflow-y-auto custom-scrollbar">
          {filteredChars.map(({ char, code }) => (
            <button
              key={code}
              onClick={() => handleCopy(char)}
              className="p-3 rounded-lg hover:bg-[var(--bg-tertiary)] transition-all hover:scale-110 flex flex-col items-center gap-1"
              title={`U+${code.toString(16).toUpperCase().padStart(4, '0')} (${code})`}
            >
              <span className="text-2xl">{char}</span>
              <span className="text-[10px] font-mono" style={{ color: 'var(--text-muted)' }}>
                U+{code.toString(16).toUpperCase().padStart(4, '0')}
              </span>
            </button>
          ))}
        </div>
      </div>
    </ToolShell>
  );
}

