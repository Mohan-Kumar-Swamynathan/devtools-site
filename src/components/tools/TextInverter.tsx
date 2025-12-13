import { useState, useCallback } from 'react';
import CodeEditor from '@/components/common/CodeEditor';
import OutputPanel from '@/components/common/OutputPanel';

export default function TextInverter() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');

  const invert = useCallback(() => {
    const inverted = input.split('').map(char => {
      if (char === char.toUpperCase() && char !== char.toLowerCase()) {
        return char.toLowerCase();
      } else if (char === char.toLowerCase() && char !== char.toUpperCase()) {
        return char.toUpperCase();
      }
      return char;
    }).join('');
    setOutput(inverted);
  }, [input]);

  return (
    <div className="space-y-6">
      <CodeEditor
        value={input}
        onChange={(v) => { setInput(v); invert(); }}
        language="text"
        label="Text Input"
        placeholder="Hello World"
      />

      {output && (
        <OutputPanel
          value={output}
          label="Inverted Case"
          language="text"
        />
      )}
    </div>
  );
}

