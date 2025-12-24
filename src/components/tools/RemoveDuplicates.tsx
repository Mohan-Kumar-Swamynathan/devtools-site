import { useState, useCallback } from 'react';
import CodeEditor from '@/components/common/CodeEditor';
import OutputPanel from '@/components/common/OutputPanel';
import ToolShell from './ToolShell';
import { useToast } from '@/hooks/useToast';

export default function RemoveDuplicates() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [caseSensitive, setCaseSensitive] = useState(false);

  const remove = useCallback(() => {
    const lines = input.split('\n');
    const seen = new Set<string>();
    const unique: string[] = [];

    for (const line of lines) {
      const key = caseSensitive ? line : line.toLowerCase();
      if (!seen.has(key)) {
        seen.add(key);
        unique.push(line);
      }
    }

    setOutput(unique.join('\n'));
  }, [input, caseSensitive]);

  const controls = null;

  return (
    <ToolShell className="space-y-6" controls={controls}>
      <CodeEditor
        value={input}
        onChange={setInput}
        language="text"
        label="Text Input (one line per item)"
        placeholder="apple\nbanana\napple\ncherry\nbanana"
      />

      <div className="flex flex-wrap items-center gap-4">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={caseSensitive}
            onChange={(e) => setCaseSensitive(e.target.checked)}
            className="checkbox"
          />
          <span>Case sensitive</span>
        </label>
        <button onClick={remove} disabled={!input} className="btn-primary">
          Remove Duplicates
        </button>
        <button onClick={() => { setInput(''); setOutput(''); }} className="btn-ghost">
          Clear
        </button>
      </div>

      {output && (
        <OutputPanel
          value={output}
          label="Unique Lines"
          language="text"
        />
      )}
    </ToolShell>
  );
}

