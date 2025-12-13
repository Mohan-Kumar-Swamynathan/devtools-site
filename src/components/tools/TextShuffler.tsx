import { useState, useCallback } from 'react';
import CodeEditor from '@/components/common/CodeEditor';
import OutputPanel from '@/components/common/OutputPanel';

export default function TextShuffler() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState<'characters' | 'words' | 'lines'>('characters');

  const shuffle = useCallback(() => {
    if (mode === 'characters') {
      const chars = input.split('');
      for (let i = chars.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [chars[i], chars[j]] = [chars[j], chars[i]];
      }
      setOutput(chars.join(''));
    } else if (mode === 'words') {
      const words = input.split(/\s+/);
      for (let i = words.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [words[i], words[j]] = [words[j], words[i]];
      }
      setOutput(words.join(' '));
    } else {
      const lines = input.split('\n');
      for (let i = lines.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [lines[i], lines[j]] = [lines[j], lines[i]];
      }
      setOutput(lines.join('\n'));
    }
  }, [input, mode]);

  return (
    <div className="space-y-6">
      <div>
        <label className="label">Shuffle Mode</label>
        <select value={mode} onChange={(e) => { setMode(e.target.value as any); shuffle(); }} className="input-base">
          <option value="characters">Characters</option>
          <option value="words">Words</option>
          <option value="lines">Lines</option>
        </select>
      </div>

      <CodeEditor
        value={input}
        onChange={(v) => { setInput(v); shuffle(); }}
        language="text"
        label="Text Input"
        placeholder={mode === 'lines' ? 'Line 1\nLine 2\nLine 3' : 'Hello World Example'}
      />

      <div className="flex flex-wrap items-center gap-3">
        <button onClick={shuffle} disabled={!input} className="btn-primary">
          Shuffle
        </button>
        <button onClick={() => { setInput(''); setOutput(''); }} className="btn-ghost">
          Clear
        </button>
      </div>

      {output && (
        <OutputPanel
          value={output}
          label="Shuffled Text"
          language="text"
        />
      )}
    </div>
  );
}

