import { useState, useRef, useCallback, useEffect } from 'react';
import { Upload, Download, Trash2, Type, Image as ImageIcon } from 'lucide-react';
import ErrorMessage from '@/components/common/ErrorMessage';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import ToolShell from './ToolShell';
import { useToast } from '@/hooks/useToast';

interface WatermarkSettings {
  type: 'text' | 'image';
  text: string;
  fontSize: number;
  color: string;
  opacity: number;
  position: string;
  watermarkImage: HTMLImageElement | null;
}

const POSITIONS = [
  { label: 'Top Left', value: 'top-left' },
  { label: 'Top Center', value: 'top-center' },
  { label: 'Top Right', value: 'top-right' },
  { label: 'Center Left', value: 'center-left' },
  { label: 'Center', value: 'center' },
  { label: 'Center Right', value: 'center-right' },
  { label: 'Bottom Left', value: 'bottom-left' },
  { label: 'Bottom Center', value: 'bottom-center' },
  { label: 'Bottom Right', value: 'bottom-right' },
];

export default function ImageWatermarker() {
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const [watermarkedImage, setWatermarkedImage] = useState<string>('');
  const [settings, setSettings] = useState<WatermarkSettings>({
    type: 'text',
    text: 'Watermark',
    fontSize: 48,
    color: '#FFFFFF',
    opacity: 0.7,
    position: 'bottom-right',
    watermarkImage: null,
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const watermarkInputRef = useRef<HTMLInputElement>(null);

  const applyWatermark = useCallback(async () => {
    if (!image) return;

    setIsProcessing(true);
    setError('');

    try {
      const canvas = document.createElement('canvas');
      canvas.width = image.width;
      canvas.height = image.height;

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        throw new Error('Could not get canvas context');
      }

      ctx.drawImage(image, 0, 0);

      if (settings.type === 'text') {
        ctx.font = `bold ${settings.fontSize}px Arial`;
        ctx.fillStyle = settings.color;
        ctx.globalAlpha = settings.opacity;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        const textMetrics = ctx.measureText(settings.text);
        const textWidth = textMetrics.width;
        const textHeight = settings.fontSize;

        let x = 0;
        let y = 0;

        if (settings.position.includes('left')) x = textWidth / 2 + 20;
        else if (settings.position.includes('right')) x = canvas.width - textWidth / 2 - 20;
        else x = canvas.width / 2;

        if (settings.position.includes('top')) y = textHeight / 2 + 20;
        else if (settings.position.includes('bottom')) y = canvas.height - textHeight / 2 - 20;
        else y = canvas.height / 2;

        ctx.fillText(settings.text, x, y);
      } else if (settings.type === 'image' && settings.watermarkImage) {
        ctx.globalAlpha = settings.opacity;

        const watermarkWidth = Math.min(settings.watermarkImage.width, canvas.width * 0.3);
        const watermarkHeight = (settings.watermarkImage.height / settings.watermarkImage.width) * watermarkWidth;

        let x = 0;
        let y = 0;

        if (settings.position.includes('left')) x = 20;
        else if (settings.position.includes('right')) x = canvas.width - watermarkWidth - 20;
        else x = (canvas.width - watermarkWidth) / 2;

        if (settings.position.includes('top')) y = 20;
        else if (settings.position.includes('bottom')) y = canvas.height - watermarkHeight - 20;
        else y = (canvas.height - watermarkHeight) / 2;

        ctx.drawImage(settings.watermarkImage, x, y, watermarkWidth, watermarkHeight);
      }

      const dataUrl = canvas.toDataURL('image/png');
      setWatermarkedImage(dataUrl);
      setIsProcessing(false);
    } catch (e) {
      setError(`Watermark error: ${(e as Error).message}`);
      setIsProcessing(false);
    }
  }, [image, settings]);

  useEffect(() => {
    if (image) {
      applyWatermark();
    }
  }, [image, settings, applyWatermark]);

  const handleImageSelect = useCallback((files: FileList | null) => {
    if (!files || files.length === 0) return;

    const file = files[0];
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file');
      return;
    }

    setError('');
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => setImage(img);
      img.onerror = () => setError('Failed to load image');
      img.src = e.target?.result as string;
    };
    reader.onerror = () => setError('Failed to read file');
    reader.readAsDataURL(file);
  }, []);

  const handleWatermarkImageSelect = useCallback((files: FileList | null) => {
    if (!files || files.length === 0) return;

    const file = files[0];
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file for watermark');
      return;
    }

    setError('');
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        setSettings(prev => ({ ...prev, watermarkImage: img }));
      };
      img.onerror = () => setError('Failed to load watermark image');
      img.src = e.target?.result as string;
    };
    reader.onerror = () => setError('Failed to read watermark file');
    reader.readAsDataURL(file);
  }, []);

  const handleDownload = useCallback(() => {
    if (!watermarkedImage) return;
    const link = document.createElement('a');
    link.href = watermarkedImage;
    link.download = 'watermarked-image.png';
    link.click();
  }, [watermarkedImage]);

  const handleReset = useCallback(() => {
    setImage(null);
    setWatermarkedImage('');
    setSettings({
      type: 'text',
      text: 'Watermark',
      fontSize: 48,
      color: '#FFFFFF',
      opacity: 0.7,
      position: 'bottom-right',
      watermarkImage: null,
    });
    setError('');
  }, []);

  
  const controls = (
          <div className="flex items-center gap-3">
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={isProcessing}
          className="btn-primary flex items-center gap-2"
        >
          <Upload size={18} />
          Select Image
        </button>
        {image && (
          <>
            <button
              onClick={handleDownload}
              disabled={!watermarkedImage || isProcessing}
              className="btn-secondary flex items-center gap-2"
            >
              <Download size={18} />
              Download
            </button>
            <button
              onClick={handleReset}
              className="btn-ghost flex items-center gap-2"
            >
              <Trash2 size={18} />
              Reset
            </button>
          </>
        )}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={(e) => handleImageSelect(e.target.files)}
          className="hidden"
        />
      </div>
  );

  return (
    <ToolShell className="space-y-6" controls={controls}>
      {error && <ErrorMessage message={error} onDismiss={() => setError('')} />}

{/* Controls moved to header */}




































      {image && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
              Original
            </h3>
            <div className="p-4 rounded-xl border" style={{
              backgroundColor: 'var(--bg-secondary)',
              borderColor: 'var(--border-primary)'
            }}>
              <img
                src={image.src}
                alt="Original"
                className="w-full rounded-lg"
              />
            </div>
          </div>
          <div className="space-y-4">
            <h3 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
              Watermarked Preview
            </h3>
            <div className="p-4 rounded-xl border" style={{
              backgroundColor: 'var(--bg-secondary)',
              borderColor: 'var(--border-primary)'
            }}>
              {isProcessing ? (
                <div className="flex items-center justify-center h-64">
                  <LoadingSpinner />
                </div>
              ) : (
                <img
                  src={watermarkedImage || image.src}
                  alt="Watermarked"
                  className="w-full rounded-lg"
                />
              )}
            </div>
          </div>
        </div>
      )}

      {image && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
            Watermark Settings
          </h3>
          <div className="p-4 rounded-xl border space-y-4" style={{
            backgroundColor: 'var(--bg-secondary)',
            borderColor: 'var(--border-primary)'
          }}>
            <div>
              <label className="label">Watermark Type</label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="watermarkType"
                    value="text"
                    checked={settings.type === 'text'}
                    onChange={(e) => setSettings({ ...settings, type: 'text' })}
                    className="radio"
                  />
                  <Type size={18} />
                  <span style={{ color: 'var(--text-primary)' }}>Text</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="watermarkType"
                    value="image"
                    checked={settings.type === 'image'}
                    onChange={(e) => setSettings({ ...settings, type: 'image' })}
                    className="radio"
                  />
                  <ImageIcon size={18} />
                  <span style={{ color: 'var(--text-primary)' }}>Image</span>
                </label>
              </div>
            </div>

            {settings.type === 'text' && (
              <>
                <div>
                  <label className="label">Text</label>
                  <input
                    type="text"
                    value={settings.text}
                    onChange={(e) => setSettings({ ...settings, text: e.target.value })}
                    className="input w-full"
                    placeholder="Enter watermark text"
                  />
                </div>
                <div>
                  <label className="label">Font Size: {settings.fontSize}px</label>
                  <input
                    type="range"
                    min="12"
                    max="200"
                    value={settings.fontSize}
                    onChange={(e) => setSettings({ ...settings, fontSize: parseInt(e.target.value) })}
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="label">Color</label>
                  <input
                    type="color"
                    value={settings.color}
                    onChange={(e) => setSettings({ ...settings, color: e.target.value })}
                    className="w-full h-10"
                  />
                </div>
              </>
            )}

            {settings.type === 'image' && (
              <div>
                <label className="label">Watermark Image</label>
                <button
                  onClick={() => watermarkInputRef.current?.click()}
                  className="btn-secondary w-full flex items-center justify-center gap-2"
                >
                  <Upload size={18} />
                  Upload Watermark Image
                </button>
                <input
                  ref={watermarkInputRef}
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleWatermarkImageSelect(e.target.files)}
                  className="hidden"
                />
              </div>
            )}

            <div>
              <label className="label">Position</label>
              <select
                value={settings.position}
                onChange={(e) => setSettings({ ...settings, position: e.target.value })}
                className="input w-full"
              >
                {POSITIONS.map(pos => (
                  <option key={pos.value} value={pos.value}>{pos.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="label">Opacity: {Math.round(settings.opacity * 100)}%</label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={settings.opacity}
                onChange={(e) => setSettings({ ...settings, opacity: parseFloat(e.target.value) })}
                className="w-full"
              />
            </div>
          </div>
        </div>
      )}

      <div className="p-4 rounded-xl border text-sm" style={{
        backgroundColor: 'var(--bg-secondary)',
        borderColor: 'var(--border-primary)'
      }}>
        <h3 className="font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
          Tips:
        </h3>
        <ul className="space-y-1 text-xs" style={{ color: 'var(--text-muted)' }}>
          <li>• Use text watermarks for copyright protection</li>
          <li>• Use image watermarks for logos or branding</li>
          <li>• Adjust opacity to make watermark subtle or prominent</li>
          <li>• Choose position based on your image composition</li>
        </ul>
      </div>
    </ToolShell>
  );
}

