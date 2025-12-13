import { useState, useCallback, useEffect } from 'react';
import OutputPanel from '@/components/common/OutputPanel';

export default function HtaccessGenerator() {
  const [rules, setRules] = useState({
    https: false,
    www: false,
    gzip: false,
    cache: false,
    cors: false,
    customDomain: ''
  });
  const [output, setOutput] = useState('');

  const generate = useCallback(() => {
    const lines: string[] = [];

    if (rules.https) {
      lines.push('# Force HTTPS');
      lines.push('RewriteEngine On');
      lines.push('RewriteCond %{HTTPS} off');
      lines.push('RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]');
      lines.push('');
    }

    if (rules.www) {
      lines.push('# Force WWW');
      lines.push('RewriteEngine On');
      lines.push('RewriteCond %{HTTP_HOST} !^www\\.');
      lines.push('RewriteRule ^(.*)$ https://www.%{HTTP_HOST}%{REQUEST_URI} [L,R=301]');
      lines.push('');
    }

    if (rules.gzip) {
      lines.push('# Enable Gzip Compression');
      lines.push('<IfModule mod_deflate.c>');
      lines.push('  AddOutputFilterByType DEFLATE text/html text/plain text/xml text/css text/javascript application/javascript application/json');
      lines.push('</IfModule>');
      lines.push('');
    }

    if (rules.cache) {
      lines.push('# Browser Caching');
      lines.push('<IfModule mod_expires.c>');
      lines.push('  ExpiresActive On');
      lines.push('  ExpiresByType image/jpg "access plus 1 year"');
      lines.push('  ExpiresByType image/jpeg "access plus 1 year"');
      lines.push('  ExpiresByType image/gif "access plus 1 year"');
      lines.push('  ExpiresByType image/png "access plus 1 year"');
      lines.push('  ExpiresByType text/css "access plus 1 month"');
      lines.push('  ExpiresByType application/javascript "access plus 1 month"');
      lines.push('</IfModule>');
      lines.push('');
    }

    if (rules.cors) {
      lines.push('# CORS Headers');
      lines.push('<IfModule mod_headers.c>');
      lines.push('  Header set Access-Control-Allow-Origin "*"');
      lines.push('  Header set Access-Control-Allow-Methods "GET, POST, OPTIONS"');
      lines.push('  Header set Access-Control-Allow-Headers "Content-Type"');
      lines.push('</IfModule>');
      lines.push('');
    }

    if (rules.customDomain) {
      lines.push('# Custom Domain Redirect');
      lines.push('RewriteEngine On');
      lines.push(`RewriteCond %{HTTP_HOST} !^${rules.customDomain.replace(/\./g, '\\.')}$`);
      lines.push(`RewriteRule ^(.*)$ https://${rules.customDomain}%{REQUEST_URI} [L,R=301]`);
    }

    setOutput(lines.join('\n'));
  }, [rules]);

  useEffect(() => {
    generate();
  }, [generate]);

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={rules.https}
            onChange={(e) => { setRules({ ...rules, https: e.target.checked }); generate(); }}
            className="checkbox"
          />
          <span>Force HTTPS</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={rules.www}
            onChange={(e) => { setRules({ ...rules, www: e.target.checked }); generate(); }}
            className="checkbox"
          />
          <span>Force WWW</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={rules.gzip}
            onChange={(e) => { setRules({ ...rules, gzip: e.target.checked }); generate(); }}
            className="checkbox"
          />
          <span>Enable Gzip Compression</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={rules.cache}
            onChange={(e) => { setRules({ ...rules, cache: e.target.checked }); generate(); }}
            className="checkbox"
          />
          <span>Enable Browser Caching</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={rules.cors}
            onChange={(e) => { setRules({ ...rules, cors: e.target.checked }); generate(); }}
            className="checkbox"
          />
          <span>Enable CORS</span>
        </label>
        <div>
          <label className="label">Custom Domain (optional)</label>
          <input
            type="text"
            value={rules.customDomain}
            onChange={(e) => { setRules({ ...rules, customDomain: e.target.value }); generate(); }}
            placeholder="example.com"
            className="input-base"
          />
        </div>
      </div>

      {output && (
        <OutputPanel
          value={output}
          label=".htaccess Configuration"
          language="apache"
          showLineNumbers
        />
      )}
    </div>
  );
}

