import { useState, useCallback, useEffect, useRef } from 'react';
import { marked } from 'marked';
import { Highlight } from 'prism-react-renderer';
import { ChevronDown, ChevronUp, Copy, Check, RotateCcw } from 'lucide-react';

// Configure marked with GFM support
marked.setOptions({
  breaks: true,
  gfm: true,
});

// Example markdown snippets
const examples = {
  basic: `# This is a Heading h1
## This is a Heading h2
### This is a Heading h3
#### This is a Heading h4
##### This is a Heading h5
###### This is a Heading h6

This is a paragraph with **bold text** and *italic text*.

You can also use __bold__ and _italic_ syntax.

***Bold and italic together***

- Unordered list item 1
- Unordered list item 2
  - Nested item 2a
  - Nested item 2b

1. Ordered list item 1
2. Ordered list item 2
3. Ordered list item 3

> This is a blockquote
> It can span multiple lines

\`inline code\`

\`\`\`javascript
// Code block with syntax highlighting
function example() {
  return "Hello World";
}
\`\`\`

[Link text](https://example.com)

![Image alt text](https://via.placeholder.com/150)

---

| Column 1 | Column 2 | Column 3 |
|----------|----------|----------|
| Cell 1   | Cell 2   | Cell 3   |
| Cell 4   | Cell 5   | Cell 6   |`,
  
  advanced: `# Advanced Markdown Examples

## Task Lists
- [x] Completed task
- [ ] Incomplete task
- [x] Another completed task

## Strikethrough
~~This text is strikethrough~~

## Tables with Alignment
| Left | Center | Right |
|:-----|:------:|------:|
| Left | Center | Right |
| Data | Data   | Data  |

## Code Blocks
\`\`\`python
def hello_world():
    print("Hello, World!")
    return True
\`\`\`

\`\`\`bash
#!/bin/bash
echo "Hello from bash"
\`\`\`

## Links with Titles
[Markdown Guide](https://www.markdownguide.org "Visit Markdown Guide")

## Reference-style Links
[Reference link][1]

[1]: https://example.com

## Horizontal Rules
***

---

___

## Emphasis Combinations
**Bold** and *italic* and ***bold italic***
__Bold__ and _italic_ and ___bold italic___

## Escaped Characters
\\*This is not italic\\*
\\# This is not a heading`,
  
  github: `# GitHub Flavored Markdown

## Mentions
@username

## Issues and PRs
#123
#456

## Emoji
:smile: :heart: :rocket: :+1:

## Fenced Code Blocks
\`\`\`typescript
interface User {
  name: string;
  age: number;
}

const user: User = {
  name: "John",
  age: 30
};
\`\`\`

## Math (if supported)
Inline math: $E = mc^2$

Block math:
$$
\\sum_{i=1}^{n} x_i
$$

## Footnotes
Here's a sentence with a footnote[^1].

[^1]: This is the footnote content.`
};

