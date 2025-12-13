import { useState, useCallback } from 'react';
import CodeEditor from '@/components/common/CodeEditor';
import OutputPanel from '@/components/common/OutputPanel';

export default function CodeIndentationFixer() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [indent, setIndent] = useState(2);
  const [indentType, setIndentType] = useState<'spaces' | 'tabs'>('spaces');

  const fix = useCallback(() => {
    const lines = input.split('\n');
    const indentChar = indentType === 'spaces' ? ' '.repeat(indent) : '\t';
    let indentLevel = 0;
    const fixed: string[] = [];

    lines.forEach(line => {
      const trimmed = line.trim();
      if (!trimmed) {
        fixed.push('');
        return;
      }

      // Decrease indent for closing braces/brackets
      if (trimmed.match(/^[}\]\)]/)) {
        indentLevel = Math.max(0, indentLevel - 1);
      }

      fixed.push(indentChar.repeat(indentLevel) + trimmed);

      // Increase indent for opening braces/brackets
      if (trimmed.match(/[{\[\(]$/)) {
        indentLevel++;
      }
    });

    setOutput(fixed.join('\n'));
  }, [input, indent, indentType]);

  return (
    <div className="space-y-6">
      <CodeEditor
        value={input}
        onChange={setInput}
        language="javascript"
        label="Code with Inconsistent Indentation"
        placeholder="function test(){
if(true){
return 'hello';
}
}"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="label">Indent Size</label>
          <input
            type="number"
            min="1"
            max="8"
            value={indent}
            onChange={(e) => { setIndent(parseInt(e.target.value) || 2); fix(); }}
            className="input-base"
          />
        </div>
        <div>
          <label className="label">Indent Type</label>
          <select value={indentType} onChange={(e) => { setIndentType(e.target.value as any); fix(); }} className="input-base">
            <option value="spaces">Spaces</option>
            <option value="tabs">Tabs</option>
          </select>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <button onClick={fix} disabled={!input} className="btn-primary">
          Fix Indentation
        </button>
        <button onClick={() => { setInput(''); setOutput(''); }} className="btn-ghost">
          Clear
        </button>
      </div>

      {output && (
        <OutputPanel
          value={output}
          label="Fixed Code"
          language="javascript"
          showLineNumbers
        />
      )}
    </div>
  );
}

