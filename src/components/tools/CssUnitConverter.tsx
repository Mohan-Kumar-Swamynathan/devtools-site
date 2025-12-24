import { useState } from 'react';
import ToolShell from './ToolShell';

type Unit = 'px' | 'rem' | 'em' | '%' | 'vw' | 'vh' | 'pt';

export default function CssUnitConverter() {
    const [value, setValue] = useState('16');
    const [fromUnit, setFromUnit] = useState<Unit>('px');
    const [baseFontSize, setBaseFontSize] = useState('16');

    const units: Unit[] = ['px', 'rem', 'em', '%', 'vw', 'vh', 'pt'];

    const convert = (val: number, from: Unit, to: Unit): string => {
        const base = parseFloat(baseFontSize) || 16;

        // Convert to px first
        let px = val;
        switch (from) {
            case 'rem': px = val * base; break;
            case 'em': px = val * base; break;
            case '%': px = (val / 100) * base; break;
            case 'vw': px = (val / 100) * (typeof window !== 'undefined' ? window.innerWidth : 1920); break;
            case 'vh': px = (val / 100) * (typeof window !== 'undefined' ? window.innerHeight : 1080); break;
            case 'pt': px = val * (4 / 3); break;
        }

        // Convert from px to target
        switch (to) {
            case 'px': return px.toFixed(2);
            case 'rem': return (px / base).toFixed(4);
            case 'em': return (px / base).toFixed(4);
            case '%': return ((px / base) * 100).toFixed(2);
            case 'vw': return ((px / (typeof window !== 'undefined' ? window.innerWidth : 1920)) * 100).toFixed(2);
            case 'vh': return ((px / (typeof window !== 'undefined' ? window.innerHeight : 1080)) * 100).toFixed(2);
            case 'pt': return (px * (3 / 4)).toFixed(2);
            default: return '0';
        }
    };

    const numValue = parseFloat(value) || 0;
    const controls = null;

    return (
        <ToolShell
            title="CSS Unit Converter"
            description="Convert between px, rem, em, %, vw, vh, and pt"
        >
            <div className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                        <label className="label">Base Font Size (px)</label>
                        <input
                            type="number"
                            value={baseFontSize}
                            onChange={e => setBaseFontSize(e.target.value)}
                            className="input-base text-center text-lg"
                        />
                    </div>
                    <div className="space-y-3">
                        <label className="label">Convert From</label>
                        <div className="flex gap-2">
                            <input
                                type="number"
                                value={value}
                                onChange={e => setValue(e.target.value)}
                                className="input-base flex-1 text-center text-2xl font-bold"
                                placeholder="16"
                            />
                            <select
                                value={fromUnit}
                                onChange={e => setFromUnit(e.target.value as Unit)}
                                className="input-base w-24 text-center font-mono"
                            >
                                {units.map(u => <option key={u} value={u}>{u}</option>)}
                            </select>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {units.map(unit => (
                        <div
                            key={unit}
                            className={`p-4 rounded-xl border transition-all ${unit === fromUnit
                                    ? 'bg-[var(--brand-primary)] text-black border-white'
                                    : 'bg-[var(--bg-secondary)] border-[var(--border-primary)]'
                                }`}
                        >
                            <div className="text-xs uppercase tracking-wider text-center mb-1 opacity-70">
                                {unit}
                            </div>
                            <div className="text-2xl font-bold text-center font-mono">
                                {convert(numValue, fromUnit, unit)}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="p-4 rounded-xl bg-[var(--bg-tertiary)] border border-[var(--border-primary)]">
                    <p className="text-sm text-[var(--text-secondary)] text-center">
                        💡 Viewport units (vw, vh) are calculated based on current window size
                    </p>
                </div>
            </div>
        </ToolShell>
    );
}
