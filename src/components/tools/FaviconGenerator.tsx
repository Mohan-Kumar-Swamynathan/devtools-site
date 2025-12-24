import { useState, useRef, useCallback } from 'react';
import { Upload, Download, Image as ImageIcon, Trash2 } from 'lucide-react';
import ErrorMessage from '@/components/common/ErrorMessage';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import ToolShell from './ToolShell';
import { useToast } from '@/hooks/useToast';

interface FaviconSize {
  size: number;
  label: string;
  filename: string;
}

const faviconSizes: FaviconSize[] = [
  { size: 16, label: '16x16 (Standard)', filename: 'favicon-16x16.png' },
  { size: 32, label: '32x32 (Standard)', filename: 'favicon-32x32.png' },
  { size: 48, label: '48x48 (Windows)', filename: 'favicon-48x48.png' },
  { size: 64, label: '64x64 (Windows)', filename: 'favicon-64x64.png' },
  { size: 96, label: '96x96 (Android)', filename: 'favicon-96x96.png' },
  { size: 128, label: '128x128 (Chrome)', filename: 'favicon-128x128.png' },
  { size: 180, label: '180x180 (Apple)', filename: 'apple-touch-icon.png' },
  { size: 192, label: '192x192 (Android)', filename: 'android-chrome-192x192.png' },
  { size: 512, label: '512x512 (PWA)', filename: 'android-chrome-512x512.png' }
];

export default function FaviconGenerator() {
  const [sourceImage, setSourceImage] = useState<string | null>(null);
  const [generatedFavicons, setGeneratedFavicons] = useState<Map<number, string>>(new Map());
  const [selectedSizes, setSelectedSizes] = useState<Set<number>>(new Set([16, 32, 180, 192]));
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const generateFavicon = useCallback((size: number): Promise<string> => {
    return new Promise((resolve, reject) => {
      if (!sourceImage) {
        reject(new Error('No source image'));
        return;
      }

      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Could not get canvas context'));
          return;
        }

        // Use high-quality image scaling
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, size, size);

        const dataUrl = canvas.toDataURL('image/png');
        resolve(dataUrl);
      };

      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = sourceImage;
    });
  }, [sourceImage]);

  const handleFileSelect = useCallback(async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    setError('');
    const file = files[0];

    if (!file.type.startsWith('image/')) {
      setError('Please select an image file');
      return;
    }

    const reader = new FileReader();
    reader.onload = async (e) => {
      const dataUrl = e.target?.result as string;
      setSourceImage(dataUrl);
      setIsGenerating(true);

      try {
        const favicons = new Map<number, string>();
        for (const sizeInfo of faviconSizes.filter(s => selectedSizes.has(s.size))) {
          const dataUrl = await generateFavicon(sizeInfo.size);
          favicons.set(sizeInfo.size, dataUrl);
        }
        setGeneratedFavicons(favicons);
      } catch (e) {
        setError(`Generation error: ${(e as Error).message}`);
      } finally {
        setIsGenerating(false);
      }
    };

    reader.onerror = () => setError('Failed to read file');
    reader.readAsDataURL(file);
  }, [selectedSizes, generateFavicon]);

  const handleDownload = useCallback((size: number) => {
    const dataUrl = generatedFavicons.get(size);
    if (!dataUrl) return;

    const sizeInfo = faviconSizes.find(s => s.size === size);
    const filename = sizeInfo?.filename || `favicon-${size}x${size}.png`;

    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = filename;
    link.click();
  }, [generatedFavicons]);

  const handleDownloadAll = useCallback(() => {
    Array.from(selectedSizes).forEach((size, index) => {
      setTimeout(() => handleDownload(size), index * 100);
    });
  }, [selectedSizes, handleDownload]);

  const toggleSize = useCallback((size: number) => {
    setSelectedSizes(prev => {
      const next = new Set(prev);
      if (next.has(size)) {
        next.delete(size);
      } else {
        next.add(size);
      }
      return next;
    });
  }, []);

  
  const controls = (
          <div className="flex items-center gap-3">
        <button
          onClick={() => {
            if (sourceImage) {
              setIsGenerating(true);
              (async () => {
                try {
                  const favicons = new Map<number, string>();
                  for (const sizeInfo of faviconSizes.filter(s => selectedSizes.has(s.size))) {
                    const dataUrl = await generateFavicon(sizeInfo.size);
                    favicons.set(sizeInfo.size, dataUrl);
                  }
                  setGeneratedFavicons(favicons);
                } catch (e) {
                  setError(`Generation error: ${(e as Error).message}`);
                } finally {
                  setIsGenerating(false);
                }
              })();
            } else {
              fileInputRef.current?.click();
            }
          }}
          disabled={isGenerating || selectedSizes.size === 0}
          className="btn-primary flex items-center gap-2"
        >
          {isGenerating ? (
            <>
              <LoadingSpinner size="sm" />
              Generating...
            </>
          ) : (
            <>
              <ImageIcon size={18} />
              Generate Favicons
            </>
          )}
        </button>
        {generatedFavicons.size > 0 && (
          <>
            <button
              onClick={handleDownloadAll}
              className="btn-secondary flex items-center gap-2"
            >
              <Download size={18} />
              Download All ({generatedFavicons.size})
            </button>
            <button
              onClick={() => {
                setSourceImage(null);
                setGeneratedFavicons(new Map());
                setSelectedSizes(new Set([16, 32, 180, 192]));
              }}
              className="btn-ghost flex items-center gap-2"
            >
              <Trash2 size={18} />
              Clear
            </button>
          </>
        )}
      </div>
  );

  return (
    <ToolShell className="space-y-6" controls={controls}>
      {error && <ErrorMessage message={error} onDismiss={() => setError('')} />}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="label">Source Image</label>
          <div
            className="border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors hover:border-[var(--brand-primary)]"
            style={{ borderColor: 'var(--border-primary)' }}
            onClick={() => fileInputRef.current?.click()}
          >
            {sourceImage ? (
              <div className="space-y-3">
                <img
                  src={sourceImage}
                  alt="Source"
                  className="max-w-full max-h-48 mx-auto rounded-lg"
                />
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSourceImage(null);
                    setGeneratedFavicons(new Map());
                  }}
                  className="btn-ghost btn-sm"
                >
                  <Trash2 size={14} className="mr-1" />
                  Remove
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                <ImageIcon size={48} className="mx-auto" style={{ color: 'var(--text-muted)' }} />
                <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
                  Click to upload image
                </p>
                <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                  PNG, JPG, SVG, WebP
                </p>
              </div>
            )}
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={(e) => handleFileSelect(e.target.files)}
            className="hidden"
          />
        </div>

        <div>
          <label className="label">Select Favicon Sizes</label>
          <div className="space-y-2 max-h-64 overflow-y-auto p-2 border rounded-lg" style={{ borderColor: 'var(--border-primary)' }}>
            {faviconSizes.map((sizeInfo) => (
              <label
                key={sizeInfo.size}
                className="flex items-center gap-3 p-2 rounded-lg cursor-pointer hover:bg-[var(--bg-secondary)] transition-colors"
              >
                <input
                  type="checkbox"
                  checked={selectedSizes.has(sizeInfo.size)}
                  onChange={() => toggleSize(sizeInfo.size)}
                  className="w-4 h-4"
                />
                <span className="text-sm flex-1" style={{ color: 'var(--text-primary)' }}>
                  {sizeInfo.label}
                </span>
                <span className="text-xs font-mono" style={{ color: 'var(--text-muted)' }}>
                  {sizeInfo.filename}
                </span>
              </label>
            ))}
          </div>
        </div>
      </div>

