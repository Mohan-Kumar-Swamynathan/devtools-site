import { useState, useCallback } from 'react';
import OutputPanel from '@/components/common/OutputPanel';
import ToolShell from './ToolShell';
import { useToast } from '@/hooks/useToast';

export default function CorsChecker() {
  const [url, setUrl] = useState('');
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const check = useCallback(async () => {
    setLoading(true);
    setResult(null);
    
    try {
      const res = await fetch(url, { method: 'OPTIONS' });
      const corsHeaders: Record<string, string> = {};
      
      ['Access-Control-Allow-Origin', 'Access-Control-Allow-Methods', 
       'Access-Control-Allow-Headers', 'Access-Control-Allow-Credentials'].forEach(header => {
        const value = res.headers.get(header);
        if (value) {
          corsHeaders[header] = value;
        }
      });

      setResult({
        url,
        corsEnabled: Object.keys(corsHeaders).length > 0,
        headers: corsHeaders,
        status: res.status
      });
    } catch (e) {
      setResult({
        error: (e as Error).message,
        corsEnabled: false
      });
    } finally {
      setLoading(false);
    }
  }, [url]);

  
  const controls = (
          <div className="flex items-center gap-3">
        <button onClick={check} disabled={!url || loading} className="btn-primary">
          {loading ? 'Checking...' : 'Check CORS'}
        </button>
        <button onClick={() => { setUrl(''); setResult(null); }} className="btn-ghost">
          Clear
        </button>
      </div>
  );

  return (
    <ToolShell className="space-y-6" controls={controls}>
      <div className="p-4 rounded-xl border" style={{ backgroundColor: 'var(--bg-tertiary)', borderColor: 'var(--border-primary)' }}>
        <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
          <strong>Note:</strong> This tool makes actual HTTP requests. CORS checks may be blocked by browser security policies.
        </p>
      </div>

      <div>
        <label className="label">URL to Check</label>
        <input
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://api.example.com"
          className="input-base font-mono"
        />
      </div>

{/* Controls moved to header */}








      {result && (
        <div className="space-y-4">
          <div className={`p-4 rounded-xl border ${
            result.corsEnabled ? 'alert-success' : 'alert-error'
          }`}>
            <div className="font-medium">
              {result.corsEnabled ? '✓ CORS Enabled' : '✗ CORS Not Enabled'}
            </div>
          </div>
          {Object.keys(result.headers || {}).length > 0 && (
            <OutputPanel
              value={JSON.stringify(result.headers, null, 2)}
              label="CORS Headers"
              language="json"
              showLineNumbers
            />
          )}
        </div>
      )}
    </ToolShell>
  );
}

