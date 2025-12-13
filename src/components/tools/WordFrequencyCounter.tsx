import { useState, useCallback } from 'react';
import { FileText, BarChart3 } from 'lucide-react';

export default function WordFrequencyCounter() {
  const [text, setText] = useState('');

  const calculateFrequency = useCallback(() => {
    if (!text.trim()) return [];

    const words = text.toLowerCase()
      .replace(/[^\w\s]/g, ' ')
      .split(/\s+/)
      .filter(word => word.length > 0);

    const frequency: Record<string, number> = {};
    words.forEach(word => {
      frequency[word] = (frequency[word] || 0) + 1;
    });

    return Object.entries(frequency)
      .map(([word, count]) => ({ word, count }))
      .sort((a, b) => b.count - a.count);
  }, [text]);

  const frequencies = calculateFrequency();
  const totalWords = frequencies.reduce((sum, item) => sum + item.count, 0);
  const uniqueWords = frequencies.length;
  const maxCount = frequencies[0]?.count || 0;

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
          placeholder="Paste or type your text here to analyze word frequencies..."
        />
      </div>

      {text && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
            <BarChart3 size={20} />
            Word Frequency Analysis
          </h3>
          
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="p-4 rounded-xl border text-center" style={{
              backgroundColor: 'var(--bg-secondary)',
              borderColor: 'var(--border-primary)'
            }}>
              <div className="text-2xl font-bold mb-1" style={{ color: 'var(--brand-primary)' }}>
                {totalWords}
              </div>
              <div className="text-sm" style={{ color: 'var(--text-muted)' }}>
                Total Words
              </div>
            </div>
            <div className="p-4 rounded-xl border text-center" style={{
              backgroundColor: 'var(--bg-secondary)',
              borderColor: 'var(--border-primary)'
            }}>
              <div className="text-2xl font-bold mb-1" style={{ color: 'var(--brand-primary)' }}>
                {uniqueWords}
              </div>
              <div className="text-sm" style={{ color: 'var(--text-muted)' }}>
                Unique Words
              </div>
            </div>
            <div className="p-4 rounded-xl border text-center" style={{
              backgroundColor: 'var(--bg-secondary)',
              borderColor: 'var(--border-primary)'
            }}>
              <div className="text-2xl font-bold mb-1" style={{ color: 'var(--brand-primary)' }}>
                {maxCount}
              </div>
              <div className="text-sm" style={{ color: 'var(--text-muted)' }}>
                Most Frequent
              </div>
            </div>
          </div>

          <div className="p-4 rounded-xl border max-h-96 overflow-y-auto custom-scrollbar" style={{
            backgroundColor: 'var(--bg-secondary)',
            borderColor: 'var(--border-primary)'
          }}>
            <div className="space-y-2">
              {frequencies.slice(0, 50).map(({ word, count }, index) => (
                <div key={index} className="flex items-center gap-3 p-2 rounded-lg hover:bg-[var(--bg-tertiary)] transition-colors">
                  <div className="flex-1 flex items-center gap-3">
                    <span className="text-sm font-medium w-8 text-right" style={{ color: 'var(--text-muted)' }}>
                      {index + 1}
                    </span>
                    <code className="text-sm font-semibold flex-1" style={{ color: 'var(--text-primary)' }}>
                      {word}
                    </code>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-32 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div
                        className="h-2 rounded-full transition-all"
                        style={{
                          width: `${(count / maxCount) * 100}%`,
                          backgroundColor: 'var(--brand-primary)'
                        }}
                      />
                    </div>
                    <span className="text-sm font-semibold w-12 text-right" style={{ color: 'var(--text-primary)' }}>
                      {count}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
