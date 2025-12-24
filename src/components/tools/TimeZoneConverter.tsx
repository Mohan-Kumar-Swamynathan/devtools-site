import { useState, useCallback } from 'react';
import OutputPanel from '@/components/common/OutputPanel';
import ToolShell from './ToolShell';
import { useToast } from '@/hooks/useToast';

const timeZones = [
  'UTC', 'America/New_York', 'America/Chicago', 'America/Denver', 'America/Los_Angeles',
  'Europe/London', 'Europe/Paris', 'Europe/Berlin', 'Asia/Tokyo', 'Asia/Shanghai',
  'Asia/Dubai', 'Australia/Sydney', 'America/Sao_Paulo'
];

export default function TimeZoneConverter() {
  const [dateTime, setDateTime] = useState('');
  const [fromZone, setFromZone] = useState('UTC');
  const [toZone, setToZone] = useState('America/New_York');
  const [result, setResult] = useState('');

  const convert = useCallback(() => {
    try {
      const date = dateTime ? new Date(dateTime) : new Date();
      const fromDate = new Date(date.toLocaleString('en-US', { timeZone: fromZone }));
      const toDate = new Date(date.toLocaleString('en-US', { timeZone: toZone }));
      
      const result = `From ${fromZone}:\n${fromDate.toISOString()}\n${fromDate.toLocaleString()}\n\nTo ${toZone}:\n${toDate.toISOString()}\n${toDate.toLocaleString()}`;
      setResult(result);
    } catch (e) {
      setResult(`Error: ${(e as Error).message}`);
    }
  }, [dateTime, fromZone, toZone]);

  
  const controls = (
          <div className="flex items-center gap-3">
        <button onClick={convert} className="btn-primary">
          Convert
        </button>
        <button onClick={() => { setDateTime(''); setResult(''); }} className="btn-ghost">
          Clear
        </button>
      </div>
  );

  return (
    <ToolShell className="space-y-6" controls={controls}>
      <div>
        <label className="label">Date & Time (leave empty for now)</label>
        <input
          type="datetime-local"
          value={dateTime}
          onChange={(e) => setDateTime(e.target.value)}
          className="input-base"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="label">From Time Zone</label>
          <select value={fromZone} onChange={(e) => setFromZone(e.target.value)} className="input-base">
            {timeZones.map(tz => (
              <option key={tz} value={tz}>{tz}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="label">To Time Zone</label>
          <select value={toZone} onChange={(e) => setToZone(e.target.value)} className="input-base">
            {timeZones.map(tz => (
              <option key={tz} value={tz}>{tz}</option>
            ))}
          </select>
        </div>
      </div>

{/* Controls moved to header */}








      {result && (
        <OutputPanel
          value={result}
          label="Converted Time"
          language="text"
        />
      )}
    </ToolShell>
  );
}

