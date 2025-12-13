import { useState, useCallback } from 'react';
import OutputPanel from '@/components/common/OutputPanel';

export default function ColorPicker() {
  const [color, setColor] = useState('#000000');
  const [formats, setFormats] = useState<Record<string, string>>({});

  const hexToRgb = (hex: string): { r: number; g: number; b: number } | null => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  };

  const rgbToHsl = (r: number, g: number, b: number): { h: number; s: number; l: number } => {
    r /= 255;
    g /= 255;
    b /= 255;
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0, s = 0;
    const l = (max + min) / 2;

    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
        case g: h = ((b - r) / d + 2) / 6; break;
        case b: h = ((r - g) / d + 4) / 6; break;
      }
    }

    return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
  };

  const updateFormats = useCallback((hex: string) => {
    const rgb = hexToRgb(hex);
    if (!rgb) return;

    const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);

    setFormats({
      hex: hex.toUpperCase(),
      rgb: `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`,
      rgba: `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 1)`,
      hsl: `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`,
      hsla: `hsla(${hsl.h}, ${hsl.s}%, ${hsl.l}%, 1)`
    });
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <label className="label">Color Picker</label>
        <div className="flex items-center gap-4">
          <input
            type="color"
            value={color}
            onChange={(e) => { setColor(e.target.value); updateFormats(e.target.value); }}
            className="w-20 h-20 rounded-lg border cursor-pointer"
            style={{ borderColor: 'var(--border-primary)' }}
          />
          <input
            type="text"
            value={color}
            onChange={(e) => { setColor(e.target.value); updateFormats(e.target.value); }}
            className="input-base font-mono flex-1"
            placeholder="#000000"
          />
        </div>
      </div>

      <div>
        <label className="label">Color Preview</label>
        <div
          className="w-full h-32 rounded-lg border"
          style={{ backgroundColor: color, borderColor: 'var(--border-primary)' }}
        />
      </div>

      {Object.keys(formats).length > 0 && (
        <div>
          <label className="label">Color Formats</label>
          <div className="space-y-2">
            {Object.entries(formats).map(([format, value]) => (
              <div key={format} className="flex items-center justify-between p-3 rounded-lg border" style={{ borderColor: 'var(--border-primary)' }}>
                <span className="text-sm font-medium capitalize">{format}:</span>
                <code className="font-mono text-sm">{value}</code>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

