import { useState, useCallback } from 'react';
import { Copy, Download, RotateCcw, Minimize2 } from 'lucide-react';
import { useToast } from '@/hooks/useToast';

export default function JavascriptMinifier() {
  const [js, setJs] = useState('');
  const [minified, setMinified] = useState('');
  const [options, setOptions] = useState({
    removeComments: true,
    removeWhitespace: true,
    removeLineBreaks: true,
  });
  const { showToast } = useToast();

  const minify = useCallback((code: string) => {
    let result = code;

    if (options.removeComments) {
      result = result.replace(/\/\*[\s\S]*?\*\//g, '');
      result = result.replace(/\/\/.*$/gm, '');
    }

    if (options.removeWhitespace) {
      result = result.replace(/\s+/g, ' ');
    }

    if (options.removeLineBreaks) {
      result = result.replace(/\n/g, '');
      result = result.replace(/\r/g, '');
    }

    return result.trim();
  }, [options]);

  const handleMinify = useCallback(() => {
    if (!js.trim()) {
      showToast('Please enter JavaScript code', 'error');
      return;
    }
    const min = minify(js);
    setMinified(min);
    showToast('JavaScript minified!', 'success');
  }, [js, minify, showToast]);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(minified).then(() => {
      showToast('Copied to clipboard!', 'success');
    });
  }, [minified, showToast]);

  const handleDownload = useCallback(() => {
    const blob = new Blob([minified], { type: 'text/javascript' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'minified.js';
    link.click();
    URL.revokeObjectURL(link.href);
  }, [minified]);

  const originalSize = js.length;
  const minifiedSize = minified.length;
  const savings = originalSize > 0 ? ((1 - minifiedSize / originalSize) * 100).toFixed(1) : '0';

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-3">
        <button
          onClick={handleMinify}
          className="btn-primary flex items-center gap-2"
        >
          <Minimize2 size={18} />
          Minify JavaScript
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
            setJs('');
            setMinified('');
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
            Original JavaScript
          </h3>
          <textarea
            value={js}
            onChange={(e) => setJs(e.target.value)}
            className="input w-full h-96 font-mono text-sm"
            placeholder="Paste your JavaScript code here..."
          />
        </div>
        <div className="space-y-4">
          <h3 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
            Minified JavaScript
          </h3>
          <textarea
            value={minified}
            readOnly
            className="input w-full h-96 font-mono text-sm"
            placeholder="Minified JavaScript will appear here..."
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
        <div className="grid grid-cols-3 gap-3">
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
              checked={options.removeWhitespace}
              onChange={(e) => setOptions({ ...options, removeWhitespace: e.target.checked })}
              className="checkbox"
            />
            <span className="text-sm" style={{ color: 'var(--text-primary)' }}>Remove Whitespace</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={options.removeLineBreaks}
              onChange={(e) => setOptions({ ...options, removeLineBreaks: e.target.checked })}
              className="checkbox"
            />
            <span className="text-sm" style={{ color: 'var(--text-primary)' }}>Remove Line Breaks</span>
          </label>
        </div>
      </div>
    </div>
  );
}

