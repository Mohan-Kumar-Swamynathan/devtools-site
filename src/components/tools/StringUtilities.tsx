import { useState } from 'react';
import { Type, Copy, Shuffle, ArrowUpDown } from 'lucide-react';
import ToolShell from './ToolShell';
import { useToast } from '@/hooks/useToast';

type Operation = 'reverse' | 'shuffle' | 'sort' | 'uppercase' | 'lowercase' | 'capitalize' | 'trim' | 'removeDuplicates' | 'removeSpaces' | 'count';

export default function StringUtilities() {
    const [input, setInput] = useState('');
    const [output, setOutput] = useState('');
    const [operation, setOperation] = useState<Operation>('reverse');
    const [stats, setStats] = useState({ chars: 0, words: 0, lines: 0 });
    const { showToast } = useToast();

    const operations: { value: Operation; label: string; icon: any }[] = [
        { value: 'reverse', label: 'Reverse', icon: ArrowUpDown },
        { value: 'shuffle', label: 'Shuffle', icon: Shuffle },
        { value: 'sort', label: 'Sort Lines', icon: ArrowUpDown },
        { value: 'uppercase', label: 'UPPERCASE', icon: Type },
        { value: 'lowercase', label: 'lowercase', icon: Type },
        { value: 'capitalize', label: 'Capitalize', icon: Type },
        { value: 'trim', label: 'Trim Whitespace', icon: Type },
        { value: 'removeDuplicates', label: 'Remove Duplicate Lines', icon: Type },
        { value: 'removeSpaces', label: 'Remove All Spaces', icon: Type },
        { value: 'count', label: 'Count Stats', icon: Type }
    ];

    const performOperation = () => {
        let result = '';

        switch (operation) {
            case 'reverse':
                result = input.split('').reverse().join('');
                break;

            case 'shuffle':
                const chars = input.split('');
                for (let i = chars.length - 1; i > 0; i--) {
                    const j = Math.floor(Math.random() * (i + 1));
                    [chars[i], chars[j]] = [chars[j], chars[i]];
                }
                result = chars.join('');
                break;

            case 'sort':
                result = input.split('\n').sort().join('\n');
                break;

            case 'uppercase':
                result = input.toUpperCase();
                break;

            case 'lowercase':
                result = input.toLowerCase();
                break;

            case 'capitalize':
                result = input.split(' ').map(word =>
                    word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
                ).join(' ');
                break;

            case 'trim':
                result = input.split('\n').map(line => line.trim()).join('\n');
                break;

            case 'removeDuplicates':
                const lines = input.split('\n');
                result = [...new Set(lines)].join('\n');
                break;

            case 'removeSpaces':
                result = input.replace(/\s+/g, '');
                break;

            case 'count':
                const charCount = input.length;
                const wordCount = input.trim() ? input.trim().split(/\s+/).length : 0;
                const lineCount = input.split('\n').length;
                setStats({ chars: charCount, words: wordCount, lines: lineCount });
                result = input;
                showToast(`${charCount} chars, ${wordCount} words, ${lineCount} lines`, 'success');
                break;
        }

        setOutput(result);
        if (operation !== 'count') {
            showToast('Operation completed', 'success');
        }
    };

    const copyOutput = async () => {
        try {
            await navigator.clipboard.writeText(output);
            showToast('Copied to clipboard', 'success');
        } catch (error) {
            showToast('Failed to copy', 'error');
        }
    };

    const loadExample = () => {
        setInput('Hello World\nThis is a test\nString utilities are useful\nHello World');
    };

    const controls = (
        <div className="flex items-center gap-3 flex-wrap">
            <select
                value={operation}
                onChange={(e) => setOperation(e.target.value as Operation)}
                className="input-base px-3 py-2"
            >
                {operations.map(op => (
                    <option key={op.value} value={op.value}>{op.label}</option>
                ))}
            </select>

            <button
                onClick={loadExample}
                className="btn-secondary px-4 py-2"
            >
                Load Example
            </button>

            <button
                onClick={performOperation}
                disabled={!input}
                className="btn-primary px-4 py-2"
            >
                Apply
            </button>
        </div>
    );

    return (
        <ToolShell
            title="String Utilities"
            description="Manipulate and analyze text strings"
            controls={controls}
        >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Input */}
                <div>
                    <label className="label">Input Text</label>
                    <textarea
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Enter your text here..."
                        className="input-base w-full h-[400px] font-mono"
                    />
                </div>

                {/* Output */}
                <div>
                    <div className="flex items-center justify-between mb-2">
                        <label className="label">Output</label>
                        {output && (
                            <button
                                onClick={copyOutput}
                                className="btn-icon p-1.5"
                                title="Copy to clipboard"
                            >
                                <Copy size={16} />
                            </button>
                        )}
                    </div>
                    <textarea
                        value={output}
                        readOnly
                        placeholder="Result will appear here..."
                        className="input-base w-full h-[400px] font-mono"
                    />

                    {operation === 'count' && stats.chars > 0 && (
                        <div className="mt-4 grid grid-cols-3 gap-4">
                            <div className="p-4 rounded-xl text-center" style={{ backgroundColor: 'var(--bg-secondary)' }}>
                                <div className="text-2xl font-bold" style={{ color: 'var(--color-info)' }}>
                                    {stats.chars}
                                </div>
                                <div className="text-sm" style={{ color: 'var(--text-muted)' }}>
                                    Characters
                                </div>
                            </div>
                            <div className="p-4 rounded-xl text-center" style={{ backgroundColor: 'var(--bg-secondary)' }}>
                                <div className="text-2xl font-bold" style={{ color: 'var(--color-success)' }}>
                                    {stats.words}
                                </div>
                                <div className="text-sm" style={{ color: 'var(--text-muted)' }}>
                                    Words
                                </div>
                            </div>
                            <div className="p-4 rounded-xl text-center" style={{ backgroundColor: 'var(--bg-secondary)' }}>
                                <div className="text-2xl font-bold" style={{ color: 'var(--color-warning)' }}>
                                    {stats.lines}
                                </div>
                                <div className="text-sm" style={{ color: 'var(--text-muted)' }}>
                                    Lines
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </ToolShell>
    );
}
