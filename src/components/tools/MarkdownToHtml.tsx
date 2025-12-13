import { useState, useCallback } from 'react';
import CodeEditor from '@/components/common/CodeEditor';
import OutputPanel from '@/components/common/OutputPanel';
import { marked } from 'marked';

export default function MarkdownToHtml() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');

  const convert = useCallback(() => {
    try {
      const html = marked.parse(input);
      setOutput(html);
    } catch (e) {
      setOutput(`Error: ${(e as Error).message}`);
    }
  }, [input]);

  return (
    <div className="space-y-6">
      <CodeEditor
        value={input}
        onChange={(v) => { setInput(v); convert(); }}
        language="markdown"
        label="Markdown Input"
        placeholder="# Hello World\n\nThis is **bold** text."
      />

      {output && (
        <OutputPanel
          value={output}
          label="HTML Output"
          language="html"
          showLineNumbers
        />
      )}
    </div>
  );
}

