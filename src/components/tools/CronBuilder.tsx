import { useState, useCallback, useEffect } from 'react';
import OutputPanel from '@/components/common/OutputPanel';
import ToolShell from './ToolShell';
import { useToast } from '@/hooks/useToast';

export default function CronBuilder() {
  const [minute, setMinute] = useState('*');
  const [hour, setHour] = useState('*');
  const [day, setDay] = useState('*');
  const [month, setMonth] = useState('*');
  const [weekday, setWeekday] = useState('*');
  const [expression, setExpression] = useState('* * * * *');
  const [description, setDescription] = useState('Every minute');

  const updateExpression = useCallback(() => {
    const expr = `${minute} ${hour} ${day} ${month} ${weekday}`;
    setExpression(expr);
    
    // Generate description
    let desc = '';
    if (minute === '*' && hour === '*' && day === '*' && month === '*' && weekday === '*') {
      desc = 'Every minute';
    } else if (minute !== '*' && hour === '*' && day === '*' && month === '*' && weekday === '*') {
      desc = `Every ${minute} minutes`;
    } else if (minute === '0' && hour !== '*' && day === '*' && month === '*' && weekday === '*') {
      desc = `Every day at ${hour}:00`;
    } else if (minute === '0' && hour === '0' && day === '*' && month === '*' && weekday === '*') {
      desc = 'Every day at midnight';
    } else {
      desc = `Custom schedule: ${expr}`;
    }
    setDescription(desc);
  }, [minute, hour, day, month, weekday]);

  useEffect(() => {
    updateExpression();
  }, [updateExpression]);

  const controls = null;

  return (
    <ToolShell className="space-y-6" controls={controls}>
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div>
          <label className="label">Minute (0-59)</label>
          <input
            type="text"
            value={minute}
            onChange={(e) => { setMinute(e.target.value); updateExpression(); }}
            placeholder="*"
            className="input-base font-mono"
          />
        </div>
        <div>
          <label className="label">Hour (0-23)</label>
          <input
            type="text"
            value={hour}
            onChange={(e) => { setHour(e.target.value); updateExpression(); }}
            placeholder="*"
            className="input-base font-mono"
          />
        </div>
        <div>
          <label className="label">Day (1-31)</label>
          <input
            type="text"
            value={day}
            onChange={(e) => { setDay(e.target.value); updateExpression(); }}
            placeholder="*"
            className="input-base font-mono"
          />
        </div>
        <div>
          <label className="label">Month (1-12)</label>
          <input
            type="text"
            value={month}
            onChange={(e) => { setMonth(e.target.value); updateExpression(); }}
            placeholder="*"
            className="input-base font-mono"
          />
        </div>
        <div>
          <label className="label">Weekday (0-7)</label>
          <input
            type="text"
            value={weekday}
            onChange={(e) => { setWeekday(e.target.value); updateExpression(); }}
            placeholder="*"
            className="input-base font-mono"
          />
        </div>
      </div>

      <div className="p-4 rounded-xl border" style={{ backgroundColor: 'var(--bg-tertiary)', borderColor: 'var(--border-primary)' }}>
        <p className="text-sm mb-2" style={{ color: 'var(--text-muted)' }}>Description:</p>
        <p className="font-medium">{description}</p>
      </div>

      <OutputPanel
        value={expression}
        label="Cron Expression"
        language="text"
      />

      <div className="text-xs" style={{ color: 'var(--text-muted)' }}>
        <p>Examples:</p>
        <ul className="list-disc list-inside space-y-1 mt-2">
          <li><code className="px-1 py-0.5 rounded" style={{ backgroundColor: 'var(--bg-tertiary)' }}>0 * * * *</code> - Every hour</li>
          <li><code className="px-1 py-0.5 rounded" style={{ backgroundColor: 'var(--bg-tertiary)' }}>0 0 * * *</code> - Every day at midnight</li>
          <li><code className="px-1 py-0.5 rounded" style={{ backgroundColor: 'var(--bg-tertiary)' }}>0 0 * * 0</code> - Every Sunday at midnight</li>
          <li><code className="px-1 py-0.5 rounded" style={{ backgroundColor: 'var(--bg-tertiary)' }}>*/5 * * * *</code> - Every 5 minutes</li>
        </ul>
      </div>
    </ToolShell>
  );
}

