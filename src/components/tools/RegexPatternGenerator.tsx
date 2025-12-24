import { useState, useCallback } from 'react';
import CodeEditor from '@/components/common/CodeEditor';
import OutputPanel from '@/components/common/OutputPanel';
import ErrorMessage from '@/components/common/ErrorMessage';
import ToolShell from './ToolShell';
import { useToast } from '@/hooks/useToast';

interface Pattern {
  name: string;
  pattern: string;
  description: string;
  example: string;
}

const commonPatterns: Pattern[] = [
  { name: 'Email', pattern: '[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}', description: 'Email address', example: 'user@example.com' },
  { name: 'URL', pattern: 'https?://[\\w\\-]+(\\.[\\w\\-]+)+([\\w\\-\\.,@?^=%&:/~\\+#]*[\\w\\-\\@?^=%&/~\\+#])?', description: 'HTTP/HTTPS URL', example: 'https://example.com' },
  { name: 'Phone (US)', pattern: '\\+?1?[-.\\s]?\\(?([0-9]{3})\\)?[-.\\s]?([0-9]{3})[-.\\s]?([0-9]{4})', description: 'US phone number', example: '(555) 123-4567' },
  { name: 'Date (YYYY-MM-DD)', pattern: '\\d{4}-\\d{2}-\\d{2}', description: 'Date in YYYY-MM-DD format', example: '2024-01-15' },
  { name: 'Time (HH:MM)', pattern: '([01]?[0-9]|2[0-3]):[0-5][0-9]', description: '24-hour time format', example: '14:30' },
  { name: 'IPv4 Address', pattern: '\\b(?:\\d{1,3}\\.){3}\\d{1,3}\\b', description: 'IPv4 address', example: '192.168.1.1' },
  { name: 'Credit Card', pattern: '\\d{4}[\\s-]?\\d{4}[\\s-]?\\d{4}[\\s-]?\\d{4}', description: 'Credit card number', example: '1234 5678 9012 3456' },
  { name: 'Hex Color', pattern: '#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})', description: 'Hexadecimal color code', example: '#FF5733' },
  { name: 'Postal Code (US)', pattern: '\\d{5}(-\\d{4})?', description: 'US ZIP code', example: '12345-6789' },
  { name: 'Alphanumeric', pattern: '[a-zA-Z0-9]+', description: 'Letters and numbers only', example: 'abc123' },
  { name: 'Numbers Only', pattern: '\\d+', description: 'Digits only', example: '12345' },
  { name: 'Letters Only', pattern: '[a-zA-Z]+', description: 'Letters only', example: 'abc' },
];

