import { useState, useCallback } from 'react';
import CodeEditor from '@/components/common/CodeEditor';
import OutputPanel from '@/components/common/OutputPanel';
import * as yaml from 'js-yaml';
import ToolShell from './ToolShell';
import { useToast } from '@/hooks/useToast';

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
        language="yaml"
        label="YAML Input"
        placeholder="key: value\nnested:\n  item: test"
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

