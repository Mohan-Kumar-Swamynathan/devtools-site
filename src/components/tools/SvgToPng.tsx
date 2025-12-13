import { useState, useRef, useCallback, useEffect } from 'react';
import { Upload, Download, Trash2 } from 'lucide-react';
import ErrorMessage from '@/components/common/ErrorMessage';
import LoadingSpinner from '@/components/common/LoadingSpinner';

export default function SvgToPng() {
  const [svg, setSvg] = useState<HTMLImageElement | null>(null);
  const [svgUrl, setSvgUrl] = useState<string>('');
  const [converted, setConverted] = useState<string>('');
  const [format, setFormat] = useState<'png' | 'jpeg'>('png');
  const [quality, setQuality] = useState(0.9);
  const [width, setWidth] = useState(800);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = useCallback((files: FileList | null) => {
    if (!files || files.length === 0) return;

    const file = files[0];
    if (!file.type.includes('svg') && !file.name.endsWith('.svg')) {
      setError('Please select an SVG file');
      return;
    }

    setError('');
    const reader = new FileReader();
    reader.onload = (e) => {
      const url = e.target?.result as string;
      setSvgUrl(url);
      const img = new Image();
      img.onload = () => {
        setSvg(img);
        setWidth(img.width || 800);
      };
      img.onerror = () => setError('Failed to load SVG');
      img.src = url;
    };
    reader.onerror = () => setError('Failed to read file');
    reader.readAsDataURL(file);
  }, []);

  const convert = useCallback(() => {
    if (!svg) return;

    setIsProcessing(true);
    setError('');

    try {
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = (svg.height / svg.width) * width;

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        throw new Error('Could not get canvas context');
      }

      if (format === 'jpeg') {
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }

      ctx.drawImage(svg, 0, 0, canvas.width, canvas.height);

      const mimeType = format === 'png' ? 'image/png' : 'image/jpeg';
      canvas.toBlob((blob) => {
        if (!blob) {
          setError('Conversion failed');
          setIsProcessing(false);
          return;
        }
        const url = URL.createObjectURL(blob);
        setConverted(url);
        setIsProcessing(false);
      }, mimeType, format === 'jpeg' ? quality : undefined);
    } catch (e) {
      setError(`Conversion error: ${(e as Error).message}`);
      setIsProcessing(false);
    }
  }, [svg, format, quality, width]);

  const handleDownload = useCallback(() => {
    if (!converted) return;
    const link = document.createElement('a');
    link.href = converted;
    link.download = `converted.${format}`;
    link.click();
  }, [converted, format]);

  const handleReset = useCallback(() => {
    setSvg(null);
    if (svgUrl) URL.revokeObjectURL(svgUrl);
    if (converted) URL.revokeObjectURL(converted);
    setSvgUrl('');
    setConverted('');
    setError('');
  }, [svgUrl, converted]);

  useEffect(() => {
    if (svg) {
      convert();
    }
  }, [svg, format, quality, width, convert]);

  return (
    <div className="space-y-6">
      {error && <ErrorMessage message={error} onDismiss={() => setError('')} />}

      <div className="flex flex-wrap items-center gap-3">
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={isProcessing}
          className="btn-primary flex items-center gap-2"
        >
          <Upload size={18} />
          Select SVG
        </button>
        {converted && (
          <button
            onClick={handleDownload}
            disabled={isProcessing}
            className="btn-secondary flex items-center gap-2"
          >
            <Download size={18} />
            Download {format.toUpperCase()}
          </button>
        )}
        {svg && (
          <button
            onClick={handleReset}
            className="btn-ghost flex items-center gap-2"
          >
            <Trash2 size={18} />
            Reset
          </button>
        )}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/svg+xml,.svg"
          onChange={(e) => handleFileSelect(e.target.files)}
          className="hidden"
        />
      </div>

      {svg && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
              Original SVG
            </h3>
            <div className="p-4 rounded-xl border" style={{
              backgroundColor: 'var(--bg-secondary)',
              borderColor: 'var(--border-primary)'
            }}>
              <img src={svgUrl} alt="SVG" className="w-full" />
            </div>
          </div>
          <div className="space-y-4">
            <h3 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
              Converted {format.toUpperCase()}
            </h3>
            <div className="p-4 rounded-xl border" style={{
              backgroundColor: 'var(--bg-secondary)',
              borderColor: 'var(--border-primary)'
            }}>
              {isProcessing ? (
                <div className="flex items-center justify-center h-64">
                  <LoadingSpinner />
                </div>
              ) : (
                <img src={converted} alt="Converted" className="w-full" />
              )}
            </div>
          </div>
        </div>
      )}

      {svg && (
        <div className="p-4 rounded-xl border space-y-4" style={{
          backgroundColor: 'var(--bg-secondary)',
          borderColor: 'var(--border-primary)'
        }}>
          <div>
            <label className="label">Output Format</label>
            <select
              value={format}
              onChange={(e) => setFormat(e.target.value as 'png' | 'jpeg')}
              className="input w-full"
            >
              <option value="png">PNG</option>
              <option value="jpeg">JPEG</option>
            </select>
          </div>
          <div>
            <label className="label">Width: {width}px</label>
            <input
              type="range"
              min="100"
              max="2000"
              step="50"
              value={width}
              onChange={(e) => setWidth(parseInt(e.target.value))}
              className="w-full"
            />
          </div>
          {format === 'jpeg' && (
            <div>
              <label className="label">Quality: {Math.round(quality * 100)}%</label>
              <input
                type="range"
                min="0.1"
                max="1"
                step="0.05"
                value={quality}
                onChange={(e) => setQuality(parseFloat(e.target.value))}
                className="w-full"
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}

