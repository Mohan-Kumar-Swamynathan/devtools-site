import type { FlowNode, FlowEdge } from './types';

interface LayoutNode extends FlowNode {
  level: number;
  children: string[];
  parents: string[];
}

export function autoLayout(
  nodes: FlowNode[],
  edges: FlowEdge[],
  direction: 'TD' | 'LR' = 'TD'
): FlowNode[] {
  if (nodes.length === 0) return nodes;

  // Build graph structure
  const nodeMap = new Map<string, LayoutNode>();
  nodes.forEach(node => {
    nodeMap.set(node.id, {
      ...node,
      level: -1,
      children: [],
      parents: [],
    });
  });

  // Build adjacency lists
  edges.forEach(edge => {
    const source = nodeMap.get(edge.source);
    const target = nodeMap.get(edge.target);
    if (source && target) {
      source.children.push(edge.target);
      target.parents.push(edge.source);
    }
  });

  // Find start nodes (nodes with no parents)
  const startNodes = Array.from(nodeMap.values()).filter(n => n.parents.length === 0);
  
  // If no clear start, use first node
  if (startNodes.length === 0 && nodes.length > 0) {
    startNodes.push(nodeMap.get(nodes[0].id)!);
  }

  // Assign levels using BFS
  const visited = new Set<string>();
  const queue: { id: string; level: number }[] = startNodes.map(n => ({ id: n.id, level: 0 }));

  while (queue.length > 0) {
    const { id, level } = queue.shift()!;
    if (visited.has(id)) continue;
    visited.add(id);

    const node = nodeMap.get(id)!;
    node.level = Math.max(node.level, level);

    node.children.forEach(childId => {
      if (!visited.has(childId)) {
        queue.push({ id: childId, level: level + 1 });
      }
    });
  }

  // Assign levels to unvisited nodes (disconnected components)
  let maxLevel = Math.max(...Array.from(nodeMap.values()).map(n => n.level));
  nodeMap.forEach(node => {
    if (node.level === -1) {
      node.level = ++maxLevel;
    }
  });

  // Group nodes by level
  const levelGroups = new Map<number, LayoutNode[]>();
  nodeMap.forEach(node => {
    if (!levelGroups.has(node.level)) {
      levelGroups.set(node.level, []);
    }
    levelGroups.get(node.level)!.push(node);
  });

  // Position nodes
  const HORIZONTAL_SPACING = direction === 'LR' ? 200 : 250;
  const VERTICAL_SPACING = direction === 'LR' ? 150 : 200;
  const NODE_WIDTH = 180;
  const NODE_HEIGHT = 80;

  const sortedLevels = Array.from(levelGroups.keys()).sort((a, b) => a - b);
  
  sortedLevels.forEach(level => {
    const levelNodes = levelGroups.get(level)!;
    
    // Sort nodes within level by number of children (more children first)
    levelNodes.sort((a, b) => b.children.length - a.children.length);

    levelNodes.forEach((node, index) => {
      if (direction === 'TD') {
        // Top-down layout
        const x = (index - (levelNodes.length - 1) / 2) * HORIZONTAL_SPACING;
        const y = level * VERTICAL_SPACING;
        node.position = { x, y };
      } else {
        // Left-right layout
        const x = level * HORIZONTAL_SPACING;
        const y = (index - (levelNodes.length - 1) / 2) * VERTICAL_SPACING;
        node.position = { x, y };
      }
    });
  });

  return Array.from(nodeMap.values());
}

export function centerDiagram(nodes: FlowNode[]): FlowNode[] {
  if (nodes.length === 0) return nodes;

  // Calculate bounding box
  const xs = nodes.map(n => n.position.x);
  const ys = nodes.map(n => n.position.y);
  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  const minY = Math.min(...ys);
  const maxY = Math.max(...ys);

  const centerX = (minX + maxX) / 2;
  const centerY = (minY + maxY) / 2;

  // Center around origin
  return nodes.map(node => ({
    ...node,
    position: {
      x: node.position.x - centerX,
      y: node.position.y - centerY,
    },
  }));
}





