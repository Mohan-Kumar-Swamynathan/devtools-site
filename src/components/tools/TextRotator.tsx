import { useState, useCallback } from 'react';
import CodeEditor from '@/components/common/CodeEditor';
import OutputPanel from '@/components/common/OutputPanel';
import ToolShell from './ToolShell';
import { useToast } from '@/hooks/useToast';

export default function TextRotator() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [rotation, setRotation] = useState<'ROT13' | 'ROT47'>('ROT13');

  const rot13 = (text: string): string => {
    return text.split('').map(char => {
      const code = char.charCodeAt(0);
      if (code >= 65 && code <= 90) {
        return String.fromCharCode(((code - 65 + 13) % 26) + 65);
      } else if (code >= 97 && code <= 122) {
        return String.fromCharCode(((code - 97 + 13) % 26) + 97);
      }
      return char;
    }).join('');
  };

  const rot47 = (text: string): string => {
    return text.split('').map(char => {
      const code = char.charCodeAt(0);
      if (code >= 33 && code <= 126) {
        return String.fromCharCode(((code - 33 + 47) % 94) + 33);
      }
      return char;
    }).join('');
  };

  const rotate = useCallback(() => {
    setOutput(rotation === 'ROT13' ? rot13(input) : rot47(input));
  }, [input, rotation]);

  const controls = null;

  return (
    <ToolShell className="space-y-6" controls={controls}>
      <div>
        <label className="label">Rotation Type</label>
        <select value={rotation} onChange={(e) => { setRotation(e.target.value as any); rotate(); }} className="input-base">
          <option value="ROT13">ROT13 (A-Z, a-z)</option>
          <option value="ROT47">ROT47 (All printable ASCII)</option>
        </select>
      </div>

      <CodeEditor
        value={input}
        onChange={(v) => { setInput(v); rotate(); }}
        language="text"
        label="Text Input"
        placeholder="Hello World"
      />

      {output && (
        <OutputPanel
          value={output}
          label="Rotated Text"
          language="text"
        />
      )}
    </ToolShell>
  );
}

