import { useState, useCallback } from 'react';
import CodeEditor from '@/components/common/CodeEditor';
import OutputPanel from '@/components/common/OutputPanel';
import ToolShell from './ToolShell';
import { useToast } from '@/hooks/useToast';

export default function JsonToTypescript() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [interfaceName, setInterfaceName] = useState('Root');
  const [error, setError] = useState('');

  const convert = useCallback(() => {
    setError('');
    try {
      const obj = JSON.parse(input);
      
      const generateType = (value: any, name: string = 'Root', depth: number = 0): string => {
        if (depth > 10) return 'any'; // Prevent infinite recursion
        
        if (value === null) return 'null';
        if (Array.isArray(value)) {
          if (value.length === 0) return 'any[]';
          const itemType = generateType(value[0], name, depth + 1);
          return `${itemType}[]`;
        }
        if (typeof value === 'object') {
          const props = Object.entries(value).map(([key, val]) => {
            const propName = /^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(key) ? key : `"${key}"`;
            const propType = generateType(val, key, depth + 1);
            return `  ${propName}: ${propType};`;
          }).join('\n');
          return `{\n${props}\n}`;
        }
        return typeof value;
      };

      const typeDef = `interface ${interfaceName} ${generateType(obj, interfaceName)}`;
      setOutput(`export ${typeDef}`);
    } catch (e) {
      setError(`Invalid JSON: ${(e as Error).message}`);
      setOutput('');
    }
  }, [input, interfaceName]);

  
  const controls = (
          <div className="flex items-center gap-3">
        <button onClick={convert} disabled={!input} className="btn-primary">
          Convert to TypeScript
        </button>
        <button onClick={() => { setInput(''); setOutput(''); setError(''); }} className="btn-ghost">
          Clear
        </button>
      </div>
  );

  return (
    <ToolShell className="space-y-6" controls={controls}>
      <div>
        <label className="label">Interface Name</label>
        <input
          type="text"
          value={interfaceName}
          onChange={(e) => setInterfaceName(e.target.value)}
          placeholder="Root"
          className="input-base"
        />
      </div>

      <CodeEditor
        value={input}
        onChange={setInput}
        language="json"
        label="JSON Input"
        placeholder='{"name": "John", "age": 30}'
      />

{/* Controls moved to header */}








      {error && <div className="alert-error">{error}</div>}
      {output && (
        <OutputPanel
          value={output}
          label="TypeScript Interface"
          language="typescript"
          showLineNumbers
        />
      )}
    </ToolShell>
  );
}

