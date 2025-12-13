import { useState, useCallback } from 'react';
import CodeEditor from '@/components/common/CodeEditor';
import OutputPanel from '@/components/common/OutputPanel';

export default function JsonXmlConverter() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [mode, setMode] = useState<'json-to-xml' | 'xml-to-json'>('json-to-xml');

  const jsonToXml = useCallback((json: string) => {
    try {
      const obj = JSON.parse(json);
      
      const convert = (obj: any, rootName = 'root'): string => {
        if (typeof obj !== 'object' || obj === null) {
          return String(obj);
        }
        
        if (Array.isArray(obj)) {
          return obj.map((item, idx) => 
            `<item key="${idx}">${convert(item, 'item')}</item>`
          ).join('\n');
        }
        
        let xml = '';
        for (const [key, value] of Object.entries(obj)) {
          const tagName = /^[a-zA-Z_][\w-]*$/.test(key) ? key : 'item';
          if (typeof value === 'object' && value !== null) {
            xml += `<${tagName}>${convert(value, tagName)}</${tagName}>\n`;
          } else {
            xml += `<${tagName}>${String(value)}</${tagName}>\n`;
          }
        }
        return xml;
      };
      
      return `<?xml version="1.0" encoding="UTF-8"?>\n<${rootName}>\n${convert(obj, rootName)}</${rootName}>`;
    } catch (e) {
      throw new Error(`Invalid JSON: ${(e as Error).message}`);
    }
  }, []);

  const xmlToJson = useCallback((xml: string) => {
    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(xml, 'text/xml');
      
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
      return JSON.stringify(convert(root), null, 2);
    } catch (e) {
      throw new Error(`Invalid XML: ${(e as Error).message}`);
    }
  }, []);

  const convert = useCallback(() => {
    setError('');
    try {
      if (mode === 'json-to-xml') {
        setOutput(jsonToXml(input));
      } else {
        setOutput(xmlToJson(input));
      }
    } catch (e) {
      setError((e as Error).message);
      setOutput('');
    }
  }, [input, mode, jsonToXml, xmlToJson]);

  const handleModeChange = (newMode: 'json-to-xml' | 'xml-to-json') => {
    setMode(newMode);
    setInput('');
    setOutput('');
    setError('');
  };

  return (
    <div className="space-y-6">
      <div className="flex gap-2 p-1 rounded-xl" style={{ backgroundColor: 'var(--bg-tertiary)' }}>
        <button
          onClick={() => handleModeChange('json-to-xml')}
          className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            mode === 'json-to-xml' ? 'tab-active' : ''
          }`}
          style={mode === 'json-to-xml' ? { backgroundColor: 'var(--bg-primary)' } : {}}
        >
          JSON → XML
        </button>
        <button
          onClick={() => handleModeChange('xml-to-json')}
          className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            mode === 'xml-to-json' ? 'tab-active' : ''
          }`}
          style={mode === 'xml-to-json' ? { backgroundColor: 'var(--bg-primary)' } : {}}
        >
          XML → JSON
        </button>
      </div>

      <CodeEditor
        value={input}
        onChange={setInput}
        language={mode === 'json-to-xml' ? 'json' : 'xml'}
        label={mode === 'json-to-xml' ? 'JSON Input' : 'XML Input'}
        placeholder={mode === 'json-to-xml' ? '{"name": "John"}' : '<?xml version="1.0"?><root><name>John</name></root>'}
      />

      <div className="flex flex-wrap items-center gap-3">
        <button onClick={convert} disabled={!input} className="btn-primary">
          Convert
        </button>
        <button onClick={() => { setInput(''); setOutput(''); setError(''); }} className="btn-ghost">
          Clear
        </button>
      </div>

      {error && <div className="alert-error">{error}</div>}
      {output && (
        <OutputPanel
          value={output}
          label={mode === 'json-to-xml' ? 'XML Output' : 'JSON Output'}
          language={mode === 'json-to-xml' ? 'xml' : 'json'}
          showLineNumbers
        />
      )}
    </div>
  );
}

