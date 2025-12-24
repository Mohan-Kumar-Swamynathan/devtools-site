import { useState, useCallback } from 'react';
import CodeEditor from '@/components/common/CodeEditor';
import OutputPanel from '@/components/common/OutputPanel';
import ToolShell from './ToolShell';
import { useToast } from '@/hooks/useToast';

export default function EmailValidator() {
  const [input, setInput] = useState('');
  const [results, setResults] = useState<Array<{ email: string; valid: boolean; reason?: string }>>([]);

  const validateEmail = (email: string): { valid: boolean; reason?: string } => {
    const trimmed = email.trim();
    if (!trimmed) {
      return { valid: false, reason: 'Empty email' };
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmed)) {
      return { valid: false, reason: 'Invalid format' };
    }
    
    if (trimmed.length > 254) {
      return { valid: false, reason: 'Email too long (max 254 characters)' };
    }
    
    const [local, domain] = trimmed.split('@');
    if (local.length > 64) {
      return { valid: false, reason: 'Local part too long (max 64 characters)' };
    }
    
    return { valid: true };
  };

  const validate = useCallback(() => {
    const emails = input.split('\n').filter(e => e.trim());
    const results = emails.map(email => ({
      email: email.trim(),
      ...validateEmail(email)
    }));
    setResults(results);
  }, [input]);

  
  const controls = (
          <div className="flex items-center gap-3">
        <button onClick={validate} disabled={!input} className="btn-primary">
          Validate
        </button>
        <button onClick={() => { setInput(''); setResults([]); }} className="btn-ghost">
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
        label="Email Addresses (one per line)"
        placeholder="user@example.com\ninvalid-email\nanother@test.com"
      />

{/* Controls moved to header */}








      {results.length > 0 && (
        <div>
          <label className="label">Validation Results</label>
          <div className="space-y-2">
            {results.map((result, i) => (
              <div
                key={i}
                className={`p-3 rounded-lg border ${
                  result.valid ? 'alert-success' : 'alert-error'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono">{result.email}</span>
                  <span className="text-sm font-medium">
                    {result.valid ? '✓ Valid' : `✗ ${result.reason}`}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </ToolShell>
  );
}

