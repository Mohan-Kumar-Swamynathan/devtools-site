import React, { useState, useEffect, useRef } from 'react';
import { Search, X, Command, ArrowRight } from 'lucide-react';
import { tools } from '@/lib/tools';
import { clsx } from 'clsx';

export default function GlobalSearch() {
    const [isOpen, setIsOpen] = useState(false);
    const [query, setQuery] = useState('');
    const [selectedIndex, setSelectedIndex] = useState(0);
    const inputRef = useRef<HTMLInputElement>(null);
    const resultsRef = useRef<HTMLDivElement>(null);

    const filteredTools = tools.filter(tool =>
        tool.name.toLowerCase().includes(query.toLowerCase()) ||
        tool.description.toLowerCase().includes(query.toLowerCase()) ||
        tool.keywords.some(k => k.toLowerCase().includes(query.toLowerCase()))
    ).slice(0, 10); // Limit to 10 results

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault();
                setIsOpen(true);
            }
            if (e.key === 'Escape') {
                setIsOpen(false);
            }
        };

        const handleOpenSearch = () => setIsOpen(true);

        document.addEventListener('keydown', handleKeyDown);
        document.addEventListener('open-search-modal', handleOpenSearch);

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            document.removeEventListener('open-search-modal', handleOpenSearch);
        };
    }, []);

    useEffect(() => {
        if (isOpen) {
            setTimeout(() => inputRef.current?.focus(), 100);
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
            setQuery('');
            setSelectedIndex(0);
        }
    }, [isOpen]);

    useEffect(() => {
        setSelectedIndex(0);
    }, [query]);

    const handleNavigate = (e: React.KeyboardEvent) => {
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            setSelectedIndex(prev => (prev + 1) % filteredTools.length);
            // specific logic to scroll into view could go here
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setSelectedIndex(prev => (prev - 1 + filteredTools.length) % filteredTools.length);
        } else if (e.key === 'Enter') {
            e.preventDefault();
            if (filteredTools[selectedIndex]) {
                window.location.href = `/${filteredTools[selectedIndex].slug}`;
            }
        }
    };

    if (!isOpen) {
        // Render toggle button for mobile/header if needed across site, 
        // but typically this component is mounted once in Layout.
        // We can expose a global event listener to open it.
        return null;
    }

    return (
        <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh] px-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in"
                onClick={() => setIsOpen(false)}
            />

            {/* Modal */}
            <div className="relative w-full max-w-2xl bg-[var(--bg-elevated)] border border-[var(--border-primary)] rounded-2xl shadow-2xl overflow-hidden animate-scale-in flex flex-col max-h-[70vh]">
                {/* Header */}
                <div className="flex items-center border-b border-[var(--border-primary)] px-4 py-3">
                    <Search className="w-5 h-5 text-[var(--text-muted)] mr-3" />
                    <input
                        ref={inputRef}
                        type="text"
                        placeholder="Search tools..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onKeyDown={handleNavigate}
                        className="flex-1 bg-transparent border-none outline-none text-[var(--text-primary)] placeholder-[var(--text-muted)] h-8"
                    />
                    <button
                        onClick={() => setIsOpen(false)}
                        className="p-1 rounded hover:bg-[var(--bg-secondary)] text-[var(--text-muted)] transition-colors"
                    >
                        <span className="sr-only">Close</span>
                        <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-xs font-medium bg-[var(--bg-tertiary)] border border-[var(--border-primary)] rounded mr-2">ESC</kbd>
                        <X className="w-4 h-4 inline-block" />
                    </button>
                </div>

                {/* Results */}
                <div ref={resultsRef} className="overflow-y-auto p-2 scrollbar-hide">
                    {filteredTools.length > 0 ? (
                        <div className="space-y-1">
                            {filteredTools.map((tool, index) => (
                                <a
                                    key={tool.id}
                                    href={`/${tool.slug}`}
                                    className={clsx(
                                        "flex items-center gap-4 px-4 py-3 rounded-xl transition-all group",
                                        index === selectedIndex ? "bg-[var(--brand-primary)] text-white" : "text-[var(--text-primary)] hover:bg-[var(--bg-secondary)]"
                                    )}
                                    onClick={() => setIsOpen(false)}
                                    onMouseEnter={() => setSelectedIndex(index)}
                                >
                                    <div className={clsx(
                                        "w-10 h-10 rounded-lg flex items-center justify-center text-xl shadow-sm transition-colors",
                                        index === selectedIndex ? "bg-white/20" : "bg-[var(--bg-elevated)] border border-[var(--border-primary)]"
                                    )}>
                                        {tool.icon}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h4 className={clsx(
                                            "font-medium truncate",
                                            index === selectedIndex ? "text-white" : "text-[var(--text-primary)]"
                                        )}>
                                            {tool.name}
                                        </h4>
                                        <p className={clsx(
                                            "text-xs truncate",
                                            index === selectedIndex ? "text-white/80" : "text-[var(--text-secondary)]"
                                        )}>
                                            {tool.tagline}
                                        </p>
                                    </div>
                                    <ArrowRight className={clsx(
                                        "w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity",
                                        index === selectedIndex ? "text-white opacity-100" : "text-[var(--text-muted)]"
                                    )} />
                                </a>
                            ))}
                        </div>
                    ) : query ? (
                        <div className="py-12 text-center text-[var(--text-muted)]">
                            <p>No tools found for "{query}"</p>
                        </div>
                    ) : (
                        <div className="py-8 text-center text-[var(--text-muted)]">
                            <p>Type to search...</p>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="px-4 py-2 bg-[var(--bg-secondary)] border-t border-[var(--border-primary)] flex justify-between items-center text-xs text-[var(--text-muted)]">
                    <span>
                        <strong className="font-medium text-[var(--text-primary)]">{tools.length}</strong> tools available
                    </span>
                    <div className="flex gap-3">
                        <span className="flex items-center gap-1"><kbd className="bg-[var(--bg-tertiary)] border border-[var(--border-primary)] rounded px-1">↓</kbd>navigate</span>
                        <span className="flex items-center gap-1"><kbd className="bg-[var(--bg-tertiary)] border border-[var(--border-primary)] rounded px-1">↵</kbd>select</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
