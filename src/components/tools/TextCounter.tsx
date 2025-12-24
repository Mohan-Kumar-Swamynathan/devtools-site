import { useState, useCallback, useEffect } from 'react';
import CodeEditor from '@/components/common/CodeEditor';
import ToolShell from './ToolShell';
import { useToast } from '@/hooks/useToast';

export default function TextCounter() {
  const [input, setInput] = useState('');
  const [stats, setStats] = useState({
    characters: 0,
    charactersNoSpaces: 0,
    words: 0,
    sentences: 0,
    paragraphs: 0,
    lines: 0
  });

  const count = useCallback(() => {
    const characters = input.length;
    const charactersNoSpaces = input.replace(/\s/g, '').length;
    const words = input.trim() ? input.trim().split(/\s+/).length : 0;
    const sentences = input.match(/[.!?]+/g)?.length || 0;
    const paragraphs = input.trim() ? input.split(/\n\s*\n/).filter(p => p.trim()).length : 0;
    const lines = input.split('\n').length;

    setStats({
      characters,
      charactersNoSpaces,
      words,
      sentences,
      paragraphs,
      lines
    });
  }, [input]);

  useEffect(() => {
    count();
  }, [count]);

  const controls = null;

  return (
    <ToolShell className="space-y-6" controls={controls}>
      <CodeEditor
        value={input}
        onChange={(v) => { setInput(v); count(); }}
        language="text"
        label="Text Input"
        placeholder="Enter text to count..."
      />

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl border text-center" style={{ backgroundColor: 'var(--bg-tertiary)', borderColor: 'var(--border-primary)' }}>
          <div className="text-2xl font-bold">{stats.characters}</div>
          <div className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>Characters</div>
        </div>
        <div className="p-4 rounded-xl border text-center" style={{ backgroundColor: 'var(--bg-tertiary)', borderColor: 'var(--border-primary)' }}>
          <div className="text-2xl font-bold">{stats.charactersNoSpaces}</div>
          <div className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>No Spaces</div>
        </div>
        <div className="p-4 rounded-xl border text-center" style={{ backgroundColor: 'var(--bg-tertiary)', borderColor: 'var(--border-primary)' }}>
          <div className="text-2xl font-bold">{stats.words}</div>
          <div className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>Words</div>
        </div>
        <div className="p-4 rounded-xl border text-center" style={{ backgroundColor: 'var(--bg-tertiary)', borderColor: 'var(--border-primary)' }}>
          <div className="text-2xl font-bold">{stats.sentences}</div>
          <div className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>Sentences</div>
        </div>
        <div className="p-4 rounded-xl border text-center" style={{ backgroundColor: 'var(--bg-tertiary)', borderColor: 'var(--border-primary)' }}>
          <div className="text-2xl font-bold">{stats.paragraphs}</div>
          <div className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>Paragraphs</div>
        </div>
        <div className="p-4 rounded-xl border text-center" style={{ backgroundColor: 'var(--bg-tertiary)', borderColor: 'var(--border-primary)' }}>
          <div className="text-2xl font-bold">{stats.lines}</div>
          <div className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>Lines</div>
        </div>
      </div>
    </ToolShell>
  );
}

