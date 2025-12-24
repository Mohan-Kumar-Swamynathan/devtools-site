import React, { memo } from 'react';
import { Handle, Position, type NodeTypes } from 'reactflow';

// Description of each node type for UI
export const NODE_TYPES_INFO: Record<string, { label: string; icon: string; category: string }> = {
    start: { label: 'Start', icon: '●', category: 'Flow' },
    end: { label: 'End', icon: '●', category: 'Flow' },
    process: { label: 'Process', icon: '▭', category: 'Flow' },
    decision: { label: 'Decision', icon: '◆', category: 'Flow' },
    io: { label: 'Input/Output', icon: '▱', category: 'Flow' },
    subroutine: { label: 'Subroutine', icon: '▯', category: 'Advanced' },
    database: { label: 'Database', icon: '▰', category: 'Data' },
    document: { label: 'Document', icon: '▤', category: 'Data' },
    'stored-data': { label: 'Stored Data', icon: '▦', category: 'Data' },
    cylinder: { label: 'Cylinder', icon: '▬', category: 'Data' },
    hexagon: { label: 'Hexagon', icon: '⬡', category: 'Shapes' },
    parallelogram: { label: 'Parallelogram', icon: '▱', category: 'Shapes' },
    trapezoid: { label: 'Trapezoid', icon: '⏢', category: 'Shapes' },
    'double-circle': { label: 'Double Circle', icon: '◎', category: 'Shapes' },
    stadium: { label: 'Stadium', icon: '◯', category: 'Shapes' },
    'round-rect': { label: 'Round Rectangle', icon: '▢', category: 'Shapes' },
    rhombus: { label: 'Rhombus', icon: '◆', category: 'Shapes' },
};

// Custom Node Components with Dark Mode Support and Connection Handles
const createNodeComponent = (shape: string, lightBg: string, darkBg: string, lightBorder: string, darkBorder: string) =>
    memo(({ data, selected }: { data: any; selected: boolean }) => {
        // Check dark mode safely
        const isDark = typeof window !== 'undefined' && document.documentElement.classList.contains('dark');

        const baseStyle: React.CSSProperties = {
            backgroundColor: selected
                ? (isDark ? 'rgba(59, 130, 246, 0.2)' : lightBg)
                : (isDark ? darkBg : '#ffffff'),
            border: `2px solid ${selected ? '#3b82f6' : (isDark ? darkBorder : lightBorder)}`,
            color: isDark ? '#f1f5f9' : '#1f2937',
            minWidth: '120px',
            padding: '8px 16px',
            textAlign: 'center',
            transition: 'all 0.2s',
            boxShadow: selected
                ? (isDark ? '0 4px 6px rgba(0,0,0,0.3)' : '0 4px 6px rgba(0,0,0,0.1)')
                : (isDark ? '0 1px 2px rgba(0,0,0,0.2)' : '0 1px 2px rgba(0,0,0,0.05)'),
            position: 'relative',
        };

        const shapeStyles: Record<string, React.CSSProperties> = {
            'rounded-full': { borderRadius: '9999px' },
            'rounded-lg': { borderRadius: '8px' },
            'rounded-sm': { borderRadius: '4px' },
            'diamond': {
                clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)',
                // transform: 'rotate(45deg)', // Handling rotation via separate container or just clip-path
            },
            'parallelogram': {
                clipPath: 'polygon(25% 0%, 100% 0%, 75% 100%, 0% 100%)',
            },
            'trapezoid': {
                clipPath: 'polygon(20% 0%, 80% 0%, 100% 100%, 0% 100%)',
            },
            'hexagon': {
                clipPath: 'polygon(30% 0%, 70% 0%, 100% 50%, 70% 100%, 30% 100%, 0% 50%)',
            },
            'stadium': {
                borderRadius: '9999px',
                padding: '8px 24px',
            },
        };

        // Special handling for Diamond/Rhombus if we used rotate before
        // If using clip-path, we don't need rotate on container, but might need it for border visualization
        // The previous code had `transform: rotate(45deg)` for diamond.
        // Let's stick to the previous logic but keep it clean.

        let style = { ...baseStyle, ...(shapeStyles[shape] || {}) };

        if (shape === 'diamond') {
            style = {
                ...style,
                transform: 'rotate(45deg)',
            };
        }

        const textStyle = shape === 'diamond' ? { transform: 'rotate(-45deg)' } : {};

        const handleStyle: React.CSSProperties = {
            width: '10px',
            height: '10px',
            background: isDark ? '#3b82f6' : '#2563eb',
            border: `2px solid ${isDark ? '#ffffff' : '#ffffff'}`,
            borderRadius: '50%',
            opacity: 0.9,
            transition: 'all 0.2s',
            zIndex: 10,
        };

        // Adjust handle positions for different shapes if needed
        // Default handles: Left (target), Right (source)

        return (
            <div style={style} className={selected ? 'ring-2 ring-blue-500' : ''}>
                {/* Source Handle (Right) */}
                <Handle
                    type="source"
                    position={Position.Right}
                    style={{
                        ...handleStyle,
                        right: '-6px',
                        top: '50%',
                        transform: shape === 'diamond' ? 'translateY(-50%) rotate(-45deg)' : 'translateY(-50%)',
                    }}
                    data-tour="node-handle"
                />
                {/* Target Handle (Left) */}
                <Handle
                    type="target"
                    position={Position.Left}
                    style={{
                        ...handleStyle,
                        left: '-6px',
                        top: '50%',
                        transform: shape === 'diamond' ? 'translateY(-50%) rotate(-45deg)' : 'translateY(-50%)',
                    }}
                    data-tour="node-handle"
                />
                <div className="font-medium text-sm pointer-events-none select-none" style={textStyle}>
                    {data.label || 'Node'}
                </div>
            </div>
        );
    });

