import { useState, useCallback } from 'react';
import CodeEditor from '@/components/common/CodeEditor';
import OutputPanel from '@/components/common/OutputPanel';

export default function CodeCommentGenerator() {
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState<'javascript' | 'python' | 'java' | 'c'>('javascript');
  const [style, setStyle] = useState<'jsdoc' | 'inline' | 'block'>('jsdoc');
  const [output, setOutput] = useState('');

  const generate = useCallback(() => {
    const lines = code.split('\n');
    const commented: string[] = [];

    lines.forEach((line, index) => {
      const trimmed = line.trim();
      
      if (trimmed && !trimmed.startsWith('//') && !trimmed.startsWith('#')) {
        if (style === 'jsdoc' && language === 'javascript' && trimmed.includes('function')) {
          const funcMatch = trimmed.match(/function\s+(\w+)\s*\(([^)]*)\)/);
          if (funcMatch) {
            commented.push('/**');
            commented.push(` * ${funcMatch[1]}`);
            commented.push(' *');
            if (funcMatch[2]) {
              funcMatch[2].split(',').forEach(param => {
                commented.push(` * @param {string} ${param.trim()} - Parameter description`);
              });
            }
            commented.push(' * @returns {void} - Return description');
            commented.push(' */');
          }
        } else if (style === 'inline') {
          if (language === 'javascript' || language === 'java' || language === 'c') {
            commented.push(`${line} // TODO: Add comment`);
          } else if (language === 'python') {
            commented.push(`${line}  # TODO: Add comment`);
          }
        } else if (style === 'block') {
          if (language === 'javascript' || language === 'java' || language === 'c') {
            commented.push('/*');
            commented.push(` * ${trimmed}`);
            commented.push(' */');
          } else if (language === 'python') {
            commented.push('"""');
            commented.push(trimmed);
            commented.push('"""');
          }
        }
      }
      
      commented.push(line);
    });

    setOutput(commented.join('\n'));
  }, [code, language, style]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="label">Language</label>
          <select value={language} onChange={(e) => setLanguage(e.target.value as any)} className="input-base">
            <option value="javascript">JavaScript</option>
            <option value="python">Python</option>
            <option value="java">Java</option>
            <option value="c">C/C++</option>
          </select>
        </div>
        <div>
          <label className="label">Comment Style</label>
          <select value={style} onChange={(e) => setStyle(e.target.value as any)} className="input-base">
            <option value="jsdoc">JSDoc</option>
            <option value="inline">Inline</option>
            <option value="block">Block</option>
          </select>
        </div>
      </div>

      <CodeEditor
        value={code}
        onChange={setCode}
        language={language}
        label="Code Input"
        placeholder={language === 'javascript' ? 'function example() {\n  return "hello";\n}' : 'def example():\n    return "hello"'}
      />

      <div className="flex flex-wrap items-center gap-3">
        <button onClick={generate} disabled={!code} className="btn-primary">
          Generate Comments
        </button>
        <button onClick={() => { setCode(''); setOutput(''); }} className="btn-ghost">
          Clear
        </button>
      </div>

      {output && (
        <OutputPanel
          value={output}
          label="Code with Comments"
          language={language}
          showLineNumbers
        />
      )}
    </div>
  );
}

