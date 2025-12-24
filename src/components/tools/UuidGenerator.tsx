import { useState } from 'react';
import { Copy, RefreshCw, Layers } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import ToolShell from './ToolShell';
import { useToast } from '@/hooks/useToast';

export default function UuidGenerator() {
  const [uuids, setUuids] = useState<string[]>([]);
  const [count, setCount] = useState(1);
  const { showToast } = useToast();

  const generate = () => {
    const newUuids = Array.from({ length: count }, () => uuidv4());
    setUuids(newUuids);
    showToast(`Generated ${count} UUID(s)`, 'success');
  };

  const copyAll = async () => {
    if (uuids.length === 0) return;
    const text = uuids.join('\n');
    await navigator.clipboard.writeText(text);
    showToast('All UUIDs copied to clipboard', 'success');
  };

  const copyOne = async (uuid: string) => {
    await navigator.clipboard.writeText(uuid);
    showToast('UUID copied to clipboard', 'success');
  };

  const handleClear = () => {
    setUuids([]);
    setCount(1);
  };

  const controls = (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-2">
        <label className="text-sm font-medium text-[var(--text-secondary)]">Count:</label>
        <input
          type="number"
          min="1"
          max="100"
          value={count}
          onChange={(e) => setCount(Math.min(100, Math.max(1, parseInt(e.target.value) || 1)))}
          className="input-sm w-20 border-[var(--border-primary)] bg-[var(--bg-tertiary)] rounded-lg py-1 px-2 text-sm focus:ring-2 focus:ring-[var(--brand-primary)] outline-none transition-all"
        />
      </div>
      <button
        onClick={generate}
        className="btn-primary btn-sm px-4 py-1.5 flex items-center gap-2"
      >
        <RefreshCw size={16} />
        Generate
      </button>
      {uuids.length > 0 && (
        <button
          onClick={copyAll}
          className="btn-secondary btn-sm px-4 py-1.5 flex items-center gap-2"
        >
          <Layers size={16} />
          Copy All
        </button>
      )}
    </div>
  );

  return (
    <ToolShell
      controls={controls}
      onClear={handleClear}
    >
      <div className="space-y-6">
        {uuids.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center text-[var(--text-secondary)] border-2 border-dashed border-[var(--border-primary)] rounded-xl">
            <RefreshCw size={48} className="mb-4 opacity-50" />
            <p>Click Generate to create UUIDs</p>
          </div>
        ) : (
          <div className="space-y-2 animate-slide-up">
            {uuids.map((uuid, index) => (
              <div
                key={index}
                className="flex items-center gap-3 p-3 rounded-xl border group hover:border-[var(--brand-primary)] transition-colors"
                style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-primary)' }}
              >
                <code className="flex-1 font-mono text-sm text-[var(--text-primary)] select-all">
                  {uuid}
                </code>
                <button
                  onClick={() => copyOne(uuid)}
                  className="p-2 rounded-lg hover:bg-[var(--bg-tertiary)] text-[var(--text-secondary)] hover:text-[var(--brand-primary)] transition-colors opacity-0 group-hover:opacity-100"
                  title="Copy"
                >
                  <Copy size={16} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </ToolShell>
  );
}


