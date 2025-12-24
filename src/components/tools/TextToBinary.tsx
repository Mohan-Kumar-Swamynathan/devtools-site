import { useState, useCallback } from 'react';
import CodeEditor from '@/components/common/CodeEditor';
import OutputPanel from '@/components/common/OutputPanel';
import ToolShell from './ToolShell';
import { useToast } from '@/hooks/useToast';

export default function TextToBinary() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState<'text-to-binary' | 'binary-to-text'>('text-to-binary');

  const textToBinary = useCallback(() => {
    const binary = input.split('').map(char => {
      const code = char.charCodeAt(0);
      return code.toString(2).padStart(8, '0');
    }).join(' ');
    setOutput(binary);
  }, [input]);

  const binaryToText = useCallback(() => {
    try {
      const binary = input.replace(/\s+/g, '');
      const text = binary.match(/.{1,8}/g)?.map(byte => {
        const charCode = parseInt(byte, 2);
        if (charCode > 0 && charCode <= 127) {
          return String.fromCharCode(charCode);
        }
        return '';
      }).join('') || '';
      setOutput(text);
    } catch (e) {
      setOutput(`Error: ${(e as Error).message}`);
    }
  }, [input]);

  const handleModeChange = (newMode: 'text-to-binary' | 'binary-to-text') => {
    setMode(newMode);
    setInput('');
    setOutput('');
  };

  
  const controls = (
          <div className="flex items-center gap-3">
        <button 
          onClick={mode === 'text-to-binary' ? textToBinary : binaryToText} 
          disabled={!input} 
          className="btn-primary"
        >
          Convert
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
          onClick={() => handleModeChange('text-to-binary')}
          className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            mode === 'text-to-binary' ? 'tab-active' : ''
          }`}
          style={mode === 'text-to-binary' ? { backgroundColor: 'var(--bg-primary)' } : {}}
        >
          Text → Binary
        </button>
        <button
          onClick={() => handleModeChange('binary-to-text')}
          className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            mode === 'binary-to-text' ? 'tab-active' : ''
          }`}
          style={mode === 'binary-to-text' ? { backgroundColor: 'var(--bg-primary)' } : {}}
        >
          Binary → Text
        </button>
      </div>

      <CodeEditor
        value={input}
        onChange={setInput}
        language="text"
        label={mode === 'text-to-binary' ? 'Text Input' : 'Binary Input'}
        placeholder={mode === 'text-to-binary' ? 'Hello World' : '01001000 01100101 01101100 01101100 01101111'}
      />

{/* Controls moved to header */}












      {output && (
        <OutputPanel
          value={output}
          label={mode === 'text-to-binary' ? 'Binary Output' : 'Text Output'}
          language="text"
        />
      )}
    </ToolShell>
  );
}

