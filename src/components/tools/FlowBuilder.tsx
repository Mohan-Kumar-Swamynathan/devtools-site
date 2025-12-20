import { useState, useCallback, useRef, useEffect } from 'react';
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  addEdge,
  BackgroundVariant,
  Panel,
  ReactFlowProvider,
  useReactFlow,
  MarkerType,
  Handle,
  type Node,
  type Edge,
  type Connection,
  type NodeTypes,
  Position,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { 
  Download, Upload, Settings, X, Check, AlertCircle, 
  FileJson, FileText, Image, FileCode, Plus, Undo2, Redo2,
  Trash2, Search, ChevronDown, ChevronRight, GripVertical,
  Layout, Copy, Edit2, Save, Loader2, ClipboardPaste
} from 'lucide-react';
import type { FlowDiagram, FlowNode, FlowEdge, FlowValidationWarning, NodeType } from '@/lib/flow/types';
import { saveDiagram, loadDiagram, createNewDiagram, listDiagrams } from '@/lib/flow/storage';
import { exportToMermaid, importFromMermaid } from '@/lib/flow/mermaid';
import { autoLayout, centerDiagram } from '@/lib/flow/layout';
import { validateFlow } from '@/lib/flow/validation';
import { v4 as uuidv4 } from 'uuid';
import { useToast } from '@/hooks/useToast';
import Toast from '@/components/common/Toast';
import TourGuide, { type TourStep } from '@/components/common/TourGuide';

// Node Type Definitions
const NODE_TYPES_INFO: Record<NodeType, { label: string; icon: string; category: string }> = {
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
  ({ data, selected }: { data: any; selected: boolean }) => {
    const isDark = typeof window !== 'undefined' && document.documentElement.classList.contains('dark');
    const baseStyle = {
      backgroundColor: selected 
        ? (isDark ? 'rgba(59, 130, 246, 0.2)' : lightBg)
        : (isDark ? darkBg : '#ffffff'),
      border: `2px solid ${selected ? '#3b82f6' : (isDark ? darkBorder : lightBorder)}`,
      color: isDark ? '#f1f5f9' : '#1f2937',
      minWidth: '120px',
      padding: '8px 16px',
      textAlign: 'center' as const,
      transition: 'all 0.2s',
      boxShadow: selected 
        ? (isDark ? '0 4px 6px rgba(0,0,0,0.3)' : '0 4px 6px rgba(0,0,0,0.1)')
        : (isDark ? '0 1px 2px rgba(0,0,0,0.2)' : '0 1px 2px rgba(0,0,0,0.05)'),
      position: 'relative' as const,
    };

    const shapeStyles: Record<string, any> = {
      'rounded-full': { borderRadius: '9999px' },
      'rounded-lg': { borderRadius: '8px' },
      'rounded-sm': { borderRadius: '4px' },
      'diamond': { 
        clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)',
        transform: 'rotate(45deg)',
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

    const style = { ...baseStyle, ...(shapeStyles[shape] || {}) };
    const textStyle = shape === 'diamond' ? { transform: 'rotate(-45deg)' } : {};
    const handleStyle = {
      width: '10px',
      height: '10px',
      background: isDark ? '#3b82f6' : '#2563eb',
      border: `2px solid ${isDark ? '#ffffff' : '#ffffff'}`,
      borderRadius: '50%',
      opacity: 0.9,
      transition: 'all 0.2s',
    };

    return (
      <div style={style} className={selected ? 'ring-2 ring-blue-500' : ''}>
        {/* Source Handle (Right side - for outgoing connections) */}
        <Handle
          type="source"
          position={Position.Right}
          style={{
            ...handleStyle,
            right: '-6px',
            top: '50%',
            transform: 'translateY(-50%)',
          }}
          data-tour="node-handle"
        />
        {/* Target Handle (Left side - for incoming connections) */}
        <Handle
          type="target"
          position={Position.Left}
          style={{
            ...handleStyle,
            left: '-6px',
            top: '50%',
            transform: 'translateY(-50%)',
          }}
          data-tour="node-handle"
        />
        <div className="font-medium text-sm" style={textStyle}>
          {data.label || 'Node'}
        </div>
      </div>
    );
  };

const StartNode = createNodeComponent('rounded-full', '#dbeafe', '#1e3a5f', '#9ca3af', '#475569');
const EndNode = createNodeComponent('rounded-full', '#fee2e2', '#5f1e1e', '#9ca3af', '#475569');
const ProcessNode = createNodeComponent('rounded-lg', '#eff6ff', '#1e293b', '#e5e7eb', '#475569');
const DecisionNode = createNodeComponent('diamond', '#fef3c7', '#3d2e1e', '#e5e7eb', '#475569');
const IoNode = createNodeComponent('parallelogram', '#ecfdf5', '#1e3a2e', '#10b981', '#059669');
const SubroutineNode = createNodeComponent('rounded-lg', '#f0f9ff', '#1e293b', '#cbd5e1', '#475569');
const DatabaseNode = ({ data, selected }: { data: any; selected: boolean }) => {
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
        style={{
          ...handleStyle,
          right: '-6px',
          top: '50%',
          transform: 'translateY(-50%)',
        }}
      />
      <Handle
        type="target"
        position={Position.Left}
        style={{
          ...handleStyle,
          left: '-6px',
          top: '50%',
          transform: 'translateY(-50%)',
        }}
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
};

const DocumentNode = ({ data, selected }: { data: any; selected: boolean }) => {
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
        style={{
          ...handleStyle,
          right: '-6px',
          top: '50%',
          transform: 'translateY(-50%)',
        }}
      />
      <Handle
        type="target"
        position={Position.Left}
        style={{
          ...handleStyle,
          left: '-6px',
          top: '50%',
          transform: 'translateY(-50%)',
        }}
      />
      <div className="font-medium text-sm">{data.label || 'Document'}</div>
    </div>
  );
};

const StoredDataNode = createNodeComponent('rounded-lg', '#fef3c7', '#3d2e1e', '#fbbf24', '#d97706');
const CylinderNode = ({ data, selected }: { data: any; selected: boolean }) => {
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
        style={{
          ...handleStyle,
          right: '-6px',
          top: '50%',
          transform: 'translateY(-50%)',
        }}
      />
      <Handle
        type="target"
        position={Position.Left}
        style={{
          ...handleStyle,
          left: '-6px',
          top: '50%',
          transform: 'translateY(-50%)',
        }}
      />
      <div className="font-medium text-sm">{data.label || 'Cylinder'}</div>
    </div>
  );
};

const HexagonNode = createNodeComponent('hexagon', '#f0f9ff', '#1e293b', '#cbd5e1', '#475569');
const ParallelogramNode = createNodeComponent('parallelogram', '#ecfdf5', '#1e3a2e', '#10b981', '#059669');
const TrapezoidNode = createNodeComponent('trapezoid', '#f0f9ff', '#1e293b', '#cbd5e1', '#475569');
const DoubleCircleNode = ({ data, selected }: { data: any; selected: boolean }) => {
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
        style={{
          ...handleStyle,
          right: '-6px',
          top: '50%',
          transform: 'translateY(-50%)',
        }}
      />
      <Handle
        type="target"
        position={Position.Left}
        style={{
          ...handleStyle,
          left: '-6px',
          top: '50%',
          transform: 'translateY(-50%)',
        }}
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
};

const StadiumNode = createNodeComponent('stadium', '#f0f9ff', '#1e293b', '#cbd5e1', '#475569');
const RoundRectNode = createNodeComponent('rounded-lg', '#f0f9ff', '#1e293b', '#cbd5e1', '#475569');
const RhombusNode = createNodeComponent('diamond', '#fef3c7', '#3d2e1e', '#fbbf24', '#d97706');

