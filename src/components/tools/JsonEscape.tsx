import { useState, useCallback } from 'react';
import CodeEditor from '@/components/common/CodeEditor';
import OutputPanel from '@/components/common/OutputPanel';
import ToolShell from './ToolShell';
import { useToast } from '@/hooks/useToast';

export default function JsonEscape() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState<'escape' | 'unescape'>('escape');

  const escape = useCallback(() => {
    try {
      const escaped = JSON.stringify(input);
      setOutput(escaped);
    } catch (e) {
      setOutput(`Error: ${(e as Error).message}`);
    }
  }, [input]);

  const unescape = useCallback(() => {
    try {
      const unescaped = JSON.parse(input);
      setOutput(typeof unescaped === 'string' ? unescaped : JSON.stringify(unescaped, null, 2));
    } catch (e) {
      setOutput(`Error: ${(e as Error).message}`);
    }
  }, [input]);

  const handleModeChange = (newMode: 'escape' | 'unescape') => {
    setMode(newMode);
    setInput('');
    setOutput('');
  };

  
  const controls = (
          <div className="flex items-center gap-3">
        <button 
          onClick={mode === 'escape' ? escape : unescape} 
          disabled={!input} 
          className="btn-primary"
        >
          {mode === 'escape' ? 'Escape' : 'Unescape'}
        </button>
        <button onClick={() => { setInput(''); setOutput(''); }} className="btn-ghost">
          Clear
        </button>
      </div>
  );

  return (
    <ToolShell className="space-y-6" controls={controls}>
      <div className="flex gap-2 p-1 rounded-xl" style={{ backgroundColor: 'var(--bg-tertiary)' }}>
        <button
          onClick={() => handleModeChange('escape')}
          className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            mode === 'escape' ? 'tab-active' : ''
          }`}
          style={mode === 'escape' ? { backgroundColor: 'var(--bg-primary)' } : {}}
        >
          Escape
        </button>
        <button
          onClick={() => handleModeChange('unescape')}
          className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            mode === 'unescape' ? 'tab-active' : ''
          }`}
          style={mode === 'unescape' ? { backgroundColor: 'var(--bg-primary)' } : {}}
        >
          Unescape
        </button>
      </div>

      <CodeEditor
        value={input}
        onChange={setInput}
        language="text"
        label={mode === 'escape' ? 'Text to Escape' : 'JSON String to Unescape'}
        placeholder={mode === 'escape' ? 'Hello "World"' : '"Hello \\"World\\""'}
      />

{/* Controls moved to header */}












      {output && (
        <OutputPanel
          value={output}
          label={mode === 'escape' ? 'Escaped JSON String' : 'Unescaped Text'}
          language="text"
        />
      )}
    </ToolShell>
  );
}

