import { useState, useCallback } from 'react';
import OutputPanel from '@/components/common/OutputPanel';

export default function BusinessDaysCalculator() {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [result, setResult] = useState<{ businessDays: number; totalDays: number; weekends: number } | null>(null);

  const calculate = useCallback(() => {
    if (!startDate || !endDate) {
      setResult(null);
      return;
    }

    const start = new Date(startDate);
    const end = new Date(endDate);
    
    if (start > end) {
      setResult(null);
      return;
    }

    let businessDays = 0;
    let weekends = 0;
    const current = new Date(start);

    while (current <= end) {
      const dayOfWeek = current.getDay();
      if (dayOfWeek !== 0 && dayOfWeek !== 6) {
        businessDays++;
      } else {
        weekends++;
      }
      current.setDate(current.getDate() + 1);
    }

    const totalDays = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;

    setResult({ businessDays, totalDays, weekends });
  }, [startDate, endDate]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="label">Start Date</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => { setStartDate(e.target.value); calculate(); }}
            className="input-base"
          />
        </div>
        <div>
          <label className="label">End Date</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => { setEndDate(e.target.value); calculate(); }}
            className="input-base"
          />
        </div>
      </div>

      {result && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl border text-center" style={{ backgroundColor: 'var(--bg-tertiary)', borderColor: 'var(--border-primary)' }}>
              <div className="text-2xl font-bold">{result.businessDays}</div>
              <div className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>Business Days</div>
            </div>
            <div className="p-4 rounded-xl border text-center" style={{ backgroundColor: 'var(--bg-tertiary)', borderColor: 'var(--border-primary)' }}>
              <div className="text-2xl font-bold">{result.totalDays}</div>
              <div className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>Total Days</div>
            </div>
            <div className="p-4 rounded-xl border text-center" style={{ backgroundColor: 'var(--bg-tertiary)', borderColor: 'var(--border-primary)' }}>
              <div className="text-2xl font-bold">{result.weekends}</div>
              <div className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>Weekend Days</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

