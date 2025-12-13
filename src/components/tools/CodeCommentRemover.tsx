import { useState, useCallback } from 'react';
import CodeEditor from '@/components/common/CodeEditor';
import OutputPanel from '@/components/common/OutputPanel';

export default function CodeCommentRemover() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [language, setLanguage] = useState<'javascript' | 'python' | 'java' | 'css' | 'html'>('javascript');

  const remove = useCallback(() => {
    let result = input;

    if (language === 'javascript' || language === 'java') {
      // Remove single-line comments
      result = result.replace(/\/\/.*$/gm, '');
      // Remove multi-line comments
      result = result.replace(/\/\*[\s\S]*?\*\//g, '');
    } else if (language === 'python') {
      // Remove single-line comments
      result = result.replace(/#.*$/gm, '');
      // Remove docstrings (simplified)
      result = result.replace(/""".*?"""/gs, '');
      result = result.replace(/'''.*?'''/gs, '');
    } else if (language === 'css') {
      result = result.replace(/\/\*[\s\S]*?\*\//g, '');
    } else if (language === 'html') {
      result = result.replace(/<!--[\s\S]*?-->/g, '');
    }

    // Clean up multiple blank lines
    result = result.replace(/\n{3,}/g, '\n\n');
    result = result.trim();

    setOutput(result);
  }, [input, language]);

  return (
    <div className="space-y-6">
      <div>
        <label className="label">Language</label>
        <select value={language} onChange={(e) => { setLanguage(e.target.value as any); remove(); }} className="input-base">
          <option value="javascript">JavaScript</option>
          <option value="python">Python</option>
          <option value="java">Java</option>
          <option value="css">CSS</option>
          <option value="html">HTML</option>
        </select>
      </div>

      <CodeEditor
        value={input}
        onChange={(v) => { setInput(v); remove(); }}
        language={language}
        label="Code with Comments"
        placeholder="// This is a comment
function example() {
  return 'hello';
}"
      />

      <div className="flex flex-wrap items-center gap-3">
        <button onClick={remove} disabled={!input} className="btn-primary">
          Remove Comments
        </button>
        <button onClick={() => { setInput(''); setOutput(''); }} className="btn-ghost">
          Clear
        </button>
      </div>

      {output && (
        <OutputPanel
          value={output}
          label="Code without Comments"
          language={language}
          showLineNumbers
        />
      )}
    </div>
  );
}

