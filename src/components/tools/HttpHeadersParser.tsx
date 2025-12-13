import { useState, useCallback } from 'react';
import CodeEditor from '@/components/common/CodeEditor';
import OutputPanel from '@/components/common/OutputPanel';

export default function HttpHeadersParser() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');

  const parse = useCallback(() => {
    setError('');
    try {
      const lines = input.trim().split('\n');
      const headers: Record<string, string> = {};
      
      lines.forEach(line => {
        const colonIndex = line.indexOf(':');
        if (colonIndex > 0) {
          const key = line.substring(0, colonIndex).trim();
          const value = line.substring(colonIndex + 1).trim();
          headers[key] = value;
        }
      });

      if (Object.keys(headers).length === 0) {
        throw new Error('No valid headers found');
      }

      setOutput(JSON.stringify(headers, null, 2));
    } catch (e) {
      setError(`Error: ${(e as Error).message}`);
      setOutput('');
    }
  }, [input]);

  return (
    <div className="space-y-6">
      <CodeEditor
        value={input}
        onChange={setInput}
        language="text"
        label="HTTP Headers (one per line)"
        placeholder="Content-Type: application/json
Authorization: Bearer token123
User-Agent: Mozilla/5.0"
      />

      <div className="flex flex-wrap items-center gap-3">
        <button onClick={parse} disabled={!input} className="btn-primary">
          Parse Headers
        </button>
        <button onClick={() => { setInput(''); setOutput(''); setError(''); }} className="btn-ghost">
          Clear
        </button>
      </div>

      {error && <div className="alert-error">{error}</div>}
      {output && (
        <OutputPanel
          value={output}
          label="Parsed Headers (JSON)"
          language="json"
          showLineNumbers
        />
      )}
    </div>
  );
}

