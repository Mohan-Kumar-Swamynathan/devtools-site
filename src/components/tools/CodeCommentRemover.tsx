import { useState, useCallback } from 'react';
import { Copy, Download, RotateCcw } from 'lucide-react';
import ToolShell from './ToolShell';
import { useToast } from '@/hooks/useToast';

export default function CodeCommentRemover() {
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('javascript');
  const [cleaned, setCleaned] = useState('');
  const { showToast } = useToast();

  const removeComments = useCallback((text: string, lang: string) => {
    let result = text;

    if (lang === 'javascript' || lang === 'typescript' || lang === 'java' || lang === 'c' || lang === 'cpp' || lang === 'csharp') {
      result = result.replace(/\/\*[\s\S]*?\*\//g, '');
      result = result.replace(/\/\/.*$/gm, '');
    } else if (lang === 'python') {
      result = result.replace(/#.*$/gm, '');
      result = result.replace(/""".*?"""/gs, '');
      result = result.replace(/'''.*?'''/gs, '');
    } else if (lang === 'html') {
      result = result.replace(/<!--[\s\S]*?-->/g, '');
    } else if (lang === 'css') {
      result = result.replace(/\/\*[\s\S]*?\*\//g, '');
    } else if (lang === 'sql') {
      result = result.replace(/--.*$/gm, '');
      result = result.replace(/\/\*[\s\S]*?\*\//g, '');
    }

    return result.split('\n').filter(line => line.trim()).join('\n');
  }, []);

  const handleClean = useCallback(() => {
    if (!code.trim()) {
      showToast('Please enter code', 'error');
      return;
    }
    const cleanedCode = removeComments(code, language);
    setCleaned(cleanedCode);
  }, [code, language, removeComments, showToast]);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(cleaned).then(() => {
      showToast('Copied to clipboard!', 'success');
    });
  }, [cleaned, showToast]);

  const handleDownload = useCallback(() => {
    const blob = new Blob([cleaned], { type: 'text/plain' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `cleaned.${language === 'javascript' ? 'js' : language === 'typescript' ? 'ts' : language === 'python' ? 'py' : 'txt'}`;
    link.click();
    URL.revokeObjectURL(link.href);
  }, [cleaned, language]);

  
  const controls = (
          <div className="flex items-center gap-3">
        <button
          onClick={handleClean}
          className="btn-primary"
        >
          Remove Comments
        </button>
        {cleaned && (
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
            setCleaned('');
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




































      <div>
        <label className="label">Language</label>
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className="input w-full mb-4"
        >
          <option value="javascript">JavaScript</option>
          <option value="typescript">TypeScript</option>
          <option value="python">Python</option>
          <option value="java">Java</option>
          <option value="c">C</option>
          <option value="cpp">C++</option>
          <option value="csharp">C#</option>
          <option value="html">HTML</option>
          <option value="css">CSS</option>
          <option value="sql">SQL</option>
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
            Cleaned Code
          </h3>
          <textarea
            value={cleaned}
            readOnly
            className="input w-full h-96 font-mono text-sm"
            placeholder="Cleaned code will appear here..."
          />
        </div>
      </div>
    </ToolShell>
  );
}
