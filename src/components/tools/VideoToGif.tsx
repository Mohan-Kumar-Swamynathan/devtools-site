import { useState, useRef, useCallback } from 'react';
import { Upload, Download, Trash2, Play } from 'lucide-react';
import ErrorMessage from '@/components/common/ErrorMessage';
import LoadingSpinner from '@/components/common/LoadingSpinner';
// @ts-ignore
import GIF from 'gif.js';
import ToolShell from './ToolShell';
import { useToast } from '@/hooks/useToast';

export default function VideoToGif() {
  const [video, setVideo] = useState<HTMLVideoElement | null>(null);
  const [videoUrl, setVideoUrl] = useState<string>('');
  const [gifUrl, setGifUrl] = useState<string>('');
  const [startTime, setStartTime] = useState(0);
  const [endTime, setEndTime] = useState(5);
  const [frameRate, setFrameRate] = useState(10);
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
      setEndTime(Math.min(10, videoElement.duration));
      if (videoRef.current) {
        videoRef.current.src = url;
      }
    };
    
    videoElement.onerror = () => {
      setError('Failed to load video');
      URL.revokeObjectURL(url);
    };
  }, []);

  const createGif = useCallback(async () => {
    if (!video) return;

    setIsProcessing(true);
    setError('');

    try {
      const duration = endTime - startTime;
      const frameCount = Math.floor(duration * (frameRate / 1));
      const frameInterval = duration / frameCount;

      const gif = new GIF({
        workers: 2,
        quality: 10,
        width: video.videoWidth,
        height: video.videoHeight,
      });

      const tempVideo = document.createElement('video');
      tempVideo.src = videoUrl;
      tempVideo.muted = true;

      for (let i = 0; i < frameCount; i++) {
        const time = startTime + i * frameInterval;
        await new Promise<void>((resolve) => {
          tempVideo.currentTime = time;
          tempVideo.onseeked = () => {
            const canvas = document.createElement('canvas');
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            const ctx = canvas.getContext('2d');
            if (ctx) {
              ctx.drawImage(tempVideo, 0, 0);
              gif.addFrame(canvas, { delay: 1000 / frameRate });
            }
            resolve();
          };
        });
      }

      gif.on('finished', (blob: Blob) => {
        const url = URL.createObjectURL(blob);
        setGifUrl(url);
        setIsProcessing(false);
      });

      gif.render();
    } catch (e) {
      setError(`GIF creation error: ${(e as Error).message}`);
      setIsProcessing(false);
    }
  }, [video, videoUrl, startTime, endTime, frameRate]);

  const handleDownload = useCallback(() => {
    if (!gifUrl) return;
    const link = document.createElement('a');
    link.href = gifUrl;
    link.download = 'video-to-gif.gif';
    link.click();
  }, [gifUrl]);

  const handleReset = useCallback(() => {
    setVideo(null);
    if (videoUrl) URL.revokeObjectURL(videoUrl);
    if (gifUrl) URL.revokeObjectURL(gifUrl);
    setVideoUrl('');
    setGifUrl('');
    setStartTime(0);
    setEndTime(5);
    setFrameRate(10);
    setError('');
  }, [videoUrl, gifUrl]);

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
        {gifUrl && (
          <button
            onClick={handleDownload}
            disabled={isProcessing}
            className="btn-secondary flex items-center gap-2"
          >
            <Download size={18} />
            Download GIF
          </button>
        )}
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
            <div className="mt-4 space-y-4">
              <div>
                <label className="label">Start Time: {formatTime(startTime)}</label>
                <input
                  type="range"
                  min="0"
                  max={video.duration || 0}
                  step="0.1"
                  value={startTime}
                  onChange={(e) => {
                    const newStart = parseFloat(e.target.value);
                    setStartTime(newStart);
                    if (newStart >= endTime) {
                      setEndTime(Math.min(newStart + 5, video.duration || 0));
                    }
                  }}
                  className="w-full"
                />
              </div>
              <div>
                <label className="label">End Time: {formatTime(endTime)}</label>
                <input
                  type="range"
                  min="0"
                  max={video.duration || 0}
                  step="0.1"
                  value={endTime}
                  onChange={(e) => {
                    const newEnd = parseFloat(e.target.value);
                    setEndTime(newEnd);
                    if (newEnd <= startTime) {
                      setStartTime(Math.max(0, newEnd - 5));
                    }
                  }}
                  className="w-full"
                />
                <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
                  Duration: {formatTime(endTime - startTime)} | Video: {formatTime(video.duration || 0)}
                </p>
              </div>
              <div>
                <label className="label">Frame Rate: {frameRate} fps</label>
                <input
                  type="range"
                  min="5"
                  max="30"
                  step="1"
                  value={frameRate}
                  onChange={(e) => setFrameRate(parseInt(e.target.value))}
                  className="w-full"
                />
                <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
                  Higher = smoother but larger file
                </p>
              </div>
              <button
                onClick={createGif}
                disabled={isProcessing}
                className="btn-primary w-full flex items-center justify-center gap-2"
              >
                {isProcessing ? (
                  <>
                    <LoadingSpinner size="sm" />
                    Creating GIF...
                  </>
                ) : (
                  <>
                    <Play size={18} />
                    Create GIF
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {gifUrl && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
            Created GIF
          </h3>
          <div className="p-4 rounded-xl border" style={{
            backgroundColor: 'var(--bg-secondary)',
            borderColor: 'var(--border-primary)'
          }}>
            <img
              src={gifUrl}
              alt="Created GIF"
              className="w-full max-w-md mx-auto rounded-lg"
            />
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
          <li>• Select a time range to convert (shorter = faster processing)</li>
          <li>• Higher frame rate = smoother animation but larger file</li>
          <li>• Recommended: 5-10 seconds at 10-15 fps for best results</li>
          <li>• Processing may take a while for longer videos</li>
        </ul>
      </div>
    </ToolShell>
  );
}

