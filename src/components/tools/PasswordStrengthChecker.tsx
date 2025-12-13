import { useState, useCallback } from 'react';
import OutputPanel from '@/components/common/OutputPanel';

export default function PasswordStrengthChecker() {
  const [password, setPassword] = useState('');
  const [result, setResult] = useState<{
    strength: 'weak' | 'medium' | 'strong' | 'very-strong';
    score: number;
    feedback: string[];
  } | null>(null);

  const check = useCallback(() => {
    let score = 0;
    const feedback: string[] = [];

    if (password.length >= 8) score += 1;
    else feedback.push('Use at least 8 characters');

    if (password.length >= 12) score += 1;
    if (password.length >= 16) score += 1;

    if (/[a-z]/.test(password)) score += 1;
    else feedback.push('Add lowercase letters');

    if (/[A-Z]/.test(password)) score += 1;
    else feedback.push('Add uppercase letters');

    if (/[0-9]/.test(password)) score += 1;
    else feedback.push('Add numbers');

    if (/[^a-zA-Z0-9]/.test(password)) score += 1;
    else feedback.push('Add special characters');

    let strength: 'weak' | 'medium' | 'strong' | 'very-strong';
    if (score <= 2) strength = 'weak';
    else if (score <= 4) strength = 'medium';
    else if (score <= 6) strength = 'strong';
    else strength = 'very-strong';

    setResult({ strength, score, feedback });
  }, [password]);

  return (
    <div className="space-y-6">
      <div>
        <label className="label">Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => { setPassword(e.target.value); check(); }}
          placeholder="Enter password to check"
          className="input-base font-mono"
        />
      </div>

      {result && (
        <div className="space-y-4">
          <div className={`p-4 rounded-xl border ${
            result.strength === 'very-strong' ? 'alert-success' :
            result.strength === 'strong' ? 'alert-success' :
            result.strength === 'medium' ? 'alert-warning' :
            'alert-error'
          }`}>
            <div className="flex items-center justify-between mb-2">
              <div className="font-medium text-lg capitalize">{result.strength.replace('-', ' ')}</div>
              <div className="text-sm">Score: {result.score}/7</div>
            </div>
            <div className="w-full bg-opacity-20 rounded-full h-2" style={{ backgroundColor: 'var(--bg-tertiary)' }}>
              <div
                className="h-2 rounded-full transition-all"
                style={{
                  width: `${(result.score / 7) * 100}%`,
                  backgroundColor: result.strength === 'very-strong' || result.strength === 'strong' ? '#22c55e' :
                                  result.strength === 'medium' ? '#f59e0b' : '#ef4444'
                }}
              />
            </div>
          </div>
          {result.feedback.length > 0 && (
            <div>
              <label className="label">Suggestions</label>
              <ul className="list-disc list-inside space-y-1 text-sm" style={{ color: 'var(--text-muted)' }}>
                {result.feedback.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

