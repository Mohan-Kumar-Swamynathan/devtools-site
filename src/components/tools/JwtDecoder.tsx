import { useState, useCallback } from 'react';
import CodeEditor from '@/components/common/CodeEditor';
import OutputPanel from '@/components/common/OutputPanel';

export default function JwtDecoder() {
  const [token, setToken] = useState('');
  const [header, setHeader] = useState('');
  const [payload, setPayload] = useState('');
  const [error, setError] = useState('');

  const decode = useCallback(() => {
    setError('');
    setHeader('');
    setPayload('');
    
    try {
      const parts = token.trim().split('.');
      if (parts.length !== 3) {
        throw new Error('Invalid JWT format. Expected 3 parts separated by dots.');
      }

      const [headerPart, payloadPart] = parts;
      
      // Decode header
      try {
        const decodedHeader = JSON.parse(atob(headerPart.replace(/-/g, '+').replace(/_/g, '/')));
        setHeader(JSON.stringify(decodedHeader, null, 2));
      } catch (e) {
        throw new Error('Invalid header encoding');
      }

      // Decode payload
      try {
        const decodedPayload = JSON.parse(atob(payloadPart.replace(/-/g, '+').replace(/_/g, '/')));
        
        // Check expiration
        if (decodedPayload.exp) {
          const expDate = new Date(decodedPayload.exp * 1000);
          const now = new Date();
          decodedPayload._expiration = expDate.toISOString();
          decodedPayload._expired = now > expDate;
        }
        
        setPayload(JSON.stringify(decodedPayload, null, 2));
      } catch (e) {
        throw new Error('Invalid payload encoding');
      }
    } catch (e) {
      setError((e as Error).message);
    }
  }, [token]);

  return (
    <div className="space-y-6">
      <CodeEditor
        value={token}
        onChange={setToken}
        language="text"
        label="JWT Token"
        placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
      />

      {/* Actions */}
      <div className="flex flex-wrap items-center gap-3">
        <button onClick={decode} disabled={!token} className="btn-primary">
          Decode
        </button>
        <button onClick={() => { setToken(''); setHeader(''); setPayload(''); setError(''); }} className="btn-ghost">
          Clear
        </button>
      </div>

      {/* Error */}
      {error && <div className="alert-error">{error}</div>}

      {/* Header */}
      {header && (
        <OutputPanel 
          value={header} 
          label="Header" 
          language="json"
          showLineNumbers 
        />
      )}

      {/* Payload */}
      {payload && (
        <OutputPanel 
          value={payload} 
          label="Payload" 
          language="json"
          showLineNumbers 
        />
      )}
    </div>
  );
}


