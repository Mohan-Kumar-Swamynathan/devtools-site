import { useState, useMemo, useEffect } from 'react';
import { Code } from 'lucide-react';
import ToolShell from './ToolShell';
import { useToast } from '@/hooks/useToast';

export default function BinaryToText() {
  const [binary, setBinary] = useState('');
  const [error, setError] = useState('');

  const { result, errorMessage } = useMemo(() => {
    if (!binary.trim()) {
      return { result: '', errorMessage: '' };
    }

    // Remove spaces and validate binary
    const cleanBinary = binary.replace(/\s/g, '');
    
    if (!/^[01]+$/.test(cleanBinary)) {
      return { result: '', errorMessage: 'Invalid binary input. Only 0s and 1s are allowed.' };
    }

    if (cleanBinary.length % 8 !== 0) {
      return { result: '', errorMessage: 'Binary input length must be a multiple of 8 (one byte).' };
    }

    try {
      let text = '';
      for (let i = 0; i < cleanBinary.length; i += 8) {
        const byte = cleanBinary.substring(i, i + 8);
        const charCode = parseInt(byte, 2);
        text += String.fromCharCode(charCode);
      }
      return { result: text, errorMessage: '' };
    } catch (err) {
      return { result: '', errorMessage: 'Error converting binary to text.' };
    }
  }, [binary]);

  useEffect(() => {
    setError(errorMessage);
  }, [errorMessage]);

  const controls = null;

  return (
    <ToolShell className="space-y-6" controls={controls}>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
            <Code size={20} />
            Binary Input
          </h3>
          <div className="p-4 rounded-xl border space-y-4" style={{
            backgroundColor: 'var(--bg-secondary)',
            borderColor: 'var(--border-primary)'
          }}>
            <div>
              <label className="label">Binary Code</label>
              <textarea
                value={binary}
                onChange={(e) => setBinary(e.target.value)}
                className="input w-full font-mono"
                rows={10}
                placeholder="01001000 01100101 01101100 01101100 01101111"
              />
              <div className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
                Enter binary code (0s and 1s). Spaces are allowed and will be ignored.
              </div>
            </div>
            {error && (
              <div className="p-3 rounded-lg text-sm" style={{
                backgroundColor: 'var(--status-error)',
                color: 'white'
              }}>
                {error}
              </div>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
            Decoded Text
          </h3>
          <div className="p-4 rounded-xl border" style={{
            backgroundColor: 'var(--bg-secondary)',
            borderColor: 'var(--border-primary)'
          }}>
            <textarea
              value={result}
              readOnly
              className="input w-full font-mono"
              rows={10}
              placeholder="Decoded text will appear here..."
            />
            {result && (
              <div className="mt-4 p-3 rounded-lg border text-sm" style={{
                backgroundColor: 'var(--bg-primary)',
                borderColor: 'var(--border-primary)'
              }}>
                <div className="font-medium mb-1" style={{ color: 'var(--text-muted)' }}>
                  Statistics
                </div>
                <div className="text-xs space-y-1" style={{ color: 'var(--text-muted)' }}>
                  <div>Characters: {result.length}</div>
                  <div>Bytes: {Math.ceil((binary.replace(/\s/g, '').length) / 8)}</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </ToolShell>
  );
}

