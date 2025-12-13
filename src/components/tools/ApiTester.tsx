import { useState, useCallback } from 'react';
import OutputPanel from '@/components/common/OutputPanel';

export default function ApiTester() {
  const [url, setUrl] = useState('');
  const [method, setMethod] = useState<'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'>('GET');
  const [headers, setHeaders] = useState('Content-Type: application/json');
  const [body, setBody] = useState('{"key": "value"}');
  const [response, setResponse] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const test = useCallback(async () => {
    setLoading(true);
    setResponse(null);
    
    try {
      const headerObj: Record<string, string> = {};
      headers.split('\n').forEach(line => {
        const [key, ...values] = line.split(':');
        if (key && values.length > 0) {
          headerObj[key.trim()] = values.join(':').trim();
        }
      });

      const options: RequestInit = {
        method,
        headers: headerObj
      };

      if (method !== 'GET' && body) {
        options.body = body;
      }

      const startTime = Date.now();
      const res = await fetch(url, options);
      const endTime = Date.now();
      
      const text = await res.text();
      let parsed;
      try {
        parsed = JSON.parse(text);
      } catch {
        parsed = text;
      }

      setResponse({
        status: res.status,
        statusText: res.statusText,
        headers: Object.fromEntries(res.headers.entries()),
        body: parsed,
        time: endTime - startTime,
        size: text.length
      });
    } catch (e) {
      setResponse({
        error: (e as Error).message
      });
    } finally {
      setLoading(false);
    }
  }, [url, method, headers, body]);

  return (
    <div className="space-y-6">
      <div className="p-4 rounded-xl border" style={{ backgroundColor: 'var(--bg-tertiary)', borderColor: 'var(--border-primary)' }}>
        <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
          <strong>Note:</strong> This tool makes actual HTTP requests. Use with caution and only test your own APIs.
        </p>
      </div>

      <div>
        <label className="label">API URL</label>
        <input
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://api.example.com/endpoint"
          className="input-base font-mono"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="label">HTTP Method</label>
          <select value={method} onChange={(e) => setMethod(e.target.value as any)} className="input-base">
            <option value="GET">GET</option>
            <option value="POST">POST</option>
            <option value="PUT">PUT</option>
            <option value="DELETE">DELETE</option>
            <option value="PATCH">PATCH</option>
          </select>
        </div>
      </div>

      <div>
        <label className="label">Headers (one per line)</label>
        <textarea
          value={headers}
          onChange={(e) => setHeaders(e.target.value)}
          placeholder="Content-Type: application/json
Authorization: Bearer token"
          className="input-base min-h-[80px] font-mono text-sm"
        />
      </div>

      {method !== 'GET' && (
        <div>
          <label className="label">Request Body</label>
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder='{"key": "value"}'
            className="input-base min-h-[100px] font-mono text-sm"
          />
        </div>
      )}

      <div className="flex flex-wrap items-center gap-3">
        <button onClick={test} disabled={!url || loading} className="btn-primary">
          {loading ? 'Testing...' : 'Test API'}
        </button>
        <button onClick={() => { setUrl(''); setResponse(null); }} className="btn-ghost">
          Clear
        </button>
      </div>

      {response && (
        <div className="space-y-4">
          {response.error ? (
            <div className="alert-error">{response.error}</div>
          ) : (
            <>
              <div className={`p-4 rounded-xl border ${
                response.status >= 200 && response.status < 300 ? 'alert-success' : 'alert-error'
              }`}>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">
                      {response.status} {response.statusText}
                    </div>
                    {response.time && (
                      <div className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
                        Time: {response.time}ms | Size: {response.size} bytes
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <OutputPanel
                value={JSON.stringify(response, null, 2)}
                label="Response"
                language="json"
                showLineNumbers
              />
            </>
          )}
        </div>
      )}
    </div>
  );
}

