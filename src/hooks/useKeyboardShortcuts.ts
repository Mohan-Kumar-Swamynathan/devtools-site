import { useEffect, useCallback } from 'react';

interface KeyboardShortcut {
    key: string;
    ctrl?: boolean;
    meta?: boolean;
    shift?: boolean;
    alt?: boolean;
    handler: () => void;
    description: string;
}

export function useKeyboardShortcuts(shortcuts: KeyboardShortcut[]) {
    const handleKeyDown = useCallback((event: KeyboardEvent) => {
        for (const shortcut of shortcuts) {
            const ctrlMatch = shortcut.ctrl ? event.ctrlKey : true;
            const metaMatch = shortcut.meta ? event.metaKey : true;
            const shiftMatch = shortcut.shift ? event.shiftKey : !event.shiftKey;
            const altMatch = shortcut.alt ? event.altKey : !event.altKey;

            // Check if Ctrl or Meta (Cmd) is pressed when required
            const modifierMatch = shortcut.ctrl || shortcut.meta
                ? (event.ctrlKey || event.metaKey)
                : true;

            if (
                event.key.toLowerCase() === shortcut.key.toLowerCase() &&
                modifierMatch &&
                shiftMatch &&
                altMatch
            ) {
                event.preventDefault();
                shortcut.handler();
                break;
            }
        }
    }, [shortcuts]);

    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [handleKeyDown]);
}

// Global keyboard shortcuts
export const GLOBAL_SHORTCUTS = {
    SEARCH: { key: 'k', ctrl: true, meta: true, description: 'Open search' },
    SHORTCUTS: { key: '/', ctrl: true, meta: true, description: 'Show shortcuts' },
    FAVORITES: { key: 'b', ctrl: true, meta: true, description: 'Show favorites' },
    ESCAPE: { key: 'Escape', description: 'Close modal/panel' }
};

// Tool-specific shortcuts
export const TOOL_SHORTCUTS = {
    EXECUTE: { key: 'Enter', ctrl: true, meta: true, description: 'Execute/Convert' },
    COPY: { key: 'c', ctrl: true, meta: true, description: 'Copy output' },
    CLEAR: { key: 'x', ctrl: true, meta: true, description: 'Clear all' },
    EXAMPLE: { key: 'e', ctrl: true, meta: true, description: 'Load example' }
};
