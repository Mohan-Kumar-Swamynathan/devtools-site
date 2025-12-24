import { useState, useCallback } from 'react';
import CodeEditor from '@/components/common/CodeEditor';
import OutputPanel from '@/components/common/OutputPanel';
import { CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import ErrorMessage from '@/components/common/ErrorMessage';
import ToolShell from './ToolShell';
import { useToast } from '@/hooks/useToast';

interface ValidationIssue {
  line: number;
  type: 'error' | 'warning';
  message: string;
}

export default function EnvFileValidator() {
  const [input, setInput] = useState('');
  const [issues, setIssues] = useState<ValidationIssue[]>([]);
  const [isValid, setIsValid] = useState<boolean | null>(null);

  const validate = useCallback(() => {
    const lines = input.split('\n');
    const newIssues: ValidationIssue[] = [];
    const seenKeys = new Map<string, number>();

    lines.forEach((line, index) => {
      const lineNum = index + 1;
      const trimmed = line.trim();

      // Skip empty lines and comments
      if (!trimmed || trimmed.startsWith('#')) return;

      // Check for key=value format
      if (!trimmed.includes('=')) {
        newIssues.push({
          line: lineNum,
          type: 'error',
          message: 'Missing equals sign (=)'
        });
        return;
      }

      const [key, ...valueParts] = trimmed.split('=');
      const keyTrimmed = key.trim();
      const value = valueParts.join('=').trim();

      // Check for empty key
      if (!keyTrimmed) {
        newIssues.push({
          line: lineNum,
          type: 'error',
          message: 'Empty key name'
        });
        return;
      }

      // Check for invalid key characters
      if (!/^[A-Z_][A-Z0-9_]*$/i.test(keyTrimmed)) {
        newIssues.push({
          line: lineNum,
          type: 'warning',
          message: `Key "${keyTrimmed}" contains invalid characters. Use only letters, numbers, and underscores.`
        });
      }

      // Check for duplicate keys
      if (seenKeys.has(keyTrimmed)) {
        newIssues.push({
          line: lineNum,
          type: 'warning',
          message: `Duplicate key "${keyTrimmed}" (first seen at line ${seenKeys.get(keyTrimmed)})`
        });
      } else {
        seenKeys.set(keyTrimmed, lineNum);
      }

      // Check for unquoted values with spaces
      if (value && !value.startsWith('"') && !value.startsWith("'") && value.includes(' ')) {
        newIssues.push({
          line: lineNum,
          type: 'warning',
          message: `Value for "${keyTrimmed}" contains spaces. Consider quoting the value.`
        });
      }
    });

    setIssues(newIssues);
    setIsValid(newIssues.filter(i => i.type === 'error').length === 0);
  }, [input]);

  
  const controls = (
          <div className="flex items-center gap-3">
        <button onClick={validate} disabled={!input} className="btn-primary">
          Validate
        </button>
        <button onClick={() => { setInput(''); setIssues([]); setIsValid(null); }} className="btn-ghost">
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
        label=".env File Content"
        placeholder="API_KEY=your_api_key_here
DATABASE_URL=postgres://localhost:5432/mydb
DEBUG=true"
        rows={12}
      />

{/* Controls moved to header */}








      {/* Validation Results */}
      {isValid !== null && (
        <div className="space-y-4">
          <div
            className={`p-4 rounded-xl border flex items-center gap-3 ${
              isValid ? 'border-green-500' : 'border-red-500'
            }`}
            style={{
              backgroundColor: isValid ? 'var(--status-success-bg)' : 'var(--status-error-bg)'
            }}
          >
            {isValid ? (
              <>
                <CheckCircle size={24} style={{ color: 'var(--status-success)' }} />
                <div>
                  <p className="font-semibold" style={{ color: 'var(--status-success)' }}>
                    Valid .env file
                  </p>
                  <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
                    {issues.length === 0
                      ? 'No issues found'
                      : `${issues.filter(i => i.type === 'warning').length} warning(s) found`}
                  </p>
                </div>
              </>
            ) : (
              <>
                <XCircle size={24} style={{ color: 'var(--status-error)' }} />
                <div>
                  <p className="font-semibold" style={{ color: 'var(--status-error)' }}>
                    Invalid .env file
                  </p>
                  <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
                    {issues.filter(i => i.type === 'error').length} error(s) found
                  </p>
                </div>
              </>
            )}
          </div>

          {issues.length > 0 && (
            <div className="space-y-2">
              <label className="label">Issues</label>
              {issues.map((issue, index) => (
                <div
                  key={index}
                  className="p-3 rounded-lg border flex items-start gap-3"
                  style={{
                    backgroundColor: 'var(--bg-secondary)',
                    borderColor: issue.type === 'error' ? 'var(--status-error)' : 'var(--status-warning)'
                  }}
                >
                  {issue.type === 'error' ? (
                    <XCircle size={20} style={{ color: 'var(--status-error)' }} className="flex-shrink-0 mt-0.5" />
                  ) : (
                    <AlertTriangle size={20} style={{ color: 'var(--status-warning)' }} className="flex-shrink-0 mt-0.5" />
                  )}
                  <div className="flex-1">
                    <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                      Line {issue.line}: {issue.message}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </ToolShell>
  );
}