const nodeTypes: NodeTypes = {
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

// History for undo/redo
interface HistoryState {
  nodes: Node[];
  edges: Edge[];
}

function FlowBuilderInner() {
  const [error, setError] = useState<string | null>(null);
  const reactFlowInstance = useReactFlow();
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [currentDiagram, setCurrentDiagram] = useState<FlowDiagram | null>(null);
  const [saveStatus, setSaveStatus] = useState<'saved' | 'unsaved'>('saved');
  const [validation, setValidation] = useState<{ isValid: boolean; warnings: FlowValidationWarning[] }>({
    isValid: true,
    warnings: [],
  });
  const [showSettings, setShowSettings] = useState(false);
  const [developerMode, setDeveloperMode] = useState(false);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [editingNode, setEditingNode] = useState<string | null>(null);
  const [editingEdge, setEditingEdge] = useState<string | null>(null);
  const [editingLabel, setEditingLabel] = useState('');
  const [editingTitle, setEditingTitle] = useState(false);
  const [diagramTitle, setDiagramTitle] = useState('Untitled Flow');
  const [showNodeMenu, setShowNodeMenu] = useState(false);
  const [nodeMenuPosition, setNodeMenuPosition] = useState<{ x: number; y: number; flowX?: number; flowY?: number }>({ x: 0, y: 0 });
  const [showAddNodeMenu, setShowAddNodeMenu] = useState(false);
  const [dismissedWarnings, setDismissedWarnings] = useState<Set<string>>(new Set());
  const [showValidation, setShowValidation] = useState(true);
  const [showSidebar, setShowSidebar] = useState(true);
  const [sidebarSearch, setSidebarSearch] = useState('');
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set(['Flow', 'Data', 'Shapes']));
  const [draggedNodeType, setDraggedNodeType] = useState<NodeType | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [layoutDirection, setLayoutDirection] = useState<'TD' | 'LR'>('TD');
  const [containerHeight, setContainerHeight] = useState('600px');
  const [isMounted, setIsMounted] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const autosaveTimeoutRef = useRef<NodeJS.Timeout>();
  const { toast, showToast, hideToast, success, error: showError } = useToast();
  
  // Undo/Redo History
  const [history, setHistory] = useState<HistoryState[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const maxHistorySize = 50;

  // Save state to history
  const saveToHistory = useCallback((nodes: Node[], edges: Edge[]) => {
    setHistory(prev => {
      const currentIndex = historyIndex >= 0 ? historyIndex : prev.length - 1;
      const newHistory = prev.slice(0, currentIndex + 1);
      newHistory.push({ nodes: JSON.parse(JSON.stringify(nodes)), edges: JSON.parse(JSON.stringify(edges)) });
      if (newHistory.length > maxHistorySize) {
        newHistory.shift();
        setHistoryIndex(newHistory.length - 1);
      } else {
        setHistoryIndex(newHistory.length - 1);
      }
      return newHistory;
    });
  }, [historyIndex, maxHistorySize]);

  // Undo
  const handleUndo = useCallback(() => {
    if (historyIndex > 0) {
      const prevState = history[historyIndex - 1];
      setNodes(prevState.nodes);
      setEdges(prevState.edges);
      setHistoryIndex(historyIndex - 1);
    }
  }, [history, historyIndex, setNodes, setEdges]);

  // Redo
  const handleRedo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      const nextState = history[historyIndex + 1];
      setNodes(nextState.nodes);
      setEdges(nextState.edges);
      setHistoryIndex(historyIndex + 1);
    }
  }, [history, historyIndex, setNodes, setEdges]);

  // Delete selected nodes/edges
  const handleDelete = useCallback(() => {
    const selectedNodes = nodes.filter(n => n.selected);
    const selectedEdges = edges.filter(e => e.selected);
    
    if (selectedNodes.length > 0 || selectedEdges.length > 0) {
      saveToHistory(nodes, edges);
      setNodes(prev => prev.filter(n => !n.selected));
      setEdges(prev => prev.filter(e => !e.selected && !selectedNodes.some(n => n.id === e.source || n.id === e.target)));
    }
  }, [nodes, edges, setNodes, setEdges, saveToHistory]);

  // Handle copy/paste
  const handleCopy = useCallback(() => {
    const selectedNodes = nodes.filter(n => n.selected);
    if (selectedNodes.length === 0) {
      showToast('Select nodes to copy', 'info');
      return;
    }
    
    const data = {
      nodes: selectedNodes.map(n => ({
        id: n.id,
        type: n.type,
        position: n.position,
        data: n.data,
      })),
      edges: edges.filter(e => 
        selectedNodes.some(n => n.id === e.source || n.id === e.target)
      ).map(e => ({
        id: e.id,
        source: e.source,
        target: e.target,
        label: typeof e.label === 'string' ? e.label : undefined,
      })),
    };
    
    navigator.clipboard.writeText(JSON.stringify(data));
    success(`Copied ${selectedNodes.length} node(s)`);
  }, [nodes, edges, success, showToast]);

  const handlePaste = useCallback(() => {
    navigator.clipboard.readText().then(text => {
      try {
        const data = JSON.parse(text);
        if (data.nodes && Array.isArray(data.nodes)) {
          const offset = 50;
          const newNodes = data.nodes.map((node: any) => ({
            ...node,
            id: `node-${uuidv4()}`,
            position: {
              x: node.position.x + offset,
              y: node.position.y + offset,
            },
            selected: false,
          }));
          
          const nodeIdMap = new Map(data.nodes.map((n: any, i: number) => [n.id, newNodes[i].id]));
          
          const newEdges = (data.edges || []).map((edge: any) => ({
            ...edge,
            id: `edge-${uuidv4()}`,
            source: nodeIdMap.get(edge.source) || edge.source,
            target: nodeIdMap.get(edge.target) || edge.target,
            type: 'smoothstep',
            label: typeof edge.label === 'string' ? edge.label : undefined,
          }));
          
          saveToHistory(nodes, edges);
          setNodes([...nodes, ...newNodes]);
          setEdges([...edges, ...newEdges]);
          success(`Pasted ${newNodes.length} node(s)`);
        } else {
          showError('Invalid clipboard data');
        }
      } catch (error) {
        showError('Failed to paste. Invalid data.');
      }
    }).catch(() => {
      showError('Failed to read clipboard');
    });
  }, [nodes, edges, setNodes, setEdges, saveToHistory, success, showError]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        handleUndo();
      } else if ((e.metaKey || e.ctrlKey) && (e.key === 'y' || (e.key === 'z' && e.shiftKey))) {
        e.preventDefault();
        handleRedo();
      } else if ((e.metaKey || e.ctrlKey) && e.key === 'c') {
        if (document.activeElement?.tagName !== 'INPUT' && document.activeElement?.tagName !== 'TEXTAREA') {
          e.preventDefault();
          handleCopy();
        }
      } else if ((e.metaKey || e.ctrlKey) && e.key === 'v') {
        if (document.activeElement?.tagName !== 'INPUT' && document.activeElement?.tagName !== 'TEXTAREA') {
          e.preventDefault();
          handlePaste();
        }
      } else if (e.key === 'Delete' || e.key === 'Backspace') {
        if (document.activeElement?.tagName !== 'INPUT' && document.activeElement?.tagName !== 'TEXTAREA') {
          e.preventDefault();
          handleDelete();
        }
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleUndo, handleRedo, handleDelete, handleCopy, handlePaste]);

  // Initialize with new diagram
  useEffect(() => {
    const init = async () => {
      try {
        const newDiagram = await createNewDiagram('Untitled Flow');
        setCurrentDiagram(newDiagram);
        setDiagramTitle(newDiagram.metadata.title);
        // Initialize history with empty state
        setHistory([{ nodes: [], edges: [] }]);
        setHistoryIndex(0);
        setError(null);
      } catch (error) {
        console.error('Failed to initialize diagram:', error);
        setError('Failed to initialize. Using local mode.');
        // Fallback: create diagram without storage
        setCurrentDiagram({
          id: `flow-${Date.now()}`,
          metadata: {
            title: 'Untitled Flow',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
          nodes: [],
          edges: [],
        });
        setDiagramTitle('Untitled Flow');
        setHistory([{ nodes: [], edges: [] }]);
        setHistoryIndex(0);
      }
    };
    init();
  }, []);

  // Handle auto-layout
  const handleAutoLayout = useCallback(() => {
    if (nodes.length === 0) {
      showToast('Add some nodes first to use auto-layout', 'info');
      return;
    }
    
    saveToHistory(nodes, edges);
    
    const flowNodes: FlowNode[] = nodes.map(n => ({
      id: n.id,
      type: n.type as any,
      position: n.position,
      data: { label: n.data.label || '', description: n.data.description },
    }));
    const flowEdges: FlowEdge[] = edges.map(e => ({
      id: e.id,
      source: e.source,
      target: e.target,
      label: typeof e.label === 'string' ? e.label : undefined,
    }));
    
    const laidOutNodes = centerDiagram(autoLayout(flowNodes, flowEdges, layoutDirection));
    
    setNodes(laidOutNodes.map(n => ({
      id: n.id,
      type: n.type,
      position: n.position,
      data: { label: n.data.label || '', description: n.data.description },
    })));
    
    setTimeout(() => {
      reactFlowInstance?.fitView({ padding: 0.2, maxZoom: 1.5 });
    }, 100);
    
    success('Layout applied successfully');
  }, [nodes, edges, layoutDirection, setNodes, reactFlowInstance, saveToHistory, success, showToast]);

  // Track previous state to avoid saving duplicate history
  const prevStateRef = useRef<{ nodes: Node[]; edges: Edge[] }>({ nodes: [], edges: [] });
  const isInitialMount = useRef(true);
  
  // Save to history on significant changes (debounced)
  useEffect(() => {
    // Skip on initial mount
    if (isInitialMount.current) {
      isInitialMount.current = false;
      prevStateRef.current = { nodes: [...nodes], edges: [...edges] };
      return;
    }

    const nodesChanged = JSON.stringify(nodes.map(n => ({ id: n.id, type: n.type, position: n.position, data: n.data }))) 
      !== JSON.stringify(prevStateRef.current.nodes.map(n => ({ id: n.id, type: n.type, position: n.position, data: n.data })));
    const edgesChanged = JSON.stringify(edges.map(e => ({ id: e.id, source: e.source, target: e.target, label: e.label })))
      !== JSON.stringify(prevStateRef.current.edges.map(e => ({ id: e.id, source: e.source, target: e.target, label: e.label })));
    
    if (nodesChanged || edgesChanged) {
      const timeout = setTimeout(() => {
        // Only save if state actually changed
        const currentState = { nodes: nodes.map(n => ({ id: n.id, type: n.type, position: n.position, data: n.data })), 
                              edges: edges.map(e => ({ id: e.id, source: e.source, target: e.target, label: e.label })) };
        const prevState = { nodes: prevStateRef.current.nodes.map(n => ({ id: n.id, type: n.type, position: n.position, data: n.data })),
                           edges: prevStateRef.current.edges.map(e => ({ id: e.id, source: e.source, target: e.target, label: e.label })) };
        
        if (JSON.stringify(currentState) !== JSON.stringify(prevState)) {
          saveToHistory(nodes, edges);
          prevStateRef.current = { nodes: [...nodes], edges: [...edges] };
        }
      }, 800);
      return () => clearTimeout(timeout);
    }
  }, [nodes, edges, saveToHistory]);

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showExportMenu || showAddNodeMenu || showNodeMenu) {
        const target = event.target as HTMLElement;
        if (!target.closest('.menu-container') && !target.closest('button')) {
          setShowExportMenu(false);
          setShowAddNodeMenu(false);
          setShowNodeMenu(false);
        }
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showExportMenu, showAddNodeMenu, showNodeMenu]);

  // Validate on changes
  useEffect(() => {
    const flowNodes: FlowNode[] = nodes.map(n => ({
      id: n.id,
      type: n.type as any,
      position: n.position,
      data: { label: n.data.label || '', description: n.data.description },
    }));
    const flowEdges: FlowEdge[] = edges.map(e => ({
      id: e.id,
      source: e.source,
      target: e.target,
      label: typeof e.label === 'string' ? e.label : undefined,
    }));
    const validationResult = validateFlow(flowNodes, flowEdges);
    
    const activeWarnings = validationResult.warnings.filter(w => {
      const key = `${w.type}-${w.nodeId || w.edgeId || 'global'}`;
      return !dismissedWarnings.has(key);
    });
    
    const groupedWarnings: FlowValidationWarning[] = [];
    const seenTypes = new Set<string>();
    
    activeWarnings.forEach(warning => {
      if (warning.type === 'missing_start' || warning.type === 'missing_end') {
        if (!seenTypes.has(warning.type)) {
          groupedWarnings.push(warning);
          seenTypes.add(warning.type);
        }
      } else {
        const typeCount = groupedWarnings.filter(w => w.type === warning.type).length;
        if (typeCount < 3) {
          groupedWarnings.push(warning);
        }
      }
    });
    
    setValidation({
      isValid: groupedWarnings.length === 0,
      warnings: groupedWarnings,
    });
  }, [nodes, edges, dismissedWarnings]);

  // Fit view when nodes are first added or loaded
  useEffect(() => {
    if (reactFlowInstance && nodes.length > 0) {
      // Small delay to ensure ReactFlow has rendered
      const timeout = setTimeout(() => {
        reactFlowInstance.fitView({ padding: 0.2, maxZoom: 1.5 });
      }, 100);
      return () => clearTimeout(timeout);
    }
  }, [reactFlowInstance, nodes.length]);

  // Autosave
  useEffect(() => {
    if (!currentDiagram) return;
    
    if (autosaveTimeoutRef.current) {
      clearTimeout(autosaveTimeoutRef.current);
    }

    autosaveTimeoutRef.current = setTimeout(async () => {
      if (currentDiagram) {
        const updatedDiagram: FlowDiagram = {
          ...currentDiagram,
          nodes: nodes.map(n => ({
            id: n.id,
            type: n.type as any,
            position: n.position,
            data: { label: n.data.label || '', description: n.data.description },
          })),
          edges: edges.map(e => ({
            id: e.id,
            source: e.source,
            target: e.target,
            label: typeof e.label === 'string' ? e.label : undefined,
          })),
        };
        await saveDiagram(updatedDiagram);
        setCurrentDiagram(updatedDiagram);
        setSaveStatus('saved');
      }
    }, 500);

    setSaveStatus('unsaved');

    return () => {
      if (autosaveTimeoutRef.current) {
        clearTimeout(autosaveTimeoutRef.current);
      }
    };
  }, [nodes, edges, currentDiagram]);

  // Calculate dynamic height for production compatibility
  useEffect(() => {
    const calculateHeight = () => {
      const headerHeight = 64;
      const footerHeight = 80;
      const height = window.innerHeight - headerHeight - footerHeight;
      setContainerHeight(`${Math.max(600, height)}px`);
    };
    calculateHeight();
    setIsMounted(true);
    window.addEventListener('resize', calculateHeight);
    return () => window.removeEventListener('resize', calculateHeight);
  }, []);

  const onConnect = useCallback(
    (params: Connection) => {
      const edgeColor = typeof window !== 'undefined' && document.documentElement.classList.contains('dark')
        ? '#64748b'
        : '#475569';
      const newEdge = {
        ...params,
        id: `edge-${uuidv4()}`,
        type: 'smoothstep',
        animated: false,
        style: {
          stroke: edgeColor,
          strokeWidth: 2,
        },
        markerEnd: {
          type: MarkerType.ArrowClosed,
        } as any,
      };
      setEdges((eds) => addEdge(newEdge, eds));
    },
    [setEdges]
  );

  const addNode = useCallback((type: NodeType, position: { x: number; y: number }) => {
    const newNode: Node = {
      id: `node-${uuidv4()}`,
      type,
      position,
      data: { label: NODE_TYPES_INFO[type]?.label || type },
      // Add connection handles for easy connecting
      sourcePosition: Position.Right,
      targetPosition: Position.Left,
    };
    setNodes((nds) => [...nds, newNode]);
  }, [setNodes]);

  const handleCanvasClick = useCallback((event: React.MouseEvent) => {
    // Only add node if clicking directly on the pane (not on controls or panels)
    const target = event.target as HTMLElement;
    // Check if clicking on pane or background, but not on nodes, edges, or controls
    if (target && (
      target.classList.contains('react-flow__pane') || 
      target.closest('.react-flow__pane') ||
      target.classList.contains('react-flow__background')
    )) {
      // Don't add node if clicking on controls or panels
      if (target.closest('.react-flow__controls') || 
          target.closest('.react-flow__minimap') ||
          target.closest('.react-flow__panel') ||
          target.closest('.menu-container')) {
        return;
      }
      
      try {
        if (reactFlowInstance) {
          const position = reactFlowInstance.screenToFlowPosition({
            x: event.clientX,
            y: event.clientY,
          });
          addNode('process', position);
        } else {
          // Fallback if reactFlowInstance is not ready
          const reactFlowElement = target.closest('.react-flow');
          if (reactFlowElement) {
            const bounds = reactFlowElement.getBoundingClientRect();
            addNode('process', { 
              x: event.clientX - bounds.left - bounds.width / 2, 
              y: event.clientY - bounds.top - bounds.height / 2 
            });
          } else {
            addNode('process', { x: 0, y: 0 });
          }
        }
      } catch (error) {
        console.error('Error adding node:', error);
        // Fallback: add at click position relative to viewport
        const reactFlowElement = target.closest('.react-flow');
        if (reactFlowElement) {
          const bounds = reactFlowElement.getBoundingClientRect();
          addNode('process', { x: event.clientX - bounds.left - 200, y: event.clientY - bounds.top - 150 });
        } else {
          addNode('process', { x: 0, y: 0 });
        }
      }
    }
  }, [addNode, reactFlowInstance]);

  // Handle drag from sidebar
  const handleDragStart = (e: React.DragEvent, nodeType: NodeType) => {
    setDraggedNodeType(nodeType);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('application/reactflow', nodeType);
    e.dataTransfer.setData('text/plain', nodeType);
  };

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    e.dataTransfer.dropEffect = 'move';
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const nodeType = draggedNodeType || (e.dataTransfer.getData('application/reactflow') as NodeType) || (e.dataTransfer.getData('text/plain') as NodeType);
    
    if (nodeType && Object.keys(NODE_TYPES_INFO).includes(nodeType)) {
      try {
        if (reactFlowInstance) {
          const position = reactFlowInstance.screenToFlowPosition({
            x: e.clientX,
            y: e.clientY,
          });
          addNode(nodeType as NodeType, position);
        } else {
          // Fallback if reactFlowInstance is not ready
          const reactFlowElement = e.currentTarget.closest('.react-flow');
          if (reactFlowElement) {
            const bounds = reactFlowElement.getBoundingClientRect();
            addNode(nodeType as NodeType, {
              x: e.clientX - bounds.left - bounds.width / 2,
              y: e.clientY - bounds.top - bounds.height / 2,
            });
          } else {
            addNode(nodeType as NodeType, { x: 0, y: 0 });
          }
        }
      } catch (err) {
        console.error('Error getting drop position:', err);
        // Fallback: use relative position
        const reactFlowElement = e.currentTarget.closest('.react-flow');
        if (reactFlowElement) {
          const bounds = reactFlowElement.getBoundingClientRect();
          addNode(nodeType as NodeType, {
            x: e.clientX - bounds.left - bounds.width / 2,
            y: e.clientY - bounds.top - bounds.height / 2,
          });
        } else {
          addNode(nodeType as NodeType, { x: 0, y: 0 });
        }
      }
      setDraggedNodeType(null);
    }
  }, [draggedNodeType, reactFlowInstance, addNode]);

  const handleExport = async (format: 'json' | 'mermaid' | 'png' | 'svg') => {
    if (!currentDiagram) return;

    setIsLoading(true);
    try {
      if (format === 'json') {
      const diagram: FlowDiagram = {
        ...currentDiagram,
        nodes: nodes.map(n => ({
          id: n.id,
          type: n.type as any,
          position: n.position,
          data: { label: n.data.label || '', description: n.data.description },
        })),
        edges: edges.map(e => ({
          id: e.id,
          source: e.source,
          target: e.target,
          label: typeof e.label === 'string' ? e.label : undefined,
        })),
      };
      const blob = new Blob([JSON.stringify(diagram, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${currentDiagram.metadata.title || 'flow'}.flow.json`;
      a.click();
      URL.revokeObjectURL(url);
      success('Diagram exported as JSON');
    } else if (format === 'mermaid') {
      const diagram: FlowDiagram = {
        ...currentDiagram,
        nodes: nodes.map(n => ({
          id: n.id,
          type: n.type as any,
          position: n.position,
          data: { label: n.data.label || '', description: n.data.description },
        })),
        edges: edges.map(e => ({
          id: e.id,
          source: e.source,
          target: e.target,
          label: typeof e.label === 'string' ? e.label : undefined,
        })),
      };
      const mermaidCode = exportToMermaid(diagram);
      const blob = new Blob([mermaidCode], { type: 'text/markdown' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${currentDiagram.metadata.title || 'flow'}.md`;
      a.click();
      URL.revokeObjectURL(url);
      success('Diagram exported as Mermaid');
    } else if (format === 'png' || format === 'svg') {
      if (!reactFlowInstance) {
        showError('Canvas not ready. Please try again.');
        setIsLoading(false);
        return;
      }
      try {
        // Use getViewport to get the viewport, then use a canvas approach
        const viewport = reactFlowInstance.getViewport();
        const dataUrl = await (reactFlowInstance as any).toImage({ 
          format, 
          quality: 1,
          backgroundColor: typeof window !== 'undefined' && document.documentElement.classList.contains('dark') 
            ? '#1e293b' 
            : '#ffffff'
        }).catch(() => {
          // Fallback if toImage doesn't exist
          throw new Error('Image export not available');
        });
        const a = document.createElement('a');
        a.href = dataUrl;
        a.download = `${currentDiagram.metadata.title || 'flow'}.${format}`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        success(`Diagram exported as ${format.toUpperCase()}`);
      } catch (error) {
        console.error('Export error:', error);
        showError('Failed to export image. Please try again.');
      }
    }
    setShowExportMenu(false);
    } catch (error) {
      console.error('Export error:', error);
      showError('Failed to export diagram');
    } finally {
      setIsLoading(false);
    }
  };

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsLoading(true);
    try {
      const text = await file.text();
      
      if (file.name.endsWith('.flow.json')) {
        try {
          const diagram: FlowDiagram = JSON.parse(text);
          setCurrentDiagram(diagram);
          setDiagramTitle(diagram.metadata.title);
          setNodes(diagram.nodes.map(n => ({
            id: n.id,
            type: n.type,
            position: n.position,
            data: { label: n.data.label || '', description: n.data.description },
          })));
          setEdges(diagram.edges.map(e => ({
            id: e.id,
            source: e.source,
            target: e.target,
            label: e.label,
            type: 'smoothstep',
          })));
          saveToHistory(diagram.nodes.map(n => ({
            id: n.id,
            type: n.type,
            position: n.position,
            data: { label: n.data.label || '', description: n.data.description },
          })) as Node[], diagram.edges.map(e => ({
            id: e.id,
            source: e.source,
            target: e.target,
            label: e.label,
            type: 'smoothstep',
          })) as Edge[]);
          setTimeout(() => {
            reactFlowInstance?.fitView({ padding: 0.2, maxZoom: 1.5 });
          }, 100);
          success('Diagram imported successfully');
        } catch (error) {
          showError('Failed to import JSON file. Invalid format.');
        }
      } else if (file.name.endsWith('.md')) {
        try {
          const result = await importFromMermaid(text);
          if (result.errors.length > 0) {
            showError(`Import completed with warnings: ${result.errors.join(', ')}`);
          }
          const laidOutNodes = centerDiagram(autoLayout(result.nodes, result.edges));
          const importedNodes = laidOutNodes.map(n => ({
            id: n.id,
            type: n.type,
            position: n.position,
            data: { label: n.data.label || '', description: n.data.description },
          }));
          const importedEdges = result.edges.map(e => ({
            id: e.id,
            source: e.source,
            target: e.target,
            label: e.label,
            type: 'smoothstep',
          }));
          setNodes(importedNodes);
          setEdges(importedEdges);
          saveToHistory(importedNodes as Node[], importedEdges as Edge[]);
          setTimeout(() => {
            reactFlowInstance?.fitView({ padding: 0.2, maxZoom: 1.5 });
          }, 100);
          success('Mermaid diagram imported successfully');
        } catch (error) {
          showError('Failed to import Mermaid file. Invalid format.');
        }
      }
    } finally {
      setIsLoading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleNodeDoubleClick = useCallback((event: React.MouseEvent, node: Node) => {
    setEditingNode(node.id);
    setEditingLabel(node.data.label || '');
  }, []);

  const handleEdgeDoubleClick = useCallback((event: React.MouseEvent, edge: Edge) => {
    setEditingEdge(edge.id);
    setEditingLabel(typeof edge.label === 'string' ? edge.label : '');
  }, []);

  const handleLabelSubmit = useCallback(() => {
    if (editingNode) {
      setNodes((nds) =>
        nds.map((node) =>
          node.id === editingNode
            ? { ...node, data: { ...node.data, label: editingLabel } }
            : node
        )
      );
      setEditingNode(null);
      setEditingLabel('');
      success('Node label updated');
    } else if (editingEdge) {
      setEdges((eds) =>
        eds.map((edge) =>
          edge.id === editingEdge
            ? { ...edge, label: editingLabel || undefined }
            : edge
        )
      );
      setEditingEdge(null);
      setEditingLabel('');
      success('Edge label updated');
    }
  }, [editingNode, editingEdge, editingLabel, setNodes, setEdges, success]);

  const handleTitleSave = useCallback(async () => {
    if (!currentDiagram) return;
    
    setIsLoading(true);
    try {
      const updatedDiagram = {
        ...currentDiagram,
        metadata: {
          ...currentDiagram.metadata,
          title: diagramTitle,
          updatedAt: new Date().toISOString(),
        },
      };
      await saveDiagram(updatedDiagram);
      setCurrentDiagram(updatedDiagram);
      setEditingTitle(false);
      success('Diagram title saved');
    } catch (error) {
      showError('Failed to save title');
    } finally {
      setIsLoading(false);
    }
  }, [currentDiagram, diagramTitle, success, showError]);

  const handleCanvasRightClick = useCallback((event: any) => {
    event.preventDefault();
    try {
      if (reactFlowInstance) {
        const flowPosition = reactFlowInstance.screenToFlowPosition({
          x: event.clientX,
          y: event.clientY,
        });
        setNodeMenuPosition({
          x: event.clientX,
          y: event.clientY,
          flowX: flowPosition.x,
          flowY: flowPosition.y,
        } as any);
      } else {
        setNodeMenuPosition({
          x: event.clientX,
          y: event.clientY,
          flowX: 0,
          flowY: 0,
        } as any);
      }
    } catch (e) {
      console.error('Error getting flow position:', e);
      setNodeMenuPosition({
        x: event.clientX,
        y: event.clientY,
        flowX: 0,
        flowY: 0,
      } as any);
    }
    setShowNodeMenu(true);
  }, [reactFlowInstance]);

  // Group nodes by category
  const nodesByCategory = Object.entries(NODE_TYPES_INFO).reduce((acc, [type, info]) => {
    if (!acc[info.category]) acc[info.category] = [];
    acc[info.category].push({ type: type as NodeType, ...info });
    return acc;
  }, {} as Record<string, Array<{ type: NodeType; label: string; icon: string; category: string }>>);

  // Filter nodes by search
  const filteredNodesByCategory = Object.entries(nodesByCategory).reduce((acc, [category, nodes]) => {
    const filtered = nodes.filter(n => 
      n.label.toLowerCase().includes(sidebarSearch.toLowerCase()) ||
      n.type.toLowerCase().includes(sidebarSearch.toLowerCase())
    );
    if (filtered.length > 0) acc[category] = filtered;
    return acc;
  }, {} as Record<string, Array<{ type: NodeType; label: string; icon: string; category: string }>>);

  if (error) {
    return (
      <div className="h-[calc(100vh-200px)] min-h-[800px] flex items-center justify-center">
        <div className="text-center p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <AlertCircle className="mx-auto mb-2 text-yellow-600" size={24} />
          <p className="text-sm text-yellow-800">{error}</p>
          <p className="text-xs text-yellow-700 mt-2">The tool will work in local mode.</p>
        </div>
      </div>
    );
  }

  // Tour guide steps
  const tourSteps: TourStep[] = [
    {
      target: '[data-tour="sidebar"]',
      title: 'Node Library',
      content: 'Drag nodes from here onto the canvas to add them to your flowchart. You can search for specific node types using the search bar.',
      position: 'right',
    },
    {
      target: '[data-tour="canvas"]',
      title: 'Canvas',
      content: 'This is your workspace. Click anywhere to add nodes, or drag from the blue handles on nodes to connect them together.',
      position: 'center',
    },
    {
      target: '[data-tour="toolbar"]',
      title: 'Toolbar',
      content: 'Use these tools to save, load, export, and manage your diagrams. The auto-layout button will automatically arrange your nodes.',
      position: 'bottom',
    },
    {
      target: '[data-tour="node-handle"]',
      title: 'Connection Handles',
      content: 'Drag from the blue dot on the right side of a node to the blue dot on the left side of another node to create connections.',
      position: 'right',
    },
  ];

  return (
    <div data-flow-main className="relative flex flex-col w-full" style={{ height: containerHeight, minHeight: '600px' }}>
      {/* Tour Guide */}
      <TourGuide 
        steps={tourSteps} 
        storageKey="flow-builder-tour-completed"
      />

      {/* Sidebar */}
      {showSidebar && (
        <div 
          data-tour="sidebar"
          className="w-64 border-r flex-shrink-0 flex flex-col" 
          style={{ 
            borderColor: 'var(--border-primary)',
            backgroundColor: 'var(--bg-elevated)',
            color: 'var(--text-primary)',
          }}
        >
          {/* Sidebar Header */}
          <div className="p-3 border-b" style={{ borderColor: 'var(--border-primary)' }}>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2 flex-1">
                <Search size={16} style={{ color: 'var(--text-muted)' }} />
              <input
                type="text"
                placeholder="Type / to search"
                value={sidebarSearch}
                onChange={(e) => setSidebarSearch(e.target.value)}
                className="flex-1 text-sm px-2 py-1 border rounded"
                style={{ 
                  borderColor: 'var(--border-primary)',
                  backgroundColor: 'var(--bg-primary)',
                  color: 'var(--text-primary)',
                }}
              />
              </div>
              <button
                onClick={() => setShowSidebar(false)}
                className="md:hidden p-1 rounded hover:bg-opacity-20 transition-colors"
                style={{ color: 'var(--text-muted)' }}
                aria-label="Close sidebar"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Node Categories */}
          <div className="flex-1 overflow-y-auto p-2">
            {Object.entries(filteredNodesByCategory).map(([category, categoryNodes]) => (
              <div key={category} className="mb-4">
                <button
                  onClick={() => {
                    setExpandedCategories(prev => {
                      const next = new Set(prev);
                      if (next.has(category)) {
                        next.delete(category);
                      } else {
                        next.add(category);
                      }
                      return next;
                    })
                  }}
                  className="w-full flex items-center justify-between px-2 py-1.5 text-sm font-semibold rounded transition-colors"
                  style={{
                    color: 'var(--text-primary)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'var(--bg-secondary)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                >
                  <span>{category}</span>
                  {expandedCategories.has(category) ? (
                    <ChevronDown size={16} />
                  ) : (
                    <ChevronRight size={16} />
                  )}
                </button>
                {expandedCategories.has(category) && (
                  <div className="mt-1 space-y-1">
                    {categoryNodes.map(({ type, label, icon }) => (
                      <div
                        key={type}
                        draggable
                        onDragStart={(e) => handleDragStart(e, type)}
                        className="flex items-center gap-2 px-2 py-1.5 text-sm rounded cursor-move transition-colors"
                        style={{
                          color: 'var(--text-primary)',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = 'var(--bg-secondary)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = 'transparent';
                        }}
                      >
                        <GripVertical size={14} style={{ color: 'var(--text-muted)' }} />
                        <span className="text-base">{icon}</span>
                        <span>{label}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Mobile Sidebar Toggle */}
      {!showSidebar && (
        <button
          onClick={() => setShowSidebar(true)}
          className="md:hidden fixed top-4 left-4 z-50 p-2 rounded-lg shadow-lg backdrop-blur-sm"
          style={{
            backgroundColor: 'var(--bg-elevated)',
            border: '1px solid var(--border-primary)',
            color: 'var(--text-primary)',
          }}
          aria-label="Open sidebar"
        >
          <GripVertical size={20} />
        </button>
      )}

      {/* Main Canvas Container */}
      <div className="flex-1 flex relative" style={{ minHeight: 0, height: '100%', flex: '1 1 auto' }}>
        <div data-tour="canvas" className="flex-1 relative" style={{ width: '100%', height: '100%', minHeight: '400px', position: 'relative', overflow: 'hidden', flex: '1 1 auto' }}>
        {nodes.length === 0 && !editingNode && (
          <div 
            className="absolute flex items-center justify-center pointer-events-none" 
            style={{ 
              position: 'absolute', 
              top: '50%', 
              left: '50%', 
              transform: 'translate(-50%, -50%)',
              zIndex: 100,
              width: '100%',
              height: '100%',
            }}
          >
            <div 
              className="text-center backdrop-blur-sm px-6 py-4 rounded-lg shadow-lg pointer-events-auto"
              style={{
                backgroundColor: 'var(--bg-elevated)',
                border: '1px solid var(--border-primary)',
              }}
            >
              <p className="text-lg mb-2 font-medium" style={{ color: 'var(--text-primary)' }}>
                Click anywhere to start your flow
              </p>
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                Or drag a node from the sidebar
              </p>
            </div>
          </div>
        )}
        {nodes.length > 0 && nodes.length < 2 && !editingNode && (
          <div className="absolute top-20 left-1/2 transform -translate-x-1/2 z-10 pointer-events-none">
            <div 
              className="text-center backdrop-blur-sm px-4 py-3 rounded-lg shadow-lg pointer-events-auto"
              style={{
                backgroundColor: 'var(--bg-elevated)',
                border: '1px solid var(--border-primary)',
              }}
            >
              <p className="text-sm font-medium mb-1" style={{ color: 'var(--text-primary)' }}>
                💡 Connect nodes
              </p>
              <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                Drag from the blue dot on the right of a node to the blue dot on the left of another node
              </p>
            </div>
          </div>
        )}
        {isMounted && (
        <ReactFlow
          style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 1, minHeight: '400px' }}
          nodes={nodes}
          onInit={(instance) => {
            // ReactFlow initialized
          }}
          edges={edges.map(e => {
            const isDark = typeof window !== 'undefined' && document.documentElement.classList.contains('dark');
            const edgeColor = isDark ? '#64748b' : '#475569';
            // Use object format for markerEnd with explicit color
            const markerEnd = e.markerEnd || {
              type: MarkerType.ArrowClosed,
              width: 20,
              height: 20,
              color: edgeColor,
            };
            return {
              ...e,
              style: {
                ...e.style,
                stroke: edgeColor,
                strokeWidth: 2,
              },
              markerEnd: {
                type: MarkerType.ArrowClosed,
              } as any,
            };
          })}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onPaneClick={handleCanvasClick}
          onPaneContextMenu={handleCanvasRightClick}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onNodeDoubleClick={handleNodeDoubleClick}
          onEdgeDoubleClick={handleEdgeDoubleClick}
          nodeTypes={nodeTypes}
          fitView
          fitViewOptions={{ padding: 0.2, maxZoom: 1.5 }}
          deleteKeyCode={null}
          defaultViewport={{ x: 0, y: 0, zoom: 1 }}
          minZoom={0.1}
          maxZoom={2}
          connectionLineStyle={{
            stroke: typeof window !== 'undefined' && document.documentElement.classList.contains('dark')
              ? '#3b82f6'
              : '#2563eb',
            strokeWidth: 3,
          }}
          snapToGrid={false}
          defaultEdgeOptions={{
            type: 'smoothstep',
            animated: false,
            style: {
              stroke: typeof window !== 'undefined' && document.documentElement.classList.contains('dark')
                ? '#64748b'
                : '#475569',
              strokeWidth: 2,
            },
            markerEnd: {
              type: MarkerType.ArrowClosed,
            } as any,
          }}
        >
          <svg style={{ position: 'absolute', width: 0, height: 0, zIndex: -1 }}>
            <defs>
              <marker
                id="react-flow__arrowclosed"
                markerWidth="12.5"
                markerHeight="12.5"
                viewBox="-10 -10 20 20"
                refX="8"
                refY="0"
                markerUnits="strokeWidth"
                orient="auto"
              >
                <path
                  d="M -5 -5 L 0 0 L -5 5 z"
                  fill="currentColor"
                  stroke="currentColor"
                  strokeWidth="1"
                />
              </marker>
            </defs>
          </svg>
          <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
          <Controls />
          <MiniMap />
          
          <Panel 
            data-tour="toolbar"
            position="top-left" 
            className="backdrop-blur-sm rounded-lg shadow-lg p-2 m-2"
            style={{
              backgroundColor: 'var(--bg-elevated)',
              border: '1px solid var(--border-primary)',
            }}
          >
            <div className="flex items-center gap-2 flex-wrap">
              {/* Diagram Title */}
              {editingTitle ? (
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={diagramTitle}
                    onChange={(e) => setDiagramTitle(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleTitleSave();
                      if (e.key === 'Escape') {
                        setEditingTitle(false);
                        if (currentDiagram) setDiagramTitle(currentDiagram.metadata.title);
                      }
                    }}
                    className="px-2 py-1 text-sm border rounded"
                    style={{
                      borderColor: 'var(--border-primary)',
                      backgroundColor: 'var(--bg-primary)',
                      color: 'var(--text-primary)',
                      minWidth: '150px',
                    }}
                    autoFocus
                  />
                  <button
                    onClick={handleTitleSave}
                    disabled={isLoading}
                    className="p-1.5 rounded transition-colors"
                    style={{ color: 'var(--text-primary)' }}
                    title="Save title"
                  >
                    {isLoading ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                  </button>
                  <button
                    onClick={() => {
                      setEditingTitle(false);
                      if (currentDiagram) setDiagramTitle(currentDiagram.metadata.title);
                    }}
                    className="p-1.5 rounded transition-colors"
                    style={{ color: 'var(--text-primary)' }}
                    title="Cancel"
                  >
                    <X size={14} />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setEditingTitle(true)}
                  className="px-2 py-1 text-sm font-medium rounded transition-colors flex items-center gap-1"
                  style={{
                    color: 'var(--text-primary)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'var(--bg-secondary)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                  title="Click to edit title"
                >
                  <Edit2 size={14} />
                  <span className="max-w-[200px] truncate">{diagramTitle}</span>
                </button>
              )}
              
              <div className="w-px h-6 bg-gray-300 dark:bg-gray-600" />
              
              <button
                onClick={() => setShowSidebar(!showSidebar)}
                className="p-2 rounded transition-colors"
                style={{
                  color: 'var(--text-primary)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--bg-secondary)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
                title="Toggle Sidebar"
              >
                <ChevronRight size={18} className={showSidebar ? 'rotate-180' : ''} />
              </button>
              <div className="relative menu-container">
                <button
                  onClick={() => {
                    setShowAddNodeMenu(!showAddNodeMenu);
                    setShowExportMenu(false);
                  }}
                  className="p-2 hover:bg-gray-100 rounded bg-blue-500 text-white hover:bg-blue-600 transition-colors"
                  title="Add Node"
                >
                  <Plus size={18} />
                </button>
                {showAddNodeMenu && (
                  <div 
                    className="absolute top-full left-0 mt-1 rounded-lg shadow-lg border p-1 z-50 min-w-[150px] menu-container"
                    style={{
                      backgroundColor: 'var(--bg-elevated)',
                      borderColor: 'var(--border-primary)',
                    }}
                  >
                    <div className="text-xs font-semibold mb-1 px-2 py-1" style={{ color: 'var(--text-muted)' }}>
                      Add Node Type
                    </div>
                    {(['start', 'process', 'decision', 'io', 'end'] as const).map((type) => (
                      <button
                        key={type}
                        onClick={() => {
                          try {
                            if (reactFlowInstance) {
                              const centerX = window.innerWidth / 2;
                              const centerY = window.innerHeight / 2;
                              const position = reactFlowInstance.screenToFlowPosition({
                                x: centerX,
                                y: centerY,
                              });
                              addNode(type, position);
                            } else {
                              addNode(type, { x: 0, y: 0 });
                            }
                          } catch (err) {
                            console.error('Error getting center position:', err);
                            addNode(type, { x: 0, y: 0 });
                          }
                          setShowAddNodeMenu(false);
                        }}
                        className="w-full text-left px-3 py-2 rounded text-sm capitalize transition-colors"
                        style={{
                          color: 'var(--text-primary)',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = 'var(--bg-secondary)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = 'transparent';
                        }}
                      >
                        {type === 'io' ? 'Input/Output' : type}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <button
                onClick={handleUndo}
                disabled={historyIndex <= 0}
                className="p-2 rounded disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                style={{ color: 'var(--text-primary)' }}
                onMouseEnter={(e) => {
                  if (!e.currentTarget.disabled) {
                    e.currentTarget.style.backgroundColor = 'var(--bg-secondary)';
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
                title="Undo (Ctrl+Z)"
              >
                <Undo2 size={18} />
              </button>
              <button
                onClick={handleRedo}
                disabled={historyIndex >= history.length - 1}
                className="p-2 rounded disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                style={{ color: 'var(--text-primary)' }}
                onMouseEnter={(e) => {
                  if (!e.currentTarget.disabled) {
                    e.currentTarget.style.backgroundColor = 'var(--bg-secondary)';
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
                title="Redo (Ctrl+Y)"
              >
                <Redo2 size={18} />
              </button>
              <button
                onClick={handleDelete}
                disabled={!nodes.some(n => n.selected) && !edges.some(e => e.selected)}
                className="p-2 rounded disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                style={{ 
                  color: 'var(--status-error)',
                }}
                onMouseEnter={(e) => {
                  if (!e.currentTarget.disabled) {
                    e.currentTarget.style.backgroundColor = 'var(--bg-secondary)';
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
                title="Delete (Delete/Backspace)"
              >
                <Trash2 size={18} />
              </button>
              <button
                onClick={handleCopy}
                disabled={!nodes.some(n => n.selected)}
                className="p-2 rounded disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                style={{ color: 'var(--text-primary)' }}
                onMouseEnter={(e) => {
                  if (!e.currentTarget.disabled) {
                    e.currentTarget.style.backgroundColor = 'var(--bg-secondary)';
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
                title="Copy (Ctrl+C)"
              >
                <Copy size={18} />
              </button>
              <button
                onClick={handlePaste}
                className="p-2 rounded transition-colors"
                style={{ color: 'var(--text-primary)' }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--bg-secondary)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
                title="Paste (Ctrl+V)"
              >
                <ClipboardPaste size={18} />
              </button>
              <button
                onClick={handleAutoLayout}
                disabled={nodes.length === 0}
                className="p-2 rounded disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                style={{ color: 'var(--text-primary)' }}
                onMouseEnter={(e) => {
                  if (!e.currentTarget.disabled) {
                    e.currentTarget.style.backgroundColor = 'var(--bg-secondary)';
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
                title="Auto Layout"
              >
                <Layout size={18} />
              </button>
              <div className="relative menu-container">
                <button
                  onClick={() => {
                    setShowExportMenu(!showExportMenu);
                    setShowAddNodeMenu(false);
                  }}
                  className="p-2 hover:bg-gray-100 rounded"
                  title="Export"
                >
                  <Download size={18} />
                </button>
                {showExportMenu && (
                  <div 
                    className="absolute top-full left-0 mt-1 rounded-lg shadow-lg border p-1 z-50 menu-container"
                    style={{
                      backgroundColor: 'var(--bg-elevated)',
                      borderColor: 'var(--border-primary)',
                    }}
                  >
                    <button 
                      onClick={() => handleExport('json')} 
                      className="w-full text-left px-3 py-2 rounded flex items-center gap-2 transition-colors"
                      style={{ color: 'var(--text-primary)' }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = 'var(--bg-secondary)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent';
                      }}
                    >
                      <FileJson size={16} /> JSON
                    </button>
                    {developerMode && (
                      <button 
                        onClick={() => handleExport('mermaid')} 
                        className="w-full text-left px-3 py-2 rounded flex items-center gap-2 transition-colors"
                        style={{ color: 'var(--text-primary)' }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = 'var(--bg-secondary)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = 'transparent';
                        }}
                      >
                        <FileText size={16} /> Mermaid
                      </button>
                    )}
                    <button 
                      onClick={() => handleExport('png')} 
                      className="w-full text-left px-3 py-2 rounded flex items-center gap-2 transition-colors"
                      style={{ color: 'var(--text-primary)' }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = 'var(--bg-secondary)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent';
                      }}
                    >
                      <Image size={16} /> PNG
                    </button>
                    <button 
                      onClick={() => handleExport('svg')} 
                      className="w-full text-left px-3 py-2 rounded flex items-center gap-2 transition-colors"
                      style={{ color: 'var(--text-primary)' }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = 'var(--bg-secondary)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent';
                      }}
                    >
                      <FileCode size={16} /> SVG
                    </button>
                  </div>
                )}
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept=".flow.json,.md"
                onChange={handleImport}
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="p-2 rounded transition-colors"
                style={{ color: 'var(--text-primary)' }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--bg-secondary)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
                title="Import"
              >
                <Upload size={18} />
              </button>
              <button
                onClick={() => setShowSettings(!showSettings)}
                className="p-2 rounded transition-colors"
                style={{ color: 'var(--text-primary)' }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--bg-secondary)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
                title="Settings"
              >
                <Settings size={18} />
              </button>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 text-xs">
                  {saveStatus === 'saved' ? (
                    <Check size={14} className="text-green-500" />
                  ) : (
                    <div className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse" />
                  )}
                </div>
                {validation.warnings.length > 0 && !showValidation && (
                  <button
                    onClick={() => setShowValidation(true)}
                    className="relative p-1.5 rounded transition-colors"
                    style={{ color: 'var(--status-warning)' }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = 'var(--bg-secondary)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }}
                    title={`${validation.warnings.length} validation warning${validation.warnings.length > 1 ? 's' : ''}`}
                  >
                    <AlertCircle size={16} />
                    {validation.warnings.length > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                        {validation.warnings.length > 9 ? '9+' : validation.warnings.length}
                      </span>
                    )}
                  </button>
                )}
              </div>
            </div>
          </Panel>

          {showSettings && (
            <Panel 
              position="top-right" 
              className="backdrop-blur-sm rounded-lg shadow-lg p-4 m-2 max-w-xs"
              style={{
                backgroundColor: 'var(--bg-elevated)',
                border: '1px solid var(--border-primary)',
                color: 'var(--text-primary)',
              }}
            >
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold" style={{ color: 'var(--text-primary)' }}>Settings</h3>
                <button 
                  onClick={() => setShowSettings(false)}
                  style={{ color: 'var(--text-primary)' }}
                  className="hover:opacity-70 transition-opacity"
                >
                  <X size={18} />
                </button>
              </div>
              <div className="space-y-3">
                <label className="flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
                  <input
                    type="checkbox"
                    checked={developerMode}
                    onChange={(e) => setDeveloperMode(e.target.checked)}
                  />
                  <span className="text-sm">Developer Mode (Mermaid)</span>
                </label>
                <label className="flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
                  <input
                    type="checkbox"
                    checked={showValidation}
                    onChange={(e) => setShowValidation(e.target.checked)}
                  />
                  <span className="text-sm">Show Validation</span>
                </label>
                <div>
                  <label className="text-sm mb-1 block" style={{ color: 'var(--text-primary)' }}>
                    Layout Direction
                  </label>
                  <select
                    value={layoutDirection}
                    onChange={(e) => setLayoutDirection(e.target.value as 'TD' | 'LR')}
                    className="w-full px-2 py-1 text-sm border rounded"
                    style={{
                      borderColor: 'var(--border-primary)',
                      backgroundColor: 'var(--bg-primary)',
                      color: 'var(--text-primary)',
                    }}
                  >
                    <option value="TD">Top-Down</option>
                    <option value="LR">Left-Right</option>
                  </select>
                </div>
              </div>
            </Panel>
          )}

          {validation.warnings.length > 0 && showValidation && (
            <Panel 
              position="bottom-left" 
              className="rounded-lg shadow-lg p-3 m-2 max-w-md z-10"
              style={{
                backgroundColor: 'var(--status-warning-bg)',
                border: '1px solid var(--status-warning)',
              }}
            >
              <div className="flex items-start gap-2">
                <AlertCircle size={18} className="text-amber-600 mt-0.5 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-2">
                    <div className="font-medium text-sm text-amber-900">Flow Validation</div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setShowValidation(false)}
                        className="text-amber-600 hover:text-amber-800 text-xs font-medium"
                        title="Hide validation"
                      >
                        Hide
                      </button>
                      <button
                        onClick={() => {
                          const newDismissed = new Set(dismissedWarnings);
                          validation.warnings.forEach(w => {
                            const key = `${w.type}-${w.nodeId || w.edgeId || 'global'}`;
                            newDismissed.add(key);
                          });
                          setDismissedWarnings(newDismissed);
                        }}
                        className="text-amber-600 hover:text-amber-800 text-xs font-medium"
                        title="Dismiss all"
                      >
                        Dismiss All
                      </button>
                    </div>
                  </div>
                  <div className="space-y-1.5 max-h-48 overflow-y-auto">
                    {validation.warnings.map((warning, idx) => {
                      const key = `${warning.type}-${warning.nodeId || warning.edgeId || 'global'}`;
                      return (
                        <div key={idx} className="flex items-start gap-2 group">
                          <div className="flex-1 text-xs text-amber-800 leading-relaxed">
                            {warning.message}
                          </div>
                          <button
                            onClick={() => {
                              const newDismissed = new Set(dismissedWarnings);
                              newDismissed.add(key);
                              setDismissedWarnings(newDismissed);
                            }}
                            className="opacity-0 group-hover:opacity-100 transition-opacity text-amber-600 hover:text-amber-800 flex-shrink-0"
                            title="Dismiss"
                          >
                            <X size={14} />
                          </button>
                        </div>
                      );
                    })}
                    {validation.warnings.length > 3 && (
                      <div className="text-xs text-amber-700 italic pt-1">
                        + {validation.warnings.length - 3} more warning{validation.warnings.length - 3 > 1 ? 's' : ''}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </Panel>
          )}
        </ReactFlow>
        )}

        {showNodeMenu && (
          <div
            className="fixed rounded-lg shadow-xl border p-2 z-50 menu-container"
            style={{
              left: `${(nodeMenuPosition as any).x}px`,
              top: `${(nodeMenuPosition as any).y}px`,
              borderColor: 'var(--border-primary)',
              backgroundColor: 'var(--bg-elevated)',
            }}
            onMouseLeave={() => setShowNodeMenu(false)}
          >
            <div className="text-xs font-semibold mb-2 px-2" style={{ color: 'var(--text-muted)' }}>
              Add Node
            </div>
            {(['start', 'process', 'decision', 'io', 'end'] as const).map((type) => (
              <button
                key={type}
                onClick={() => {
                  addNode(type, {
                    x: (nodeMenuPosition as any).flowX || nodeMenuPosition.x,
                    y: (nodeMenuPosition as any).flowY || nodeMenuPosition.y,
                  });
                  setShowNodeMenu(false);
                }}
                className="w-full text-left px-3 py-2 rounded text-sm capitalize transition-colors"
                style={{ color: 'var(--text-primary)' }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--bg-secondary)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                {type === 'io' ? 'Input/Output' : type}
              </button>
            ))}
          </div>
        )}

        {editingNode && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
            <div 
              className="rounded-lg p-4 shadow-xl max-w-md w-full mx-4"
              style={{
                backgroundColor: 'var(--bg-elevated)',
                border: '1px solid var(--border-primary)',
              }}
            >
              <h3 className="font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>Edit Node Label</h3>
              <input
                type="text"
                value={editingLabel}
                onChange={(e) => setEditingLabel(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleLabelSubmit();
                  if (e.key === 'Escape') {
                    setEditingNode(null);
                    setEditingLabel('');
                  }
                }}
                className="w-full px-3 py-2 border rounded-lg mb-3"
                style={{
                  borderColor: 'var(--border-primary)',
                  backgroundColor: 'var(--bg-primary)',
                  color: 'var(--text-primary)',
                }}
                autoFocus
              />
              <div className="flex gap-2 justify-end">
                <button
                  onClick={() => {
                    setEditingNode(null);
                    setEditingLabel('');
                  }}
                  className="px-4 py-2 rounded-lg border transition-colors"
                  style={{
                    borderColor: 'var(--border-primary)',
                    color: 'var(--text-primary)',
                    backgroundColor: 'var(--bg-primary)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'var(--bg-secondary)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'var(--bg-primary)';
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleLabelSubmit}
                  className="px-4 py-2 rounded-lg text-white transition-colors"
                  style={{
                    backgroundColor: 'var(--brand-primary)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'var(--brand-primary-hover)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'var(--brand-primary)';
                  }}
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        )}

        {editingEdge && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
            <div 
              className="rounded-lg p-4 shadow-xl max-w-md w-full mx-4"
              style={{
                backgroundColor: 'var(--bg-elevated)',
                border: '1px solid var(--border-primary)',
              }}
            >
              <h3 className="font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>Edit Edge Label</h3>
              <input
                type="text"
                value={editingLabel}
                onChange={(e) => setEditingLabel(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleLabelSubmit();
                  if (e.key === 'Escape') {
                    setEditingEdge(null);
                    setEditingLabel('');
                  }
                }}
                className="w-full px-3 py-2 border rounded-lg mb-3"
                style={{
                  borderColor: 'var(--border-primary)',
                  backgroundColor: 'var(--bg-primary)',
                  color: 'var(--text-primary)',
                }}
                placeholder="Edge label (optional)"
                autoFocus
              />
              <div className="flex gap-2 justify-end">
                <button
                  onClick={() => {
                    setEditingEdge(null);
                    setEditingLabel('');
                  }}
                  className="px-4 py-2 rounded-lg border transition-colors"
                  style={{
                    borderColor: 'var(--border-primary)',
                    color: 'var(--text-primary)',
                    backgroundColor: 'var(--bg-primary)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'var(--bg-secondary)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'var(--bg-primary)';
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleLabelSubmit}
                  className="px-4 py-2 rounded-lg text-white transition-colors"
                  style={{
                    backgroundColor: 'var(--brand-primary)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'var(--brand-primary-hover)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'var(--brand-primary)';
                  }}
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        )}
        </div>
      </div>
      
      {/* Toast Notification */}
      <Toast toast={toast} onClose={hideToast} />
    </div>
  );
}

export default function FlowBuilder() {
  return (
    <ReactFlowProvider>
      <FlowBuilderInner />
    </ReactFlowProvider>
  );
}
