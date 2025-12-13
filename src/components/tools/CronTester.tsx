import { useState, useCallback } from 'react';
import OutputPanel from '@/components/common/OutputPanel';

export default function CronTester() {
  const [expression, setExpression] = useState('0 * * * *');
  const [result, setResult] = useState('');
  const [isValid, setIsValid] = useState<boolean | null>(null);

  const test = useCallback(() => {
    const parts = expression.trim().split(/\s+/);
    if (parts.length !== 5) {
      setIsValid(false);
      setResult('Error: Cron expression must have 5 parts (minute hour day month weekday)');
      return;
    }

    const [minute, hour, day, month, weekday] = parts;
    const errors: string[] = [];

    // Validate minute (0-59)
    if (!/^(\*|([0-5]?\d)(-([0-5]?\d))?(\/(\d+))?)$/.test(minute)) {
      errors.push('Invalid minute format');
    }

    // Validate hour (0-23)
    if (!/^(\*|([01]?\d|2[0-3])(-([01]?\d|2[0-3]))?(\/(\d+))?)$/.test(hour)) {
      errors.push('Invalid hour format');
    }

    // Validate day (1-31)
    if (!/^(\*|([12]?\d|3[01])(-([12]?\d|3[01]))?(\/(\d+))?)$/.test(day)) {
      errors.push('Invalid day format');
    }

    // Validate month (1-12)
    if (!/^(\*|([1-9]|1[0-2])(-([1-9]|1[0-2]))?(\/(\d+))?)$/.test(month)) {
      errors.push('Invalid month format');
    }

    // Validate weekday (0-7)
    if (!/^(\*|[0-7](-[0-7])?(\/(\d+))?)$/.test(weekday)) {
      errors.push('Invalid weekday format');
    }

    if (errors.length > 0) {
      setIsValid(false);
      setResult('✗ Invalid cron expression:\n' + errors.join('\n'));
    } else {
      setIsValid(true);
      const now = new Date();
      const nextRuns: string[] = [];
      for (let i = 0; i < 5; i++) {
        const next = new Date(now.getTime() + i * 60 * 60 * 1000);
        nextRuns.push(next.toLocaleString());
      }
      setResult('✓ Valid cron expression\n\nNext 5 approximate run times:\n' + nextRuns.join('\n'));
    }
  }, [expression]);

  return (
    <div className="space-y-6">
      <div>
        <label className="label">Cron Expression</label>
        <input
          type="text"
          value={expression}
          onChange={(e) => setExpression(e.target.value)}
          placeholder="0 * * * *"
          className="input-base font-mono"
        />
        <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
          Format: minute hour day month weekday
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <button onClick={test} disabled={!expression} className="btn-primary">
          Test Expression
        </button>
        <button onClick={() => { setExpression('0 * * * *'); setResult(''); setIsValid(null); }} className="btn-ghost">
          Reset
        </button>
      </div>

      {result && (
        <div>
          <label className="label">Test Result</label>
          <div className={`p-4 rounded-xl border ${isValid ? 'alert-success' : 'alert-error'}`}>
            <pre className="whitespace-pre-wrap">{result}</pre>
          </div>
        </div>
      )}
    </div>
  );
}