const StartNode = createNodeComponent('rounded-full', '#dbeafe', '#1e3a5f', '#9ca3af', '#475569');
const EndNode = createNodeComponent('rounded-full', '#fee2e2', '#5f1e1e', '#9ca3af', '#475569');
const ProcessNode = createNodeComponent('rounded-lg', '#eff6ff', '#1e293b', '#e5e7eb', '#475569');
const DecisionNode = createNodeComponent('diamond', '#fef3c7', '#3d2e1e', '#e5e7eb', '#475569');
const IoNode = createNodeComponent('parallelogram', '#ecfdf5', '#1e3a2e', '#10b981', '#059669');
const SubroutineNode = createNodeComponent('rounded-lg', '#f0f9ff', '#1e293b', '#cbd5e1', '#475569');
const HexagonNode = createNodeComponent('hexagon', '#f0f9ff', '#1e293b', '#cbd5e1', '#475569');
const ParallelogramNode = createNodeComponent('parallelogram', '#ecfdf5', '#1e3a2e', '#10b981', '#059669');
const TrapezoidNode = createNodeComponent('trapezoid', '#f0f9ff', '#1e293b', '#cbd5e1', '#475569');
const StadiumNode = createNodeComponent('stadium', '#f0f9ff', '#1e293b', '#cbd5e1', '#475569');
const RoundRectNode = createNodeComponent('rounded-lg', '#f0f9ff', '#1e293b', '#cbd5e1', '#475569');
const RhombusNode = createNodeComponent('diamond', '#fef3c7', '#3d2e1e', '#fbbf24', '#d97706');
const StoredDataNode = createNodeComponent('rounded-lg', '#fef3c7', '#3d2e1e', '#fbbf24', '#d97706');

const DatabaseNode = memo(({ data, selected }: { data: any; selected: boolean }) => {
    const isDark = typeof window !== 'undefined' && document.documentElement.classList.contains('dark');
    const bgColor = selected
        ? (isDark ? 'rgba(59, 130, 246, 0.2)' : '#f0f9ff')
        : (isDark ? '#1e293b' : '#ffffff');
    const borderColor = selected ? '#3b82f6' : (isDark ? '#475569' : '#cbd5e1');
    const textColor = isDark ? '#f1f5f9' : '#1f2937';
    const handleStyle = {
        width: '14px',
        height: '14px',
        background: isDark ? '#3b82f6' : '#2563eb',
        border: `3px solid ${isDark ? '#ffffff' : '#ffffff'}`,
        borderRadius: '50%',
        opacity: 0.9,
        transition: 'all 0.2s',
    };

    return (
        <div
            style={{
                backgroundColor: bgColor,
                border: `2px solid ${borderColor}`,
                borderRadius: '8px 8px 0 0',
                borderBottom: 'none',
                minWidth: '120px',
                padding: '8px 16px',
                textAlign: 'center',
                position: 'relative',
                color: textColor,
            }}
        >
            <Handle
                type="source"
                position={Position.Right}
                style={{ ...handleStyle, right: '-6px', top: '50%', transform: 'translateY(-50%)' }}
            />
            <Handle
                type="target"
                position={Position.Left}
                style={{ ...handleStyle, left: '-6px', top: '50%', transform: 'translateY(-50%)' }}
            />
            <div className="font-medium text-sm">{data.label || 'Database'}</div>
            <div style={{
                position: 'absolute',
                bottom: '-8px',
                left: '50%',
                transform: 'translateX(-50%)',
                width: '80%',
                height: '8px',
                backgroundColor: bgColor,
                border: `2px solid ${borderColor}`,
                borderTop: 'none',
                borderRadius: '0 0 4px 4px',
            }} />
        </div>
    );
});

