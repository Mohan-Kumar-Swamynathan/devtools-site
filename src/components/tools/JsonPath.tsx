import { useState, useCallback } from 'react';
import CodeEditor from '@/components/common/CodeEditor';
import OutputPanel from '@/components/common/OutputPanel';
import ToolShell from './ToolShell';
import { useToast } from '@/hooks/useToast';

export default function JsonPath() {
  const [json, setJson] = useState('');
  const [path, setPath] = useState('');
  const [result, setResult] = useState('');
  const [error, setError] = useState('');

  const extract = useCallback(() => {
    setError('');
    try {
      const obj = JSON.parse(json);
      
      // Simple JSONPath-like extraction
      const getValue = (obj: any, pathStr: string): any => {
        if (!pathStr || pathStr === '$') return obj;
        
        const parts = pathStr.replace(/^\$\.?/, '').split(/[\.\[\]]/).filter(p => p);
        let current = obj;
        
        for (const part of parts) {
          if (part === '') continue;
          const num = Number(part);
          if (!isNaN(num)) {
            current = current[num];
          } else {
            current = current?.[part];
          }
          if (current === undefined) return undefined;
        }
        
        return current;
      };
      
      const value = getValue(obj, path);
      if (value === undefined) {
        setError('Path not found');
        setResult('');
      } else {
        setResult(JSON.stringify(value, null, 2));
      }
    } catch (e) {
      setError(`Error: ${(e as Error).message}`);
      setResult('');
    }
  }, [json, path]);

  const findAllPaths = useCallback(() => {
    setError('');
    try {
      const obj = JSON.parse(json);
      
      const paths: string[] = [];
      const traverse = (obj: any, currentPath = '$') => {
        if (typeof obj === 'object' && obj !== null) {
          if (Array.isArray(obj)) {
            obj.forEach((item, idx) => {
              traverse(item, `${currentPath}[${idx}]`);
            });
          } else {
            paths.push(currentPath);
            Object.entries(obj).forEach(([key, value]) => {
              const newPath = /^[a-zA-Z_][\w]*$/.test(key) 
                ? `${currentPath}.${key}` 
                : `${currentPath}["${key}"]`;
              traverse(value, newPath);
            });
          }
        } else {
          paths.push(currentPath);
        }
      };
      
      traverse(obj);
      setResult(paths.join('\n'));
      setPath('');
    } catch (e) {
      setError(`Invalid JSON: ${(e as Error).message}`);
      setResult('');
    }
  }, [json]);

  
  const controls = (
          <div className="flex items-center gap-3">
        <button onClick={extract} disabled={!json || !path} className="btn-primary">
          Extract Value
        </button>
        <button onClick={findAllPaths} disabled={!json} className="btn-secondary">
          List All Paths
        </button>
        <button onClick={() => { setJson(''); setPath(''); setResult(''); setError(''); }} className="btn-ghost">
          Clear
        </button>
      </div>
  );

  return (
    <ToolShell className="space-y-6" controls={controls}>
      <CodeEditor
        value={json}
        onChange={setJson}
        language="json"
        label="JSON Input"
        placeholder='{"user": {"name": "John", "age": 30}}'
      />

      <div>
        <label className="label">JSON Path Expression</label>
        <input
          type="text"
          value={path}
          onChange={(e) => setPath(e.target.value)}
          placeholder="$.user.name or leave empty to list all paths"
          className="input-base font-mono"
        />
        <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
          Examples: $.user.name, $[0].id, $.items[0].name
        </p>
      </div>

{/* Controls moved to header */}











      {error && <div className="alert-error">{error}</div>}
      {result && (
        <OutputPanel
          value={result}
          label="Result"
          language="json"
          showLineNumbers
        />
      )}
    </ToolShell>
  );
}

