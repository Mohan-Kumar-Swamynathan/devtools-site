import { useState, useCallback } from 'react';
import { Eye, EyeOff, Check, X } from 'lucide-react';
import ToolShell from './ToolShell';
import { useToast } from '@/hooks/useToast';

export default function PasswordStrengthChecker() {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const checkStrength = useCallback((pwd: string) => {
    let score = 0;
    const checks = {
      length: pwd.length >= 8,
      lowercase: /[a-z]/.test(pwd),
      uppercase: /[A-Z]/.test(pwd),
      numbers: /\d/.test(pwd),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(pwd),
      long: pwd.length >= 12,
    };

    if (checks.length) score += 1;
    if (checks.lowercase) score += 1;
    if (checks.uppercase) score += 1;
    if (checks.numbers) score += 1;
    if (checks.special) score += 1;
    if (checks.long) score += 1;

    let strength = 'Weak';
    let color = 'red';
    if (score <= 2) {
      strength = 'Weak';
      color = 'red';
    } else if (score <= 4) {
      strength = 'Medium';
      color = 'orange';
    } else if (score <= 5) {
      strength = 'Strong';
      color = 'green';
    } else {
      strength = 'Very Strong';
      color = 'darkgreen';
    }

    return { score, strength, color, checks };
  }, []);

  const result = checkStrength(password);

  const controls = null;

  return (
    <ToolShell className="space-y-6" controls={controls}>
      <div className="space-y-4">
        <div>
          <label className="label">Password</label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input w-full pr-10"
              placeholder="Enter password to check..."
            />
            <button
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        {password && (
          <div className="p-4 rounded-xl border space-y-4" style={{
            backgroundColor: 'var(--bg-secondary)',
            borderColor: 'var(--border-primary)'
          }}>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>
                  Strength: {result.strength}
                </span>
                <span className="text-sm" style={{ color: result.color }}>
                  {result.score}/6
                </span>
              </div>
              <div className="w-full h-2 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--bg-primary)' }}>
                <div
                  className="h-full transition-all"
                  style={{
                    width: `${(result.score / 6) * 100}%`,
                    backgroundColor: result.color
                  }}
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                Requirements:
              </div>
              {Object.entries(result.checks).map(([key, value]) => (
                <div key={key} className="flex items-center gap-2 text-sm">
                  {value ? (
                    <Check size={16} className="text-green-500" />
                  ) : (
                    <X size={16} className="text-red-500" />
                  )}
                  <span style={{ color: value ? 'var(--text-primary)' : 'var(--text-muted)' }}>
                    {key === 'length' && 'At least 8 characters'}
                    {key === 'lowercase' && 'Contains lowercase letters'}
                    {key === 'uppercase' && 'Contains uppercase letters'}
                    {key === 'numbers' && 'Contains numbers'}
                    {key === 'special' && 'Contains special characters'}
                    {key === 'long' && 'At least 12 characters (recommended)'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </ToolShell>
  );
}
