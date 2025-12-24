import { useState, useCallback } from 'react';
import CodeEditor from '@/components/common/CodeEditor';
import OutputPanel from '@/components/common/OutputPanel';
import ToolShell from './ToolShell';
import { useToast } from '@/hooks/useToast';

export default function JwtGenerator() {
  const [header, setHeader] = useState('{"alg":"HS256","typ":"JWT"}');
  const [payload, setPayload] = useState('{"sub":"1234567890","name":"John Doe","iat":1516239022}');
  const [secret, setSecret] = useState('');
  const [token, setToken] = useState('');
  const [error, setError] = useState('');

  const generate = useCallback(async () => {
    setError('');
    try {
      const headerObj = JSON.parse(header);
      const payloadObj = JSON.parse(payload);
      
      // Base64 URL encode
      const base64UrlEncode = (str: string) => {
        return btoa(str)
          .replace(/\+/g, '-')
          .replace(/\//g, '_')
          .replace(/=/g, '');
      };
      
      const encodedHeader = base64UrlEncode(JSON.stringify(headerObj));
      const encodedPayload = base64UrlEncode(JSON.stringify(payloadObj));
      
      // For demo purposes, we'll create unsigned token
      // In production, you'd sign with HMAC or RSA
      const unsignedToken = `${encodedHeader}.${encodedPayload}`;
      
      if (secret) {
        // Note: This is a simplified version. Real JWT signing requires crypto libraries
        setToken(`${unsignedToken}.${base64UrlEncode(secret)}`);
      } else {
        setToken(`${unsignedToken}.`);
      }
    } catch (e) {
      setError(`Invalid JSON: ${(e as Error).message}`);
      setToken('');
    }
  }, [header, payload, secret]);

  
  const controls = (
          <div className="flex items-center gap-3">
        <button onClick={generate} className="btn-primary">
          Generate JWT
        </button>
        <button onClick={() => { setHeader('{"alg":"HS256","typ":"JWT"}'); setPayload('{"sub":"1234567890","name":"John Doe","iat":1516239022}'); setSecret(''); setToken(''); setError(''); }} className="btn-ghost">
          Reset
        </button>
      </div>
  );

  return (
    <ToolShell className="space-y-6" controls={controls}>
      <CodeEditor
        value={header}
        onChange={setHeader}
        language="json"
        label="Header (JSON)"
        placeholder='{"alg":"HS256","typ":"JWT"}'
      />

      <CodeEditor
        value={payload}
        onChange={setPayload}
        language="json"
        label="Payload (JSON)"
        placeholder='{"sub":"1234567890","name":"John Doe"}'
      />

      <div>
        <label className="label">Secret (optional)</label>
        <input
          type="text"
          value={secret}
          onChange={(e) => setSecret(e.target.value)}
          placeholder="Enter secret for signing"
          className="input-base font-mono"
        />
      </div>

{/* Controls moved to header */}








      {error && <div className="alert-error">{error}</div>}
      {token && (
        <OutputPanel
          value={token}
          label="Generated JWT Token"
          language="text"
        />
      )}
    </ToolShell>
  );
}

