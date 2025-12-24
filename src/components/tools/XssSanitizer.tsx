import { useState, useCallback } from 'react';
import CodeEditor from '@/components/common/CodeEditor';
import OutputPanel from '@/components/common/OutputPanel';
import ToolShell from './ToolShell';
import { useToast } from '@/hooks/useToast';

export default function XssSanitizer() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');

  const sanitize = useCallback(() => {
    // Create a temporary div to parse HTML
    const div = document.createElement('div');
    div.textContent = input;
    
    // Get text content (strips all HTML tags)
    const sanitized = div.textContent || div.innerText || '';
    
    setOutput(sanitized);
  }, [input]);

  const escape = useCallback(() => {
    const escaped = input
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
    setOutput(escaped);
  }, [input]);

  
  const controls = (
          <div className="flex items-center gap-3">
        <button onClick={sanitize} disabled={!input} className="btn-primary">
          Sanitize (Remove HTML)
        </button>
        <button onClick={escape} disabled={!input} className="btn-secondary">
          Escape HTML
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
        language="html"
        label="HTML Input (potentially unsafe)"
        placeholder='<script>alert("XSS")</script><p>Hello</p>'
      />

{/* Controls moved to header */}











      {output && (
        <OutputPanel
          value={output}
          label="Sanitized Output"
          language="text"
        />
      )}
    </ToolShell>
  );
}

