import { useState, useCallback } from 'react';
import { Palette } from 'lucide-react';

export default function HexToRgb() {
  const [hex, setHex] = useState('#3b82f6');

  const convert = useCallback(() => {
    const hexValue = hex.replace('#', '');
    
    if (!/^[0-9A-Fa-f]{6}$/.test(hexValue)) {
      return null;
    }

    const r = parseInt(hexValue.substring(0, 2), 16);
    const g = parseInt(hexValue.substring(2, 4), 16);
    const b = parseInt(hexValue.substring(4, 6), 16);

    // Convert to HSL
    const rNorm = r / 255;
    const gNorm = g / 255;
    const bNorm = b / 255;
    const max = Math.max(rNorm, gNorm, bNorm);
    const min = Math.min(rNorm, gNorm, bNorm);
    const delta = max - min;

    let h = 0;
    let s = 0;
    const l = (max + min) / 2;

    if (delta !== 0) {
      s = l > 0.5 ? delta / (2 - max - min) : delta / (max + min);
      if (max === rNorm) {
        h = ((gNorm - bNorm) / delta + (gNorm < bNorm ? 6 : 0)) / 6;
      } else if (max === gNorm) {
        h = ((bNorm - rNorm) / delta + 2) / 6;
      } else {
        h = ((rNorm - gNorm) / delta + 4) / 6;
      }
    }

    return {
      rgb: `rgb(${r}, ${g}, ${b})`,
      rgba: `rgba(${r}, ${g}, ${b}, 1)`,
      rgbValues: { r, g, b },
      hsl: `hsl(${Math.round(h * 360)}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%)`,
      hslValues: { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) },
    };
  }, [hex]);

  const result = convert();

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
            <Palette size={20} />
            Hex Color
          </h3>
          <div className="p-4 rounded-xl border space-y-4" style={{
            backgroundColor: 'var(--bg-secondary)',
            borderColor: 'var(--border-primary)'
          }}>
            <div>
              <label className="label">Hex Color Code</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={hex}
                  onChange={(e) => {
                    let value = e.target.value;
                    if (!value.startsWith('#')) {
                      value = '#' + value;
                    }
                    setHex(value);
                  }}
                  className="input flex-1 font-mono"
                  placeholder="#3b82f6"
                  maxLength={7}
                />
                <div
                  className="w-16 h-12 rounded-lg border"
                  style={{
                    backgroundColor: hex,
                    borderColor: 'var(--border-primary)'
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
            Converted Values
          </h3>
          {result ? (
            <div className="p-6 rounded-xl border space-y-4" style={{
              backgroundColor: 'var(--bg-secondary)',
              borderColor: 'var(--border-primary)'
            }}>
              <div className="p-4 rounded-lg border" style={{
                backgroundColor: 'var(--bg-primary)',
                borderColor: 'var(--border-primary)'
              }}>
                <div className="text-sm font-medium mb-2" style={{ color: 'var(--text-muted)' }}>
                  RGB
                </div>
                <div className="font-mono text-lg mb-1" style={{ color: 'var(--text-primary)' }}>
                  {result.rgb}
                </div>
                <div className="text-xs" style={{ color: 'var(--text-muted)' }}>
                  R: {result.rgbValues.r}, G: {result.rgbValues.g}, B: {result.rgbValues.b}
                </div>
              </div>
              <div className="p-4 rounded-lg border" style={{
                backgroundColor: 'var(--bg-primary)',
                borderColor: 'var(--border-primary)'
              }}>
                <div className="text-sm font-medium mb-2" style={{ color: 'var(--text-muted)' }}>
                  RGBA
                </div>
                <div className="font-mono text-lg" style={{ color: 'var(--text-primary)' }}>
                  {result.rgba}
                </div>
              </div>
              <div className="p-4 rounded-lg border" style={{
                backgroundColor: 'var(--bg-primary)',
                borderColor: 'var(--border-primary)'
              }}>
                <div className="text-sm font-medium mb-2" style={{ color: 'var(--text-muted)' }}>
                  HSL
                </div>
                <div className="font-mono text-lg mb-1" style={{ color: 'var(--text-primary)' }}>
                  {result.hsl}
                </div>
                <div className="text-xs" style={{ color: 'var(--text-muted)' }}>
                  H: {result.hslValues.h}°, S: {result.hslValues.s}%, L: {result.hslValues.l}%
                </div>
              </div>
            </div>
          ) : (
            <div className="p-6 rounded-xl border text-center" style={{
              backgroundColor: 'var(--bg-secondary)',
              borderColor: 'var(--border-primary)',
              color: 'var(--text-muted)'
            }}>
              Enter a valid hex color code (e.g., #3b82f6)
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

