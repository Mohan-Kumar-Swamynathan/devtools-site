import { useState, useCallback } from 'react';
import OutputPanel from '@/components/common/OutputPanel';

const dockerfileTemplates: Record<string, { base: string; install: string; copy: string; cmd: string }> = {
  node: {
    base: 'node:18-alpine',
    install: 'RUN npm install',
    copy: 'COPY package*.json ./\nCOPY . .',
    cmd: 'CMD ["node", "index.js"]'
  },
  python: {
    base: 'python:3.11-slim',
    install: 'RUN pip install --no-cache-dir -r requirements.txt',
    copy: 'COPY requirements.txt .\nCOPY . .',
    cmd: 'CMD ["python", "app.py"]'
  },
  go: {
    base: 'golang:1.21-alpine',
    install: 'RUN go mod download',
    copy: 'COPY go.mod go.sum ./\nCOPY . .',
    cmd: 'CMD ["go", "run", "main.go"]'
  },
  rust: {
    base: 'rust:1.75-slim',
    install: 'RUN cargo build --release',
    copy: 'COPY Cargo.toml Cargo.lock ./\nCOPY src ./src',
    cmd: 'CMD ["./target/release/app"]'
  },
  php: {
    base: 'php:8.2-apache',
    install: 'RUN docker-php-ext-install pdo_mysql',
    copy: 'COPY . /var/www/html/',
    cmd: 'CMD ["apache2-foreground"]'
  }
};

export default function DockerfileGenerator() {
  const [language, setLanguage] = useState('node');
  const [port, setPort] = useState('3000');
  const [workdir, setWorkdir] = useState('/app');
  const [output, setOutput] = useState('');

  const generate = useCallback(() => {
    const template = dockerfileTemplates[language];
    if (!template) return;

    const dockerfile = `FROM ${template.base}

WORKDIR ${workdir}

${template.copy}

${template.install}

${port ? `EXPOSE ${port}` : ''}

${template.cmd}`;

    setOutput(dockerfile);
  }, [language, port, workdir]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="label">Language/Framework</label>
          <select value={language} onChange={(e) => setLanguage(e.target.value)} className="input-base">
            {Object.keys(dockerfileTemplates).map(lang => (
              <option key={lang} value={lang}>{lang.charAt(0).toUpperCase() + lang.slice(1)}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="label">Port</label>
          <input
            type="number"
            value={port}
            onChange={(e) => setPort(e.target.value)}
            placeholder="3000"
            className="input-base"
          />
        </div>
        <div>
          <label className="label">Working Directory</label>
          <input
            type="text"
            value={workdir}
            onChange={(e) => setWorkdir(e.target.value)}
            placeholder="/app"
            className="input-base"
          />
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <button onClick={generate} className="btn-primary">
          Generate Dockerfile
        </button>
        <button onClick={() => { setLanguage('node'); setPort('3000'); setWorkdir('/app'); setOutput(''); }} className="btn-ghost">
          Reset
        </button>
      </div>

      {output && (
        <OutputPanel
          value={output}
          label="Dockerfile"
          language="dockerfile"
          showLineNumbers
        />
      )}
    </div>
  );
}

