import { useState, useCallback } from 'react';
import CodeEditor from '@/components/common/CodeEditor';
import OutputPanel from '@/components/common/OutputPanel';

export default function UserAgentParser() {
  const [input, setInput] = useState('');
  const [result, setResult] = useState<any>(null);

  const parse = useCallback(() => {
    const ua = input.trim();
    if (!ua) {
      setResult(null);
      return;
    }

    const parsed: any = {
      raw: ua
    };

    // Browser detection
    if (ua.includes('Chrome') && !ua.includes('Edg')) {
      parsed.browser = 'Chrome';
      const match = ua.match(/Chrome\/(\d+)/);
      if (match) parsed.browserVersion = match[1];
    } else if (ua.includes('Firefox')) {
      parsed.browser = 'Firefox';
      const match = ua.match(/Firefox\/(\d+)/);
      if (match) parsed.browserVersion = match[1];
    } else if (ua.includes('Safari') && !ua.includes('Chrome')) {
      parsed.browser = 'Safari';
      const match = ua.match(/Version\/(\d+)/);
      if (match) parsed.browserVersion = match[1];
    } else if (ua.includes('Edg')) {
      parsed.browser = 'Edge';
      const match = ua.match(/Edg\/(\d+)/);
      if (match) parsed.browserVersion = match[1];
    }

    // OS detection
    if (ua.includes('Windows')) {
      parsed.os = 'Windows';
      if (ua.includes('Windows NT 10.0')) parsed.osVersion = '10/11';
      else if (ua.includes('Windows NT 6.3')) parsed.osVersion = '8.1';
      else if (ua.includes('Windows NT 6.2')) parsed.osVersion = '8';
    } else if (ua.includes('Mac OS X')) {
      parsed.os = 'macOS';
      const match = ua.match(/Mac OS X (\d+[._]\d+)/);
      if (match) parsed.osVersion = match[1].replace('_', '.');
    } else if (ua.includes('Linux')) {
      parsed.os = 'Linux';
    } else if (ua.includes('Android')) {
      parsed.os = 'Android';
      const match = ua.match(/Android (\d+[.\d]*)/);
      if (match) parsed.osVersion = match[1];
    } else if (ua.includes('iPhone') || ua.includes('iPad')) {
      parsed.os = 'iOS';
      const match = ua.match(/OS (\d+[._]\d+)/);
      if (match) parsed.osVersion = match[1].replace('_', '.');
    }

    // Device type
    if (ua.includes('Mobile')) {
      parsed.device = 'Mobile';
    } else if (ua.includes('Tablet') || ua.includes('iPad')) {
      parsed.device = 'Tablet';
    } else {
      parsed.device = 'Desktop';
    }

    setResult(parsed);
  }, [input]);

  return (
    <div className="space-y-6">
      <CodeEditor
        value={input}
        onChange={(v) => { setInput(v); parse(); }}
        language="text"
        label="User-Agent String"
        placeholder="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
      />

      {result && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {result.browser && (
              <div className="p-3 rounded-lg border" style={{ borderColor: 'var(--border-primary)' }}>
                <div className="text-sm" style={{ color: 'var(--text-muted)' }}>Browser</div>
                <div className="font-medium">{result.browser} {result.browserVersion || ''}</div>
              </div>
            )}
            {result.os && (
              <div className="p-3 rounded-lg border" style={{ borderColor: 'var(--border-primary)' }}>
                <div className="text-sm" style={{ color: 'var(--text-muted)' }}>Operating System</div>
                <div className="font-medium">{result.os} {result.osVersion || ''}</div>
              </div>
            )}
            {result.device && (
              <div className="p-3 rounded-lg border" style={{ borderColor: 'var(--border-primary)' }}>
                <div className="text-sm" style={{ color: 'var(--text-muted)' }}>Device</div>
                <div className="font-medium">{result.device}</div>
              </div>
            )}
          </div>
          <OutputPanel
            value={JSON.stringify(result, null, 2)}
            label="Parsed Details"
            language="json"
            showLineNumbers
          />
        </div>
      )}
    </div>
  );
}

