import { useState, useCallback, useEffect } from 'react';
import OutputPanel from '@/components/common/OutputPanel';
import ToolShell from './ToolShell';
import { useToast } from '@/hooks/useToast';

export default function MarkdownTable() {
  const [rows, setRows] = useState(3);
  const [cols, setCols] = useState(3);
  const [data, setData] = useState<string[][]>([]);
  const [output, setOutput] = useState('');

  const initializeData = useCallback(() => {
    const newData: string[][] = [];
    for (let i = 0; i < rows; i++) {
      newData.push(Array(cols).fill(''));
    }
    setData(newData);
  }, [rows, cols]);

  useEffect(() => {
    initializeData();
  }, [initializeData]);

  const generate = useCallback(() => {
    if (data.length === 0) return;

    const lines: string[] = [];
    
    // Header row
    lines.push('| ' + data[0].map(() => 'Header').join(' | ') + ' |');
    lines.push('| ' + data[0].map(() => '---').join(' | ') + ' |');
    
    // Data rows
    for (let i = 1; i < data.length; i++) {
      lines.push('| ' + data[i].map(cell => cell || ' ').join(' | ') + ' |');
    }
    
    setOutput(lines.join('\n'));
  }, [data]);

  const controls = null;

  return (
    <ToolShell className="space-y-6" controls={controls}>
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2">
          <label className="label-inline">Rows:</label>
          <input
            type="number"
            value={rows}
            onChange={(e) => { setRows(Math.max(1, parseInt(e.target.value) || 1)); initializeData(); }}
            min="1"
            max="20"
            className="input-base w-20"
          />
        </div>
        <div className="flex items-center gap-2">
          <label className="label-inline">Columns:</label>
          <input
            type="number"
            value={cols}
            onChange={(e) => { setCols(Math.max(1, parseInt(e.target.value) || 1)); initializeData(); }}
            min="1"
            max="10"
            className="input-base w-20"
          />
        </div>
        <button onClick={generate} className="btn-primary">
          Generate Table
        </button>
      </div>

      {data.length > 0 && (
        <div>
          <label className="label">Table Data</label>
          <div className="space-y-2">
            {data.map((row, i) => (
              <div key={i} className="flex gap-2">
                {row.map((cell, j) => (
                  <input
                    key={j}
                    type="text"
                    value={cell}
                    onChange={(e) => {
                      const newData = [...data];
                      newData[i][j] = e.target.value;
                      setData(newData);
                    }}
                    placeholder={`Cell ${i+1},${j+1}`}
                    className="input-base flex-1"
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
      )}

      {output && (
        <OutputPanel
          value={output}
          label="Markdown Table"
          language="markdown"
        />
      )}
    </ToolShell>
  );
}

