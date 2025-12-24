import { useState, useCallback } from 'react';
import OutputPanel from '@/components/common/OutputPanel';
import ToolShell from './ToolShell';
import { useToast } from '@/hooks/useToast';

export default function MetaTagGenerator() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [keywords, setKeywords] = useState('');
  const [url, setUrl] = useState('');
  const [image, setImage] = useState('');
  const [author, setAuthor] = useState('');
  const [output, setOutput] = useState('');

  const generate = useCallback(() => {
    const tags: string[] = [];
    
    if (title) {
      tags.push(`<title>${title}</title>`);
      tags.push(`<meta name="title" content="${title}">`);
      tags.push(`<meta property="og:title" content="${title}">`);
      tags.push(`<meta name="twitter:title" content="${title}">`);
    }
    
    if (description) {
      tags.push(`<meta name="description" content="${description}">`);
      tags.push(`<meta property="og:description" content="${description}">`);
      tags.push(`<meta name="twitter:description" content="${description}">`);
    }
    
    if (keywords) {
      tags.push(`<meta name="keywords" content="${keywords}">`);
    }
    
    if (url) {
      tags.push(`<meta property="og:url" content="${url}">`);
      tags.push(`<link rel="canonical" href="${url}">`);
    }
    
    if (image) {
      tags.push(`<meta property="og:image" content="${image}">`);
      tags.push(`<meta name="twitter:image" content="${image}">`);
    }
    
    if (author) {
      tags.push(`<meta name="author" content="${author}">`);
    }
    
    // Default Open Graph tags
    tags.push(`<meta property="og:type" content="website">`);
    tags.push(`<meta name="twitter:card" content="summary_large_image">`);
    
    setOutput(tags.join('\n'));
  }, [title, description, keywords, url, image, author]);

  
  const controls = (
          <div className="flex items-center gap-3">
        <button onClick={generate} className="btn-primary">
          Generate Meta Tags
        </button>
        <button onClick={() => { setTitle(''); setDescription(''); setKeywords(''); setUrl(''); setImage(''); setAuthor(''); setOutput(''); }} className="btn-ghost">
          Clear
        </button>
      </div>
  );

  return (
    <ToolShell className="space-y-6" controls={controls}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="label">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Page title"
            className="input-base"
          />
        </div>
        <div>
          <label className="label">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Page description"
            className="input-base min-h-[80px]"
          />
        </div>
        <div>
          <label className="label">Keywords (comma-separated)</label>
          <input
            type="text"
            value={keywords}
            onChange={(e) => setKeywords(e.target.value)}
            placeholder="keyword1, keyword2, keyword3"
            className="input-base"
          />
        </div>
        <div>
          <label className="label">URL</label>
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://example.com"
            className="input-base"
          />
        </div>
        <div>
          <label className="label">Image URL</label>
          <input
            type="url"
            value={image}
            onChange={(e) => setImage(e.target.value)}
            placeholder="https://example.com/image.jpg"
            className="input-base"
          />
        </div>
        <div>
          <label className="label">Author</label>
          <input
            type="text"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            placeholder="Author name"
            className="input-base"
          />
        </div>
      </div>

{/* Controls moved to header */}








      {output && (
        <OutputPanel
          value={output}
          label="Generated Meta Tags"
          language="html"
          showLineNumbers
        />
      )}
    </ToolShell>
  );
}

