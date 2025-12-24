import { useState, useCallback } from 'react';
import CodeEditor from '@/components/common/CodeEditor';
import OutputPanel from '@/components/common/OutputPanel';
import ToolShell from './ToolShell';
import { useToast } from '@/hooks/useToast';

export default function TextExtractor() {
  const [input, setInput] = useState('');
  const [pattern, setPattern] = useState('');
  const [output, setOutput] = useState('');
  const [useRegex, setUseRegex] = useState(true);

  const extract = useCallback(() => {
    try {
      if (!pattern) {
        setOutput('');
        return;
      }

      let matches: string[] = [];
      if (useRegex) {
        const regex = new RegExp(pattern, 'g');
        const found = input.match(regex);
        matches = found || [];
      } else {
        const index = input.indexOf(pattern);
        if (index !== -1) {
          matches = [pattern];
        }
      }

      setOutput(matches.join('\n'));
    } catch (e) {
      setOutput(`Error: ${(e as Error).message}`);
    }
  }, [input, pattern, useRegex]);

  const controls = null;

  return (
    <ToolShell className="space-y-6" controls={controls}>
      <CodeEditor
        value={input}
        onChange={setInput}
        language="text"
        label="Text Input"
        placeholder="Hello World 123 Test 456"
      />

      <div>
        <label className="label">Pattern</label>
        <input
          type="text"
          value={pattern}
          onChange={(e) => { setPattern(e.target.value); extract(); }}
          placeholder={useRegex ? '\\d+' : 'search text'}
          className="input-base font-mono"
        />
      </div>

      <label className="flex items-center gap-2 cursor-pointer">
        <input
          type="checkbox"
          checked={useRegex}
          onChange={(e) => { setUseRegex(e.target.checked); extract(); }}
          className="checkbox"
        />
        <span>Use Regular Expression</span>
      </label>

      {output && (
        <OutputPanel
          value={output}
          label="Extracted Matches"
          language="text"
        />
      )}
    </ToolShell>
  );
}

