import { useState, useCallback } from 'react';
import CodeEditor from '@/components/common/CodeEditor';
import OutputPanel from '@/components/common/OutputPanel';
import CollapsibleSection from '@/components/common/CollapsibleSection';
import { AlignLeft } from 'lucide-react';
import ToolShell from './ToolShell';
import { useToast } from '@/hooks/useToast';

export default function SqlFormatter() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [indent, setIndent] = useState(2);
  const { showToast } = useToast();

  const format = useCallback(() => {
    if (!input.trim()) return;

    let formatted = input;

    // Basic SQL formatting
    const keywords = ['SELECT', 'FROM', 'WHERE', 'JOIN', 'INNER', 'LEFT', 'RIGHT', 'ON', 'GROUP BY', 'ORDER BY', 'HAVING', 'INSERT', 'INTO', 'VALUES', 'UPDATE', 'SET', 'DELETE', 'AS', 'AND', 'OR', 'IN', 'NOT', 'EXISTS', 'CASE', 'WHEN', 'THEN', 'ELSE', 'END'];

    keywords.forEach(keyword => {
      const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
      formatted = formatted.replace(regex, keyword);
    });

    // Add line breaks before major keywords
    formatted = formatted.replace(/\b(SELECT|FROM|WHERE|JOIN|GROUP BY|ORDER BY|HAVING|INSERT|UPDATE|DELETE)\b/gi, '\n$1');

    // Indent
    const lines = formatted.split('\n');
    let indentLevel = 0;
    const indented = lines.map(line => {
      const trimmed = line.trim();
      if (!trimmed) return '';

      if (trimmed.match(/\b(WHERE|HAVING|SET)\b/i)) indentLevel = 1;
      if (trimmed.match(/\b(JOIN|ON)\b/i)) indentLevel = 1;
      if (trimmed.match(/\b(AND|OR)\b/i)) indentLevel = 2;

      const indentedLine = ' '.repeat(indentLevel * indent) + trimmed;

      if (trimmed.match(/\b(SELECT|FROM|WHERE|JOIN|GROUP BY|ORDER BY)\b/i)) indentLevel = 0;

      return indentedLine;
    }).filter(l => l).join('\n');

    setOutput(indented.trim());
    showToast('SQL Formatted successfully', 'success');
  }, [input, indent, showToast]);

  const handleClear = () => {
    setInput('');
    setOutput('');
  };

  const handleCopy = () => {
    if (output) {
      navigator.clipboard.writeText(output);
      showToast('Copied to clipboard', 'success');
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
        </select>
      </div>
      <button
        onClick={format}
        disabled={!input}
        className="btn-primary btn-sm px-4 py-1.5 flex items-center gap-2"
      >
        <AlignLeft size={16} />
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
          persistKey="sql-formatter-input-expanded"
          defaultExpanded={true}
        >
          <CodeEditor
            value={input}
            onChange={setInput}
            language="sql"
            label="SQL Query"
            placeholder="SELECT * FROM users WHERE age > 18 ORDER BY name"
            minHeight="200px"
          />
        </CollapsibleSection>

        {output && (
          <CollapsibleSection
            title="Output"
            persistKey="sql-formatter-output-expanded"
            defaultExpanded={true}
          >
            <div className="animate-slide-up">
              <OutputPanel
                value={output}
                label="Formatted SQL"
                language="sql"
                showLineNumbers
              />
            </div>
          </CollapsibleSection>
        )}
      </div>
    </ToolShell>
  );
}

