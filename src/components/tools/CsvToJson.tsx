import { useState, useCallback } from 'react';
import CodeEditor from '@/components/common/CodeEditor';
import OutputPanel from '@/components/common/OutputPanel';
import ToolShell from './ToolShell';
import { useToast } from '@/hooks/useToast';

export default function CsvToJson() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');

  const convert = useCallback(() => {
    setError('');
    try {
      const lines = input.trim().split('\n');
      if (lines.length < 2) throw new Error('CSV must have at least a header and one data row');

      const headers = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, ''));
      const rows = [];

      for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(',').map(v => v.trim().replace(/^"|"$/g, '').replace(/""/g, '"'));
        const row: Record<string, string> = {};
        headers.forEach((header, idx) => {
          row[header] = values[idx] || '';
        });
        rows.push(row);
      }

      setOutput(JSON.stringify(rows, null, 2));
    } catch (e) {
      setError(`Invalid CSV: ${(e as Error).message}`);
      setOutput('');
    }
  }, [input]);

  
  const controls = (
          <div className="flex items-center gap-3">
        <button onClick={convert} disabled={!input} className="btn-primary">
          Convert to JSON
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
        language="text"
        label="CSV Input"
        placeholder="name,age,city\nJohn,30,NYC\nJane,25,LA"
      />

{/* Controls moved to header */}








      {error && <div className="alert-error">{error}</div>}
      {output && (
        <OutputPanel
          value={output}
          label="JSON Output"
          language="json"
          showLineNumbers
        />
      )}
    </ToolShell>
  );
}

