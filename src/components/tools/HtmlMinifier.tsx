import { useState, useCallback } from 'react';
import { Copy, Download, RotateCcw, Minimize2 } from 'lucide-react';
import ToolShell from './ToolShell';
import { useToast } from '@/hooks/useToast';

export default function HtmlMinifier() {
  const [html, setHtml] = useState('');
  const [minified, setMinified] = useState('');
  const [options, setOptions] = useState({
    removeComments: true,
    collapseWhitespace: true,
    removeEmptyAttributes: true,
    removeOptionalTags: false,
  });
  const { showToast } = useToast();

  const minify = useCallback((code: string) => {
    let result = code;

    if (options.removeComments) {
      result = result.replace(/<!--[\s\S]*?-->/g, '');
    }

    if (options.collapseWhitespace) {
      result = result.replace(/>\s+</g, '><');
      result = result.replace(/\s+/g, ' ');
      result = result.trim();
    }

    if (options.removeEmptyAttributes) {
      result = result.replace(/\s+=\s*["']\s*["']/g, '');
    }

    if (options.removeOptionalTags) {
      result = result.replace(/<\/?(html|head|body)[^>]*>/gi, '');
    }

    return result;
  }, [options]);

  const handleMinify = useCallback(() => {
    if (!html.trim()) {
      showToast('Please enter HTML code', 'error');
      return;
    }
    const min = minify(html);
    setMinified(min);
    showToast('HTML minified!', 'success');
  }, [html, minify, showToast]);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(minified).then(() => {
      showToast('Copied to clipboard!', 'success');
    });
  }, [minified, showToast]);

  const handleDownload = useCallback(() => {
    const blob = new Blob([minified], { type: 'text/html' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'minified.html';
    link.click();
    URL.revokeObjectURL(link.href);
  }, [minified]);

  const originalSize = html.length;
  const minifiedSize = minified.length;
  const savings = originalSize > 0 ? ((1 - minifiedSize / originalSize) * 100).toFixed(1) : '0';

  
  const controls = (
          <div className="flex items-center gap-3">
        <button
          onClick={handleMinify}
          className="btn-primary flex items-center gap-2"
        >
          <Minimize2 size={18} />
          Minify HTML
        </button>
        {minified && (
          <>
            <button
              onClick={handleCopy}
              className="btn-secondary flex items-center gap-2"
            >
              <Copy size={18} />
              Copy
            </button>
            <button
              onClick={handleDownload}
              className="btn-secondary flex items-center gap-2"
            >
              <Download size={18} />
              Download
            </button>
          </>
        )}
        <button
          onClick={() => {
            setHtml('');
            setMinified('');
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
{/* Controls moved to header */}





































      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
            Original HTML
          </h3>
          <textarea
            value={html}
            onChange={(e) => setHtml(e.target.value)}
            className="input w-full h-96 font-mono text-sm"
            placeholder="Paste your HTML code here..."
          />
        </div>
        <div className="space-y-4">
          <h3 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
            Minified HTML
          </h3>
          <textarea
            value={minified}
            readOnly
            className="input w-full h-96 font-mono text-sm"
            placeholder="Minified HTML will appear here..."
          />
        </div>
      </div>

      {minified && (
        <div className="p-4 rounded-xl border" style={{
          backgroundColor: 'var(--bg-secondary)',
          borderColor: 'var(--border-primary)'
        }}>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-sm font-medium mb-1" style={{ color: 'var(--text-muted)' }}>
                Original Size
              </div>
              <div className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
                {originalSize.toLocaleString()} bytes
              </div>
            </div>
            <div>
              <div className="text-sm font-medium mb-1" style={{ color: 'var(--text-muted)' }}>
                Minified Size
              </div>
              <div className="text-lg font-semibold" style={{ color: 'var(--status-success)' }}>
                {minifiedSize.toLocaleString()} bytes
              </div>
            </div>
            <div>
              <div className="text-sm font-medium mb-1" style={{ color: 'var(--text-muted)' }}>
                Savings
              </div>
              <div className="text-lg font-semibold" style={{ color: 'var(--status-success)' }}>
                {savings}%
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="p-4 rounded-xl border space-y-3" style={{
        backgroundColor: 'var(--bg-secondary)',
        borderColor: 'var(--border-primary)'
      }}>
        <h3 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
          Options
        </h3>
        <div className="grid grid-cols-2 gap-3">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={options.removeComments}
              onChange={(e) => setOptions({ ...options, removeComments: e.target.checked })}
              className="checkbox"
            />
            <span className="text-sm" style={{ color: 'var(--text-primary)' }}>Remove Comments</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={options.collapseWhitespace}
              onChange={(e) => setOptions({ ...options, collapseWhitespace: e.target.checked })}
              className="checkbox"
            />
            <span className="text-sm" style={{ color: 'var(--text-primary)' }}>Collapse Whitespace</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={options.removeEmptyAttributes}
              onChange={(e) => setOptions({ ...options, removeEmptyAttributes: e.target.checked })}
              className="checkbox"
            />
            <span className="text-sm" style={{ color: 'var(--text-primary)' }}>Remove Empty Attributes</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={options.removeOptionalTags}
              onChange={(e) => setOptions({ ...options, removeOptionalTags: e.target.checked })}
              className="checkbox"
            />
            <span className="text-sm" style={{ color: 'var(--text-primary)' }}>Remove Optional Tags</span>
          </label>
        </div>
      </div>
    </ToolShell>
  );
}

