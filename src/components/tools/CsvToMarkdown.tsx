import { useState, useCallback } from 'react';
import CodeEditor from '@/components/common/CodeEditor';
import OutputPanel from '@/components/common/OutputPanel';

export default function CsvToMarkdown() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');

  const convert = useCallback(() => {
    const lines = input.trim().split('\n');
    if (lines.length === 0) {
      setOutput('');
      return;
    }

    const rows = lines.map(line => line.split(',').map(cell => cell.trim()));
    if (rows.length === 0) {
      setOutput('');
      return;
    }

    // Header row
    const header = rows[0];
    const separator = header.map(() => '---').join(' | ');
    
    let markdown = `| ${header.join(' | ')} |\n`;
    markdown += `| ${separator} |\n`;
    
    // Data rows
    for (let i = 1; i < rows.length; i++) {
      markdown += `| ${rows[i].join(' | ')} |\n`;
    }

    setOutput(markdown.trim());
  }, [input]);

  return (
    <div className="space-y-6">
      <CodeEditor
        value={input}
        onChange={(v) => { setInput(v); convert(); }}
        language="text"
        label="CSV Input"
        placeholder="name,age,city
John,30,NYC
Jane,25,LA"
      />

      {output && (
        <OutputPanel
          value={output}
          label="Markdown Table"
          language="markdown"
          showLineNumbers
        />
      )}
    </div>
  );
}
