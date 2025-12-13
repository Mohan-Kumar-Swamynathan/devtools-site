import { useState, useCallback } from 'react';
import CodeEditor from '@/components/common/CodeEditor';
import OutputPanel from '@/components/common/OutputPanel';

export default function JsonlConverter() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState<'jsonl-to-json' | 'json-to-jsonl'>('jsonl-to-json');
  const [error, setError] = useState('');

  const jsonlToJson = useCallback(() => {
    setError('');
    try {
      const lines = input.trim().split('\n').filter(l => l.trim());
      const array = lines.map(line => {
        try {
          return JSON.parse(line);
        } catch (e) {
          throw new Error(`Invalid JSON line: ${line.substring(0, 50)}...`);
        }
      });
      setOutput(JSON.stringify(array, null, 2));
    } catch (e) {
      setError((e as Error).message);
      setOutput('');
    }
  }, [input]);

  const jsonToJsonl = useCallback(() => {
    setError('');
    try {
      const parsed = JSON.parse(input);
      if (!Array.isArray(parsed)) {
        throw new Error('JSON must be an array');
      }
      const jsonl = parsed.map(item => JSON.stringify(item)).join('\n');
      setOutput(jsonl);
    } catch (e) {
      setError((e as Error).message);
      setOutput('');
    }
  }, [input]);

  const handleModeChange = (newMode: 'jsonl-to-json' | 'json-to-jsonl') => {
    setMode(newMode);
    setInput('');
    setOutput('');
    setError('');
  };

  return (
    <div className="space-y-6">
      <div className="flex gap-2 p-1 rounded-xl" style={{ backgroundColor: 'var(--bg-tertiary)' }}>
        <button
          onClick={() => handleModeChange('jsonl-to-json')}
          className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            mode === 'jsonl-to-json' ? 'tab-active' : ''
          }`}
          style={mode === 'jsonl-to-json' ? { backgroundColor: 'var(--bg-primary)' } : {}}
        >
          JSONL → JSON
        </button>
        <button
          onClick={() => handleModeChange('json-to-jsonl')}
          className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            mode === 'json-to-jsonl' ? 'tab-active' : ''
          }`}
          style={mode === 'json-to-jsonl' ? { backgroundColor: 'var(--bg-primary)' } : {}}
        >
          JSON → JSONL
        </button>
      </div>

      <CodeEditor
        value={input}
        onChange={setInput}
        language={mode === 'jsonl-to-json' ? 'text' : 'json'}
        label={mode === 'jsonl-to-json' ? 'JSONL Input (one JSON object per line)' : 'JSON Array Input'}
        placeholder={mode === 'jsonl-to-json' ? '{"name": "John"}\n{"name": "Jane"}' : '[{"name": "John"}, {"name": "Jane"}]'}
      />

      <div className="flex flex-wrap items-center gap-3">
        <button 
          onClick={mode === 'jsonl-to-json' ? jsonlToJson : jsonToJsonl} 
          disabled={!input} 
          className="btn-primary"
        >
          Convert
        </button>
        <button onClick={() => { setInput(''); setOutput(''); setError(''); }} className="btn-ghost">
          Clear
        </button>
      </div>

      {error && <div className="alert-error">{error}</div>}
      {output && (
        <OutputPanel
          value={output}
          label={mode === 'jsonl-to-json' ? 'JSON Array Output' : 'JSONL Output'}
          language={mode === 'jsonl-to-json' ? 'json' : 'text'}
          showLineNumbers={mode === 'jsonl-to-json'}
        />
      )}
    </div>
  );
}

