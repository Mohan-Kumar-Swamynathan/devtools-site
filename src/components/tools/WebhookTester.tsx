import { useState, useCallback } from 'react';
import { Copy, Send, RotateCcw } from 'lucide-react';
import ErrorMessage from '@/components/common/ErrorMessage';
import ToolShell from './ToolShell';
import { useToast } from '@/hooks/useToast';

export default function WebhookTester() {
  const [url, setUrl] = useState('');
  const [method, setMethod] = useState('POST');
  const [headers, setHeaders] = useState('Content-Type: application/json');
  const [payload, setPayload] = useState('{"key": "value"}');
  const [response, setResponse] = useState<any>(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { showToast } = useToast();

  const handleTest = useCallback(async () => {
    if (!url.trim()) {
      setError('Please enter a webhook URL');
      return;
    }

    setError('');
    setIsLoading(true);
    setResponse(null);

    try {
      const headerObj: Record<string, string> = {};
      headers.split('\n').forEach(line => {
        const [key, ...values] = line.split(':');
        if (key && values.length > 0) {
          headerObj[key.trim()] = values.join(':').trim();
        }
      });

      let body = null;
      if (method !== 'GET' && payload.trim()) {
        try {
          body = JSON.parse(payload);
        } catch {
          body = payload;
        }
      }

      const res = await fetch(url, {
        method,
        headers: headerObj,
        body: method !== 'GET' ? JSON.stringify(body) : undefined,
      });

      const responseData = {
        status: res.status,
        statusText: res.statusText,
        headers: Object.fromEntries(res.headers.entries()),
        body: await res.text(),
      };

      setResponse(responseData);
      showToast('Webhook tested!', 'success');
    } catch (e) {
      setError(`Error: ${(e as Error).message}`);
      showToast('Webhook test failed', 'error');
    } finally {
      setIsLoading(false);
    }
  }, [url, method, headers, payload, showToast]);

  const handleCopy = useCallback(() => {
    if (response) {
      const text = JSON.stringify(response, null, 2);
      navigator.clipboard.writeText(text).then(() => {
        showToast('Copied to clipboard!', 'success');
      });
    }
  }, [response, showToast]);

  
  const controls = (
          <div className="flex items-center gap-3">
        <button
          onClick={handleTest}
          disabled={isLoading}
          className="btn-primary flex items-center gap-2"
        >
          <Send size={18} />
          {isLoading ? 'Testing...' : 'Test Webhook'}
        </button>
        {response && (
          <button
            onClick={handleCopy}
            className="btn-secondary flex items-center gap-2"
          >
            <Copy size={18} />
            Copy Response
          </button>
        )}
        <button
          onClick={() => {
            setUrl('');
            setHeaders('Content-Type: application/json');
            setPayload('{"key": "value"}');
            setResponse(null);
            setError('');
          }}
          className="btn-ghost flex items-center gap-2"
        >
          <RotateCcw size={18} />
          Clear
        </button>
      </div>
  );

  return (
    <ToolShell className="space-y-6" controls={controls}>
      {error && <ErrorMessage message={error} onDismiss={() => setError('')} />}

{/* Controls moved to header */}
































      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
            Request
          </h3>
          <div className="p-4 rounded-xl border space-y-4" style={{
            backgroundColor: 'var(--bg-secondary)',
            borderColor: 'var(--border-primary)'
          }}>
            <div>
              <label className="label">Method</label>
              <select
                value={method}
                onChange={(e) => setMethod(e.target.value)}
                className="input w-full"
              >
                <option value="GET">GET</option>
                <option value="POST">POST</option>
                <option value="PUT">PUT</option>
                <option value="PATCH">PATCH</option>
                <option value="DELETE">DELETE</option>
              </select>
            </div>
            <div>
              <label className="label">Webhook URL</label>
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="input w-full"
                placeholder="https://example.com/webhook"
              />
            </div>
            <div>
              <label className="label">Headers</label>
              <textarea
                value={headers}
                onChange={(e) => setHeaders(e.target.value)}
                className="input w-full h-24 font-mono text-sm"
                placeholder="Content-Type: application/json"
              />
            </div>
            {method !== 'GET' && (
              <div>
                <label className="label">Payload (JSON)</label>
                <textarea
                  value={payload}
                  onChange={(e) => setPayload(e.target.value)}
                  className="input w-full h-32 font-mono text-sm"
                  placeholder='{"key": "value"}'
                />
              </div>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
            Response
          </h3>
          <div className="p-4 rounded-xl border min-h-[400px]" style={{
            backgroundColor: 'var(--bg-secondary)',
            borderColor: 'var(--border-primary)'
          }}>
            {response ? (
              <div className="space-y-4">
                <div>
                  <div className="text-sm font-medium mb-1" style={{ color: 'var(--text-muted)' }}>
                    Status
                  </div>
                  <div className="text-lg font-semibold" style={{ 
                    color: response.status >= 200 && response.status < 300 ? 'var(--status-success)' : 'var(--status-error)' 
                  }}>
                    {response.status} {response.statusText}
                  </div>
                </div>
                <div>
                  <div className="text-sm font-medium mb-2" style={{ color: 'var(--text-muted)' }}>
                    Response Body
                  </div>
                  <pre className="text-xs p-3 rounded bg-gray-100 dark:bg-gray-800 overflow-x-auto max-h-64" style={{ color: 'var(--text-primary)' }}>
                    {response.body}
                  </pre>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-full" style={{ color: 'var(--text-muted)' }}>
                Response will appear here after testing
              </div>
            )}
          </div>
        </div>
      </div>
    </ToolShell>
  );
}
