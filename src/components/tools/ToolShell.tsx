import type { ReactNode } from 'react';
import clsx from 'clsx';
import { RotateCcw, Copy } from 'lucide-react';
import { useToast } from '@/hooks/useToast';

interface ToolShellProps {
    title?: string;
    description?: string;
    children: ReactNode;
    className?: string;
    controls?: ReactNode;
    onClear?: () => void;
    onCopy?: () => void;
    noPadding?: boolean;
}

export default function ToolShell({
    title,
    description,
    children,
    className,
    controls,
    onClear,
    onCopy,
    noPadding = false
}: ToolShellProps) {
    return (
        <div className={clsx(
            "bg-[#151515] border border-[#2a2a2a] rounded-3xl overflow-hidden flex flex-col transition-all duration-300 relative group",
            "hover:border-[#3a3a3a] hover:shadow-[0_0_50px_-15px_rgba(59,130,246,0.15)]",
            className
        )}>
            {/* Enhanced Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/[0.03] via-transparent to-transparent pointer-events-none" />
            <div className="absolute inset-0 bg-gradient-to-t from-transparent via-transparent to-white/[0.01] pointer-events-none" />

            {/* Subtle animated glow on hover */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                <div className="absolute top-0 left-1/4 w-1/2 h-px bg-gradient-to-r from-transparent via-blue-500/20 to-transparent" />
            </div>

            {/* Content wrapper to ensure z-index above overlay */}
            <div className="relative z-10 flex flex-col h-full">
                {/* Optional Header inside the card */}
                {(title || description || controls) && (
                    <div className="px-6 py-5 sm:px-8 sm:py-6 border-b border-[var(--border-primary)] flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-b from-[var(--bg-secondary)]/40 to-transparent backdrop-blur-sm">
                        <div className="flex-1">
                            {title && (
                                <h2 className="text-xl font-semibold text-[var(--text-primary)] tracking-tight">
                                    {title}
                                </h2>
                            )}
                            {description && (
                                <p className="text-sm text-[var(--text-secondary)] mt-1.5 leading-relaxed">
                                    {description}
                                </p>
                            )}
                        </div>

                        <div className="flex items-center gap-2 flex-shrink-0">
                            {controls}

                            {/* Standard Actions */}
                            {(onCopy || onClear) && (
                                <div className="flex items-center gap-2 pl-2 md:pl-4 md:border-l border-[var(--border-primary)]">
                                    {onCopy && (
                                        <button
                                            onClick={onCopy}
                                            className="p-2.5 rounded-lg hover:bg-[var(--bg-tertiary)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-all duration-200 hover:scale-110 active:scale-95"
                                            title="Copy Output"
                                            aria-label="Copy output"
                                        >
                                            <Copy size={18} />
                                        </button>
                                    )}
                                    {onClear && (
                                        <button
                                            onClick={onClear}
                                            className="p-2.5 rounded-lg hover:bg-[var(--bg-tertiary)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-all duration-200 hover:scale-110 active:scale-95"
                                            title="Reset"
                                            aria-label="Reset tool"
                                        >
                                            <RotateCcw size={18} />
                                        </button>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Main Content Area */}
                <div className={clsx(
                    "flex-1 w-full",
                    !noPadding && "p-6 sm:p-8 pb-10"
                )}>
                    {children}
                </div>
            </div>
        </div>
    );
}
