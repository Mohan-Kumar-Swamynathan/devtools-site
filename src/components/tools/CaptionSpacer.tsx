import React, { useState } from 'react';
import { Copy, RefreshCw, AlignLeft, ClipboardPaste } from 'lucide-react';
import ToolShell from './ToolShell';
import { clsx } from 'clsx';
import { useToast } from '@/hooks/useToast';

export default function CaptionSpacer() {
    const [input, setInput] = useState('');
    const [output, setOutput] = useState('');
    const { toast } = useToast();

    const handleConvert = () => {
        if (!input) return;

        // Replace standard newlines with invisible separator (or ensures clean structure)
        // Instagram often strips empty lines. We can use an invisible separator or just standard line breaks depending on strategy.
        // A common trick is replacing multiple newlines with a newline + invisible char + newline

        // Simple strategy: careful trimming and ensuring max 1 empty line between paragraphs
        const lines = input.split('\n');
        const processed = lines
            .map(line => line.trim()) // Remove trailing/leading spaces from lines
            .join('\n') // Join back
            .replace(/\n\n+/g, '\n\n'); // Max 2 newlines (1 empty line)

        // For "perfect" spacing often zero-width space is used on empty lines but modern IG is better.
        // However, users expect a "magic fix". Let's stick to clean formatting + optional zero-width space if needed.
        // Let's add the zero-width space on empty lines to be safe for older app versions/behaviors.

        const magic = input.split('\n').map(line => {
            const trimmed = line.trim();
            return trimmed === '' ? '⠀' : trimmed; // Uses U+2800 Braille Pattern Blank for empty lines which is a common IG spacer
        }).join('\n');

        setOutput(magic);

        toast({
            title: 'Converted!',
            description: 'Your caption has been formatted.',
            variant: 'success'
        });
    };

    const handleCopy = () => {
        if (!output) return;
        navigator.clipboard.writeText(output);
        toast({
            title: 'Copied!',
            description: 'Formatted caption copied to clipboard.',
            variant: 'success'
        });
    };

    const handlePaste = async () => {
        try {
            const text = await navigator.clipboard.readText();
            setInput(text);
        } catch (err) {
            toast({
                title: 'Error',
                description: 'Failed to access clipboard.',
                variant: 'error'
            });
        }
    };

    const clear = () => {
        setInput('');
        setOutput('');
    };

    return (
        <ToolShell
            title="Instagram Caption Spacer"
            description="Fix line breaks and format your captions perfectly"
            icon={<AlignLeft className="w-6 h-6" />}
        >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Input */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <label className="text-sm font-medium text-[var(--text-secondary)]">
                            Draft your caption
                        </label>
                        <button
                            onClick={handlePaste}
                            className="px-3 py-1.5 text-xs rounded-lg bg-[var(--bg-secondary)] hover:bg-[var(--bg-elevated)] transition-colors text-[var(--text-secondary)] flex items-center gap-1"
                        >
                            <ClipboardPaste className="w-3 h-3" />
                            Paste
                        </button>
                    </div>
                    <div className="relative">
                        <textarea
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Type your caption here...&#10;&#10;Leave empty lines&#10;for paragraphs."
                            className="w-full h-80 p-4 rounded-xl resize-none bg-[var(--bg-elevated)] border border-[var(--border-primary)] focus:ring-2 focus:ring-[var(--brand-primary)] outline-none transition-all font-sans text-base leading-relaxed"
                        />
                    </div>
                    <div className="flex gap-4">
                        <button
                            onClick={handleConvert}
                            disabled={!input}
                            className={clsx(
                                "flex-1 py-3 rounded-xl font-semibold text-white shadow-lg transition-all active:scale-95",
                                input
                                    ? "bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500"
                                    : "bg-[var(--bg-secondary)] text-[var(--text-muted)] cursor-not-allowed"
                            )}
                        >
                            Format Caption
                        </button>
                        <button
                            onClick={clear}
                            className="px-6 rounded-xl border border-[var(--border-primary)] hover:bg-[var(--bg-secondary)] text-[var(--text-secondary)]"
                        >
                            Clear
                        </button>
                    </div>
                </div>

                {/* Output */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <label className="text-sm font-medium text-[var(--text-secondary)]">
                            Formatted Result
                        </label>
                        <span className="text-xs text-[var(--text-muted)]">
                            {output.length} chars
                        </span>
                    </div>
                    <div className="relative">
                        <textarea
                            readOnly
                            value={output}
                            placeholder="Formatted text will appear here..."
                            className="w-full h-80 p-4 rounded-xl resize-none bg-[var(--bg-secondary)] border border-[var(--border-secondary)] text-[var(--text-secondary)] outline-none font-sans text-base leading-relaxed cursor-default"
                        />
                        {output && (
                            <div className="absolute bottom-4 right-4">
                                <button
                                    onClick={handleCopy}
                                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-600 text-white shadow-lg hover:bg-emerald-500 transition-all active:scale-95 text-sm font-semibold"
                                >
                                    <Copy className="w-4 h-4" />
                                    Copy Result
                                </button>
                            </div>
                        )}
                    </div>

                    {output && (
                        <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20 text-sm text-blue-400">
                            ✨ Your caption is ready! Paste it directly into Instagram. The invisible spaces will keep your paragraphs separated.
                        </div>
                    )}
                </div>
            </div>
        </ToolShell>
    );
}
