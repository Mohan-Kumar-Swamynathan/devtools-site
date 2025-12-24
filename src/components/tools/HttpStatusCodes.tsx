import { useState } from 'react';
import ToolShell from './ToolShell';
import { useToast } from '@/hooks/useToast';

const statusCodes = [
  { code: 100, name: 'Continue', description: 'The server has received the request headers' },
  { code: 101, name: 'Switching Protocols', description: 'The requester has asked the server to switch protocols' },
  { code: 200, name: 'OK', description: 'The request is OK' },
  { code: 201, name: 'Created', description: 'The request has been fulfilled, resulting in the creation of a new resource' },
  { code: 204, name: 'No Content', description: 'The request has been successfully processed, but is not returning any content' },
  { code: 301, name: 'Moved Permanently', description: 'This and all future requests should be directed to the given URI' },
  { code: 302, name: 'Found', description: 'The resource was found, but at a different location' },
  { code: 304, name: 'Not Modified', description: 'The resource has not been modified since the last request' },
  { code: 400, name: 'Bad Request', description: 'The request cannot be fulfilled due to bad syntax' },
  { code: 401, name: 'Unauthorized', description: 'Authentication is required and has failed or has not been provided' },
  { code: 403, name: 'Forbidden', description: 'The request was valid, but the server is refusing action' },
  { code: 404, name: 'Not Found', description: 'The requested resource could not be found' },
  { code: 405, name: 'Method Not Allowed', description: 'The method specified in the request is not allowed' },
  { code: 500, name: 'Internal Server Error', description: 'An error occurred on the server' },
  { code: 502, name: 'Bad Gateway', description: 'The server received an invalid response from an upstream server' },
  { code: 503, name: 'Service Unavailable', description: 'The server is currently unavailable' },
  { code: 504, name: 'Gateway Timeout', description: 'The server did not receive a timely response from an upstream server' }
];

export default function HttpStatusCodes() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<'all' | '1xx' | '2xx' | '3xx' | '4xx' | '5xx'>('all');

  const filtered = statusCodes.filter(code => {
    const matchesSearch = search === '' || 
      code.code.toString().includes(search) ||
      code.name.toLowerCase().includes(search.toLowerCase()) ||
      code.description.toLowerCase().includes(search.toLowerCase());
    
    const matchesCategory = category === 'all' || 
      (category === '1xx' && code.code >= 100 && code.code < 200) ||
      (category === '2xx' && code.code >= 200 && code.code < 300) ||
      (category === '3xx' && code.code >= 300 && code.code < 400) ||
      (category === '4xx' && code.code >= 400 && code.code < 500) ||
      (category === '5xx' && code.code >= 500 && code.code < 600);
    
    return matchesSearch && matchesCategory;
  });

  const getColor = (code: number) => {
    if (code >= 200 && code < 300) return '#22c55e';
    if (code >= 300 && code < 400) return '#3b82f6';
    if (code >= 400 && code < 500) return '#f59e0b';
    if (code >= 500) return '#ef4444';
    return '#6b7280';
  };

  const controls = null;

  return (
    <ToolShell className="space-y-6" controls={controls}>
      <div className="flex flex-wrap items-center gap-4">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search status codes..."
          className="input-base flex-1 min-w-[200px]"
        />
        <select value={category} onChange={(e) => setCategory(e.target.value as any)} className="input-base">
          <option value="all">All Categories</option>
          <option value="1xx">1xx Informational</option>
          <option value="2xx">2xx Success</option>
          <option value="3xx">3xx Redirection</option>
          <option value="4xx">4xx Client Error</option>
          <option value="5xx">5xx Server Error</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(code => (
          <div
            key={code.code}
            className="p-4 rounded-xl border"
            style={{ borderColor: 'var(--border-primary)' }}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-2xl font-bold" style={{ color: getColor(code.code) }}>
                {code.code}
              </span>
              <span className="text-sm font-medium">{code.name}</span>
            </div>
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
              {code.description}
            </p>
          </div>
        ))}
      </div>
    </ToolShell>
  );
}

