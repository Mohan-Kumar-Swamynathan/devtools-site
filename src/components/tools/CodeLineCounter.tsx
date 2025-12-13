import { useState, useCallback } from 'react';
import CodeEditor from '@/components/common/CodeEditor';

export default function CodeLineCounter() {
  const [input, setInput] = useState('');
  const [stats, setStats] = useState({
    totalLines: 0,
    codeLines: 0,
    blankLines: 0,
    commentLines: 0,
    characters: 0,
    functions: 0,
    classes: 0
  });

  const count = useCallback(() => {
    const lines = input.split('\n');
    const totalLines = lines.length;
    let codeLines = 0;
    let blankLines = 0;
    let commentLines = 0;
    let functions = 0;
    let classes = 0;

    lines.forEach(line => {
      const trimmed = line.trim();
      if (!trimmed) {
        blankLines++;
      } else if (trimmed.startsWith('//') || trimmed.startsWith('/*') || trimmed.startsWith('*') || trimmed.startsWith('#') || trimmed.startsWith('<!--')) {
        commentLines++;
      } else {
        codeLines++;
      }

      // Count functions (simplified)
      if (trimmed.match(/(function|const|let|var)\s+\w+\s*[=:]\s*(\(|function)/)) {
        functions++;
      }
      if (trimmed.match(/class\s+\w+/)) {
        classes++;
      }
    });

    setStats({
      totalLines,
      codeLines,
      blankLines,
      commentLines,
      characters: input.length,
      functions,
      classes
    });
  }, [input]);

  return (
    <div className="space-y-6">
      <CodeEditor
        value={input}
        onChange={(v) => { setInput(v); count(); }}
        language="javascript"
        label="Code Input"
        placeholder="// Your code here
function example() {
  return 'hello';
}"
      />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl border text-center" style={{ backgroundColor: 'var(--bg-tertiary)', borderColor: 'var(--border-primary)' }}>
          <div className="text-2xl font-bold">{stats.totalLines}</div>
          <div className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>Total Lines</div>
        </div>
        <div className="p-4 rounded-xl border text-center" style={{ backgroundColor: 'var(--bg-tertiary)', borderColor: 'var(--border-primary)' }}>
          <div className="text-2xl font-bold">{stats.codeLines}</div>
          <div className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>Code Lines</div>
        </div>
        <div className="p-4 rounded-xl border text-center" style={{ backgroundColor: 'var(--bg-tertiary)', borderColor: 'var(--border-primary)' }}>
          <div className="text-2xl font-bold">{stats.blankLines}</div>
          <div className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>Blank Lines</div>
        </div>
        <div className="p-4 rounded-xl border text-center" style={{ backgroundColor: 'var(--bg-tertiary)', borderColor: 'var(--border-primary)' }}>
          <div className="text-2xl font-bold">{stats.commentLines}</div>
          <div className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>Comments</div>
        </div>
        <div className="p-4 rounded-xl border text-center" style={{ backgroundColor: 'var(--bg-tertiary)', borderColor: 'var(--border-primary)' }}>
          <div className="text-2xl font-bold">{stats.characters}</div>
          <div className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>Characters</div>
        </div>
        <div className="p-4 rounded-xl border text-center" style={{ backgroundColor: 'var(--bg-tertiary)', borderColor: 'var(--border-primary)' }}>
          <div className="text-2xl font-bold">{stats.functions}</div>
          <div className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>Functions</div>
        </div>
        <div className="p-4 rounded-xl border text-center" style={{ backgroundColor: 'var(--bg-tertiary)', borderColor: 'var(--border-primary)' }}>
          <div className="text-2xl font-bold">{stats.classes}</div>
          <div className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>Classes</div>
        </div>
      </div>
    </div>
  );
}

