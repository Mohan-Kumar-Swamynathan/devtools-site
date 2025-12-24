import { useState, useCallback } from 'react';
import CodeEditor from '@/components/common/CodeEditor';
import OutputPanel from '@/components/common/OutputPanel';
import ToolShell from './ToolShell';
import { useToast } from '@/hooks/useToast';

type CommitType = 'feat' | 'fix' | 'docs' | 'style' | 'refactor' | 'perf' | 'test' | 'chore' | 'ci' | 'build' | 'revert';

const commitTypes: { value: CommitType; label: string; emoji: string; description: string }[] = [
  { value: 'feat', label: 'Feature', emoji: '✨', description: 'A new feature' },
  { value: 'fix', label: 'Bug Fix', emoji: '🐛', description: 'A bug fix' },
  { value: 'docs', label: 'Documentation', emoji: '📚', description: 'Documentation only changes' },
  { value: 'style', label: 'Style', emoji: '💄', description: 'Code style changes (formatting, etc.)' },
  { value: 'refactor', label: 'Refactor', emoji: '♻️', description: 'Code refactoring' },
  { value: 'perf', label: 'Performance', emoji: '⚡', description: 'Performance improvements' },
  { value: 'test', label: 'Tests', emoji: '✅', description: 'Adding or updating tests' },
  { value: 'chore', label: 'Chore', emoji: '🔧', description: 'Build process or auxiliary tool changes' },
  { value: 'ci', label: 'CI', emoji: '👷', description: 'CI configuration changes' },
  { value: 'build', label: 'Build', emoji: '📦', description: 'Build system changes' },
  { value: 'revert', label: 'Revert', emoji: '⏪', description: 'Revert a previous commit' }
];

export default function GitCommitMessageGenerator() {
  const [type, setType] = useState<CommitType>('feat');
  const [scope, setScope] = useState('');
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [footer, setFooter] = useState('');
  const [breakingChange, setBreakingChange] = useState(false);
  const [output, setOutput] = useState('');

  const generate = useCallback(() => {
    if (!subject.trim()) {
      setOutput('');
      return;
    }

    let message = '';
    
    // Header
    const header = scope.trim()
      ? `${type}(${scope.trim()}): ${subject.trim()}`
      : `${type}: ${subject.trim()}`;
    
    message += header;
    
    if (breakingChange) {
      message += '!';
    }
    
    // Body
    if (body.trim()) {
      message += `\n\n${body.trim()}`;
    }
    
    // Footer
    if (breakingChange || footer.trim()) {
      message += '\n\n';
      if (breakingChange) {
        message += 'BREAKING CHANGE: ';
        if (footer.trim()) {
          message += footer.trim();
        } else {
          message += 'This commit introduces breaking changes.';
        }
        message += '\n';
      } else if (footer.trim()) {
        message += footer.trim();
      }
    }
    
    setOutput(message);
  }, [type, scope, subject, body, footer, breakingChange]);

  const selectedType = commitTypes.find(t => t.value === type);

  
  const controls = (
          <div className="flex items-center gap-3">
        <button onClick={generate} className="btn-primary">
          Generate Commit Message
        </button>
        <button
          onClick={() => {
            setType('feat');
            setScope('');
            setSubject('');
            setBody('');
            setFooter('');
            setBreakingChange(false);
            setOutput('');
          }}
          className="btn-ghost"
        >
          Clear
        </button>
      </div>
  );

  return (
    <ToolShell className="space-y-6" controls={controls}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="label">Type *</label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value as CommitType)}
            className="input-base"
          >
            {commitTypes.map(t => (
              <option key={t.value} value={t.value}>
                {t.emoji} {t.label} - {t.description}
              </option>
            ))}
          </select>
          {selectedType && (
            <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
              {selectedType.description}
            </p>
          )}
        </div>

        <div>
          <label className="label">Scope (optional)</label>
          <input
            type="text"
            value={scope}
            onChange={(e) => setScope(e.target.value)}
            className="input-base"
            placeholder="auth, api, ui, etc."
          />
        </div>
      </div>

      <div>
        <label className="label">Subject *</label>
        <input
          type="text"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          className="input-base"
          placeholder="Short description of the change"
          onKeyUp={generate}
        />
        <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
          Use imperative mood: "add feature" not "added feature" or "adds feature"
        </p>
      </div>

      <div>
        <label className="label">Body (optional)</label>
        <CodeEditor
          value={body}
          onChange={setBody}
          language="text"
          placeholder="Longer description of the change, motivation, and context..."
          rows={4}
        />
      </div>

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="breaking"
          checked={breakingChange}
          onChange={(e) => setBreakingChange(e.target.checked)}
          className="w-4 h-4"
        />
        <label htmlFor="breaking" className="text-sm" style={{ color: 'var(--text-primary)' }}>
          Breaking Change
        </label>
      </div>

      {breakingChange && (
        <div>
          <label className="label">Breaking Change Description</label>
          <CodeEditor
            value={footer}
            onChange={setFooter}
            language="text"
            placeholder="Describe the breaking change..."
            rows={3}
          />
        </div>
      )}

      {!breakingChange && (
        <div>
          <label className="label">Footer (optional)</label>
          <input
            type="text"
            value={footer}
            onChange={(e) => setFooter(e.target.value)}
            className="input-base"
            placeholder="Issue references, co-authors, etc."
          />
        </div>
      )}

{/* Controls moved to header */}



















      {output && (
        <OutputPanel
          value={output}
          label="Generated Commit Message"
          language="text"
          filename="COMMIT_MSG"
          showLineNumbers
        />
      )}

      <div className="p-4 rounded-xl border text-sm" style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-primary)' }}>
        <h3 className="font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
          Conventional Commits Format:
        </h3>
        <code className="text-xs" style={{ color: 'var(--text-muted)' }}>
          &lt;type&gt;(&lt;scope&gt;): &lt;subject&gt;
          <br />
          <br />
          &lt;body&gt;
          <br />
          <br />
          &lt;footer&gt;
        </code>
      </div>
    </ToolShell>
  );
}

