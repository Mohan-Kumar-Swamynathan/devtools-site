import { useState, useCallback } from 'react';
import CodeEditor from '@/components/common/CodeEditor';
import OutputPanel from '@/components/common/OutputPanel';

export default function UuidValidator() {
  const [input, setInput] = useState('');
  const [results, setResults] = useState<Array<{ uuid: string; valid: boolean; version?: string; details?: string }>>([]);

  const validateUUID = (uuid: string): { valid: boolean; version?: string } => {
    const trimmed = uuid.trim();
    
    // UUID v1-v5 pattern
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(trimmed)) {
      return { valid: false };
    }

    // Extract version (13th character)
    const versionChar = trimmed.charAt(14);
    const version = ['1', '2', '3', '4', '5'].includes(versionChar) ? `v${versionChar}` : 'unknown';

    return { valid: true, version };
  };

  const validate = useCallback(() => {
    const uuids = input.split('\n').filter(u => u.trim());
    const results = uuids.map(uuid => {
      const trimmed = uuid.trim();
      const validation = validateUUID(trimmed);
      
      if (validation.valid) {
        return {
          uuid: trimmed,
          valid: true,
          version: validation.version,
          details: `Valid UUID ${validation.version || ''}`
        };
      } else {
        return {
          uuid: trimmed,
          valid: false,
          details: 'Invalid UUID format'
        };
      }
    });
    setResults(results);
  }, [input]);

  return (
    <div className="space-y-6">
      <CodeEditor
        value={input}
        onChange={setInput}
        language="text"
        label="UUIDs to Validate (one per line)"
        placeholder="550e8400-e29b-41d4-a716-446655440000
invalid-uuid
123e4567-e89b-12d3-a456-426614174000"
      />

      <div className="flex flex-wrap items-center gap-3">
        <button onClick={validate} disabled={!input} className="btn-primary">
          Validate
        </button>
        <button onClick={() => { setInput(''); setResults([]); }} className="btn-ghost">
          Clear
        </button>
      </div>

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
                  <span className="font-mono text-sm">{result.uuid}</span>
                  <div className="text-right">
                    <span className="text-sm font-medium">
                      {result.valid ? '✓ Valid' : '✗ Invalid'}
                    </span>
                    {result.version && (
                      <span className="text-xs block" style={{ color: 'var(--text-muted)' }}>
                        {result.version}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

