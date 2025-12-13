import { useState, useRef, useCallback } from 'react';
import { Upload, Download, Trash2, Image as ImageIcon } from 'lucide-react';
import ErrorMessage from '@/components/common/ErrorMessage';
import LoadingSpinner from '@/components/common/LoadingSpinner';

interface ConvertedImage {
  file: File;
  originalFormat: string;
  convertedFormat: string;
  dataUrl: string;
  size: number;
}

const formats = [
  { value: 'image/jpeg', label: 'JPEG', extension: 'jpg' },
  { value: 'image/png', label: 'PNG', extension: 'png' },
  { value: 'image/webp', label: 'WebP', extension: 'webp' },
  { value: 'image/bmp', label: 'BMP', extension: 'bmp' }
];

export default function ImageFormatConverter() {
  const [images, setImages] = useState<ConvertedImage[]>([]);
  const [targetFormat, setTargetFormat] = useState('image/jpeg');
  const [quality, setQuality] = useState(0.9);
  const [isConverting, setIsConverting] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const convertImage = useCallback((file: File, format: string): Promise<ConvertedImage> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        const img = new Image();
        
        img.onload = () => {
          const canvas = document.createElement('canvas');
          canvas.width = img.width;
          canvas.height = img.height;

          const ctx = canvas.getContext('2d');
          if (!ctx) {
            reject(new Error('Could not get canvas context'));
            return;
          }

          ctx.drawImage(img, 0, 0);

          const outputFormat = format;
          const outputQuality = format === 'image/png' ? undefined : quality;

          canvas.toBlob(
            (blob) => {
              if (!blob) {
                reject(new Error('Conversion failed'));
                return;
              }

              const dataUrl = canvas.toDataURL(outputFormat, outputQuality);
              const formatInfo = formats.find(f => f.value === format);
              const extension = formatInfo?.extension || 'jpg';
              const newFileName = file.name.replace(/\.[^/.]+$/, '') + '.' + extension;
              const convertedFile = new File([blob], newFileName, { type: outputFormat });

              resolve({
                file: convertedFile,
                originalFormat: file.type || 'unknown',
                convertedFormat: format,
                dataUrl,
                size: blob.size
              });
            },
            outputFormat,
            outputQuality
          );
        };

        img.onerror = () => reject(new Error('Failed to load image'));
        img.src = e.target?.result as string;
      };

      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsDataURL(file);
    });
  }, [quality]);

  const handleFileSelect = useCallback(async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    setError('');
    setIsConverting(true);

    try {
      const imageFiles = Array.from(files).filter(file => 
        file.type.startsWith('image/')
      );

      if (imageFiles.length === 0) {
        setError('Please select image files');
        setIsConverting(false);
        return;
      }

      const converted = await Promise.all(
        imageFiles.map(file => convertImage(file, targetFormat))
      );

      setImages(prev => [...prev, ...converted]);
    } catch (e) {
      setError(`Conversion error: ${(e as Error).message}`);
    } finally {
      setIsConverting(false);
    }
  }, [convertImage, targetFormat]);

  const handleDownload = useCallback((image: ConvertedImage) => {
    const link = document.createElement('a');
    link.href = image.dataUrl;
    link.download = image.file.name;
    link.click();
  }, []);

  const handleDownloadAll = useCallback(() => {
    images.forEach((image, index) => {
      setTimeout(() => handleDownload(image), index * 100);
    });
  }, [images, handleDownload]);

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  };

  return (
    <div className="space-y-6">
      {error && <ErrorMessage message={error} onDismiss={() => setError('')} />}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="label">Convert To Format</label>
          <select
            value={targetFormat}
            onChange={(e) => setTargetFormat(e.target.value)}
            className="input-base"
            disabled={isConverting}
          >
            {formats.map((format) => (
              <option key={format.value} value={format.value}>
                {format.label}
              </option>
            ))}
          </select>
        </div>
        {targetFormat !== 'image/png' && (
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
              disabled={isConverting}
            />
          </div>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={isConverting}
          className="btn-primary flex items-center gap-2"
        >
          {isConverting ? (
            <>
              <LoadingSpinner size="sm" />
              Converting...
            </>
          ) : (
            <>
              <Upload size={18} />
              Select Images
            </>
          )}
        </button>
        {images.length > 0 && (
          <>
            <button
              onClick={handleDownloadAll}
              className="btn-secondary flex items-center gap-2"
            >
              <Download size={18} />
              Download All ({images.length})
            </button>
            <button
              onClick={() => setImages([])}
              className="btn-ghost flex items-center gap-2"
            >
              <Trash2 size={18} />
              Clear All
            </button>
          </>
        )}
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          onChange={(e) => handleFileSelect(e.target.files)}
          className="hidden"
        />
      </div>

      {images.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
            Converted Images ({images.length})
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {images.map((image, index) => (
              <div
                key={index}
                className="p-4 rounded-xl border animate-fade-in-scale"
                style={{
                  backgroundColor: 'var(--bg-secondary)',
                  borderColor: 'var(--border-primary)'
                }}
              >
                <div className="mb-3">
                  <img
                    src={image.dataUrl}
                    alt={`Converted ${index + 1}`}
                    className="w-full h-32 object-cover rounded-lg"
                  />
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span style={{ color: 'var(--text-muted)' }}>Format:</span>
                    <span style={{ color: 'var(--text-primary)' }}>
                      {image.originalFormat.split('/')[1]?.toUpperCase()} → {image.convertedFormat.split('/')[1]?.toUpperCase()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span style={{ color: 'var(--text-muted)' }}>Size:</span>
                    <span style={{ color: 'var(--text-primary)' }}>{formatSize(image.size)}</span>
                  </div>
                  <button
                    onClick={() => handleDownload(image)}
                    className="btn-primary w-full btn-sm mt-2"
                  >
                    <Download size={14} className="mr-1" />
                    Download
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="p-4 rounded-xl border text-sm" style={{ 
        backgroundColor: 'var(--bg-secondary)', 
        borderColor: 'var(--border-primary)' 
      }}>
        <h3 className="font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
          Supported Formats:
        </h3>
        <ul className="space-y-1 text-xs" style={{ color: 'var(--text-muted)' }}>
          <li>• <strong>JPEG:</strong> Best for photos, smaller file size</li>
          <li>• <strong>PNG:</strong> Best for images with transparency</li>
          <li>• <strong>WebP:</strong> Modern format, excellent compression</li>
          <li>• <strong>BMP:</strong> Uncompressed bitmap format</li>
        </ul>
      </div>
    </div>
  );
}

