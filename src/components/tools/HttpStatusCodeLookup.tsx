import { useState, useCallback } from 'react';
import OutputPanel from '@/components/common/OutputPanel';
import ToolShell from './ToolShell';
import { useToast } from '@/hooks/useToast';

const statusCodes: Record<number, { name: string; description: string; category: string }> = {
  100: { name: 'Continue', description: 'The server has received the request headers', category: 'Informational' },
  101: { name: 'Switching Protocols', description: 'The requester has asked the server to switch protocols', category: 'Informational' },
  200: { name: 'OK', description: 'The request is OK', category: 'Success' },
  201: { name: 'Created', description: 'The request has been fulfilled, resulting in the creation of a new resource', category: 'Success' },
  204: { name: 'No Content', description: 'The request has been successfully processed, but is not returning any content', category: 'Success' },
  301: { name: 'Moved Permanently', description: 'This and all future requests should be directed to the given URI', category: 'Redirection' },
  302: { name: 'Found', description: 'The resource was found, but at a different location', category: 'Redirection' },
  304: { name: 'Not Modified', description: 'The resource has not been modified since the last request', category: 'Redirection' },
  400: { name: 'Bad Request', description: 'The request cannot be fulfilled due to bad syntax', category: 'Client Error' },
  401: { name: 'Unauthorized', description: 'Authentication is required and has failed or has not been provided', category: 'Client Error' },
  403: { name: 'Forbidden', description: 'The request was valid, but the server is refusing action', category: 'Client Error' },
  404: { name: 'Not Found', description: 'The requested resource could not be found', category: 'Client Error' },
  405: { name: 'Method Not Allowed', description: 'The method specified in the request is not allowed', category: 'Client Error' },
  500: { name: 'Internal Server Error', description: 'An error occurred on the server', category: 'Server Error' },
  502: { name: 'Bad Gateway', description: 'The server received an invalid response from an upstream server', category: 'Server Error' },
  503: { name: 'Service Unavailable', description: 'The server is currently unavailable', category: 'Server Error' },
  504: { name: 'Gateway Timeout', description: 'The server did not receive a timely response from an upstream server', category: 'Server Error' }
};

export default function HttpStatusCodeLookup() {
  const [code, setCode] = useState('');
  const [result, setResult] = useState<typeof statusCodes[number] | null>(null);

  const lookup = useCallback(() => {
    const codeNum = parseInt(code, 10);
    if (isNaN(codeNum)) {
      setResult(null);
      return;
    }
    setResult(statusCodes[codeNum] || null);
  }, [code]);

  const controls = null;

  return (
    <ToolShell className="space-y-6" controls={controls}>
      <div>
        <label className="label">HTTP Status Code</label>
        <input
          type="number"
          value={code}
          onChange={(e) => { setCode(e.target.value); lookup(); }}
          onBlur={lookup}
          placeholder="200"
          className="input-base"
        />
      </div>

      {result && (
        <div className="p-4 rounded-xl border" style={{ backgroundColor: 'var(--bg-tertiary)', borderColor: 'var(--border-primary)' }}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-2xl font-bold">{code}</span>
            <span className="text-sm font-medium">{result.category}</span>
          </div>
          <div className="text-lg font-semibold mb-1">{result.name}</div>
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
            {result.description}
          </p>
        </div>
      )}

      {code && !result && (
        <div className="alert-error">
          Status code {code} not found in database
        </div>
      )}
    </ToolShell>
  );
}

