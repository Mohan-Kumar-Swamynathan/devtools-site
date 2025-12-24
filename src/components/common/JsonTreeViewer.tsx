import { useState } from 'react';
import { ChevronRight, ChevronDown, Copy } from 'lucide-react';
import { useToast } from '@/hooks/useToast';

interface JsonTreeViewerProps {
    data: any;
    label?: string;
    className?: string;
}

interface TreeNodeProps {
    keyName: string;
    value: any;
    level: number;
    isLast: boolean;
}

export default function JsonTreeViewer({ data, label, className = '' }: JsonTreeViewerProps) {
    const { showToast } = useToast();

    const copyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(JSON.stringify(data, null, 2));
            showToast('Copied to clipboard', 'success');
        } catch (error) {
            showToast('Failed to copy', 'error');
        }
    };

    return (
        <div className={`rounded-xl overflow-hidden ${className}`} style={{ backgroundColor: 'var(--bg-secondary)' }}>
            {label && (
                <div className="flex items-center justify-between px-4 py-3 border-b" style={{ borderColor: 'var(--border-primary)' }}>
                    <label className="label mb-0">{label}</label>
                    <button
                        onClick={copyToClipboard}
                        className="btn-icon p-1.5"
                        title="Copy JSON"
                    >
                        <Copy size={16} />
                    </button>
                </div>
            )}
            <div className="p-4 font-mono text-sm overflow-x-auto max-h-[600px] overflow-y-auto">
                <TreeNode keyName="root" value={data} level={0} isLast={true} />
            </div>
        </div>
    );
}

function TreeNode({ keyName, value, level, isLast }: TreeNodeProps) {
    const [isExpanded, setIsExpanded] = useState(level < 2); // Auto-expand first 2 levels

    const isObject = value !== null && typeof value === 'object' && !Array.isArray(value);
    const isArray = Array.isArray(value);
    const isExpandable = isObject || isArray;
    const isPrimitive = !isExpandable;

    const getValueColor = (val: any): string => {
        if (val === null) return 'var(--syntax-keyword)';
        if (typeof val === 'string') return 'var(--syntax-string)';
        if (typeof val === 'number') return 'var(--syntax-number)';
        if (typeof val === 'boolean') return 'var(--syntax-keyword)';
        return 'var(--text-primary)';
    };

    const getValueDisplay = (val: any): string => {
        if (val === null) return 'null';
        if (typeof val === 'string') return `"${val}"`;
        if (typeof val === 'boolean') return val.toString();
        if (typeof val === 'number') return val.toString();
        return '';
    };

    const getPreview = (): string => {
        if (isArray) {
            return value.length === 0 ? '[]' : `[${value.length}]`;
        }
        if (isObject) {
            const keys = Object.keys(value);
            return keys.length === 0 ? '{}' : `{${keys.length}}`;
        }
        return '';
    };

    const indent = level * 20;

    return (
        <div>
            <div
                className="flex items-start hover:bg-[var(--bg-tertiary)] rounded px-2 py-1 transition-colors cursor-pointer group"
                style={{ paddingLeft: `${indent}px` }}
                onClick={() => isExpandable && setIsExpanded(!isExpanded)}
            >
                {/* Expand/Collapse Icon */}
                <div className="w-5 h-5 flex items-center justify-center flex-shrink-0 mr-1">
                    {isExpandable && (
                        <div className="text-[var(--text-muted)] group-hover:text-[var(--text-primary)] transition-colors">
                            {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                        </div>
                    )}
                </div>

                {/* Key Name */}
                {keyName !== 'root' && (
                    <span className="mr-2" style={{ color: 'var(--text-primary)' }}>
                        {isNaN(Number(keyName)) ? `"${keyName}"` : keyName}:
                    </span>
                )}

                {/* Value or Preview */}
                {isPrimitive ? (
                    <span style={{ color: getValueColor(value) }}>
                        {getValueDisplay(value)}
                    </span>
                ) : (
                    <span style={{ color: 'var(--text-muted)' }}>
                        {isArray ? '[' : '{'}
                        {!isExpanded && (
                            <>
                                <span className="mx-1" style={{ color: 'var(--text-secondary)' }}>
                                    {getPreview()}
                                </span>
                                {isArray ? ']' : '}'}
                            </>
                        )}
                    </span>
                )}
            </div>

            {/* Expanded Children */}
            {isExpandable && isExpanded && (
                <div>
                    {isArray ? (
                        value.map((item: any, index: number) => (
                            <TreeNode
                                key={index}
                                keyName={index.toString()}
                                value={item}
                                level={level + 1}
                                isLast={index === value.length - 1}
                            />
                        ))
                    ) : (
                        Object.entries(value).map(([key, val], index, arr) => (
                            <TreeNode
                                key={key}
                                keyName={key}
                                value={val}
                                level={level + 1}
                                isLast={index === arr.length - 1}
                            />
                        ))
                    )}
                    <div
                        className="flex items-start px-2 py-1"
                        style={{ paddingLeft: `${indent}px` }}
                    >
                        <div className="w-5 mr-1"></div>
                        <span style={{ color: 'var(--text-muted)' }}>
                            {isArray ? ']' : '}'}
                        </span>
                    </div>
                </div>
            )}
        </div>
    );
}
