import { useState, useCallback, useEffect } from 'react';
import { FileText, BarChart3 } from 'lucide-react';

export default function TextStatistics() {
  const [text, setText] = useState('');

  const calculateStats = useCallback(() => {
    const words = text.trim() ? text.trim().split(/\s+/) : [];
    const characters = text.length;
    const charactersNoSpaces = text.replace(/\s/g, '').length;
    const paragraphs = text.trim() ? text.split(/\n\s*\n/).filter(p => p.trim()) : [];
    const sentences = text.trim() ? text.split(/[.!?]+/).filter(s => s.trim()) : [];
    const lines = text.split('\n').length;
    const readingTime = Math.ceil(words.length / 200); // Average reading speed: 200 words/min
    const longestWord = words.length > 0 ? words.reduce((a, b) => a.length > b.length ? a : b) : '';
    
    return {
      words: words.length,
      characters,
      charactersNoSpaces,
      paragraphs: paragraphs.length,
      sentences: sentences.length,
      lines,
      readingTime,
      longestWord,
      averageWordLength: words.length > 0 
        ? (words.reduce((sum, w) => sum + w.length, 0) / words.length).toFixed(1)
        : '0',
    };
  }, [text]);

  const stats = calculateStats();

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
          <FileText size={20} />
          Input Text
        </h3>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="input w-full h-64"
          placeholder="Paste or type your text here to analyze..."
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
                {stats.readingTime}
              </div>
              <div className="text-sm" style={{ color: 'var(--text-muted)' }}>
                Min read
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
            <div className="p-4 rounded-xl border text-center" style={{
              backgroundColor: 'var(--bg-secondary)',
              borderColor: 'var(--border-primary)'
            }}>
              <div className="text-2xl font-bold mb-1" style={{ color: 'var(--brand-primary)' }}>
                {stats.sentences}
              </div>
              <div className="text-sm" style={{ color: 'var(--text-muted)' }}>
                Sentences
              </div>
            </div>
            <div className="p-4 rounded-xl border text-center" style={{
              backgroundColor: 'var(--bg-secondary)',
              borderColor: 'var(--border-primary)'
            }}>
              <div className="text-2xl font-bold mb-1" style={{ color: 'var(--brand-primary)' }}>
                {stats.lines}
              </div>
              <div className="text-sm" style={{ color: 'var(--text-muted)' }}>
                Lines
              </div>
            </div>
            <div className="p-4 rounded-xl border text-center" style={{
              backgroundColor: 'var(--bg-secondary)',
              borderColor: 'var(--border-primary)'
            }}>
              <div className="text-2xl font-bold mb-1" style={{ color: 'var(--brand-primary)' }}>
                {stats.averageWordLength}
              </div>
              <div className="text-sm" style={{ color: 'var(--text-muted)' }}>
                Avg word length
              </div>
            </div>
          </div>
          {stats.longestWord && (
            <div className="p-4 rounded-xl border" style={{
              backgroundColor: 'var(--bg-secondary)',
              borderColor: 'var(--border-primary)'
            }}>
              <div className="text-sm font-medium mb-1" style={{ color: 'var(--text-muted)' }}>
                Longest Word
              </div>
              <div className="text-base font-semibold" style={{ color: 'var(--text-primary)' }}>
                {stats.longestWord} ({stats.longestWord.length} characters)
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

