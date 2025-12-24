import { useState, useCallback } from 'react';
import OutputPanel from '@/components/common/OutputPanel';
import ToolShell from './ToolShell';
import { useToast } from '@/hooks/useToast';

const romanNumerals: Array<[number, string]> = [
  [1000, 'M'], [900, 'CM'], [500, 'D'], [400, 'CD'],
  [100, 'C'], [90, 'XC'], [50, 'L'], [40, 'XL'],
  [10, 'X'], [9, 'IX'], [5, 'V'], [4, 'IV'], [1, 'I']
];

const romanToNumberMap: Record<string, number> = {
  'M': 1000, 'CM': 900, 'D': 500, 'CD': 400,
  'C': 100, 'XC': 90, 'L': 50, 'XL': 40,
  'X': 10, 'IX': 9, 'V': 5, 'IV': 4, 'I': 1
};

export default function RomanNumeralConverter() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState<'number-to-roman' | 'roman-to-number'>('number-to-roman');
  const [error, setError] = useState('');

  const numberToRoman = useCallback(() => {
    setError('');
    const num = parseInt(input, 10);
    if (isNaN(num) || num < 1 || num > 3999) {
      setError('Please enter a number between 1 and 3999');
      setOutput('');
      return;
    }

    let result = '';
    let remaining = num;
    
    for (const [value, numeral] of romanNumerals) {
      const count = Math.floor(remaining / value);
      result += numeral.repeat(count);
      remaining -= value * count;
    }
    
    setOutput(result);
  }, [input]);

  const romanToNumber = useCallback(() => {
    setError('');
    const roman = input.toUpperCase().trim();
    if (!/^[IVXLCDM]+$/.test(roman)) {
      setError('Invalid Roman numeral. Use only I, V, X, L, C, D, M');
      setOutput('');
      return;
    }

    let result = 0;
    let i = 0;
    
    while (i < roman.length) {
      if (i < roman.length - 1) {
        const twoChar = roman.substring(i, i + 2);
        if (romanToNumberMap[twoChar]) {
          result += romanToNumberMap[twoChar];
          i += 2;
          continue;
        }
      }
      
      const oneChar = roman[i];
      if (romanToNumberMap[oneChar]) {
        result += romanToNumberMap[oneChar];
        i++;
      } else {
        setError('Invalid Roman numeral format');
        setOutput('');
        return;
      }
    }
    
    setOutput(result.toString());
  }, [input]);

  const handleModeChange = (newMode: 'number-to-roman' | 'roman-to-number') => {
    setMode(newMode);
    setInput('');
    setOutput('');
    setError('');
  };

  
  const controls = (
          <div className="flex items-center gap-3">
        <button 
          onClick={mode === 'number-to-roman' ? numberToRoman : romanToNumber} 
          disabled={!input} 
          className="btn-primary"
        >
          Convert
        </button>
        <button onClick={() => { setInput(''); setOutput(''); setError(''); }} className="btn-ghost">
          Clear
        </button>
      </div>
  );

  return (
    <ToolShell className="space-y-6" controls={controls}>
      <div className="flex gap-2 p-1 rounded-xl" style={{ backgroundColor: 'var(--bg-tertiary)' }}>
        <button
          onClick={() => handleModeChange('number-to-roman')}
          className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            mode === 'number-to-roman' ? 'tab-active' : ''
          }`}
          style={mode === 'number-to-roman' ? { backgroundColor: 'var(--bg-primary)' } : {}}
        >
          Number → Roman
        </button>
        <button
          onClick={() => handleModeChange('roman-to-number')}
          className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            mode === 'roman-to-number' ? 'tab-active' : ''
          }`}
          style={mode === 'roman-to-number' ? { backgroundColor: 'var(--bg-primary)' } : {}}
        >
          Roman → Number
        </button>
      </div>

      <div>
        <label className="label">{mode === 'number-to-roman' ? 'Number (1-3999)' : 'Roman Numeral'}</label>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={mode === 'number-to-roman' ? '1234' : 'MCCXXXIV'}
          className="input-base font-mono"
          onBlur={mode === 'number-to-roman' ? numberToRoman : romanToNumber}
        />
      </div>

{/* Controls moved to header */}












      {error && <div className="alert-error">{error}</div>}
      {output && (
        <OutputPanel
          value={output}
          label={mode === 'number-to-roman' ? 'Roman Numeral' : 'Number'}
          language="text"
        />
      )}
    </ToolShell>
  );
}

