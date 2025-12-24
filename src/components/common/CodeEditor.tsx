import { useState, useRef, useEffect } from 'react';
import { Copy, Check, Download, Upload, Trash2, Maximize2, Minimize2 } from 'lucide-react';
import { Highlight } from 'prism-react-renderer';
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
  minHeight?: string;
  className?: string;
}

// Languages that support syntax highlighting
const SUPPORTED_LANGUAGES = ['json', 'javascript', 'typescript', 'jsx', 'tsx', 'html', 'css', 'sql', 'xml', 'yaml', 'markdown', 'python', 'java', 'c', 'cpp', 'csharp', 'php', 'ruby', 'go', 'rust', 'swift', 'kotlin', 'scala', 'bash', 'shell', 'powershell', 'graphql'];

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
  minHeight,
  className = ''
}: Props) {
  const [copied, setCopied] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const lineCount = value.split('\n').length;
  const shouldHighlight = language !== 'text' && SUPPORTED_LANGUAGES.includes(language.toLowerCase());

  // Map language names to prism language identifiers
  const getPrismLanguage = (lang: string): string => {
    const langMap: Record<string, string> = {
      'javascript': 'javascript',
      'typescript': 'typescript',
      'jsx': 'jsx',
      'tsx': 'tsx',
      'json': 'json',
      'html': 'markup',
      'css': 'css',
      'sql': 'sql',
      'xml': 'markup',
      'yaml': 'yaml',
      'markdown': 'markdown',
      'python': 'python',
      'java': 'java',
      'c': 'c',
      'cpp': 'cpp',
      'csharp': 'csharp',
      'php': 'php',
      'ruby': 'ruby',
      'go': 'go',
      'rust': 'rust',
      'swift': 'swift',
      'kotlin': 'kotlin',
      'scala': 'scala',
      'bash': 'bash',
      'shell': 'bash',
      'powershell': 'powershell',
      'graphql': 'graphql'
    };
    return langMap[lang.toLowerCase()] || lang.toLowerCase();
  };

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

  // Sync textarea scroll with highlight container
  useEffect(() => {
    if (!shouldHighlight || !textareaRef.current || !containerRef.current) return;

    const textarea = textareaRef.current;
    const container = containerRef.current;

    const handleTextareaScroll = () => {
      container.scrollTop = textarea.scrollTop;
      container.scrollLeft = textarea.scrollLeft;
    };

    textarea.addEventListener('scroll', handleTextareaScroll);

    return () => {
      textarea.removeEventListener('scroll', handleTextareaScroll);
    };
  }, [shouldHighlight]);

  const theme = {
    plain: {
      color: 'var(--text-primary)',
      backgroundColor: 'transparent',
    },
    styles: [
      {
        types: ['comment', 'prolog', 'doctype', 'cdata'],
        style: { color: 'var(--syntax-comment)', fontStyle: 'italic' as const }
      },
      {
        types: ['punctuation'],
        style: { color: 'var(--syntax-punctuation)' }
      },
      {
        types: ['property', 'tag', 'boolean', 'number', 'constant', 'symbol'],
        style: { color: 'var(--syntax-number)' }
      },
      {
        types: ['selector', 'attr-name', 'string', 'char', 'builtin'],
        style: { color: 'var(--syntax-string)' }
      },
      {
        types: ['operator', 'entity', 'url'],
        style: { color: 'var(--syntax-operator)' }
      },
      {
        types: ['atrule', 'attr-value', 'keyword'],
        style: { color: 'var(--syntax-keyword)' }
      },
      {
        types: ['function', 'class-name'],
        style: { color: 'var(--syntax-function)' }
      },
      {
        types: ['regex', 'important', 'variable'],
        style: { color: 'var(--syntax-variable)' }
      }
    ]
  };

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
              <button
                onClick={handleCopy}
                className="btn-icon p-1.5 relative"
                title={copied ? 'Copied!' : 'Copy'}
                aria-label={copied ? 'Copied!' : 'Copy'}
              >
                {copied ? (
                  <>
                    <Check size={16} className="animate-fade-in" style={{ color: 'var(--color-success)' }} />
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
      <div
        ref={containerRef}
        className={clsx(
          'relative rounded-xl border overflow-auto animate-fade-in',
          showLineNumbers && 'pl-14'
        )}
        style={{
          backgroundColor: 'var(--bg-primary)',
          borderColor: 'var(--border-primary)',
          maxHeight: isExpanded ? 'none' : maxHeight,
          minHeight: '200px'
        }}
      >
        {showLineNumbers && (
          <div
            className="absolute left-0 top-0 bottom-0 w-12 flex flex-col items-end pr-3 pt-4 text-xs font-mono select-none overflow-hidden animate-slide-in-left z-10"
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

        {shouldHighlight ? (
          <div className="relative w-full" style={{ minHeight: '200px' }}>
            <Highlight
              code={value}
              language={getPrismLanguage(language)}
              theme={theme}
            >
              {({ className, style, tokens, getLineProps, getTokenProps }) => (
                <pre
                  className={className}
                  style={{
                    ...style,
                    margin: 0,
                    padding: '1rem',
                    fontFamily: 'JetBrains Mono, monospace',
                    fontSize: '0.875rem',
                    lineHeight: '1.75',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    overflow: 'hidden',
                    pointerEvents: 'none',
                    zIndex: 0
                  }}
                >
                  <code style={{ display: 'block' }}>
                    {tokens.map((line, i) => (
                      <div key={i} {...getLineProps({ line })}>
                        {line.map((token, key) => (
                          <span key={key} {...getTokenProps({ token })} />
                        ))}
                      </div>
                    ))}
                  </code>
                </pre>
              )}
            </Highlight>
            <textarea
              ref={textareaRef}
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder={placeholder}
              readOnly={readOnly}
              rows={rows}
              spellCheck={false}
              className="relative w-full p-4 font-mono text-sm leading-relaxed resize-none bg-transparent caret-current outline-none"
              style={{
                color: 'transparent',
                caretColor: 'var(--text-primary)',
                zIndex: 1,
                fontFamily: 'JetBrains Mono, monospace',
                fontSize: '0.875rem',
                lineHeight: '1.75',
                minHeight: '200px',
                height: '100%',
              }}
            />
          </div>
        ) : (
          <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            readOnly={readOnly}
            rows={rows}
            spellCheck={false}
            className={clsx(
              'input-base font-mono w-full p-4 transition-all duration-200',
              isExpanded && 'h-[80vh]'
            )}
            style={{
              maxHeight: isExpanded ? 'none' : maxHeight,
              minHeight: minHeight || '200px'
            }}
          />
        )}
      </div>

      {/* Footer Info */}
      <div className="flex items-center justify-between mt-2 text-xs" style={{ color: 'var(--text-muted)' }}>
        <span>{lineCount} lines • {value.length} characters</span>
        <span className="uppercase">{language}</span>
      </div>
    </div>
  );
}
