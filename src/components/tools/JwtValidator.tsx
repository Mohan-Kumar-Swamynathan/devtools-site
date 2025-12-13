import { useState, useCallback } from 'react';
import CodeEditor from '@/components/common/CodeEditor';
import OutputPanel from '@/components/common/OutputPanel';

export default function JwtValidator() {
  const [input, setInput] = useState('');
  const [result, setResult] = useState<{
    valid: boolean;
    header?: any;
    payload?: any;
    expired?: boolean;
    expiresAt?: string;
    details?: string;
  } | null>(null);
  const [error, setError] = useState('');

  const validate = useCallback(() => {
    setError('');
    try {
      const parts = input.trim().split('.');
      if (parts.length !== 3) {
        throw new Error('Invalid JWT format (must have 3 parts separated by dots)');
      }

      const [headerB64, payloadB64, signatureB64] = parts;

      // Decode header
      const headerJson = atob(headerB64.replace(/-/g, '+').replace(/_/g, '/'));
      const header = JSON.parse(headerJson);

      // Decode payload
      const payloadJson = atob(payloadB64.replace(/-/g, '+').replace(/_/g, '/'));
      const payload = JSON.parse(payloadJson);

      // Check expiration
      let expired = false;
      let expiresAt: string | undefined;
      if (payload.exp) {
        const expDate = new Date(payload.exp * 1000);
        expiresAt = expDate.toISOString();
        expired = expDate < new Date();
      }

      setResult({
        valid: true,
        header,
        payload,
        expired,
        expiresAt,
        details: expired ? 'Token is expired' : 'Token is valid'
      });
    } catch (e) {
      setError(`Invalid JWT: ${(e as Error).message}`);
      setResult(null);
    }
  }, [input]);

  return (
    <div className="space-y-6">
      <CodeEditor
        value={input}
        onChange={setInput}
        language="text"
        label="JWT Token"
        placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c"
      />

      <div className="flex flex-wrap items-center gap-3">
        <button onClick={validate} disabled={!input} className="btn-primary">
          Validate JWT
        </button>
        <button onClick={() => { setInput(''); setResult(null); setError(''); }} className="btn-ghost">
          Clear
        </button>
      </div>

      {error && <div className="alert-error">{error}</div>}
      {result && (
        <div className="space-y-4">
          <div className={`p-4 rounded-xl border ${result.expired ? 'alert-error' : 'alert-success'}`}>
            <div className="flex items-center justify-between">
              <span className="font-medium">
                {result.valid ? '✓ Valid JWT' : '✗ Invalid JWT'}
              </span>
              {result.expired && <span className="text-sm">Expired</span>}
            </div>
            {result.expiresAt && (
              <p className="text-sm mt-2" style={{ color: 'var(--text-muted)' }}>
                Expires: {result.expiresAt}
              </p>
            )}
          </div>

          {result.header && (
            <div>
              <label className="label">Header</label>
              <OutputPanel
                value={JSON.stringify(result.header, null, 2)}
                language="json"
                showLineNumbers
              />
            </div>
          )}

          {result.payload && (
            <div>
              <label className="label">Payload</label>
              <OutputPanel
                value={JSON.stringify(result.payload, null, 2)}
                language="json"
                showLineNumbers
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}

