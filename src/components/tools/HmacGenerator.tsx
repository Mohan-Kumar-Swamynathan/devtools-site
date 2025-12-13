import { useState, useCallback } from 'react';
import CodeEditor from '@/components/common/CodeEditor';
import OutputPanel from '@/components/common/OutputPanel';

export default function HmacGenerator() {
  const [message, setMessage] = useState('');
  const [secret, setSecret] = useState('');
  const [algorithm, setAlgorithm] = useState<'SHA-1' | 'SHA-256' | 'SHA-512'>('SHA-256');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');

  const generate = useCallback(async () => {
    setError('');
    if (!message || !secret) {
      setError('Please provide both message and secret');
      return;
    }

    try {
      const encoder = new TextEncoder();
      const keyData = encoder.encode(secret);
      const messageData = encoder.encode(message);

      const cryptoKey = await crypto.subtle.importKey(
        'raw',
        keyData,
        { name: 'HMAC', hash: algorithm },
        false,
        ['sign']
      );

      const signature = await crypto.subtle.sign('HMAC', cryptoKey, messageData);
      const hashArray = Array.from(new Uint8Array(signature));
      const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

      setOutput(hashHex);
    } catch (e) {
      setError(`Error: ${(e as Error).message}`);
      setOutput('');
    }
  }, [message, secret, algorithm]);

  return (
    <div className="space-y-6">
      <CodeEditor
        value={message}
        onChange={setMessage}
        language="text"
        label="Message"
        placeholder="Hello, World!"
      />

      <div>
        <label className="label">Secret Key</label>
        <input
          type="text"
          value={secret}
          onChange={(e) => setSecret(e.target.value)}
          placeholder="your-secret-key"
          className="input-base font-mono"
        />
      </div>

      <div>
        <label className="label">Algorithm</label>
        <select value={algorithm} onChange={(e) => setAlgorithm(e.target.value as any)} className="input-base">
          <option value="SHA-256">SHA-256</option>
          <option value="SHA-1">SHA-1</option>
          <option value="SHA-512">SHA-512</option>
        </select>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <button onClick={generate} disabled={!message || !secret} className="btn-primary">
          Generate HMAC
        </button>
        <button onClick={() => { setMessage(''); setSecret(''); setOutput(''); setError(''); }} className="btn-ghost">
          Clear
        </button>
      </div>

      {error && <div className="alert-error">{error}</div>}
      {output && (
        <OutputPanel
          value={output}
          label="HMAC Signature"
          language="text"
        />
      )}
    </div>
  );
}

