import { useState, useCallback, useEffect } from 'react';
import { Copy, Download, RotateCcw } from 'lucide-react';
import { useToast } from '@/hooks/useToast';

export default function HtmlEntityDecoder() {
  const [encoded, setEncoded] = useState('&lt;div&gt;Hello &amp; World&lt;/div&gt;');
  const [decoded, setDecoded] = useState('');
  const { showToast } = useToast();

  const decode = useCallback((text: string) => {
    const textarea = document.createElement('textarea');
    textarea.innerHTML = text;
    return textarea.value;
  }, []);

  useEffect(() => {
    if (encoded) {
      try {
        setDecoded(decode(encoded));
      } catch (e) {
        setDecoded('Error decoding HTML entities');
      }
    } else {
      setDecoded('');
    }
  }, [encoded, decode]);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(decoded).then(() => {
      showToast('Copied to clipboard!', 'success');
    });
  }, [decoded, showToast]);

  const handleDownload = useCallback(() => {
    const blob = new Blob([decoded], { type: 'text/plain' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'decoded.txt';
    link.click();
    URL.revokeObjectURL(link.href);
  }, [decoded]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-3">
        <button
          onClick={handleCopy}
          disabled={!decoded}
          className="btn-primary flex items-center gap-2"
        >
          <Copy size={18} />
          Copy Decoded
        </button>
        <button
          onClick={handleDownload}
          disabled={!decoded}
          className="btn-secondary flex items-center gap-2"
        >
          <Download size={18} />
          Download
        </button>
        <button
          onClick={() => {
            setEncoded('');
            setDecoded('');
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
            HTML Entities (Encoded)
          </h3>
          <textarea
            value={encoded}
            onChange={(e) => setEncoded(e.target.value)}
            className="input w-full h-64 font-mono text-sm"
            placeholder="Enter HTML entities like &amp; &lt; &gt; &quot; etc."
          />
        </div>
        <div className="space-y-4">
          <h3 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
            Decoded Text
          </h3>
          <textarea
            value={decoded}
            readOnly
            className="input w-full h-64 font-mono text-sm"
            placeholder="Decoded text will appear here..."
          />
        </div>
      </div>

      <div className="p-4 rounded-xl border" style={{
        backgroundColor: 'var(--bg-secondary)',
        borderColor: 'var(--border-primary)'
      }}>
        <h4 className="text-sm font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
          Common HTML Entities:
        </h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs font-mono">
          <div><code>&amp;</code> → &</div>
          <div><code>&lt;</code> → &lt;</div>
          <div><code>&gt;</code> → &gt;</div>
          <div><code>&quot;</code> → &quot;</div>
          <div><code>&apos;</code> → &apos;</div>
          <div><code>&nbsp;</code> → (space)</div>
          <div><code>&copy;</code> → ©</div>
          <div><code>&reg;</code> → ®</div>
        </div>
      </div>
    </div>
  );
}

