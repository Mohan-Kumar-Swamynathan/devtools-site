import { useState, useCallback, useEffect } from 'react';
import CodeEditor from '@/components/common/CodeEditor';
import { marked } from 'marked';

export default function MarkdownPreview() {
  const [input, setInput] = useState('# Hello World\n\nThis is **markdown** text.');
  const [preview, setPreview] = useState('');

  const updatePreview = useCallback(() => {
    try {
      const html = marked(input);
      setPreview(html);
    } catch (e) {
      setPreview(`<p style="color: var(--status-error);">Error: ${(e as Error).message}</p>`);
    }
  }, [input]);

  // Auto-update preview
  useEffect(() => {
    updatePreview();
  }, [updatePreview]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div>
          <CodeEditor
            value={input}
            onChange={(v) => { setInput(v); updatePreview(); }}
            language="markdown"
            label="Markdown Editor"
            placeholder="# Your markdown here..."
          />
        </div>
        <div>
          <label className="label">Preview</label>
          <div 
            className="p-4 rounded-xl border overflow-auto max-h-[500px] prose prose-slate dark:prose-invert max-w-none"
            style={{ 
              backgroundColor: 'var(--bg-primary)', 
              borderColor: 'var(--border-primary)',
              minHeight: '200px'
            }}
            dangerouslySetInnerHTML={{ __html: preview || '<p class="text-muted">Preview will appear here...</p>' }}
          />
        </div>
      </div>
    </div>
  );
}

