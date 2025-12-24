import { useState, useEffect, useCallback } from 'react';

interface FavoriteTool {
    id: string;
    slug: string;
    name: string;
    addedAt: number;
}

const FAVORITES_KEY = 'devtools-favorites';

export function useFavorites() {
    const [favorites, setFavorites] = useState<FavoriteTool[]>([]);

    // Load favorites from localStorage on mount
    useEffect(() => {
        try {
            const stored = localStorage.getItem(FAVORITES_KEY);
            if (stored) {
                setFavorites(JSON.parse(stored));
            }
        } catch (error) {
            console.error('Failed to load favorites:', error);
        }
    }, []);

    // Save favorites to localStorage whenever they change
    useEffect(() => {
        try {
            localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
        } catch (error) {
            console.error('Failed to save favorites:', error);
        }
    }, [favorites]);

    const isFavorite = useCallback((toolId: string) => {
        return favorites.some(fav => fav.id === toolId);
    }, [favorites]);

    const addFavorite = useCallback((tool: Omit<FavoriteTool, 'addedAt'>) => {
        setFavorites(prev => {
            if (prev.some(fav => fav.id === tool.id)) {
                return prev; // Already favorited
            }
            return [...prev, { ...tool, addedAt: Date.now() }];
        });
    }, []);

    const removeFavorite = useCallback((toolId: string) => {
        setFavorites(prev => prev.filter(fav => fav.id !== toolId));
    }, []);

    const toggleFavorite = useCallback((tool: Omit<FavoriteTool, 'addedAt'>) => {
        if (isFavorite(tool.id)) {
            removeFavorite(tool.id);
        } else {
            addFavorite(tool);
        }
    }, [isFavorite, addFavorite, removeFavorite]);

    const clearFavorites = useCallback(() => {
        setFavorites([]);
    }, []);

    return {
        favorites,
        isFavorite,
        addFavorite,
        removeFavorite,
        toggleFavorite,
        clearFavorites,
        count: favorites.length
    };
}
