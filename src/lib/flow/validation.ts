import type { FlowNode, FlowEdge, FlowValidation, FlowValidationWarning } from './types';

export function validateFlow(nodes: FlowNode[], edges: FlowEdge[]): FlowValidation {
  const warnings: FlowValidationWarning[] = [];

  // Check for missing start node
  const hasStart = nodes.some(n => n.type === 'start');
  if (!hasStart) {
    warnings.push({
      type: 'missing_start',
      message: 'Flow is missing a start node. Add a start node to begin your flow.',
      actionable: true,
    });
  }

  // Check for missing end node
  const hasEnd = nodes.some(n => n.type === 'end');
  if (!hasEnd) {
    warnings.push({
      type: 'missing_end',
      message: 'Flow is missing an end node. Add an end node to complete your flow.',
      actionable: true,
    });
  }

  // Build adjacency maps
  const outgoingEdges = new Map<string, string[]>();
  const incomingEdges = new Map<string, string[]>();
  
  edges.forEach(edge => {
    if (!outgoingEdges.has(edge.source)) {
      outgoingEdges.set(edge.source, []);
    }
    if (!incomingEdges.has(edge.target)) {
      incomingEdges.set(edge.target, []);
    }
    outgoingEdges.get(edge.source)!.push(edge.target);
    incomingEdges.get(edge.target)!.push(edge.source);
  });

  // Check for unconnected nodes and dead ends (combined to avoid duplicates)
  nodes.forEach(node => {
    const hasOutgoing = outgoingEdges.has(node.id) && outgoingEdges.get(node.id)!.length > 0;
    const hasIncoming = incomingEdges.has(node.id) && incomingEdges.get(node.id)!.length > 0;
    
    // Start nodes don't need incoming, end nodes don't need outgoing
    const shouldHaveOutgoing = node.type !== 'end';
    const shouldHaveIncoming = node.type !== 'start';
    
    // Only show one warning per node - prioritize "unconnected" over "dead_end"
    if (shouldHaveOutgoing && !hasOutgoing && shouldHaveIncoming && !hasIncoming) {
      // Completely unconnected node
      warnings.push({
        type: 'unconnected_node',
        message: `"${node.data.label}" is not connected to the flow.`,
        nodeId: node.id,
        actionable: true,
      });
    } else if (shouldHaveOutgoing && !hasOutgoing && hasIncoming) {
      // Has incoming but no outgoing (dead end, but connected)
      warnings.push({
        type: 'dead_end',
        message: `"${node.data.label}" has no outgoing connections.`,
        nodeId: node.id,
        actionable: true,
      });
    }
  });

  // Check decision nodes have at least 2 paths
  nodes.forEach(node => {
    if (node.type === 'decision') {
      const outgoing = outgoingEdges.get(node.id) || [];
      if (outgoing.length < 2) {
        warnings.push({
          type: 'invalid_decision',
          message: `Decision node "${node.data.label}" should have at least 2 outgoing paths (e.g., Yes/No).`,
          nodeId: node.id,
          actionable: true,
        });
      }
    }
  });

  return {
    isValid: warnings.length === 0,
    warnings,
  };
}

