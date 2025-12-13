import { useState, useCallback } from 'react';
import CodeEditor from '@/components/common/CodeEditor';
import OutputPanel from '@/components/common/OutputPanel';

export default function TextReverser() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');

  const reverse = useCallback(() => {
    setOutput(input.split('').reverse().join(''));
  }, [input]);

  return (
    <div className="space-y-6">
      <CodeEditor
        value={input}
        onChange={(v) => { setInput(v); reverse(); }}
        language="text"
        label="Text Input"
        placeholder="Hello World"
      />

      {output && (
        <OutputPanel
          value={output}
          label="Reversed Text"
          language="text"
        />
      )}
    </div>
  );
}

