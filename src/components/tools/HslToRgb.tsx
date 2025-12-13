import { useState, useCallback } from 'react';
import { Palette } from 'lucide-react';

export default function HslToRgb() {
  const [mode, setMode] = useState<'hsl-to-rgb' | 'rgb-to-hsl'>('hsl-to-rgb');
  const [h, setH] = useState(217);
  const [s, setS] = useState(91);
  const [l, setL] = useState(60);
  const [r, setR] = useState(59);
  const [g, setG] = useState(130);
  const [b, setB] = useState(246);

  const hslToRgb = useCallback((hVal: number, sVal: number, lVal: number) => {
    const hNorm = hVal / 360;
    const sNorm = sVal / 100;
    const lNorm = lVal / 100;

    let r, g, b;

    if (sNorm === 0) {
      r = g = b = lNorm;
    } else {
      const hue2rgb = (p: number, q: number, t: number) => {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1/6) return p + (q - p) * 6 * t;
        if (t < 1/2) return q;
        if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
        return p;
      };

      const q = lNorm < 0.5 ? lNorm * (1 + sNorm) : lNorm + sNorm - lNorm * sNorm;
      const p = 2 * lNorm - q;

      r = hue2rgb(p, q, hNorm + 1/3);
      g = hue2rgb(p, q, hNorm);
      b = hue2rgb(p, q, hNorm - 1/3);
    }

    return {
      r: Math.round(r * 255),
      g: Math.round(g * 255),
      b: Math.round(b * 255),
    };
  }, []);

  const rgbToHsl = useCallback((rVal: number, gVal: number, bVal: number) => {
    const rNorm = rVal / 255;
    const gNorm = gVal / 255;
    const bNorm = bVal / 255;

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
      h: Math.round(h * 360),
      s: Math.round(s * 100),
      l: Math.round(l * 100),
    };
  }, []);

  const hslResult = mode === 'hsl-to-rgb' ? hslToRgb(h, s, l) : null;
  const rgbResult = mode === 'rgb-to-hsl' ? rgbToHsl(r, g, b) : null;
  const color = mode === 'hsl-to-rgb' && hslResult
    ? `rgb(${hslResult.r}, ${hslResult.g}, ${hslResult.b})`
    : `rgb(${r}, ${g}, ${b})`;

  return (
    <div className="space-y-6">
      <div className="flex justify-center gap-2 mb-6">
        <button
          onClick={() => setMode('hsl-to-rgb')}
          className={`btn ${mode === 'hsl-to-rgb' ? 'btn-primary' : 'btn-secondary'}`}
        >
          HSL to RGB
        </button>
        <button
          onClick={() => setMode('rgb-to-hsl')}
          className={`btn ${mode === 'rgb-to-hsl' ? 'btn-primary' : 'btn-secondary'}`}
        >
          RGB to HSL
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
            <Palette size={20} />
            {mode === 'hsl-to-rgb' ? 'HSL Values' : 'RGB Values'}
          </h3>
          <div className="p-4 rounded-xl border space-y-4" style={{
            backgroundColor: 'var(--bg-secondary)',
            borderColor: 'var(--border-primary)'
          }}>
            {mode === 'hsl-to-rgb' ? (
              <>
                <div>
                  <label className="label">Hue (0-360)</label>
                  <input
                    type="range"
                    min="0"
                    max="360"
                    value={h}
                    onChange={(e) => setH(parseInt(e.target.value))}
                    className="w-full"
                  />
                  <input
                    type="number"
                    value={h}
                    onChange={(e) => setH(Math.max(0, Math.min(360, parseInt(e.target.value) || 0)))}
                    className="input w-full mt-2"
                    min="0"
                    max="360"
                  />
                </div>
                <div>
                  <label className="label">Saturation (0-100%)</label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={s}
                    onChange={(e) => setS(parseInt(e.target.value))}
                    className="w-full"
                  />
                  <input
                    type="number"
                    value={s}
                    onChange={(e) => setS(Math.max(0, Math.min(100, parseInt(e.target.value) || 0)))}
                    className="input w-full mt-2"
                    min="0"
                    max="100"
                  />
                </div>
                <div>
                  <label className="label">Lightness (0-100%)</label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={l}
                    onChange={(e) => setL(parseInt(e.target.value))}
                    className="w-full"
                  />
                  <input
                    type="number"
                    value={l}
                    onChange={(e) => setL(Math.max(0, Math.min(100, parseInt(e.target.value) || 0)))}
                    className="input w-full mt-2"
                    min="0"
                    max="100"
                  />
                </div>
              </>
            ) : (
              <>
                <div>
                  <label className="label">Red (0-255)</label>
                  <input
                    type="range"
                    min="0"
                    max="255"
                    value={r}
                    onChange={(e) => setR(parseInt(e.target.value))}
                    className="w-full"
                  />
                  <input
                    type="number"
                    value={r}
                    onChange={(e) => setR(Math.max(0, Math.min(255, parseInt(e.target.value) || 0)))}
                    className="input w-full mt-2"
                    min="0"
                    max="255"
                  />
                </div>
                <div>
                  <label className="label">Green (0-255)</label>
                  <input
                    type="range"
                    min="0"
                    max="255"
                    value={g}
                    onChange={(e) => setG(parseInt(e.target.value))}
                    className="w-full"
                  />
                  <input
                    type="number"
                    value={g}
                    onChange={(e) => setG(Math.max(0, Math.min(255, parseInt(e.target.value) || 0)))}
                    className="input w-full mt-2"
                    min="0"
                    max="255"
                  />
                </div>
                <div>
                  <label className="label">Blue (0-255)</label>
                  <input
                    type="range"
                    min="0"
                    max="255"
                    value={b}
                    onChange={(e) => setB(parseInt(e.target.value))}
                    className="w-full"
                  />
                  <input
                    type="number"
                    value={b}
                    onChange={(e) => setB(Math.max(0, Math.min(255, parseInt(e.target.value) || 0)))}
                    className="input w-full mt-2"
                    min="0"
                    max="255"
                  />
                </div>
              </>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
            Converted Values
          </h3>
          <div className="p-6 rounded-xl border space-y-4" style={{
            backgroundColor: 'var(--bg-secondary)',
            borderColor: 'var(--border-primary)'
          }}>
            {mode === 'hsl-to-rgb' && hslResult ? (
              <>
                <div className="p-4 rounded-lg border" style={{
                  backgroundColor: 'var(--bg-primary)',
                  borderColor: 'var(--border-primary)'
                }}>
                  <div className="text-sm font-medium mb-2" style={{ color: 'var(--text-muted)' }}>
                    RGB
                  </div>
                  <div className="font-mono text-lg" style={{ color: 'var(--text-primary)' }}>
                    rgb({hslResult.r}, {hslResult.g}, {hslResult.b})
                  </div>
                  <div className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
                    R: {hslResult.r}, G: {hslResult.g}, B: {hslResult.b}
                  </div>
                </div>
                <div className="p-4 rounded-lg border" style={{
                  backgroundColor: 'var(--bg-primary)',
                  borderColor: 'var(--border-primary)'
                }}>
                  <div className="text-sm font-medium mb-2" style={{ color: 'var(--text-muted)' }}>
                    Hex
                  </div>
                  <div className="font-mono text-lg" style={{ color: 'var(--text-primary)' }}>
                    #{hslResult.r.toString(16).padStart(2, '0')}{hslResult.g.toString(16).padStart(2, '0')}{hslResult.b.toString(16).padStart(2, '0')}
                  </div>
                </div>
              </>
            ) : rgbResult ? (
              <div className="p-4 rounded-lg border" style={{
                backgroundColor: 'var(--bg-primary)',
                borderColor: 'var(--border-primary)'
              }}>
                <div className="text-sm font-medium mb-2" style={{ color: 'var(--text-muted)' }}>
                  HSL
                </div>
                <div className="font-mono text-lg" style={{ color: 'var(--text-primary)' }}>
                  hsl({rgbResult.h}, {rgbResult.s}%, {rgbResult.l}%)
                </div>
                <div className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
                  H: {rgbResult.h}°, S: {rgbResult.s}%, L: {rgbResult.l}%
                </div>
              </div>
            ) : null}
            <div
              className="w-full h-32 rounded-lg border"
              style={{
                backgroundColor: color,
                borderColor: 'var(--border-primary)'
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

