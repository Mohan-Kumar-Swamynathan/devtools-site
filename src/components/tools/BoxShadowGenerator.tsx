import { useState, useCallback } from 'react';
import OutputPanel from '@/components/common/OutputPanel';

export default function BoxShadowGenerator() {
  const [offsetX, setOffsetX] = useState(0);
  const [offsetY, setOffsetY] = useState(4);
  const [blur, setBlur] = useState(6);
  const [spread, setSpread] = useState(0);
  const [color, setColor] = useState('#000000');
  const [opacity, setOpacity] = useState(0.1);
  const [inset, setInset] = useState(false);

  const getCss = useCallback(() => {
    const rgba = hexToRgba(color, opacity);
    const insetStr = inset ? 'inset ' : '';
    return `box-shadow: ${insetStr}${offsetX}px ${offsetY}px ${blur}px ${spread}px ${rgba};`;
  }, [offsetX, offsetY, blur, spread, color, opacity, inset]);

  const hexToRgba = (hex: string, alpha: number): string => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="label">Offset X: {offsetX}px</label>
          <input
            type="range"
            min="-50"
            max="50"
            value={offsetX}
            onChange={(e) => setOffsetX(parseInt(e.target.value))}
            className="w-full"
          />
        </div>
        <div>
          <label className="label">Offset Y: {offsetY}px</label>
          <input
            type="range"
            min="-50"
            max="50"
            value={offsetY}
            onChange={(e) => setOffsetY(parseInt(e.target.value))}
            className="w-full"
          />
        </div>
        <div>
          <label className="label">Blur: {blur}px</label>
          <input
            type="range"
            min="0"
            max="50"
            value={blur}
            onChange={(e) => setBlur(parseInt(e.target.value))}
            className="w-full"
          />
        </div>
        <div>
          <label className="label">Spread: {spread}px</label>
          <input
            type="range"
            min="-20"
            max="20"
            value={spread}
            onChange={(e) => setSpread(parseInt(e.target.value))}
            className="w-full"
          />
        </div>
        <div>
          <label className="label">Color</label>
          <input
            type="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            className="w-full h-10 rounded border cursor-pointer"
            style={{ borderColor: 'var(--border-primary)' }}
          />
        </div>
        <div>
          <label className="label">Opacity: {opacity}</label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={opacity}
            onChange={(e) => setOpacity(parseFloat(e.target.value))}
            className="w-full"
          />
        </div>
      </div>

      <div>
        <label className="label">Options</label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={inset}
            onChange={(e) => setInset(e.target.checked)}
            className="checkbox"
          />
          <span>Inset shadow</span>
        </label>
      </div>

      <div className="p-8 rounded-xl border flex items-center justify-center" style={{ 
        borderColor: 'var(--border-primary)',
        boxShadow: `${inset ? 'inset ' : ''}${offsetX}px ${offsetY}px ${blur}px ${spread}px ${hexToRgba(color, opacity)}`
      }}>
        <div className="text-center">
          <div className="text-lg font-medium">Preview</div>
        </div>
      </div>

      <OutputPanel
        value={getCss()}
        label="CSS Code"
        language="css"
      />
    </div>
  );
}

