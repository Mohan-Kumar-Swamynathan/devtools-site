import { useState, useCallback } from 'react';
import CodeEditor from '@/components/common/CodeEditor';
import OutputPanel from '@/components/common/OutputPanel';
import ToolShell from './ToolShell';
import { useToast } from '@/hooks/useToast';

export default function PathNormalizer() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [target, setTarget] = useState<'unix' | 'windows' | 'auto'>('auto');

  const normalize = useCallback(() => {
    let normalized = input;

    if (target === 'unix') {
      normalized = normalized.replace(/\\/g, '/');
      normalized = normalized.replace(/\/+/g, '/');
    } else if (target === 'windows') {
      normalized = normalized.replace(/\//g, '\\');
      normalized = normalized.replace(/\\+/g, '\\');
    } else {
      // Auto-detect and normalize
      const hasBackslash = normalized.includes('\\');
      const hasForwardSlash = normalized.includes('/');
      
      if (hasBackslash && !hasForwardSlash) {
        normalized = normalized.replace(/\\+/g, '\\');
      } else {
        normalized = normalized.replace(/\\/g, '/');
        normalized = normalized.replace(/\/+/g, '/');
      }
    }

    // Remove leading/trailing slashes
    normalized = normalized.replace(/^[\/\\]+|[\/\\]+$/g, '');

    setOutput(normalized);
  }, [input, target]);

  const controls = null;

  return (
    <ToolShell className="space-y-6" controls={controls}>
      <div>
        <label className="label">Target Platform</label>
        <select value={target} onChange={(e) => { setTarget(e.target.value as any); normalize(); }} className="input-base">
          <option value="auto">Auto-detect</option>
          <option value="unix">Unix/Linux/Mac</option>
          <option value="windows">Windows</option>
        </select>
      </div>

      <CodeEditor
        value={input}
        onChange={(v) => { setInput(v); normalize(); }}
        language="text"
        label="File Path"
        placeholder="C:\\Users\\Documents\\file.txt"
      />

      {output && (
        <OutputPanel
          value={output}
          label="Normalized Path"
          language="text"
        />
      )}
    </ToolShell>
  );
}

