import { useState, useCallback } from 'react';
import CodeEditor from '@/components/common/CodeEditor';
import OutputPanel from '@/components/common/OutputPanel';
import ToolShell from './ToolShell';
import { useToast } from '@/hooks/useToast';

export default function AnagramGenerator() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [maxResults, setMaxResults] = useState(50);

  const generateAnagrams = useCallback(() => {
    const word = input.trim().toLowerCase();
    if (!word) {
      setOutput('');
      return;
    }

    const chars = word.split('');
    const anagrams = new Set<string>();
    
    // Simple permutation (limited to avoid performance issues)
    const permute = (arr: string[], start: number = 0) => {
      if (start === arr.length - 1) {
        const candidate = arr.join('');
        if (candidate !== word && anagrams.size < maxResults) {
          anagrams.add(candidate);
        }
        return;
      }
      
      for (let i = start; i < arr.length && anagrams.size < maxResults; i++) {
        [arr[start], arr[i]] = [arr[i], arr[start]];
        permute([...arr], start + 1);
        [arr[start], arr[i]] = [arr[i], arr[start]];
      }
    };

    if (word.length <= 8) {
      permute([...chars]);
    } else {
      // For longer words, generate random shuffles
      for (let i = 0; i < maxResults; i++) {
        const shuffled = [...chars].sort(() => Math.random() - 0.5).join('');
        if (shuffled !== word) {
          anagrams.add(shuffled);
        }
      }
    }

    setOutput(Array.from(anagrams).join('\n') || 'No anagrams generated');
  }, [input, maxResults]);

  
  const controls = (
          <div className="flex items-center gap-3">
        <button onClick={generateAnagrams} disabled={!input} className="btn-primary">
          Generate Anagrams
        </button>
        <button onClick={() => { setInput(''); setOutput(''); }} className="btn-ghost">
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
        label="Word"
        placeholder="listen"
      />

      <div>
        <label className="label">Max Results: {maxResults}</label>
        <input
          type="range"
          min="10"
          max="100"
          step="10"
          value={maxResults}
          onChange={(e) => setMaxResults(parseInt(e.target.value))}
          className="w-full"
        />
      </div>

{/* Controls moved to header */}








      {output && (
        <OutputPanel
          value={output}
          label={`Anagrams (${output.split('\n').length} found)`}
          language="text"
        />
      )}
    </ToolShell>
  );
}

