import { useState, useRef, useCallback } from 'react';
import { Upload, Download, Trash2, RotateCw, RotateCcw, FlipHorizontal, FlipVertical, RotateCcw as Reset } from 'lucide-react';
import ErrorMessage from '@/components/common/ErrorMessage';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import ToolShell from './ToolShell';
import { useToast } from '@/hooks/useToast';

interface ProcessedImage {
  file: File;
  dataUrl: string;
  rotation: number;
  flipped: { horizontal: boolean; vertical: boolean };
}

export default function ImageRotator() {
  const [images, setImages] = useState<ProcessedImage[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processImage = useCallback((file: File, rotation: number, flipped: { horizontal: boolean; vertical: boolean }): Promise<ProcessedImage> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        const img = new Image();
        
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;

          // Adjust canvas size for rotation
          if (rotation === 90 || rotation === 270) {
            [width, height] = [height, width];
          }

          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext('2d');
          if (!ctx) {
            reject(new Error('Could not get canvas context'));
            return;
          }

          // Apply transformations
          ctx.translate(canvas.width / 2, canvas.height / 2);
          ctx.rotate((rotation * Math.PI) / 180);
          
          if (flipped.horizontal) {
            ctx.scale(-1, 1);
          }
          if (flipped.vertical) {
            ctx.scale(1, -1);
          }

          ctx.drawImage(img, -img.width / 2, -img.height / 2);

          canvas.toBlob((blob) => {
            if (!blob) {
              reject(new Error('Processing failed'));
              return;
            }

            const dataUrl = canvas.toDataURL('image/png');
            resolve({
              file: new File([blob], file.name, { type: 'image/png' }),
              dataUrl,
              rotation,
              flipped,
            });
          }, 'image/png');
        };

        img.onerror = () => reject(new Error('Failed to load image'));
        img.src = e.target?.result as string;
      };

      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsDataURL(file);
    });
  }, []);

  const handleFileSelect = useCallback(async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    setError('');
    setIsProcessing(true);

    try {
      const imageFiles = Array.from(files).filter(file => 
        file.type.startsWith('image/')
      );

      if (imageFiles.length === 0) {
        setError('Please select image files');
        setIsProcessing(false);
        return;
      }

      const processed = await Promise.all(
        imageFiles.map(file => processImage(file, 0, { horizontal: false, vertical: false }))
      );

      setImages(prev => [...prev, ...processed]);
    } catch (e) {
      setError(`Processing error: ${(e as Error).message}`);
    } finally {
      setIsProcessing(false);
    }
  }, [processImage]);

  const rotateImage = useCallback(async (index: number, degrees: number) => {
    const image = images[index];
    if (!image) return;

    setIsProcessing(true);
    setError('');

    try {
      const newRotation = (image.rotation + degrees) % 360;
      const processed = await processImage(
        image.file,
        newRotation,
        image.flipped
      );

      const newImages = [...images];
      newImages[index] = processed;
      setImages(newImages);
    } catch (e) {
      setError(`Rotation error: ${(e as Error).message}`);
    } finally {
      setIsProcessing(false);
    }
  }, [images, processImage]);

  const flipImage = useCallback(async (index: number, direction: 'horizontal' | 'vertical') => {
    const image = images[index];
    if (!image) return;

    setIsProcessing(true);
    setError('');

    try {
      const newFlipped = {
        ...image.flipped,
        [direction]: !image.flipped[direction],
      };
      const processed = await processImage(
        image.file,
        image.rotation,
        newFlipped
      );

      const newImages = [...images];
      newImages[index] = processed;
      setImages(newImages);
    } catch (e) {
      setError(`Flip error: ${(e as Error).message}`);
    } finally {
      setIsProcessing(false);
    }
  }, [images, processImage]);

  const resetImage = useCallback(async (index: number) => {
    const image = images[index];
    if (!image) return;

    setIsProcessing(true);
    setError('');

    try {
      const processed = await processImage(
        image.file,
        0,
        { horizontal: false, vertical: false }
      );

      const newImages = [...images];
      newImages[index] = processed;
      setImages(newImages);
    } catch (e) {
      setError(`Reset error: ${(e as Error).message}`);
    } finally {
      setIsProcessing(false);
    }
  }, [images, processImage]);

  const handleDownload = useCallback((image: ProcessedImage) => {
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

  
  const controls = (
          <div className="flex items-center gap-3">
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={isProcessing}
          className="btn-primary flex items-center gap-2"
        >
          {isProcessing ? (
            <>
              <LoadingSpinner size="sm" />
              Processing...
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
  );

  return (
    <ToolShell className="space-y-6" controls={controls}>
      {error && <ErrorMessage message={error} onDismiss={() => setError('')} />}

{/* Controls moved to header */}













































      {images.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
            Images ({images.length})
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
                    alt={`Processed ${index + 1}`}
                    className="w-full h-48 object-contain rounded-lg bg-gray-100 dark:bg-gray-800"
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => rotateImage(index, 90)}
                      disabled={isProcessing}
                      className="btn-sm btn-secondary flex items-center gap-1"
                      title="Rotate 90° clockwise"
                    >
                      <RotateCw size={14} />
                    </button>
                    <button
                      onClick={() => rotateImage(index, -90)}
                      disabled={isProcessing}
                      className="btn-sm btn-secondary flex items-center gap-1"
                      title="Rotate 90° counter-clockwise"
                    >
                      <RotateCcw size={14} />
                    </button>
                    <button
                      onClick={() => rotateImage(index, 180)}
                      disabled={isProcessing}
                      className="btn-sm btn-secondary flex items-center gap-1"
                      title="Rotate 180°"
                    >
                      <RotateCw size={14} className="rotate-180" />
                    </button>
                    <button
                      onClick={() => flipImage(index, 'horizontal')}
                      disabled={isProcessing}
                      className="btn-sm btn-secondary flex items-center gap-1"
                      title="Flip horizontal"
                    >
                      <FlipHorizontal size={14} />
                    </button>
                    <button
                      onClick={() => flipImage(index, 'vertical')}
                      disabled={isProcessing}
                      className="btn-sm btn-secondary flex items-center gap-1"
                      title="Flip vertical"
                    >
                      <FlipVertical size={14} />
                    </button>
                    <button
                      onClick={() => resetImage(index)}
                      disabled={isProcessing}
                      className="btn-sm btn-ghost flex items-center gap-1"
                      title="Reset"
                    >
                      <Reset size={14} />
                    </button>
                  </div>
                  <button
                    onClick={() => handleDownload(image)}
                    className="btn-primary w-full btn-sm"
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
          <li>• Rotate images 90°, 180°, or 270° in either direction</li>
          <li>• Flip images horizontally or vertically</li>
          <li>• Combine multiple rotations and flips</li>
          <li>• Reset to original orientation at any time</li>
          <li>• Process multiple images at once</li>
        </ul>
      </div>
    </ToolShell>
  );
}

