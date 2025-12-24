
import { useState, useEffect } from 'react';
import ToolShell from './ToolShell';
import CodeEditor from '@/components/common/CodeEditor';
import { Copy } from 'lucide-react';

export default function CronExpressionGenerator() {
    const [expression, setExpression] = useState('* * * * *');
    const [description, setDescription] = useState('');

    // Simple basic description logic since we don't have cronstrue installed yet
    // We will assume standard 5-part cron
    useEffect(() => {
        const parts = expression.trim().split(/\s+/);
        if (parts.length !== 5) {
            setDescription('Invalid cron expression (must have 5 parts)');
            return;
        }

        const [min, hour, dom, mon, dow] = parts;
        const desc = [];

        if (min === '*' && hour === '*' && dom === '*' && mon === '*' && dow === '*') desc.push('Every minute');
        else if (min === '0' && hour === '*') desc.push('Every hour');
        else if (min === '0' && hour === '0') desc.push('Every day at midnight');
        else {
            desc.push(`At ${hour}:${min}`);
            if (dom !== '*') desc.push(`on day-of-month ${dom}`);
            if (mon !== '*') desc.push(`in month ${mon}`);
            if (dow !== '*') desc.push(`on day-of-week ${dow}`);
        }

        setDescription(desc.join(' '));
    }, [expression]);

    const presets = [
        { label: 'Every minute', value: '* * * * *' },
        { label: 'Every hour', value: '0 * * * *' },
        { label: 'Every day at midnight', value: '0 0 * * *' },
        { label: 'Every month', value: '0 0 1 * *' },
        { label: 'Every week', value: '0 0 * * 0' },
    ];

    const controls = null;

    const controls2 = (
        <button className="btn-ghost" onClick={() => setExpression('* * * * *')}>Reset</button>
    );

    return (
        <ToolShell
            title="Cron Expression Generator"
            description="Create and verify cron schedule expressions"
            controls={controls2}
        >
            <div className="space-y-8">
                <div className="space-y-4">
                    <label className="label">Cron Expression</label>
                    <input
                        value={expression}
                        onChange={(e) => setExpression(e.target.value)}
                        className="input-base text-2xl font-mono text-center tracking-widest py-6"
                        placeholder="* * * * *"
                    />
                    <div className="p-4 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-primary)] text-center">
                        <p className="text-lg font-medium text-[var(--text-primary)]">{description}</p>
                    </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    {['Minute', 'Hour', 'Day', 'Month', 'Week'].map((label, i) => (
                        <div key={label} className="p-3 rounded-lg border border-[var(--border-primary)] bg-[var(--bg-tertiary)] text-center">
                            <span className="text-xs text-[var(--text-muted)] uppercase tracking-wider block mb-1">{label}</span>
                            <span className="font-mono font-bold text-xl">{expression.split(' ')[i] || '?'}</span>
                        </div>
                    ))}
                </div>

                <div className="space-y-3">
                    <label className="label">Common Presets</label>
                    <div className="flex flex-wrap gap-2">
                        {presets.map(p => (
                            <button
                                key={p.label}
                                onClick={() => setExpression(p.value)}
                                className="btn-secondary text-sm"
                            >
                                {p.label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </ToolShell>
    );
}