export default function MarkdownPreview() {
  const [input, setInput] = useState('# Hello World\n\nThis is **markdown** text.');
  const [preview, setPreview] = useState('');
  const [expandedExample, setExpandedExample] = useState<string | null>(null);
  const [syncScroll, setSyncScroll] = useState(true);
  const [copied, setCopied] = useState(false);
  const editorRef = useRef<HTMLTextAreaElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const editorScrollRef = useRef<HTMLDivElement>(null);
  const previewScrollRef = useRef<HTMLDivElement>(null);

  const updatePreview = useCallback(() => {
    try {
      const html = marked.parse(input, { breaks: true, gfm: true });
      setPreview(html as string);
    } catch (e) {
      setPreview(`<p style="color: var(--status-error);">Error: ${(e as Error).message}</p>`);
    }
  }, [input]);

  // Auto-update preview
  useEffect(() => {
    updatePreview();
  }, [updatePreview]);

  // Sync scroll between editor and preview
  useEffect(() => {
    if (!syncScroll || !editorScrollRef.current || !previewScrollRef.current) return;

    const editor = editorScrollRef.current;
    const preview = previewScrollRef.current;
    let isScrolling = false;

    const handleEditorScroll = () => {
      if (!syncScroll || isScrolling) return;
      isScrolling = true;
      const editorScroll = editor.scrollTop;
      const editorHeight = editor.scrollHeight - editor.clientHeight;
      const previewHeight = preview.scrollHeight - preview.clientHeight;
      
      if (editorHeight > 0 && previewHeight > 0) {
        const ratio = previewHeight / editorHeight;
        preview.scrollTop = editorScroll * ratio;
      }
      setTimeout(() => { isScrolling = false; }, 10);
    };

    const handlePreviewScroll = () => {
      if (!syncScroll || isScrolling) return;
      isScrolling = true;
      const previewScroll = preview.scrollTop;
      const previewHeight = preview.scrollHeight - preview.clientHeight;
      const editorHeight = editor.scrollHeight - editor.clientHeight;
      
      if (previewHeight > 0 && editorHeight > 0) {
        const ratio = editorHeight / previewHeight;
        editor.scrollTop = previewScroll * ratio;
      }
      setTimeout(() => { isScrolling = false; }, 10);
    };

    editor.addEventListener('scroll', handleEditorScroll);
    preview.addEventListener('scroll', handlePreviewScroll);

    return () => {
      editor.removeEventListener('scroll', handleEditorScroll);
      preview.removeEventListener('scroll', handlePreviewScroll);
    };
  }, [syncScroll]);

  // Sync textarea scroll with highlight container
  useEffect(() => {
    if (!editorRef.current || !editorScrollRef.current) return;
    
    const textarea = editorRef.current;
    const container = editorScrollRef.current;
    
    const handleTextareaScroll = () => {
      container.scrollTop = textarea.scrollTop;
      container.scrollLeft = textarea.scrollLeft;
    };
    
    textarea.addEventListener('scroll', handleTextareaScroll);
    
    return () => {
      textarea.removeEventListener('scroll', handleTextareaScroll);
    };
  }, []);

  const loadExample = (key: keyof typeof examples) => {
    setInput(examples[key]);
    setExpandedExample(null);
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(input);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      console.error('Failed to copy:', e);
    }
  };

  const handleReset = () => {
    setInput('# Hello World\n\nThis is **markdown** text.');
    setExpandedExample(null);
  };

  return (
    <div className="space-y-6">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl border" 
        style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-primary)' }}>
        <div className="flex items-center gap-4">
          <button
            onClick={handleReset}
            className="btn-secondary text-sm flex items-center gap-2"
            title="Reset to default"
          >
            <RotateCcw size={16} />
            Reset
          </button>
          <button
            onClick={handleCopy}
            className="btn-secondary text-sm flex items-center gap-2 relative"
            title={copied ? 'Copied!' : 'Copy markdown'}
          >
            {copied ? (
              <>
                <Check size={16} className="text-green-500" />
                Copied!
              </>
            ) : (
              <>
                <Copy size={16} />
                Copy
              </>
            )}
          </button>
        </div>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={syncScroll}
            onChange={(e) => setSyncScroll(e.target.checked)}
            className="w-4 h-4"
          />
          <span className="text-sm" style={{ color: 'var(--text-primary)' }}>Sync scroll</span>
        </label>
      </div>

      {/* Examples Section */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setExpandedExample(expandedExample === 'examples' ? null : 'examples')}
            className="flex items-center gap-2 text-sm font-medium"
            style={{ color: 'var(--text-primary)' }}
          >
            {expandedExample === 'examples' ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            Markdown Syntax Guide
          </button>
        </div>
        {expandedExample === 'examples' && (
          <div className="p-4 rounded-xl border space-y-3 animate-fade-in"
            style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-primary)' }}>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => loadExample('basic')}
                className="btn-secondary text-sm"
              >
                Basic Examples
              </button>
              <button
                onClick={() => loadExample('advanced')}
                className="btn-secondary text-sm"
              >
                Advanced Examples
              </button>
              <button
                onClick={() => loadExample('github')}
                className="btn-secondary text-sm"
              >
                GitHub Flavored
              </button>
            </div>
            <div className="text-sm space-y-2" style={{ color: 'var(--text-secondary)' }}>
              <p><strong>Headers:</strong> Use # for h1, ## for h2, etc.</p>
              <p><strong>Bold:</strong> **text** or __text__</p>
              <p><strong>Italic:</strong> *text* or _text_</p>
              <p><strong>Lists:</strong> Use - or * for unordered, 1. for ordered</p>
              <p><strong>Code:</strong> `inline` or ```language for blocks</p>
              <p><strong>Links:</strong> [text](url) or [text][ref]</p>
              <p><strong>Images:</strong> ![alt](url)</p>
              <p><strong>Tables:</strong> Use pipes | to separate columns</p>
            </div>
          </div>
        )}
      </div>

      {/* Editor and Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Editor */}
        <div className="flex flex-col">
          <label className="label mb-2">Markdown Editor</label>
          <div
            ref={editorScrollRef}
            className="relative rounded-xl border overflow-auto"
            style={{
              backgroundColor: 'var(--bg-primary)',
              borderColor: 'var(--border-primary)',
              maxHeight: '600px',
              minHeight: '400px'
            }}
          >
            <div className="relative w-full" style={{ minHeight: '400px' }}>
              <Highlight
                code={input}
                language="markdown"
                theme={{
                  plain: {
                    color: 'var(--text-primary)',
                    backgroundColor: 'transparent',
                  },
                  styles: [
                    {
                      types: ['comment', 'prolog', 'doctype', 'cdata'],
                      style: { color: 'var(--syntax-comment)', fontStyle: 'italic' }
                    },
                    {
                      types: ['punctuation'],
                      style: { color: 'var(--syntax-punctuation)' }
                    },
                    {
                      types: ['property', 'tag', 'boolean', 'number', 'constant', 'symbol'],
                      style: { color: 'var(--syntax-number)' }
                    },
                    {
                      types: ['selector', 'attr-name', 'string', 'char', 'builtin'],
                      style: { color: 'var(--syntax-string)' }
                    },
                    {
                      types: ['operator', 'entity', 'url'],
                      style: { color: 'var(--syntax-operator)' }
                    },
                    {
                      types: ['atrule', 'attr-value', 'keyword'],
                      style: { color: 'var(--syntax-keyword)' }
                    },
                    {
                      types: ['function', 'class-name'],
                      style: { color: 'var(--syntax-function)' }
                    },
                    {
                      types: ['regex', 'important', 'variable'],
                      style: { color: 'var(--syntax-variable)' }
                    }
                  ]
                }}
              >
                {({ className, style, tokens, getLineProps, getTokenProps }) => (
                  <pre 
                    className={className} 
                    style={{ 
                      ...style, 
                      margin: 0, 
                      padding: '1rem', 
                      fontFamily: 'JetBrains Mono, monospace', 
                      fontSize: '0.875rem', 
                      lineHeight: '1.75',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      overflow: 'hidden',
                      pointerEvents: 'none',
                      zIndex: 0
                    }}
                  >
                    <code style={{ display: 'block' }}>
                      {tokens.map((line, i) => (
                        <div key={i} {...getLineProps({ line })}>
                          {line.map((token, key) => (
                            <span key={key} {...getTokenProps({ token })} />
                          ))}
                        </div>
                      ))}
                    </code>
                  </pre>
                )}
              </Highlight>
              <textarea
                ref={editorRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="# Your markdown here..."
                spellCheck={false}
                className="relative w-full p-4 font-mono text-sm leading-relaxed resize-none bg-transparent caret-current outline-none"
                style={{
                  color: 'transparent',
                  caretColor: 'var(--text-primary)',
                  zIndex: 1,
                  fontFamily: 'JetBrains Mono, monospace',
                  fontSize: '0.875rem',
                  lineHeight: '1.75',
                  minHeight: '400px',
                  height: '100%',
                }}
              />
            </div>
          </div>
          <div className="flex items-center justify-between mt-2 text-xs" style={{ color: 'var(--text-muted)' }}>
            <span>{input.split('\n').length} lines • {input.length} characters</span>
            <span className="uppercase">markdown</span>
          </div>
        </div>

        {/* Preview */}
        <div className="flex flex-col">
          <label className="label mb-2">Preview</label>
          <div
            ref={previewScrollRef}
            className="p-4 rounded-xl border overflow-auto prose prose-slate dark:prose-invert max-w-none"
            style={{
              backgroundColor: 'var(--bg-primary)',
              borderColor: 'var(--border-primary)',
              maxHeight: '600px',
              minHeight: '400px'
            }}
          >
            {preview ? (
              <div
                ref={previewRef}
                dangerouslySetInnerHTML={{ __html: preview }}
                style={{
                  color: 'var(--text-primary)',
                }}
              />
            ) : (
              <p style={{ color: 'var(--text-muted)' }}>Preview will appear here...</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
