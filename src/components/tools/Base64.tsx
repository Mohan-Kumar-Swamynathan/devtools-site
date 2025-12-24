import { useState, useCallback } from 'react';
import CodeEditor from '@/components/common/CodeEditor';
import OutputPanel from '@/components/common/OutputPanel';
import { ArrowLeftRight } from 'lucide-react';
import ToolShell from './ToolShell';
import { useToast } from '@/hooks/useToast';

export default function Base64() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');
  const { showToast } = useToast();

  const encode = useCallback(() => {
    try {
      if (!input) return;
      setOutput(btoa(unescape(encodeURIComponent(input))));
      showToast('Encoded successfully', 'success');
    } catch (e) {
      setOutput('');
      showToast(`Error: ${(e as Error).message}`, 'error');
    }
  }, [input, showToast]);

  const decode = useCallback(() => {
    try {
      if (!input) return;
      setOutput(decodeURIComponent(escape(atob(input))));
      showToast('Decoded successfully', 'success');
    } catch (e) {
      setOutput('');
      showToast('Error: Invalid Base64 string', 'error');
    }
  }, [input, showToast]);

  const handleModeChange = (newMode: 'encode' | 'decode') => {
    setMode(newMode);
    setInput('');
    setOutput('');
  };

  const handleClear = () => {
    setInput('');
    setOutput('');
  };

  const handleCopy = () => {
    if (output) {
      navigator.clipboard.writeText(output);
      showToast('Copied to clipboard', 'success');
    }
  };

  const controls = (
    <div className="flex items-center gap-3">
      <div className="flex bg-[var(--bg-tertiary)] p-1 rounded-lg">
        <button
          onClick={() => handleModeChange('encode')}
          className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${mode === 'encode'
              ? 'bg-[var(--bg-primary)] shadow-sm text-[var(--text-primary)]'
              : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
        >
          Encode
        </button>
        <button
          onClick={() => handleModeChange('decode')}
          className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${mode === 'decode'
              ? 'bg-[var(--bg-primary)] shadow-sm text-[var(--text-primary)]'
              : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
        >
          Decode
        </button>
      </div>
      <button
        onClick={mode === 'encode' ? encode : decode}
        disabled={!input}
        className="btn-primary btn-sm px-4 py-1.5 flex items-center gap-2"
      >
        <ArrowLeftRight size={16} />
        {mode === 'encode' ? 'Encode' : 'Decode'}
      </button>
    </div>
  );

  return (
    <ToolShell
      controls={controls}
      onClear={handleClear}
      onCopy={output ? handleCopy : undefined}
    >
      <div className="space-y-6">
        <CodeEditor
          value={input}
          onChange={setInput}
          language="text"
          label={mode === 'encode' ? 'Text to Encode' : 'Base64 to Decode'}
          placeholder={mode === 'encode' ? 'Enter text to encode...' : 'Enter Base64 string...'}
          minHeight="200px"
        />

        {output && (
          <div className="animate-slide-up">
            <OutputPanel
              value={output}
              label={mode === 'encode' ? 'Base64 Encoded' : 'Decoded Text'}
              language="text"
            />
          </div>
        )}
      </div>
    </ToolShell>
  );
}