export default function RegexPatternGenerator() {
  const [pattern, setPattern] = useState('');
  const [testText, setTestText] = useState('');
  const [flags, setFlags] = useState({
    global: true,
    ignoreCase: false,
    multiline: false,
    dotAll: false
  });
  const [matches, setMatches] = useState<string[]>([]);
  const [error, setError] = useState('');

  const testPattern = useCallback(() => {
    setError('');
    setMatches([]);

    if (!pattern.trim()) {
      setError('Please enter a regex pattern');
      return;
    }

    try {
      let flagString = '';
      if (flags.global) flagString += 'g';
      if (flags.ignoreCase) flagString += 'i';
      if (flags.multiline) flagString += 'm';
      if (flags.dotAll) flagString += 's';

      const regex = new RegExp(pattern, flagString);
      const testMatches = testText.match(regex);

      if (testMatches) {
        setMatches(testMatches);
      } else {
        setMatches([]);
      }
    } catch (e) {
      setError(`Invalid regex pattern: ${(e as Error).message}`);
      setMatches([]);
    }
  }, [pattern, testText, flags]);

  const usePattern = useCallback((selectedPattern: Pattern) => {
    setPattern(selectedPattern.pattern);
    setTestText(selectedPattern.example);
    setError('');
  }, []);

  const getPatternInfo = useCallback(() => {
    if (!pattern.trim()) return null;

    try {
      const regex = new RegExp(pattern);
      return {
        valid: true,
        source: regex.source,
        flags: regex.flags
      };
    } catch {
      return { valid: false };
    }
  }, [pattern]);

  const patternInfo = getPatternInfo();

  const controls = null;

  return (
    <ToolShell className="space-y-6" controls={controls}>
      {error && <ErrorMessage message={error} onDismiss={() => setError('')} />}

      <div>
        <label className="label">Common Patterns</label>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 max-h-64 overflow-y-auto p-2 border rounded-lg" style={{ borderColor: 'var(--border-primary)' }}>
          {commonPatterns.map((p) => (
            <button
              key={p.name}
              onClick={() => usePattern(p)}
              className="p-3 rounded-lg text-left hover:bg-[var(--bg-secondary)] transition-colors border"
              style={{ borderColor: 'var(--border-primary)' }}
            >
              <div className="font-semibold text-sm mb-1" style={{ color: 'var(--text-primary)' }}>
                {p.name}
              </div>
              <code className="text-xs block mb-1 truncate" style={{ color: 'var(--text-muted)' }}>
                {p.pattern}
              </code>
              <div className="text-xs" style={{ color: 'var(--text-muted)' }}>
                {p.description}
              </div>
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="label">Regex Pattern</label>
        <CodeEditor
          value={pattern}
          onChange={setPattern}
          language="text"
          placeholder="/your-pattern-here/"
          rows={3}
        />
        {patternInfo && (
          <div className="mt-2 text-xs" style={{ color: patternInfo.valid ? 'var(--status-success)' : 'var(--status-error)' }}>
            {patternInfo.valid ? '✓ Valid pattern' : '✗ Invalid pattern'}
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={flags.global}
            onChange={(e) => setFlags({ ...flags, global: e.target.checked })}
            className="w-4 h-4"
          />
          <span className="text-sm" style={{ color: 'var(--text-primary)' }}>Global (g)</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={flags.ignoreCase}
            onChange={(e) => setFlags({ ...flags, ignoreCase: e.target.checked })}
            className="w-4 h-4"
          />
          <span className="text-sm" style={{ color: 'var(--text-primary)' }}>Ignore Case (i)</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={flags.multiline}
            onChange={(e) => setFlags({ ...flags, multiline: e.target.checked })}
            className="w-4 h-4"
          />
          <span className="text-sm" style={{ color: 'var(--text-primary)' }}>Multiline (m)</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={flags.dotAll}
            onChange={(e) => setFlags({ ...flags, dotAll: e.target.checked })}
            className="w-4 h-4"
          />
          <span className="text-sm" style={{ color: 'var(--text-primary)' }}>Dot All (s)</span>
        </label>
      </div>

      <div>
        <label className="label">Test Text</label>
        <CodeEditor
          value={testText}
          onChange={setTestText}
          language="text"
          placeholder="Enter text to test against the pattern..."
          rows={4}
        />
        <button
          onClick={testPattern}
          disabled={!pattern.trim() || !testText.trim()}
          className="btn-primary mt-2"
        >
          Test Pattern
        </button>
      </div>

      {matches.length > 0 && (
        <div>
          <label className="label">
            Matches Found: {matches.length}
          </label>
          <OutputPanel
            value={matches.join('\n')}
            language="text"
            showLineNumbers={false}
          />
        </div>
      )}

      {pattern && testText && matches.length === 0 && (
        <div className="p-4 rounded-xl border" style={{ 
          backgroundColor: 'var(--status-error-bg)', 
          borderColor: 'var(--status-error)' 
        }}>
          <p className="text-sm" style={{ color: 'var(--status-error)' }}>
            No matches found
          </p>
        </div>
      )}

      <div className="p-4 rounded-xl border text-sm" style={{ 
        backgroundColor: 'var(--bg-secondary)', 
        borderColor: 'var(--border-primary)' 
      }}>
        <h3 className="font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
          Regex Cheat Sheet:
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs" style={{ color: 'var(--text-muted)' }}>
          <div>
            <strong>Character Classes:</strong>
            <ul className="list-disc list-inside ml-2 space-y-0.5">
              <li><code>\d</code> - Digit</li>
              <li><code>\w</code> - Word character</li>
              <li><code>\s</code> - Whitespace</li>
              <li><code>.</code> - Any character</li>
            </ul>
          </div>
          <div>
            <strong>Quantifiers:</strong>
            <ul className="list-disc list-inside ml-2 space-y-0.5">
              <li><code>*</code> - Zero or more</li>
              <li><code>+</code> - One or more</li>
              <li><code>?</code> - Zero or one</li>
              <li><code>{'{n}'}</code> - Exactly n times</li>
            </ul>
          </div>
        </div>
      </div>
    </ToolShell>
  );
}

