import { useState, useCallback } from 'react';
import { Search, Copy, Info } from 'lucide-react';
import ToolShell from './ToolShell';
import { useToast } from '@/hooks/useToast';

// Common MIME types
const MIME_TYPES: Record<string, { mime: string; description: string }> = {
  'html': { mime: 'text/html', description: 'HTML document' },
  'htm': { mime: 'text/html', description: 'HTML document' },
  'css': { mime: 'text/css', description: 'CSS stylesheet' },
  'js': { mime: 'application/javascript', description: 'JavaScript file' },
  'json': { mime: 'application/json', description: 'JSON data' },
  'xml': { mime: 'application/xml', description: 'XML document' },
  'pdf': { mime: 'application/pdf', description: 'PDF document' },
  'zip': { mime: 'application/zip', description: 'ZIP archive' },
  'jpg': { mime: 'image/jpeg', description: 'JPEG image' },
  'jpeg': { mime: 'image/jpeg', description: 'JPEG image' },
  'png': { mime: 'image/png', description: 'PNG image' },
  'gif': { mime: 'image/gif', description: 'GIF image' },
  'svg': { mime: 'image/svg+xml', description: 'SVG image' },
  'webp': { mime: 'image/webp', description: 'WebP image' },
  'mp4': { mime: 'video/mp4', description: 'MP4 video' },
  'mp3': { mime: 'audio/mpeg', description: 'MP3 audio' },
  'txt': { mime: 'text/plain', description: 'Plain text' },
  'csv': { mime: 'text/csv', description: 'CSV file' },
  'md': { mime: 'text/markdown', description: 'Markdown file' },
  'yaml': { mime: 'text/yaml', description: 'YAML file' },
  'yml': { mime: 'text/yaml', description: 'YAML file' },
};

export default function MimeTypeLookup() {
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<string | null>(null);
  const { showToast } = useToast();

  const filteredTypes = Object.entries(MIME_TYPES).filter(([ext]) =>
    ext.toLowerCase().includes(search.toLowerCase()) ||
    MIME_TYPES[ext].mime.toLowerCase().includes(search.toLowerCase()) ||
    MIME_TYPES[ext].description.toLowerCase().includes(search.toLowerCase())
  );

  const handleCopy = useCallback((text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      showToast('Copied to clipboard!', 'success');
    });
  }, [showToast]);

  const controls = null;

  return (
    <ToolShell className="space-y-6" controls={controls}>
      <div className="space-y-4">
        <div>
          <label className="label">Search MIME Types</label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2" size={18} style={{ color: 'var(--text-muted)' }} />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input w-full pl-10"
              placeholder="Search by extension, MIME type, or description..."
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 max-h-96 overflow-y-auto custom-scrollbar p-2">
          {filteredTypes.map(([ext, data]) => (
            <button
              key={ext}
              onClick={() => setSelected(ext)}
              className="p-4 rounded-xl border text-left hover:border-blue-500 transition-colors"
              style={{
                backgroundColor: selected === ext ? 'var(--bg-tertiary)' : 'var(--bg-secondary)',
                borderColor: selected === ext ? 'var(--brand-primary)' : 'var(--border-primary)'
              }}
            >
              <div className="flex items-center justify-between mb-2">
                <code className="text-sm font-semibold px-2 py-1 rounded" style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--brand-primary)' }}>
                  .{ext}
                </code>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCopy(data.mime);
                  }}
                  className="btn-icon btn-sm"
                >
                  <Copy size={14} />
                </button>
              </div>
              <div className="text-xs font-medium mb-1" style={{ color: 'var(--text-primary)' }}>
                {data.mime}
              </div>
              <div className="text-xs" style={{ color: 'var(--text-muted)' }}>
                {data.description}
              </div>
            </button>
          ))}
        </div>
      </div>

      {selected && MIME_TYPES[selected] && (
        <div className="p-6 rounded-xl border" style={{
          backgroundColor: 'var(--bg-secondary)',
          borderColor: 'var(--border-primary)'
        }}>
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
            <Info size={20} />
            {selected.toUpperCase()} Details
          </h3>
          <div className="space-y-3">
            <div>
              <div className="text-sm font-medium mb-1" style={{ color: 'var(--text-muted)' }}>
                Extension
              </div>
              <code className="text-base font-semibold" style={{ color: 'var(--text-primary)' }}>
                .{selected}
              </code>
            </div>
            <div>
              <div className="text-sm font-medium mb-1" style={{ color: 'var(--text-muted)' }}>
                MIME Type
              </div>
              <div className="flex items-center gap-2">
                <code className="text-base font-semibold flex-1" style={{ color: 'var(--text-primary)' }}>
                  {MIME_TYPES[selected].mime}
                </code>
                <button
                  onClick={() => handleCopy(MIME_TYPES[selected].mime)}
                  className="btn-secondary btn-sm flex items-center gap-2"
                >
                  <Copy size={16} />
                  Copy
                </button>
              </div>
            </div>
            <div>
              <div className="text-sm font-medium mb-1" style={{ color: 'var(--text-muted)' }}>
                Description
              </div>
              <div className="text-base" style={{ color: 'var(--text-primary)' }}>
                {MIME_TYPES[selected].description}
              </div>
            </div>
          </div>
        </div>
      )}
    </ToolShell>
  );
}

