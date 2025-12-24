import { useState, useCallback } from 'react';
import { Search, Copy } from 'lucide-react';
import ToolShell from './ToolShell';
import { useToast } from '@/hooks/useToast';

// Common file extensions
const FILE_EXTENSIONS: Record<string, { description: string; category: string }> = {
  'html': { description: 'HyperText Markup Language', category: 'Web' },
  'css': { description: 'Cascading Style Sheets', category: 'Web' },
  'js': { description: 'JavaScript', category: 'Programming' },
  'ts': { description: 'TypeScript', category: 'Programming' },
  'json': { description: 'JavaScript Object Notation', category: 'Data' },
  'xml': { description: 'eXtensible Markup Language', category: 'Data' },
  'pdf': { description: 'Portable Document Format', category: 'Document' },
  'zip': { description: 'ZIP Archive', category: 'Archive' },
  'jpg': { description: 'JPEG Image', category: 'Image' },
  'png': { description: 'Portable Network Graphics', category: 'Image' },
  'gif': { description: 'Graphics Interchange Format', category: 'Image' },
  'svg': { description: 'Scalable Vector Graphics', category: 'Image' },
  'mp4': { description: 'MPEG-4 Video', category: 'Video' },
  'mp3': { description: 'MPEG Audio', category: 'Audio' },
  'txt': { description: 'Plain Text', category: 'Text' },
  'csv': { description: 'Comma-Separated Values', category: 'Data' },
  'md': { description: 'Markdown', category: 'Text' },
  'yaml': { description: 'YAML Ain\'t Markup Language', category: 'Data' },
  'py': { description: 'Python', category: 'Programming' },
  'java': { description: 'Java', category: 'Programming' },
  'cpp': { description: 'C++', category: 'Programming' },
  'c': { description: 'C', category: 'Programming' },
  'go': { description: 'Go', category: 'Programming' },
  'rs': { description: 'Rust', category: 'Programming' },
  'php': { description: 'PHP', category: 'Programming' },
  'rb': { description: 'Ruby', category: 'Programming' },
  'sh': { description: 'Shell Script', category: 'Script' },
  'sql': { description: 'Structured Query Language', category: 'Database' },
};

export default function FileExtensionLookup() {
  const [search, setSearch] = useState('');
  const { showToast } = useToast();

  const filteredExtensions = Object.entries(FILE_EXTENSIONS).filter(([ext, data]) =>
    ext.toLowerCase().includes(search.toLowerCase()) ||
    data.description.toLowerCase().includes(search.toLowerCase()) ||
    data.category.toLowerCase().includes(search.toLowerCase())
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
          <label className="label">Search File Extensions</label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2" size={18} style={{ color: 'var(--text-muted)' }} />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input w-full pl-10"
              placeholder="Search by extension, description, or category..."
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 max-h-96 overflow-y-auto custom-scrollbar p-2">
          {filteredExtensions.map(([ext, data]) => (
            <div
              key={ext}
              className="p-4 rounded-xl border"
              style={{
                backgroundColor: 'var(--bg-secondary)',
                borderColor: 'var(--border-primary)'
              }}
            >
              <div className="flex items-center justify-between mb-2">
                <code className="text-sm font-semibold px-2 py-1 rounded" style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--brand-primary)' }}>
                  .{ext}
                </code>
                <button
                  onClick={() => handleCopy(`.${ext}`)}
                  className="btn-icon btn-sm"
                >
                  <Copy size={14} />
                </button>
              </div>
              <div className="text-xs font-medium mb-1" style={{ color: 'var(--text-primary)' }}>
                {data.description}
              </div>
              <div className="text-xs px-2 py-0.5 rounded-full inline-block" style={{ backgroundColor: 'var(--bg-tertiary)', color: 'var(--text-muted)' }}>
                {data.category}
              </div>
            </div>
          ))}
        </div>
      </div>
    </ToolShell>
  );
}
