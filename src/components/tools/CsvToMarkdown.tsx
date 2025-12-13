import { useState, useCallback } from 'react';
import CodeEditor from '@/components/common/CodeEditor';
import OutputPanel from '@/components/common/OutputPanel';

export default function CsvToMarkdown() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');

  const convert = useCallback(() => {
    setError('');
    try {
      const lines = input.trim().split('\n');
      if (lines.length === 0) {
        throw new Error('CSV is empty');
      }

      const markdownLines: string[] = [];
      
      // Header row
      const headers = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, ''));
      markdownLines.push('| ' + headers.join(' | ') + ' |');
      markdownLines.push('| ' + headers.map(() => '---').join(' | ') + ' |');
      
      // Data rows
      for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(',').map(v => v.trim().replace(/^"|"$/g, '').replace(/""/g, '"'));
        markdownLines.push('| ' + values.join(' | ') + ' |');
      }
      
      setOutput(markdownLines.join('\n'));
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
        label="CSV Input"
        placeholder="name,age,city\nJohn,30,NYC\nJane,25,LA"
      />

      <div className="flex flex-wrap items-center gap-3">
        <button onClick={convert} disabled={!input} className="btn-primary">
          Convert to Markdown
        </button>
        <button onClick={() => { setInput(''); setOutput(''); setError(''); }} className="btn-ghost">
          Clear
        </button>
      </div>

      {error && <div className="alert-error">{error}</div>}
      {output && (
        <OutputPanel
          value={output}
          label="Markdown Table"
          language="markdown"
        />
      )}
    </div>
  );
}

