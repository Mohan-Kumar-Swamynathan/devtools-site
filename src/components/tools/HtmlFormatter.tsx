import { useState, useCallback } from 'react';
import CodeEditor from '@/components/common/CodeEditor';
import OutputPanel from '@/components/common/OutputPanel';

export default function HtmlFormatter() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [indent, setIndent] = useState(2);

  const format = useCallback(() => {
    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(input, 'text/html');
      
      const formatNode = (node: Node, level = 0): string => {
        const indentStr = ' '.repeat(level * indent);
        
        if (node.nodeType === Node.TEXT_NODE) {
          const text = node.textContent?.trim();
          return text ? text : '';
        }
        
        if (node.nodeType === Node.ELEMENT_NODE) {
          const elem = node as Element;
          const tagName = elem.tagName.toLowerCase();
          
          // Self-closing tags
          const selfClosing = ['br', 'hr', 'img', 'input', 'meta', 'link', 'area', 'base', 'col', 'embed', 'source', 'track', 'wbr'];
          if (selfClosing.includes(tagName)) {
            const attrs = Array.from(elem.attributes).map(attr => 
              ` ${attr.name}="${attr.value}"`
            ).join('');
            return `${indentStr}<${tagName}${attrs} />`;
          }
          
          const attrs = Array.from(elem.attributes).map(attr => 
            ` ${attr.name}="${attr.value}"`
          ).join('');
          
          const children = Array.from(elem.childNodes).filter(n => 
            n.nodeType === Node.ELEMENT_NODE || (n.nodeType === Node.TEXT_NODE && n.textContent?.trim())
          );
          
          if (children.length === 0) {
            return `${indentStr}<${tagName}${attrs}></${tagName}>`;
          }
          
          const childContent = children.map(child => formatNode(child, level + 1))
            .filter(c => c)
            .join('\n');
          
          return `${indentStr}<${tagName}${attrs}>\n${childContent}\n${indentStr}</${tagName}>`;
        }
        
        return '';
      };
      
      const body = doc.body;
      const formatted = Array.from(body.childNodes)
        .map(node => formatNode(node, 0))
        .filter(c => c)
        .join('\n');
      
      setOutput(formatted);
    } catch (e) {
      setOutput(`Error: ${(e as Error).message}`);
    }
  }, [input, indent]);

  return (
    <div className="space-y-6">
      <CodeEditor
        value={input}
        onChange={setInput}
        language="html"
        label="HTML Input"
        placeholder='<div><p>Hello</p></div>'
      />

      <div className="flex flex-wrap items-center gap-3">
        <button onClick={format} disabled={!input} className="btn-primary">
          Format
        </button>
        <button onClick={() => { setInput(''); setOutput(''); }} className="btn-ghost">
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

      {output && (
        <OutputPanel
          value={output}
          label="Formatted HTML"
          language="html"
          showLineNumbers
        />
      )}
    </div>
  );
}

