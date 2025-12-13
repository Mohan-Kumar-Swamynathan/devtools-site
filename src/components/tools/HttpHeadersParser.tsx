import { useState, useCallback } from 'react';
import { Copy, RotateCcw } from 'lucide-react';
import { useToast } from '@/hooks/useToast';

export default function HttpHeadersParser() {
  const [headers, setHeaders] = useState('');
  const [parsed, setParsed] = useState<Record<string, string>>({});
  const { showToast } = useToast();

  const parseHeaders = useCallback(() => {
    if (!headers.trim()) {
      showToast('Please enter headers', 'error');
      return;
    }

    const lines = headers.split('\n');
    const parsedHeaders: Record<string, string> = {};

    lines.forEach(line => {
      const colonIndex = line.indexOf(':');
      if (colonIndex > 0) {
        const key = line.substring(0, colonIndex).trim();
        const value = line.substring(colonIndex + 1).trim();
        parsedHeaders[key] = value;
      }
    });

    setParsed(parsedHeaders);
  }, [headers, showToast]);

  const handleCopy = useCallback(() => {
    const json = JSON.stringify(parsed, null, 2);
    navigator.clipboard.writeText(json).then(() => {
      showToast('Copied to clipboard!', 'success');
    });
  }, [parsed, showToast]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-3">
        <button
          onClick={parseHeaders}
          className="btn-primary"
        >
          Parse Headers
        </button>
        {Object.keys(parsed).length > 0 && (
          <button
            onClick={handleCopy}
            className="btn-secondary flex items-center gap-2"
          >
            <Copy size={18} />
            Copy JSON
          </button>
        )}
        <button
          onClick={() => {
            setHeaders('');
            setParsed({});
          }}
          className="btn-ghost flex items-center gap-2"
        >
          <RotateCcw size={18} />
          Clear
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
            Headers Input
          </h3>
          <textarea
            value={headers}
            onChange={(e) => setHeaders(e.target.value)}
            className="input w-full h-64 font-mono text-sm"
            placeholder="Content-Type: application/json&#10;Authorization: Bearer token&#10;User-Agent: Mozilla/5.0..."
          />
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
            Parsed Headers ({Object.keys(parsed).length})
          </h3>
          <div className="p-4 rounded-xl border space-y-2 max-h-64 overflow-auto" style={{
            backgroundColor: 'var(--bg-secondary)',
            borderColor: 'var(--border-primary)'
          }}>
            {Object.keys(parsed).length > 0 ? (
              Object.entries(parsed).map(([key, value]) => (
                <div key={key} className="pb-2 border-b" style={{ borderColor: 'var(--border-primary)' }}>
                  <div className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>
                    {key}
                  </div>
                  <div className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
                    {value}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-sm" style={{ color: 'var(--text-muted)' }}>
                Parsed headers will appear here
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
