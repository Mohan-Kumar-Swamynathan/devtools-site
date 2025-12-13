import { useState, useCallback } from 'react';
import CodeEditor from '@/components/common/CodeEditor';
import OutputPanel from '@/components/common/OutputPanel';

export default function TimestampConverter() {
  const [timestamp, setTimestamp] = useState('');
  const [date, setDate] = useState('');
  const [mode, setMode] = useState<'to-date' | 'to-timestamp'>('to-date');
  const [error, setError] = useState('');

  const convertToDate = useCallback(() => {
    setError('');
    try {
      const ts = timestamp.trim();
      const num = ts.length === 10 ? parseInt(ts) * 1000 : parseInt(ts);
      const dateObj = new Date(num);
      
      if (isNaN(dateObj.getTime())) {
        throw new Error('Invalid timestamp');
      }
      
      setDate(dateObj.toISOString());
    } catch (e) {
      setError((e as Error).message);
      setDate('');
    }
  }, [timestamp]);

  const convertToTimestamp = useCallback(() => {
    setError('');
    try {
      const dateObj = new Date(date);
      
      if (isNaN(dateObj.getTime())) {
        throw new Error('Invalid date');
      }
      
      const ts = dateObj.getTime();
      setTimestamp(ts.toString());
    } catch (e) {
      setError((e as Error).message);
      setTimestamp('');
    }
  }, [date]);

  const handleModeChange = (newMode: 'to-date' | 'to-timestamp') => {
    setMode(newMode);
    setTimestamp('');
    setDate('');
    setError('');
  };

  return (
    <div className="space-y-6">
      {/* Mode Toggle */}
      <div className="flex gap-2 p-1 rounded-xl" style={{ backgroundColor: 'var(--bg-tertiary)' }}>
        <button
          onClick={() => handleModeChange('to-date')}
          className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            mode === 'to-date' ? 'tab-active' : ''
          }`}
          style={mode === 'to-date' ? { backgroundColor: 'var(--bg-primary)' } : {}}
        >
          Timestamp → Date
        </button>
        <button
          onClick={() => handleModeChange('to-timestamp')}
          className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            mode === 'to-timestamp' ? 'tab-active' : ''
          }`}
          style={mode === 'to-timestamp' ? { backgroundColor: 'var(--bg-primary)' } : {}}
        >
          Date → Timestamp
        </button>
      </div>

      {mode === 'to-date' ? (
        <>
          <div>
            <label className="label">Unix Timestamp</label>
            <input
              type="text"
              value={timestamp}
              onChange={(e) => setTimestamp(e.target.value)}
              placeholder="1699123456 or 1699123456789"
              className="input-base"
            />
          </div>
          <button onClick={convertToDate} disabled={!timestamp} className="btn-primary">
            Convert to Date
          </button>
          {error && <div className="alert-error">{error}</div>}
          {date && (
            <OutputPanel value={date} label="Date (ISO 8601)" language="text" />
          )}
        </>
      ) : (
        <>
          <div>
            <label className="label">Date</label>
            <input
              type="datetime-local"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="input-base"
            />
          </div>
          <button onClick={convertToTimestamp} disabled={!date} className="btn-primary">
            Convert to Timestamp
          </button>
          {error && <div className="alert-error">{error}</div>}
          {timestamp && (
            <OutputPanel value={timestamp} label="Unix Timestamp (milliseconds)" language="text" />
          )}
        </>
      )}
    </div>
  );
}


