import { useState, useCallback } from 'react';
import CodeEditor from '@/components/common/CodeEditor';
import OutputPanel from '@/components/common/OutputPanel';

export default function JsonFormatter() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [indent, setIndent] = useState(2);

  const format = useCallback(() => {
    setError('');
    try {
      const parsed = JSON.parse(input);
      setOutput(JSON.stringify(parsed, null, indent));
    } catch (e) {
      setError(`Invalid JSON: ${(e as Error).message}`);
      setOutput('');
    }
  }, [input, indent]);

  const minify = useCallback(() => {
    setError('');
    try {
      const parsed = JSON.parse(input);
      setOutput(JSON.stringify(parsed));
    } catch (e) {
      setError(`Invalid JSON: ${(e as Error).message}`);
      setOutput('');
    }
  }, [input]);

  const clear = () => {
    setInput('');
    setOutput('');
    setError('');
  };

  return (
    <div className="space-y-6">
      <CodeEditor
        value={input}
        onChange={setInput}
        language="json"
        label="JSON Input"
        placeholder='{"name": "John", "age": 30}'
      />

      {/* Actions */}
      <div className="flex flex-wrap items-center gap-3">
        <button onClick={format} disabled={!input} className="btn-primary">
          Format
        </button>
        <button onClick={minify} disabled={!input} className="btn-secondary">
          Minify
        </button>
        <button onClick={clear} className="btn-ghost">
          Clear
        </button>
        
        <div className="flex items-center gap-2 ml-auto">
          <label className="label-inline">Indent:</label>
          <select 
            value={indent} 
            onChange={(e) => setIndent(Number(e.target.value))}
            className="input-base w-auto py-2"
          >
            <option value={2}>2 spaces</option>
            <option value={4}>4 spaces</option>
            <option value={1}>1 space</option>
          </select>
        </div>
      </div>

      {/* Error */}
      {error && <div className="alert-error">{error}</div>}

      {/* Output */}
      {output && (
        <OutputPanel 
          value={output} 
          label="Formatted JSON" 
          language="json"
          showLineNumbers 
        />
      )}
    </div>
  );
}


