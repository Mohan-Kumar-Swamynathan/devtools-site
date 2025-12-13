import { useState, useRef, useCallback, useEffect } from 'react';
import { Upload, Download, Trash2, Crop, RotateCcw } from 'lucide-react';
import ErrorMessage from '@/components/common/ErrorMessage';
import LoadingSpinner from '@/components/common/LoadingSpinner';

interface CropArea {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface CroppedImage {
  file: File;
  dataUrl: string;
  originalSize: number;
  croppedSize: number;
}

const ASPECT_RATIOS = [
  { label: 'Free', value: null },
  { label: '1:1', value: 1 },
  { label: '16:9', value: 16 / 9 },
  { label: '4:3', value: 4 / 3 },
  { label: '3:2', value: 3 / 2 },
  { label: '9:16', value: 9 / 16 },
];

export default function ImageCropper() {
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const [imageUrl, setImageUrl] = useState<string>('');
  const [cropArea, setCropArea] = useState<CropArea | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [croppedImage, setCroppedImage] = useState<CroppedImage | null>(null);
  const [aspectRatio, setAspectRatio] = useState<number | null>(null);
  const [error, setError] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = useCallback((files: FileList | null) => {
    if (!files || files.length === 0) return;

    const file = files[0];
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file');
      return;
    }

    setError('');
    const url = URL.createObjectURL(file);
    setImageUrl(url);

    const img = new Image();
    img.onload = () => {
      setImage(img);
      const container = containerRef.current;
      if (container) {
        const containerWidth = container.clientWidth;
        const containerHeight = container.clientHeight;
        const scale = Math.min(
          containerWidth / img.width,
          containerHeight / img.height,
          1
        );
        const displayWidth = img.width * scale;
        const displayHeight = img.height * scale;
        
        setCropArea({
          x: (containerWidth - displayWidth) / 2,
          y: (containerHeight - displayHeight) / 2,
          width: displayWidth,
          height: displayHeight,
        });
      }
      URL.revokeObjectURL(url);
    };
    img.onerror = () => {
      setError('Failed to load image');
      URL.revokeObjectURL(url);
    };
    img.src = url;
  }, []);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (!cropArea) return;
    setIsDragging(true);
    setDragStart({
      x: e.clientX - cropArea.x,
      y: e.clientY - cropArea.y,
    });
  }, [cropArea]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging || !cropArea || !containerRef.current) return;

    const container = containerRef.current;
    const rect = container.getBoundingClientRect();
    const x = e.clientX - rect.left - dragStart.x;
    const y = e.clientY - rect.top - dragStart.y;

    const maxX = rect.width - cropArea.width;
    const maxY = rect.height - cropArea.height;

    setCropArea({
      ...cropArea,
      x: Math.max(0, Math.min(x, maxX)),
      y: Math.max(0, Math.min(y, maxY)),
    });
  }, [isDragging, cropArea, dragStart]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleResize = useCallback((e: React.MouseEvent, corner: string) => {
    if (!cropArea || !image || !containerRef.current) return;

    const container = containerRef.current;
    const rect = container.getBoundingClientRect();
    const startX = e.clientX;
    const startY = e.clientY;
    const startCrop = { ...cropArea };

    const onMouseMove = (moveEvent: MouseEvent) => {
      const deltaX = (moveEvent.clientX - startX) / (image.width / rect.width);
      const deltaY = (moveEvent.clientY - startY) / (image.height / rect.height);

      let newCrop = { ...startCrop };

      if (corner.includes('right')) {
        newCrop.width = Math.max(50, startCrop.width + deltaX);
      }
      if (corner.includes('left')) {
        newCrop.width = Math.max(50, startCrop.width - deltaX);
        newCrop.x = startCrop.x + deltaX;
      }
      if (corner.includes('bottom')) {
        newCrop.height = Math.max(50, startCrop.height + deltaY);
      }
      if (corner.includes('top')) {
        newCrop.height = Math.max(50, startCrop.height - deltaY);
        newCrop.y = startCrop.y + deltaY;
      }

      if (aspectRatio) {
        if (corner.includes('right') || corner.includes('left')) {
          newCrop.height = newCrop.width / aspectRatio;
        } else {
          newCrop.width = newCrop.height * aspectRatio;
        }
      }

      const maxX = rect.width - newCrop.width;
      const maxY = rect.height - newCrop.height;
      newCrop.x = Math.max(0, Math.min(newCrop.x, maxX));
      newCrop.y = Math.max(0, Math.min(newCrop.y, maxY));

      setCropArea(newCrop);
    };

    const onMouseUp = () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  }, [cropArea, image, aspectRatio]);

  const performCrop = useCallback(async () => {
    if (!image || !cropArea || !containerRef.current) return;

    setIsProcessing(true);
    setError('');

    try {
      const container = containerRef.current;
      const rect = container.getBoundingClientRect();
      const scaleX = image.width / rect.width;
      const scaleY = image.height / rect.height;

      const cropX = cropArea.x * scaleX;
      const cropY = cropArea.y * scaleY;
      const cropWidth = cropArea.width * scaleX;
      const cropHeight = cropArea.height * scaleY;

      const canvas = document.createElement('canvas');
      canvas.width = cropWidth;
      canvas.height = cropHeight;

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        throw new Error('Could not get canvas context');
      }

      ctx.drawImage(
        image,
        cropX, cropY, cropWidth, cropHeight,
        0, 0, cropWidth, cropHeight
      );

      canvas.toBlob((blob) => {
        if (!blob) {
          setError('Failed to create cropped image');
          setIsProcessing(false);
          return;
        }

        const dataUrl = canvas.toDataURL('image/png');
        const file = new File([blob], 'cropped-image.png', { type: 'image/png' });

        setCroppedImage({
          file,
          dataUrl,
          originalSize: 0,
          croppedSize: blob.size,
        });
        setIsProcessing(false);
      }, 'image/png');
    } catch (e) {
      setError(`Crop error: ${(e as Error).message}`);
      setIsProcessing(false);
    }
  }, [image, cropArea]);

  const handleDownload = useCallback(() => {
    if (!croppedImage) return;
    const link = document.createElement('a');
    link.href = croppedImage.dataUrl;
    link.download = croppedImage.file.name;
    link.click();
  }, [croppedImage]);

  const handleReset = useCallback(() => {
    setImage(null);
    setImageUrl('');
    setCropArea(null);
    setCroppedImage(null);
    setAspectRatio(null);
    setError('');
  }, []);

  useEffect(() => {
    if (aspectRatio && cropArea) {
      const newHeight = cropArea.width / aspectRatio;
      setCropArea({
        ...cropArea,
        height: newHeight,
      });
    }
  }, [aspectRatio]);

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
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
            <div className="flex items-center gap-2">
              <label className="label">Aspect Ratio:</label>
              <select
                value={aspectRatio === null ? 'free' : aspectRatio.toString()}
                onChange={(e) => setAspectRatio(e.target.value === 'free' ? null : parseFloat(e.target.value))}
                className="input"
                disabled={isProcessing}
              >
                {ASPECT_RATIOS.map(ratio => (
                  <option key={ratio.label} value={ratio.value === null ? 'free' : ratio.value}>
                    {ratio.label}
                  </option>
                ))}
              </select>
            </div>
            <button
              onClick={performCrop}
              disabled={isProcessing || !cropArea}
              className="btn-secondary flex items-center gap-2"
            >
              {isProcessing ? (
                <>
                  <LoadingSpinner size="sm" />
                  Cropping...
                </>
              ) : (
                <>
                  <Crop size={18} />
                  Crop Image
                </>
              )}
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

      {image && cropArea && (
        <div className="space-y-4">
          <div
            ref={containerRef}
            className="relative border-2 border-dashed rounded-xl overflow-hidden"
            style={{
              backgroundColor: 'var(--bg-secondary)',
              borderColor: 'var(--border-primary)',
              minHeight: '400px',
              maxHeight: '600px',
            }}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          >
            <img
              src={imageUrl || image.src}
              alt="Crop preview"
              className="w-full h-full object-contain"
              style={{ maxHeight: '600px' }}
            />
            <div
              className="absolute border-2 border-blue-500 bg-blue-500 bg-opacity-20 cursor-move"
              style={{
                left: `${cropArea.x}px`,
                top: `${cropArea.y}px`,
                width: `${cropArea.width}px`,
                height: `${cropArea.height}px`,
              }}
            >
              <div
                className="absolute -top-1 -left-1 w-3 h-3 bg-blue-500 rounded-full cursor-nwse-resize"
                onMouseDown={(e) => {
                  e.stopPropagation();
                  handleResize(e, 'top-left');
                }}
              />
              <div
                className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full cursor-nesw-resize"
                onMouseDown={(e) => {
                  e.stopPropagation();
                  handleResize(e, 'top-right');
                }}
              />
              <div
                className="absolute -bottom-1 -left-1 w-3 h-3 bg-blue-500 rounded-full cursor-nesw-resize"
                onMouseDown={(e) => {
                  e.stopPropagation();
                  handleResize(e, 'bottom-left');
                }}
              />
              <div
                className="absolute -bottom-1 -right-1 w-3 h-3 bg-blue-500 rounded-full cursor-nwse-resize"
                onMouseDown={(e) => {
                  e.stopPropagation();
                  handleResize(e, 'bottom-right');
                }}
              />
            </div>
          </div>
        </div>
      )}

      {croppedImage && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
            Cropped Image
          </h3>
          <div className="p-4 rounded-xl border" style={{
            backgroundColor: 'var(--bg-secondary)',
            borderColor: 'var(--border-primary)'
          }}>
            <img
              src={croppedImage.dataUrl}
              alt="Cropped"
              className="w-full max-w-md mx-auto rounded-lg mb-4"
            />
            <div className="flex items-center justify-between text-sm mb-4">
              <span style={{ color: 'var(--text-muted)' }}>Size:</span>
              <span style={{ color: 'var(--text-primary)' }}>
                {formatSize(croppedImage.croppedSize)}
              </span>
            </div>
            <button
              onClick={handleDownload}
              className="btn-primary w-full flex items-center justify-center gap-2"
            >
              <Download size={18} />
              Download Cropped Image
            </button>
          </div>
        </div>
      )}

      <div className="p-4 rounded-xl border text-sm" style={{
        backgroundColor: 'var(--bg-secondary)',
        borderColor: 'var(--border-primary)'
      }}>
        <h3 className="font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
          How to use:
        </h3>
        <ul className="space-y-1 text-xs" style={{ color: 'var(--text-muted)' }}>
          <li>• Upload an image</li>
          <li>• Drag the crop area to reposition it</li>
          <li>• Drag the corners to resize the crop area</li>
          <li>• Select an aspect ratio to maintain proportions</li>
          <li>• Click "Crop Image" to process</li>
        </ul>
      </div>
    </div>
  );
}

