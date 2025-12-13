import { useState, useCallback } from 'react';
import CodeEditor from '@/components/common/CodeEditor';
import OutputPanel from '@/components/common/OutputPanel';
import * as yaml from 'js-yaml';

export default function YamlValidator() {
  const [input, setInput] = useState('');
  const [result, setResult] = useState<{ valid: boolean; error?: string } | null>(null);

  const validate = useCallback(() => {
    try {
      yaml.load(input);
      setResult({ valid: true });
    } catch (e) {
      setResult({
        valid: false,
        error: (e as Error).message
      });
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
        <button onClick={validate} disabled={!input} className="btn-primary">
          Validate YAML
        </button>
        <button onClick={() => { setInput(''); setResult(null); }} className="btn-ghost">
          Clear
        </button>
      </div>

      {result && (
        <div className={`p-4 rounded-xl border ${result.valid ? 'alert-success' : 'alert-error'}`}>
          <div className="font-medium">
            {result.valid ? '✓ Valid YAML' : '✗ Invalid YAML'}
          </div>
          {result.error && (
            <p className="text-sm mt-2" style={{ color: 'var(--text-muted)' }}>
              {result.error}
            </p>
          )}
        </div>
      )}
    </div>
  );
}

