import { useState, useRef, useCallback } from 'react';
import { Upload, X } from 'lucide-react';
import ToolShell from './ToolShell';
import { useToast } from '@/hooks/useToast';

export default function ColorPaletteExtractor() {
  const [imageUrl, setImageUrl] = useState('');
  const [colors, setColors] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const extractColors = useCallback(() => {
    if (!canvasRef.current || !imageUrl) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;
      const colorMap = new Map<string, number>();

      // Sample pixels (every 10th pixel for performance)
      for (let i = 0; i < data.length; i += 40) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        const hex = `#${[r, g, b].map(x => x.toString(16).padStart(2, '0')).join('')}`;
        colorMap.set(hex, (colorMap.get(hex) || 0) + 1);
      }

      // Get top 10 most common colors
      const sorted = Array.from(colorMap.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10)
        .map(([color]) => color);

      setColors(sorted);
    };
    img.src = imageUrl;
  }, [imageUrl]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    const url = URL.createObjectURL(file);
    setImageUrl(url);
    setTimeout(extractColors, 100);
  };

  const clear = () => {
    setImageUrl('');
    setColors([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const controls = null;

  return (
    <ToolShell className="space-y-6" controls={controls}>
      <div>
        <label className="label">Upload Image</label>
        <div className="flex items-center gap-3">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="btn-secondary flex items-center gap-2"
          >
            <Upload size={18} />
            Choose Image
          </button>
        </div>
      </div>

      {imageUrl && (
        <div>
          <label className="label">Preview</label>
          <div className="rounded-xl border p-4 flex justify-center" style={{ borderColor: 'var(--border-primary)' }}>
            <img src={imageUrl} alt="Preview" className="max-w-full max-h-64 rounded-lg" />
          </div>
          <canvas ref={canvasRef} className="hidden" />
        </div>
      )}

      {colors.length > 0 && (
        <>
          <div className="flex items-center gap-3">
            <button onClick={clear} className="btn-ghost">
              <X size={18} />
              Clear
            </button>
          </div>
          <div>
            <label className="label">Color Palette</label>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {colors.map((color, i) => (
                <div key={i} className="text-center">
                  <div
                    className="w-full h-24 rounded-lg border mb-2"
                    style={{ backgroundColor: color, borderColor: 'var(--border-primary)' }}
                  />
                  <div className="text-xs font-mono" style={{ color: 'var(--text-muted)' }}>
                    {color}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </ToolShell>
  );
}

