import { useState, useCallback } from 'react';
import OutputPanel from '@/components/common/OutputPanel';
import ToolShell from './ToolShell';
import { useToast } from '@/hooks/useToast';

export default function RobotsTxtGenerator() {
  const [userAgent, setUserAgent] = useState('*');
  const [allowPaths, setAllowPaths] = useState<string[]>(['']);
  const [disallowPaths, setDisallowPaths] = useState<string[]>(['/admin', '/private']);
  const [sitemap, setSitemap] = useState('');
  const [crawlDelay, setCrawlDelay] = useState('');
  const [output, setOutput] = useState('');

  const addPath = (type: 'allow' | 'disallow') => {
    if (type === 'allow') {
      setAllowPaths([...allowPaths, '']);
    } else {
      setDisallowPaths([...disallowPaths, '']);
    }
  };

  const updatePath = (type: 'allow' | 'disallow', index: number, value: string) => {
    if (type === 'allow') {
      const newPaths = [...allowPaths];
      newPaths[index] = value;
      setAllowPaths(newPaths);
    } else {
      const newPaths = [...disallowPaths];
      newPaths[index] = value;
      setDisallowPaths(newPaths);
    }
  };

  const removePath = (type: 'allow' | 'disallow', index: number) => {
    if (type === 'allow') {
      setAllowPaths(allowPaths.filter((_, i) => i !== index));
    } else {
      setDisallowPaths(disallowPaths.filter((_, i) => i !== index));
    }
  };

  const generate = useCallback(() => {
    const lines: string[] = [];
    
    lines.push(`User-agent: ${userAgent}`);
    
    allowPaths.filter(p => p.trim()).forEach(path => {
      lines.push(`Allow: ${path}`);
    });
    
    disallowPaths.filter(p => p.trim()).forEach(path => {
      lines.push(`Disallow: ${path}`);
    });
    
    if (crawlDelay) {
      lines.push(`Crawl-delay: ${crawlDelay}`);
    }
    
    if (sitemap) {
      lines.push('');
      lines.push(`Sitemap: ${sitemap}`);
    }

    setOutput(lines.join('\n'));
  }, [userAgent, allowPaths, disallowPaths, crawlDelay, sitemap]);

  
  const controls = (
          <div className="flex items-center gap-3">
        <button onClick={generate} className="btn-primary">
          Generate robots.txt
        </button>
        <button onClick={() => { setUserAgent('*'); setAllowPaths(['']); setDisallowPaths(['/admin', '/private']); setSitemap(''); setCrawlDelay(''); setOutput(''); }} className="btn-ghost">
          Reset
        </button>
      </div>
  );

  return (
    <ToolShell className="space-y-6" controls={controls}>
      <div>
        <label className="label">User-agent</label>
        <input
          type="text"
          value={userAgent}
          onChange={(e) => setUserAgent(e.target.value)}
          placeholder="*"
          className="input-base"
        />
      </div>

      <div>
        <label className="label">Allow Paths</label>
        <div className="space-y-2">
          {allowPaths.map((path, i) => (
            <div key={i} className="flex gap-2">
              <input
                type="text"
                value={path}
                onChange={(e) => updatePath('allow', i, e.target.value)}
                placeholder="/public"
                className="input-base flex-1"
              />
              <button onClick={() => removePath('allow', i)} className="btn-ghost">Remove</button>
            </div>
          ))}
          <button onClick={() => addPath('allow')} className="btn-secondary text-sm">+ Add Allow Path</button>
        </div>
      </div>

      <div>
        <label className="label">Disallow Paths</label>
        <div className="space-y-2">
          {disallowPaths.map((path, i) => (
            <div key={i} className="flex gap-2">
              <input
                type="text"
                value={path}
                onChange={(e) => updatePath('disallow', i, e.target.value)}
                placeholder="/admin"
                className="input-base flex-1"
              />
              <button onClick={() => removePath('disallow', i)} className="btn-ghost">Remove</button>
            </div>
          ))}
          <button onClick={() => addPath('disallow')} className="btn-secondary text-sm">+ Add Disallow Path</button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="label">Crawl-delay (seconds)</label>
          <input
            type="number"
            value={crawlDelay}
            onChange={(e) => setCrawlDelay(e.target.value)}
            placeholder="Optional"
            className="input-base"
          />
        </div>
        <div>
          <label className="label">Sitemap URL</label>
          <input
            type="url"
            value={sitemap}
            onChange={(e) => setSitemap(e.target.value)}
            placeholder="https://example.com/sitemap.xml"
            className="input-base"
          />
        </div>
      </div>

{/* Controls moved to header */}








      {output && (
        <OutputPanel
          value={output}
          label="robots.txt"
          language="text"
          showLineNumbers
        />
      )}
    </ToolShell>
  );
}

