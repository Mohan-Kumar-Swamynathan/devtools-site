import { useState, useCallback } from 'react';
import CodeEditor from '@/components/common/CodeEditor';
import OutputPanel from '@/components/common/OutputPanel';

export default function SqlFormatter() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [indent, setIndent] = useState(2);

  const format = useCallback(() => {
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
  }, [input, indent]);

  return (
    <div className="space-y-6">
      <CodeEditor
        value={input}
        onChange={setInput}
        language="sql"
        label="SQL Query"
        placeholder="SELECT * FROM users WHERE age > 18 ORDER BY name"
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
          label="Formatted SQL"
          language="sql"
          showLineNumbers
        />
      )}
    </div>
  );
}

