import { useState, useCallback } from 'react';
import CodeEditor from '@/components/common/CodeEditor';
import OutputPanel from '@/components/common/OutputPanel';
import * as yaml from 'js-yaml';

export default function YamlToJson() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');

  const convert = useCallback(() => {
    setError('');
    try {
      const parsed = yaml.load(input);
      setOutput(JSON.stringify(parsed, null, 2));
    } catch (e) {
      setError(`Invalid YAML: ${(e as Error).message}`);
      setOutput('');
    }
  }, [input]);

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
        <button onClick={convert} disabled={!input} className="btn-primary">
          Convert to JSON
        </button>
        <button onClick={() => { setInput(''); setOutput(''); setError(''); }} className="btn-ghost">
          Clear
        </button>
      </div>

      {error && <div className="alert-error">{error}</div>}
      {output && (
        <OutputPanel
          value={output}
          label="JSON Output"
          language="json"
          showLineNumbers
        />
      )}
    </div>
  );
}

