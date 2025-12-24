import { useState, useCallback } from 'react';
import CodeEditor from '@/components/common/CodeEditor';
import OutputPanel from '@/components/common/OutputPanel';
import ToolShell from './ToolShell';
import { useToast } from '@/hooks/useToast';

export default function CodeComplexityCalculator() {
  const [input, setInput] = useState('');
  const [result, setResult] = useState<{ complexity: number; details: string[] } | null>(null);

  const calculate = useCallback(() => {
    const lines = input.split('\n');
    let complexity = 1; // Base complexity
    const details: string[] = [];

    lines.forEach((line, i) => {
      const trimmed = line.trim();
      
      // Count decision points
      if (trimmed.match(/\b(if|else if|while|for|switch|case|catch|&&|\|\|)\b/)) {
        complexity++;
        details.push(`Line ${i + 1}: Decision point (${trimmed.substring(0, 30)}...)`);
      }
      
      // Count loops
      if (trimmed.match(/\b(for|while|do)\s*\(/)) {
        complexity++;
        details.push(`Line ${i + 1}: Loop (${trimmed.substring(0, 30)}...)`);
      }
    });

    setResult({ complexity, details });
  }, [input]);

  const getComplexityLevel = (complexity: number): string => {
    if (complexity <= 10) return 'Low';
    if (complexity <= 20) return 'Medium';
    if (complexity <= 50) return 'High';
    return 'Very High';
  };

  
  const controls = (
          <div className="flex items-center gap-3">
        <button onClick={calculate} disabled={!input} className="btn-primary">
          Calculate Complexity
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
        language="javascript"
        label="Code Input"
        placeholder="function example(x) {
  if (x > 0) {
    return x * 2;
  }
  return 0;
}"
      />

{/* Controls moved to header */}








      {result && (
        <div className="space-y-4">
          <div className={`p-4 rounded-xl border ${
            result.complexity <= 10 ? 'alert-success' : 
            result.complexity <= 20 ? 'alert-warning' : 
            'alert-error'
          }`}>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold">Cyclomatic Complexity: {result.complexity}</div>
                <div className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
                  Level: {getComplexityLevel(result.complexity)}
                </div>
              </div>
            </div>
          </div>
          {result.details.length > 0 && (
            <div>
              <label className="label">Complexity Points</label>
              <ul className="list-disc list-inside space-y-1 text-sm" style={{ color: 'var(--text-muted)' }}>
                {result.details.slice(0, 10).map((detail, i) => (
                  <li key={i}>{detail}</li>
                ))}
                {result.details.length > 10 && (
                  <li>... and {result.details.length - 10} more</li>
                )}
              </ul>
            </div>
          )}
        </div>
      )}
    </ToolShell>
  );
}

