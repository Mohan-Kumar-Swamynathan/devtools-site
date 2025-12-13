import { useState, useEffect } from 'react';
import { Copy, Download, Share2, Maximize2, Minimize2 } from 'lucide-react';
import clsx from 'clsx';

interface Props {
  onCopy?: () => void;
  onDownload?: () => void;
  onShare?: () => void;
  onFullscreen?: () => void;
  isFullscreen?: boolean;
  copyText?: string;
  downloadFilename?: string;
  className?: string;
}

export default function QuickActions({
  onCopy,
  onDownload,
  onShare,
  onFullscreen,
  isFullscreen = false,
  copyText,
  downloadFilename,
  className = ''
}: Props) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (onCopy) {
      onCopy();
    } else if (copyText) {
      try {
        await navigator.clipboard.writeText(copyText);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (e) {
        console.error('Failed to copy:', e);
      }
    }
  };

  const handleShare = async () => {
    if (onShare) {
      onShare();
    } else if (navigator.share && copyText) {
      try {
        await navigator.share({
          title: 'DevTools Output',
          text: copyText
        });
      } catch (e) {
        // User cancelled or share failed
      }
    }
  };

  return (
    <div className={clsx('flex items-center gap-2', className)}>
      {onCopy || copyText ? (
        <button
          onClick={handleCopy}
          className="btn-icon p-2"
          title={copied ? 'Copied!' : 'Copy'}
          aria-label="Copy"
        >
          {copied ? (
            <span className="text-green-500 text-xs">✓</span>
          ) : (
            <Copy size={16} />
          )}
        </button>
      ) : null}
      
      {onDownload || downloadFilename ? (
        <button
          onClick={onDownload}
          className="btn-icon p-2"
          title="Download"
          aria-label="Download"
        >
          <Download size={16} />
        </button>
      ) : null}
      
      {(onShare || (navigator.share && copyText)) && (
        <button
          onClick={handleShare}
          className="btn-icon p-2"
          title="Share"
          aria-label="Share"
        >
          <Share2 size={16} />
        </button>
      )}
      
      {onFullscreen && (
        <button
          onClick={onFullscreen}
          className="btn-icon p-2"
          title={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
          aria-label={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
        >
          {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
        </button>
      )}
    </div>
  );
}

