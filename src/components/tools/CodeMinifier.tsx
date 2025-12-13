import { useState, useCallback } from 'react';
import CodeEditor from '@/components/common/CodeEditor';
import OutputPanel from '@/components/common/OutputPanel';
import ErrorMessage from '@/components/common/ErrorMessage';

type CodeType = 'html' | 'css' | 'javascript';

export default function CodeMinifier() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [codeType, setCodeType] = useState<CodeType>('html');
  const [error, setError] = useState('');

  const minifyHTML = useCallback((html: string): string => {
    return html
      .replace(/<!--[\s\S]*?-->/g, '') // Remove comments
      .replace(/\s+/g, ' ') // Collapse whitespace
      .replace(/>\s+</g, '><') // Remove spaces between tags
      .replace(/\s+>/g, '>') // Remove spaces before closing tags
      .replace(/<\s+/g, '<') // Remove spaces after opening tags
      .trim();
  }, []);

  const minifyCSS = useCallback((css: string): string => {
    return css
      .replace(/\/\*[\s\S]*?\*\//g, '') // Remove comments
      .replace(/\s+/g, ' ') // Collapse whitespace
      .replace(/\s*{\s*/g, '{') // Remove spaces around braces
      .replace(/;\s*/g, ';') // Remove spaces after semicolons
      .replace(/\s*}\s*/g, '}') // Remove spaces around closing braces
      .replace(/\s*:\s*/g, ':') // Remove spaces around colons
      .replace(/\s*,\s*/g, ',') // Remove spaces around commas
      .replace(/;\s*}/g, '}') // Remove semicolon before closing brace
      .trim();
  }, []);

  const minifyJS = useCallback((js: string): string => {
    // Basic JavaScript minification
    let minified = js
      .replace(/\/\*[\s\S]*?\*\//g, '') // Remove block comments
      .replace(/\/\/.*$/gm, '') // Remove line comments
      .replace(/\s+/g, ' ') // Collapse whitespace
      .replace(/\s*{\s*/g, '{')
      .replace(/\s*}\s*/g, '}')
      .replace(/\s*\(\s*/g, '(')
      .replace(/\s*\)\s*/g, ')')
      .replace(/\s*\[\s*/g, '[')
      .replace(/\s*\]\s*/g, ']')
      .replace(/\s*;\s*/g, ';')
      .replace(/\s*,\s*/g, ',')
      .replace(/\s*:\s*/g, ':')
      .replace(/\s*\+\s*/g, '+')
      .replace(/\s*-\s*/g, '-')
      .replace(/\s*\*\s*/g, '*')
      .replace(/\s*\/\s*/g, '/')
      .replace(/\s*=\s*/g, '=')
      .replace(/\s*==\s*/g, '==')
      .replace(/\s*===\s*/g, '===')
      .replace(/\s*!=\s*/g, '!=')
      .replace(/\s*!==\s*/g, '!==')
      .replace(/\s*&&\s*/g, '&&')
      .replace(/\s*\|\|\s*/g, '||')
      .replace(/\s*>\s*/g, '>')
      .replace(/\s*<\s*/g, '<')
      .replace(/\s*>=\s*/g, '>=')
      .replace(/\s*<=\s*/g, '<=')
      .trim();

    // Remove semicolons before closing braces
    minified = minified.replace(/;\s*}/g, '}');
    
    return minified;
  }, []);

  const minify = useCallback(() => {
    setError('');
    if (!input.trim()) {
      setError('Please enter code to minify');
      return;
    }

    try {
      let result = '';
      switch (codeType) {
        case 'html':
          result = minifyHTML(input);
          break;
        case 'css':
          result = minifyCSS(input);
          break;
        case 'javascript':
          result = minifyJS(input);
          break;
      }
      setOutput(result);
    } catch (e) {
      setError(`Minification error: ${(e as Error).message}`);
      setOutput('');
    }
  }, [input, codeType, minifyHTML, minifyCSS, minifyJS]);

  const getCompressionRatio = () => {
    if (!input || !output) return 0;
    return ((1 - output.length / input.length) * 100).toFixed(1);
  };

  return (
    <div className="space-y-6">
      {error && <ErrorMessage message={error} onDismiss={() => setError('')} />}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="label">Code Type</label>
          <select
            value={codeType}
            onChange={(e) => {
              setCodeType(e.target.value as CodeType);
              setInput('');
              setOutput('');
            }}
            className="input-base"
          >
            <option value="html">HTML</option>
            <option value="css">CSS</option>
            <option value="javascript">JavaScript</option>
          </select>
        </div>
        <div className="flex items-end">
          <button onClick={minify} disabled={!input.trim()} className="btn-primary w-full">
            Minify Code
          </button>
        </div>
      </div>

      <CodeEditor
        value={input}
        onChange={setInput}
        language={codeType}
        label={`${codeType.toUpperCase()} Code`}
        placeholder={`Paste your ${codeType.toUpperCase()} code here...`}
      />

      {output && (
        <>
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm" style={{ color: 'var(--text-muted)' }}>
              Original: {input.length} chars → Minified: {output.length} chars
              {input.length > 0 && (
                <span className="ml-2 font-semibold" style={{ color: 'var(--status-success)' }}>
                  ({getCompressionRatio()}% smaller)
                </span>
              )}
            </div>
          </div>
          <OutputPanel
            value={output}
            label="Minified Code"
            language={codeType}
            showLineNumbers={false}
          />
        </>
      )}

      <div className="p-4 rounded-xl border text-sm" style={{ 
        backgroundColor: 'var(--bg-secondary)', 
        borderColor: 'var(--border-primary)' 
      }}>
        <h3 className="font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
          Minification Features:
        </h3>
        <ul className="space-y-1 text-xs" style={{ color: 'var(--text-muted)' }}>
          <li>• <strong>HTML:</strong> Removes comments, whitespace, and unnecessary spaces</li>
          <li>• <strong>CSS:</strong> Removes comments, whitespace, and optimizes formatting</li>
          <li>• <strong>JavaScript:</strong> Removes comments and whitespace (basic minification)</li>
          <li>• All processing happens in your browser - your code never leaves your device</li>
        </ul>
      </div>
    </div>
  );
}

