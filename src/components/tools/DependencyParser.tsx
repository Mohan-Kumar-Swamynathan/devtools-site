import { useState, useCallback } from 'react';
import CodeEditor from '@/components/common/CodeEditor';
import OutputPanel from '@/components/common/OutputPanel';
import ToolShell from './ToolShell';
import { useToast } from '@/hooks/useToast';

export default function DependencyParser() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [type, setType] = useState<'package.json' | 'requirements.txt' | 'pom.xml' | 'Cargo.toml'>('package.json');

  const parse = useCallback(() => {
    try {
      if (type === 'package.json') {
        const parsed = JSON.parse(input);
        const deps = {
          dependencies: parsed.dependencies || {},
          devDependencies: parsed.devDependencies || {},
          peerDependencies: parsed.peerDependencies || {}
        };
        setOutput(JSON.stringify(deps, null, 2));
      } else if (type === 'requirements.txt') {
        const lines = input.split('\n').filter(l => l.trim() && !l.trim().startsWith('#'));
        const deps = lines.map(line => {
          const match = line.match(/^([^=<>!]+)/);
          return match ? match[1].trim() : line.trim();
        }).filter(Boolean);
        setOutput(JSON.stringify(deps, null, 2));
      } else {
        setOutput('Parser for this format coming soon');
      }
    } catch (e) {
      setOutput(`Error: ${(e as Error).message}`);
    }
  }, [input, type]);

  
  const controls = (
          <div className="flex items-center gap-3">
        <button onClick={parse} disabled={!input} className="btn-primary">
          Parse Dependencies
        </button>
        <button onClick={() => { setInput(''); setOutput(''); }} className="btn-ghost">
          Clear
        </button>
      </div>
  );

  return (
    <ToolShell className="space-y-6" controls={controls}>
      <div>
        <label className="label">File Type</label>
        <select value={type} onChange={(e) => { setType(e.target.value as any); setInput(''); setOutput(''); }} className="input-base">
          <option value="package.json">package.json (Node.js)</option>
          <option value="requirements.txt">requirements.txt (Python)</option>
          <option value="pom.xml">pom.xml (Maven)</option>
          <option value="Cargo.toml">Cargo.toml (Rust)</option>
        </select>
      </div>

      <CodeEditor
        value={input}
        onChange={setInput}
        language={type === 'package.json' ? 'json' : 'text'}
        label={`${type} Content`}
        placeholder={type === 'package.json' ? '{"dependencies": {"react": "^18.0.0"}}' : 'react==18.0.0\nvue==3.0.0'}
      />

{/* Controls moved to header */}








      {output && (
        <OutputPanel
          value={output}
          label="Parsed Dependencies"
          language="json"
          showLineNumbers
        />
      )}
    </ToolShell>
  );
}

