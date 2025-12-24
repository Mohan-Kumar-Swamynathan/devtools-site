import React, { useState } from 'react';
import { Search, X, GripVertical, ChevronDown, ChevronRight, Menu } from 'lucide-react';
import { NODE_TYPES_INFO } from './CustomNodes';

interface SidebarProps {
    showSidebar: boolean;
    setShowSidebar: (show: boolean) => void;
    onDragStart: (event: React.DragEvent, nodeType: string) => void;
}

export default function Sidebar({ showSidebar, setShowSidebar, onDragStart }: SidebarProps) {
    const [searchTerm, setSearchTerm] = useState('');
    const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set(['Flow', 'Data']));

    // Group nodes by category
    const nodesByCategory = Object.entries(NODE_TYPES_INFO).reduce((acc, [type, info]) => {
        if (!acc[info.category]) acc[info.category] = [];
        acc[info.category].push({ type: type, ...info });
        return acc;
    }, {} as Record<string, Array<{ type: string; label: string; icon: string; category: string }>>);

    // Filter nodes by search
    const filteredNodesByCategory = Object.entries(nodesByCategory).reduce((acc, [category, nodes]) => {
        const filtered = nodes.filter(n =>
            n.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
            n.type.toLowerCase().includes(searchTerm.toLowerCase())
        );
        if (filtered.length > 0) acc[category] = filtered;
        return acc;
    }, {} as Record<string, Array<{ type: string; label: string; icon: string; category: string }>>);

    return (
        <>
            {/* Mobile Sidebar Toggle - Bottom Right FAB Style */}
            {!showSidebar && (
                <button
                    onClick={() => setShowSidebar(true)}
                    className="md:hidden fixed bottom-6 right-6 z-50 p-4 rounded-full shadow-lg text-white transition-all transform hover:scale-105 active:scale-95"
                    style={{
                        backgroundColor: 'var(--brand-primary)',
                    }}
                    aria-label="Open node library"
                >
                    <Menu size={24} />
                </button>
            )}

            {/* Sidebar Container - Drawer on Mobile, Side Panel on Desktop */}
            <div
                className={`fixed inset-y-0 left-0 bg-white dark:bg-slate-900 border-r border-gray-200 dark:border-gray-700 z-50 transition-transform duration-300 transform ${showSidebar ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0 md:w-64 md:flex-shrink-0 flex flex-col h-full ${!showSidebar ? 'md:hidden' : ''}`}
                style={{
                    backgroundColor: 'var(--bg-elevated)',
                    borderColor: 'var(--border-primary)',
                    color: 'var(--text-primary)',
                }}
            >
                {/* Header */}
                <div className="p-3 border-b flex items-center justify-between" style={{ borderColor: 'var(--border-primary)' }}>
                    <div className="font-semibold text-sm">Node Library</div>
                    <button
                        onClick={() => setShowSidebar(false)}
                        className="p-1 rounded hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                        aria-label="Close sidebar"
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* Search */}
                <div className="p-3 border-b" style={{ borderColor: 'var(--border-primary)' }}>
                    <div className="flex items-center gap-2 px-2 py-1.5 border rounded-lg bg-gray-50 dark:bg-slate-800" style={{ borderColor: 'var(--border-primary)', backgroundColor: 'var(--bg-primary)' }}>
                        <Search size={16} className="text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search nodes..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="flex-1 bg-transparent text-sm outline-none placeholder:text-gray-400"
                            style={{ color: 'var(--text-primary)' }}
                        />
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-2">
                    {Object.entries(filteredNodesByCategory).map(([category, categoryNodes]) => (
                        <div key={category} className="mb-2">
                            <button
                                onClick={() => {
                                    setExpandedCategories(prev => {
                                        const next = new Set(prev);
                                        if (next.has(category)) next.delete(category);
                                        else next.add(category);
                                        return next;
                                    });
                                }}
                                className="w-full flex items-center justify-between px-2 py-2 text-sm font-semibold rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                                style={{ color: 'var(--text-primary)' }}
                            >
                                <span>{category}</span>
                                {expandedCategories.has(category) ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                            </button>

                            {expandedCategories.has(category) && (
                                <div className="mt-1 space-y-1 pl-1">
                                    {categoryNodes.map(({ type, label, icon }) => (
                                        <div
                                            key={type}
                                            draggable
                                            onDragStart={(e) => onDragStart(e, type)}
                                            // Mobile fix: Touch event handler for mobile drag (shim)
                                            className="flex items-center gap-3 px-3 py-2 text-sm rounded-lg cursor-move hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors group active:cursor-grabbing"
                                            style={{ color: 'var(--text-secondary)' }}
                                        >
                                            <GripVertical size={14} className="text-gray-300 group-hover:text-blue-400" />
                                            <span className="w-6 text-center font-mono opacity-70">{icon}</span>
                                            <span>{label}</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}

                    {Object.keys(filteredNodesByCategory).length === 0 && (
                        <div className="text-center py-8 text-sm text-gray-500">
                            No nodes found
                        </div>
                    )}
                </div>

                {/* Mobile Overlay Background (when open) */}
                {showSidebar && (
                    <div
                        className="fixed inset-0 bg-black/50 z-40 md:hidden"
                        onClick={() => setShowSidebar(false)}
                        style={{ marginLeft: '256px' }}
                    />
                )}
            </div>
        </>
    );
}
