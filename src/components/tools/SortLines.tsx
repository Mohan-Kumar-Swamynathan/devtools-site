import { useState, useCallback } from 'react';
import CodeEditor from '@/components/common/CodeEditor';
import OutputPanel from '@/components/common/OutputPanel';
import ToolShell from './ToolShell';
import { useToast } from '@/hooks/useToast';

export default function SortLines() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [order, setOrder] = useState<'asc' | 'desc'>('asc');
  const [caseSensitive, setCaseSensitive] = useState(false);

  const sort = useCallback(() => {
    const lines = input.split('\n');
    const sorted = [...lines].sort((a, b) => {
      const aVal = caseSensitive ? a : a.toLowerCase();
      const bVal = caseSensitive ? b : b.toLowerCase();
      const comparison = aVal.localeCompare(bVal);
      return order === 'asc' ? comparison : -comparison;
    });
    setOutput(sorted.join('\n'));
  }, [input, order, caseSensitive]);

  const controls = null;

  return (
    <ToolShell className="space-y-6" controls={controls}>
      <CodeEditor
        value={input}
        onChange={setInput}
        language="text"
        label="Text Input (one line per item)"
        placeholder="banana\napple\ncherry"
      />

      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2">
          <label className="label-inline">Order:</label>
          <select value={order} onChange={(e) => { setOrder(e.target.value as any); sort(); }} className="input-base">
            <option value="asc">Ascending</option>
            <option value="desc">Descending</option>
          </select>
        </div>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={caseSensitive}
            onChange={(e) => { setCaseSensitive(e.target.checked); sort(); }}
            className="checkbox"
          />
          <span>Case sensitive</span>
        </label>
        <button onClick={sort} disabled={!input} className="btn-primary">
          Sort
        </button>
        <button onClick={() => { setInput(''); setOutput(''); }} className="btn-ghost">
          Clear
        </button>
      </div>

      {output && (
        <OutputPanel
          value={output}
          label="Sorted Lines"
          language="text"
        />
      )}
    </ToolShell>
  );
}

