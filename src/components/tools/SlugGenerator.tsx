import { useState, useCallback } from 'react';
import CodeEditor from '@/components/common/CodeEditor';
import OutputPanel from '@/components/common/OutputPanel';
import ToolShell from './ToolShell';
import { useToast } from '@/hooks/useToast';

export default function SlugGenerator() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');

  const generate = useCallback(() => {
    const slug = input
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '') // Remove special characters
      .replace(/[\s_-]+/g, '-') // Replace spaces and underscores with hyphens
      .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
    
    setOutput(slug);
  }, [input]);

  
  const controls = (
          <div className="flex items-center gap-3">
        <button onClick={generate} disabled={!input} className="btn-primary">
          Generate Slug
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
        label="Text to Convert"
        placeholder="Hello World! This is a test."
      />

{/* Controls moved to header */}








      {output && (
        <OutputPanel
          value={output}
          label="Generated Slug"
          language="text"
        />
      )}
    </ToolShell>
  );
}

