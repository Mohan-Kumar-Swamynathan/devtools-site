import { useState, useCallback } from 'react';
import CodeEditor from '@/components/common/CodeEditor';
import OutputPanel from '@/components/common/OutputPanel';
import ToolShell from './ToolShell';
import { useToast } from '@/hooks/useToast';

export default function CsvValidator() {
  const [input, setInput] = useState('');
  const [result, setResult] = useState<{ valid: boolean; errors: string[]; stats?: any } | null>(null);

  const validate = useCallback(() => {
    const errors: string[] = [];
    const lines = input.trim().split('\n');
    
    if (lines.length === 0) {
      setResult({ valid: false, errors: ['CSV is empty'] });
      return;
    }

    const headerLine = lines[0];
    const headers = headerLine.split(',').map(h => h.trim());
    
    if (headers.length === 0) {
      errors.push('No headers found');
    }

    // Check for duplicate headers
    const headerSet = new Set(headers);
    if (headerSet.size !== headers.length) {
      errors.push('Duplicate headers found');
    }

    // Check each data row
    let maxCols = headers.length;
    let minCols = headers.length;
    
    for (let i = 1; i < lines.length; i++) {
      const cols = lines[i].split(',').length;
      if (cols !== headers.length) {
        errors.push(`Row ${i + 1}: Expected ${headers.length} columns, found ${cols}`);
      }
      maxCols = Math.max(maxCols, cols);
      minCols = Math.min(minCols, cols);
    }

    const stats = {
      rows: lines.length - 1,
      columns: headers.length,
      headers: headers
    };

    setResult({
      valid: errors.length === 0,
      errors,
      stats
    });
  }, [input]);

  
  const controls = (
          <div className="flex items-center gap-3">
        <button onClick={validate} disabled={!input} className="btn-primary">
          Validate CSV
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
        language="text"
        label="CSV Input"
        placeholder="name,age,city
John,30,NYC
Jane,25,LA"
      />

{/* Controls moved to header */}








      {result && (
        <div className="space-y-4">
          <div className={`p-4 rounded-xl border ${result.valid ? 'alert-success' : 'alert-error'}`}>
            <div className="font-medium mb-2">
              {result.valid ? '✓ Valid CSV' : '✗ Invalid CSV'}
            </div>
            {result.stats && (
              <div className="text-sm space-y-1" style={{ color: 'var(--text-muted)' }}>
                <div>Rows: {result.stats.rows}</div>
                <div>Columns: {result.stats.columns}</div>
              </div>
            )}
          </div>
          {result.errors.length > 0 && (
            <div>
              <label className="label">Errors</label>
              <ul className="list-disc list-inside space-y-1 text-sm" style={{ color: 'var(--text-muted)' }}>
                {result.errors.map((error, i) => (
                  <li key={i}>{error}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </ToolShell>
  );
}

