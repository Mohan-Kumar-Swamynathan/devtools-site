import { useState, useCallback } from 'react';
import { Copy, RotateCcw, Palette } from 'lucide-react';
import ToolShell from './ToolShell';
import { useToast } from '@/hooks/useToast';

const generatePalette = (baseColor: string) => {
  const hex = baseColor.replace('#', '');
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);

  const palette = [baseColor];
  
  // Generate variations
  for (let i = 1; i <= 4; i++) {
    const factor = 1 - (i * 0.2);
    const newR = Math.round(r * factor);
    const newG = Math.round(g * factor);
    const newB = Math.round(b * factor);
    palette.push(`#${newR.toString(16).padStart(2, '0')}${newG.toString(16).padStart(2, '0')}${newB.toString(16).padStart(2, '0')}`);
  }

  // Generate lighter variations
  for (let i = 1; i <= 4; i++) {
    const factor = 1 + (i * 0.15);
    const newR = Math.min(255, Math.round(r * factor));
    const newG = Math.min(255, Math.round(g * factor));
    const newB = Math.min(255, Math.round(b * factor));
    palette.unshift(`#${newR.toString(16).padStart(2, '0')}${newG.toString(16).padStart(2, '0')}${newB.toString(16).padStart(2, '0')}`);
  }

  return palette;
};

export default function ColorPaletteGenerator() {
  const [baseColor, setBaseColor] = useState('#0ea5e9');
  const [palette, setPalette] = useState<string[]>(generatePalette('#0ea5e9'));
  const { showToast } = useToast();

  const handleColorChange = useCallback((color: string) => {
    setBaseColor(color);
    setPalette(generatePalette(color));
  }, []);

  const handleCopy = useCallback((color: string) => {
    navigator.clipboard.writeText(color).then(() => {
      showToast(`Copied ${color} to clipboard!`, 'success');
    });
  }, [showToast]);

  const handleCopyPalette = useCallback(() => {
    const css = `:root {\n${palette.map((color, i) => `  --color-${i + 1}: ${color};`).join('\n')}\n}`;
    navigator.clipboard.writeText(css).then(() => {
      showToast('Palette copied as CSS!', 'success');
    });
  }, [palette, showToast]);

  
  const controls = (
          <div className="flex items-center gap-3">
        <button
          onClick={handleCopyPalette}
          className="btn-primary flex items-center gap-2"
        >
          <Copy size={18} />
          Copy Palette as CSS
        </button>
        <button
          onClick={() => {
            const randomColor = '#' + Math.floor(Math.random()*16777215).toString(16);
            handleColorChange(randomColor);
          }}
          className="btn-secondary flex items-center gap-2"
        >
          <RotateCcw size={18} />
          Random Color
        </button>
      </div>
  );

  return (
    <ToolShell className="space-y-6" controls={controls}>
{/* Controls moved to header */}



















      <div className="space-y-4">
        <div>
          <label className="label flex items-center gap-2">
            <Palette size={18} />
            Base Color
          </label>
          <div className="flex items-center gap-3">
            <input
              type="color"
              value={baseColor}
              onChange={(e) => handleColorChange(e.target.value)}
              className="w-20 h-12 rounded-lg cursor-pointer"
            />
            <input
              type="text"
              value={baseColor}
              onChange={(e) => {
                if (/^#[0-9A-Fa-f]{6}$/.test(e.target.value)) {
                  handleColorChange(e.target.value);
                }
              }}
              className="input flex-1 font-mono"
              placeholder="#0ea5e9"
            />
            <button
              onClick={() => handleCopy(baseColor)}
              className="btn-secondary"
            >
              <Copy size={16} />
            </button>
          </div>
        </div>

        <div className="p-6 rounded-xl border" style={{
          backgroundColor: 'var(--bg-secondary)',
          borderColor: 'var(--border-primary)'
        }}>
          <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
            Generated Palette
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-9 gap-3">
            {palette.map((color, index) => (
              <button
                key={index}
                onClick={() => handleCopy(color)}
                className="group relative aspect-square rounded-lg border-2 transition-all hover:scale-110 hover:z-10"
                style={{
                  backgroundColor: color,
                  borderColor: 'var(--border-primary)'
                }}
                title={color}
              >
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Copy className="text-white drop-shadow-lg" size={20} />
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-1 text-xs font-mono text-white bg-black/50 rounded-b-lg opacity-0 group-hover:opacity-100 transition-opacity">
                  {color}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </ToolShell>
  );
}

