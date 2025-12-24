import { useState, useCallback } from 'react';
import CodeEditor from '@/components/common/CodeEditor';
import { diffLines } from 'diff';
import ToolShell from './ToolShell';
import { useToast } from '@/hooks/useToast';

export default function TextDiff() {
  const [text1, setText1] = useState('');
  const [text2, setText2] = useState('');
  const [diff, setDiff] = useState<Array<{ value: string; added?: boolean; removed?: boolean }>>([]);

  const compare = useCallback(() => {
    const differences = diffLines(text1, text2);
    setDiff(differences);
  }, [text1, text2]);

  
  const controls = (
          <div className="flex items-center gap-3">
        <button onClick={compare} disabled={!text1 || !text2} className="btn-primary">
          Compare
        </button>
        <button onClick={() => { setText1(''); setText2(''); setDiff([]); }} className="btn-ghost">
          Clear
        </button>
      </div>
  );

  return (
    <ToolShell className="space-y-6" controls={controls}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <CodeEditor
          value={text1}
          onChange={setText1}
          language="text"
          label="Text 1"
          placeholder="First text"
        />
        <CodeEditor
          value={text2}
          onChange={setText2}
          language="text"
          label="Text 2"
          placeholder="Second text"
        />
      </div>

{/* Controls moved to header */}








      {diff.length > 0 && (
        <div>
          <label className="label">Differences</label>
          <div 
            className="p-4 rounded-xl border font-mono text-sm overflow-auto max-h-[400px]"
            style={{ backgroundColor: 'var(--syntax-bg)', borderColor: 'var(--border-primary)' }}
          >
            <pre style={{ color: 'var(--syntax-text)' }}>
              {diff.map((part, i) => {
                let style: React.CSSProperties = {};
                if (part.added) {
                  style = { backgroundColor: 'rgba(34, 197, 94, 0.2)', color: '#22c55e' };
                } else if (part.removed) {
                  style = { backgroundColor: 'rgba(239, 68, 68, 0.2)', color: '#ef4444' };
                }
                return (
                  <span key={i} style={style}>
                    {part.value}
                  </span>
                );
              })}
            </pre>
          </div>
        </div>
      )}
    </ToolShell>
  );
}

