import React from 'react';
import {
    Save, Edit2, X, Undo2, Redo2, Copy, ClipboardPaste,
    Trash2, Layout, Plus, Download, Upload, Settings,
    Loader2, Check, AlertCircle, Menu
} from 'lucide-react';
import type { Node, Edge } from 'reactflow';
import { NODE_TYPES_INFO } from './CustomNodes';

interface TopToolbarProps {
    diagramTitle: string;
    setDiagramTitle: (title: string) => void;
    editingTitle: boolean;
    setEditingTitle: (editing: boolean) => void;
    onSaveTitle: () => void;
    showSidebar: boolean;
    setShowSidebar: (show: boolean) => void;
    onUndo: () => void;
    onRedo: () => void;
    historyIndex: number;
    historyLength: number;
    nodes: Node[];
    edges: Edge[];
    onCopy: () => void;
    onPaste: () => void;
    onDelete: () => void;
    onAutoLayout: () => void;
    onAddNode: (type: string, position?: { x: number; y: number }) => void;
    // Menu states
    showAddNodeMenu: boolean;
    setShowAddNodeMenu: (show: boolean) => void;
    showExportMenu: boolean;
    setShowExportMenu: (show: boolean) => void;
    onExport: (format: 'json' | 'mermaid' | 'png' | 'svg') => void;
    onImportClick: () => void;
    showSettings: boolean;
    setShowSettings: (show: boolean) => void;
    saveStatus: 'saved' | 'unsaved';
    validationCount: number;
    showValidation: boolean;
    setShowValidation: (show: boolean) => void;
    isLoading: boolean;
}

