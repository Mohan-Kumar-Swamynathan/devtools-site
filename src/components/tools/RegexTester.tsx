import { useState, useMemo } from 'react';
import ToolShell from './ToolShell';
import CodeEditor from '@/components/common/CodeEditor';

export default function RegexTester() {
  const [regexStr, setRegexStr] = useState('');
  const [flags, setFlags] = useState('gm');
  const [text, setText] = useState('The quick brown fox jumps over the lazy dog.\nEmail: test@example.com\nPhone: 123-456-7890');
  const [error, setError] = useState('');

  const matches = useMemo(() => {
    if (!regexStr) return [];
    try {
      const regex = new RegExp(regexStr, flags);
      const results = [];
      let match;

      if (!flags.includes('g')) {
        const m = regex.exec(text);
        if (m) results.push({ index: m.index, match: m[0], groups: m.groups });
        return results;
      }

      let loopLimit = 1000;
      while ((match = regex.exec(text)) !== null && loopLimit-- > 0) {
        results.push({ index: match.index, match: match[0], groups: match.groups });
        if (match.index === regex.lastIndex) regex.lastIndex++;
      }
      setError('');
      return results;
    } catch (e: any) {
      setError(e.message);
      return [];
    }
  }, [regexStr, flags, text]);

  const toggleFlag = (f: string) => {
    setFlags(prev => prev.includes(f) ? prev.replace(f, '') : prev + f);
  };

  const controls = (
    <div className="flex items-center gap-2">
      <div className="flex bg-[var(--bg-tertiary)] rounded-lg p-1">
        {['g', 'i', 'm', 's', 'u', 'y'].map(f => (
          <button
            key={f}
            onClick={() => toggleFlag(f)}
            className={`px-2 py-1 rounded text-xs font-mono transition-colors ${flags.includes(f) ? 'bg-white text-black' : 'hover:bg-[var(--bg-elevated)]'}`}
            title={`Flag: ${f}`}
          >
            {f}
          </button>
        ))}
      </div>
    </div>
  );

  const controls2 = null;

  return (
    <ToolShell
      title="Regex Tester"
      description="Test regular expressions in real-time"
      controls={controls}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-full">
        <div className="space-y-4 flex flex-col">
          <div className="flex-none">
            <label className="label">Regular Expression</label>
            <div className="flex items-center gap-2">
              <span className="text-xl text-[var(--text-secondary)]">/</span>
              <input
                value={regexStr}
                onChange={e => setRegexStr(e.target.value)}
                className="input-base font-mono"
                placeholder="e.g. [a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}"
              />
              <span className="text-xl text-[var(--text-secondary)]">/{flags}</span>
            </div>
            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
          </div>

          <div className="flex-1 flex flex-col min-h-[300px]">
            <CodeEditor
              value={text}
              onChange={setText}
              language="text"
              label="Test String"
              className="h-full"
            />
          </div>
        </div>

        <div className="flex flex-col h-full overflow-hidden">
          <label className="label mb-2">Matches ({matches.length})</label>
          <div className="flex-1 overflow-auto space-y-2 p-4 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-primary)]">
            {matches.length === 0 ? (
              <p className="text-[var(--text-muted)] italic">No matches found</p>
            ) : matches.map((m, i) => (
              <div key={i} className="p-3 rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border-primary)]">
                <div className="flex justify-between text-xs text-[var(--text-muted)] mb-1">
                  <span>Match #{i + 1}</span>
                  <span>Index: {m.index}</span>
                </div>
                <div className="font-mono text-[var(--brand-primary)] break-all">{m.match}</div>
                {m.groups && (
                  <div className="mt-2 text-xs space-y-1">
                    <p className="text-[var(--text-secondary)]">Groups:</p>
                    {Object.entries(m.groups).map(([k, v]) => (
                      <div key={k} className="flex gap-2">
                        <span className="text-blue-400">{k}:</span>
                        <span className="text-[var(--text-primary)]">{v as string}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </ToolShell>
  );
}
