import { useState, useCallback } from 'react';
import CodeEditor from '@/components/common/CodeEditor';
import OutputPanel from '@/components/common/OutputPanel';
import ToolShell from './ToolShell';
import { useToast } from '@/hooks/useToast';

export default function ErrorDecoder() {
  const [input, setInput] = useState('');
  const [decoded, setDecoded] = useState<any>(null);

  const decode = useCallback(() => {
    try {
      // Try to parse as JSON error
      const parsed = JSON.parse(input);
      setDecoded({
        type: 'JSON Error',
        message: parsed.message || parsed.error || 'Unknown error',
        stack: parsed.stack,
        code: parsed.code,
        details: parsed
      });
    } catch {
      // Try to extract error information from text
      const errorMatch = input.match(/(Error|Exception|TypeError|ReferenceError|SyntaxError)[:\s]+(.+)/i);
      const stackMatch = input.match(/at\s+(.+)/g);
      
      setDecoded({
        type: errorMatch ? errorMatch[1] : 'Unknown Error',
        message: errorMatch ? errorMatch[2] : input.split('\n')[0],
        stack: stackMatch || [],
        raw: input
      });
    }
  }, [input]);

  
  const controls = (
          <div className="flex items-center gap-3">
        <button onClick={decode} disabled={!input} className="btn-primary">
          Decode Error
        </button>
        <button onClick={() => { setInput(''); setDecoded(null); }} className="btn-ghost">
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
        label="Error Message/Stack Trace"
        placeholder="Error: Something went wrong
    at functionName (file.js:10:5)
    at anotherFunction (file.js:20:3)"
      />

{/* Controls moved to header */}








      {decoded && (
        <div className="space-y-4">
          <div className="p-4 rounded-xl border alert-error">
            <div className="font-medium mb-2">{decoded.type}</div>
            <div className="text-sm" style={{ color: 'var(--text-muted)' }}>
              {decoded.message}
            </div>
            {decoded.code && (
              <div className="text-xs mt-2 font-mono" style={{ color: 'var(--text-muted)' }}>
                Code: {decoded.code}
              </div>
            )}
          </div>
          {decoded.stack && decoded.stack.length > 0 && (
            <div>
              <label className="label">Stack Trace</label>
              <OutputPanel
                value={Array.isArray(decoded.stack) ? decoded.stack.join('\n') : decoded.stack}
                language="text"
                showLineNumbers
              />
            </div>
          )}
          {decoded.details && (
            <div>
              <label className="label">Full Details</label>
              <OutputPanel
                value={JSON.stringify(decoded.details, null, 2)}
                language="json"
                showLineNumbers
              />
            </div>
          )}
        </div>
      )}
    </ToolShell>
  );
}

