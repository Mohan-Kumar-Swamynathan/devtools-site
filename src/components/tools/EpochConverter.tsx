import { useState, useCallback } from 'react';
import OutputPanel from '@/components/common/OutputPanel';
import ToolShell from './ToolShell';
import { useToast } from '@/hooks/useToast';

export default function EpochConverter() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [unit, setUnit] = useState<'seconds' | 'milliseconds'>('seconds');

  const convert = useCallback(() => {
    const num = parseFloat(input);
    if (isNaN(num)) {
      setOutput('');
      return;
    }

    const timestamp = unit === 'seconds' ? num * 1000 : num;
    const date = new Date(timestamp);
    
    if (isNaN(date.getTime())) {
      setOutput('Invalid timestamp');
      return;
    }

    const formats = {
      iso: date.toISOString(),
      local: date.toLocaleString(),
      utc: date.toUTCString(),
      unix: Math.floor(date.getTime() / 1000),
      milliseconds: date.getTime(),
      year: date.getFullYear(),
      month: date.getMonth() + 1,
      day: date.getDate(),
      hour: date.getHours(),
      minute: date.getMinutes(),
      second: date.getSeconds()
    };

    const result = `ISO 8601: ${formats.iso}
Local: ${formats.local}
UTC: ${formats.utc}
Unix (seconds): ${formats.unix}
Milliseconds: ${formats.milliseconds}
Date: ${formats.year}-${String(formats.month).padStart(2, '0')}-${String(formats.day).padStart(2, '0')}
Time: ${String(formats.hour).padStart(2, '0')}:${String(formats.minute).padStart(2, '0')}:${String(formats.second).padStart(2, '0')}`;

    setOutput(result);
  }, [input, unit]);

  const convertNow = useCallback(() => {
    const now = unit === 'seconds' ? Math.floor(Date.now() / 1000) : Date.now();
    setInput(now.toString());
    convert();
  }, [unit, convert]);

  
  const controls = (
          <div className="flex items-center gap-3">
        <button onClick={convert} disabled={!input} className="btn-primary">
          Convert
        </button>
        <button onClick={convertNow} className="btn-secondary">
          Use Current Time
        </button>
        <button onClick={() => { setInput(''); setOutput(''); }} className="btn-ghost">
          Clear
        </button>
      </div>
  );

  return (
    <ToolShell className="space-y-6" controls={controls}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="label">Timestamp</label>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onBlur={convert}
            placeholder={unit === 'seconds' ? '1699123456' : '1699123456789'}
            className="input-base font-mono"
          />
        </div>
        <div>
          <label className="label">Unit</label>
          <select value={unit} onChange={(e) => { setUnit(e.target.value as any); convert(); }} className="input-base">
            <option value="seconds">Seconds</option>
            <option value="milliseconds">Milliseconds</option>
          </select>
        </div>
      </div>

{/* Controls moved to header */}











      {output && (
        <OutputPanel
          value={output}
          label="Converted Date/Time"
          language="text"
          showLineNumbers
        />
      )}
    </ToolShell>
  );
}

