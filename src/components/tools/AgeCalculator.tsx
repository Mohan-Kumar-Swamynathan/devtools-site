import { useState, useCallback } from 'react';
import OutputPanel from '@/components/common/OutputPanel';

export default function AgeCalculator() {
  const [birthDate, setBirthDate] = useState('');
  const [result, setResult] = useState<{
    years: number;
    months: number;
    days: number;
    totalDays: number;
  } | null>(null);

  const calculate = useCallback(() => {
    if (!birthDate) {
      setResult(null);
      return;
    }

    const birth = new Date(birthDate);
    const now = new Date();

    let years = now.getFullYear() - birth.getFullYear();
    let months = now.getMonth() - birth.getMonth();
    let days = now.getDate() - birth.getDate();

    if (days < 0) {
      months--;
      const lastMonth = new Date(now.getFullYear(), now.getMonth(), 0);
      days += lastMonth.getDate();
    }

    if (months < 0) {
      years--;
      months += 12;
    }

    const totalDays = Math.floor((now.getTime() - birth.getTime()) / (1000 * 60 * 60 * 24));

    setResult({ years, months, days, totalDays });
  }, [birthDate]);

  return (
    <div className="space-y-6">
      <div>
        <label className="label">Birth Date</label>
        <input
          type="date"
          value={birthDate}
          onChange={(e) => { setBirthDate(e.target.value); calculate(); }}
          className="input-base"
        />
      </div>

      {result && (
        <div className="space-y-4">
          <div className="p-4 rounded-xl border text-center" style={{ backgroundColor: 'var(--bg-tertiary)', borderColor: 'var(--border-primary)' }}>
            <div className="text-4xl font-bold mb-2">{result.years}</div>
            <div className="text-sm" style={{ color: 'var(--text-muted)' }}>Years</div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="p-3 rounded-lg border text-center" style={{ borderColor: 'var(--border-primary)' }}>
              <div className="text-2xl font-bold">{result.months}</div>
              <div className="text-xs" style={{ color: 'var(--text-muted)' }}>Months</div>
            </div>
            <div className="p-3 rounded-lg border text-center" style={{ borderColor: 'var(--border-primary)' }}>
              <div className="text-2xl font-bold">{result.days}</div>
              <div className="text-xs" style={{ color: 'var(--text-muted)' }}>Days</div>
            </div>
            <div className="p-3 rounded-lg border text-center" style={{ borderColor: 'var(--border-primary)' }}>
              <div className="text-2xl font-bold">{result.totalDays}</div>
              <div className="text-xs" style={{ color: 'var(--text-muted)' }}>Total Days</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

