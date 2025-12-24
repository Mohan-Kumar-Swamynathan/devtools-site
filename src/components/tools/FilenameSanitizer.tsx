import { useState, useCallback } from 'react';
import CodeEditor from '@/components/common/CodeEditor';
import OutputPanel from '@/components/common/OutputPanel';
import ToolShell from './ToolShell';
import { useToast } from '@/hooks/useToast';

export default function FilenameSanitizer() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [target, setTarget] = useState<'unix' | 'windows' | 'both'>('both');

  const sanitize = useCallback(() => {
    let sanitized = input;

    // Remove invalid characters based on target
    if (target === 'windows' || target === 'both') {
      sanitized = sanitized.replace(/[<>:"|?*\x00-\x1f]/g, '');
    }
    if (target === 'unix' || target === 'both') {
      sanitized = sanitized.replace(/[\/\x00]/g, '');
    }

    // Remove leading/trailing dots and spaces
    sanitized = sanitized.replace(/^[.\s]+|[.\s]+$/g, '');

    // Replace multiple spaces with single space
    sanitized = sanitized.replace(/\s+/g, ' ');

    // Limit length (Windows has 255 char limit for filename)
    if (sanitized.length > 255) {
      sanitized = sanitized.substring(0, 255);
    }

    setOutput(sanitized);
  }, [input, target]);

  const controls = null;

  return (
    <ToolShell className="space-y-6" controls={controls}>
      <div>
        <label className="label">Target Platform</label>
        <select value={target} onChange={(e) => { setTarget(e.target.value as any); sanitize(); }} className="input-base">
          <option value="both">Both (Strict)</option>
          <option value="unix">Unix/Linux/Mac</option>
          <option value="windows">Windows</option>
        </select>
      </div>

      <CodeEditor
        value={input}
        onChange={(v) => { setInput(v); sanitize(); }}
        language="text"
        label="Filename"
        placeholder="my file<>name.txt"
      />

      {output && (
        <OutputPanel
          value={output}
          label="Sanitized Filename"
          language="text"
        />
      )}
    </ToolShell>
  );
}

