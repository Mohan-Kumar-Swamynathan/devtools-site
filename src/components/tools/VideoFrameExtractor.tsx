import { useState, useRef, useCallback } from 'react';
import { Upload, Download, Trash2, Camera } from 'lucide-react';
import ErrorMessage from '@/components/common/ErrorMessage';
import LoadingSpinner from '@/components/common/LoadingSpinner';

interface ExtractedFrame {
  dataUrl: string;
  time: number;
  blob: Blob;
}

export default function VideoFrameExtractor() {
  const [video, setVideo] = useState<HTMLVideoElement | null>(null);
  const [videoUrl, setVideoUrl] = useState<string>('');
  const [frames, setFrames] = useState<ExtractedFrame[]>([]);
  const [extractTime, setExtractTime] = useState(0);
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

  const extractFrameAtTime = useCallback((time: number): Promise<ExtractedFrame> => {
    return new Promise((resolve, reject) => {
      if (!video) {
        reject(new Error('No video loaded'));
        return;
      }

      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Could not get canvas context'));
        return;
      }

      const tempVideo = document.createElement('video');
      tempVideo.src = videoUrl;
      tempVideo.currentTime = time;

      tempVideo.onseeked = () => {
        ctx.drawImage(tempVideo, 0, 0);
        canvas.toBlob((blob) => {
          if (!blob) {
            reject(new Error('Failed to create frame'));
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
  }, [video, videoUrl]);

  const handleExtractFrame = useCallback(async () => {
    if (!video) return;

    setIsProcessing(true);
    setError('');

    try {
      const frame = await extractFrameAtTime(extractTime);
      setFrames(prev => [...prev, frame]);
    } catch (e) {
      setError(`Extraction error: ${(e as Error).message}`);
    } finally {
      setIsProcessing(false);
    }
  }, [video, extractTime, extractFrameAtTime]);

  const handleExtractMultiple = useCallback(async () => {
    if (!video) return;

    setIsProcessing(true);
    setError('');

    try {
      const duration = video.duration;
      const interval = duration / 10;
      const times = Array.from({ length: 10 }, (_, i) => i * interval);

      const extractedFrames = await Promise.all(
        times.map(time => extractFrameAtTime(time))
      );

      setFrames(extractedFrames);
    } catch (e) {
      setError(`Extraction error: ${(e as Error).message}`);
    } finally {
      setIsProcessing(false);
    }
  }, [video, extractFrameAtTime]);

  const handleDownloadFrame = useCallback((frame: ExtractedFrame) => {
    const link = document.createElement('a');
    link.href = frame.dataUrl;
    link.download = `frame-${frame.time.toFixed(2)}s.png`;
    link.click();
  }, []);

  const handleDownloadAll = useCallback(() => {
    frames.forEach((frame, index) => {
      setTimeout(() => handleDownloadFrame(frame), index * 100);
    });
  }, [frames, handleDownloadFrame]);

  const handleReset = useCallback(() => {
    setVideo(null);
    if (videoUrl) URL.revokeObjectURL(videoUrl);
    setVideoUrl('');
    setFrames([]);
    setExtractTime(0);
    setError('');
  }, [videoUrl]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
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
          Select Video
        </button>
        {frames.length > 0 && (
          <>
            <button
              onClick={handleDownloadAll}
              disabled={isProcessing}
              className="btn-secondary flex items-center gap-2"
            >
              <Download size={18} />
              Download All ({frames.length})
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
                <label className="label">Extract at time: {formatTime(extractTime)}</label>
                <input
                  type="range"
                  min="0"
                  max={video.duration || 0}
                  step="0.1"
                  value={extractTime}
                  onChange={(e) => setExtractTime(parseFloat(e.target.value))}
                  className="w-full"
                />
                <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
                  Duration: {formatTime(video.duration || 0)}
                </p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={handleExtractFrame}
                  disabled={isProcessing}
                  className="btn-secondary flex items-center gap-2"
                >
                  <Camera size={18} />
                  Extract Frame
                </button>
                <button
                  onClick={handleExtractMultiple}
                  disabled={isProcessing}
                  className="btn-secondary flex items-center gap-2"
                >
                  <Camera size={18} />
                  Extract 10 Frames
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {frames.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
            Extracted Frames ({frames.length})
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {frames.map((frame, index) => (
              <div
                key={index}
                className="p-3 rounded-xl border animate-fade-in-scale"
                style={{
                  backgroundColor: 'var(--bg-secondary)',
                  borderColor: 'var(--border-primary)'
                }}
              >
                <img
                  src={frame.dataUrl}
                  alt={`Frame at ${formatTime(frame.time)}`}
                  className="w-full h-32 object-cover rounded-lg mb-2"
                />
                <div className="text-xs text-center mb-2" style={{ color: 'var(--text-muted)' }}>
                  {formatTime(frame.time)}
                </div>
                <button
                  onClick={() => handleDownloadFrame(frame)}
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
          <li>• Use the slider to navigate to a specific time in the video</li>
          <li>• Extract a single frame at the current time</li>
          <li>• Extract 10 frames evenly spaced throughout the video</li>
          <li>• Frames are saved as PNG images</li>
        </ul>
      </div>
    </div>
  );
}

