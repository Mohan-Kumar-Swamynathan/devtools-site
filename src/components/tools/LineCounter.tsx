import { useState, useCallback } from 'react';
import { FileText, BarChart3 } from 'lucide-react';
import ToolShell from './ToolShell';
import { useToast } from '@/hooks/useToast';

export default function LineCounter() {
  const [text, setText] = useState('');

  const calculateStats = useCallback(() => {
    const lines = text.split('\n');
    const nonEmptyLines = lines.filter(line => line.trim().length > 0);
    const words = text.trim() ? text.trim().split(/\s+/) : [];
    const characters = text.length;
    const charactersNoSpaces = text.replace(/\s/g, '').length;
    const paragraphs = text.trim() ? text.split(/\n\s*\n/).filter(p => p.trim()) : [];
    
    return {
      totalLines: lines.length,
      nonEmptyLines: nonEmptyLines.length,
      emptyLines: lines.length - nonEmptyLines.length,
      words: words.length,
      characters,
      charactersNoSpaces,
      paragraphs: paragraphs.length,
    };
  }, [text]);

  const stats = calculateStats();

  const controls = null;

  return (
    <ToolShell className="space-y-6" controls={controls}>
      <div className="space-y-4">
        <h3 className="text-lg font-semibold flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
          <FileText size={20} />
          Input Text
        </h3>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="input w-full h-64 font-mono text-sm"
          placeholder="Paste or type your text here to count lines..."
        />
      </div>

      {text && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
            <BarChart3 size={20} />
            Statistics
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl border text-center" style={{
              backgroundColor: 'var(--bg-secondary)',
              borderColor: 'var(--border-primary)'
            }}>
              <div className="text-2xl font-bold mb-1" style={{ color: 'var(--brand-primary)' }}>
                {stats.totalLines}
              </div>
              <div className="text-sm" style={{ color: 'var(--text-muted)' }}>
                Total Lines
              </div>
            </div>
            <div className="p-4 rounded-xl border text-center" style={{
              backgroundColor: 'var(--bg-secondary)',
              borderColor: 'var(--border-primary)'
            }}>
              <div className="text-2xl font-bold mb-1" style={{ color: 'var(--brand-primary)' }}>
                {stats.nonEmptyLines}
              </div>
              <div className="text-sm" style={{ color: 'var(--text-muted)' }}>
                Non-empty Lines
              </div>
            </div>
            <div className="p-4 rounded-xl border text-center" style={{
              backgroundColor: 'var(--bg-secondary)',
              borderColor: 'var(--border-primary)'
            }}>
              <div className="text-2xl font-bold mb-1" style={{ color: 'var(--brand-primary)' }}>
                {stats.emptyLines}
              </div>
              <div className="text-sm" style={{ color: 'var(--text-muted)' }}>
                Empty Lines
              </div>
            </div>
            <div className="p-4 rounded-xl border text-center" style={{
              backgroundColor: 'var(--bg-secondary)',
              borderColor: 'var(--border-primary)'
            }}>
              <div className="text-2xl font-bold mb-1" style={{ color: 'var(--brand-primary)' }}>
                {stats.words}
              </div>
              <div className="text-sm" style={{ color: 'var(--text-muted)' }}>
                Words
              </div>
            </div>
            <div className="p-4 rounded-xl border text-center" style={{
              backgroundColor: 'var(--bg-secondary)',
              borderColor: 'var(--border-primary)'
            }}>
              <div className="text-2xl font-bold mb-1" style={{ color: 'var(--brand-primary)' }}>
                {stats.characters}
              </div>
              <div className="text-sm" style={{ color: 'var(--text-muted)' }}>
                Characters
              </div>
            </div>
            <div className="p-4 rounded-xl border text-center" style={{
              backgroundColor: 'var(--bg-secondary)',
              borderColor: 'var(--border-primary)'
            }}>
              <div className="text-2xl font-bold mb-1" style={{ color: 'var(--brand-primary)' }}>
                {stats.charactersNoSpaces}
              </div>
              <div className="text-sm" style={{ color: 'var(--text-muted)' }}>
                Characters (no spaces)
              </div>
            </div>
            <div className="p-4 rounded-xl border text-center" style={{
              backgroundColor: 'var(--bg-secondary)',
              borderColor: 'var(--border-primary)'
            }}>
              <div className="text-2xl font-bold mb-1" style={{ color: 'var(--brand-primary)' }}>
                {stats.paragraphs}
              </div>
              <div className="text-sm" style={{ color: 'var(--text-muted)' }}>
                Paragraphs
              </div>
            </div>
          </div>
        </div>
      )}
    </ToolShell>
  );
}

