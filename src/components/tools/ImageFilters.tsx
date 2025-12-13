import { useState, useRef, useCallback, useEffect } from 'react';
import { Upload, Download, Trash2, RotateCcw } from 'lucide-react';
import ErrorMessage from '@/components/common/ErrorMessage';
import LoadingSpinner from '@/components/common/LoadingSpinner';

interface FilterSettings {
  brightness: number;
  contrast: number;
  saturation: number;
  hue: number;
  grayscale: boolean;
  sepia: boolean;
  invert: boolean;
  blur: number;
}

interface FilteredImage {
  file: File;
  originalDataUrl: string;
  filteredDataUrl: string;
  settings: FilterSettings;
}

const DEFAULT_FILTERS: FilterSettings = {
  brightness: 100,
  contrast: 100,
  saturation: 100,
  hue: 0,
  grayscale: false,
  sepia: false,
  invert: false,
  blur: 0,
};

export default function ImageFilters() {
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const [filteredImage, setFilteredImage] = useState<FilteredImage | null>(null);
  const [filters, setFilters] = useState<FilterSettings>(DEFAULT_FILTERS);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const applyFilters = useCallback(async () => {
    if (!image) return;

    setIsProcessing(true);
    setError('');

    try {
      const canvas = document.createElement('canvas');
      canvas.width = image.width;
      canvas.height = image.height;

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        throw new Error('Could not get canvas context');
      }

      ctx.drawImage(image, 0, 0);

      // Apply CSS filters
      const filterString = [
        `brightness(${filters.brightness}%)`,
        `contrast(${filters.contrast}%)`,
        `saturate(${filters.saturation}%)`,
        `hue-rotate(${filters.hue}deg)`,
        filters.grayscale ? 'grayscale(100%)' : '',
        filters.sepia ? 'sepia(100%)' : '',
        filters.invert ? 'invert(100%)' : '',
        filters.blur > 0 ? `blur(${filters.blur}px)` : '',
      ].filter(Boolean).join(' ');

      // For canvas, we need to apply filters differently
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;

      // Apply pixel-level filters
      for (let i = 0; i < data.length; i += 4) {
        let r = data[i];
        let g = data[i + 1];
        let b = data[i + 2];

        // Brightness
        r = Math.min(255, (r * filters.brightness) / 100);
        g = Math.min(255, (g * filters.brightness) / 100);
        b = Math.min(255, (b * filters.brightness) / 100);

        // Contrast
        const contrastFactor = (259 * (filters.contrast + 255)) / (255 * (259 - filters.contrast));
        r = Math.min(255, Math.max(0, contrastFactor * (r - 128) + 128));
        g = Math.min(255, Math.max(0, contrastFactor * (g - 128) + 128));
        b = Math.min(255, Math.max(0, contrastFactor * (b - 128) + 128));

        // Saturation
        const gray = 0.299 * r + 0.587 * g + 0.114 * b;
        const satFactor = filters.saturation / 100;
        r = gray + (r - gray) * satFactor;
        g = gray + (g - gray) * satFactor;
        b = gray + (b - gray) * satFactor;

        // Grayscale
        if (filters.grayscale) {
          const grayValue = 0.299 * r + 0.587 * g + 0.114 * b;
          r = g = b = grayValue;
        }

        // Sepia
        if (filters.sepia) {
          const tr = 0.393 * r + 0.769 * g + 0.189 * b;
          const tg = 0.349 * r + 0.686 * g + 0.168 * b;
          const tb = 0.272 * r + 0.534 * g + 0.131 * b;
          r = Math.min(255, tr);
          g = Math.min(255, tg);
          b = Math.min(255, tb);
        }

        // Invert
        if (filters.invert) {
          r = 255 - r;
          g = 255 - g;
          b = 255 - b;
        }

        data[i] = r;
        data[i + 1] = g;
        data[i + 2] = b;
      }

      ctx.putImageData(imageData, 0, 0);

      // Apply blur using a simple box blur
      if (filters.blur > 0) {
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = canvas.width;
        tempCanvas.height = canvas.height;
        const tempCtx = tempCanvas.getContext('2d');
        if (tempCtx) {
          tempCtx.filter = `blur(${filters.blur}px)`;
          tempCtx.drawImage(canvas, 0, 0);
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(tempCanvas, 0, 0);
        }
      }

      canvas.toBlob((blob) => {
        if (!blob) {
          setError('Failed to apply filters');
          setIsProcessing(false);
          return;
        }

        const dataUrl = canvas.toDataURL('image/png');
        setFilteredImage({
          file: new File([blob], 'filtered-image.png', { type: 'image/png' }),
          originalDataUrl: image.src,
          filteredDataUrl: dataUrl,
          settings: { ...filters },
        });
        setIsProcessing(false);
      }, 'image/png');
    } catch (e) {
      setError(`Filter error: ${(e as Error).message}`);
      setIsProcessing(false);
    }
  }, [image, filters]);

  useEffect(() => {
    if (image) {
      applyFilters();
    }
  }, [filters, image, applyFilters]);

  const handleFileSelect = useCallback((files: FileList | null) => {
    if (!files || files.length === 0) return;

    const file = files[0];
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file');
      return;
    }

    setError('');
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        setImage(img);
      };
      img.onerror = () => {
        setError('Failed to load image');
      };
      img.src = e.target?.result as string;
    };
    reader.onerror = () => {
      setError('Failed to read file');
    };
    reader.readAsDataURL(file);
  }, []);

  const handleDownload = useCallback(() => {
    if (!filteredImage) return;
    const link = document.createElement('a');
    link.href = filteredImage.filteredDataUrl;
    link.download = filteredImage.file.name;
    link.click();
  }, [filteredImage]);

  const handleReset = useCallback(() => {
    setImage(null);
    setFilteredImage(null);
    setFilters(DEFAULT_FILTERS);
    setError('');
  }, []);

  const getFilterStyle = () => {
    return {
      filter: [
        `brightness(${filters.brightness}%)`,
        `contrast(${filters.contrast}%)`,
        `saturate(${filters.saturation}%)`,
        `hue-rotate(${filters.hue}deg)`,
        filters.grayscale ? 'grayscale(100%)' : '',
        filters.sepia ? 'sepia(100%)' : '',
        filters.invert ? 'invert(100%)' : '',
        filters.blur > 0 ? `blur(${filters.blur}px)` : '',
      ].filter(Boolean).join(' '),
    };
  };

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
          Select Image
        </button>
        {image && (
          <>
            <button
              onClick={handleDownload}
              disabled={!filteredImage || isProcessing}
              className="btn-secondary flex items-center gap-2"
            >
              <Download size={18} />
              Download
            </button>
            <button
              onClick={handleReset}
              className="btn-ghost flex items-center gap-2"
            >
              <RotateCcw size={18} />
              Reset
            </button>
          </>
        )}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={(e) => handleFileSelect(e.target.files)}
          className="hidden"
        />
      </div>

      {image && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
              Original
            </h3>
            <div className="p-4 rounded-xl border" style={{
              backgroundColor: 'var(--bg-secondary)',
              borderColor: 'var(--border-primary)'
            }}>
              <img
                src={image.src}
                alt="Original"
                className="w-full rounded-lg"
              />
            </div>
          </div>
          <div className="space-y-4">
            <h3 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
              Filtered Preview
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
                <img
                  src={filteredImage?.filteredDataUrl || image.src}
                  alt="Filtered"
                  className="w-full rounded-lg"
                  style={getFilterStyle()}
                />
              )}
            </div>
          </div>
        </div>
      )}

      {image && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
            Filters
          </h3>
          <div className="p-4 rounded-xl border space-y-4" style={{
            backgroundColor: 'var(--bg-secondary)',
            borderColor: 'var(--border-primary)'
          }}>
            <div>
              <label className="label">Brightness: {filters.brightness}%</label>
              <input
                type="range"
                min="0"
                max="200"
                value={filters.brightness}
                onChange={(e) => setFilters({ ...filters, brightness: parseInt(e.target.value) })}
                className="w-full"
              />
            </div>
            <div>
              <label className="label">Contrast: {filters.contrast}%</label>
              <input
                type="range"
                min="0"
                max="200"
                value={filters.contrast}
                onChange={(e) => setFilters({ ...filters, contrast: parseInt(e.target.value) })}
                className="w-full"
              />
            </div>
            <div>
              <label className="label">Saturation: {filters.saturation}%</label>
              <input
                type="range"
                min="0"
                max="200"
                value={filters.saturation}
                onChange={(e) => setFilters({ ...filters, saturation: parseInt(e.target.value) })}
                className="w-full"
              />
            </div>
            <div>
              <label className="label">Hue: {filters.hue}°</label>
              <input
                type="range"
                min="-180"
                max="180"
                value={filters.hue}
                onChange={(e) => setFilters({ ...filters, hue: parseInt(e.target.value) })}
                className="w-full"
              />
            </div>
            <div>
              <label className="label">Blur: {filters.blur}px</label>
              <input
                type="range"
                min="0"
                max="20"
                value={filters.blur}
                onChange={(e) => setFilters({ ...filters, blur: parseInt(e.target.value) })}
                className="w-full"
              />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.grayscale}
                  onChange={(e) => setFilters({ ...filters, grayscale: e.target.checked })}
                  className="checkbox"
                />
                <span style={{ color: 'var(--text-primary)' }}>Grayscale</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.sepia}
                  onChange={(e) => setFilters({ ...filters, sepia: e.target.checked })}
                  className="checkbox"
                />
                <span style={{ color: 'var(--text-primary)' }}>Sepia</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.invert}
                  onChange={(e) => setFilters({ ...filters, invert: e.target.checked })}
                  className="checkbox"
                />
                <span style={{ color: 'var(--text-primary)' }}>Invert</span>
              </label>
            </div>
          </div>
        </div>
      )}

      <div className="p-4 rounded-xl border text-sm" style={{
        backgroundColor: 'var(--bg-secondary)',
        borderColor: 'var(--border-primary)'
      }}>
        <h3 className="font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
          Tips:
        </h3>
        <ul className="space-y-1 text-xs" style={{ color: 'var(--text-muted)' }}>
          <li>• Adjust sliders to see real-time preview</li>
          <li>• Combine multiple filters for creative effects</li>
          <li>• Use grayscale, sepia, or invert for artistic effects</li>
          <li>• Blur can be used to create depth of field effects</li>
        </ul>
      </div>
    </div>
  );
}

