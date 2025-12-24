import { useState, useCallback } from 'react';
import CodeEditor from '@/components/common/CodeEditor';
import OutputPanel from '@/components/common/OutputPanel';
import ToolShell from './ToolShell';
import { useToast } from '@/hooks/useToast';

export default function JsonLinter() {
  const [input, setInput] = useState('');
  const [errors, setErrors] = useState<Array<{ line: number; message: string }>>([]);
  const [formatted, setFormatted] = useState('');

  const lint = useCallback(() => {
    const newErrors: Array<{ line: number; message: string }> = [];
    
    try {
      const parsed = JSON.parse(input);
      setFormatted(JSON.stringify(parsed, null, 2));
      
      // Additional linting checks
      const lines = input.split('\n');
      lines.forEach((line, index) => {
        // Check for trailing commas
        if (line.trim().endsWith(',') && index === lines.length - 1) {
          newErrors.push({ line: index + 1, message: 'Trailing comma' });
        }
        // Check for duplicate keys (simplified)
        const keyMatch = line.match(/^\s*"([^"]+)":/);
        if (keyMatch) {
          const key = keyMatch[1];
          const occurrences = input.match(new RegExp(`"${key}":`, 'g'));
          if (occurrences && occurrences.length > 1) {
            newErrors.push({ line: index + 1, message: `Duplicate key: "${key}"` });
          }
        }
      });
      
      setErrors(newErrors);
    } catch (e) {
      const error = e as Error;
      const match = error.message.match(/position (\d+)/);
      if (match) {
        const pos = parseInt(match[1]);
        const lines = input.substring(0, pos).split('\n');
        newErrors.push({ line: lines.length, message: error.message });
      } else {
        newErrors.push({ line: 1, message: error.message });
      }
      setFormatted('');
      setErrors(newErrors);
    }
  }, [input]);

  
  const controls = (
          <div className="flex items-center gap-3">
        <button onClick={lint} disabled={!input} className="btn-primary">
          Lint JSON
        </button>
        <button onClick={() => { setInput(''); setErrors([]); setFormatted(''); }} className="btn-ghost">
          Clear
        </button>
      </div>
  );

  return (
    <ToolShell className="space-y-6" controls={controls}>
      <CodeEditor
        value={input}
        onChange={setInput}
        language="json"
        label="JSON to Lint"
        placeholder='{"key": "value"}'
      />

{/* Controls moved to header */}








      {errors.length > 0 && (
        <div>
          <label className="label">Errors ({errors.length})</label>
          <div className="space-y-2">
            {errors.map((error, i) => (
              <div key={i} className="p-3 rounded-lg border alert-error">
                <div className="text-sm font-medium">Line {error.line}</div>
                <div className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
                  {error.message}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {formatted && errors.length === 0 && (
        <div>
          <label className="label">Formatted JSON</label>
          <OutputPanel
            value={formatted}
            language="json"
            showLineNumbers
          />
        </div>
      )}
    </ToolShell>
  );
}

