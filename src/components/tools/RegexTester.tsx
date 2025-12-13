import { useState, useCallback } from 'react';
import CodeEditor from '@/components/common/CodeEditor';
import OutputPanel from '@/components/common/OutputPanel';

export default function RegexTester() {
  const [pattern, setPattern] = useState('');
  const [text, setText] = useState('');
  const [flags, setFlags] = useState('g');
  const [matches, setMatches] = useState<string[]>([]);
  const [error, setError] = useState('');

  const test = useCallback(() => {
    setError('');
    setMatches([]);
    
    if (!pattern) return;

    try {
      const regex = new RegExp(pattern, flags);
      const matchArray = text.match(regex);
      
      if (matchArray) {
        setMatches(matchArray);
      } else {
        setMatches([]);
      }
    } catch (e) {
      setError(`Invalid regex: ${(e as Error).message}`);
      setMatches([]);
    }
  }, [pattern, text, flags]);

  return (
    <div className="space-y-6">
      <div>
        <label className="label">Regular Expression Pattern</label>
        <input
          type="text"
          value={pattern}
          onChange={(e) => { setPattern(e.target.value); test(); }}
          placeholder="\d+"
          className="input-base font-mono"
        />
      </div>

      <div>
        <label className="label">Flags</label>
        <div className="flex gap-3">
          {['g', 'i', 'm', 's'].map(flag => (
            <label key={flag} className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={flags.includes(flag)}
                onChange={(e) => {
                  if (e.target.checked) {
                    setFlags(flags + flag);
                  } else {
                    setFlags(flags.replace(flag, ''));
                  }
                  test();
                }}
                className="checkbox"
              />
              <span className="font-mono">{flag}</span>
            </label>
          ))}
        </div>
      </div>

      <CodeEditor
        value={text}
        onChange={(v) => { setText(v); test(); }}
        language="text"
        label="Test Text"
        placeholder="Hello 123 World 456"
      />

      {error && <div className="alert-error">{error}</div>}
      {matches.length > 0 && (
        <div>
          <label className="label">Matches ({matches.length})</label>
          <OutputPanel
            value={matches.join('\n')}
            language="text"
          />
        </div>
      )}
      {!error && pattern && text && matches.length === 0 && (
        <div className="alert-warning">No matches found</div>
      )}
    </div>
  );
}
