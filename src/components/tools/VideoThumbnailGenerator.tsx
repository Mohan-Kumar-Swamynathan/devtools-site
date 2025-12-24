import { useState, useRef, useCallback } from 'react';
import { Upload, Download, Trash2, Image as ImageIcon } from 'lucide-react';
import ErrorMessage from '@/components/common/ErrorMessage';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import ToolShell from './ToolShell';
import { useToast } from '@/hooks/useToast';

interface Thumbnail {
  dataUrl: string;
  time: number;
  blob: Blob;
}

export default function VideoThumbnailGenerator() {
  const [video, setVideo] = useState<HTMLVideoElement | null>(null);
  const [videoUrl, setVideoUrl] = useState<string>('');
  const [thumbnails, setThumbnails] = useState<Thumbnail[]>([]);
  const [thumbnailTime, setThumbnailTime] = useState(0);
  const [thumbnailSize, setThumbnailSize] = useState(320);
  const [isProcessing, setIsProcessing] = useState(false);
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
    };
    
    videoElement.onerror = () => {
      setError('Failed to load video');
      URL.revokeObjectURL(url);
    };
  }, []);

  const generateThumbnail = useCallback((time: number): Promise<Thumbnail> => {
    return new Promise((resolve, reject) => {
      if (!video) {
        reject(new Error('No video loaded'));
        return;
      }

      const canvas = document.createElement('canvas');
      const aspectRatio = video.videoWidth / video.videoHeight;
      canvas.width = thumbnailSize;
      canvas.height = thumbnailSize / aspectRatio;

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Could not get canvas context'));
        return;
      }

      const tempVideo = document.createElement('video');
      tempVideo.src = videoUrl;
      tempVideo.currentTime = time;

      tempVideo.onseeked = () => {
        ctx.drawImage(tempVideo, 0, 0, canvas.width, canvas.height);
        canvas.toBlob((blob) => {
          if (!blob) {
            reject(new Error('Failed to create thumbnail'));
            return;
          }
          const dataUrl = canvas.toDataURL('image/png');
          resolve({
            dataUrl,
            time,
            blob,
          });
        }, 'image/png');
      };

      tempVideo.onerror = () => {
        reject(new Error('Failed to seek video'));
      };
    });
  }, [video, videoUrl, thumbnailSize]);

  const handleGenerateThumbnail = useCallback(async () => {
    if (!video) return;

    setIsProcessing(true);
    setError('');

    try {
      const thumbnail = await generateThumbnail(thumbnailTime);
      setThumbnails(prev => [...prev, thumbnail]);
    } catch (e) {
      setError(`Generation error: ${(e as Error).message}`);
    } finally {
      setIsProcessing(false);
    }
  }, [video, thumbnailTime, generateThumbnail]);

  const handleGenerateGrid = useCallback(async () => {
    if (!video) return;

    setIsProcessing(true);
    setError('');

    try {
      const duration = video.duration;
      const count = 9;
      const interval = duration / (count + 1);
      const times = Array.from({ length: count }, (_, i) => (i + 1) * interval);

      const generatedThumbnails = await Promise.all(
        times.map(time => generateThumbnail(time))
      );

      setThumbnails(generatedThumbnails);
    } catch (e) {
      setError(`Generation error: ${(e as Error).message}`);
    } finally {
      setIsProcessing(false);
    }
  }, [video, generateThumbnail]);

  const handleDownloadThumbnail = useCallback((thumbnail: Thumbnail) => {
    const link = document.createElement('a');
    link.href = thumbnail.dataUrl;
    link.download = `thumbnail-${thumbnail.time.toFixed(2)}s.png`;
    link.click();
  }, []);

  const handleDownloadAll = useCallback(() => {
    thumbnails.forEach((thumbnail, index) => {
      setTimeout(() => handleDownloadThumbnail(thumbnail), index * 100);
    });
  }, [thumbnails, handleDownloadThumbnail]);

  const handleReset = useCallback(() => {
    setVideo(null);
    if (videoUrl) URL.revokeObjectURL(videoUrl);
    setVideoUrl('');
    setThumbnails([]);
    setThumbnailTime(0);
    setError('');
  }, [videoUrl]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  
  const controls = (
          <div className="flex items-center gap-3">
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={isProcessing}
          className="btn-primary flex items-center gap-2"
        >
          <Upload size={18} />
          Select Video
        </button>
        {thumbnails.length > 0 && (
          <>
            <button
              onClick={handleDownloadAll}
              disabled={isProcessing}
              className="btn-secondary flex items-center gap-2"
            >
              <Download size={18} />
              Download All ({thumbnails.length})
            </button>
            <button
              onClick={handleReset}
              className="btn-ghost flex items-center gap-2"
            >
              <Trash2 size={18} />
              Clear
            </button>
          </>
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
            <div className="mt-4 space-y-4">
              <div>
                <label className="label">Thumbnail Time: {formatTime(thumbnailTime)}</label>
                <input
                  type="range"
                  min="0"
                  max={video.duration || 0}
                  step="0.1"
                  value={thumbnailTime}
                  onChange={(e) => setThumbnailTime(parseFloat(e.target.value))}
                  className="w-full"
                />
                <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
                  Duration: {formatTime(video.duration || 0)}
                </p>
              </div>
              <div>
                <label className="label">Thumbnail Size: {thumbnailSize}px</label>
                <input
                  type="range"
                  min="100"
                  max="800"
                  step="20"
                  value={thumbnailSize}
                  onChange={(e) => setThumbnailSize(parseInt(e.target.value))}
                  className="w-full"
                />
              </div>
              <div className="flex gap-3">
                <button
                  onClick={handleGenerateThumbnail}
                  disabled={isProcessing}
                  className="btn-secondary flex items-center gap-2"
                >
                  <ImageIcon size={18} />
                  Generate Thumbnail
                </button>
                <button
                  onClick={handleGenerateGrid}
                  disabled={isProcessing}
                  className="btn-secondary flex items-center gap-2"
                >
                  <ImageIcon size={18} />
                  Generate Grid (9)
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {thumbnails.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
            Generated Thumbnails ({thumbnails.length})
          </h3>
          <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {thumbnails.map((thumbnail, index) => (
              <div
                key={index}
                className="p-3 rounded-xl border animate-fade-in-scale"
                style={{
                  backgroundColor: 'var(--bg-secondary)',
                  borderColor: 'var(--border-primary)'
                }}
              >
                <img
                  src={thumbnail.dataUrl}
                  alt={`Thumbnail at ${formatTime(thumbnail.time)}`}
                  className="w-full h-32 object-cover rounded-lg mb-2"
                />
                <div className="text-xs text-center mb-2" style={{ color: 'var(--text-muted)' }}>
                  {formatTime(thumbnail.time)}
                </div>
                <button
                  onClick={() => handleDownloadThumbnail(thumbnail)}
                  className="btn-primary w-full btn-sm"
                >
                  <Download size={14} className="mr-1" />
                  Download
                </button>
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
          <li>• Generate a single thumbnail at a specific time</li>
          <li>• Generate a grid of 9 thumbnails evenly spaced</li>
          <li>• Adjust thumbnail size for different use cases</li>
          <li>• Thumbnails are saved as PNG images</li>
        </ul>
      </div>
    </ToolShell>
  );
}

