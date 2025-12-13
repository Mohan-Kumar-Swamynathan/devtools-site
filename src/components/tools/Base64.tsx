import { useState, useCallback } from 'react';
import CodeEditor from '@/components/common/CodeEditor';
import OutputPanel from '@/components/common/OutputPanel';

export default function Base64() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');

  const encode = useCallback(() => {
    try {
      setOutput(btoa(unescape(encodeURIComponent(input))));
    } catch (e) {
      setOutput(`Error: ${(e as Error).message}`);
    }
  }, [input]);

  const decode = useCallback(() => {
    try {
      setOutput(decodeURIComponent(escape(atob(input))));
    } catch (e) {
      setOutput(`Error: Invalid Base64 string`);
    }
  }, [input]);

  const handleModeChange = (newMode: 'encode' | 'decode') => {
    setMode(newMode);
    setInput('');
    setOutput('');
  };

  return (
    <div className="space-y-6">
      {/* Mode Toggle */}
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
        language="text"
        label={mode === 'encode' ? 'Text to Encode' : 'Base64 to Decode'}
        placeholder={mode === 'encode' ? 'Enter text to encode...' : 'Enter Base64 string...'}
      />

      {/* Actions */}
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

      {/* Output */}
      {output && (
        <OutputPanel 
          value={output} 
          label={mode === 'encode' ? 'Base64 Encoded' : 'Decoded Text'} 
          language="text"
        />
      )}
    </div>
  );
}


