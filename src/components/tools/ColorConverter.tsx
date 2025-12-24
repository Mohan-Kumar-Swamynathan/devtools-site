import { useState, useCallback } from 'react';
import ToolShell from './ToolShell';
import { useToast } from '@/hooks/useToast';

export default function ColorConverter() {
  const [hex, setHex] = useState('#3b82f6');
  const [rgb, setRgb] = useState('rgb(59, 130, 246)');
  const [hsl, setHsl] = useState('hsl(217, 91%, 60%)');

  const hexToRgb = (hex: string): [number, number, number] | null => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? [
      parseInt(result[1], 16),
      parseInt(result[2], 16),
      parseInt(result[3], 16)
    ] : null;
  };

  const rgbToHsl = (r: number, g: number, b: number): [number, number, number] => {
    r /= 255;
    g /= 255;
    b /= 255;
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0, s = 0, l = (max + min) / 2;

    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
        case g: h = ((b - r) / d + 2) / 6; break;
        case b: h = ((r - g) / d + 4) / 6; break;
      }
    }

    return [Math.round(h * 360), Math.round(s * 100), Math.round(l * 100)];
  };

  const updateFromHex = useCallback((value: string) => {
    setHex(value);
    const rgbValues = hexToRgb(value);
    if (rgbValues) {
      const [r, g, b] = rgbValues;
      setRgb(`rgb(${r}, ${g}, ${b})`);
      const [h, s, l] = rgbToHsl(r, g, b);
      setHsl(`hsl(${h}, ${s}%, ${l}%)`);
    }
  }, []);

  const updateFromRgb = useCallback((value: string) => {
    setRgb(value);
    const match = value.match(/\d+/g);
    if (match && match.length >= 3) {
      const r = parseInt(match[0]);
      const g = parseInt(match[1]);
      const b = parseInt(match[2]);
      const hexValue = '#' + [r, g, b].map(x => {
        const hex = x.toString(16);
        return hex.length === 1 ? '0' + hex : hex;
      }).join('');
      setHex(hexValue);
      const [h, s, l] = rgbToHsl(r, g, b);
      setHsl(`hsl(${h}, ${s}%, ${l}%)`);
    }
  }, []);

  const controls = null;

  return (
    <ToolShell className="space-y-6" controls={controls}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="label">HEX</label>
          <div className="flex gap-2">
            <input
              type="color"
              value={hex}
              onChange={(e) => updateFromHex(e.target.value)}
              className="w-16 h-10 rounded border cursor-pointer"
              style={{ borderColor: 'var(--border-primary)' }}
            />
            <input
              type="text"
              value={hex}
              onChange={(e) => updateFromHex(e.target.value)}
              placeholder="#000000"
              className="input-base font-mono flex-1"
            />
          </div>
        </div>
        <div>
          <label className="label">RGB</label>
          <input
            type="text"
            value={rgb}
            onChange={(e) => updateFromRgb(e.target.value)}
            placeholder="rgb(0, 0, 0)"
            className="input-base font-mono"
          />
        </div>
        <div>
          <label className="label">HSL</label>
          <input
            type="text"
            value={hsl}
            readOnly
            className="input-base font-mono"
          />
        </div>
      </div>

      <div className="p-8 rounded-xl border flex items-center justify-center" style={{ backgroundColor: hex, borderColor: 'var(--border-primary)' }}>
        <div className="text-center">
          <div className="text-2xl font-bold mb-2" style={{ color: '#fff', textShadow: '0 2px 4px rgba(0,0,0,0.3)' }}>
            Preview
          </div>
          <div className="text-sm" style={{ color: '#fff', textShadow: '0 2px 4px rgba(0,0,0,0.3)' }}>
            {hex}
          </div>
        </div>
      </div>
    </ToolShell>
  );
}

