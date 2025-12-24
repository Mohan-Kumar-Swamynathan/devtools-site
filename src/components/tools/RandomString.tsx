import { useState, useCallback } from 'react';
import OutputPanel from '@/components/common/OutputPanel';
import { randomString } from '@/lib/utils';
import ToolShell from './ToolShell';
import { useToast } from '@/hooks/useToast';

export default function RandomString() {
  const [output, setOutput] = useState('');
  const [length, setLength] = useState(16);
  const [includeUppercase, setIncludeUppercase] = useState(true);
  const [includeLowercase, setIncludeLowercase] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(false);
  const [count, setCount] = useState(1);

  const generate = useCallback(() => {
    let chars = '';
    if (includeUppercase) chars += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (includeLowercase) chars += 'abcdefghijklmnopqrstuvwxyz';
    if (includeNumbers) chars += '0123456789';
    if (includeSymbols) chars += '!@#$%^&*()_+-=[]{}|;:,.<>?';

    if (!chars) {
      setOutput('Please select at least one character type');
      return;
    }

    const strings: string[] = [];
    for (let i = 0; i < count; i++) {
      strings.push(randomString(length, chars));
    }
    setOutput(strings.join('\n'));
  }, [length, includeUppercase, includeLowercase, includeNumbers, includeSymbols, count]);

  
  const controls = (
          <div className="flex items-center gap-3">
        <button onClick={generate} className="btn-primary">
          Generate
        </button>
        <button onClick={() => setOutput('')} className="btn-ghost">
          Clear
        </button>
      </div>
  );

  return (
    <ToolShell className="space-y-6" controls={controls}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="label">Length</label>
          <input
            type="number"
            value={length}
            onChange={(e) => setLength(Math.max(1, parseInt(e.target.value) || 1))}
            min="1"
            max="1000"
            className="input-base"
          />
        </div>
        <div>
          <label className="label">Count</label>
          <input
            type="number"
            value={count}
            onChange={(e) => setCount(Math.max(1, parseInt(e.target.value) || 1))}
            min="1"
            max="100"
            className="input-base"
          />
        </div>
      </div>

      <div>
        <label className="label">Character Types</label>
        <div className="space-y-2">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={includeUppercase}
              onChange={(e) => setIncludeUppercase(e.target.checked)}
              className="checkbox"
            />
            <span>Uppercase (A-Z)</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={includeLowercase}
              onChange={(e) => setIncludeLowercase(e.target.checked)}
              className="checkbox"
            />
            <span>Lowercase (a-z)</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={includeNumbers}
              onChange={(e) => setIncludeNumbers(e.target.checked)}
              className="checkbox"
            />
            <span>Numbers (0-9)</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={includeSymbols}
              onChange={(e) => setIncludeSymbols(e.target.checked)}
              className="checkbox"
            />
            <span>Symbols (!@#$%...)</span>
          </label>
        </div>
      </div>

{/* Controls moved to header */}








      {output && (
        <OutputPanel
          value={output}
          label="Generated Strings"
          language="text"
        />
      )}
    </ToolShell>
  );
}

