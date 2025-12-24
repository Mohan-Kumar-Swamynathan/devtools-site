import { useState, useCallback } from 'react';
import CodeEditor from '@/components/common/CodeEditor';
import OutputPanel from '@/components/common/OutputPanel';
import CollapsibleSection from '@/components/common/CollapsibleSection';
import ToolShell from './ToolShell';
import { useToast } from '@/hooks/useToast';

export default function XmlFormatter() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [indent, setIndent] = useState(2);
  const { showToast } = useToast();

  const format = useCallback(() => {
    setError('');
    try {
      if (!input.trim()) return;

      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(input, 'text/xml');

      if (xmlDoc.querySelector('parsererror')) {
        throw new Error('Invalid XML structure');
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

      const formatted = formatNode(xmlDoc.documentElement);
      setOutput(formatted);
      showToast('XML formatted successfully!', 'success');
    } catch (e) {
      const msg = `Invalid XML: ${(e as Error).message}`;
      setError(msg);
      showToast(msg, 'error');
      setOutput('');
    }
  }, [input, indent, showToast]);

  const handleClear = () => {
    setInput('');
    setOutput('');
    setError('');
  };

  const handleCopy = () => {
    if (output) {
      navigator.clipboard.writeText(output);
      showToast('Formatted XML copied to clipboard!', 'success');
    }
  };

  const controls = (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-2">
        <label className="text-sm font-medium text-[var(--text-secondary)]">Indent:</label>
        <select
          value={indent}
          onChange={(e) => setIndent(Number(e.target.value))}
          className="input-sm border-[var(--border-primary)] bg-[var(--bg-tertiary)] rounded-lg py-1 px-2 text-sm focus:ring-2 focus:ring-[var(--brand-primary)] outline-none transition-all"
        >
          <option value={2}>2 spaces</option>
          <option value={4}>4 spaces</option>
          <option value={8}>8 spaces</option>
        </select>
      </div>
      <button
        onClick={format}
        disabled={!input}
        className="btn-primary btn-sm px-4 py-1.5"
      >
        Format
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
        <CollapsibleSection
          title="Input"
          persistKey="xml-formatter-input-expanded"
          defaultExpanded={true}
        >
          <CodeEditor
            value={input}
            onChange={setInput}
            language="xml"
            label="XML Input"
            placeholder='<root><item>value</item></root>'
            rows={8}
            className="min-h-[200px]"
          />
        </CollapsibleSection>

        {error && <div className="alert-error animate-fade-in">{error}</div>}

        {output && (
          <CollapsibleSection
            title="Output"
            persistKey="xml-formatter-output-expanded"
            defaultExpanded={true}
          >
            <div className="animate-slide-up">
              <OutputPanel
                value={output}
                label="Formatted XML"
                language="xml"
                showLineNumbers
              />
            </div>
          </CollapsibleSection>
        )}
      </div>
    </ToolShell>
  );
}

