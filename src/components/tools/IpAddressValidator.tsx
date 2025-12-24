import { useState, useCallback } from 'react';
import CodeEditor from '@/components/common/CodeEditor';
import OutputPanel from '@/components/common/OutputPanel';
import ToolShell from './ToolShell';
import { useToast } from '@/hooks/useToast';

export default function IpAddressValidator() {
  const [input, setInput] = useState('');
  const [results, setResults] = useState<Array<{ ip: string; valid: boolean; type?: string; details?: string }>>([]);

  const validateIPv4 = (ip: string): boolean => {
    const parts = ip.split('.');
    if (parts.length !== 4) return false;
    return parts.every(part => {
      const num = parseInt(part, 10);
      return !isNaN(num) && num >= 0 && num <= 255 && part === num.toString();
    });
  };

  const validateIPv6 = (ip: string): boolean => {
    const ipv6Regex = /^([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$|^::1$|^::$|^([0-9a-fA-F]{1,4}:)*::([0-9a-fA-F]{1,4}:)*[0-9a-fA-F]{1,4}$/;
    return ipv6Regex.test(ip);
  };

  const validate = useCallback(() => {
    const ips = input.split('\n').filter(ip => ip.trim());
    const results = ips.map(ip => {
      const trimmed = ip.trim();
      const isIPv4 = validateIPv4(trimmed);
      const isIPv6 = validateIPv6(trimmed);
      
      if (isIPv4) {
        return { ip: trimmed, valid: true, type: 'IPv4', details: 'Valid IPv4 address' };
      } else if (isIPv6) {
        return { ip: trimmed, valid: true, type: 'IPv6', details: 'Valid IPv6 address' };
      } else {
        return { ip: trimmed, valid: false, type: 'Invalid', details: 'Not a valid IP address' };
      }
    });
    setResults(results);
  }, [input]);

  
  const controls = (
          <div className="flex items-center gap-3">
        <button onClick={validate} disabled={!input} className="btn-primary">
          Validate
        </button>
        <button onClick={() => { setInput(''); setResults([]); }} className="btn-ghost">
          Clear
        </button>
      </div>
  );

  return (
    <ToolShell className="space-y-6" controls={controls}>
      <CodeEditor
        value={input}
        onChange={setInput}
        language="text"
        label="IP Addresses (one per line)"
        placeholder="192.168.1.1
2001:0db8:85a3:0000:0000:8a2e:0370:7334
invalid.ip"
      />

{/* Controls moved to header */}








      {results.length > 0 && (
        <div>
          <label className="label">Validation Results</label>
          <div className="space-y-2">
            {results.map((result, i) => (
              <div
                key={i}
                className={`p-3 rounded-lg border ${
                  result.valid ? 'alert-success' : 'alert-error'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono">{result.ip}</span>
                  <div className="text-right">
                    <span className="text-sm font-medium">
                      {result.valid ? '✓ Valid' : '✗ Invalid'}
                    </span>
                    {result.type && (
                      <span className="text-xs block" style={{ color: 'var(--text-muted)' }}>
                        {result.type}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </ToolShell>
  );
}

