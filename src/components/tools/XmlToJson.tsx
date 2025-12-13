import { useState, useCallback } from 'react';
import CodeEditor from '@/components/common/CodeEditor';
import OutputPanel from '@/components/common/OutputPanel';

export default function XmlToJson() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');

  const convert = useCallback(() => {
    setError('');
    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(input, 'text/xml');
      
      if (doc.querySelector('parsererror')) {
        throw new Error('Invalid XML');
      }
      
      const convert = (node: Element): any => {
        if (node.children.length === 0) {
          const text = node.textContent?.trim() || '';
          if (!text) return {};
          const num = Number(text);
          return isNaN(num) ? text : num;
        }
        
        const obj: Record<string, any> = {};
        for (const child of Array.from(node.children)) {
          const key = child.tagName;
          if (obj[key]) {
            if (!Array.isArray(obj[key])) {
              obj[key] = [obj[key]];
            }
            obj[key].push(convert(child));
          } else {
            obj[key] = convert(child);
          }
        }
        return obj;
      };
      
      const root = doc.documentElement;
      setOutput(JSON.stringify(convert(root), null, 2));
    } catch (e) {
      setError(`Invalid XML: ${(e as Error).message}`);
      setOutput('');
    }
  }, [input]);

  return (
    <div className="space-y-6">
      <CodeEditor
        value={input}
        onChange={setInput}
        language="xml"
        label="XML Input"
        placeholder='<?xml version="1.0"?><root><item>value</item></root>'
      />

      <div className="flex flex-wrap items-center gap-3">
        <button onClick={convert} disabled={!input} className="btn-primary">
          Convert to JSON
        </button>
        <button onClick={() => { setInput(''); setOutput(''); setError(''); }} className="btn-ghost">
          Clear
        </button>
      </div>

      {error && <div className="alert-error">{error}</div>}
      {output && (
        <OutputPanel
          value={output}
          label="JSON Output"
          language="json"
          showLineNumbers
        />
      )}
    </div>
  );
}

