import { useState, useCallback } from 'react';
import CodeEditor from '@/components/common/CodeEditor';
import OutputPanel from '@/components/common/OutputPanel';
import CollapsibleSection from '@/components/common/CollapsibleSection';
import ToolShell from './ToolShell';
import { useToast } from '@/hooks/useToast';

export default function ApiResponseFormatter() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [format, setFormat] = useState<'json' | 'xml'>('json');
  const [error, setError] = useState('');

  const formatResponse = useCallback(() => {
    setError('');
    try {
      if (format === 'json') {
        const parsed = JSON.parse(input);
        setOutput(JSON.stringify(parsed, null, 2));
      } else {
        const parser = new DOMParser();
        const doc = parser.parseFromString(input, 'text/xml');
        if (doc.querySelector('parsererror')) {
          throw new Error('Invalid XML');
        }
        // Basic XML formatting
        const serializer = new XMLSerializer();
        setOutput(serializer.serializeToString(doc));
      }
    } catch (e) {
      setError(`Error: ${(e as Error).message}`);
      setOutput('');
    }
  }, [input, format]);

  const controls = null;

  return (
    <ToolShell className="space-y-6" controls={controls}>
      <div>
        <label className="label">Response Format</label>
        <select value={format} onChange={(e) => { setFormat(e.target.value as any); formatResponse(); }} className="input-base">
          <option value="json">JSON</option>
          <option value="xml">XML</option>
        </select>
      </div>

      <CollapsibleSection
        title="Input"
        persistKey="api-response-formatter-input-expanded"
        defaultExpanded={true}
      >
        <CodeEditor
          value={input}
          onChange={(v) => { setInput(v); formatResponse(); }}
          language={format}
          label="API Response"
          placeholder={format === 'json' ? '{"status":"success","data":{}}' : '<?xml version="1.0"?><response><status>success</status></response>'}
        />
      </CollapsibleSection>

      {error && <div className="alert-error">{error}</div>}
      {output && (
        <CollapsibleSection
          title="Output"
          persistKey="api-response-formatter-output-expanded"
          defaultExpanded={true}
        >
          <OutputPanel
            value={output}
            label="Formatted Response"
            language={format}
            showLineNumbers
          />
        </CollapsibleSection>
      )}
    </ToolShell>
  );
}

