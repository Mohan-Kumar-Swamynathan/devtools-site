import { useState, useCallback } from 'react';
import CodeEditor from '@/components/common/CodeEditor';
import OutputPanel from '@/components/common/OutputPanel';
import * as yaml from 'js-yaml';

export default function YamlFormatter() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [indent, setIndent] = useState(2);

  const format = useCallback(() => {
    setError('');
    try {
      const parsed = yaml.load(input);
      const formatted = yaml.dump(parsed, { indent, lineWidth: 80 });
      setOutput(formatted);
    } catch (e) {
      setError(`Invalid YAML: ${(e as Error).message}`);
      setOutput('');
    }
  }, [input, indent]);

  return (
    <div className="space-y-6">
      <CodeEditor
        value={input}
        onChange={setInput}
        language="yaml"
        label="YAML Input"
        placeholder="key: value\nnested:\n  item: test"
      />

      <div className="flex flex-wrap items-center gap-3">
        <button onClick={format} disabled={!input} className="btn-primary">
          Format
        </button>
        <button onClick={() => { setInput(''); setOutput(''); setError(''); }} className="btn-ghost">
          Clear
        </button>
        <div className="flex items-center gap-2 ml-auto">
          <label className="label-inline">Indent:</label>
          <select value={indent} onChange={(e) => setIndent(Number(e.target.value))} className="input-base w-auto py-2">
            <option value={2}>2 spaces</option>
            <option value={4}>4 spaces</option>
          </select>
        </div>
      </div>

      {error && <div className="alert-error">{error}</div>}
      {output && (
        <OutputPanel
          value={output}
          label="Formatted YAML"
          language="yaml"
          showLineNumbers
        />
      )}
    </div>
  );
}

