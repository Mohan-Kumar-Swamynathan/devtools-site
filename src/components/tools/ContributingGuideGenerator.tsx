import { useState, useCallback } from 'react';
import OutputPanel from '@/components/common/OutputPanel';

export default function ContributingGuideGenerator() {
  const [projectName, setProjectName] = useState('');
  const [repoUrl, setRepoUrl] = useState('');
  const [includeSetup, setIncludeSetup] = useState(true);
  const [includeTesting, setIncludeTesting] = useState(true);
  const [includeCodeStyle, setIncludeCodeStyle] = useState(true);
  const [output, setOutput] = useState('');

  const generate = useCallback(() => {
    const sections: string[] = [];
    
    sections.push(`# Contributing to ${projectName || 'This Project'}\n`);
    sections.push('Thank you for your interest in contributing!\n');
    
    sections.push('## Getting Started\n');
    if (includeSetup) {
      sections.push('### Prerequisites');
      sections.push('');
      sections.push('- Node.js (version X.X.X or higher)');
      sections.push('- npm or yarn');
      sections.push('');
      sections.push('### Setup');
      sections.push('');
      sections.push('```bash');
      sections.push('git clone ' + (repoUrl || 'https://github.com/yourusername/yourproject.git'));
      sections.push('cd ' + (projectName || 'yourproject'));
      sections.push('npm install');
      sections.push('```\n');
    }
    
    sections.push('## How to Contribute\n');
    sections.push('1. Fork the repository');
    sections.push('2. Create a feature branch (`git checkout -b feature/amazing-feature`)');
    sections.push('3. Make your changes');
    sections.push('4. Commit your changes (`git commit -m "Add some amazing feature"`)');
    sections.push('5. Push to the branch (`git push origin feature/amazing-feature`)');
    sections.push('6. Open a Pull Request\n');
    
    if (includeCodeStyle) {
      sections.push('## Code Style\n');
      sections.push('Please follow the existing code style and conventions.\n');
      sections.push('- Use meaningful variable names');
      sections.push('- Add comments for complex logic');
      sections.push('- Follow the project\'s linting rules\n');
    }
    
    if (includeTesting) {
      sections.push('## Testing\n');
      sections.push('Before submitting a PR, please ensure:');
      sections.push('');
      sections.push('- All tests pass (`npm test`)');
      sections.push('- New features include tests');
      sections.push('- Code coverage is maintained\n');
    }
    
    sections.push('## Questions?\n');
    sections.push('Feel free to open an issue for any questions or concerns.\n');

    setOutput(sections.join('\n'));
  }, [projectName, repoUrl, includeSetup, includeTesting, includeCodeStyle]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="label">Project Name</label>
          <input
            type="text"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            placeholder="My Project"
            className="input-base"
          />
        </div>
        <div>
          <label className="label">Repository URL</label>
          <input
            type="url"
            value={repoUrl}
            onChange={(e) => setRepoUrl(e.target.value)}
            placeholder="https://github.com/user/repo"
            className="input-base"
          />
        </div>
      </div>

      <div>
        <label className="label">Sections</label>
        <div className="space-y-2">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={includeSetup}
              onChange={(e) => setIncludeSetup(e.target.checked)}
              className="checkbox"
            />
            <span>Include Setup Instructions</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={includeTesting}
              onChange={(e) => setIncludeTesting(e.target.checked)}
              className="checkbox"
            />
            <span>Include Testing Guidelines</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={includeCodeStyle}
              onChange={(e) => setIncludeCodeStyle(e.target.checked)}
              className="checkbox"
            />
            <span>Include Code Style Guidelines</span>
          </label>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <button onClick={generate} className="btn-primary">
          Generate Contributing Guide
        </button>
        <button onClick={() => { setProjectName(''); setRepoUrl(''); setIncludeSetup(true); setIncludeTesting(true); setIncludeCodeStyle(true); setOutput(''); }} className="btn-ghost">
          Reset
        </button>
      </div>

      {output && (
        <OutputPanel
          value={output}
          label="CONTRIBUTING.md"
          language="markdown"
          showLineNumbers
        />
      )}
    </div>
  );
}