export default function TopToolbar({
    diagramTitle, setDiagramTitle, editingTitle, setEditingTitle, onSaveTitle,
    showSidebar, setShowSidebar,
    onUndo, onRedo, historyIndex, historyLength,
    nodes, edges,
    onCopy, onPaste, onDelete,
    onAutoLayout,
    onAddNode, showAddNodeMenu, setShowAddNodeMenu,
    showExportMenu, setShowExportMenu, onExport, onImportClick,
    showSettings, setShowSettings,
    saveStatus, validationCount, showValidation, setShowValidation,
    isLoading
}: TopToolbarProps) {

    const hasSelection = nodes.some(n => n.selected) || edges.some(e => e.selected);

    return (
        <div
            className="w-full border-b flex items-center justify-between px-4 py-2 flex-shrink-0 z-10 relative"
            style={{
                borderColor: 'var(--border-primary)',
                backgroundColor: 'var(--bg-elevated)',
                minHeight: '56px',
                overflowX: 'auto', // Allow horizontal scroll on small mobile
            }}
        >
            <div className="flex items-center gap-2 sm:gap-3 flex-nowrap min-w-max">

                {/* Mobile Menu Button to toggle Sidebar */}
                <button
                    onClick={() => setShowSidebar(!showSidebar)}
                    className="md:hidden p-2 rounded transition-colors hover:bg-black/5 dark:hover:bg-white/5"
                    style={{ color: 'var(--text-primary)' }}
                >
                    <Menu size={20} />
                </button>

                {/* Title Section */}
                {editingTitle ? (
                    <div className="flex items-center gap-1 sm:gap-2">
                        <input
                            type="text"
                            value={diagramTitle}
                            onChange={(e) => setDiagramTitle(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') onSaveTitle();
                                if (e.key === 'Escape') setEditingTitle(false);
                            }}
                            className="px-2 py-1 text-sm border rounded w-32 sm:w-auto"
                            style={{
                                borderColor: 'var(--border-primary)',
                                backgroundColor: 'var(--bg-primary)',
                                color: 'var(--text-primary)',
                            }}
                            autoFocus
                        />
                        <button onClick={onSaveTitle} disabled={isLoading} className="p-1.5 rounded hover:bg-black/5 dark:hover:bg-white/5 text-green-600">
                            {isLoading ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                        </button>
                        <button onClick={() => setEditingTitle(false)} className="p-1.5 rounded hover:bg-black/5 dark:hover:bg-white/5 text-red-500">
                            <X size={14} />
                        </button>
                    </div>
                ) : (
                    <button
                        onClick={() => setEditingTitle(true)}
                        className="px-2 py-1.5 text-sm font-medium rounded transition-colors flex items-center gap-1.5 hover:bg-black/5 dark:hover:bg-white/5"
                        style={{ color: 'var(--text-primary)' }}
                    >
                        <span className="max-w-[120px] sm:max-w-[200px] truncate">{diagramTitle}</span>
                        <Edit2 size={12} className="opacity-50" />
                    </button>
                )}

                <div className="w-px h-6 bg-gray-200 dark:bg-gray-700 mx-1" />

                {/* History Controls */}
                <div className="flex gap-1">
                    <button onClick={onUndo} disabled={historyIndex <= 0} className="p-2 rounded hover:bg-black/5 dark:hover:bg-white/5 disabled:opacity-30" style={{ color: 'var(--text-primary)' }} title="Undo">
                        <Undo2 size={18} />
                    </button>
                    <button onClick={onRedo} disabled={historyIndex >= historyLength - 1} className="p-2 rounded hover:bg-black/5 dark:hover:bg-white/5 disabled:opacity-30" style={{ color: 'var(--text-primary)' }} title="Redo">
                        <Redo2 size={18} />
                    </button>
                </div>

                <div className="w-px h-6 bg-gray-200 dark:bg-gray-700 mx-1 hidden sm:block" />

                {/* Edit Controls (Desktop) */}
                <div className="hidden sm:flex gap-1">
                    <button onClick={onCopy} disabled={!hasSelection} className="p-2 rounded hover:bg-black/5 dark:hover:bg-white/5 disabled:opacity-30" style={{ color: 'var(--text-primary)' }} title="Copy">
                        <Copy size={18} />
                    </button>
                    <button onClick={onPaste} className="p-2 rounded hover:bg-black/5 dark:hover:bg-white/5" style={{ color: 'var(--text-primary)' }} title="Paste">
                        <ClipboardPaste size={18} />
                    </button>
                    <button onClick={onDelete} disabled={!hasSelection} className="p-2 rounded hover:bg-red-50 dark:hover:bg-red-900/20 disabled:opacity-30 text-red-500" title="Delete">
                        <Trash2 size={18} />
                    </button>
                </div>

            </div>

            <div className="flex items-center gap-2 sm:gap-3 flex-nowrap min-w-max ml-4">
                {/* Layout */}
                <button onClick={onAutoLayout} disabled={nodes.length === 0} className="p-2 rounded hover:bg-black/5 dark:hover:bg-white/5 disabled:opacity-30" style={{ color: 'var(--text-primary)' }} title="Auto Layout">
                    <Layout size={18} />
                </button>

                {/* Add Node Dropdown */}
                <div className="relative">
                    <button
                        onClick={() => setShowAddNodeMenu(!showAddNodeMenu)}
                        className={`p-2 rounded transition-colors ${showAddNodeMenu ? 'bg-black/10 dark:bg-white/10' : 'hover:bg-black/5 dark:hover:bg-white/5'}`}
                        style={{ color: 'var(--text-primary)' }}
                        title="Add Node"
                    >
                        <Plus size={18} />
                    </button>
                    {showAddNodeMenu && (
                        <div className="absolute top-full right-0 mt-2 w-48 rounded-xl shadow-xl border bg-white dark:bg-slate-800 z-50 overflow-hidden text-sm"
                            style={{ borderColor: 'var(--border-primary)' }}>
                            <div className="bg-gray-50 dark:bg-slate-900 px-3 py-2 font-medium text-xs text-gray-500 uppercase tracking-wider">Add Node</div>
                            {Object.entries(NODE_TYPES_INFO).slice(0, 5).map(([type, info]) => (
                                <button
                                    key={type}
                                    onClick={() => onAddNode(type)}
                                    className="w-full text-left px-4 py-2.5 hover:bg-gray-100 dark:hover:bg-slate-700 flex items-center gap-3 transition-colors"
                                    style={{ color: 'var(--text-primary)' }}
                                >
                                    <span className="font-mono text-gray-400">{info.icon}</span>
                                    {info.label}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Export/Import */}
                <div className="relative">
                    <button
                        onClick={() => setShowExportMenu(!showExportMenu)}
                        className={`p-2 rounded transition-colors ${showExportMenu ? 'bg-black/10 dark:bg-white/10' : 'hover:bg-black/5 dark:hover:bg-white/5'}`}
                        style={{ color: 'var(--text-primary)' }}
                        title="Export"
                    >
                        <Download size={18} />
                    </button>
                    {showExportMenu && (
                        <div className="absolute top-full right-0 mt-2 w-48 rounded-xl shadow-xl border bg-white dark:bg-slate-800 z-50 overflow-hidden text-sm"
                            style={{ borderColor: 'var(--border-primary)' }}>
                            <div className="bg-gray-50 dark:bg-slate-900 px-3 py-2 font-medium text-xs text-gray-500 uppercase tracking-wider">Export As</div>
                            <button onClick={() => onExport('png')} className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-slate-700" style={{ color: 'var(--text-primary)' }}>PNG Image</button>
                            <button onClick={() => onExport('svg')} className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-slate-700" style={{ color: 'var(--text-primary)' }}>SVG Vector</button>
                            <button onClick={() => onExport('json')} className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-slate-700" style={{ color: 'var(--text-primary)' }}>JSON File</button>
                            <button onClick={() => onExport('mermaid')} className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-slate-700" style={{ color: 'var(--text-primary)' }}>Mermaid Code</button>
                        </div>
                    )}
                </div>

                <button onClick={onImportClick} className="p-2 rounded hover:bg-black/5 dark:hover:bg-white/5" style={{ color: 'var(--text-primary)' }} title="Import">
                    <Upload size={18} />
                </button>

                <button onClick={() => setShowSettings(!showSettings)} className="p-2 rounded hover:bg-black/5 dark:hover:bg-white/5" style={{ color: 'var(--text-primary)' }} title="Settings">
                    <Settings size={18} />
                </button>

                {/* Validation & Status */}
                <div className="flex items-center">
                    {saveStatus === 'saved' ? <Check size={16} className="text-green-500" /> : <div className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse" />}
                    {validationCount > 0 && (
                        <button onClick={() => setShowValidation(!showValidation)} className="ml-2 relative text-amber-500">
                            <AlertCircle size={18} />
                            <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white dark:border-slate-800"></span>
                        </button>
                    )}
                </div>

            </div>
        </div>
    );
}
