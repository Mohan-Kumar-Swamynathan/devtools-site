import { useState, useCallback } from 'react';
import CodeEditor from '@/components/common/CodeEditor';
import OutputPanel from '@/components/common/OutputPanel';
import ToolShell from './ToolShell';
import { useToast } from '@/hooks/useToast';

export default function XmlValidator() {
  const [input, setInput] = useState('');
  const [result, setResult] = useState<{ valid: boolean; error?: string } | null>(null);

  const validate = useCallback(() => {
    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(input, 'text/xml');
      
      const parserError = doc.querySelector('parsererror');
      if (parserError) {
        setResult({
          valid: false,
          error: parserError.textContent || 'Invalid XML'
        });
      } else {
        setResult({ valid: true });
      }
    } catch (e) {
      setResult({
        valid: false,
        error: (e as Error).message
      });
    }
  }, [input]);

  
  const controls = (
          <div className="flex items-center gap-3">
        <button onClick={validate} disabled={!input} className="btn-primary">
          Validate XML
        </button>
        <button onClick={() => { setInput(''); setResult(null); }} className="btn-ghost">
          Clear
        </button>
      </div>
  );

  return (
    <ToolShell className="space-y-6" controls={controls}>
      <CodeEditor
        value={input}
        onChange={setInput}
        language="xml"
        label="XML Input"
        placeholder='<?xml version="1.0"?><root><item>value</item></root>'
      />

{/* Controls moved to header */}








      {result && (
        <div className={`p-4 rounded-xl border ${result.valid ? 'alert-success' : 'alert-error'}`}>
          <div className="font-medium">
            {result.valid ? '✓ Valid XML' : '✗ Invalid XML'}
          </div>
          {result.error && (
            <p className="text-sm mt-2" style={{ color: 'var(--text-muted)' }}>
              {result.error}
            </p>
          )}
        </div>
      )}
    </ToolShell>
  );
}

