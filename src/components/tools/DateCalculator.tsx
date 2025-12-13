import { useState, useCallback } from 'react';
import OutputPanel from '@/components/common/OutputPanel';

export default function DateCalculator() {
  const [startDate, setStartDate] = useState('');
  const [operation, setOperation] = useState<'add' | 'subtract'>('add');
  const [value, setValue] = useState(0);
  const [unit, setUnit] = useState<'days' | 'weeks' | 'months' | 'years'>('days');
  const [result, setResult] = useState('');

  const calculate = useCallback(() => {
    if (!startDate) {
      setResult('Please select a start date');
      return;
    }

    const date = new Date(startDate);
    const multiplier = operation === 'add' ? 1 : -1;

    if (unit === 'days') {
      date.setDate(date.getDate() + (value * multiplier));
    } else if (unit === 'weeks') {
      date.setDate(date.getDate() + (value * 7 * multiplier));
    } else if (unit === 'months') {
      date.setMonth(date.getMonth() + (value * multiplier));
    } else if (unit === 'years') {
      date.setFullYear(date.getFullYear() + (value * multiplier));
    }

    setResult(date.toISOString().split('T')[0] + '\n' + date.toLocaleString());
  }, [startDate, operation, value, unit]);

  return (
    <div className="space-y-6">
      <div>
        <label className="label">Start Date</label>
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="input-base"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="label">Operation</label>
          <select value={operation} onChange={(e) => setOperation(e.target.value as any)} className="input-base">
            <option value="add">Add</option>
            <option value="subtract">Subtract</option>
          </select>
        </div>
        <div>
          <label className="label">Value</label>
          <input
            type="number"
            value={value}
            onChange={(e) => setValue(parseInt(e.target.value) || 0)}
            min="0"
            className="input-base"
          />
        </div>
        <div>
          <label className="label">Unit</label>
          <select value={unit} onChange={(e) => setUnit(e.target.value as any)} className="input-base">
            <option value="days">Days</option>
            <option value="weeks">Weeks</option>
            <option value="months">Months</option>
            <option value="years">Years</option>
          </select>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <button onClick={calculate} disabled={!startDate} className="btn-primary">
          Calculate
        </button>
        <button onClick={() => { setStartDate(''); setValue(0); setResult(''); }} className="btn-ghost">
          Clear
        </button>
      </div>

      {result && (
        <OutputPanel
          value={result}
          label="Result"
          language="text"
        />
      )}
    </div>
  );
}

