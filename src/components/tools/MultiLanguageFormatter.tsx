import { useState, useCallback } from 'react';
import { Copy, Download, RotateCcw } from 'lucide-react';
import { useToast } from '@/hooks/useToast';

export default function MultiLanguageFormatter() {
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('json');
  const [formatted, setFormatted] = useState('');
  const { showToast } = useToast();

  const formatCode = useCallback((text: string, lang: string) => {
    try {
      if (lang === 'json') {
        const parsed = JSON.parse(text);
        return JSON.stringify(parsed, null, 2);
      } else if (lang === 'xml' || lang === 'html') {
        return text;
      } else {
        return text;
      }
    } catch (e) {
      throw new Error('Invalid code format');
    }
  }, []);

  const handleFormat = useCallback(() => {
    if (!code.trim()) {
      showToast('Please enter code', 'error');
      return;
    }
    try {
      const formattedCode = formatCode(code, language);
      setFormatted(formattedCode);
      showToast('Code formatted!', 'success');
    } catch (e) {
      showToast('Failed to format code', 'error');
    }
  }, [code, language, formatCode, showToast]);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(formatted).then(() => {
      showToast('Copied to clipboard!', 'success');
    });
  }, [formatted, showToast]);

  const handleDownload = useCallback(() => {
    const ext = language === 'json' ? 'json' : language === 'xml' ? 'xml' : 'txt';
    const blob = new Blob([formatted], { type: 'text/plain' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `formatted.${ext}`;
    link.click();
    URL.revokeObjectURL(link.href);
  }, [formatted, language]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-3">
        <button
          onClick={handleFormat}
          className="btn-primary"
        >
          Format Code
        </button>
        {formatted && (
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
            setCode('');
            setFormatted('');
          }}
          className="btn-ghost flex items-center gap-2"
        >
          <RotateCcw size={18} />
          Clear
        </button>
      </div>

      <div>
        <label className="label">Language</label>
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className="input w-full mb-4"
        >
          <option value="json">JSON</option>
          <option value="xml">XML</option>
          <option value="html">HTML</option>
        </select>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
            Original Code
          </h3>
          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="input w-full h-96 font-mono text-sm"
            placeholder="Paste your code here..."
          />
        </div>
        <div className="space-y-4">
          <h3 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
            Formatted Code
          </h3>
          <textarea
            value={formatted}
            readOnly
            className="input w-full h-96 font-mono text-sm"
            placeholder="Formatted code will appear here..."
          />
        </div>
      </div>
    </div>
  );
}

