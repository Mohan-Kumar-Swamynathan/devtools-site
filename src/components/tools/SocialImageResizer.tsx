import React, { useState, useRef, useEffect } from 'react';
import { Upload, Download, Image as ImageIcon, Check, RefreshCw } from 'lucide-react';
import { clsx } from 'clsx';
import ToolShell from './ToolShell';

interface Preset {
    id: string;
    name: string;
    platform: 'Instagram' | 'Twitter' | 'LinkedIn' | 'Facebook' | 'YouTube';
    width: number;
    height: number;
    aspectRatio: number; // width / height
}

const PRESETS: Preset[] = [
    { id: 'ig-square', name: 'Square Post', platform: 'Instagram', width: 1080, height: 1080, aspectRatio: 1 },
    { id: 'ig-portrait', name: 'Portrait Post', platform: 'Instagram', width: 1080, height: 1350, aspectRatio: 4 / 5 },
    { id: 'ig-story', name: 'Story', platform: 'Instagram', width: 1080, height: 1920, aspectRatio: 9 / 16 },
    { id: 'tw-post', name: 'Post', platform: 'Twitter', width: 1200, height: 675, aspectRatio: 16 / 9 },
    { id: 'tw-header', name: 'Header', platform: 'Twitter', width: 1500, height: 500, aspectRatio: 3 / 1 },
    { id: 'li-post', name: 'Post', platform: 'LinkedIn', width: 1200, height: 627, aspectRatio: 1.91 },
    { id: 'fb-post', name: 'Post', platform: 'Facebook', width: 1200, height: 630, aspectRatio: 1.9 },
    { id: 'yt-thumb', name: 'Thumbnail', platform: 'YouTube', width: 1280, height: 720, aspectRatio: 16 / 9 },
];

export default function SocialImageResizer() {
    const [image, setImage] = useState<HTMLImageElement | null>(null);
    const [selectedPreset, setSelectedPreset] = useState<Preset>(PRESETS[0]);
    const [previewUrl, setPreviewUrl] = useState<string>('');
    const [isDragOver, setIsDragOver] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) processFile(file);
    };

    const processFile = (file: File) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new Image();
            img.onload = () => {
                setImage(img);
                generatePreview(img, selectedPreset);
            };
            img.src = e.target?.result as string;
        };
        reader.readAsDataURL(file);
    };

    const generatePreview = (img: HTMLImageElement, preset: Preset) => {
        const canvas = document.createElement('canvas');
        canvas.width = preset.width;
        canvas.height = preset.height;
        const ctx = canvas.getContext('2d');

        if (!ctx) return;

        // Draw background
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Calculate dimensions to fit/cover
        const scale = Math.max(preset.width / img.width, preset.height / img.height);
        const x = (preset.width / 2) - (img.width / 2) * scale;
        const y = (preset.height / 2) - (img.height / 2) * scale;

        ctx.drawImage(img, x, y, img.width * scale, img.height * scale);

        setPreviewUrl(canvas.toDataURL('image/jpeg', 0.9));
    };

    useEffect(() => {
        if (image) {
            generatePreview(image, selectedPreset);
        }
    }, [selectedPreset, image]);

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOver(false);
        const file = e.dataTransfer.files[0];
        if (file && file.type.startsWith('image/')) {
            processFile(file);
        }
    };

    const handleDownload = () => {
        if (!previewUrl) return;
        const link = document.createElement('a');
        link.download = `resized-${selectedPreset.platform}-${selectedPreset.name}.jpg`;
        link.href = previewUrl;
        link.click();
    };

    return (
        <ToolShell
            title="Social Media Image Resizer"
            description="Resize images for Instagram, Twitter, LinkedIn and more"
            icon={<ImageIcon className="w-6 h-6" />}
        >
            <div className="space-y-8">
                {!image ? (
                    <div
                        onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
                        onDragLeave={() => setIsDragOver(false)}
                        onDrop={handleDrop}
                        onClick={() => fileInputRef.current?.click()}
                        className={clsx(
                            "border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all",
                            isDragOver
                                ? "border-[var(--brand-primary)] bg-[var(--brand-primary)]/5"
                                : "border-[var(--border-primary)] hover:border-[var(--brand-primary)] hover:bg-[var(--bg-elevated)]"
                        )}
                    >
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            className="hidden"
                        />
                        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[var(--bg-secondary)] flex items-center justify-center">
                            <Upload className="w-8 h-8 text-[var(--text-secondary)]" />
                        </div>
                        <h3 className="text-xl font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
                            Upload an Image
                        </h3>
                        <p className="text-[var(--text-secondary)]">
                            Drag & drop or click to browse
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Controls */}
                        <div className="space-y-6">
                            <div className="p-6 rounded-2xl bg-[var(--bg-elevated)] border border-[var(--border-primary)]">
                                <h3 className="font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>Select Format</h3>

                                <div className="space-y-6">
                                    {['Instagram', 'Twitter', 'LinkedIn', 'Facebook', 'YouTube'].map(platform => (
                                        <div key={platform}>
                                            <h4 className="text-xs font-bold uppercase tracking-wider mb-2 text-[var(--text-secondary)]">
                                                {platform}
                                            </h4>
                                            <div className="grid grid-cols-2 gap-2">
                                                {PRESETS.filter(p => p.platform === platform).map(preset => (
                                                    <button
                                                        key={preset.id}
                                                        onClick={() => setSelectedPreset(preset)}
                                                        className={clsx(
                                                            "text-left px-3 py-2 rounded-lg text-sm transition-all border",
                                                            selectedPreset.id === preset.id
                                                                ? "bg-[var(--brand-primary)] text-white border-[var(--brand-primary)]"
                                                                : "hover:bg-[var(--bg-secondary)] border-transparent text-[var(--text-primary)]"
                                                        )}
                                                    >
                                                        <div className="font-medium">{preset.name}</div>
                                                        <div className={clsx(
                                                            "text-xs",
                                                            selectedPreset.id === preset.id ? "text-white/80" : "text-[var(--text-secondary)]"
                                                        )}>
                                                            {preset.width} x {preset.height}
                                                        </div>
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <button
                                onClick={() => setImage(null)}
                                className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-[var(--border-primary)] hover:bg-[var(--bg-secondary)] text-[var(--text-primary)] transition-all"
                            >
                                <RefreshCw className="w-4 h-4" />
                                Upload New Image
                            </button>
                        </div>

                        {/* Preview */}
                        <div className="lg:col-span-2 space-y-4">
                            <div className="relative rounded-2xl overflow-hidden bg-[var(--bg-elevated)] border border-[var(--border-primary)] shadow-sm">
                                <div className="absolute inset-0 bg-[radial-gradient(var(--border-primary)_1px,transparent_1px)] [background-size:20px_20px] opacity-20" />
                                <div className="relative p-8 flex items-center justify-center min-h-[400px]">
                                    {previewUrl && (
                                        <img
                                            src={previewUrl}
                                            alt="Preview"
                                            className="max-w-full max-h-[600px] shadow-2xl rounded-sm"
                                        />
                                    )}
                                </div>
                            </div>

                            <div className="flex justify-end">
                                <button
                                    onClick={handleDownload}
                                    className="flex items-center gap-2 px-8 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-semibold shadow-lg hover:shadow-xl active:scale-95 transition-all"
                                >
                                    <Download className="w-5 h-5" />
                                    Download Image
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </ToolShell>
    );
}
