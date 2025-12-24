import { useState, useCallback } from 'react';
import OutputPanel from '@/components/common/OutputPanel';
import ToolShell from './ToolShell';
import { useToast } from '@/hooks/useToast';

export default function ReadmeGenerator() {
  const [projectName, setProjectName] = useState('');
  const [description, setDescription] = useState('');
  const [author, setAuthor] = useState('');
  const [license, setLicense] = useState('MIT');
  const [includeInstall, setIncludeInstall] = useState(true);
  const [includeUsage, setIncludeUsage] = useState(true);
  const [includeContributing, setIncludeContributing] = useState(true);
  const [output, setOutput] = useState('');

  const generate = useCallback(() => {
    const sections: string[] = [];
    
    sections.push(`# ${projectName || 'Project Name'}`);
    sections.push('');
    
    if (description) {
      sections.push(description);
      sections.push('');
    }
    
    if (includeInstall) {
      sections.push('## Installation');
      sections.push('');
      sections.push('```bash');
      sections.push('npm install');
      sections.push('```');
      sections.push('');
    }
    
    if (includeUsage) {
      sections.push('## Usage');
      sections.push('');
      sections.push('```bash');
      sections.push('npm start');
      sections.push('```');
      sections.push('');
    }
    
    if (author) {
      sections.push('## Author');
      sections.push('');
      sections.push(author);
      sections.push('');
    }
    
    if (license) {
      sections.push('## License');
      sections.push('');
      sections.push(`This project is licensed under the ${license} License.`);
      sections.push('');
    }
    
    if (includeContributing) {
      sections.push('## Contributing');
      sections.push('');
      sections.push('Contributions are welcome! Please feel free to submit a Pull Request.');
      sections.push('');
    }

    setOutput(sections.join('\n'));
  }, [projectName, description, author, license, includeInstall, includeUsage, includeContributing]);

  
  const controls = (
          <div className="flex items-center gap-3">
        <button onClick={generate} className="btn-primary">
          Generate README
        </button>
        <button onClick={() => { setProjectName(''); setDescription(''); setAuthor(''); setLicense('MIT'); setIncludeInstall(true); setIncludeUsage(true); setIncludeContributing(true); setOutput(''); }} className="btn-ghost">
          Reset
        </button>
      </div>
  );

  return (
    <ToolShell className="space-y-6" controls={controls}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="label">Project Name</label>
          <input
            type="text"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            placeholder="My Awesome Project"
            className="input-base"
          />
        </div>
        <div>
          <label className="label">Author</label>
          <input
            type="text"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            placeholder="Your Name"
            className="input-base"
          />
        </div>
      </div>

      <div>
        <label className="label">Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="A brief description of your project"
          className="input-base min-h-[100px]"
        />
      </div>

      <div>
        <label className="label">License</label>
        <select value={license} onChange={(e) => setLicense(e.target.value)} className="input-base">
          <option value="MIT">MIT</option>
          <option value="Apache-2.0">Apache 2.0</option>
          <option value="GPL-3.0">GPL 3.0</option>
          <option value="BSD-3-Clause">BSD 3-Clause</option>
          <option value="ISC">ISC</option>
        </select>
      </div>

      <div>
        <label className="label">Sections</label>
        <div className="space-y-2">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={includeInstall}
              onChange={(e) => setIncludeInstall(e.target.checked)}
              className="checkbox"
            />
            <span>Include Installation</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={includeUsage}
              onChange={(e) => setIncludeUsage(e.target.checked)}
              className="checkbox"
            />
            <span>Include Usage</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={includeContributing}
              onChange={(e) => setIncludeContributing(e.target.checked)}
              className="checkbox"
            />
            <span>Include Contributing</span>
          </label>
        </div>
      </div>

{/* Controls moved to header */}








      {output && (
        <OutputPanel
          value={output}
          label="README.md"
          language="markdown"
          showLineNumbers
        />
      )}
    </ToolShell>
  );
}

