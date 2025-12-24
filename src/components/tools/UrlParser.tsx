import { useState, useCallback } from 'react';
import CodeEditor from '@/components/common/CodeEditor';
import OutputPanel from '@/components/common/OutputPanel';
import ToolShell from './ToolShell';
import { useToast } from '@/hooks/useToast';

export default function UrlParser() {
  const [url, setUrl] = useState('');
  const [parsed, setParsed] = useState<Record<string, any> | null>(null);
  const [error, setError] = useState('');

  const parse = useCallback(() => {
    setError('');
    try {
      const urlObj = new URL(url);
      const result = {
        protocol: urlObj.protocol,
        hostname: urlObj.hostname,
        port: urlObj.port || (urlObj.protocol === 'https:' ? '443' : urlObj.protocol === 'http:' ? '80' : ''),
        pathname: urlObj.pathname,
        search: urlObj.search,
        hash: urlObj.hash,
        origin: urlObj.origin,
        host: urlObj.host,
        searchParams: Object.fromEntries(urlObj.searchParams.entries())
      };
      setParsed(result);
    } catch (e) {
      setError(`Invalid URL: ${(e as Error).message}`);
      setParsed(null);
    }
  }, [url]);

  
  const controls = (
          <div className="flex items-center gap-3">
        <button onClick={parse} disabled={!url} className="btn-primary">
          Parse URL
        </button>
        <button onClick={() => { setUrl(''); setParsed(null); setError(''); }} className="btn-ghost">
          Clear
        </button>
      </div>
  );

  return (
    <ToolShell className="space-y-6" controls={controls}>
      <div>
        <label className="label">URL to Parse</label>
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://example.com/path?key=value#hash"
          className="input-base font-mono"
          onBlur={parse}
        />
        <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
          Enter a complete URL with protocol (http:// or https://)
        </p>
      </div>

{/* Controls moved to header */}








      {error && <div className="alert-error">{error}</div>}
      {parsed && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="label">Protocol</label>
              <div className="p-3 rounded-lg border font-mono text-sm" style={{ backgroundColor: 'var(--bg-tertiary)', borderColor: 'var(--border-primary)' }}>
                {parsed.protocol}
              </div>
            </div>
            <div>
              <label className="label">Hostname</label>
              <div className="p-3 rounded-lg border font-mono text-sm" style={{ backgroundColor: 'var(--bg-tertiary)', borderColor: 'var(--border-primary)' }}>
                {parsed.hostname}
              </div>
            </div>
            <div>
              <label className="label">Port</label>
              <div className="p-3 rounded-lg border font-mono text-sm" style={{ backgroundColor: 'var(--bg-tertiary)', borderColor: 'var(--border-primary)' }}>
                {parsed.port || 'default'}
              </div>
            </div>
            <div>
              <label className="label">Pathname</label>
              <div className="p-3 rounded-lg border font-mono text-sm" style={{ backgroundColor: 'var(--bg-tertiary)', borderColor: 'var(--border-primary)' }}>
                {parsed.pathname || '/'}
              </div>
            </div>
            <div>
              <label className="label">Hash</label>
              <div className="p-3 rounded-lg border font-mono text-sm" style={{ backgroundColor: 'var(--bg-tertiary)', borderColor: 'var(--border-primary)' }}>
                {parsed.hash || '(none)'}
              </div>
            </div>
            <div>
              <label className="label">Origin</label>
              <div className="p-3 rounded-lg border font-mono text-sm" style={{ backgroundColor: 'var(--bg-tertiary)', borderColor: 'var(--border-primary)' }}>
                {parsed.origin}
              </div>
            </div>
          </div>
          {Object.keys(parsed.searchParams).length > 0 && (
            <div>
              <label className="label">Query Parameters</label>
              <OutputPanel
                value={JSON.stringify(parsed.searchParams, null, 2)}
                label="Search Params"
                language="json"
                showLineNumbers
              />
            </div>
          )}
        </div>
      )}
    </ToolShell>
  );
}

