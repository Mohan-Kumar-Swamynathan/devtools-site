import { useState, useCallback } from 'react';
import OutputPanel from '@/components/common/OutputPanel';
import CollapsibleSection from '@/components/common/CollapsibleSection';
import ToolShell from './ToolShell';
import { useToast } from '@/hooks/useToast';

export default function Iso8601Formatter() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState<'format' | 'parse'>('format');

  const format = useCallback(() => {
    try {
      const date = input ? new Date(input) : new Date();
      const iso = date.toISOString();
      setOutput(iso);
    } catch (e) {
      setOutput(`Error: ${(e as Error).message}`);
    }
  }, [input]);

  const parse = useCallback(() => {
    try {
      const date = new Date(input);
      if (isNaN(date.getTime())) {
        throw new Error('Invalid ISO 8601 date');
      }
      const formatted = {
        iso8601: date.toISOString(),
        local: date.toLocaleString(),
        utc: date.toUTCString(),
        timestamp: date.getTime(),
        year: date.getUTCFullYear(),
        month: date.getUTCMonth() + 1,
        day: date.getUTCDate(),
        hour: date.getUTCHours(),
        minute: date.getUTCMinutes(),
        second: date.getUTCSeconds()
      };
      setOutput(JSON.stringify(formatted, null, 2));
    } catch (e) {
      setOutput(`Error: ${(e as Error).message}`);
    }
  }, [input]);

  const handleModeChange = (newMode: 'format' | 'parse') => {
    setMode(newMode);
    setInput('');
    setOutput('');
  };


  const controls = (
    <div className="flex items-center gap-3">
      <button
        onClick={mode === 'format' ? format : parse}
        disabled={!input && mode === 'parse'}
        className="btn-primary"
      >
        {mode === 'format' ? 'Format' : 'Parse'}
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
          onClick={() => handleModeChange('format')}
          className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-all ${mode === 'format' ? 'tab-active' : ''
            }`}
          style={mode === 'format' ? { backgroundColor: 'var(--bg-primary)' } : {}}
        >
          Format to ISO 8601
        </button>
        <button
          onClick={() => handleModeChange('parse')}
          className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-all ${mode === 'parse' ? 'tab-active' : ''
            }`}
          style={mode === 'parse' ? { backgroundColor: 'var(--bg-primary)' } : {}}
        >
          Parse ISO 8601
        </button>
      </div>

      <CollapsibleSection
        title="Input"
        persistKey="iso8601-formatter-input-expanded"
        defaultExpanded={true}
      >
        <div>
          <label className="label">{mode === 'format' ? 'Date Input' : 'ISO 8601 String'}</label>
          <input
            type={mode === 'format' ? 'datetime-local' : 'text'}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={mode === 'format' ? '' : '2024-01-01T00:00:00.000Z'}
            className="input-base"
          />
        </div>
      </CollapsibleSection>

      {/* Controls moved to header */}












      {output && (
        <CollapsibleSection
          title="Output"
          persistKey="iso8601-formatter-output-expanded"
          defaultExpanded={true}
        >
          <OutputPanel
            value={output}
            label={mode === 'format' ? 'ISO 8601 Output' : 'Parsed Date'}
            language={mode === 'parse' ? 'json' : 'text'}
            showLineNumbers={mode === 'parse'}
          />
        </CollapsibleSection>
      )}
    </ToolShell>
  );
}
