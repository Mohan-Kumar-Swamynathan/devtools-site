import { useState, useCallback } from 'react';
import CodeEditor from '@/components/common/CodeEditor';
import OutputPanel from '@/components/common/OutputPanel';
import * as yaml from 'js-yaml';
import ToolShell from './ToolShell';
import { useToast } from '@/hooks/useToast';

export default function JsonYamlConverter() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [mode, setMode] = useState<'json-to-yaml' | 'yaml-to-json'>('json-to-yaml');

  const convert = useCallback(() => {
    setError('');
    try {
      if (mode === 'json-to-yaml') {
        const parsed = JSON.parse(input);
        setOutput(yaml.dump(parsed, { indent: 2 }));
      } else {
        const parsed = yaml.load(input);
        setOutput(JSON.stringify(parsed, null, 2));
      }
    } catch (e) {
      setError(`Error: ${(e as Error).message}`);
      setOutput('');
    }
  }, [input, mode]);

  const handleModeChange = (newMode: 'json-to-yaml' | 'yaml-to-json') => {
    setMode(newMode);
    setInput('');
    setOutput('');
    setError('');
  };

  
  const controls = (
          <div className="flex items-center gap-3">
        <button onClick={convert} disabled={!input} className="btn-primary">
          Convert
        </button>
        <button onClick={() => { setInput(''); setOutput(''); setError(''); }} className="btn-ghost">
          Clear
        </button>
      </div>
  );

  return (
    <ToolShell className="space-y-6" controls={controls}>
      <div className="flex gap-2 p-1 rounded-xl" style={{ backgroundColor: 'var(--bg-tertiary)' }}>
        <button
          onClick={() => handleModeChange('json-to-yaml')}
          className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            mode === 'json-to-yaml' ? 'tab-active' : ''
          }`}
          style={mode === 'json-to-yaml' ? { backgroundColor: 'var(--bg-primary)' } : {}}
        >
          JSON → YAML
        </button>
        <button
          onClick={() => handleModeChange('yaml-to-json')}
          className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            mode === 'yaml-to-json' ? 'tab-active' : ''
          }`}
          style={mode === 'yaml-to-json' ? { backgroundColor: 'var(--bg-primary)' } : {}}
        >
          YAML → JSON
        </button>
      </div>

      <CodeEditor
        value={input}
        onChange={setInput}
        language={mode === 'json-to-yaml' ? 'json' : 'yaml'}
        label={mode === 'json-to-yaml' ? 'JSON Input' : 'YAML Input'}
        placeholder={mode === 'json-to-yaml' ? '{"key": "value"}' : 'key: value'}
      />

{/* Controls moved to header */}








      {error && <div className="alert-error">{error}</div>}
      {output && (
        <OutputPanel
          value={output}
          label={mode === 'json-to-yaml' ? 'YAML Output' : 'JSON Output'}
          language={mode === 'json-to-yaml' ? 'yaml' : 'json'}
          showLineNumbers
        />
      )}
    </ToolShell>
  );
}