{/* Controls moved to header */}





























































      {generatedFavicons.size > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
            Generated Favicons
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array.from(generatedFavicons.entries()).map(([size, dataUrl]) => {
              const sizeInfo = faviconSizes.find(s => s.size === size);
              return (
                <div
                  key={size}
                  className="p-4 rounded-xl border animate-fade-in-scale text-center"
                  style={{
                    backgroundColor: 'var(--bg-secondary)',
                    borderColor: 'var(--border-primary)'
                  }}
                >
                  <div className="mb-3 flex items-center justify-center">
                    <img
                      src={dataUrl}
                      alt={`${size}x${size}`}
                      className="border rounded"
                      style={{ borderColor: 'var(--border-primary)' }}
                    />
                  </div>
                  <p className="text-xs font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>
                    {size}x{size}
                  </p>
                  <p className="text-xs mb-2 truncate" style={{ color: 'var(--text-muted)' }}>
                    {sizeInfo?.filename}
                  </p>
                  <button
                    onClick={() => handleDownload(size)}
                    className="btn-primary w-full btn-sm"
                  >
                    <Download size={12} className="mr-1" />
                    Download
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="p-4 rounded-xl border text-sm" style={{ 
        backgroundColor: 'var(--bg-secondary)', 
        borderColor: 'var(--border-primary)' 
      }}>
        <h3 className="font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
          Favicon Sizes Guide:
        </h3>
        <ul className="space-y-1 text-xs" style={{ color: 'var(--text-muted)' }}>
          <li>• <strong>16x16, 32x32:</strong> Standard favicon sizes</li>
          <li>• <strong>180x180:</strong> Apple touch icon (iOS)</li>
          <li>• <strong>192x192, 512x512:</strong> Android/PWA icons</li>
          <li>• Upload a square image (1:1 ratio) for best results</li>
        </ul>
      </div>
    </ToolShell>
  );
}

