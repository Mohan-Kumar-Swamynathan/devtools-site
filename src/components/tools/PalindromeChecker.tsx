import { useState, useCallback } from 'react';
import CodeEditor from '@/components/common/CodeEditor';
import ToolShell from './ToolShell';
import { useToast } from '@/hooks/useToast';

export default function PalindromeChecker() {
  const [input, setInput] = useState('');
  const [results, setResults] = useState<Array<{ text: string; isPalindrome: boolean }>>([]);

  const isPalindrome = (str: string): boolean => {
    const cleaned = str.toLowerCase().replace(/[^a-z0-9]/g, '');
    return cleaned === cleaned.split('').reverse().join('');
  };

  const check = useCallback(() => {
    const lines = input.split('\n').filter(l => l.trim());
    const results = lines.map(line => ({
      text: line.trim(),
      isPalindrome: isPalindrome(line.trim())
    }));
    setResults(results);
  }, [input]);

  
  const controls = (
          <div className="flex items-center gap-3">
        <button onClick={check} disabled={!input} className="btn-primary">
          Check Palindromes
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
        label="Text to Check (one per line)"
        placeholder="racecar
A man a plan a canal Panama
hello"
      />

{/* Controls moved to header */}








      {results.length > 0 && (
        <div className="space-y-2">
          {results.map((result, i) => (
            <div
              key={i}
              className={`p-3 rounded-lg border ${
                result.isPalindrome ? 'alert-success' : 'alert-error'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-mono">{result.text}</span>
                <span className="text-sm font-medium">
                  {result.isPalindrome ? '✓ Palindrome' : '✗ Not a Palindrome'}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </ToolShell>
  );
}

