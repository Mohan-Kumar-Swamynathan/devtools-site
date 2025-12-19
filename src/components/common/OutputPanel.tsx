import { useState } from 'react';
import { Copy, Check, Download } from 'lucide-react';
import { Highlight } from 'prism-react-renderer';
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

// Languages that support syntax highlighting
const SUPPORTED_LANGUAGES = ['json', 'javascript', 'typescript', 'jsx', 'tsx', 'html', 'css', 'sql', 'xml', 'yaml', 'markdown', 'python', 'java', 'c', 'cpp', 'csharp', 'php', 'ruby', 'go', 'rust', 'swift', 'kotlin', 'scala', 'bash', 'shell', 'powershell', 'graphql'];

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
    a.download = filename || `output.${ext}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!value) return null;

  const theme = {
    plain: {
      color: 'var(--syntax-text)',
      backgroundColor: 'var(--syntax-bg)',
    },
    styles: [
      {
        types: ['comment', 'prolog', 'doctype', 'cdata'],
        style: { color: 'var(--syntax-comment)', fontStyle: 'italic' }
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
        className={clsx(
          'relative rounded-xl border overflow-hidden animate-fade-in-scale',
          showLineNumbers && 'pl-14'
        )}
        style={{ 
          backgroundColor: 'var(--syntax-bg)',
          borderColor: 'var(--border-primary)',
          transformOrigin: 'top'
        }}
      >
        {showLineNumbers && (
          <div 
            className="absolute left-0 top-0 bottom-0 w-12 flex flex-col items-end pr-3 pt-4 text-xs font-mono select-none z-10"
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
        
        {shouldHighlight ? (
          <div className="overflow-auto" style={{ maxHeight }}>
            <Highlight
              code={value}
              language={getPrismLanguage(language)}
              theme={theme}
            >
              {({ className, style, tokens, getLineProps, getTokenProps }) => (
                <pre 
                  className={clsx(className, 'p-4 m-0 font-mono text-sm leading-6')}
                  style={{ 
                    ...style, 
                    margin: 0,
                    fontFamily: 'JetBrains Mono, monospace',
                    fontSize: '0.875rem',
                    lineHeight: '1.75'
                  }}
                >
                  <code>
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
          </div>
        ) : (
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
