import { useState, useEffect } from 'react';
import ToolShell from './ToolShell';

interface KeyInfo {
    key: string;
    code: string;
    which: number; // Deprecated but often asked for
    location: number;
    ctrlKey: boolean;
    shiftKey: boolean;
    altKey: boolean;
    metaKey: boolean;
}

export default function KeyboardEventViewer() {
    const [currentKey, setCurrentKey] = useState<KeyInfo | null>(null);
    const [history, setHistory] = useState<KeyInfo[]>([]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            e.preventDefault();

            const info: KeyInfo = {
                key: e.key,
                code: e.code,
                which: e.which || e.keyCode,
                location: e.location,
                ctrlKey: e.ctrlKey,
                shiftKey: e.shiftKey,
                altKey: e.altKey,
                metaKey: e.metaKey,
            };

            setCurrentKey(info);
            setHistory(prev => [info, ...prev].slice(0, 10)); // Keep last 10
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    const controls = (
        <button
            onClick={() => { setCurrentKey(null); setHistory([]); }}
            className="btn-ghost"
        >
            Clear History
        </button>
    );

    return (
        <ToolShell className="space-y-8" controls={controls}>

            {/* Main Display */}
            <div className="min-h-[300px] flex flex-col items-center justify-center rounded-2xl border-2 border-dashed transition-all"
                style={{
                    borderColor: currentKey ? 'var(--brand-primary)' : 'var(--border-primary)',
                    backgroundColor: currentKey ? 'rgba(var(--brand-primary-rgb), 0.05)' : 'transparent'
                }}
            >
                {!currentKey ? (
                    <div className="text-center p-10">
                        <p className="text-2xl font-medium mb-2" style={{ color: 'var(--text-primary)' }}>Press any key</p>
                        <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Focus this window and press a key to see event details</p>
                    </div>
                ) : (
                    <div className="w-full max-w-2xl p-8">
                        <div className="text-center mb-10">
                            <span className="text-8xl font-bold" style={{ color: 'var(--brand-primary)' }}>
                                {currentKey.which}
                            </span>
                            <p className="text-xl mt-4 font-mono" style={{ color: 'var(--text-secondary)' }}>
                                {currentKey.code}
                            </p>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <InfoCard label="event.key" value={currentKey.key} />
                            <InfoCard label="event.code" value={currentKey.code} />
                            <InfoCard label="event.which" value={currentKey.which} />
                            <InfoCard label="event.location" value={currentKey.location} />
                        </div>

                        <div className="grid grid-cols-4 gap-4 mt-4">
                            <ModifierCard label="Ctrl" active={currentKey.ctrlKey} />
                            <ModifierCard label="Shift" active={currentKey.shiftKey} />
                            <ModifierCard label="Alt" active={currentKey.altKey} />
                            <ModifierCard label="Meta" active={currentKey.metaKey} />
                        </div>
                    </div>
                )}
            </div>

            {/* History Table */}
            {history.length > 0 && (
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead>
                            <tr className="border-b" style={{ borderColor: 'var(--border-primary)' }}>
                                <th className="py-3 px-4" style={{ color: 'var(--text-muted)' }}>Key</th>
                                <th className="py-3 px-4" style={{ color: 'var(--text-muted)' }}>Code</th>
                                <th className="py-3 px-4" style={{ color: 'var(--text-muted)' }}>Which</th>
                                <th className="py-3 px-4" style={{ color: 'var(--text-muted)' }}>Modifiers</th>
                            </tr>
                        </thead>
                        <tbody>
                            {history.map((item, i) => (
                                <tr key={i} className="border-b last:border-0" style={{ borderColor: 'var(--border-primary)' }}>
                                    <td className="py-3 px-4 font-mono" style={{ color: 'var(--text-primary)' }}>{item.key === ' ' ? '(Space)' : item.key}</td>
                                    <td className="py-3 px-4 font-mono" style={{ color: 'var(--text-secondary)' }}>{item.code}</td>
                                    <td className="py-3 px-4" style={{ color: 'var(--text-secondary)' }}>{item.which}</td>
                                    <td className="py-3 px-4 flex gap-1">
                                        {item.ctrlKey && <span className="px-1.5 py-0.5 rounded text-xs bg-[var(--bg-elevated)]">Ctrl</span>}
                                        {item.shiftKey && <span className="px-1.5 py-0.5 rounded text-xs bg-[var(--bg-elevated)]">Shift</span>}
                                        {item.altKey && <span className="px-1.5 py-0.5 rounded text-xs bg-[var(--bg-elevated)]">Alt</span>}
                                        {item.metaKey && <span className="px-1.5 py-0.5 rounded text-xs bg-[var(--bg-elevated)]">Meta</span>}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </ToolShell>
    );
}

function InfoCard({ label, value }: { label: string; value: string | number }) {
    return (
        <div className="p-4 rounded-xl border bg-[var(--bg-secondary)] text-center" style={{ borderColor: 'var(--border-primary)' }}>
            <p className="text-xs mb-1" style={{ color: 'var(--text-muted)' }}>{label}</p>
            <p className="font-mono text-lg font-semibold truncate" style={{ color: 'var(--text-primary)' }} title={String(value)}>
                {value === ' ' ? '(Space)' : value}
            </p>
        </div>
    );
}

function ModifierCard({ label, active }: { label: string; active: boolean }) {
    return (
        <div
            className={`p-3 rounded-xl border text-center transition-colors ${active ? 'bg-[var(--brand-primary)] border-transparent' : 'bg-[var(--bg-secondary)]'}`}
            style={{ borderColor: active ? 'transparent' : 'var(--border-primary)' }}
        >
            <p className={`font-semibold ${active ? 'text-white' : 'text-[var(--text-muted)]'}`}>
                {label}
            </p>
        </div>
    );
}
