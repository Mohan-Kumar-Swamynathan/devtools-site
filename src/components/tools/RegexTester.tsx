import { useState, useCallback, useMemo } from 'react';
import CodeEditor from '@/components/common/CodeEditor';

export default function RegexTester() {
  const [pattern, setPattern] = useState('');
  const [testString, setTestString] = useState('');
  const [flags, setFlags] = useState({
    global: true,
    ignoreCase: false,
    multiline: false
  });
  const [error, setError] = useState('');

  const matches = useMemo(() => {
    if (!pattern || !testString) return [];
    
    setError('');
    try {
      let flagString = '';
      if (flags.global) flagString += 'g';
      if (flags.ignoreCase) flagString += 'i';
      if (flags.multiline) flagString += 'm';
      
      const regex = new RegExp(pattern, flagString);
      const matches = Array.from(testString.matchAll(regex));
      return matches;
    } catch (e) {
      setError((e as Error).message);
      return [];
    }
  }, [pattern, testString, flags]);

  const highlightedText = useMemo(() => {
    if (!pattern || !testString || error) return testString;
    
    try {
      let flagString = '';
      if (flags.global) flagString += 'g';
      if (flags.ignoreCase) flagString += 'i';
      if (flags.multiline) flagString += 'm';
      
      const regex = new RegExp(pattern, flagString);
      const parts = [];
      let lastIndex = 0;
      let match;
      
      while ((match = regex.exec(testString)) !== null) {
        if (match.index === lastIndex && match[0] === '') break;
        parts.push(testString.slice(lastIndex, match.index));
        parts.push(`<mark style="background-color: var(--brand-primary-light); color: var(--brand-primary); padding: 2px 4px; border-radius: 4px;">${match[0]}</mark>`);
        lastIndex = match.index + match[0].length;
        if (!flags.global) break;
      }
      parts.push(testString.slice(lastIndex));
      return parts.join('');
    } catch {
      return testString;
    }
  }, [pattern, testString, flags, error]);

  return (
    <div className="space-y-6">
      {/* Pattern Input */}
      <div>
        <label className="label">Regular Expression</label>
        <input
          type="text"
          value={pattern}
          onChange={(e) => setPattern(e.target.value)}
          placeholder="/pattern/flags"
          className="input-base font-mono"
        />
      </div>

      {/* Flags */}
      <div className="flex flex-wrap gap-4">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={flags.global}
            onChange={(e) => setFlags({ ...flags, global: e.target.checked })}
            className="w-4 h-4 rounded"
          />
          <span style={{ color: 'var(--text-primary)' }}>Global (g)</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={flags.ignoreCase}
            onChange={(e) => setFlags({ ...flags, ignoreCase: e.target.checked })}
            className="w-4 h-4 rounded"
          />
          <span style={{ color: 'var(--text-primary)' }}>Ignore Case (i)</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={flags.multiline}
            onChange={(e) => setFlags({ ...flags, multiline: e.target.checked })}
            className="w-4 h-4 rounded"
          />
          <span style={{ color: 'var(--text-primary)' }}>Multiline (m)</span>
        </label>
      </div>

      {/* Test String */}
      <CodeEditor
        value={testString}
        onChange={setTestString}
        language="text"
        label="Test String"
        placeholder="Enter text to test against the regex..."
      />

      {/* Error */}
      {error && <div className="alert-error">Error: {error}</div>}

      {/* Results */}
      {pattern && testString && !error && (
        <div className="space-y-4">
          <div>
            <label className="label">Matches ({matches.length})</label>
            <div 
              className="p-4 rounded-xl border font-mono text-sm"
              style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-primary)' }}
            >
              {matches.length > 0 ? (
                <div className="space-y-2">
                  {matches.map((match, i) => (
                    <div key={i} className="p-2 rounded" style={{ backgroundColor: 'var(--bg-tertiary)' }}>
                      <div className="font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>
                        Match {i + 1}: "{match[0]}"
                      </div>
                      {match.length > 1 && (
                        <div className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
                          Groups: {match.slice(1).map((g, j) => `$${j + 1}="${g}"`).join(', ')}
                        </div>
                      )}
                      <div className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
                        Index: {match.index}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ color: 'var(--text-muted)' }}>No matches found</div>
              )}
            </div>
          </div>

          <div>
            <label className="label">Highlighted Text</label>
            <div 
              className="p-4 rounded-xl border"
              style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-primary)' }}
            >
              <div 
                className="font-mono text-sm whitespace-pre-wrap"
                dangerouslySetInnerHTML={{ __html: highlightedText || testString }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


