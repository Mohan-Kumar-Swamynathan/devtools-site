import React, { useState } from 'react';
import { Download, Image as ImageIcon, Link as LinkIcon, AlertCircle } from 'lucide-react';
import { clsx } from 'clsx';
import ToolShell from './ToolShell';

interface Thumbnail {
    quality: string;
    url: string;
    resolution: string;
    label: string;
}

export default function YouTubeThumbnail() {
    const [url, setUrl] = useState('');
    const [thumbnails, setThumbnails] = useState<Thumbnail[]>([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const extractVideoId = (input: string) => {
        const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
        const match = input.match(regex);
        return match ? match[1] : null;
    };

    const handleFetch = () => {
        setError('');
        setThumbnails([]);
        setLoading(true);

        const videoId = extractVideoId(url);

        if (!videoId) {
            setError('Invalid YouTube URL. Please enter a valid URL.');
            setLoading(false);
            return;
        }

        // Simulate network delay for better UX
        setTimeout(() => {
            setThumbnails([
                {
                    quality: 'maxres',
                    label: 'Max HD (1280x720)',
                    resolution: '1280x720',
                    url: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`
                },
                {
                    quality: 'sd',
                    label: 'Standard (640x480)',
                    resolution: '640x480',
                    url: `https://img.youtube.com/vi/${videoId}/sddefault.jpg`
                },
                {
                    quality: 'hq',
                    label: 'High (480x360)',
                    resolution: '480x360',
                    url: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`
                },
                {
                    quality: 'mq',
                    label: 'Medium (320x180)',
                    resolution: '320x180',
                    url: `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`
                }
            ]);
            setLoading(false);
        }, 500);
    };

    const handleDownload = async (thumbnailUrl: string, quality: string) => {
        try {
            const response = await fetch(thumbnailUrl);
            const blob = await response.blob();
            const blobUrl = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = blobUrl;
            link.download = `youtube-thumbnail-${quality}.jpg`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(blobUrl);
        } catch (e) {
            // Fallback for when CORS blocks direct download
            window.open(thumbnailUrl, '_blank');
        }
    };

    return (
        <ToolShell
            title="YouTube Thumbnail Downloader"
            description="Download high-quality thumbnails from any YouTube video"
            icon={<ImageIcon className="w-6 h-6" />}
        >
            <div className="space-y-8">
                {/* Input Section */}
                <div className="p-6 rounded-2xl bg-[var(--bg-elevated)] border border-[var(--border-primary)] shadow-sm">
                    <label className="block text-sm font-medium mb-2 text-[var(--text-secondary)]">
                        YouTube Video URL
                    </label>
                    <div className="flex gap-3">
                        <div className="relative flex-grow">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <LinkIcon className="h-5 w-5 text-[var(--text-muted)]" />
                            </div>
                            <input
                                type="text"
                                value={url}
                                onChange={(e) => setUrl(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleFetch()}
                                placeholder="https://www.youtube.com/watch?v=..."
                                className="block w-full pl-10 pr-3 py-3 rounded-xl bg-[var(--bg-input)] border border-[var(--border-input)] text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:ring-2 focus:ring-[var(--brand-primary)] focus:border-transparent transition-all outline-none"
                            />
                        </div>
                        <button
                            onClick={handleFetch}
                            disabled={!url || loading}
                            className={clsx(
                                "px-6 py-3 rounded-xl font-semibold text-white transition-all shadow-lg hover:shadow-xl active:scale-95",
                                url && !loading
                                    ? "bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400"
                                    : "bg-gray-600 cursor-not-allowed opacity-50"
                            )}
                        >
                            {loading ? 'Fetching...' : 'Get Thumbnails'}
                        </button>
                    </div>

                    {error && (
                        <div className="mt-4 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 flex items-center gap-2">
                            <AlertCircle className="w-5 h-5" />
                            <span>{error}</span>
                        </div>
                    )}
                </div>

                {/* Results Grid */}
                {thumbnails.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in-up">
                        {thumbnails.map((thumb) => (
                            <div
                                key={thumb.quality}
                                className="group relative overflow-hidden rounded-2xl bg-[var(--bg-elevated)] border border-[var(--border-primary)] transition-all hover:border-[var(--brand-primary)] hover:shadow-lg"
                            >
                                <div className="aspect-video relative bg-black/5">
                                    <img
                                        src={thumb.url}
                                        alt={`${thumb.label} thumbnail`}
                                        className="w-full h-full object-cover"
                                        loading="lazy"
                                    />
                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />

                                    {/* Badge */}
                                    <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-black/70 backdrop-blur-md text-white text-xs font-medium border border-white/10">
                                        {thumb.label}
                                    </div>
                                </div>

                                <div className="p-4 flex items-center justify-between">
                                    <div className="text-sm font-medium text-[var(--text-secondary)]">
                                        {thumb.resolution}
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => window.open(thumb.url, '_blank')}
                                            className="p-2 rounded-lg text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] transition-colors"
                                            title="Open in new tab"
                                        >
                                            <LinkIcon className="w-5 h-5" />
                                        </button>
                                        <button
                                            onClick={() => handleDownload(thumb.url, thumb.quality)}
                                            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[var(--bg-secondary)] text-[var(--text-primary)] font-medium hover:bg-[var(--bg-hover)] transition-all active:scale-95"
                                        >
                                            <Download className="w-4 h-4" />
                                            Download
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Instructions / SEO Content */}
                {!thumbnails.length && !loading && (
                    <div className="mt-12 prose prose-invert max-w-none text-[var(--text-secondary)]">
                        <h3>How to download YouTube thumbnails?</h3>
                        <ol>
                            <li>Copy the URL of the YouTube video (e.g., https://www.youtube.com/watch?v=dQw4w9WgXcQ)</li>
                            <li>Paste the URL into the input field above</li>
                            <li>Click <strong>Get Thumbnails</strong> to fetch available images</li>
                            <li>Choose your preferred quality (HD, SD, or Normal) and click Download</li>
                        </ol>

                        <div className="mt-6 p-4 rounded-xl bg-blue-500/5 border border-blue-500/10">
                            <h4 className="text-blue-400 mt-0">💡 Pro Tip</h4>
                            <p className="mb-0 text-sm">
                                Most videos have a "Max HD" (1280x720) thumbnail available. If it appears as a gray image, it means the uploader didn't upload a high-resolution thumbnail. In that case, try the "High Quality" version.
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </ToolShell>
    );
}
