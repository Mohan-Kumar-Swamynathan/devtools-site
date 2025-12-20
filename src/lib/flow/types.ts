export type NodeType = 
  | 'start' 
  | 'end' 
  | 'process' 
  | 'decision' 
  | 'io'
  | 'subroutine'
  | 'database'
  | 'document'
  | 'stored-data'
  | 'cylinder'
  | 'hexagon'
  | 'parallelogram'
  | 'trapezoid'
  | 'double-circle'
  | 'stadium'
  | 'round-rect'
  | 'rhombus';

export interface FlowNode {
  id: string;
  type: NodeType;
  position: { x: number; y: number };
  data: {
    label: string;
    description?: string;
  };
}

export interface FlowEdge {
  id: string;
  source: string;
  target: string;
  label?: string;
}

export interface FlowDiagram {
  id: string;
  metadata: {
    title: string;
    createdAt: string;
    updatedAt: string;
  };
  nodes: FlowNode[];
  edges: FlowEdge[];
}

export interface FlowValidationWarning {
  type: 'missing_start' | 'missing_end' | 'unconnected_node' | 'dead_end' | 'invalid_decision';
  message: string;
  nodeId?: string;
  edgeId?: string;
  actionable: boolean;
}

export interface FlowValidation {
  isValid: boolean;
  warnings: FlowValidationWarning[];
}

