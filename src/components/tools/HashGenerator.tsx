import { useState, useCallback } from 'react';
import CodeEditor from '@/components/common/CodeEditor';
import OutputPanel from '@/components/common/OutputPanel';

export default function HashGenerator() {
  const [input, setInput] = useState('');
  const [hashes, setHashes] = useState<Record<string, string>>({});
  const [algorithm, setAlgorithm] = useState<'md5' | 'sha1' | 'sha256' | 'sha512'>('sha256');

  const generate = useCallback(async () => {
    if (!input) return;

    try {
      const encoder = new TextEncoder();
      const data = encoder.encode(input);
      const hashBuffer = await crypto.subtle.digest(algorithm.toUpperCase(), data);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
      
      setHashes({ ...hashes, [algorithm]: hashHex });
    } catch (e) {
      // Fallback: Use Web Crypto API with proper algorithm names
      const encoder = new TextEncoder();
      const data = encoder.encode(input);
      
      let algo: string;
      switch (algorithm) {
        case 'md5':
          // MD5 not available in Web Crypto, show error
          setHashes({ ...hashes, [algorithm]: 'MD5 not supported in browser (use SHA-256 instead)' });
          return;
        case 'sha1':
          algo = 'SHA-1';
          break;
        case 'sha256':
          algo = 'SHA-256';
          break;
        case 'sha512':
          algo = 'SHA-512';
          break;
        default:
          algo = 'SHA-256';
      }
      
      try {
        const hashBuffer = await crypto.subtle.digest(algo, data);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
        setHashes({ ...hashes, [algorithm]: hashHex });
      } catch (err) {
        setHashes({ ...hashes, [algorithm]: `Error: ${(err as Error).message}` });
      }
    }
  }, [input, algorithm, hashes]);

  const generateAll = useCallback(async () => {
    const newHashes: Record<string, string> = {};
    const encoder = new TextEncoder();
    const data = encoder.encode(input);

    // SHA-1
    try {
      const sha1 = await crypto.subtle.digest('SHA-1', data);
      const sha1Array = Array.from(new Uint8Array(sha1));
      newHashes.sha1 = sha1Array.map(b => b.toString(16).padStart(2, '0')).join('');
    } catch {}

    // SHA-256
    try {
      const sha256 = await crypto.subtle.digest('SHA-256', data);
      const sha256Array = Array.from(new Uint8Array(sha256));
      newHashes.sha256 = sha256Array.map(b => b.toString(16).padStart(2, '0')).join('');
    } catch {}

    // SHA-512
    try {
      const sha512 = await crypto.subtle.digest('SHA-512', data);
      const sha512Array = Array.from(new Uint8Array(sha512));
      newHashes.sha512 = sha512Array.map(b => b.toString(16).padStart(2, '0')).join('');
    } catch {}

    newHashes.md5 = 'MD5 not supported in browser (use SHA-256 instead)';
    setHashes(newHashes);
  }, [input]);

  return (
    <div className="space-y-6">
      <CodeEditor
        value={input}
        onChange={setInput}
        language="text"
        label="Text to Hash"
        placeholder="Enter text to generate hash"
      />

      <div className="flex flex-wrap items-center gap-3">
        <select value={algorithm} onChange={(e) => setAlgorithm(e.target.value as any)} className="input-base">
          <option value="sha256">SHA-256</option>
          <option value="sha1">SHA-1</option>
          <option value="sha512">SHA-512</option>
          <option value="md5">MD5 (not supported)</option>
        </select>
        <button onClick={generate} disabled={!input} className="btn-primary">
          Generate {algorithm.toUpperCase()}
        </button>
        <button onClick={generateAll} disabled={!input} className="btn-secondary">
          Generate All
        </button>
        <button onClick={() => { setInput(''); setHashes({}); }} className="btn-ghost">
          Clear
        </button>
      </div>

      {Object.keys(hashes).length > 0 && (
        <div className="space-y-3">
          {Object.entries(hashes).map(([algo, hash]) => (
            <div key={algo}>
              <label className="label">{algo.toUpperCase()}</label>
              <OutputPanel value={hash} language="text" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

