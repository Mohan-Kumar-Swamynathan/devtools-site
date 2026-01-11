import React, { useState, useEffect } from 'react';
import { Calculator, ArrowRight, RefreshCw, Smartphone, Monitor, Film } from 'lucide-react';
import { clsx } from 'clsx';
import ToolShell from './ToolShell';

const COMMON_RATIOS = [
    { w: 16, h: 9, label: '16:9 (HD Video)' },
    { w: 4, h: 3, label: '4:3 (SD Video)' },
    { w: 1, h: 1, label: '1:1 (Square)' },
    { w: 21, h: 9, label: '21:9 (Ultrawide)' },
    { w: 9, h: 16, label: '9:16 (Story)' },
    { w: 4, h: 5, label: '4:5 (Portrait)' },
];

export default function AspectRatioCalculator() {
    const [w1, setW1] = useState(1920);
    const [h1, setH1] = useState(1080);
    const [w2, setW2] = useState<number | ''>('');
    const [h2, setH2] = useState<number | ''>('');
    const [mode, setMode] = useState<'resize' | 'find'>('resize');

    // For find mode
    const [ratioResult, setRatioResult] = useState('');

    // Calculate Resize
    useEffect(() => {
        if (mode === 'resize') {
            if (w1 && h1 && w2) {
                const ratio = h1 / w1;
                setH2(Math.round(Number(w2) * ratio));
            } else if (w1 && h1 && h2) {
                const ratio = w1 / h1;
                setW2(Math.round(Number(h2) * ratio));
            }
        }
    }, [w1, h1, w2, h2, mode]); // Note: Circular dependency if not careful, but okay if user inputs one

    const handleResizeInput = (field: 'w2' | 'h2', val: string) => {
        const v = val === '' ? '' : Number(val);
        if (field === 'w2') {
            setW2(v);
            if (w1 && h1 && v !== '') {
                setH2(Math.round(Number(v) * (h1 / w1)));
            } else if (v === '') {
                setH2('');
            }
        } else {
            setH2(v);
            if (w1 && h1 && v !== '') {
                setW2(Math.round(Number(v) * (w1 / h1)));
            } else if (v === '') {
                setW2('');
            }
        }
    };

    const setRatio = (w: number, h: number) => {
        setW1(w);
        setH1(h);
        // Reset W2/H2 slightly
        if (w2) handleResizeInput('w2', w2.toString());
    };

    const getGCD = (a: number, b: number): number => {
        return b === 0 ? a : getGCD(b, a % b);
    };

    return (
        <ToolShell
            title="Aspect Ratio Calculator"
            description="Calculate dimensions and find aspect ratios"
            icon={<Calculator className="w-6 h-6" />}
        >
            <div className="space-y-8">
                {/* Ratio Presets */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
                    {COMMON_RATIOS.map(r => (
                        <button
                            key={r.label}
                            onClick={() => setRatio(r.w, r.h)}
                            className={clsx(
                                "p-2 text-xs font-medium rounded-lg border transition-all",
                                w1 === r.w && h1 === r.h
                                    ? "bg-[var(--brand-primary)] text-white border-[var(--brand-primary)]"
                                    : "bg-[var(--bg-elevated)] border-[var(--border-primary)] hover:border-[var(--brand-primary)] text-[var(--text-primary)]"
                            )}
                        >
                            {r.label}
                        </button>
                    ))}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                    {/* Source */}
                    <div className="p-6 rounded-2xl bg-[var(--bg-elevated)] border border-[var(--border-primary)]">
                        <h3 className="font-semibold mb-4 text-[var(--text-primary)]">Original Size (Ratio)</h3>
                        <div className="flex items-center gap-4">
                            <div className="flex-1">
                                <label className="text-xs text-[var(--text-secondary)] mb-1 block">Width</label>
                                <input
                                    type="number"
                                    value={w1}
                                    onChange={(e) => setW1(Number(e.target.value))}
                                    className="w-full px-4 py-3 bg-[var(--bg-input)] border border-[var(--border-input)] rounded-xl"
                                />
                            </div>
                            <span className="text-xl text-[var(--text-muted)] pt-5">:</span>
                            <div className="flex-1">
                                <label className="text-xs text-[var(--text-secondary)] mb-1 block">Height</label>
                                <input
                                    type="number"
                                    value={h1}
                                    onChange={(e) => setH1(Number(e.target.value))}
                                    className="w-full px-4 py-3 bg-[var(--bg-input)] border border-[var(--border-input)] rounded-xl"
                                />
                            </div>
                        </div>
                        <div className="mt-4 text-center text-sm text-[var(--text-secondary)]">
                            Ratio: <strong className="text-[var(--brand-primary)]">{(w1 / h1).toFixed(3)}</strong>
                        </div>
                    </div>

                    <ArrowRight className="hidden md:block w-8 h-8 text-[var(--text-muted)] mx-auto" />

                    {/* Target */}
                    <div className="p-6 rounded-2xl bg-[var(--bg-elevated)] border border-[var(--border-primary)]">
                        <h3 className="font-semibold mb-4 text-[var(--text-primary)]">New Size</h3>
                        <div className="flex items-center gap-4">
                            <div className="flex-1">
                                <label className="text-xs text-[var(--text-secondary)] mb-1 block">Width</label>
                                <input
                                    type="number"
                                    value={w2}
                                    placeholder="Enter width..."
                                    onChange={(e) => handleResizeInput('w2', e.target.value)}
                                    className="w-full px-4 py-3 bg-[var(--bg-input)] border border-[var(--border-input)] rounded-xl focus:ring-2 focus:ring-[var(--brand-primary)] outline-none transition-all"
                                />
                            </div>
                            <span className="text-xl text-[var(--text-muted)] pt-5">:</span>
                            <div className="flex-1">
                                <label className="text-xs text-[var(--text-secondary)] mb-1 block">Height</label>
                                <input
                                    type="number"
                                    value={h2}
                                    placeholder="Enter height..."
                                    onChange={(e) => handleResizeInput('h2', e.target.value)}
                                    className="w-full px-4 py-3 bg-[var(--bg-input)] border border-[var(--border-input)] rounded-xl focus:ring-2 focus:ring-[var(--brand-primary)] outline-none transition-all"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Visual */}
                <div className="mt-8 p-8 rounded-2xl bg-[var(--bg-secondary)] flex items-center justify-center min-h-[300px] overflow-hidden">
                    <div
                        className="bg-[var(--brand-primary)] rounded shadow-lg transition-all duration-500 relative flex items-center justify-center text-white font-bold"
                        style={{
                            width: '100%',
                            maxWidth: '400px',
                            aspectRatio: `${w1}/${h1}`
                        }}
                    >
                        <span className="drop-shadow-md">{w1} x {h1}</span>
                    </div>
                </div>
            </div>
        </ToolShell>
    );
}
