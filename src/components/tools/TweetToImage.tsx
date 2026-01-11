import React, { useState, useRef } from 'react';
import { Download, RefreshCw, Twitter, Heart, MessageCircle, Repeat, Share } from 'lucide-react';
import { clsx } from 'clsx';
import ToolShell from './ToolShell';
import html2canvas from 'html2canvas';

const THEMES = [
    { id: 'light', name: 'Light', bg: 'bg-white', text: 'text-black', border: 'border-gray-100' },
    { id: 'dim', name: 'Dim', bg: 'bg-[#15202b]', text: 'text-white', border: 'border-gray-700' },
    { id: 'dark', name: 'Dark', bg: 'bg-black', text: 'text-white', border: 'border-gray-800' },
];

const GRADIENTS = [
    { id: 'blue', name: 'Blue', class: 'from-blue-400 to-blue-600' },
    { id: 'purple', name: 'Purple', class: 'from-purple-400 to-indigo-600' },
    { id: 'pink', name: 'Pink', class: 'from-pink-400 to-rose-600' },
    { id: 'orange', name: 'Orange', class: 'from-orange-400 to-red-500' },
    { id: 'green', name: 'Green', class: 'from-emerald-400 to-teal-600' },
    { id: 'dark', name: 'Dark', class: 'from-gray-700 to-gray-900' },
];

