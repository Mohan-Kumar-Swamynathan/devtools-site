import { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

export default function UuidGenerator() {
  const [uuids, setUuids] = useState<string[]>([]);
  const [count, setCount] = useState(1);
  const [copied, setCopied] = useState(false);

  const generate = () => {
    const newUuids = Array.from({ length: count }, () => uuidv4());
    setUuids(newUuids);
  };

  const copyAll = async () => {
    const text = uuids.join('\n');
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const copyOne = async (uuid: string) => {
    await navigator.clipboard.writeText(uuid);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2">
          <label className="label-inline">Count:</label>
          <input
            type="number"
            min="1"
            max="100"
            value={count}
            onChange={(e) => setCount(Math.min(100, Math.max(1, parseInt(e.target.value) || 1)))}
            className="input-base w-24"
          />
        </div>
        <button onClick={generate} className="btn-primary">
          Generate
        </button>
        {uuids.length > 0 && (
          <button onClick={copyAll} className="btn-secondary">
            {copied ? <Check size={16} /> : <Copy size={16} />}
            Copy All
          </button>
        )}
      </div>

      {/* UUIDs */}
      {uuids.length > 0 && (
        <div className="space-y-2">
          {uuids.map((uuid, index) => (
            <div
              key={index}
              className="flex items-center gap-3 p-3 rounded-xl border"
              style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-primary)' }}
            >
              <code className="flex-1 font-mono text-sm" style={{ color: 'var(--text-primary)' }}>
                {uuid}
              </code>
              <button
                onClick={() => copyOne(uuid)}
                className="btn-icon p-2"
                title="Copy"
              >
                <Copy size={16} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}


