import { useState, useCallback, useRef } from 'react';
import CodeEditor from '@/components/common/CodeEditor';
import OutputPanel from '@/components/common/OutputPanel';
import { Copy, ExternalLink, Trash2 } from 'lucide-react';
import ErrorMessage from '@/components/common/ErrorMessage';
import ToolShell from './ToolShell';
import { useToast } from '@/hooks/useToast';

interface ShortUrl {
  original: string;
  short: string;
  hash: string;
}

export default function UrlShortener() {
  const [url, setUrl] = useState('');
  const [shortUrls, setShortUrls] = useState<ShortUrl[]>([]);
  const [error, setError] = useState('');
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const generateHash = useCallback((url: string): string => {
    let hash = 0;
    for (let i = 0; i < url.length; i++) {
      const char = url.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return Math.abs(hash).toString(36).substring(0, 8);
  }, []);

  const shorten = useCallback(() => {
    setError('');
    
    if (!url.trim()) {
      setError('Please enter a URL');
      return;
    }

    let urlToShorten = url.trim();
    
    // Add protocol if missing
    if (!urlToShorten.match(/^https?:\/\//i)) {
      urlToShorten = 'https://' + urlToShorten;
    }

    // Validate URL
    try {
      new URL(urlToShorten);
    } catch {
      setError('Please enter a valid URL');
      return;
    }

    const hash = generateHash(urlToShorten);
    const shortUrl = `${window.location.origin}/s/${hash}`;
    
    const newShortUrl: ShortUrl = {
      original: urlToShorten,
      short: shortUrl,
      hash
    };

    setShortUrls(prev => [newShortUrl, ...prev.filter(s => s.hash !== hash)]);
    setUrl('');
  }, [url, generateHash]);

  const handleCopy = useCallback(async (shortUrl: string, index: number) => {
    try {
      await navigator.clipboard.writeText(shortUrl);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch (e) {
      setError('Failed to copy to clipboard');
    }
  }, []);

  const handleDelete = useCallback((hash: string) => {
    setShortUrls(prev => prev.filter(s => s.hash !== hash));
  }, []);

  const controls = null;

  return (
    <ToolShell className="space-y-6" controls={controls}>
      {error && <ErrorMessage message={error} onDismiss={() => setError('')} />}

      <div className="space-y-4">
        <div>
          <label className="label">URL to Shorten</label>
          <div className="flex gap-2">
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && shorten()}
              className="input-base flex-1"
              placeholder="https://example.com/very/long/url"
            />
            <button onClick={shorten} disabled={!url.trim()} className="btn-primary">
              Shorten
            </button>
          </div>
        </div>
      </div>

      {shortUrls.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
              Shortened URLs ({shortUrls.length})
            </h3>
            <button
              onClick={() => setShortUrls([])}
              className="btn-ghost btn-sm flex items-center gap-1"
            >
              <Trash2 size={14} />
              Clear All
            </button>
          </div>

          <div className="space-y-3">
            {shortUrls.map((item, index) => (
              <div
                key={item.hash}
                className="p-4 rounded-xl border animate-fade-in-scale"
                style={{
                  backgroundColor: 'var(--bg-secondary)',
                  borderColor: 'var(--border-primary)'
                }}
              >
                <div className="space-y-3">
                  <div>
                    <label className="text-xs font-semibold mb-1 block" style={{ color: 'var(--text-muted)' }}>
                      Original URL
                    </label>
                    <div className="flex items-center gap-2">
                      <a
                        href={item.original}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 text-sm truncate hover:underline"
                        style={{ color: 'var(--brand-primary)' }}
                      >
                        {item.original}
                      </a>
                      <a
                        href={item.original}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-icon p-1.5"
                        title="Open URL"
                      >
                        <ExternalLink size={14} />
                      </a>
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-xs font-semibold mb-1 block" style={{ color: 'var(--text-muted)' }}>
                      Short URL
                    </label>
                    <div className="flex items-center gap-2">
                      <code className="flex-1 px-3 py-2 rounded-lg text-sm font-mono" style={{
                        backgroundColor: 'var(--bg-primary)',
                        color: 'var(--text-primary)',
                        border: '1px solid var(--border-primary)'
                      }}>
                        {item.short}
                      </code>
                      <button
                        onClick={() => handleCopy(item.short, index)}
                        className="btn-primary btn-sm flex items-center gap-1"
                        title={copiedIndex === index ? 'Copied!' : 'Copy'}
                      >
                        {copiedIndex === index ? '✓' : <Copy size={14} />}
                      </button>
                      <button
                        onClick={() => handleDelete(item.hash)}
                        className="btn-ghost btn-sm"
                        title="Delete"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="p-4 rounded-xl border text-sm" style={{ 
        backgroundColor: 'var(--bg-secondary)', 
        borderColor: 'var(--border-primary)' 
      }}>
        <h3 className="font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
          Note:
        </h3>
        <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
          This is a client-side URL shortener. The shortened URLs are stored in your browser's memory and will be lost when you refresh the page. 
          For persistent URL shortening, you would need a backend service. However, you can copy and share these shortened URLs while this page is open.
        </p>
      </div>
    </ToolShell>
  );
}

