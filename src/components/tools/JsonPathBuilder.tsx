import { useState, useCallback } from 'react';
import { Copy, Search, RotateCcw } from 'lucide-react';
import { useToast } from '@/hooks/useToast';
import ErrorMessage from '@/components/common/ErrorMessage';

export default function JsonPathBuilder() {
  const [json, setJson] = useState('{"name": "John", "age": 30, "city": "New York"}');
  const [path, setPath] = useState('$.name');
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState('');
  const { showToast } = useToast();

  const evaluatePath = useCallback((jsonStr: string, pathStr: string) => {
    try {
      const data = JSON.parse(jsonStr);
      const parts = pathStr.replace(/^\$\.?/, '').split('.');
      let current = data;
      
      for (const part of parts) {
        if (part.includes('[')) {
          const [key, index] = part.split('[');
          if (key) current = current[key];
          const idx = parseInt(index.replace(']', ''));
          current = current[idx];
        } else {
          current = current[part];
        }
        if (current === undefined) {
          throw new Error(`Path not found: ${part}`);
        }
      }
      
      return current;
    } catch (e) {
      throw e;
    }
  }, []);

  const handleEvaluate = useCallback(() => {
    setError('');
    try {
      const res = evaluatePath(json, path);
      setResult(res);
    } catch (e) {
      setError(`Error: ${(e as Error).message}`);
      setResult(null);
    }
  }, [json, path, evaluatePath]);

  const handleCopy = useCallback(() => {
    const output = JSON.stringify(result, null, 2);
    navigator.clipboard.writeText(output).then(() => {
      showToast('Copied to clipboard!', 'success');
    });
  }, [result, showToast]);

  return (
    <div className="space-y-6">
      {error && <ErrorMessage message={error} onDismiss={() => setError('')} />}

      <div className="flex flex-wrap items-center gap-3">
        <button
          onClick={handleEvaluate}
          className="btn-primary flex items-center gap-2"
        >
          <Search size={18} />
          Evaluate Path
        </button>
        {result !== null && (
          <button
            onClick={handleCopy}
            className="btn-secondary flex items-center gap-2"
          >
            <Copy size={18} />
            Copy Result
          </button>
        )}
        <button
          onClick={() => {
            setJson('{"name": "John", "age": 30, "city": "New York"}');
            setPath('$.name');
            setResult(null);
            setError('');
          }}
          className="btn-ghost flex items-center gap-2"
        >
          <RotateCcw size={18} />
          Reset
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
            JSON Data
          </h3>
          <textarea
            value={json}
            onChange={(e) => setJson(e.target.value)}
            className="input w-full h-64 font-mono text-sm"
            placeholder='{"key": "value"}'
          />
        </div>
        <div className="space-y-4">
          <h3 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
            JSON Path
          </h3>
          <input
            type="text"
            value={path}
            onChange={(e) => setPath(e.target.value)}
            className="input w-full font-mono"
            placeholder="$.name or $.users[0].name"
          />
          <div className="p-3 rounded-lg text-xs" style={{ backgroundColor: 'var(--bg-tertiary)' }}>
            <p className="mb-2 font-semibold" style={{ color: 'var(--text-primary)' }}>Examples:</p>
            <ul className="space-y-1" style={{ color: 'var(--text-muted)' }}>
              <li>• <code>$.name</code> - Access property</li>
              <li>• <code>$.users[0]</code> - Access array element</li>
              <li>• <code>$.users[0].name</code> - Nested access</li>
            </ul>
          </div>
        </div>
      </div>

      {result !== null && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
            Result
          </h3>
          <div className="p-4 rounded-xl border" style={{
            backgroundColor: 'var(--bg-secondary)',
            borderColor: 'var(--border-primary)'
          }}>
            <pre className="text-sm overflow-x-auto" style={{ color: 'var(--text-primary)' }}>
              <code>{JSON.stringify(result, null, 2)}</code>
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}

