import { useState, useRef, useCallback } from 'react';
import { Upload, Trash2, Info } from 'lucide-react';
import ErrorMessage from '@/components/common/ErrorMessage';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import ToolShell from './ToolShell';
import { useToast } from '@/hooks/useToast';

interface VideoMetadata {
  duration: number;
  width: number;
  height: number;
  fileSize: number;
  fileType: string;
  videoCodec?: string;
  audioCodec?: string;
}

export default function VideoMetadataExtractor() {
  const [video, setVideo] = useState<HTMLVideoElement | null>(null);
  const [videoUrl, setVideoUrl] = useState<string>('');
  const [metadata, setMetadata] = useState<VideoMetadata | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = useCallback((files: FileList | null) => {
    if (!files || files.length === 0) return;

    const file = files[0];
    if (!file.type.startsWith('video/')) {
      setError('Please select a video file');
      return;
    }

    setError('');
    setIsLoading(true);
    const url = URL.createObjectURL(file);
    setVideoUrl(url);

    const videoElement = document.createElement('video');
    videoElement.src = url;
    videoElement.preload = 'metadata';
    
    videoElement.onloadedmetadata = () => {
      setVideo(videoElement);
      if (videoRef.current) {
        videoRef.current.src = url;
      }

      const metadata: VideoMetadata = {
        duration: videoElement.duration,
        width: videoElement.videoWidth,
        height: videoElement.videoHeight,
        fileSize: file.size,
        fileType: file.type,
      };

      setMetadata(metadata);
      setIsLoading(false);
    };
    
    videoElement.onerror = () => {
      setError('Failed to load video');
      URL.revokeObjectURL(url);
      setIsLoading(false);
    };
  }, []);

  const handleReset = useCallback(() => {
    setVideo(null);
    if (videoUrl) URL.revokeObjectURL(videoUrl);
    setVideoUrl('');
    setMetadata(null);
    setError('');
  }, [videoUrl]);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    if (hours > 0) {
      return `${hours}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) 

  return (bytes / 1024).toFixed(2) + ' KB';
    if (bytes < 1024 * 1024 * 1024) return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
    return (bytes / (1024 * 1024 * 1024)).toFixed(2) + ' GB';
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
              Select Video
            </>
          )}
        </button>
        {video && (
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
          accept="video/*"
          onChange={(e) => handleFileSelect(e.target.files)}
          className="hidden"
        />
      </div>
  );

  return (
    <ToolShell className="space-y-6" controls={controls}>
      {error && <ErrorMessage message={error} onDismiss={() => setError('')} />}

{/* Controls moved to header */}



































      {video && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
            Video Preview
          </h3>
          <div className="p-4 rounded-xl border" style={{
            backgroundColor: 'var(--bg-secondary)',
            borderColor: 'var(--border-primary)'
          }}>
            <video
              ref={videoRef}
              src={videoUrl}
              controls
              className="w-full rounded-lg"
            />
          </div>
        </div>
      )}

      {metadata && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
            <Info size={20} />
            Video Metadata
          </h3>
          <div className="p-4 rounded-xl border space-y-3" style={{
            backgroundColor: 'var(--bg-secondary)',
            borderColor: 'var(--border-primary)'
          }}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div className="text-sm font-medium mb-1" style={{ color: 'var(--text-muted)' }}>
                  Duration
                </div>
                <div className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
                  {formatTime(metadata.duration)}
                </div>
              </div>
              <div>
                <div className="text-sm font-medium mb-1" style={{ color: 'var(--text-muted)' }}>
                  Dimensions
                </div>
                <div className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
                  {metadata.width} × {metadata.height} px
                </div>
              </div>
              <div>
                <div className="text-sm font-medium mb-1" style={{ color: 'var(--text-muted)' }}>
                  File Size
                </div>
                <div className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
                  {formatSize(metadata.fileSize)}
                </div>
              </div>
              <div>
                <div className="text-sm font-medium mb-1" style={{ color: 'var(--text-muted)' }}>
                  File Type
                </div>
                <div className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
                  {metadata.fileType}
                </div>
              </div>
            </div>
            {metadata.videoCodec && (
              <div>
                <div className="text-sm font-medium mb-1" style={{ color: 'var(--text-muted)' }}>
                  Video Codec
                </div>
                <div className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
                  {metadata.videoCodec}
                </div>
              </div>
            )}
            {metadata.audioCodec && (
              <div>
                <div className="text-sm font-medium mb-1" style={{ color: 'var(--text-muted)' }}>
                  Audio Codec
                </div>
                <div className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
                  {metadata.audioCodec}
                </div>
              </div>
            )}
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
          <li>• Upload any video file to extract metadata</li>
          <li>• View duration, dimensions, file size, and format</li>
          <li>• Codec information may not be available for all videos</li>
          <li>• All processing happens in your browser</li>
        </ul>
      </div>
    </ToolShell>
  );
}

