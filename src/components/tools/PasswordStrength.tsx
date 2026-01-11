import React, { useState } from 'react';
import { Shield, ShieldAlert, ShieldCheck, Copy, Check } from 'lucide-react';
import ToolShell from './ToolShell';
import { clsx } from 'clsx';

export default function PasswordStrength() {
    const [password, setPassword] = useState('');
    const [isVisible, setIsVisible] = useState(false);

    const calculateStrength = (pwd: string) => {
        if (!pwd) return { score: 0, label: '', crackTime: '', feedback: [] };

        let score = 0;
        const feedback: string[] = [];

        if (pwd.length > 7) score += 1;
        if (pwd.length > 12) score += 1;
        if (/[A-Z]/.test(pwd)) score += 1;
        if (/[0-9]/.test(pwd)) score += 1;
        if (/[^A-Za-z0-9]/.test(pwd)) score += 1;

        // Penalties
        if (/(.)\1{2,}/.test(pwd)) score -= 1; // Repeats
        if (/^[a-z]+$/.test(pwd)) { score -= 1; feedback.push("Add uppercase letters and numbers."); }
        if (/^[0-9]+$/.test(pwd)) { score -= 2; feedback.push("Don't use only numbers."); }

        // Normalize score 0-4
        score = Math.max(0, Math.min(4, score));

        let label = 'Very Weak';
        let crackTime = 'Instantly';
        let color = 'bg-red-500';

        switch (score) {
            case 0: break;
            case 1: label = 'Weak'; crackTime = 'Seconds'; color = 'bg-orange-500'; break;
            case 2: label = 'Fair'; crackTime = 'Minutes'; color = 'bg-yellow-500'; break;
            case 3: label = 'Strong'; crackTime = 'Days to Months'; color = 'bg-green-500'; break;
            case 4: label = 'Very Strong'; crackTime = 'Years to Centuries'; color = 'bg-emerald-500'; break;
        }

        return { score, label, crackTime, color, feedback };
    };

    const { score, label, crackTime, color, feedback } = calculateStrength(password);

    return (
        <ToolShell
            title="Password Strength Checker"
            description="Analyze the security and break-time of your passwords"
            icon={<ShieldCheck className="w-6 h-6" />}
        >
            <div className="max-w-3xl mx-auto space-y-8">
                <div className="relative">
                    <input
                        type={isVisible ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Type a password to check..."
                        className="w-full text-xl px-6 py-4 bg-[var(--bg-elevated)] border border-[var(--border-primary)] rounded-2xl focus:ring-2 focus:ring-[var(--brand-primary)] outline-none transition-all"
                    />
                    <button
                        onClick={() => setIsVisible(!isVisible)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--brand-primary)]"
                    >
                        {isVisible ? 'Hide' : 'Show'}
                    </button>
                </div>

                {password && (
                    <div className="space-y-6 animate-fade-in-up">
                        {/* Score Bar */}
                        <div>
                            <div className="flex justify-between items-end mb-2">
                                <span className={`text-2xl font-bold ${score < 2 ? 'text-red-500' : score < 3 ? 'text-yellow-500' : 'text-green-500'}`}>
                                    {label}
                                </span>
                                <span className="text-[var(--text-secondary)] text-sm">Score: {score}/4</span>
                            </div>
                            <div className="h-4 bg-[var(--bg-secondary)] rounded-full overflow-hidden flex">
                                {[0, 1, 2, 3, 4].map(idx => (
                                    <div
                                        key={idx}
                                        className={clsx(
                                            "flex-1 border-r border-[var(--bg-primary)]/20 last:border-0 transition-all duration-500",
                                            idx <= score - (score === 0 ? -1 : 0) ? (
                                                score < 2 ? 'bg-red-500' : score < 3 ? 'bg-yellow-500' : 'bg-green-500'
                                            ) : 'bg-transparent'
                                        )}
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Metrics */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="p-4 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-primary)]">
                                <div className="text-[var(--text-secondary)] text-xs uppercase tracking-wider mb-1">Estimated Crack Time</div>
                                <div className="text-xl font-bold text-[var(--text-primary)]">{crackTime}</div>
                            </div>
                            <div className="p-4 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-primary)]">
                                <div className="text-[var(--text-secondary)] text-xs uppercase tracking-wider mb-1">Character Count</div>
                                <div className="text-xl font-bold text-[var(--text-primary)]">{password.length}</div>
                            </div>
                        </div>

                        {feedback.length > 0 && (
                            <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-sm">
                                <div className="flex items-center gap-2 font-semibold mb-2">
                                    <ShieldAlert className="w-4 h-4" /> Suggestions
                                </div>
                                <ul className="list-disc list-inside space-y-1">
                                    {feedback.map((f, i) => <li key={i}>{f}</li>)}
                                </ul>
                            </div>
                        )}
                    </div>
                )}

                {!password && (
                    <div className="text-center py-12 text-[var(--text-muted)]">
                        <Shield className="w-16 h-16 mx-auto mb-4 opacity-20" />
                        <p>Your password is never sent to any server. <br />Checking happens 100% locally in your browser.</p>
                    </div>
                )}
            </div>
        </ToolShell>
    );
}