export default function TweetToImage() {
    const [name, setName] = useState('John Doe');
    const [username, setUsername] = useState('johndoe');
    const [content, setContent] = useState('Just shipped a new feature! 🚀\n\nCheck it out at devtool.site\n\n#coding #developer #webdev');
    const [date, setDate] = useState('10:30 AM · Oct 24, 2023');
    const [likes, setLikes] = useState('1.2K');
    const [retweets, setRetweets] = useState('450');
    const [verified, setVerified] = useState(true);
    const [theme, setTheme] = useState(THEMES[0]);
    const [gradient, setGradient] = useState(GRADIENTS[1]);
    const [showMetrics, setShowMetrics] = useState(true);

    const tweetRef = useRef<HTMLDivElement>(null);

    const handleDownload = async () => {
        if (!tweetRef.current) return;

        // Temporarily remove shadow and border radius for clean capture? No, usually users want the whole card style.
        // We capture the container (gradient + tweet).

        const canvas = await html2canvas(tweetRef.current, {
            scale: 2, // High resolution
            backgroundColor: null,
            useCORS: true
        });

        const url = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.download = `tweet-${username}.png`;
        link.href = url;
        link.click();
    };

    return (
        <ToolShell
            title="Tweet to Image"
            description="Create beautiful, shareable screenshots of tweets"
            icon={<Twitter className="w-6 h-6" />}
        >
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Controls */}
                <div className="space-y-6 lg:col-span-1">
                    <div className="space-y-4 p-6 rounded-2xl bg-[var(--bg-elevated)] border border-[var(--border-primary)]">
                        <h3 className="font-semibold text-[var(--text-primary)]">Content</h3>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-xs font-medium text-[var(--text-secondary)] mb-1 block">Name</label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full px-3 py-2 rounded-lg bg-[var(--bg-input)] border border-[var(--border-input)] text-sm"
                                />
                            </div>
                            <div>
                                <label className="text-xs font-medium text-[var(--text-secondary)] mb-1 block">Username</label>
                                <input
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    className="w-full px-3 py-2 rounded-lg bg-[var(--bg-input)] border border-[var(--border-input)] text-sm"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="text-xs font-medium text-[var(--text-secondary)] mb-1 block">Tweet Text</label>
                            <textarea
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                rows={4}
                                className="w-full px-3 py-2 rounded-lg bg-[var(--bg-input)] border border-[var(--border-input)] text-sm resize-none"
                            />
                        </div>

                        <div className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                id="verified"
                                checked={verified}
                                onChange={(e) => setVerified(e.target.checked)}
                                className="rounded border-[var(--border-input)]"
                            />
                            <label htmlFor="verified" className="text-sm text-[var(--text-primary)]">Show Verified Badge</label>
                        </div>

                        <div className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                id="metrics"
                                checked={showMetrics}
                                onChange={(e) => setShowMetrics(e.target.checked)}
                                className="rounded border-[var(--border-input)]"
                            />
                            <label htmlFor="metrics" className="text-sm text-[var(--text-primary)]">Show Metrics</label>
                        </div>
                    </div>

                    <div className="space-y-4 p-6 rounded-2xl bg-[var(--bg-elevated)] border border-[var(--border-primary)]">
                        <h3 className="font-semibold text-[var(--text-primary)]">Appearance</h3>

                        <div>
                            <label className="text-xs font-medium text-[var(--text-secondary)] mb-2 block">Theme</label>
                            <div className="flex gap-2">
                                {THEMES.map(t => (
                                    <button
                                        key={t.id}
                                        onClick={() => setTheme(t)}
                                        className={clsx(
                                            "flex-1 py-1.5 rounded-lg text-sm border font-medium transition-all",
                                            theme.id === t.id
                                                ? "ring-2 ring-[var(--brand-primary)] border-transparent"
                                                : "border-[var(--border-primary)]"
                                        )}
                                        style={{
                                            backgroundColor: t.id === 'light' ? '#fff' : (t.id === 'dim' ? '#15202b' : '#000'),
                                            color: t.id === 'light' ? '#000' : '#fff'
                                        }}
                                    >
                                        {t.name}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div>
                            <label className="text-xs font-medium text-[var(--text-secondary)] mb-2 block">Background</label>
                            <div className="grid grid-cols-6 gap-2">
                                {GRADIENTS.map(g => (
                                    <button
                                        key={g.id}
                                        onClick={() => setGradient(g)}
                                        className={clsx(
                                            "w-8 h-8 rounded-full bg-gradient-to-br transition-all hover:scale-110",
                                            g.class,
                                            gradient.id === g.id ? "ring-2 ring-[var(--brand-primary)] ring-offset-2" : ""
                                        )}
                                        title={g.name}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={handleDownload}
                        className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[var(--brand-primary)] text-white shadow-lg hover:shadow-xl active:scale-95 transition-all font-bold"
                    >
                        <Download className="w-5 h-5" />
                        Download Image
                    </button>
                </div>

                {/* Preview */}
                <div className="lg:col-span-2 flex items-center justify-center p-4 rounded-3xl bg-[var(--bg-secondary)] border border-[var(--border-primary)] min-h-[500px] overflow-hidden">
                    <div
                        ref={tweetRef}
                        className={clsx(
                            "p-12 md:p-16 rounded-none flex items-center justify-center bg-gradient-to-br w-full max-w-[800px]",
                            gradient.class
                        )}
                    >
                        <div className={clsx(
                            "w-full max-w-[600px] rounded-3xl p-8 shadow-2xl",
                            theme.bg,
                            theme.text
                        )}>
                            {/* Header */}
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-4">
                                    <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-gray-300 to-gray-400 flex items-center justify-center text-xl font-bold text-white overflow-hidden">
                                        <img
                                            src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`}
                                            alt="avatar"
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-1">
                                            <h3 className="font-bold text-lg leading-tight">{name}</h3>
                                            {verified && (
                                                <svg viewBox="0 0 24 24" aria-label="Verified account" className="w-5 h-5 text-blue-500 fill-current"><g><path d="M22.5 12.5c0-1.58-.875-2.95-2.148-3.6.154-.435.238-.905.238-1.4 0-2.21-1.71-3.998-3.818-3.998-.47 0-.92.084-1.336.25C14.818 2.415 13.51 1.5 12 1.5s-2.816.917-3.437 2.25c-.415-.165-.866-.25-1.336-.25-2.11 0-3.818 1.79-3.818 4 0 .495.083.965.238 1.4-1.272.65-2.147 2.018-2.147 3.6 0 1.495.782 2.798 1.942 3.486-.02.17-.032.34-.032.514 0 2.21 1.708 4 3.818 4 .47 0 .92-.086 1.335-.25.62 1.334 1.926 2.25 3.437 2.25 1.512 0 2.818-.916 3.437-2.25.415.163.865.248 1.336.248 2.11 0 3.818-1.79 3.818-4 0-.174-.012-.344-.033-.513 1.158-.687 1.943-1.99 1.943-3.484zm-6.616-3.334l-4.334 6.5c-.145.217-.382.334-.625.334-.143 0-.288-.04-.416-.126l-.115-.094-2.415-2.415c-.293-.293-.293-.768 0-1.06s.768-.294 1.06 0l1.77 1.767 3.825-5.74c.23-.345.696-.436 1.04-.207.346.23.44.696.21 1.04z"></path></g></svg>
                                            )}
                                        </div>
                                        <div className={clsx("text-sm", theme.id === 'light' ? 'text-gray-500' : 'text-gray-400')}>@{username}</div>
                                    </div>
                                </div>
                                <Twitter className={clsx("w-8 h-8", theme.id === 'light' ? 'text-blue-500' : 'text-white')} />
                            </div>

                            {/* Body */}
                            <div className="text-xl whitespace-pre-wrap leading-relaxed mb-6">
                                <p dangerouslySetInnerHTML={{
                                    __html: content
                                        .replace(/#([\w]+)/g, '<span class="text-blue-400">#$1</span>')
                                        .replace(/@([\w]+)/g, '<span class="text-blue-400">@$1</span>')
                                        .replace(/(https?:\/\/[^\s]+)/g, '<span class="text-blue-400">$1</span>')
                                }} />
                            </div>

                            {/* Footer */}
                            <div className={clsx("border-t pt-4", theme.border)}>
                                <div className={clsx("text-sm mb-4", theme.id === 'light' ? 'text-gray-500' : 'text-gray-400')}>
                                    {date}
                                </div>

                                {showMetrics && (
                                    <div className={clsx("flex gap-6 text-sm font-medium pt-2 border-t", theme.border)}>
                                        <div className="flex items-center gap-2">
                                            <span className={theme.id === 'light' ? 'text-gray-700' : 'text-white'}>{retweets}</span>
                                            <span className={clsx(theme.id === 'light' ? 'text-gray-500' : 'text-gray-400')}>Retweets</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className={theme.id === 'light' ? 'text-gray-700' : 'text-white'}>{likes}</span>
                                            <span className={clsx(theme.id === 'light' ? 'text-gray-500' : 'text-gray-400')}>Likes</span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </ToolShell>
    );
}
