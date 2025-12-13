import { useState, useCallback } from 'react';
import { Monitor, Smartphone, Tablet, Maximize2, RotateCcw } from 'lucide-react';

type DevicePreset = {
  name: string;
  width: number;
  height: number;
  icon: React.ReactNode;
};

const devicePresets: DevicePreset[] = [
  { name: 'Desktop', width: 1920, height: 1080, icon: <Monitor size={20} /> },
  { name: 'Laptop', width: 1366, height: 768, icon: <Monitor size={20} /> },
  { name: 'Tablet', width: 768, height: 1024, icon: <Tablet size={20} /> },
  { name: 'Tablet Landscape', width: 1024, height: 768, icon: <Tablet size={20} /> },
  { name: 'Mobile', width: 375, height: 667, icon: <Smartphone size={20} /> },
  { name: 'Mobile Landscape', width: 667, height: 375, icon: <Smartphone size={20} /> },
  { name: 'iPhone 12/13', width: 390, height: 844, icon: <Smartphone size={20} /> },
  { name: 'iPhone SE', width: 375, height: 667, icon: <Smartphone size={20} /> },
  { name: 'iPad', width: 810, height: 1080, icon: <Tablet size={20} /> },
  { name: 'iPad Pro', width: 1024, height: 1366, icon: <Tablet size={20} /> },
];

