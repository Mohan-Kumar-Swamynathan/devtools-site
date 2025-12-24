import { useState, useEffect, useRef } from 'react';
import type { ReactNode } from 'react';
import { ChevronDown } from 'lucide-react';
import clsx from 'clsx';

interface CollapsibleSectionProps {
    title: string;
    children: ReactNode;
    defaultExpanded?: boolean;
    persistKey?: string;
    className?: string;
    badge?: string | number;
}

export default function CollapsibleSection({
    title,
    children,
    defaultExpanded = true,
    persistKey,
    className,
    badge
}: CollapsibleSectionProps) {
    const [isExpanded, setIsExpanded] = useState(() => {
        if (persistKey && typeof window !== 'undefined') {
            const saved = localStorage.getItem(persistKey);
            return saved !== null ? saved === 'true' : defaultExpanded;
        }
        return defaultExpanded;
    });

    const contentRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (persistKey && typeof window !== 'undefined') {
            localStorage.setItem(persistKey, String(isExpanded));
        }
    }, [isExpanded, persistKey]);

    const toggleExpanded = () => {
        setIsExpanded(!isExpanded);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            toggleExpanded();
        }
    };

    return (
        <div className={clsx('rounded-xl overflow-hidden transition-all duration-300', className)}>
            {/* Header */}
            <button
                onClick={toggleExpanded}
                onKeyDown={handleKeyDown}
                className={clsx(
                    'w-full flex items-center justify-between px-5 py-3.5 transition-all duration-200',
                    'bg-gradient-to-r from-[var(--bg-secondary)] to-[var(--bg-tertiary)]/50',
                    'border border-[var(--border-primary)] rounded-xl',
                    'hover:border-[var(--border-secondary)] hover:shadow-lg',
                    'focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)] focus:ring-offset-2 focus:ring-offset-[var(--bg-primary)]',
                    'group relative overflow-hidden'
                )}
                aria-expanded={isExpanded}
                aria-controls={`collapsible-content-${persistKey || title}`}
            >
                {/* Gradient hover effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-[var(--brand-primary)]/0 via-[var(--brand-primary)]/5 to-[var(--brand-primary)]/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                <div className="flex items-center gap-3 relative z-10">
                    <span className="font-semibold text-[var(--text-primary)] text-sm sm:text-base tracking-tight">
                        {title}
                    </span>
                    {badge !== undefined && (
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-[var(--brand-primary)]/10 text-[var(--brand-primary)] border border-[var(--brand-primary)]/20">
                            {badge}
                        </span>
                    )}
                </div>

                <ChevronDown
                    className={clsx(
                        'w-5 h-5 text-[var(--text-secondary)] transition-all duration-300 relative z-10',
                        'group-hover:text-[var(--brand-primary)] group-hover:scale-110',
                        isExpanded ? 'rotate-180' : 'rotate-0'
                    )}
                    aria-hidden="true"
                />
            </button>

            {/* Content */}
            <div
                id={`collapsible-content-${persistKey || title}`}
                ref={contentRef}
                className={clsx(
                    'transition-all duration-300 ease-in-out overflow-hidden',
                    isExpanded ? 'opacity-100 mt-4' : 'opacity-0 mt-0'
                )}
                style={{
                    maxHeight: isExpanded ? `${contentRef.current?.scrollHeight || 1000}px` : '0px',
                }}
                aria-hidden={!isExpanded}
            >
                <div className="animate-fade-in">
                    {children}
                </div>
            </div>
        </div>
    );
}
