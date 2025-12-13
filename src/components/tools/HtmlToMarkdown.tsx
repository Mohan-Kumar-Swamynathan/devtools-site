import { useState, useCallback } from 'react';
import CodeEditor from '@/components/common/CodeEditor';
import OutputPanel from '@/components/common/OutputPanel';

export default function HtmlToMarkdown() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');

  const convert = useCallback(() => {
    try {
      const div = document.createElement('div');
      div.innerHTML = input;
      
      // Simple HTML to Markdown conversion
      let markdown = div.textContent || div.innerText || '';
      
      // Convert headings (simplified)
      markdown = markdown.replace(/<h1>(.*?)<\/h1>/gi, '# $1\n');
      markdown = markdown.replace(/<h2>(.*?)<\/h2>/gi, '## $1\n');
      markdown = markdown.replace(/<h3>(.*?)<\/h3>/gi, '### $1\n');
      markdown = markdown.replace(/<strong>(.*?)<\/strong>/gi, '**$1**');
      markdown = markdown.replace(/<em>(.*?)<\/em>/gi, '*$1*');
      markdown = markdown.replace(/<code>(.*?)<\/code>/gi, '`$1`');
      markdown = markdown.replace(/<a href="(.*?)">(.*?)<\/a>/gi, '[$2]($1)');
      
      setOutput(markdown.trim());
    } catch (e) {
      setOutput(`Error: ${(e as Error).message}`);
    }
  }, [input]);

  return (
    <div className="space-y-6">
      <CodeEditor
        value={input}
        onChange={(v) => { setInput(v); convert(); }}
        language="html"
        label="HTML Input"
        placeholder='<h1>Hello World</h1><p>This is <strong>bold</strong> text.</p>'
      />

      {output && (
        <OutputPanel
          value={output}
          label="Markdown Output"
          language="markdown"
          showLineNumbers
        />
      )}
    </div>
  );
}

