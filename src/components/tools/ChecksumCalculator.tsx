import { useState, useCallback } from 'react';
import CodeEditor from '@/components/common/CodeEditor';
import OutputPanel from '@/components/common/OutputPanel';
import ToolShell from './ToolShell';
import { useToast } from '@/hooks/useToast';

export default function ChecksumCalculator() {
  const [input, setInput] = useState('');
  const [hashes, setHashes] = useState<Record<string, string>>({});
  const [algorithm, setAlgorithm] = useState<'SHA-1' | 'SHA-256' | 'SHA-512'>('SHA-256');

  const calculate = useCallback(async () => {
    if (!input) return;

    try {
      const encoder = new TextEncoder();
      const data = encoder.encode(input);
      const hashBuffer = await crypto.subtle.digest(algorithm, data);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
      
      setHashes({ ...hashes, [algorithm]: hashHex });
    } catch (e) {
      setHashes({ ...hashes, [algorithm]: `Error: ${(e as Error).message}` });
    }
  }, [input, algorithm, hashes]);

  const calculateAll = useCallback(async () => {
    const newHashes: Record<string, string> = {};
    const encoder = new TextEncoder();
    const data = encoder.encode(input);

    for (const algo of ['SHA-1', 'SHA-256', 'SHA-512'] as const) {
      try {
        const hashBuffer = await crypto.subtle.digest(algo, data);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        newHashes[algo] = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
      } catch {}
    }

    setHashes(newHashes);
  }, [input]);

  
  const controls = (
          <div className="flex items-center gap-3">
        <select value={algorithm} onChange={(e) => setAlgorithm(e.target.value as any)} className="input-base">
          <option value="SHA-256">SHA-256</option>
          <option value="SHA-1">SHA-1</option>
          <option value="SHA-512">SHA-512</option>
        </select>
        <button onClick={calculate} disabled={!input} className="btn-primary">
          Calculate {algorithm}
        </button>
        <button onClick={calculateAll} disabled={!input} className="btn-secondary">
          Calculate All
        </button>
        <button onClick={() => { setInput(''); setHashes({}); }} className="btn-ghost">
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
        label="Text to Calculate Checksum"
        placeholder="Enter text to calculate checksum"
      />

{/* Controls moved to header */}
















      {Object.keys(hashes).length > 0 && (
        <div className="space-y-3">
          {Object.entries(hashes).map(([algo, hash]) => (
            <div key={algo}>
              <label className="label">{algo}</label>
              <OutputPanel value={hash} language="text" />
            </div>
          ))}
        </div>
      )}
    </ToolShell>
  );
}

