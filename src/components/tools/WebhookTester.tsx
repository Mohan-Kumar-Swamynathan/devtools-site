import { useState, useCallback } from 'react';
import OutputPanel from '@/components/common/OutputPanel';

export default function WebhookTester() {
  const [url, setUrl] = useState('');
  const [method, setMethod] = useState<'GET' | 'POST' | 'PUT' | 'DELETE'>('POST');
  const [headers, setHeaders] = useState('Content-Type: application/json');
  const [body, setBody] = useState('{"test": "data"}');
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

      const res = await fetch(url, options);
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
        body: parsed
      });
    } catch (e) {
      const error = e as Error;
      let errorMessage = error.message;
      
      // Provide user-friendly error messages
      if (errorMessage.includes('Failed to fetch') || errorMessage.includes('NetworkError')) {
        errorMessage = 'Network error: Could not connect to the server. Please check your internet connection and the URL.';
      } else if (errorMessage.includes('CORS')) {
        errorMessage = 'CORS error: The server blocked the request. This might be due to CORS policy restrictions.';
      } else if (errorMessage.includes('Invalid URL')) {
        errorMessage = 'Invalid URL: Please enter a valid URL (e.g., https://api.example.com/webhook)';
      }
      
      setResponse({
        error: errorMessage,
        errorType: error.name
      });
    } finally {
      setLoading(false);
    }
  }, [url, method, headers, body]);

  return (
    <div className="space-y-6">
      <div className="p-4 rounded-xl border" style={{ backgroundColor: 'var(--bg-tertiary)', borderColor: 'var(--border-primary)' }}>
        <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
          <strong>Note:</strong> This tool makes actual HTTP requests. Use with caution and only test your own endpoints.
        </p>
      </div>

      <div>
        <label className="label">Webhook URL</label>
        <input
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://api.example.com/webhook"
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
          {loading ? 'Testing...' : 'Test Webhook'}
        </button>
        <button onClick={() => { setUrl(''); setResponse(null); }} className="btn-ghost">
          Clear
        </button>
      </div>

      {response && (
        <div className="space-y-4">
          {response.error ? (
            <div className="alert-error">
              <div className="font-semibold mb-1">Error</div>
              <div>{response.error}</div>
              {response.errorType && (
                <div className="text-xs mt-2 opacity-75">Type: {response.errorType}</div>
              )}
            </div>
          ) : (
            <>
              <div className={`p-4 rounded-xl border ${
                response.status >= 200 && response.status < 300 ? 'alert-success' : 'alert-error'
              }`}>
                <div className="font-medium">
                  {response.status} {response.statusText}
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

