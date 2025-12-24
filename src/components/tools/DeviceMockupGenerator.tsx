import { useState, useRef, useEffect, useCallback } from 'react';
import { Upload, Download, Smartphone, Monitor, Layout, Trash2, Image as ImageIcon } from 'lucide-react';
import ToolShell from './ToolShell';
import { useToast } from '@/hooks/useToast';
import LoadingSpinner from '@/components/common/LoadingSpinner';

export default function DeviceMockupGenerator() {
    const [image, setImage] = useState<string | null>(null);
    const [device, setDevice] = useState<'browser' | 'phone'>('browser');
    const [background, setBackground] = useState('#1a1a1a');
    const [padding, setPadding] = useState(40);
    const [isExporting, setIsExporting] = useState(false);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { showToast } = useToast();

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                setImage(event.target?.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const draw = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas || !image) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const img = new Image();
        img.crossOrigin = "anonymous";
        img.src = image;
        img.onload = () => {
            // Config
            const devicePadding = padding;
            const browserHeaderHeight = 40;

            // Calculate dimensions
            let contentWidth = img.width;
            let contentHeight = img.height;

            // Limit max width for performance/display
            const MAX_WIDTH = 1200;
            if (contentWidth > MAX_WIDTH) {
                const ratio = MAX_WIDTH / contentWidth;
                contentWidth = MAX_WIDTH;
                contentHeight = contentHeight * ratio;
            }

            // Frame Dimensions
            let frameWidth = contentWidth;
            let frameHeight = contentHeight;
            let frameX = devicePadding;
            let frameY = devicePadding;

            if (device === 'browser') {
                frameHeight += browserHeaderHeight;
            } else if (device === 'phone') {
                const border = 16;
                frameWidth += border * 2;
                frameHeight += border * 2;
                frameX += 0;
                frameY += 0;
            }

            // Canvas Dimensions
            canvas.width = frameWidth + (devicePadding * 2);
            canvas.height = frameHeight + (devicePadding * 2);

            // Draw Background
            ctx.fillStyle = background;
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Draw Device
            const drawX = devicePadding;
            const drawY = devicePadding;

            ctx.save();
            // Shadow
            ctx.shadowColor = 'rgba(0,0,0,0.4)';
            ctx.shadowBlur = 40;
            ctx.shadowOffsetY = 20;

            if (device === 'browser') {
                // Browser Window
                ctx.fillStyle = '#1e1e1e'; // Window bg
                ctx.beginPath();
                ctx.roundRect(drawX, drawY, frameWidth, frameHeight, 12);
                ctx.fill();

                // Header
                ctx.fillStyle = '#2a2a2a';
                ctx.beginPath();
                ctx.roundRect(drawX, drawY, frameWidth, browserHeaderHeight, [12, 12, 0, 0]);
                ctx.fill();

                // Traffic Lights
                const circleY = drawY + browserHeaderHeight / 2;
                const startX = drawX + 20;
                const gap = 20;

                ctx.fillStyle = '#ff5f56'; // Red
                ctx.beginPath(); ctx.arc(startX, circleY, 6, 0, Math.PI * 2); ctx.fill();

                ctx.fillStyle = '#ffbd2e'; // Yellow
                ctx.beginPath(); ctx.arc(startX + gap, circleY, 6, 0, Math.PI * 2); ctx.fill();

                ctx.fillStyle = '#27c93f'; // Green
                ctx.beginPath(); ctx.arc(startX + gap * 2, circleY, 6, 0, Math.PI * 2); ctx.fill();

                // Image Content
                ctx.restore(); // remove shadow for image clip
                ctx.save();
                ctx.beginPath();
                ctx.roundRect(drawX, drawY + browserHeaderHeight, frameWidth, frameHeight - browserHeaderHeight, [0, 0, 12, 12]);
                ctx.clip();
                ctx.drawImage(img, drawX, drawY + browserHeaderHeight, contentWidth, contentHeight);
                ctx.restore();

            } else {
                // Phone
                const border = 16;
                const phoneW = contentWidth + (border * 2);
                const phoneH = contentHeight + (border * 2);

                ctx.fillStyle = '#000000';
                ctx.beginPath();
                ctx.roundRect(drawX, drawY, phoneW, phoneH, 40);
                ctx.fill();

                // Notch/Camera
                ctx.fillStyle = '#1a1a1a';
                ctx.beginPath();
                ctx.arc(drawX + phoneW / 2, drawY + 20, 8, 0, Math.PI * 2);
                ctx.fill();

                // Image
                ctx.restore();
                ctx.save();
                ctx.beginPath();
                ctx.roundRect(drawX + border, drawY + border, contentWidth, contentHeight, 24);
                ctx.clip();
                ctx.drawImage(img, drawX + border, drawY + border, contentWidth, contentHeight);
                ctx.restore();
            }
        };
    }, [image, device, background, padding]);

    useEffect(() => {
        if (image) {
            draw();
        }
    }, [image, device, background, padding, draw]);

    const handleDownload = () => {
        if (!canvasRef.current) return;
        setIsExporting(true);
        const link = document.createElement('a');
        link.download = `mockup-${Date.now()}.png`;
        link.href = canvasRef.current.toDataURL('image/png');
        link.click();
        setIsExporting(false);
        showToast('Mockup downloaded!', 'success');
    };

    const controls = (
        <div className="flex items-center gap-3">
            <button
                onClick={() => fileInputRef.current?.click()}
                className="btn-primary flex items-center gap-2"
            >
                <Upload size={18} />
                Upload Screenshot
            </button>
            {image && (
                <>
                    <button onClick={handleDownload} disabled={isExporting} className="btn-secondary flex items-center gap-2">
                        <Download size={18} />
                        Download
                    </button>
                    <button onClick={() => setImage(null)} className="btn-ghost" title="Clear">
                        <Trash2 size={18} />
                    </button>
                </>
            )}
            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
            />
        </div>
    );

    return (
        <ToolShell className="space-y-6" controls={controls}>
            {!image ? (
                <div
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-[var(--border-primary)] rounded-2xl p-12 flex flex-col items-center justify-center cursor-pointer hover:border-[var(--brand-primary)] hover:bg-[var(--bg-secondary)] transition-all group"
                >
                    <div className="p-4 rounded-full bg-[var(--bg-secondary)] group-hover:scale-110 transition-transform mb-4">
                        <ImageIcon size={32} className="text-[var(--text-muted)]" />
                    </div>
                    <h3 className="text-lg font-medium text-[var(--text-primary)]">Drop screenshot here</h3>
                    <p className="text-[var(--text-secondary)] mt-2">or click to upload</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="md:col-span-2 space-y-4">
                        <div className="rounded-xl overflow-hidden border border-[var(--border-primary)] bg-[var(--bg-base)] flex items-center justify-center p-4 min-h-[400px]">
                            <canvas ref={canvasRef} className="max-w-full h-auto shadow-2xl rounded-lg" />
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div>
                            <label className="label">Device Frame</label>
                            <div className="grid grid-cols-2 gap-2">
                                <button
                                    onClick={() => setDevice('browser')}
                                    className={`p-3 rounded-xl border flex flex-col items-center gap-2 transition-all ${device === 'browser' ? 'border-[var(--brand-primary)] bg-[var(--brand-primary)]/10 text-[var(--brand-primary)]' : 'border-[var(--border-primary)] hover:bg-[var(--bg-secondary)]'}`}
                                >
                                    <Monitor size={20} />
                                    <span className="text-sm">Browser</span>
                                </button>
                                <button
                                    onClick={() => setDevice('phone')}
                                    className={`p-3 rounded-xl border flex flex-col items-center gap-2 transition-all ${device === 'phone' ? 'border-[var(--brand-primary)] bg-[var(--brand-primary)]/10 text-[var(--brand-primary)]' : 'border-[var(--border-primary)] hover:bg-[var(--bg-secondary)]'}`}
                                >
                                    <Smartphone size={20} />
                                    <span className="text-sm">Phone</span>
                                </button>
                            </div>
                        </div>

                        <div>
                            <label className="label">Background</label>
                            <div className="grid grid-cols-5 gap-2">
                                {['#1a1a1a', '#ffffff', 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 'linear-gradient(135deg, #FF9A9E 0%, #FECFEF 100%)', 'transparent'].map((bg, i) => (
                                    <button
                                        key={i}
                                        onClick={() => setBackground(bg)}
                                        className={`w-8 h-8 rounded-full border border-[var(--border-primary)] ${background === bg ? 'ring-2 ring-[var(--brand-primary)] ring-offset-2 ring-offset-[var(--bg-base)]' : ''}`}
                                        style={{ background: bg === 'transparent' ? 'url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAAAHElEQVQYV2NkYGAwYcACA0hIYICdKkY0t2EAAwA+uwgB+48HEQAAAABJRU5ErkJggg==)' : bg }}
                                        title={bg}
                                    />
                                ))}
                                <input type="color" value={background.startsWith('#') ? background : '#000000'} onChange={e => setBackground(e.target.value)} className="w-8 h-8 rounded cursor-pointer" />
                            </div>
                        </div>

                        <div>
                            <label className="label">Padding: {padding}px</label>
                            <input
                                type="range"
                                min="0"
                                max="100"
                                value={padding}
                                onChange={(e) => setPadding(Number(e.target.value))}
                                className="w-full"
                            />
                        </div>
                    </div>
                </div>
            )}
        </ToolShell>
    );
}
