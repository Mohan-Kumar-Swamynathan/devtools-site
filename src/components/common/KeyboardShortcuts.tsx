import { useEffect, useState } from 'react';
import { X, Keyboard } from 'lucide-react';
import clsx from 'clsx';

interface Shortcut {
  key: string;
  description: string;
  category: string;
}

const shortcuts: Shortcut[] = [
  { key: '⌘K / Ctrl+K', description: 'Focus search', category: 'Navigation' },
  { key: 'Esc', description: 'Close modals/dropdowns', category: 'Navigation' },
  { key: '⌘/ / Ctrl+/', description: 'Show keyboard shortcuts', category: 'Navigation' },
  { key: '⌘D / Ctrl+D', description: 'Toggle dark mode', category: 'Appearance' },
  { key: '↑↓', description: 'Navigate search results', category: 'Search' },
  { key: 'Enter', description: 'Select search result', category: 'Search' },
];

export default function KeyboardShortcuts() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === '/') {
        e.preventDefault();
        setIsOpen(true);
      }
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  if (!isOpen) return null;

  const grouped = shortcuts.reduce((acc, shortcut) => {
    if (!acc[shortcut.category]) {
      acc[shortcut.category] = [];
    }
    acc[shortcut.category].push(shortcut);
    return acc;
  }, {} as Record<string, Shortcut[]>);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
      onClick={() => setIsOpen(false)}
    >
      <div
        className="w-full max-w-2xl rounded-2xl border p-6 animate-fade-in"
        style={{
          backgroundColor: 'var(--bg-elevated)',
          borderColor: 'var(--border-primary)',
          boxShadow: 'var(--shadow-xl)'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Keyboard size={24} style={{ color: 'var(--brand-primary)' }} />
            <h2 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
              Keyboard Shortcuts
            </h2>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="btn-icon"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        <div className="space-y-6">
          {Object.entries(grouped).map(([category, items]) => (
            <div key={category}>
              <h3 className="text-sm font-semibold mb-3 uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
                {category}
              </h3>
              <div className="space-y-2">
                {items.map((shortcut, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 rounded-lg"
                    style={{ backgroundColor: 'var(--bg-secondary)' }}
                  >
                    <span className="text-sm" style={{ color: 'var(--text-primary)' }}>
                      {shortcut.description}
                    </span>
                    <kbd
                      className="px-3 py-1 rounded border text-xs font-mono"
                      style={{
                        backgroundColor: 'var(--bg-primary)',
                        borderColor: 'var(--border-primary)',
                        color: 'var(--text-primary)'
                      }}
                    >
                      {shortcut.key}
                    </kbd>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 pt-6 border-t text-center text-sm" style={{ borderColor: 'var(--border-primary)', color: 'var(--text-muted)' }}>
          Press <kbd className="px-2 py-1 rounded border text-xs">Esc</kbd> to close
        </div>
      </div>
    </div>
  );
}

