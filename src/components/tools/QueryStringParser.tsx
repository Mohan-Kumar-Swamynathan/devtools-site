import { useState, useCallback } from 'react';
import CodeEditor from '@/components/common/CodeEditor';
import OutputPanel from '@/components/common/OutputPanel';
import ToolShell from './ToolShell';
import { useToast } from '@/hooks/useToast';

export default function QueryStringParser() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState<'parse' | 'build'>('parse');
  const [error, setError] = useState('');

  const parse = useCallback(() => {
    setError('');
    try {
      const params = new URLSearchParams(input);
      const obj: Record<string, string> = {};
      params.forEach((value, key) => {
        if (obj[key]) {
          if (Array.isArray(obj[key])) {
            (obj[key] as string[]).push(value);
          } else {
            obj[key] = [obj[key] as string, value] as any;
          }
        } else {
          obj[key] = value;
        }
      });
      setOutput(JSON.stringify(obj, null, 2));
    } catch (e) {
      setError(`Error: ${(e as Error).message}`);
      setOutput('');
    }
  }, [input]);

  const build = useCallback(() => {
    setError('');
    try {
      const obj = JSON.parse(input);
      const params = new URLSearchParams();
      Object.entries(obj).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          value.forEach(v => params.append(key, String(v)));
        } else {
          params.set(key, String(value));
        }
      });
      setOutput(params.toString());
    } catch (e) {
      setError(`Invalid JSON: ${(e as Error).message}`);
      setOutput('');
    }
  }, [input]);

  const handleModeChange = (newMode: 'parse' | 'build') => {
    setMode(newMode);
    setInput('');
    setOutput('');
    setError('');
  };

  
  const controls = (
          <div className="flex items-center gap-3">
        <button 
          onClick={mode === 'parse' ? parse : build} 
          disabled={!input} 
          className="btn-primary"
        >
          {mode === 'parse' ? 'Parse' : 'Build'}
        </button>
        <button onClick={() => { setInput(''); setOutput(''); setError(''); }} className="btn-ghost">
          Clear
        </button>
      </div>
  );

  return (
    <ToolShell className="space-y-6" controls={controls}>
      <div className="flex gap-2 p-1 rounded-xl" style={{ backgroundColor: 'var(--bg-tertiary)' }}>
        <button
          onClick={() => handleModeChange('parse')}
          className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            mode === 'parse' ? 'tab-active' : ''
          }`}
          style={mode === 'parse' ? { backgroundColor: 'var(--bg-primary)' } : {}}
        >
          Parse Query String
        </button>
        <button
          onClick={() => handleModeChange('build')}
          className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            mode === 'build' ? 'tab-active' : ''
          }`}
          style={mode === 'build' ? { backgroundColor: 'var(--bg-primary)' } : {}}
        >
          Build Query String
        </button>
      </div>

      <CodeEditor
        value={input}
        onChange={setInput}
        language={mode === 'parse' ? 'text' : 'json'}
        label={mode === 'parse' ? 'Query String' : 'JSON Object'}
        placeholder={mode === 'parse' ? 'key1=value1&key2=value2' : '{"key1": "value1", "key2": "value2"}'}
      />

{/* Controls moved to header */}












      {error && <div className="alert-error">{error}</div>}
      {output && (
        <OutputPanel
          value={output}
          label={mode === 'parse' ? 'Parsed JSON' : 'Query String'}
          language={mode === 'parse' ? 'json' : 'text'}
          showLineNumbers={mode === 'parse'}
        />
      )}
    </ToolShell>
  );
}

