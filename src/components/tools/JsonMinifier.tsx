import { useState, useCallback } from 'react';
import CodeEditor from '@/components/common/CodeEditor';
import OutputPanel from '@/components/common/OutputPanel';
import ToolShell from './ToolShell';
import { useToast } from '@/hooks/useToast';

export default function JsonMinifier() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');

  const minify = useCallback(() => {
    setError('');
    try {
      const parsed = JSON.parse(input);
      const minified = JSON.stringify(parsed);
      setOutput(minified);
    } catch (e) {
      setError(`Invalid JSON: ${(e as Error).message}`);
      setOutput('');
    }
  }, [input]);

  
  const controls = (
          <div className="flex items-center gap-3">
        <button onClick={minify} disabled={!input} className="btn-primary">
          Minify JSON
        </button>
        <button onClick={() => { setInput(''); setOutput(''); setError(''); }} className="btn-ghost">
          Clear
        </button>
      </div>
  );

  return (
    <ToolShell className="space-y-6" controls={controls}>
      <CodeEditor
        value={input}
        onChange={setInput}
        language="json"
        label="JSON Input"
        placeholder='{"key": "value", "nested": {"item": 123}}'
      />

{/* Controls moved to header */}








      {error && <div className="alert-error">{error}</div>}
      {output && (
        <OutputPanel
          value={output}
          label="Minified JSON"
          language="json"
        />
      )}
    </ToolShell>
  );
}

