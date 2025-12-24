import { useState, useCallback } from 'react';
import CodeEditor from '@/components/common/CodeEditor';
import OutputPanel from '@/components/common/OutputPanel';
import ToolShell from './ToolShell';
import { useToast } from '@/hooks/useToast';

const asciiChars = ['@', '#', '$', '%', '&', '*', '+', '=', '-', ':', '.', ' '];

export default function AsciiArtGenerator() {
  const [input, setInput] = useState('HELLO');
  const [output, setOutput] = useState('');
  const [font, setFont] = useState<'simple' | 'block'>('simple');

  const generate = useCallback(() => {
    const text = input.toUpperCase();
    const lines: string[] = [];

    if (font === 'simple') {
      // Simple ASCII art using characters
      text.split('').forEach(char => {
        if (char === ' ') {
          lines.push('   ');
        } else {
          const ascii = asciiChars[char.charCodeAt(0) % asciiChars.length];
          lines.push(`${ascii}${ascii}${ascii}`);
        }
      });
      setOutput(lines.join('\n'));
    } else {
      // Block style
      text.split('').forEach(char => {
        if (char === ' ') {
          lines.push('     ');
        } else {
          const pattern = `${char}${char}${char}`;
          lines.push(pattern);
        }
      });
      setOutput(lines.join('\n'));
    }
  }, [input, font]);

  
  const controls = (
          <div className="flex items-center gap-3">
        <button onClick={generate} disabled={!input} className="btn-primary">
          Generate ASCII Art
        </button>
        <button onClick={() => { setInput(''); setOutput(''); }} className="btn-ghost">
          Clear
        </button>
      </div>
  );

  return (
    <ToolShell className="space-y-6" controls={controls}>
      <CodeEditor
        value={input}
        onChange={setInput}
        language="text"
        label="Text Input"
        placeholder="HELLO WORLD"
      />

      <div>
        <label className="label">Font Style</label>
        <select value={font} onChange={(e) => { setFont(e.target.value as any); generate(); }} className="input-base">
          <option value="simple">Simple</option>
          <option value="block">Block</option>
        </select>
      </div>

{/* Controls moved to header */}








      {output && (
        <OutputPanel
          value={output}
          label="ASCII Art"
          language="text"
        />
      )}
    </ToolShell>
  );
}

