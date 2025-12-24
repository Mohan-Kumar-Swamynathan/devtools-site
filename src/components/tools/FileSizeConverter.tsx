import { useState, useCallback } from 'react';
import OutputPanel from '@/components/common/OutputPanel';
import ToolShell from './ToolShell';
import { useToast } from '@/hooks/useToast';

export default function FileSizeConverter() {
  const [value, setValue] = useState('');
  const [fromUnit, setFromUnit] = useState<'bytes' | 'KB' | 'MB' | 'GB' | 'TB'>('bytes');
  const [toUnit, setToUnit] = useState<'bytes' | 'KB' | 'MB' | 'GB' | 'TB'>('KB');
  const [result, setResult] = useState('');

  const convert = useCallback(() => {
    const num = parseFloat(value);
    if (isNaN(num)) {
      setResult('');
      return;
    }

    const multipliers: Record<string, number> = {
      bytes: 1,
      KB: 1024,
      MB: 1024 * 1024,
      GB: 1024 * 1024 * 1024,
      TB: 1024 * 1024 * 1024 * 1024
    };

    const bytes = num * multipliers[fromUnit];
    const converted = bytes / multipliers[toUnit];
    
    setResult(`${converted.toFixed(6).replace(/\.?0+$/, '')} ${toUnit}`);
  }, [value, fromUnit, toUnit]);

  const controls = null;

  return (
    <ToolShell className="space-y-6" controls={controls}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="label">Value</label>
          <input
            type="number"
            value={value}
            onChange={(e) => { setValue(e.target.value); convert(); }}
            placeholder="0"
            className="input-base"
          />
        </div>
        <div>
          <label className="label">From</label>
          <select value={fromUnit} onChange={(e) => { setFromUnit(e.target.value as any); convert(); }} className="input-base">
            <option value="bytes">Bytes</option>
            <option value="KB">KB</option>
            <option value="MB">MB</option>
            <option value="GB">GB</option>
            <option value="TB">TB</option>
          </select>
        </div>
        <div>
          <label className="label">To</label>
          <select value={toUnit} onChange={(e) => { setToUnit(e.target.value as any); convert(); }} className="input-base">
            <option value="bytes">Bytes</option>
            <option value="KB">KB</option>
            <option value="MB">MB</option>
            <option value="GB">GB</option>
            <option value="TB">TB</option>
          </select>
        </div>
      </div>

      {result && (
        <div className="p-4 rounded-xl border text-center" style={{ backgroundColor: 'var(--bg-tertiary)', borderColor: 'var(--border-primary)' }}>
          <div className="text-2xl font-bold">{result}</div>
        </div>
      )}
    </ToolShell>
  );
}

