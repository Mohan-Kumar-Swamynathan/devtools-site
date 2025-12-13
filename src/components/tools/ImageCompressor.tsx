import { useState, useRef, useCallback } from 'react';
import { Upload, Download, Trash2, Image as ImageIcon, Loader } from 'lucide-react';
import ErrorMessage from '@/components/common/ErrorMessage';
import LoadingSpinner from '@/components/common/LoadingSpinner';

interface CompressedImage {
  file: File;
  originalSize: number;
  compressedSize: number;
  dataUrl: string;
  quality: number;
}

export default function ImageCompressor() {
  const [images, setImages] = useState<CompressedImage[]>([]);
  const [quality, setQuality] = useState(0.8);
  const [maxWidth, setMaxWidth] = useState(1920);
  const [maxHeight, setMaxHeight] = useState(1080);
  const [isCompressing, setIsCompressing] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const compressImage = useCallback((file: File): Promise<CompressedImage> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        const img = new Image();
        
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;

          // Calculate new dimensions
          if (width > maxWidth || height > maxHeight) {
            const ratio = Math.min(maxWidth / width, maxHeight / height);
            width = width * ratio;
            height = height * ratio;
          }

          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext('2d');
          if (!ctx) {
            reject(new Error('Could not get canvas context'));
            return;
          }

          ctx.drawImage(img, 0, 0, width, height);

          // Get file type
          const fileType = file.type || 'image/jpeg';
          const outputFormat = fileType === 'image/png' ? 'image/png' : 'image/jpeg';

          canvas.toBlob(
            (blob) => {
              if (!blob) {
                reject(new Error('Compression failed'));
                return;
              }

              const dataUrl = canvas.toDataURL(outputFormat, quality);
              const compressedFile = new File([blob], file.name, { type: outputFormat });

              resolve({
                file: compressedFile,
                originalSize: file.size,
                compressedSize: blob.size,
                dataUrl,
                quality
              });
            },
            outputFormat,
            quality
          );
        };

        img.onerror = () => reject(new Error('Failed to load image'));
        img.src = e.target?.result as string;
      };

      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsDataURL(file);
    });
  }, [quality, maxWidth, maxHeight]);

  const handleFileSelect = useCallback(async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    setError('');
    setIsCompressing(true);

    try {
      const imageFiles = Array.from(files).filter(file => 
        file.type.startsWith('image/')
      );

      if (imageFiles.length === 0) {
        setError('Please select image files (PNG, JPG, WebP, etc.)');
        setIsCompressing(false);
        return;
      }

      const compressed = await Promise.all(
        imageFiles.map(file => compressImage(file))
      );

      setImages(prev => [...prev, ...compressed]);
    } catch (e) {
      setError(`Compression error: ${(e as Error).message}`);
    } finally {
      setIsCompressing(false);
    }
  }, [compressImage]);

  const handleDownload = useCallback((image: CompressedImage) => {
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

  const getCompressionRatio = (original: number, compressed: number) => {
    return ((1 - compressed / original) * 100).toFixed(1);
  };

  return (
    <div className="space-y-6">
      {error && <ErrorMessage message={error} onDismiss={() => setError('')} />}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
            disabled={isCompressing}
          />
          <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
            Lower = smaller file, lower quality
          </p>
        </div>
        <div>
          <label className="label">Max Width: {maxWidth}px</label>
          <input
            type="range"
            min="100"
            max="4000"
            step="100"
            value={maxWidth}
            onChange={(e) => setMaxWidth(parseInt(e.target.value))}
            className="w-full"
            disabled={isCompressing}
          />
        </div>
        <div>
          <label className="label">Max Height: {maxHeight}px</label>
          <input
            type="range"
            min="100"
            max="4000"
            step="100"
            value={maxHeight}
            onChange={(e) => setMaxHeight(parseInt(e.target.value))}
            className="w-full"
            disabled={isCompressing}
          />
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={isCompressing}
          className="btn-primary flex items-center gap-2"
        >
          {isCompressing ? (
            <>
              <LoadingSpinner size="sm" />
              Compressing...
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
            Compressed Images ({images.length})
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
                    alt={`Compressed ${index + 1}`}
                    className="w-full h-32 object-cover rounded-lg"
                  />
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span style={{ color: 'var(--text-muted)' }}>Original:</span>
                    <span style={{ color: 'var(--text-primary)' }}>{formatSize(image.originalSize)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span style={{ color: 'var(--text-muted)' }}>Compressed:</span>
                    <span className="font-semibold" style={{ color: 'var(--status-success)' }}>
                      {formatSize(image.compressedSize)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span style={{ color: 'var(--text-muted)' }}>Saved:</span>
                    <span className="font-semibold" style={{ color: 'var(--status-success)' }}>
                      {getCompressionRatio(image.originalSize, image.compressedSize)}%
                    </span>
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
          Tips:
        </h3>
        <ul className="space-y-1 text-xs" style={{ color: 'var(--text-muted)' }}>
          <li>• Lower quality = smaller file size but lower image quality</li>
          <li>• Adjust max dimensions to reduce file size further</li>
          <li>• PNG images are converted to JPEG for better compression</li>
          <li>• All processing happens in your browser - your images never leave your device</li>
        </ul>
      </div>
    </div>
  );
}

