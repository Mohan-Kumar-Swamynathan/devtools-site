import { useState, useRef, useCallback } from 'react';
import { Upload, Download, Copy } from 'lucide-react';
import ErrorMessage from '@/components/common/ErrorMessage';
import ToolShell from './ToolShell';
import { useToast } from '@/hooks/useToast';

export default function CsvViewer() {
  const [csv, setCsv] = useState('');
  const [rows, setRows] = useState<string[][]>([]);
  const [error, setError] = useState('');
  const { showToast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const parseCSV = useCallback((text: string) => {
    const lines = text.split('\n').filter(line => line.trim());
    const parsed = lines.map(line => {
      const result: string[] = [];
      let current = '';
      let inQuotes = false;

      for (let i = 0; i < line.length; i++) {
        const char = line[i];
        if (char === '"') {
          inQuotes = !inQuotes;
        } else if (char === ',' && !inQuotes) {
          result.push(current.trim());
          current = '';
        } else {
          current += char;
        }
      }
      result.push(current.trim());
      return result;
    });

    setRows(parsed);
    setCsv(text);
  }, []);

  const handleFileSelect = useCallback((files: FileList | null) => {
    if (!files || files.length === 0) return;

    const file = files[0];
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      parseCSV(text);
    };
    reader.onerror = () => setError('Failed to read file');
    reader.readAsText(file);
  }, [parseCSV]);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(csv).then(() => {
      showToast('Copied to clipboard!', 'success');
    });
  }, [csv, showToast]);

  const handleDownload = useCallback(() => {
    const blob = new Blob([csv], { type: 'text/csv' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'data.csv';
    link.click();
    URL.revokeObjectURL(link.href);
  }, [csv]);

  
  const controls = (
          <div className="flex items-center gap-3">
        <button
          onClick={() => fileInputRef.current?.click()}
          className="btn-primary flex items-center gap-2"
        >
          <Upload size={18} />
          Upload CSV
        </button>
        {rows.length > 0 && (
          <>
            <button
              onClick={handleCopy}
              className="btn-secondary flex items-center gap-2"
            >
              <Copy size={18} />
              Copy CSV
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
        <input
          ref={fileInputRef}
          type="file"
          accept=".csv,text/csv"
          onChange={(e) => handleFileSelect(e.target.files)}
          className="hidden"
        />
      </div>
  );

  return (
    <ToolShell className="space-y-6" controls={controls}>
      {error && <ErrorMessage message={error} onDismiss={() => setError('')} />}

{/* Controls moved to header */}


































      {rows.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
            CSV Data ({rows.length} rows)
          </h3>
          <div className="overflow-x-auto rounded-xl border" style={{
            backgroundColor: 'var(--bg-secondary)',
            borderColor: 'var(--border-primary)'
          }}>
            <table className="w-full text-sm">
              <thead>
                <tr style={{ backgroundColor: 'var(--bg-primary)' }}>
                  {rows[0]?.map((header, i) => (
                    <th key={i} className="p-3 text-left font-semibold" style={{ color: 'var(--text-primary)' }}>
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.slice(1).map((row, i) => (
                  <tr key={i} className="border-t" style={{ borderColor: 'var(--border-primary)' }}>
                    {row.map((cell, j) => (
                      <td key={j} className="p-3" style={{ color: 'var(--text-primary)' }}>
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {rows.length === 0 && (
        <div className="p-8 rounded-xl border text-center" style={{
          backgroundColor: 'var(--bg-secondary)',
          borderColor: 'var(--border-primary)'
        }}>
          <p style={{ color: 'var(--text-muted)' }}>
            Upload a CSV file to view and edit it
          </p>
        </div>
      )}
    </ToolShell>
  );
}

