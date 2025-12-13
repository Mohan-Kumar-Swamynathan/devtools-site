import { useState, useCallback, useEffect } from 'react';
import CodeEditor from '@/components/common/CodeEditor';
import OutputPanel from '@/components/common/OutputPanel';
import { marked } from 'marked';

export default function MarkdownToHtml() {
  const [markdown, setMarkdown] = useState('# Hello World\n\nThis is **markdown** text.');
  const [html, setHtml] = useState('');
  const [error, setError] = useState('');

  const convert = useCallback(() => {
    setError('');
    try {
      const converted = marked(markdown);
      setHtml(converted);
    } catch (e) {
      setError(`Conversion error: ${(e as Error).message}`);
      setHtml('');
    }
  }, [markdown]);

  useEffect(() => {
    convert();
  }, [convert]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div>
          <CodeEditor
            value={markdown}
            onChange={setMarkdown}
            language="markdown"
            label="Markdown Input"
            placeholder="# Your markdown here..."
          />
        </div>
        <div>
          <label className="label">HTML Output</label>
          {html && (
            <div
              className="p-4 rounded-xl border overflow-auto max-h-[500px]"
              style={{
                backgroundColor: 'var(--bg-primary)',
                borderColor: 'var(--border-primary)',
                minHeight: '200px'
              }}
              dangerouslySetInnerHTML={{ __html: html }}
            />
          )}
          {!html && (
            <div
              className="p-4 rounded-xl border"
              style={{
                backgroundColor: 'var(--bg-primary)',
                borderColor: 'var(--border-primary)',
                minHeight: '200px',
                color: 'var(--text-muted)'
              }}
            >
              HTML will appear here...
            </div>
          )}
        </div>
      </div>

      {html && (
        <OutputPanel
          value={html}
          label="HTML Code"
          language="html"
          showLineNumbers
        />
      )}
    </div>
  );
}
