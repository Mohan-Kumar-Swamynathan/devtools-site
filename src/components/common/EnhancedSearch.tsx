import { useState, useRef, useEffect } from 'react';
import { Search, Clock, TrendingUp, X } from 'lucide-react';
import { tools } from '@/lib/tools';
import type { Tool } from '@/lib/tools';

interface Props {
    isOpen: boolean;
    onClose: () => void;
}

const RECENT_SEARCHES_KEY = 'devtools-recent-searches';
const MAX_RECENT = 5;

export default function EnhancedSearch({ isOpen, onClose }: Props) {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<Tool[]>([]);
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [recentSearches, setRecentSearches] = useState<string[]>([]);
    const inputRef = useRef<HTMLInputElement>(null);

    // Load recent searches
    useEffect(() => {
        try {
            const stored = localStorage.getItem(RECENT_SEARCHES_KEY);
            if (stored) {
                setRecentSearches(JSON.parse(stored));
            }
        } catch (error) {
            console.error('Failed to load recent searches:', error);
        }
    }, []);

    // Focus input when opened
    useEffect(() => {
        if (isOpen && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isOpen]);

    // Search with fuzzy matching
    useEffect(() => {
        if (!query.trim()) {
            setResults([]);
            setSelectedIndex(0);
            return;
        }

        const q = query.toLowerCase();
        const searchResults = tools.filter(tool => {
            const nameMatch = tool.name.toLowerCase().includes(q);
            const taglineMatch = tool.tagline.toLowerCase().includes(q);
            const keywordMatch = tool.keywords.some(k => k.toLowerCase().includes(q));
            const categoryMatch = tool.category.name.toLowerCase().includes(q);

            return nameMatch || taglineMatch || keywordMatch || categoryMatch;
        });

        setResults(searchResults.slice(0, 8));
        setSelectedIndex(0);
    }, [query]);

    // Keyboard navigation
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (!isOpen) return;

            switch (e.key) {
                case 'ArrowDown':
                    e.preventDefault();
                    setSelectedIndex(prev => Math.min(prev + 1, results.length - 1));
                    break;
                case 'ArrowUp':
                    e.preventDefault();
                    setSelectedIndex(prev => Math.max(prev - 1, 0));
                    break;
                case 'Enter':
                    e.preventDefault();
                    if (results[selectedIndex]) {
                        handleSelectTool(results[selectedIndex]);
                    }
                    break;
                case 'Escape':
                    e.preventDefault();
                    onClose();
                    break;
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, results, selectedIndex, onClose]);

    const saveRecentSearch = (searchQuery: string) => {
        try {
            const updated = [searchQuery, ...recentSearches.filter(s => s !== searchQuery)].slice(0, MAX_RECENT);
            setRecentSearches(updated);
            localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
        } catch (error) {
            console.error('Failed to save recent search:', error);
        }
    };

    const handleSelectTool = (tool: Tool) => {
        saveRecentSearch(query);
        window.location.href = `/${tool.slug}`;
    };

    const handleRecentSearch = (search: string) => {
        setQuery(search);
    };

    const clearRecentSearches = () => {
        setRecentSearches([]);
        localStorage.removeItem(RECENT_SEARCHES_KEY);
    };

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-start justify-center pt-[10vh] px-4"
            onClick={onClose}
        >
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

            {/* Search Panel */}
            <div
                className="relative w-full max-w-2xl rounded-2xl elevation-4 animate-fade-in-up"
                style={{ backgroundColor: 'var(--bg-elevated)' }}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Search Input */}
                <div className="flex items-center gap-3 p-4 border-b" style={{ borderColor: 'var(--border-primary)' }}>
                    <Search size={20} style={{ color: 'var(--text-muted)' }} />
                    <input
                        ref={inputRef}
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Search tools... (type to search)"
                        className="flex-1 bg-transparent outline-none text-lg"
                        style={{ color: 'var(--text-primary)' }}
                    />
                    <button
                        onClick={onClose}
                        className="p-1 rounded-lg hover:bg-[var(--bg-secondary)] transition-colors"
                        aria-label="Close search"
                    >
                        <X size={20} style={{ color: 'var(--text-muted)' }} />
                    </button>
                </div>

                {/* Results */}
                <div className="max-h-[60vh] overflow-y-auto">
                    {query && results.length > 0 && (
                        <div className="p-2">
                            <div className="text-xs font-semibold uppercase tracking-wide px-3 py-2" style={{ color: 'var(--text-muted)' }}>
                                Results ({results.length})
                            </div>
                            {results.map((tool, index) => (
                                <button
                                    key={tool.id}
                                    onClick={() => handleSelectTool(tool)}
                                    className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all duration-150 ${index === selectedIndex ? 'elevation-1' : ''
                                        }`}
                                    style={{
                                        backgroundColor: index === selectedIndex ? 'var(--bg-secondary)' : 'transparent'
                                    }}
                                >
                                    <span className="text-2xl">{tool.icon}</span>
                                    <div className="flex-1 text-left">
                                        <div className="font-medium" style={{ color: 'var(--text-primary)' }}>
                                            {tool.name}
                                        </div>
                                        <div className="text-sm" style={{ color: 'var(--text-muted)' }}>
                                            {tool.tagline}
                                        </div>
                                    </div>
                                    <div className="text-xs px-2 py-1 rounded-full" style={{ backgroundColor: 'var(--bg-tertiary)', color: 'var(--text-secondary)' }}>
                                        {tool.category.name}
                                    </div>
                                </button>
                            ))}
                        </div>
                    )}

                    {query && results.length === 0 && (
                        <div className="p-8 text-center" style={{ color: 'var(--text-muted)' }}>
                            <Search size={48} className="mx-auto mb-4 opacity-50" />
                            <p>No tools found for "{query}"</p>
                        </div>
                    )}

                    {!query && recentSearches.length > 0 && (
                        <div className="p-2">
                            <div className="flex items-center justify-between px-3 py-2">
                                <div className="text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--text-muted)' }}>
                                    <Clock size={12} className="inline mr-1" />
                                    Recent Searches
                                </div>
                                <button
                                    onClick={clearRecentSearches}
                                    className="text-xs hover:underline"
                                    style={{ color: 'var(--text-muted)' }}
                                >
                                    Clear
                                </button>
                            </div>
                            {recentSearches.map((search, index) => (
                                <button
                                    key={index}
                                    onClick={() => handleRecentSearch(search)}
                                    className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-[var(--bg-secondary)] transition-colors text-left"
                                >
                                    <Clock size={16} style={{ color: 'var(--text-muted)' }} />
                                    <span style={{ color: 'var(--text-primary)' }}>{search}</span>
                                </button>
                            ))}
                        </div>
                    )}

                    {!query && recentSearches.length === 0 && (
                        <div className="p-8 text-center" style={{ color: 'var(--text-muted)' }}>
                            <TrendingUp size={48} className="mx-auto mb-4 opacity-50" />
                            <p className="mb-2">Start typing to search</p>
                            <p className="text-sm">Try "json", "base64", or "regex"</p>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between p-3 border-t text-xs" style={{ borderColor: 'var(--border-primary)', color: 'var(--text-muted)' }}>
                    <div className="flex items-center gap-4">
                        <span>↑↓ Navigate</span>
                        <span>Enter Select</span>
                        <span>Esc Close</span>
                    </div>
                    <div>
                        {results.length > 0 && `${results.length} result${results.length !== 1 ? 's' : ''}`}
                    </div>
                </div>
            </div>
        </div>
    );
}
