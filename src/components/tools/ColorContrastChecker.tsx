import { useState, useCallback, useEffect } from 'react';
import ToolShell from './ToolShell';
import { useToast } from '@/hooks/useToast';

interface ContrastResult {
  ratio: number;
  level: 'AAA' | 'AA' | 'AA Large' | 'Fail';
  passes: boolean;
}

function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
      }
    : null;
}

function getLuminance(r: number, g: number, b: number): number {
  const [rs, gs, bs] = [r, g, b].map((c) => {
    c = c / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

function getContrastRatio(color1: { r: number; g: number; b: number }, color2: { r: number; g: number; b: number }): number {
  const lum1 = getLuminance(color1.r, color1.g, color1.b);
  const lum2 = getLuminance(color2.r, color2.g, color2.b);
  const lighter = Math.max(lum1, lum2);
  const darker = Math.min(lum1, lum2);

  return (lighter + 0.05) / (darker + 0.05);
}

function checkContrast(ratio: number, isLargeText: boolean = false): ContrastResult {
  let level: ContrastResult['level'] = 'Fail';
  let passes = false;

  if (ratio >= 7) {
    level = 'AAA';
    passes = true;
  } else if (ratio >= 4.5) {
    level = isLargeText ? 'AAA' : 'AA';
    passes = true;
  } else if (ratio >= 3 && isLargeText) {
    level = 'AA Large';
    passes = true;
  }

  return { ratio, level, passes };
}

export default function ColorContrastChecker() {
  const [foreground, setForeground] = useState('#000000');
  const [background, setBackground] = useState('#ffffff');
  const [isLargeText, setIsLargeText] = useState(false);
  const [normalResult, setNormalResult] = useState<ContrastResult | null>(null);
  const [largeResult, setLargeResult] = useState<ContrastResult | null>(null);

  const calculate = useCallback(() => {
    const fgRgb = hexToRgb(foreground);
    const bgRgb = hexToRgb(background);

    if (!fgRgb || !bgRgb) {
      setNormalResult(null);
      setLargeResult(null);
      return;
    }

    const ratio = getContrastRatio(fgRgb, bgRgb);
    setNormalResult(checkContrast(ratio, false));
    setLargeResult(checkContrast(ratio, true));
  }, [foreground, background]);

  useEffect(() => {
    calculate();
  }, [calculate]);

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'AAA':
        return 'var(--status-success)';
      case 'AA':
      case 'AA Large':
        return 'var(--status-warning)';
      default:
        return 'var(--status-error)';
    }
  };

  const controls = null;

  return (
    <ToolShell className="space-y-6" controls={controls}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="label">Foreground Color</label>
          <div className="flex gap-3">
            <input
              type="color"
              value={foreground}
              onChange={(e) => setForeground(e.target.value)}
              className="w-20 h-12 rounded-lg border cursor-pointer"
              style={{ borderColor: 'var(--border-primary)' }}
            />
            <input
              type="text"
              value={foreground}
              onChange={(e) => setForeground(e.target.value)}
              className="input-base flex-1 font-mono"
              placeholder="#000000"
            />
          </div>
        </div>

        <div>
          <label className="label">Background Color</label>
          <div className="flex gap-3">
            <input
              type="color"
              value={background}
              onChange={(e) => setBackground(e.target.value)}
              className="w-20 h-12 rounded-lg border cursor-pointer"
              style={{ borderColor: 'var(--border-primary)' }}
            />
            <input
              type="text"
              value={background}
              onChange={(e) => setBackground(e.target.value)}
              className="input-base flex-1 font-mono"
              placeholder="#ffffff"
            />
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="largeText"
          checked={isLargeText}
          onChange={(e) => setIsLargeText(e.target.checked)}
          className="w-4 h-4"
        />
        <label htmlFor="largeText" className="text-sm" style={{ color: 'var(--text-primary)' }}>
          Large Text (18pt+ or 14pt+ bold)
        </label>
      </div>

      {/* Preview */}
      <div
        className="p-8 rounded-xl border text-center"
        style={{
          backgroundColor: background,
          borderColor: 'var(--border-primary)',
          minHeight: '200px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <p
          style={{
            color: foreground,
            fontSize: isLargeText ? '24px' : '16px',
            fontWeight: isLargeText ? 'bold' : 'normal'
          }}
        >
          Sample Text Preview
        </p>
      </div>

      {/* Results */}
      {normalResult && largeResult && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div
            className="p-4 rounded-xl border"
            style={{
              backgroundColor: 'var(--bg-secondary)',
              borderColor: normalResult.passes ? 'var(--status-success)' : 'var(--status-error)'
            }}
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold" style={{ color: 'var(--text-primary)' }}>
                Normal Text
              </h3>
              <span
                className="px-2 py-1 rounded text-xs font-semibold"
                style={{
                  backgroundColor: normalResult.passes ? 'var(--status-success-bg)' : 'var(--status-error-bg)',
                  color: getLevelColor(normalResult.level)
                }}
              >
                {normalResult.level}
              </span>
            </div>
            <p className="text-2xl font-bold mb-1" style={{ color: 'var(--text-primary)' }}>
              {normalResult.ratio.toFixed(2)}:1
            </p>
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
              {normalResult.passes ? '✓ Passes WCAG' : '✗ Fails WCAG'}
            </p>
            <p className="text-xs mt-2" style={{ color: 'var(--text-muted)' }}>
              Minimum: 4.5:1 for AA, 7:1 for AAA
            </p>
          </div>

          <div
            className="p-4 rounded-xl border"
            style={{
              backgroundColor: 'var(--bg-secondary)',
              borderColor: largeResult.passes ? 'var(--status-success)' : 'var(--status-error)'
            }}
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold" style={{ color: 'var(--text-primary)' }}>
                Large Text
              </h3>
              <span
                className="px-2 py-1 rounded text-xs font-semibold"
                style={{
                  backgroundColor: largeResult.passes ? 'var(--status-success-bg)' : 'var(--status-error-bg)',
                  color: getLevelColor(largeResult.level)
                }}
              >
                {largeResult.level}
              </span>
            </div>
            <p className="text-2xl font-bold mb-1" style={{ color: 'var(--text-primary)' }}>
              {largeResult.ratio.toFixed(2)}:1
            </p>
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
              {largeResult.passes ? '✓ Passes WCAG' : '✗ Fails WCAG'}
            </p>
            <p className="text-xs mt-2" style={{ color: 'var(--text-muted)' }}>
              Minimum: 3:1 for AA, 4.5:1 for AAA
            </p>
          </div>
        </div>
      )}

      <div className="p-4 rounded-xl border text-sm" style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-primary)' }}>
        <h3 className="font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
          WCAG Guidelines:
        </h3>
        <ul className="space-y-1 text-xs" style={{ color: 'var(--text-muted)' }}>
          <li>• <strong>AA (Normal):</strong> 4.5:1 contrast ratio</li>
          <li>• <strong>AA (Large):</strong> 3:1 contrast ratio</li>
          <li>• <strong>AAA (Normal):</strong> 7:1 contrast ratio</li>
          <li>• <strong>AAA (Large):</strong> 4.5:1 contrast ratio</li>
        </ul>
      </div>
    </ToolShell>
  );
}

