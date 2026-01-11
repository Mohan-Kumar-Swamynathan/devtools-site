import React, { useState } from 'react';
import { Copy, Hash, RefreshCw, Check } from 'lucide-react';
import ToolShell from './ToolShell';
import { clsx } from 'clsx';
import { useToast } from '@/hooks/useToast';

interface Category {
    id: string;
    name: string;
    tags: string[];
}

const CATEGORIES: Category[] = [
    {
        id: 'tech',
        name: 'Technology',
        tags: ['tech', 'technology', 'innovation', 'coding', 'programming', 'developer', 'software', 'AI', 'artificialintelligence', 'gadgets', 'instatech', 'future', 'computer', 'science', 'engineering', 'webdev', 'appdevelopment', 'codinglife']
    },
    {
        id: 'travel',
        name: 'Travel',
        tags: ['travel', 'travelgram', 'wanderlust', 'adventure', 'vacation', 'travelphotography', 'explore', 'nature', 'holiday', 'trip', 'traveling', 'travelling', 'instatravel', 'travelblogger', 'beautifuldestinations', 'tourism', 'beach', 'sunset']
    },
    {
        id: 'fitness',
        name: 'Fitness',
        tags: ['fitness', 'gym', 'workout', 'fit', 'fitnessmotivation', 'bodybuilding', 'training', 'health', 'lifestyle', 'fitfam', 'sport', 'crossfit', 'healthy', 'gymlife', 'personaltrainer', 'muscle', 'exercise', 'weightloss']
    },
    {
        id: 'food',
        name: 'Food',
        tags: ['food', 'foodie', 'instafood', 'foodporn', 'yummy', 'delicious', 'dinner', 'breakfast', 'lunch', 'homemade', 'foodstagram', 'cooking', 'love', 'foodphotography', 'dessert', 'foodgasm', 'tasty', 'healthyfood']
    },
    {
        id: 'business',
        name: 'Business',
        tags: ['business', 'entrepreneur', 'motivation', 'marketing', 'success', 'money', 'love', 'smallbusiness', 'entrepreneurship', 'businessowner', 'mindset', 'instagram', 'inspiration', 'goals', 'digitalmarketing', 'startup', 'hustle', 'branding']
    },
    {
        id: 'photography',
        name: 'Photography',
        tags: ['photography', 'photooftheday', 'love', 'instagood', 'instagram', 'photo', 'nature', 'picoftheday', 'photographer', 'beautiful', 'art', 'capture', 'travel', 'fashion', 'photoshoot', 'canon', 'nikon', 'portrait']
    },
    {
        id: 'art',
        name: 'Art',
        tags: ['art', 'artist', 'drawing', 'artwork', 'painting', 'illustration', 'digitalart', 'sketch', 'design', 'artistsoninstagram', 'instaart', 'creative', 'draw', 'ink', 'arte', 'sketchbook', 'contemporaryart', 'photography']
    }
];

export default function HashtagGenerator() {
    const [selectedCategory, setSelectedCategory] = useState<Category>(CATEGORIES[0]);
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const { toast } = useToast();

    const handleCopy = () => {
        if (selectedTags.length === 0) return;
        const text = selectedTags.map(t => `#${t}`).join(' ');
        navigator.clipboard.writeText(text);
        toast({
            title: 'Copied!',
            description: `${selectedTags.length} hashtags copied to clipboard`,
            variant: 'success'
        });
    };

    const toggleTag = (tag: string) => {
        if (selectedTags.includes(tag)) {
            setSelectedTags(selectedTags.filter(t => t !== tag));
        } else {
            if (selectedTags.length >= 30) {
                toast({
                    title: 'Limit Reached',
                    description: 'Instagram allows a maximum of 30 hashtags per post.',
                    variant: 'error'
                });
                return;
            }
            setSelectedTags([...selectedTags, tag]);
        }
    };

    const selectAll = () => {
        const newTags = [...new Set([...selectedTags, ...selectedCategory.tags])].slice(0, 30);
        setSelectedTags(newTags);
    };

    const clearSelection = () => {
        setSelectedTags([]);
    };

    return (
        <ToolShell
            title="Hashtag Generator"
            description="Generate high-converting hashtags for your posts"
            icon={<Hash className="w-6 h-6" />}
        >
            <div className="space-y-8">
                {/* Categories */}
                <div className="flex flex-wrap gap-2">
                    {CATEGORIES.map(cat => (
                        <button
                            key={cat.id}
                            onClick={() => setSelectedCategory(cat)}
                            className={clsx(
                                "px-4 py-2 rounded-full text-sm font-medium transition-all",
                                selectedCategory.id === cat.id
                                    ? "bg-[var(--brand-primary)] text-white shadow-md transform scale-105"
                                    : "bg-[var(--bg-secondary)] text-[var(--text-secondary)] hover:bg-[var(--bg-elevated)]"
                            )}
                        >
                            {cat.name}
                        </button>
                    ))}
                </div>

                {/* Tag Selection Area */}
                <div className="p-6 rounded-2xl bg-[var(--bg-elevated)] border border-[var(--border-primary)]">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold text-[var(--text-primary)]">
                            {selectedCategory.name} Hashtags
                        </h3>
                        <div className="text-xs text-[var(--text-secondary)]">
                            Click to select
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                        {selectedCategory.tags.map(tag => (
                            <button
                                key={tag}
                                onClick={() => toggleTag(tag)}
                                className={clsx(
                                    "px-3 py-1.5 rounded-lg text-sm transition-all border",
                                    selectedTags.includes(tag)
                                        ? "bg-[var(--brand-primary)] text-white border-[var(--brand-primary)] shadow-sm"
                                        : "bg-[var(--bg-secondary)] text-[var(--text-secondary)] border-transparent hover:border-[var(--border-primary)]"
                                )}
                            >
                                #{tag}
                            </button>
                        ))}
                    </div>

                    <div className="mt-4 flex gap-2">
                        <button onClick={selectAll} className="text-xs text-[var(--brand-primary)] hover:underline">Select All</button>
                        <span className="text-[var(--border-primary)]">|</span>
                        <button onClick={clearSelection} className="text-xs text-[var(--text-muted)] hover:underline">Clear Selection</button>
                    </div>
                </div>

                {/* Output / Copy Area */}
                <div className="sticky bottom-4 z-10">
                    <div className="p-4 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-primary)] shadow-xl flex items-center justify-between gap-4 backdrop-blur-md bg-opacity-90">
                        <div className="flex-1 overflow-hidden">
                            <div className="text-xs font-bold text-[var(--text-muted)] uppercase mb-1">
                                Your Selection ({selectedTags.length}/30)
                            </div>
                            <div className="text-sm text-[var(--text-primary)] truncate font-medium">
                                {selectedTags.length > 0 ? selectedTags.map(t => `#${t}`).join(' ') : 'No hashtags selected'}
                            </div>
                        </div>

                        <button
                            onClick={handleCopy}
                            disabled={selectedTags.length === 0}
                            className={clsx(
                                "flex-shrink-0 flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all active:scale-95",
                                selectedTags.length > 0
                                    ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg hover:shadow-xl hover:scale-105"
                                    : "bg-[var(--bg-input)] text-[var(--text-muted)] cursor-not-allowed"
                            )}
                        >
                            <Copy className="w-5 h-5" />
                            Copy
                        </button>
                    </div>
                </div>
            </div>
        </ToolShell>
    );
}
