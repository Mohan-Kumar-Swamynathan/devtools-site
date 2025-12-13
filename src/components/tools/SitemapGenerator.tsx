import { useState, useCallback } from 'react';
import CodeEditor from '@/components/common/CodeEditor';
import OutputPanel from '@/components/common/OutputPanel';

export default function SitemapGenerator() {
  const [urls, setUrls] = useState('');
  const [changefreq, setChangefreq] = useState('weekly');
  const [priority, setPriority] = useState('0.8');
  const [output, setOutput] = useState('');

  const generate = useCallback(() => {
    const urlList = urls.split('\n').filter(u => u.trim());
    const now = new Date().toISOString();
    
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlList.map(url => `  <url>
    <loc>${url.trim()}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`).join('\n')}
</urlset>`;

    setOutput(xml);
  }, [urls, changefreq, priority]);

  return (
    <div className="space-y-6">
      <CodeEditor
        value={urls}
        onChange={setUrls}
        language="text"
        label="URLs (one per line)"
        placeholder="https://example.com/
https://example.com/about
https://example.com/contact"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="label">Change Frequency</label>
          <select value={changefreq} onChange={(e) => setChangefreq(e.target.value)} className="input-base">
            <option value="always">Always</option>
            <option value="hourly">Hourly</option>
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
            <option value="yearly">Yearly</option>
            <option value="never">Never</option>
          </select>
        </div>
        <div>
          <label className="label">Priority (0.0 - 1.0)</label>
          <input
            type="number"
            min="0"
            max="1"
            step="0.1"
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            className="input-base"
          />
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <button onClick={generate} disabled={!urls} className="btn-primary">
          Generate Sitemap
        </button>
        <button onClick={() => { setUrls(''); setOutput(''); }} className="btn-ghost">
          Clear
        </button>
      </div>

      {output && (
        <OutputPanel
          value={output}
          label="sitemap.xml"
          language="xml"
          showLineNumbers
        />
      )}
    </div>
  );
}

