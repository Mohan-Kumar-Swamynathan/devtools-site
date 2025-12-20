import type { FlowDiagram, FlowNode, FlowEdge, NodeType } from './types';

const NODE_TYPE_MAP: Record<NodeType, string> = {
  start: 'Start',
  end: 'End',
  process: 'Process',
  decision: 'Decision',
  io: 'Input/Output',
  subroutine: 'Subroutine',
  database: 'Database',
  document: 'Document',
  'stored-data': 'StoredData',
  cylinder: 'Cylinder',
  hexagon: 'Hexagon',
  parallelogram: 'Parallelogram',
  trapezoid: 'Trapezoid',
  'double-circle': 'DoubleCircle',
  stadium: 'Stadium',
  'round-rect': 'RoundRect',
  rhombus: 'Rhombus',
};

export function exportToMermaid(
  diagram: FlowDiagram,
  orientation: 'TD' | 'LR' = 'TD'
): string {
  const lines: string[] = [`flowchart ${orientation}`];
  
  // Map node IDs to Mermaid node IDs (sanitize for Mermaid)
  const nodeIdMap = new Map<string, string>();
  diagram.nodes.forEach((node, index) => {
    const mermaidId = `N${index}`;
    nodeIdMap.set(node.id, mermaidId);
  });

  // Add nodes with labels
  diagram.nodes.forEach((node) => {
    const mermaidId = nodeIdMap.get(node.id)!;
    const label = node.data.label.replace(/"/g, '&quot;').replace(/\n/g, '<br/>');
    
    let shape = '['; // Default rectangle
    let closingShape = ']';
    
    if (node.type === 'start') {
      shape = '([';
      closingShape = '])';
    } else if (node.type === 'end') {
      shape = '])';
      closingShape = '])';
    } else if (node.type === 'decision') {
      shape = '{';
      closingShape = '}';
    } else if (node.type === 'io' || node.type === 'parallelogram') {
      shape = '[(';
      closingShape = ')]';
    } else if (node.type === 'subroutine') {
      shape = '[[';
      closingShape = ']]';
    } else if (node.type === 'database' || node.type === 'cylinder') {
      shape = '[(';
      closingShape = ')]';
    } else if (node.type === 'stadium' || node.type === 'round-rect') {
      shape = '([';
      closingShape = '])';
    } else if (node.type === 'rhombus' || node.type === 'trapezoid') {
      shape = '{';
      closingShape = '}';
    }
    
    lines.push(`    ${mermaidId}${shape}"${label}"${closingShape}`);
  });

  // Add edges
  diagram.edges.forEach((edge) => {
    const sourceId = nodeIdMap.get(edge.source);
    const targetId = nodeIdMap.get(edge.target);
    
    if (sourceId && targetId) {
      const label = edge.label ? `|"${edge.label.replace(/"/g, '&quot;')}"|` : '';
      lines.push(`    ${sourceId} -->${label} ${targetId}`);
    }
  });

  return lines.join('\n');
}

export async function importFromMermaid(mermaidText: string): Promise<{
  nodes: FlowNode[];
  edges: FlowEdge[];
  errors: string[];
}> {
  const errors: string[] = [];
  const nodes: FlowNode[] = [];
  const edges: FlowEdge[] = [];
  
  try {
    // Simple parser for basic Mermaid flowchart syntax
    const lines = mermaidText.split('\n').map(l => l.trim()).filter(l => l && !l.startsWith('//'));
    
    // Extract orientation
    const flowchartLine = lines.find(l => l.startsWith('flowchart'));
    const orientation = flowchartLine?.includes('LR') ? 'LR' : 'TD';
    
    // Parse nodes and edges
    const nodeIdMap = new Map<string, string>(); // Mermaid ID -> our ID
    let nodeIndex = 0;
    
    for (const line of lines) {
      if (line.startsWith('flowchart')) continue;
      
      // Match node definition: N1["Label"]
      const nodeMatch = line.match(/^(\w+)(\[\(|\[|\(|{)"([^"]+)"(\)\]|\)|]|})/);
      if (nodeMatch) {
        const [, mermaidId, startShape, label] = nodeMatch;
        const nodeId = `node-${nodeIndex++}`;
        nodeIdMap.set(mermaidId, nodeId);
        
        // Determine node type from shape
        let type: NodeType = 'process';
        if (startShape === '([' || startShape === '(') {
          type = 'start';
        } else if (startShape === '{') {
          type = 'decision';
        } else if (startShape === '[(') {
          type = 'io';
        }
        
        nodes.push({
          id: nodeId,
          type,
          position: { x: 0, y: 0 }, // Will be auto-laid out
          data: { label },
        });
        continue;
      }
      
      // Match edge: N1 --> N2 or N1 -->|"label"| N2
      const edgeMatch = line.match(/^(\w+)\s*-->(?:\|"([^"]+)"\|)?\s*(\w+)/);
      if (edgeMatch) {
        const [, sourceMermaidId, label, targetMermaidId] = edgeMatch;
        const sourceId = nodeIdMap.get(sourceMermaidId);
        const targetId = nodeIdMap.get(targetMermaidId);
        
        if (sourceId && targetId) {
          edges.push({
            id: `edge-${edges.length}`,
            source: sourceId,
            target: targetId,
            label: label || undefined,
          });
        } else {
          errors.push(`Edge references unknown node: ${line}`);
        }
        continue;
      }
    }
    
    // Auto-layout nodes in a grid
    const cols = Math.ceil(Math.sqrt(nodes.length));
    nodes.forEach((node, index) => {
      const row = Math.floor(index / cols);
      const col = index % cols;
      node.position = {
        x: col * 200,
        y: row * 150,
      };
    });
    
  } catch (error) {
    errors.push(`Failed to parse Mermaid: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
  
  return { nodes, edges, errors };
}

