import { useState, useCallback } from 'react';
import { Copy, Check } from 'lucide-react';
import { randomString } from '@/lib/utils';
import ToolShell from './ToolShell';
import { useToast } from '@/hooks/useToast';

export default function PasswordGenerator() {
  const [password, setPassword] = useState('');
  const [length, setLength] = useState(16);
  const [includeUppercase, setIncludeUppercase] = useState(true);
  const [includeLowercase, setIncludeLowercase] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(true);
  const [copied, setCopied] = useState(false);

  const generate = useCallback(() => {
    let chars = '';
    if (includeUppercase) chars += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (includeLowercase) chars += 'abcdefghijklmnopqrstuvwxyz';
    if (includeNumbers) chars += '0123456789';
    if (includeSymbols) chars += '!@#$%^&*()_+-=[]{}|;:,.<>?';

    if (!chars) {
      alert('Please select at least one character type');
      return;
    }

    setPassword(randomString(length, chars));
  }, [length, includeUppercase, includeLowercase, includeNumbers, includeSymbols]);

  const copy = async () => {
    await navigator.clipboard.writeText(password);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const controls = null;

  return (
    <ToolShell className="space-y-6" controls={controls}>
      {/* Password Display */}
      <div className="relative">
        <input
          type="text"
          value={password}
          readOnly
          className="input-base pr-12 font-mono text-lg"
          placeholder="Generated password will appear here"
        />
        {password && (
          <button
            onClick={copy}
            className="absolute right-3 top-1/2 -translate-y-1/2 btn-icon"
            title={copied ? 'Copied!' : 'Copy'}
          >
            {copied ? <Check size={20} className="text-green-500" /> : <Copy size={20} />}
          </button>
        )}
      </div>

      {/* Options */}
      <div className="space-y-4">
        <div>
          <label className="label">Length: {length}</label>
          <input
            type="range"
            min="8"
            max="64"
            value={length}
            onChange={(e) => setLength(parseInt(e.target.value))}
            className="w-full"
          />
        </div>

        <div className="space-y-3">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={includeUppercase}
              onChange={(e) => setIncludeUppercase(e.target.checked)}
              className="w-4 h-4 rounded"
            />
            <span style={{ color: 'var(--text-primary)' }}>Uppercase (A-Z)</span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={includeLowercase}
              onChange={(e) => setIncludeLowercase(e.target.checked)}
              className="w-4 h-4 rounded"
            />
            <span style={{ color: 'var(--text-primary)' }}>Lowercase (a-z)</span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={includeNumbers}
              onChange={(e) => setIncludeNumbers(e.target.checked)}
              className="w-4 h-4 rounded"
            />
            <span style={{ color: 'var(--text-primary)' }}>Numbers (0-9)</span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={includeSymbols}
              onChange={(e) => setIncludeSymbols(e.target.checked)}
              className="w-4 h-4 rounded"
            />
            <span style={{ color: 'var(--text-primary)' }}>Symbols (!@#$%...)</span>
          </label>
        </div>
      </div>

      {/* Generate Button */}
      <button onClick={generate} className="btn-primary w-full">
        Generate Password
      </button>
    </ToolShell>
  );
}


