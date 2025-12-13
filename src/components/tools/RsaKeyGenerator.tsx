import { useState, useCallback } from 'react';
import OutputPanel from '@/components/common/OutputPanel';

export default function RsaKeyGenerator() {
  const [keySize, setKeySize] = useState(2048);
  const [publicKey, setPublicKey] = useState('');
  const [privateKey, setPrivateKey] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const generate = useCallback(async () => {
    setLoading(true);
    setError('');
    setPublicKey('');
    setPrivateKey('');

    try {
      const keyPair = await crypto.subtle.generateKey(
        {
          name: 'RSA-OAEP',
          modulusLength: keySize,
          publicExponent: new Uint8Array([1, 0, 1]),
          hash: 'SHA-256'
        },
        true,
        ['encrypt', 'decrypt']
      );

      const publicKeyJwk = await crypto.subtle.exportKey('jwk', keyPair.publicKey);
      const privateKeyJwk = await crypto.subtle.exportKey('jwk', keyPair.privateKey);

      setPublicKey(JSON.stringify(publicKeyJwk, null, 2));
      setPrivateKey(JSON.stringify(privateKeyJwk, null, 2));
    } catch (e) {
      setError(`Error: ${(e as Error).message}`);
    } finally {
      setLoading(false);
    }
  }, [keySize]);

  return (
    <div className="space-y-6">
      <div className="p-4 rounded-xl border" style={{ backgroundColor: 'var(--bg-tertiary)', borderColor: 'var(--border-primary)' }}>
        <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
          <strong>Note:</strong> Keys are generated in JWK format. Keep private keys secure and never share them.
        </p>
      </div>

      <div>
        <label className="label">Key Size (bits)</label>
        <select value={keySize} onChange={(e) => setKeySize(parseInt(e.target.value))} className="input-base">
          <option value="1024">1024 bits (not recommended)</option>
          <option value="2048">2048 bits (recommended)</option>
          <option value="4096">4096 bits (high security)</option>
        </select>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <button onClick={generate} disabled={loading} className="btn-primary">
          {loading ? 'Generating...' : 'Generate RSA Keys'}
        </button>
        <button onClick={() => { setPublicKey(''); setPrivateKey(''); setError(''); }} className="btn-ghost">
          Clear
        </button>
      </div>

      {error && <div className="alert-error">{error}</div>}
      {publicKey && (
        <div className="space-y-4">
          <div>
            <label className="label">Public Key (JWK)</label>
            <OutputPanel
              value={publicKey}
              language="json"
              showLineNumbers
            />
          </div>
          <div>
            <label className="label">Private Key (JWK) - Keep Secure!</label>
            <OutputPanel
              value={privateKey}
              language="json"
              showLineNumbers
            />
          </div>
        </div>
      )}
    </div>
  );
}

