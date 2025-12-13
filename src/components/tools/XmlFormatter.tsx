import { useState, useCallback } from 'react';
import CodeEditor from '@/components/common/CodeEditor';
import OutputPanel from '@/components/common/OutputPanel';

export default function XmlFormatter() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [indent, setIndent] = useState(2);

  const format = useCallback(() => {
    setError('');
    try {
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(input, 'text/xml');
      
      if (xmlDoc.querySelector('parsererror')) {
        throw new Error('Invalid XML');
      }
      
      const formatNode = (node: Node, level = 0): string => {
        const indentStr = ' '.repeat(level * indent);
        
        if (node.nodeType === Node.TEXT_NODE) {
          const text = node.textContent?.trim();
          return text ? text : '';
        }
        
        if (node.nodeType === Node.ELEMENT_NODE) {
          const elem = node as Element;
          const tagName = elem.tagName;
          const attrs = Array.from(elem.attributes).map(attr => 
            ` ${attr.name}="${attr.value}"`
          ).join('');
          
          const children = Array.from(elem.childNodes).filter(n => 
            n.nodeType === Node.ELEMENT_NODE || (n.nodeType === Node.TEXT_NODE && n.textContent?.trim())
          );
          
          if (children.length === 0) {
            return `${indentStr}<${tagName}${attrs} />`;
          }
          
          const childContent = children.map(child => formatNode(child, level + 1))
            .filter(c => c)
            .join('\n');
          
          return `${indentStr}<${tagName}${attrs}>\n${childContent}\n${indentStr}</${tagName}>`;
        }
        
        return '';
      };
      
      setOutput(formatNode(xmlDoc.documentElement));
    } catch (e) {
      setError(`Invalid XML: ${(e as Error).message}`);
      setOutput('');
    }
  }, [input, indent]);

  return (
    <div className="space-y-6">
      <CodeEditor
        value={input}
        onChange={setInput}
        language="xml"
        label="XML Input"
        placeholder='<root><item>value</item></root>'
      />

      <div className="flex flex-wrap items-center gap-3">
        <button onClick={format} disabled={!input} className="btn-primary">
          Format
        </button>
        <button onClick={() => { setInput(''); setOutput(''); setError(''); }} className="btn-ghost">
          Clear
        </button>
        <div className="flex items-center gap-2 ml-auto">
          <label className="label-inline">Indent:</label>
          <select value={indent} onChange={(e) => setIndent(Number(e.target.value))} className="input-base w-auto py-2">
            <option value={2}>2 spaces</option>
            <option value={4}>4 spaces</option>
          </select>
        </div>
      </div>

      {error && <div className="alert-error">{error}</div>}
      {output && (
        <OutputPanel
          value={output}
          label="Formatted XML"
          language="xml"
          showLineNumbers
        />
      )}
    </div>
  );
}

