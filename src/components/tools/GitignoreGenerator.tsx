import { useState, useCallback } from 'react';
import OutputPanel from '@/components/common/OutputPanel';

const gitignoreTemplates: Record<string, string> = {
  node: `# Dependencies
node_modules/
npm-debug.log*
yarn-debug.log*
yarn-error.log*
package-lock.json
yarn.lock

# Build outputs
dist/
build/
.next/
out/

# Environment variables
.env
.env.local
.env.*.local

# IDE
.vscode/
.idea/
*.swp
*.swo
*~

# OS
.DS_Store
Thumbs.db`,
  python: `# Byte-compiled / optimized / DLL files
__pycache__/
*.py[cod]
*$py.class

# Virtual environments
venv/
env/
ENV/

# IDE
.vscode/
.idea/
*.swp

# Distribution / packaging
dist/
build/
*.egg-info/`,
  java: `# Compiled class files
*.class

# Log files
*.log

# Package Files
*.jar
*.war
*.nar
*.ear
*.zip
*.tar.gz
*.rar

# IDE
.idea/
*.iml
.vscode/

# Maven
target/
pom.xml.tag`,
  php: `# Dependencies
vendor/
composer.lock

# Environment
.env
.env.local

# IDE
.vscode/
.idea/
*.swp

# Logs
*.log`,
  go: `# Binaries
*.exe
*.exe~
*.dll
*.so
*.dylib

# Test binary
*.test

# Dependency directories
vendor/

# IDE
.vscode/
.idea/`,
  rust: `# Compiled files
target/
Cargo.lock

# IDE
.vscode/
.idea/`,
  ruby: `# Dependencies
vendor/bundle
.bundle

# Logs
*.log

# Environment
.env

# IDE
.vscode/
.idea/`
};

export default function GitignoreGenerator() {
  const [selected, setSelected] = useState<string[]>([]);
  const [output, setOutput] = useState('');

  const generate = useCallback(() => {
    const lines: string[] = [];
    
    selected.forEach(key => {
      if (gitignoreTemplates[key]) {
        lines.push(`# ${key.toUpperCase()}`);
        lines.push(gitignoreTemplates[key]);
        lines.push('');
      }
    });

    setOutput(lines.join('\n').trim());
  }, [selected]);

  return (
    <div className="space-y-6">
      <div>
        <label className="label">Select Technologies</label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {Object.keys(gitignoreTemplates).map(key => (
            <label key={key} className="flex items-center gap-2 cursor-pointer p-3 rounded-lg border hover:bg-opacity-50" style={{ borderColor: 'var(--border-primary)' }}>
              <input
                type="checkbox"
                checked={selected.includes(key)}
                onChange={(e) => {
                  if (e.target.checked) {
                    setSelected([...selected, key]);
                  } else {
                    setSelected(selected.filter(s => s !== key));
                  }
                }}
                className="checkbox"
              />
              <span className="capitalize">{key}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <button onClick={generate} disabled={selected.length === 0} className="btn-primary">
          Generate .gitignore
        </button>
        <button onClick={() => { setSelected([]); setOutput(''); }} className="btn-ghost">
          Clear
        </button>
      </div>

      {output && (
        <OutputPanel
          value={output}
          label=".gitignore"
          language="gitignore"
          showLineNumbers
        />
      )}
    </div>
  );
}

