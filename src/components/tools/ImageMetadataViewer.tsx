import { useState, useRef, useCallback } from 'react';
import { Upload, Trash2, Info } from 'lucide-react';
import ErrorMessage from '@/components/common/ErrorMessage';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import ToolShell from './ToolShell';
import { useToast } from '@/hooks/useToast';

interface Metadata {
  name: string;
  width: number;
  height: number;
  size: number;
  type: string;
  lastModified?: number;
  [key: string]: any;
}

export default function ImageMetadataViewer() {
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const [imageUrl, setImageUrl] = useState<string>('');
  const [metadata, setMetadata] = useState<Metadata | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = useCallback((files: FileList | null) => {
    if (!files || files.length === 0) return;

    const file = files[0];
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file');
      return;
    }

    setError('');
    setIsLoading(true);
    const url = URL.createObjectURL(file);
    setImageUrl(url);

    const img = new Image();
    img.onload = () => {
      const meta: Metadata = {
        name: file.name,
        width: img.width,
        height: img.height,
        size: file.size,
        type: file.type,
        lastModified: file.lastModified,
      };

      setImage(img);
      setMetadata(meta);
      setIsLoading(false);
    };
    
    img.onerror = () => {
      setError('Failed to load image');
      URL.revokeObjectURL(url);
      setIsLoading(false);
    };
    img.src = url;
  }, []);

  const handleReset = useCallback(() => {
    setImage(null);
    if (imageUrl) URL.revokeObjectURL(imageUrl);
    setImageUrl('');
    setMetadata(null);
    setError('');
  }, [imageUrl]);

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) 

  return (bytes / 1024).toFixed(2) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  };

  const formatDate = (timestamp?: number) => {
    if (!timestamp) return 'N/A';
    return new Date(timestamp).toLocaleString();
  };

    const controls = (
          <div className="flex items-center gap-3">
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={isLoading}
          className="btn-primary flex items-center gap-2"
        >
          {isLoading ? (
            <>
              <LoadingSpinner size="sm" />
              Loading...
            </>
          ) : (
            <>
              <Upload size={18} />
              Select Image
            </>
          )}
        </button>
        {image && (
          <button
            onClick={handleReset}
            className="btn-ghost flex items-center gap-2"
          >
            <Trash2 size={18} />
            Clear
          </button>
        )}
        <input
          ref={fileInputRef}
          type="file"
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



































      {image && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
              Image Preview
            </h3>
            <div className="p-4 rounded-xl border" style={{
              backgroundColor: 'var(--bg-secondary)',
              borderColor: 'var(--border-primary)'
            }}>
              <img
                src={imageUrl}
                alt="Preview"
                className="w-full rounded-lg"
              />
            </div>
          </div>
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
              <Info size={20} />
              Metadata
            </h3>
            {metadata && (
              <div className="p-4 rounded-xl border space-y-3" style={{
                backgroundColor: 'var(--bg-secondary)',
                borderColor: 'var(--border-primary)'
              }}>
                <div className="grid grid-cols-1 gap-3">
                  <div>
                    <div className="text-sm font-medium mb-1" style={{ color: 'var(--text-muted)' }}>
                      File Name
                    </div>
                    <div className="text-base font-semibold" style={{ color: 'var(--text-primary)' }}>
                      {metadata.name}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm font-medium mb-1" style={{ color: 'var(--text-muted)' }}>
                      Dimensions
                    </div>
                    <div className="text-base font-semibold" style={{ color: 'var(--text-primary)' }}>
                      {metadata.width} × {metadata.height} px
                    </div>
                  </div>
                  <div>
                    <div className="text-sm font-medium mb-1" style={{ color: 'var(--text-muted)' }}>
                      File Size
                    </div>
                    <div className="text-base font-semibold" style={{ color: 'var(--text-primary)' }}>
                      {formatSize(metadata.size)}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm font-medium mb-1" style={{ color: 'var(--text-muted)' }}>
                      MIME Type
                    </div>
                    <div className="text-base font-semibold" style={{ color: 'var(--text-primary)' }}>
                      {metadata.type}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm font-medium mb-1" style={{ color: 'var(--text-muted)' }}>
                      Last Modified
                    </div>
                    <div className="text-base font-semibold" style={{ color: 'var(--text-primary)' }}>
                      {formatDate(metadata.lastModified)}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm font-medium mb-1" style={{ color: 'var(--text-muted)' }}>
                      Aspect Ratio
                    </div>
                    <div className="text-base font-semibold" style={{ color: 'var(--text-primary)' }}>
                      {(metadata.width / metadata.height).toFixed(2)}:1
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </ToolShell>
  );
}

