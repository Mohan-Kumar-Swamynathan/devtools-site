import { useState, useCallback } from 'react';
import CodeEditor from '@/components/common/CodeEditor';
import OutputPanel from '@/components/common/OutputPanel';
import ToolShell from './ToolShell';
import { useToast } from '@/hooks/useToast';

export default function SvgOptimizer() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');

  const optimize = useCallback(() => {
    let optimized = input;

    // Remove comments
    optimized = optimized.replace(/<!--[\s\S]*?-->/g, '');

    // Remove unnecessary whitespace
    optimized = optimized.replace(/\s+/g, ' ');
    optimized = optimized.replace(/>\s+</g, '><');

    // Remove default attributes
    optimized = optimized.replace(/\s+xmlns="http:\/\/www\.w3\.org\/2000\/svg"/g, '');
    
    // Remove empty groups
    optimized = optimized.replace(/<g[^>]*>\s*<\/g>/g, '');

    // Remove unnecessary quotes
    optimized = optimized.replace(/="([^"]*)"/g, '=$1');

    setOutput(optimized.trim());
  }, [input]);

  
  const controls = (
          <div className="flex items-center gap-3">
        <button onClick={optimize} disabled={!input} className="btn-primary">
          Optimize SVG
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
        language="xml"
        label="SVG Code"
        placeholder='<svg xmlns="http://www.w3.org/2000/svg"><circle cx="50" cy="50" r="40"/></svg>'
      />

{/* Controls moved to header */}








      {output && (
        <OutputPanel
          value={output}
          label="Optimized SVG"
          language="xml"
          showLineNumbers
        />
      )}
    </ToolShell>
  );
}

