import { useState, useCallback } from 'react';
import CodeEditor from '@/components/common/CodeEditor';
import OutputPanel from '@/components/common/OutputPanel';

export default function WordFrequencyCounter() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [minLength, setMinLength] = useState(1);
  const [caseSensitive, setCaseSensitive] = useState(false);

  const count = useCallback(() => {
    const text = caseSensitive ? input : input.toLowerCase();
    const words = text.match(/\b\w+\b/g) || [];
    
    const frequency: Record<string, number> = {};
    words.forEach(word => {
      if (word.length >= minLength) {
        frequency[word] = (frequency[word] || 0) + 1;
      }
    });

    const sorted = Object.entries(frequency)
      .sort((a, b) => b[1] - a[1])
      .map(([word, count]) => `${word}: ${count}`)
      .join('\n');

    setOutput(sorted || 'No words found');
  }, [input, minLength, caseSensitive]);

  return (
    <div className="space-y-6">
      <CodeEditor
        value={input}
        onChange={(v) => { setInput(v); count(); }}
        language="text"
        label="Text Input"
        placeholder="Enter text to analyze word frequency..."
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="label">Minimum Word Length</label>
          <input
            type="number"
            min="1"
            max="20"
            value={minLength}
            onChange={(e) => { setMinLength(parseInt(e.target.value) || 1); count(); }}
            className="input-base"
          />
        </div>
        <div>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={caseSensitive}
              onChange={(e) => { setCaseSensitive(e.target.checked); count(); }}
              className="checkbox"
            />
            <span>Case Sensitive</span>
          </label>
        </div>
      </div>

      {output && (
        <OutputPanel
          value={output}
          label="Word Frequency (sorted by count)"
          language="text"
          showLineNumbers
        />
      )}
    </div>
  );
}

