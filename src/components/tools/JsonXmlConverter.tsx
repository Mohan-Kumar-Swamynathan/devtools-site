import { useState, useCallback } from 'react';
import CodeEditor from '@/components/common/CodeEditor';
import OutputPanel from '@/components/common/OutputPanel';
import { ArrowLeftRight } from 'lucide-react';
import ToolShell from './ToolShell';
import { useToast } from '@/hooks/useToast';

export default function JsonXmlConverter() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [mode, setMode] = useState<'json-to-xml' | 'xml-to-json'>('json-to-xml');
  const { showToast } = useToast();

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

      // Default root name if not provided in recursion
      const finalRoot = 'root';
      return `<?xml version="1.0" encoding="UTF-8"?>\n<${finalRoot}>\n${convert(obj, finalRoot)}</${finalRoot}>`;
    } catch (e) {
      throw new Error(`Invalid JSON: ${(e as Error).message}`);
    }
  }, []);

  const xmlToJson = useCallback((xml: string) => {
    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(xml, 'text/xml');

      if (doc.querySelector('parsererror')) {
        throw new Error('Invalid XML structure');
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
      if (!input.trim()) return;

      if (mode === 'json-to-xml') {
        setOutput(jsonToXml(input));
      } else {
        setOutput(xmlToJson(input));
      }
      showToast('Conversion successful!', 'success');
    } catch (e) {
      setError((e as Error).message);
      setOutput('');
      showToast((e as Error).message, 'error');
    }
  }, [input, mode, jsonToXml, xmlToJson, showToast]);

  const handleModeChange = (newMode: 'json-to-xml' | 'xml-to-json') => {
    setMode(newMode);
    setInput('');
    setOutput('');
    setError('');
  };

  const handleClear = () => {
    setInput('');
    setOutput('');
    setError('');
  };

  const handleCopy = () => {
    if (output) {
      navigator.clipboard.writeText(output);
      showToast('Output copied to clipboard!', 'success');
    }
  };

  const controls = (
    <div className="flex items-center gap-3">
      <div className="flex bg-[var(--bg-tertiary)] p-1 rounded-lg">
        <button
          onClick={() => handleModeChange('json-to-xml')}
          className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${mode === 'json-to-xml'
            ? 'bg-[var(--bg-primary)] shadow-sm text-[var(--text-primary)]'
            : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
        >
          JSON → XML
        </button>
        <button
          onClick={() => handleModeChange('xml-to-json')}
          className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${mode === 'xml-to-json'
            ? 'bg-[var(--bg-primary)] shadow-sm text-[var(--text-primary)]'
            : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
        >
          XML → JSON
        </button>
      </div>
      <button
        onClick={convert}
        disabled={!input}
        className="btn-primary btn-sm px-4 py-1.5 flex items-center gap-2"
      >
        <ArrowLeftRight size={16} />
        Convert
      </button>
    </div>
  );

  return (
    <ToolShell
      controls={controls}
      onClear={handleClear}
      onCopy={output ? handleCopy : undefined}
    >
      <div className="space-y-6">
        <CodeEditor
          value={input}
          onChange={setInput}
          language={mode === 'json-to-xml' ? 'json' : 'xml'}
          label={mode === 'json-to-xml' ? 'JSON Input' : 'XML Input'}
          placeholder={mode === 'json-to-xml' ? '{"name": "John"}' : '<?xml version="1.0"?><root><name>John</name></root>'}
          className="min-h-[200px]"
          rows={8}
        />

        {error && <div className="alert-error animate-fade-in">{error}</div>}

        {output && (
          <div className="animate-slide-up">
            <OutputPanel
              value={output}
              label={mode === 'json-to-xml' ? 'XML Output' : 'JSON Output'}
              language={mode === 'json-to-xml' ? 'xml' : 'json'}
              showLineNumbers
            />
          </div>
        )}
      </div>
    </ToolShell>
  );
}

