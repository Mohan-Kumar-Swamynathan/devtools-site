import { useState, useCallback } from 'react';
import CodeEditor from '@/components/common/CodeEditor';
import OutputPanel from '@/components/common/OutputPanel';
import { escapeHtml, unescapeHtml } from '@/lib/utils';
import ToolShell from './ToolShell';
import { useToast } from '@/hooks/useToast';

export default function HtmlEncoder() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');

  const encode = useCallback(() => {
    setOutput(escapeHtml(input));
  }, [input]);

  const decode = useCallback(() => {
    setOutput(unescapeHtml(input));
  }, [input]);

  const handleModeChange = (newMode: 'encode' | 'decode') => {
    setMode(newMode);
    setInput('');
    setOutput('');
  };

  
  const controls = (
          <div className="flex items-center gap-3">
        <button 
          onClick={mode === 'encode' ? encode : decode} 
          disabled={!input} 
          className="btn-primary"
        >
          {mode === 'encode' ? 'Encode' : 'Decode'}
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
          onClick={() => handleModeChange('encode')}
          className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            mode === 'encode' ? 'tab-active' : ''
          }`}
          style={mode === 'encode' ? { backgroundColor: 'var(--bg-primary)' } : {}}
        >
          Encode
        </button>
        <button
          onClick={() => handleModeChange('decode')}
          className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            mode === 'decode' ? 'tab-active' : ''
          }`}
          style={mode === 'decode' ? { backgroundColor: 'var(--bg-primary)' } : {}}
        >
          Decode
        </button>
      </div>

      <CodeEditor
        value={input}
        onChange={setInput}
        language="html"
        label={mode === 'encode' ? 'Text to Encode' : 'HTML Entities to Decode'}
        placeholder={mode === 'encode' ? '<div>Hello & World</div>' : '&lt;div&gt;Hello &amp; World&lt;/div&gt;'}
      />

{/* Controls moved to header */}












      {output && (
        <OutputPanel 
          value={output} 
          label={mode === 'encode' ? 'HTML Entities' : 'Decoded Text'} 
          language="html"
        />
      )}
    </ToolShell>
  );
}

