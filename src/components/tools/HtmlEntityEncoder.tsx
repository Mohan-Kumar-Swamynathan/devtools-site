import { useState, useCallback } from 'react';
import CodeEditor from '@/components/common/CodeEditor';
import OutputPanel from '@/components/common/OutputPanel';

export default function HtmlEntityEncoder() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');

  const encode = useCallback(() => {
    const encoded = input
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;')
      .replace(/\n/g, '<br>');
    setOutput(encoded);
  }, [input]);

  const decode = useCallback(() => {
    const textarea = document.createElement('textarea');
    textarea.innerHTML = input;
    setOutput(textarea.value);
  }, [input]);

  const handleModeChange = (newMode: 'encode' | 'decode') => {
    setMode(newMode);
    setInput('');
    setOutput('');
  };

  return (
    <div className="space-y-6">
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

      <div className="flex flex-wrap items-center gap-3">
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

      {output && (
        <OutputPanel
          value={output}
          label={mode === 'encode' ? 'Encoded HTML Entities' : 'Decoded Text'}
          language={mode === 'encode' ? 'html' : 'text'}
        />
      )}
    </div>
  );
}

