import { useState } from 'react';
import { Copy, Check, Download } from 'lucide-react';
import clsx from 'clsx';

interface Props {
  value: string;
  label?: string;
  language?: string;
  filename?: string;
  showLineNumbers?: boolean;
  maxHeight?: string;
  className?: string;
  asCode?: boolean;
}

export default function OutputPanel({
  value,
  label = 'Output',
  language = 'text',
  filename,
  showLineNumbers = false,
  maxHeight = '400px',
  className = '',
  asCode = true
}: Props) {
  const [copied, setCopied] = useState(false);
  const lineCount = value.split('\n').length;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      console.error('Failed to copy:', e);
    }
  };

  const handleDownload = () => {
    const extensions: Record<string, string> = {
      json: 'json', javascript: 'js', typescript: 'ts', html: 'html',
      css: 'css', sql: 'sql', xml: 'xml', yaml: 'yml', markdown: 'md'
    };
    const ext = extensions[language] || 'txt';
    const blob = new Blob([value], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename || `output.${ext}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!value) return null;

  return (
    <div className={clsx('flex flex-col', className)}>
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <label className="label">{label}</label>
        <div className="flex items-center gap-1">
          <button 
            onClick={handleCopy} 
            className="btn-icon p-1.5 relative" 
            title={copied ? 'Copied!' : 'Copy'}
            aria-label={copied ? 'Copied!' : 'Copy'}
          >
            {copied ? (
              <>
                <Check size={16} className="text-green-500 animate-fade-in" />
                <span className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 rounded text-xs whitespace-nowrap animate-fade-in" 
                  style={{ backgroundColor: 'var(--bg-elevated)', color: 'var(--text-primary)', border: '1px solid var(--border-primary)' }}>
                  Copied!
                </span>
              </>
            ) : (
              <Copy size={16} />
            )}
          </button>
          <button onClick={handleDownload} className="btn-icon p-1.5" title="Download">
            <Download size={16} />
          </button>
        </div>
      </div>

      {/* Output Area */}
      <div 
        className="relative rounded-xl border overflow-hidden animate-fade-in-scale"
        style={{ 
          backgroundColor: 'var(--syntax-bg)',
          transformOrigin: 'top'
        }}
      >
        {showLineNumbers && (
          <div 
            className="absolute left-0 top-0 bottom-0 w-12 flex flex-col items-end pr-3 pt-4 text-xs font-mono select-none"
            style={{ 
              color: 'var(--text-muted)', 
              backgroundColor: 'var(--bg-tertiary)',
              borderRight: '1px solid var(--border-primary)'
            }}
          >
            {Array.from({ length: lineCount }, (_, i) => (
              <span key={i} className="leading-6">{i + 1}</span>
            ))}
          </div>
        )}
        
        <pre 
          className={clsx(
            'p-4 overflow-auto font-mono text-sm leading-6',
            showLineNumbers && 'pl-14'
          )}
          style={{ 
            maxHeight, 
            color: 'var(--syntax-text)'
          }}
        >
          <code>{value}</code>
        </pre>
      </div>

      {/* Footer Info */}
      <div className="flex items-center justify-between mt-2 text-xs" style={{ color: 'var(--text-muted)' }}>
        <span>{lineCount} lines • {value.length} characters</span>
        <span className="uppercase">{language}</span>
      </div>
    </div>
  );
}


