import { useState, useRef, useEffect } from 'react';
import { Copy, Check, Download, Upload, Trash2, Maximize2, Minimize2 } from 'lucide-react';
import clsx from 'clsx';

interface Props {
  value: string;
  onChange: (value: string) => void;
  language?: string;
  placeholder?: string;
  label?: string;
  readOnly?: boolean;
  rows?: number;
  showLineNumbers?: boolean;
  showToolbar?: boolean;
  maxHeight?: string;
  className?: string;
}

export default function CodeEditor({
  value,
  onChange,
  language = 'text',
  placeholder = 'Paste your code here...',
  label,
  readOnly = false,
  rows = 12,
  showLineNumbers = false,
  showToolbar = true,
  maxHeight = '500px',
  className = ''
}: Props) {
  const [copied, setCopied] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const lineCount = value.split('\n').length;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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
    a.download = `output.${ext}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      onChange(e.target?.result as string);
    };
    reader.readAsText(file);
  };

  const handlePaste = async () => {
    const text = await navigator.clipboard.readText();
    onChange(text);
  };

  const handleClear = () => {
    onChange('');
    textareaRef.current?.focus();
  };

  // Auto-resize
  useEffect(() => {
    if (textareaRef.current && !isExpanded) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, parseInt(maxHeight))}px`;
    }
  }, [value, maxHeight, isExpanded]);

  return (
    <div className={clsx('flex flex-col', className)}>
      {/* Header */}
      {(label || showToolbar) && (
        <div className="flex items-center justify-between mb-2">
          {label && <label className="label">{label}</label>}
          
          {showToolbar && (
            <div className="flex items-center gap-1">
              {!readOnly && (
                <>
                  <button onClick={handlePaste} className="btn-icon p-1.5" title="Paste">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  </button>
                  <button onClick={() => fileInputRef.current?.click()} className="btn-icon p-1.5" title="Upload file">
                    <Upload size={16} />
                  </button>
                  <input ref={fileInputRef} type="file" className="hidden" onChange={handleFileUpload} accept=".txt,.json,.js,.ts,.html,.css,.sql,.xml,.yaml,.yml,.md" />
                </>
              )}
              <button onClick={handleCopy} className="btn-icon p-1.5" title={copied ? 'Copied!' : 'Copy'}>
                {copied ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}
              </button>
              <button onClick={handleDownload} className="btn-icon p-1.5" title="Download">
                <Download size={16} />
              </button>
              {!readOnly && (
                <button onClick={handleClear} className="btn-icon p-1.5" title="Clear">
                  <Trash2 size={16} />
                </button>
              )}
              <button onClick={() => setIsExpanded(!isExpanded)} className="btn-icon p-1.5" title={isExpanded ? 'Collapse' : 'Expand'}>
                {isExpanded ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
              </button>
            </div>
          )}
        </div>
      )}

      {/* Editor */}
      <div className="relative">
        {showLineNumbers && (
          <div 
            className="absolute left-0 top-0 bottom-0 w-12 flex flex-col items-end pr-3 pt-4 text-xs font-mono select-none overflow-hidden"
            style={{ 
              color: 'var(--text-muted)', 
              backgroundColor: 'var(--bg-tertiary)',
              borderRight: '1px solid var(--border-primary)',
              borderRadius: '0.75rem 0 0 0.75rem'
            }}
          >
            {Array.from({ length: lineCount }, (_, i) => (
              <span key={i} className="leading-6">{i + 1}</span>
            ))}
          </div>
        )}
        
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          readOnly={readOnly}
          rows={rows}
          spellCheck={false}
          className={clsx(
            'code-editor w-full',
            showLineNumbers && 'pl-14',
            isExpanded && 'h-[80vh]'
          )}
          style={{ 
            maxHeight: isExpanded ? 'none' : maxHeight,
            minHeight: '200px'
          }}
        />
      </div>

      {/* Footer Info */}
      <div className="flex items-center justify-between mt-2 text-xs" style={{ color: 'var(--text-muted)' }}>
        <span>{lineCount} lines • {value.length} characters</span>
        <span className="uppercase">{language}</span>
      </div>
    </div>
  );
}


