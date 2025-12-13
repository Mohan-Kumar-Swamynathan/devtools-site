import { useState, useCallback } from 'react';
import CodeEditor from '@/components/common/CodeEditor';
import OutputPanel from '@/components/common/OutputPanel';

export default function TomlFormatter() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');

  // Basic TOML formatting (simplified - full TOML parser would need a library)
  const format = useCallback(() => {
    setError('');
    try {
      // Basic formatting: add proper spacing around sections
      let formatted = input;
      
      // Add blank lines before sections
      formatted = formatted.replace(/(\[\[?[^\]]+\]\]?)/g, '\n$1\n');
      
      // Clean up multiple blank lines
      formatted = formatted.replace(/\n{3,}/g, '\n\n');
      
      // Trim and format
      formatted = formatted.trim();
      
      setOutput(formatted);
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
        language="toml"
        label="TOML Input"
        placeholder='[section]\nkey = "value"\nnumber = 123'
      />

      <div className="flex flex-wrap items-center gap-3">
        <button onClick={format} disabled={!input} className="btn-primary">
          Format TOML
        </button>
        <button onClick={() => { setInput(''); setOutput(''); setError(''); }} className="btn-ghost">
          Clear
        </button>
      </div>

      {error && <div className="alert-error">{error}</div>}
      {output && (
        <OutputPanel
          value={output}
          label="Formatted TOML"
          language="toml"
          showLineNumbers
        />
      )}
    </div>
  );
}

