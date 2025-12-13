import { useState, useCallback } from 'react';
import CodeEditor from '@/components/common/CodeEditor';
import OutputPanel from '@/components/common/OutputPanel';

export default function JsonTypescript() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [interfaceName, setInterfaceName] = useState('Root');

  const generate = useCallback(() => {
    setError('');
    try {
      const obj = JSON.parse(input);
      
      const generateType = (value: any, name: string, depth = 0): string => {
        const indent = '  '.repeat(depth);
        
        if (value === null) return 'null';
        if (Array.isArray(value)) {
          if (value.length === 0) return 'any[]';
          const itemType = generateType(value[0], 'Item', depth + 1);
          return `${itemType}[]`;
        }
        if (typeof value === 'object') {
          const entries = Object.entries(value);
          if (entries.length === 0) return 'Record<string, any>';
          
          const props = entries.map(([key, val]) => {
            const propName = /^[a-zA-Z_][\w]*$/.test(key) ? key : `"${key}"`;
            const propType = generateType(val, key, depth + 1);
            const optional = val === null || val === undefined ? '?' : '';
            return `${indent}  ${propName}${optional}: ${propType};`;
          }).join('\n');
          
          return `{\n${props}\n${indent}}`;
        }
        
        if (typeof value === 'string') return 'string';
        if (typeof value === 'number') return 'number';
        if (typeof value === 'boolean') return 'boolean';
        return 'any';
      };
      
      const typeDef = generateType(obj, interfaceName);
      const result = `export interface ${interfaceName} ${typeDef}`;
      setOutput(result);
    } catch (e) {
      setError(`Invalid JSON: ${(e as Error).message}`);
      setOutput('');
    }
  }, [input, interfaceName]);

  return (
    <div className="space-y-6">
      <CodeEditor
        value={input}
        onChange={setInput}
        language="json"
        label="JSON Input"
        placeholder='{"name": "John", "age": 30, "active": true}'
      />

      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2">
          <label className="label-inline">Interface name:</label>
          <input
            type="text"
            value={interfaceName}
            onChange={(e) => setInterfaceName(e.target.value)}
            className="input-base w-32"
            placeholder="Root"
          />
        </div>
        <button onClick={generate} disabled={!input} className="btn-primary">
          Generate TypeScript
        </button>
        <button onClick={() => { setInput(''); setOutput(''); setError(''); }} className="btn-ghost">
          Clear
        </button>
      </div>

      {error && <div className="alert-error">{error}</div>}
      {output && (
        <OutputPanel
          value={output}
          label="TypeScript Interface"
          language="typescript"
          showLineNumbers
        />
      )}
    </div>
  );
}

