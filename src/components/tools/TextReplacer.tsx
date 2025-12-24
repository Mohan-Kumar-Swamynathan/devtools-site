import { useState, useCallback } from 'react';
import CodeEditor from '@/components/common/CodeEditor';
import OutputPanel from '@/components/common/OutputPanel';
import ToolShell from './ToolShell';
import { useToast } from '@/hooks/useToast';

export default function TextReplacer() {
  const [input, setInput] = useState('');
  const [find, setFind] = useState('');
  const [replace, setReplace] = useState('');
  const [useRegex, setUseRegex] = useState(false);
  const [output, setOutput] = useState('');

  const replaceText = useCallback(() => {
    try {
      if (!find) {
        setOutput(input);
        return;
      }

      let result;
      if (useRegex) {
        const regex = new RegExp(find, 'g');
        result = input.replace(regex, replace);
      } else {
        result = input.split(find).join(replace);
      }
      setOutput(result);
    } catch (e) {
      setOutput(`Error: ${(e as Error).message}`);
    }
  }, [input, find, replace, useRegex]);

  const controls = null;

  return (
    <ToolShell className="space-y-6" controls={controls}>
      <CodeEditor
        value={input}
        onChange={setInput}
        language="text"
        label="Text Input"
        placeholder="Hello World"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="label">Find</label>
          <input
            type="text"
            value={find}
            onChange={(e) => { setFind(e.target.value); replaceText(); }}
            placeholder="Search text"
            className="input-base font-mono"
          />
        </div>
        <div>
          <label className="label">Replace With</label>
          <input
            type="text"
            value={replace}
            onChange={(e) => { setReplace(e.target.value); replaceText(); }}
            placeholder="Replacement text"
            className="input-base font-mono"
          />
        </div>
      </div>

      <label className="flex items-center gap-2 cursor-pointer">
        <input
          type="checkbox"
          checked={useRegex}
          onChange={(e) => { setUseRegex(e.target.checked); replaceText(); }}
          className="checkbox"
        />
        <span>Use Regular Expression</span>
      </label>

      {output && (
        <OutputPanel
          value={output}
          label="Replaced Text"
          language="text"
        />
      )}
    </ToolShell>
  );
}

