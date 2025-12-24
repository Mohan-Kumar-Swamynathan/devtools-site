import { useState, useCallback, useEffect } from 'react';
import { Copy, Download, RotateCcw } from 'lucide-react';
import ToolShell from './ToolShell';
import { useToast } from '@/hooks/useToast';

export default function TextToSlug() {
  const [text, setText] = useState('');
  const [slug, setSlug] = useState('');
  const [options, setOptions] = useState({
    lowercase: true,
    removeSpecialChars: true,
    replaceSpaces: true,
    removeAccents: true,
  });
  const { showToast } = useToast();

  const convertToSlug = useCallback((input: string) => {
    let result = input;

    if (options.removeAccents) {
      result = result.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    }

    if (options.removeSpecialChars) {
      result = result.replace(/[^a-zA-Z0-9\s-]/g, '');
    }

    if (options.replaceSpaces) {
      result = result.replace(/\s+/g, '-');
    }

    if (options.lowercase) {
      result = result.toLowerCase();
    }

    result = result.replace(/-+/g, '-');
    result = result.replace(/^-+|-+$/g, '');

    return result;
  }, [options]);

  useEffect(() => {
    if (text) {
      setSlug(convertToSlug(text));
    } else {
      setSlug('');
    }
  }, [text, convertToSlug]);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(slug).then(() => {
      showToast('Copied to clipboard!', 'success');
    });
  }, [slug, showToast]);

  const handleDownload = useCallback(() => {
    const blob = new Blob([slug], { type: 'text/plain' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'slug.txt';
    link.click();
    URL.revokeObjectURL(link.href);
  }, [slug]);

  
  const controls = (
          <div className="flex items-center gap-3">
        <button
          onClick={handleCopy}
          disabled={!slug}
          className="btn-primary flex items-center gap-2"
        >
          <Copy size={18} />
          Copy Slug
        </button>
        <button
          onClick={handleDownload}
          disabled={!slug}
          className="btn-secondary flex items-center gap-2"
        >
          <Download size={18} />
          Download
        </button>
        <button
          onClick={() => {
            setText('');
            setSlug('');
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
            Input Text
          </h3>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="input w-full h-32"
            placeholder="Enter text to convert to slug..."
          />
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
            Generated Slug
          </h3>
          <div className="p-4 rounded-xl border min-h-[128px] flex items-center" style={{
            backgroundColor: 'var(--bg-secondary)',
            borderColor: 'var(--border-primary)'
          }}>
            <code className="text-sm break-all" style={{ color: slug ? 'var(--text-primary)' : 'var(--text-muted)' }}>
              {slug || 'Slug will appear here...'}
            </code>
          </div>
        </div>
      </div>

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
              checked={options.lowercase}
              onChange={(e) => setOptions({ ...options, lowercase: e.target.checked })}
              className="checkbox"
            />
            <span className="text-sm" style={{ color: 'var(--text-primary)' }}>Lowercase</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={options.removeSpecialChars}
              onChange={(e) => setOptions({ ...options, removeSpecialChars: e.target.checked })}
              className="checkbox"
            />
            <span className="text-sm" style={{ color: 'var(--text-primary)' }}>Remove Special Chars</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={options.replaceSpaces}
              onChange={(e) => setOptions({ ...options, replaceSpaces: e.target.checked })}
              className="checkbox"
            />
            <span className="text-sm" style={{ color: 'var(--text-primary)' }}>Replace Spaces with -</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={options.removeAccents}
              onChange={(e) => setOptions({ ...options, removeAccents: e.target.checked })}
              className="checkbox"
            />
            <span className="text-sm" style={{ color: 'var(--text-primary)' }}>Remove Accents</span>
          </label>
        </div>
      </div>
    </ToolShell>
  );
}

