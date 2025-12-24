import { useState, useCallback } from 'react';
import CodeEditor from '@/components/common/CodeEditor';
import { diffJson } from 'diff';
import ToolShell from './ToolShell';
import { useToast } from '@/hooks/useToast';

export default function JsonDiff() {
  const [json1, setJson1] = useState('');
  const [json2, setJson2] = useState('');
  const [diff, setDiff] = useState<Array<{ value: string; added?: boolean; removed?: boolean }>>([]);
  const [error, setError] = useState('');

  const compare = useCallback(() => {
    setError('');
    try {
      const obj1 = JSON.parse(json1);
      const obj2 = JSON.parse(json2);
      
      const str1 = JSON.stringify(obj1, null, 2);
      const str2 = JSON.stringify(obj2, null, 2);
      
      const differences = diffJson(str1, str2);
      setDiff(differences);
    } catch (e) {
      setError(`Invalid JSON: ${(e as Error).message}`);
      setDiff([]);
    }
  }, [json1, json2]);

  
  const controls = (
          <div className="flex items-center gap-3">
        <button onClick={compare} disabled={!json1 || !json2} className="btn-primary">
          Compare
        </button>
        <button onClick={() => { setJson1(''); setJson2(''); setDiff([]); setError(''); }} className="btn-ghost">
          Clear
        </button>
      </div>
  );

  return (
    <ToolShell className="space-y-6" controls={controls}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <CodeEditor
          value={json1}
          onChange={setJson1}
          language="json"
          label="JSON 1"
          placeholder='{"name": "John", "age": 30}'
        />
        <CodeEditor
          value={json2}
          onChange={setJson2}
          language="json"
          label="JSON 2"
          placeholder='{"name": "Jane", "age": 25}'
        />
      </div>

{/* Controls moved to header */}








      {error && <div className="alert-error">{error}</div>}

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