export default function ResponsiveDesignTester() {
  const [url, setUrl] = useState('');
  const [selectedPreset, setSelectedPreset] = useState(devicePresets[0]);
  const [customWidth, setCustomWidth] = useState(1920);
  const [customHeight, setCustomHeight] = useState(1080);
  const [useCustom, setUseCustom] = useState(false);
  const [scale, setScale] = useState(0.5);
  const [error, setError] = useState('');

  const currentWidth = useCustom ? customWidth : selectedPreset.width;
  const currentHeight = useCustom ? customHeight : selectedPreset.height;

  const handleUrlChange = (value: string) => {
    setUrl(value);
    setError('');
    
    // Add protocol if missing
    if (value && !value.startsWith('http://') && !value.startsWith('https://')) {
      // Don't auto-add, let user know
    }
  };

  const getFullUrl = () => {
    if (!url) return '';
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url;
    }
    return `https://${url}`;
  };

  const handlePresetSelect = (preset: DevicePreset) => {
    setSelectedPreset(preset);
    setUseCustom(false);
  };

  const handleRotate = () => {
    if (useCustom) {
      setCustomWidth(currentHeight);
      setCustomHeight(currentWidth);
    } else {
      const rotated = devicePresets.find(
        p => p.width === currentHeight && p.height === currentWidth
      );
      if (rotated) {
        setSelectedPreset(rotated);
      } else {
        setCustomWidth(currentHeight);
        setCustomHeight(currentWidth);
        setUseCustom(true);
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-4">
          <h3 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
            Settings
          </h3>
          <div className="p-4 rounded-xl border space-y-4" style={{
            backgroundColor: 'var(--bg-secondary)',
            borderColor: 'var(--border-primary)'
          }}>
            <div>
              <label className="label">Website URL</label>
              <input
                type="text"
                value={url}
                onChange={(e) => handleUrlChange(e.target.value)}
                className="input w-full"
                placeholder="example.com or https://example.com"
              />
              <div className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
                Enter the URL of the website to test
              </div>
            </div>

            <div>
              <label className="label">Device Presets</label>
              <div className="grid grid-cols-2 gap-2 max-h-64 overflow-y-auto">
                {devicePresets.map((preset) => (
                  <button
                    key={preset.name}
                    onClick={() => handlePresetSelect(preset)}
                    className={`btn-sm p-2 flex flex-col items-center gap-1 text-xs ${
                      !useCustom && selectedPreset.name === preset.name
                        ? 'btn-primary'
                        : 'btn-secondary'
                    }`}
                  >
                    {preset.icon}
                    <span className="text-center">{preset.name}</span>
                    <span className="text-xs opacity-75">
                      {preset.width} × {preset.height}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="label flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={useCustom}
                  onChange={(e) => setUseCustom(e.target.checked)}
                  className="checkbox"
                />
                Custom Size
              </label>
              {useCustom && (
                <div className="mt-2 space-y-2">
                  <div>
                    <label className="text-xs" style={{ color: 'var(--text-muted)' }}>
                      Width: {customWidth}px
                    </label>
                    <input
                      type="range"
                      min="320"
                      max="2560"
                      step="10"
                      value={customWidth}
                      onChange={(e) => setCustomWidth(parseInt(e.target.value))}
                      className="w-full"
                    />
                    <input
                      type="number"
                      value={customWidth}
                      onChange={(e) => setCustomWidth(Math.max(320, Math.min(2560, parseInt(e.target.value) || 320)))}
                      className="input w-full mt-1"
                      min="320"
                      max="2560"
                    />
                  </div>
                  <div>
                    <label className="text-xs" style={{ color: 'var(--text-muted)' }}>
                      Height: {customHeight}px
                    </label>
                    <input
                      type="range"
                      min="240"
                      max="2560"
                      step="10"
                      value={customHeight}
                      onChange={(e) => setCustomHeight(parseInt(e.target.value))}
                      className="w-full"
                    />
                    <input
                      type="number"
                      value={customHeight}
                      onChange={(e) => setCustomHeight(Math.max(240, Math.min(2560, parseInt(e.target.value) || 240)))}
                      className="input w-full mt-1"
                      min="240"
                      max="2560"
                    />
                  </div>
                </div>
              )}
            </div>

            <div>
              <label className="label">Scale: {Math.round(scale * 100)}%</label>
              <input
                type="range"
                min="0.1"
                max="1"
                step="0.05"
                value={scale}
                onChange={(e) => setScale(parseFloat(e.target.value))}
                className="w-full"
              />
            </div>

            <button
              onClick={handleRotate}
              className="btn btn-secondary w-full flex items-center justify-center gap-2"
            >
              <RotateCcw size={16} />
              Rotate Viewport
            </button>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
              Preview
            </h3>
            <div className="text-sm" style={{ color: 'var(--text-muted)' }}>
              {currentWidth} × {currentHeight}px
            </div>
          </div>
          <div className="p-4 rounded-xl border" style={{
            backgroundColor: 'var(--bg-secondary)',
            borderColor: 'var(--border-primary)'
          }}>
            {url ? (
              <div className="space-y-4">
                <div
                  className="mx-auto border-8 rounded-lg overflow-hidden shadow-2xl"
                  style={{
                    width: `${currentWidth * scale}px`,
                    height: `${currentHeight * scale}px`,
                    borderColor: 'var(--border-primary)',
                    backgroundColor: 'white',
                  }}
                >
                  <iframe
                    src={getFullUrl()}
                    className="w-full h-full border-0"
                    style={{
                      transform: `scale(${1 / scale})`,
                      transformOrigin: 'top left',
                      width: `${currentWidth}px`,
                      height: `${currentHeight}px`,
                    }}
                    title="Responsive Preview"
                    onError={() => setError('Failed to load website. It may block iframes (X-Frame-Options).')}
                  />
                </div>
                {error && (
                  <div className="p-3 rounded-lg text-sm text-center" style={{
                    backgroundColor: 'var(--status-error)',
                    color: 'white'
                  }}>
                    {error}
                    <div className="text-xs mt-1 opacity-90">
                      Some websites block embedding in iframes for security reasons.
                    </div>
                  </div>
                )}
                <div className="p-3 rounded-lg border text-sm text-center" style={{
                  backgroundColor: 'var(--bg-primary)',
                  borderColor: 'var(--border-primary)',
                  color: 'var(--text-muted)'
                }}>
                  <div className="font-medium mb-1" style={{ color: 'var(--text-primary)' }}>
                    Viewport Size
                  </div>
                  <div className="text-xs">
                    Width: {currentWidth}px | Height: {currentHeight}px | Scale: {Math.round(scale * 100)}%
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-12 rounded-lg border text-center" style={{
                backgroundColor: 'var(--bg-primary)',
                borderColor: 'var(--border-primary)',
                color: 'var(--text-muted)'
              }}>
                <Maximize2 size={48} className="mx-auto mb-4 opacity-50" />
                <p>Enter a website URL to preview it in different viewport sizes</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

