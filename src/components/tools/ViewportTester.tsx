import { useState, useCallback, useEffect } from 'react';
import { Maximize2, Minimize2, RotateCcw, Smartphone, Tablet, Monitor } from 'lucide-react';
import ToolShell from './ToolShell';
import { useToast } from '@/hooks/useToast';

const PRESETS = [
  { name: 'iPhone SE', width: 375, height: 667 },
  { name: 'iPhone 12/13', width: 390, height: 844 },
  { name: 'iPhone 14 Pro Max', width: 430, height: 932 },
  { name: 'iPad', width: 768, height: 1024 },
  { name: 'iPad Pro', width: 1024, height: 1366 },
  { name: 'Desktop HD', width: 1920, height: 1080 },
  { name: 'Desktop 4K', width: 3840, height: 2160 },
  { name: 'Custom', width: 0, height: 0 },
];

export default function ViewportTester() {
  const [width, setWidth] = useState(375);
  const [height, setHeight] = useState(667);
  const [url, setUrl] = useState('');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [deviceType, setDeviceType] = useState<'mobile' | 'tablet' | 'desktop'>('mobile');

  const applyPreset = useCallback((preset: typeof PRESETS[0]) => {
    if (preset.name === 'Custom') return;
    setWidth(preset.width);
    setHeight(preset.height);
    if (preset.width < 600) setDeviceType('mobile');
    else if (preset.width < 1024) setDeviceType('tablet');
    else setDeviceType('desktop');
  }, []);

  const toggleFullscreen = useCallback(() => {
    if (!isFullscreen) {
      const elem = document.documentElement;
      if (elem.requestFullscreen) {
        elem.requestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
    setIsFullscreen(!isFullscreen);
  }, [isFullscreen]);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    

  return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

    const controls = (
          <div className="flex items-center gap-3">
        <button
          onClick={toggleFullscreen}
          className="btn-secondary flex items-center gap-2"
        >
          {isFullscreen ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
          {isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
        </button>
        <button
          onClick={() => {
            setWidth(375);
            setHeight(667);
            setUrl('');
            setDeviceType('mobile');
          }}
          className="btn-ghost flex items-center gap-2"
        >
          <RotateCcw size={18} />
          Reset
        </button>
      </div>
  );

  return (
    <ToolShell className="space-y-6" controls={controls}>
{/* Controls moved to header */}





















      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <h3 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
            Preview
          </h3>
          <div className="p-4 rounded-xl border" style={{
            backgroundColor: 'var(--bg-secondary)',
            borderColor: 'var(--border-primary)'
          }}>
            <div className="flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-lg p-4">
              <div
                className="border-4 border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden shadow-2xl transition-all"
                style={{
                  width: `${Math.min(width, 800)}px`,
                  height: `${Math.min(height, 600)}px`,
                  maxWidth: '100%',
                  maxHeight: '70vh'
                }}
              >
                {url ? (
                  <iframe
                    src={url}
                    className="w-full h-full border-0"
                    title="Viewport Preview"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-white dark:bg-gray-900" style={{ color: 'var(--text-muted)' }}>
                    <div className="text-center">
                      <p className="text-sm mb-2">Enter a URL to preview</p>
                      <p className="text-xs">{width} × {height}px</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
            Settings
          </h3>
          <div className="p-4 rounded-xl border space-y-4" style={{
            backgroundColor: 'var(--bg-secondary)',
            borderColor: 'var(--border-primary)'
          }}>
            <div>
              <label className="label">URL (optional)</label>
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="input w-full"
                placeholder="https://example.com"
              />
            </div>
            <div>
              <label className="label">Width: {width}px</label>
              <input
                type="range"
                min="200"
                max="3840"
                step="10"
                value={width}
                onChange={(e) => {
                  const w = parseInt(e.target.value);
                  setWidth(w);
                  if (w < 600) setDeviceType('mobile');
                  else if (w < 1024) setDeviceType('tablet');
                  else setDeviceType('desktop');
                }}
                className="w-full"
              />
            </div>
            <div>
              <label className="label">Height: {height}px</label>
              <input
                type="range"
                min="200"
                max="2160"
                step="10"
                value={height}
                onChange={(e) => setHeight(parseInt(e.target.value))}
                className="w-full"
              />
            </div>
            <div>
              <label className="label">Device Presets</label>
              <div className="grid grid-cols-2 gap-2">
                {PRESETS.map(preset => (
                  <button
                    key={preset.name}
                    onClick={() => applyPreset(preset)}
                    className="btn-secondary btn-sm text-xs"
                  >
                    {preset.name === 'Custom' ? 'Custom' : `${preset.name} (${preset.width}×${preset.height})`}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-2 pt-2 border-t" style={{ borderColor: 'var(--border-primary)' }}>
              {deviceType === 'mobile' && <Smartphone size={20} />}
              {deviceType === 'tablet' && <Tablet size={20} />}
              {deviceType === 'desktop' && <Monitor size={20} />}
              <span className="text-sm font-medium capitalize" style={{ color: 'var(--text-primary)' }}>
                {deviceType}
              </span>
            </div>
          </div>
        </div>
      </div>
    </ToolShell>
  );
}