const DocumentNode = memo(({ data, selected }: { data: any; selected: boolean }) => {
    const isDark = typeof window !== 'undefined' && document.documentElement.classList.contains('dark');
    const handleStyle = {
        width: '14px',
        height: '14px',
        background: isDark ? '#3b82f6' : '#2563eb',
        border: `3px solid ${isDark ? '#ffffff' : '#ffffff'}`,
        borderRadius: '50%',
        opacity: 0.9,
        transition: 'all 0.2s',
    };
    return (
        <div
            style={{
                backgroundColor: selected
                    ? (isDark ? 'rgba(59, 130, 246, 0.2)' : '#f0f9ff')
                    : (isDark ? '#1e293b' : '#ffffff'),
                border: `2px solid ${selected ? '#3b82f6' : (isDark ? '#475569' : '#cbd5e1')}`,
                borderRadius: '4px',
                minWidth: '120px',
                padding: '8px 16px',
                textAlign: 'center',
                position: 'relative',
                clipPath: 'polygon(0% 0%, 85% 0%, 100% 15%, 100% 100%, 0% 100%)',
                color: isDark ? '#f1f5f9' : '#1f2937',
            }}
        >
            <Handle
                type="source"
                position={Position.Right}
                style={{ ...handleStyle, right: '-6px', top: '50%', transform: 'translateY(-50%)' }}
            />
            <Handle
                type="target"
                position={Position.Left}
                style={{ ...handleStyle, left: '-6px', top: '50%', transform: 'translateY(-50%)' }}
            />
            <div className="font-medium text-sm">{data.label || 'Document'}</div>
        </div>
    );
});

const CylinderNode = memo(({ data, selected }: { data: any; selected: boolean }) => {
    const isDark = typeof window !== 'undefined' && document.documentElement.classList.contains('dark');
    const handleStyle = {
        width: '14px',
        height: '14px',
        background: isDark ? '#3b82f6' : '#2563eb',
        border: `3px solid ${isDark ? '#ffffff' : '#ffffff'}`,
        borderRadius: '50%',
        opacity: 0.9,
        transition: 'all 0.2s',
    };
    return (
        <div
            style={{
                backgroundColor: selected
                    ? (isDark ? 'rgba(59, 130, 246, 0.2)' : '#f0f9ff')
                    : (isDark ? '#1e293b' : '#ffffff'),
                border: `2px solid ${selected ? '#3b82f6' : (isDark ? '#475569' : '#cbd5e1')}`,
                borderRadius: '50% 50% 0 0',
                minWidth: '120px',
                padding: '8px 16px',
                textAlign: 'center',
                position: 'relative',
                color: isDark ? '#f1f5f9' : '#1f2937',
            }}
        >
            <Handle
                type="source"
                position={Position.Right}
                style={{ ...handleStyle, right: '-6px', top: '50%', transform: 'translateY(-50%)' }}
            />
            <Handle
                type="target"
                position={Position.Left}
                style={{ ...handleStyle, left: '-6px', top: '50%', transform: 'translateY(-50%)' }}
            />
            <div className="font-medium text-sm">{data.label || 'Cylinder'}</div>
        </div>
    );
});

const DoubleCircleNode = memo(({ data, selected }: { data: any; selected: boolean }) => {
    const isDark = typeof window !== 'undefined' && document.documentElement.classList.contains('dark');
    const bgColor = selected
        ? (isDark ? 'rgba(59, 130, 246, 0.2)' : '#f0f9ff')
        : (isDark ? '#1e293b' : '#ffffff');
    const borderColor = selected ? '#3b82f6' : (isDark ? '#475569' : '#cbd5e1');
    const textColor = isDark ? '#f1f5f9' : '#1f2937';
    const handleStyle = {
        width: '14px',
        height: '14px',
        background: isDark ? '#3b82f6' : '#2563eb',
        border: `3px solid ${isDark ? '#ffffff' : '#ffffff'}`,
        borderRadius: '50%',
        opacity: 0.9,
        transition: 'all 0.2s',
    };

    return (
        <div style={{ position: 'relative', width: '120px', height: '120px' }}>
            <Handle
                type="source"
                position={Position.Right}
                style={{ ...handleStyle, right: '-6px', top: '50%', transform: 'translateY(-50%)' }}
            />
            <Handle
                type="target"
                position={Position.Left}
                style={{ ...handleStyle, left: '-6px', top: '50%', transform: 'translateY(-50%)' }}
            />
            <div
                style={{
                    position: 'absolute',
                    inset: '8px',
                    borderRadius: '50%',
                    border: `2px solid ${borderColor}`,
                    backgroundColor: bgColor,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: textColor,
                }}
            >
                <div className="font-medium text-sm">{data.label || 'Node'}</div>
            </div>
            <div
                style={{
                    position: 'absolute',
                    inset: 0,
                    borderRadius: '50%',
                    border: `2px solid ${selected ? '#3b82f6' : (isDark ? '#64748b' : '#9ca3af')}`,
                }}
            />
        </div>
    );
});

export const nodeTypes: NodeTypes = {
    start: StartNode,
    end: EndNode,
    process: ProcessNode,
    decision: DecisionNode,
    io: IoNode,
    subroutine: SubroutineNode,
    database: DatabaseNode,
    document: DocumentNode,
    'stored-data': StoredDataNode,
    cylinder: CylinderNode,
    hexagon: HexagonNode,
    parallelogram: ParallelogramNode,
    trapezoid: TrapezoidNode,
    'double-circle': DoubleCircleNode,
    stadium: StadiumNode,
    'round-rect': RoundRectNode,
    rhombus: RhombusNode,
};
