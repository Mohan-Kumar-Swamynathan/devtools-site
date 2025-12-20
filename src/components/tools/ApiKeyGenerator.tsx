import { useState, useCallback } from 'react';
import OutputPanel from '@/components/common/OutputPanel';
import { Key, Copy, Check } from 'lucide-react';
import { useToast } from '@/hooks/useToast';

const CHARSETS = {
  alphanumeric: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789',
  alphanumeric_upper: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789',
  alphanumeric_lower: 'abcdefghijklmnopqrstuvwxyz0123456789',
  hex: '0123456789abcdef',
  numeric: '0123456789',
  letters: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz',
  alphanumeric_special: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=[]{}|;:,.<>?'
};

export default function ApiKeyGenerator() {
  const [length, setLength] = useState(32);
  const [format, setFormat] = useState<keyof typeof CHARSETS>('alphanumeric');
  const [prefix, setPrefix] = useState('');
  const [suffix, setSuffix] = useState('');
  const [count, setCount] = useState(1);
  const [keys, setKeys] = useState<string[]>([]);
  const { showToast } = useToast();

  const generateKey = useCallback(() => {
    const charset = CHARSETS[format];
    const keys: string[] = [];
    
    for (let i = 0; i < count; i++) {
      let key = '';
      const randomValues = new Uint32Array(length);
      crypto.getRandomValues(randomValues);
      
      for (let j = 0; j < length; j++) {
        key += charset[randomValues[j] % charset.length];
      }
      
      keys.push(prefix + key + suffix);
    }
    
    setKeys(keys);
  }, [length, format, prefix, suffix, count]);

  const handleCopy = useCallback(async (key: string) => {
    try {
      await navigator.clipboard.writeText(key);
      showToast('Copied to clipboard!', 'success');
    } catch (e) {
      showToast('Failed to copy', 'error');
    }
  }, [showToast]);

  return (
    <div className="space-y-6">
      {/* Configuration */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="label mb-2">Key Length</label>
          <input
            type="number"
            value={length}
            onChange={(e) => setLength(Math.max(8, Math.min(256, parseInt(e.target.value) || 32)))}
            className="input-base"
            min="8"
            max="256"
          />
        </div>
        <div>
          <label className="label mb-2">Format</label>
          <select
            value={format}
            onChange={(e) => setFormat(e.target.value as keyof typeof CHARSETS)}
            className="input-base"
          >
            <option value="alphanumeric">Alphanumeric (A-Z, a-z, 0-9)</option>
            <option value="alphanumeric_upper">Alphanumeric Upper (A-Z, 0-9)</option>
            <option value="alphanumeric_lower">Alphanumeric Lower (a-z, 0-9)</option>
            <option value="hex">Hexadecimal (0-9, a-f)</option>
            <option value="numeric">Numeric (0-9)</option>
            <option value="letters">Letters (A-Z, a-z)</option>
            <option value="alphanumeric_special">Alphanumeric + Special</option>
          </select>
        </div>
        <div>
          <label className="label mb-2">Prefix (optional)</label>
          <input
            type="text"
            value={prefix}
            onChange={(e) => setPrefix(e.target.value)}
            className="input-base"
            placeholder="sk_live_"
          />
        </div>
        <div>
          <label className="label mb-2">Suffix (optional)</label>
          <input
            type="text"
            value={suffix}
            onChange={(e) => setSuffix(e.target.value)}
            className="input-base"
            placeholder=""
          />
        </div>
        <div>
          <label className="label mb-2">Number of Keys</label>
          <input
            type="number"
            value={count}
            onChange={(e) => setCount(Math.max(1, Math.min(100, parseInt(e.target.value) || 1)))}
            className="input-base"
            min="1"
            max="100"
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap items-center gap-3">
        <button onClick={generateKey} className="btn-primary flex items-center gap-2">
          <Key size={16} />
          Generate API Keys
        </button>
        <button
          onClick={() => { setKeys([]); setPrefix(''); setSuffix(''); }}
          className="btn-ghost"
        >
          Clear
        </button>
      </div>

      {/* Output */}
      {keys.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="label">Generated API Keys</label>
            <span className="text-sm" style={{ color: 'var(--text-muted)' }}>
              {keys.length} {keys.length === 1 ? 'key' : 'keys'}
            </span>
          </div>
          <div className="space-y-2">
            {keys.map((key, index) => (
              <div
                key={index}
                className="flex items-center gap-2 p-3 rounded-lg border"
                style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-primary)' }}
              >
                <code className="flex-1 font-mono text-sm" style={{ color: 'var(--text-primary)' }}>
                  {key}
                </code>
                <button
                  onClick={() => handleCopy(key)}
                  className="btn-icon p-2"
                  title="Copy key"
                >
                  <Copy size={16} />
                </button>
              </div>
            ))}
          </div>
          <OutputPanel
            value={keys.join('\n')}
            label="All Keys"
            language="text"
          />
        </div>
      )}
    </div>
  );
}






