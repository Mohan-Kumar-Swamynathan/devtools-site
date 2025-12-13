import { useState, useCallback } from 'react';
import OutputPanel from '@/components/common/OutputPanel';

const extensions: Record<string, { type: string; description: string; mimeType: string }> = {
  '.js': { type: 'JavaScript', description: 'JavaScript source code', mimeType: 'application/javascript' },
  '.ts': { type: 'TypeScript', description: 'TypeScript source code', mimeType: 'application/typescript' },
  '.json': { type: 'JSON', description: 'JSON data file', mimeType: 'application/json' },
  '.html': { type: 'HTML', description: 'HTML document', mimeType: 'text/html' },
  '.css': { type: 'CSS', description: 'Cascading Style Sheet', mimeType: 'text/css' },
  '.py': { type: 'Python', description: 'Python source code', mimeType: 'text/x-python' },
  '.java': { type: 'Java', description: 'Java source code', mimeType: 'text/x-java-source' },
  '.cpp': { type: 'C++', description: 'C++ source code', mimeType: 'text/x-c++src' },
  '.c': { type: 'C', description: 'C source code', mimeType: 'text/x-csrc' },
  '.go': { type: 'Go', description: 'Go source code', mimeType: 'text/x-go' },
  '.rs': { type: 'Rust', description: 'Rust source code', mimeType: 'text/x-rust' },
  '.php': { type: 'PHP', description: 'PHP source code', mimeType: 'application/x-php' },
  '.rb': { type: 'Ruby', description: 'Ruby source code', mimeType: 'text/x-ruby' },
  '.jpg': { type: 'Image', description: 'JPEG image', mimeType: 'image/jpeg' },
  '.jpeg': { type: 'Image', description: 'JPEG image', mimeType: 'image/jpeg' },
  '.png': { type: 'Image', description: 'PNG image', mimeType: 'image/png' },
  '.gif': { type: 'Image', description: 'GIF image', mimeType: 'image/gif' },
  '.svg': { type: 'Image', description: 'SVG vector image', mimeType: 'image/svg+xml' },
  '.pdf': { type: 'Document', description: 'PDF document', mimeType: 'application/pdf' },
  '.zip': { type: 'Archive', description: 'ZIP archive', mimeType: 'application/zip' },
  '.txt': { type: 'Text', description: 'Plain text file', mimeType: 'text/plain' },
  '.md': { type: 'Markdown', description: 'Markdown document', mimeType: 'text/markdown' },
  '.xml': { type: 'XML', description: 'XML document', mimeType: 'application/xml' },
  '.yaml': { type: 'YAML', description: 'YAML document', mimeType: 'text/yaml' },
  '.yml': { type: 'YAML', description: 'YAML document', mimeType: 'text/yaml' }
};

export default function FileExtensionLookup() {
  const [extension, setExtension] = useState('');
  const [result, setResult] = useState<typeof extensions[string] | null>(null);

  const lookup = useCallback(() => {
    const ext = extension.startsWith('.') ? extension.toLowerCase() : `.${extension.toLowerCase()}`;
    setResult(extensions[ext] || null);
  }, [extension]);

  return (
    <div className="space-y-6">
      <div>
        <label className="label">File Extension</label>
        <input
          type="text"
          value={extension}
          onChange={(e) => { setExtension(e.target.value); lookup(); }}
          onBlur={lookup}
          placeholder=".js or js"
          className="input-base font-mono"
        />
      </div>

      {result && (
        <div className="space-y-4">
          <div className="p-4 rounded-xl border" style={{ backgroundColor: 'var(--bg-tertiary)', borderColor: 'var(--border-primary)' }}>
            <div className="space-y-2">
              <div>
                <span className="text-sm" style={{ color: 'var(--text-muted)' }}>Type:</span>
                <span className="ml-2 font-medium">{result.type}</span>
              </div>
              <div>
                <span className="text-sm" style={{ color: 'var(--text-muted)' }}>Description:</span>
                <span className="ml-2">{result.description}</span>
              </div>
              <div>
                <span className="text-sm" style={{ color: 'var(--text-muted)' }}>MIME Type:</span>
                <span className="ml-2 font-mono text-sm">{result.mimeType}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {extension && !result && (
        <div className="alert-error">
          Extension "{extension}" not found in database
        </div>
      )}
    </div>
  );
}

