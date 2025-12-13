import { useState, useMemo, useRef, useEffect } from 'react';
import { Search, X, ArrowRight, Clock, TrendingUp } from 'lucide-react';
import type { Tool } from '@/lib/tools';

interface Props {
  tools: Tool[];
}

export default function SearchBox({ tools }: Props) {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Recent searches
  const [recentSearches, setRecentSearches] = useState<string[]>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('recent-searches');
      return stored ? JSON.parse(stored) : [];
    }
    return [];
  });

  // Debounce search for better performance
  const [debouncedQuery, setDebouncedQuery] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, 150); // 150ms debounce

    return () => clearTimeout(timer);
  }, [query]);

  const results = useMemo(() => {
    if (!debouncedQuery.trim()) return [];
    const q = debouncedQuery.toLowerCase();
    return tools
      .filter(t => 
        t.name.toLowerCase().includes(q) || 
        t.keywords.some(k => k.toLowerCase().includes(q)) ||
        t.tagline.toLowerCase().includes(q)
      )
      .slice(0, 8);
  }, [debouncedQuery, tools]);

  // Handle keyboard shortcuts (Cmd/Ctrl + K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen || results.length === 0) {
      // Allow Cmd/Ctrl+K to focus even when closed
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
      }
      return;
    }
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % results.length);
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + results.length) % results.length);
        break;
      case 'Enter':
        e.preventDefault();
        if (results[selectedIndex]) {
          const tool = results[selectedIndex];
          // Save to recent searches
          if (typeof window !== 'undefined') {
            const updated = [tool.name, ...recentSearches.filter(s => s !== tool.name)].slice(0, 5);
            setRecentSearches(updated);
            localStorage.setItem('recent-searches', JSON.stringify(updated));
          }
          window.location.href = `/${tool.slug}`;
        }
        break;
      case 'Escape':
        setIsOpen(false);
        inputRef.current?.blur();
        break;
    }
  };

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Reset selection when results change
  useEffect(() => {
    setSelectedIndex(0);
  }, [results]);

  return (
    <div ref={containerRef} className="relative w-full">
      {/* Input */}
      <div className="relative">
        <Search 
          size={18} 
          className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
          style={{ color: 'var(--text-muted)' }}
        />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => { setQuery(e.target.value); setIsOpen(true); }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder="Search tools... (⌘K)"
          className="w-full pl-10 pr-10 py-2.5 rounded-xl text-sm input-base"
          aria-label="Search tools"
          aria-expanded={isOpen}
          aria-haspopup="listbox"
          role="combobox"
        />
        {query && (
          <button
            onClick={() => { setQuery(''); inputRef.current?.focus(); }}
            className="absolute right-3 top-1/2 -translate-y-1/2 btn-icon p-1"
          >
            <X size={16} />
          </button>
        )}
      </div>

      {/* Results Dropdown */}
      {isOpen && results.length > 0 && (
        <div 
          className="absolute top-full left-0 right-0 mt-2 rounded-xl border overflow-hidden z-50 animate-fade-in-scale"
          style={{ 
            backgroundColor: 'var(--bg-elevated)',
            borderColor: 'var(--border-primary)',
            boxShadow: 'var(--shadow-lg)',
            transformOrigin: 'top'
          }}
        >
          <ul className="py-2" role="listbox" aria-label="Search results">
            {results.map((tool, index) => (
              <li 
                key={tool.id} 
                role="option" 
                aria-selected={index === selectedIndex}
                className="animate-slide-up"
                style={{
                  animationDelay: `${index * 30}ms`,
                  animationFillMode: 'both'
                }}
              >
                <a
                  href={`/${tool.slug}`}
                  className="flex items-center gap-3 px-4 py-3 transition-all duration-200 hover:translate-x-1"
                  style={{ 
                    backgroundColor: index === selectedIndex ? 'var(--bg-secondary)' : 'transparent'
                  }}
                  onMouseEnter={() => setSelectedIndex(index)}
                  aria-label={`${tool.name} - ${tool.tagline}`}
                >
                  <span className="text-xl flex-shrink-0" aria-hidden="true">{tool.icon}</span>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm truncate" style={{ color: 'var(--text-primary)' }}>
                      {tool.name}
                    </div>
                    <div className="text-xs truncate" style={{ color: 'var(--text-muted)' }}>
                      {tool.tagline}
                    </div>
                  </div>
                  <ArrowRight size={16} style={{ color: 'var(--text-muted)' }} aria-hidden="true" />
                </a>
              </li>
            ))}
          </ul>
          
          {/* Footer */}
          <div 
            className="px-4 py-2 text-xs border-t flex items-center gap-4"
            style={{ 
              backgroundColor: 'var(--bg-secondary)',
              borderColor: 'var(--border-primary)',
              color: 'var(--text-muted)'
            }}
          >
            <span><kbd className="px-1.5 py-0.5 rounded border text-xs">↑↓</kbd> Navigate</span>
            <span><kbd className="px-1.5 py-0.5 rounded border text-xs">↵</kbd> Select</span>
            <span><kbd className="px-1.5 py-0.5 rounded border text-xs">Esc</kbd> Close</span>
          </div>
        </div>
      )}

      {/* No Results */}
      {isOpen && query && results.length === 0 && (
        <div 
          className="absolute top-full left-0 right-0 mt-2 p-4 rounded-xl border animate-fade-in"
          style={{ 
            backgroundColor: 'var(--bg-elevated)',
            borderColor: 'var(--border-primary)',
            boxShadow: 'var(--shadow-lg)'
          }}
        >
          <p className="text-sm text-center mb-3" style={{ color: 'var(--text-muted)' }}>
            No tools found for "{query}"
          </p>
          {recentSearches.length > 0 && (
            <div>
              <p className="text-xs font-semibold mb-2 flex items-center gap-1" style={{ color: 'var(--text-secondary)' }}>
                <Clock size={12} />
                Recent Searches
              </p>
              <div className="flex flex-wrap gap-2">
                {recentSearches.map((search, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setQuery(search);
                      inputRef.current?.focus();
                    }}
                    className="px-2 py-1 rounded text-xs transition-colors"
                    style={{
                      backgroundColor: 'var(--bg-secondary)',
                      color: 'var(--text-primary)'
                    }}
                  >
                    {search}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
      
      {/* Empty State - Show recent searches */}
      {isOpen && !query && recentSearches.length > 0 && (
        <div 
          className="absolute top-full left-0 right-0 mt-2 p-4 rounded-xl border animate-fade-in"
          style={{ 
            backgroundColor: 'var(--bg-elevated)',
            borderColor: 'var(--border-primary)',
            boxShadow: 'var(--shadow-lg)'
          }}
        >
          <p className="text-xs font-semibold mb-2 flex items-center gap-1" style={{ color: 'var(--text-secondary)' }}>
            <Clock size={12} />
            Recent Searches
          </p>
          <div className="space-y-1">
            {recentSearches.map((search, idx) => {
              const tool = tools.find(t => t.name.toLowerCase() === search.toLowerCase());
              if (!tool) return null;
              return (
                <a
                  key={idx}
                  href={`/${tool.slug}`}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg transition-colors"
                  style={{
                    backgroundColor: 'transparent',
                    color: 'var(--text-primary)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'var(--bg-secondary)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                >
                  <span className="text-lg">{tool.icon}</span>
                  <span className="text-sm">{tool.name}</span>
                </a>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}


