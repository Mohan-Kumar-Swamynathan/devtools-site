import { useState, useCallback, useEffect } from 'react';
import { Copy, Info } from 'lucide-react';
import { useToast } from '@/hooks/useToast';

export default function UserAgentParser() {
  const [userAgent, setUserAgent] = useState('');
  const [parsed, setParsed] = useState<any>(null);
  const { showToast } = useToast();

  useEffect(() => {
    setUserAgent(navigator.userAgent);
    parseUserAgent(navigator.userAgent);
  }, []);

  const parseUserAgent = useCallback((ua: string) => {
    const info: any = {
      raw: ua,
      browser: 'Unknown',
      browserVersion: 'Unknown',
      os: 'Unknown',
      device: 'Desktop',
      engine: 'Unknown',
    };

    if (ua.includes('Chrome') && !ua.includes('Edg')) {
      const match = ua.match(/Chrome\/([\d.]+)/);
      info.browser = 'Chrome';
      info.browserVersion = match ? match[1] : 'Unknown';
      info.engine = 'Blink';
    } else if (ua.includes('Firefox')) {
      const match = ua.match(/Firefox\/([\d.]+)/);
      info.browser = 'Firefox';
      info.browserVersion = match ? match[1] : 'Unknown';
      info.engine = 'Gecko';
    } else if (ua.includes('Safari') && !ua.includes('Chrome')) {
      const match = ua.match(/Version\/([\d.]+)/);
      info.browser = 'Safari';
      info.browserVersion = match ? match[1] : 'Unknown';
      info.engine = 'WebKit';
    } else if (ua.includes('Edg')) {
      const match = ua.match(/Edg\/([\d.]+)/);
      info.browser = 'Edge';
      info.browserVersion = match ? match[1] : 'Unknown';
      info.engine = 'Blink';
    }

    if (ua.includes('Windows')) info.os = 'Windows';
    else if (ua.includes('Mac OS')) info.os = 'macOS';
    else if (ua.includes('Linux')) info.os = 'Linux';
    else if (ua.includes('Android')) {
      info.os = 'Android';
      info.device = 'Mobile';
    } else if (ua.includes('iPhone') || ua.includes('iPad')) {
      info.os = 'iOS';
      info.device = ua.includes('iPad') ? 'Tablet' : 'Mobile';
    }

    setParsed(info);
  }, []);

  const handleParse = useCallback(() => {
    if (!userAgent.trim()) {
      showToast('Please enter a user agent string', 'error');
      return;
    }
    parseUserAgent(userAgent);
  }, [userAgent, parseUserAgent, showToast]);

  const handleCopy = useCallback(() => {
    if (parsed) {
      const text = JSON.stringify(parsed, null, 2);
      navigator.clipboard.writeText(text).then(() => {
        showToast('Copied to clipboard!', 'success');
      });
    }
  }, [parsed, showToast]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-3">
        <button
          onClick={handleParse}
          className="btn-primary flex items-center gap-2"
        >
          <Info size={18} />
          Parse User Agent
        </button>
        {parsed && (
          <button
            onClick={handleCopy}
            className="btn-secondary flex items-center gap-2"
          >
            <Copy size={18} />
            Copy JSON
          </button>
        )}
      </div>

      <div className="space-y-4">
        <div>
          <label className="label">User Agent String</label>
          <textarea
            value={userAgent}
            onChange={(e) => setUserAgent(e.target.value)}
            className="input w-full h-24 font-mono text-sm"
            placeholder="Enter user agent string..."
          />
        </div>

        {parsed && (
          <div className="p-4 rounded-xl border space-y-3" style={{
            backgroundColor: 'var(--bg-secondary)',
            borderColor: 'var(--border-primary)'
          }}>
            <h3 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
              Parsed Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div className="text-sm font-medium mb-1" style={{ color: 'var(--text-muted)' }}>
                  Browser
                </div>
                <div className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
                  {parsed.browser} {parsed.browserVersion}
                </div>
              </div>
              <div>
                <div className="text-sm font-medium mb-1" style={{ color: 'var(--text-muted)' }}>
                  Operating System
                </div>
                <div className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
                  {parsed.os}
                </div>
              </div>
              <div>
                <div className="text-sm font-medium mb-1" style={{ color: 'var(--text-muted)' }}>
                  Device
                </div>
                <div className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
                  {parsed.device}
                </div>
              </div>
              <div>
                <div className="text-sm font-medium mb-1" style={{ color: 'var(--text-muted)' }}>
                  Engine
                </div>
                <div className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
                  {parsed.engine}
                </div>
              </div>
            </div>
            <div className="mt-4">
              <div className="text-sm font-medium mb-2" style={{ color: 'var(--text-muted)' }}>
                Raw User Agent
              </div>
              <pre className="text-xs p-3 rounded bg-gray-100 dark:bg-gray-800 overflow-x-auto" style={{ color: 'var(--text-primary)' }}>
                {parsed.raw}
              </pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
