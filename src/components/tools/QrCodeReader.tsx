import { useState, useRef, useCallback, useEffect } from 'react';
import { Upload, Camera, X, CheckCircle, Loader } from 'lucide-react';
import ErrorMessage from '@/components/common/ErrorMessage';
import OutputPanel from '@/components/common/OutputPanel';
import jsQR from 'jsqr';

export default function QrCodeReader() {
  const [result, setResult] = useState<string>('');
  const [error, setError] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const scanIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const scanQRFromImage = useCallback(async (file: File) => {
    setError('');
    setResult('');
    setIsProcessing(true);

    const reader = new FileReader();
    reader.onload = async (e) => {
      const dataUrl = e.target?.result as string;
      setImagePreview(dataUrl);

      // Create image element
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d', { willReadFrequently: true });
        
        if (!ctx) {
          setError('Could not get canvas context');
          setIsProcessing(false);
          return;
        }

        ctx.drawImage(img, 0, 0);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

        // Decode QR code using jsQR
        try {
          const code = jsQR(imageData.data, imageData.width, imageData.height, {
            inversionAttempts: 'dontInvert'
          });

          if (code) {
            setResult(code.data);
            setError('');
          } else {
            setError('No QR code found in the image. Make sure the QR code is clear and well-lit.');
          }
        } catch (e) {
          setError('Failed to decode QR code. Make sure the image contains a clear QR code.');
        } finally {
          setIsProcessing(false);
        }
      };

      img.onerror = () => {
        setError('Failed to load image');
        setIsProcessing(false);
      };
      img.src = dataUrl;
    };

    reader.onerror = () => {
      setError('Failed to read file');
      setIsProcessing(false);
    };
    reader.readAsDataURL(file);
  }, []);

  const startCameraScan = useCallback(async () => {
    setError('');
    setResult('');

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        setIsScanning(true);

        // Start scanning
        const scan = () => {
          if (!videoRef.current) return;

          const video = videoRef.current;
          if (video.readyState === video.HAVE_ENOUGH_DATA && video.videoWidth > 0 && video.videoHeight > 0) {
            const canvas = document.createElement('canvas');
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            const ctx = canvas.getContext('2d', { willReadFrequently: true });
            
            if (ctx) {
              ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
              const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

              // Decode QR code using jsQR
              try {
                const code = jsQR(imageData.data, imageData.width, imageData.height, {
                  inversionAttempts: 'dontInvert'
                });

                if (code) {
                  setResult(code.data);
                  setError('');
                  stopCameraScan();
                }
              } catch (e) {
                // Continue scanning on error
              }
            }
          }
        };

        scanIntervalRef.current = setInterval(scan, 200);
      }
    } catch (e: any) {
      if (e.name === 'NotAllowedError') {
        setError('Camera permission denied. Please allow camera access.');
      } else if (e.name === 'NotFoundError') {
        setError('No camera found. Please use image upload instead.');
      } else {
        setError(`Camera error: ${e.message}`);
      }
      setIsScanning(false);
    }
  }, []);

  const stopCameraScan = useCallback(() => {
    if (scanIntervalRef.current) {
      clearInterval(scanIntervalRef.current);
      scanIntervalRef.current = null;
    }

    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }

    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }

    setIsScanning(false);
  }, []);

  useEffect(() => {
    return () => {
      stopCameraScan();
    };
  }, [stopCameraScan]);

  return (
    <div className="space-y-6">
      {error && <ErrorMessage message={error} onDismiss={() => setError('')} />}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="label">Upload QR Code Image</label>
          <div
            className="border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors hover:border-[var(--brand-primary)]"
            style={{ borderColor: 'var(--border-primary)' }}
            onClick={() => fileInputRef.current?.click()}
          >
            {imagePreview ? (
              <div className="space-y-3">
                <div className="relative">
                  <img
                    src={imagePreview}
                    alt="QR Code"
                    className="max-w-full max-h-48 mx-auto rounded-lg"
                  />
                  {isProcessing && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-lg">
                      <Loader className="animate-spin" size={32} style={{ color: 'white' }} />
                    </div>
                  )}
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setImagePreview(null);
                    setResult('');
                    setError('');
                  }}
                  className="btn-ghost btn-sm"
                >
                  <X size={14} className="mr-1" />
                  Remove
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                <Upload size={48} className="mx-auto" style={{ color: 'var(--text-muted)' }} />
                <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
                  Click to upload QR code image
                </p>
              </div>
            )}
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) scanQRFromImage(file);
            }}
            className="hidden"
          />
        </div>

        <div>
          <label className="label">Scan with Camera</label>
          <div className="space-y-3">
            {!isScanning ? (
              <button
                onClick={startCameraScan}
                className="btn-primary w-full flex items-center justify-center gap-2"
              >
                <Camera size={18} />
                Start Camera Scanner
              </button>
            ) : (
              <div className="space-y-3">
                <div className="relative rounded-xl overflow-hidden border" style={{ borderColor: 'var(--border-primary)' }}>
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    className="w-full h-64 object-cover"
                  />
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="border-2 border-white rounded-lg w-48 h-48" />
                  </div>
                </div>
                <button
                  onClick={stopCameraScan}
                  className="btn-primary w-full bg-red-500 hover:bg-red-600"
                >
                  Stop Scanning
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {result && (
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <CheckCircle size={20} className="text-green-500" />
            <label className="label mb-0">Decoded QR Code</label>
          </div>
          <OutputPanel
            value={result}
            language="text"
            showLineNumbers={false}
          />
          <div className="flex gap-2">
            {result.match(/^https?:\/\//i) ? (
              <a
                href={result}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary btn-sm flex items-center gap-1"
              >
                <CheckCircle size={14} />
                Open URL
              </a>
            ) : null}
            <button
              onClick={async () => {
                try {
                  await navigator.clipboard.writeText(result);
                } catch (e) {
                  setError('Failed to copy');
                }
              }}
              className="btn-primary btn-sm"
            >
              Copy Result
            </button>
          </div>
        </div>
      )}

      {!result && !isScanning && !isProcessing && (
        <div className="p-4 rounded-xl border text-sm" style={{ 
          backgroundColor: 'var(--bg-secondary)', 
          borderColor: 'var(--border-primary)' 
        }}>
          <h3 className="font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
            How to Use:
          </h3>
          <ul className="space-y-1 text-xs" style={{ color: 'var(--text-muted)' }}>
            <li>• <strong>Upload Image:</strong> Select a QR code image file (PNG, JPG, etc.)</li>
            <li>• <strong>Camera Scanner:</strong> Use your device camera to scan QR codes in real-time</li>
            <li>• <strong>Tips:</strong> Ensure QR code is clear, well-lit, and not distorted</li>
            <li>• <strong>Privacy:</strong> All processing happens in your browser - no data is sent to servers</li>
          </ul>
        </div>
      )}
    </div>
  );
}

