/**
 * DiagramValidator - Validates process diagram structure and integrity
 */
export class DiagramValidator {
  
  /**
   * Validate a complete diagram
   */
  async validateDiagram(visualization) {
    const errors = [];
    const warnings = [];
    const suggestions = [];
    
    try {
      // Basic structure validation
      this.validateBasicStructure(visualization, errors);
      
      // Node validation
      this.validateNodes(visualization.nodes || [], errors, warnings);
      
      // Edge validation
      this.validateEdges(visualization.edges || [], visualization.nodes || [], errors, warnings);
      
      // Flow validation
      this.validateFlow(visualization.nodes || [], visualization.edges || [], errors, warnings);
      
      // Semantic validation
      this.validateSemantics(visualization, warnings, suggestions);
      
      const isValid = errors.length === 0;
      
      return {
        isValid,
        errors,
        warnings,
        suggestions,
        score: this.calculateValidationScore(errors, warnings, suggestions),
        summary: this.generateValidationSummary(isValid, errors, warnings, suggestions)
      };
      
    } catch (error) {
      errors.push({
        type: 'validation_error',
        message: `Validation process failed: ${error.message}`,
        severity: 'error'
      });
      
      return {
        isValid: false,
        errors,
        warnings,
        suggestions,
        score: 0,
        summary: 'Validation failed due to internal error'
      };
    }
  }

  /**
   * Validate basic diagram structure
   */
  validateBasicStructure(visualization, errors) {
    if (!visualization) {
      errors.push({
        type: 'missing_data',
        message: 'Visualization data is required',
        severity: 'error'
      });
      return;
    }

    if (!visualization.id) {
      errors.push({
        type: 'missing_id',
        message: 'Visualization must have an ID',
        severity: 'error'
      });
    }

    if (!visualization.name || visualization.name.trim().length === 0) {
      errors.push({
        type: 'missing_name',
        message: 'Visualization must have a name',
        severity: 'error'
      });
    }

    if (!Array.isArray(visualization.nodes)) {
      errors.push({
        type: 'invalid_nodes',
        message: 'Nodes must be an array',
        severity: 'error'
      });
    }

    if (visualization.edges && !Array.isArray(visualization.edges)) {
      errors.push({
        type: 'invalid_edges',
        message: 'Edges must be an array',
        severity: 'error'
      });
    }
  }

  /**
   * Validate individual nodes
   */
  validateNodes(nodes, errors, warnings) {
    if (nodes.length === 0) {
      errors.push({
        type: 'empty_diagram',
        message: 'Diagram must contain at least one node',
        severity: 'error'
      });
      return;
    }

    const nodeIds = new Set();
    let hasStart = false;
    let hasEnd = false;

    nodes.forEach((node, index) => {
      // Check required properties
      if (!node.id) {
        errors.push({
          type: 'missing_node_id',
          message: `Node at index ${index} is missing an ID`,
          severity: 'error',
          nodeIndex: index
        });
      } else {
        // Check for duplicate IDs
        if (nodeIds.has(node.id)) {
          errors.push({
            type: 'duplicate_node_id',
            message: `Duplicate node ID: ${node.id}`,
            severity: 'error',
            nodeId: node.id
          });
        }
        nodeIds.add(node.id);
      }

      if (!node.type) {
        errors.push({
          type: 'missing_node_type',
          message: `Node ${node.id} is missing a type`,
          severity: 'error',
          nodeId: node.id
        });
      } else {
        // Validate node type
        if (!this.isValidNodeType(node.type)) {
          errors.push({
            type: 'invalid_node_type',
            message: `Invalid node type: ${node.type}`,
            severity: 'error',
            nodeId: node.id
          });
        }

        // Track start/end nodes
        if (node.type === 'start') hasStart = true;
        if (node.type === 'end') hasEnd = true;
      }

      // Validate position
      if (!node.position || typeof node.position.x !== 'number' || typeof node.position.y !== 'number') {
        warnings.push({
          type: 'missing_position',
          message: `Node ${node.id} has invalid or missing position`,
          severity: 'warning',
          nodeId: node.id
        });
      }

      // Validate data
      if (!node.data) {
        warnings.push({
          type: 'missing_node_data',
          message: `Node ${node.id} is missing data object`,
          severity: 'warning',
          nodeId: node.id
        });
      } else {
        this.validateNodeData(node, warnings);
      }
    });

    // Check for start/end nodes
    if (!hasStart) {
      warnings.push({
        type: 'missing_start_node',
        message: 'Diagram should have at least one start node',
        severity: 'warning'
      });
    }

    if (!hasEnd) {
      warnings.push({
        type: 'missing_end_node',
        message: 'Diagram should have at least one end node',
        severity: 'warning'
      });
    }
  }

  /**
   * Validate edges/connections
   */
  validateEdges(edges, nodes, errors, warnings) {
    if (edges.length === 0) {
      warnings.push({
        type: 'no_connections',
        message: 'Diagram has no connections between nodes',
        severity: 'warning'
      });
      return;
    }

    const nodeIds = new Set(nodes.map(n => n.id).filter(id => id));
    const edgeIds = new Set();

    edges.forEach((edge, index) => {
      // Check required properties
      if (!edge.id) {
        errors.push({
          type: 'missing_edge_id',
          message: `Edge at index ${index} is missing an ID`,
          severity: 'error',
          edgeIndex: index
        });
      } else {
        // Check for duplicate IDs
        if (edgeIds.has(edge.id)) {
          errors.push({
            type: 'duplicate_edge_id',
            message: `Duplicate edge ID: ${edge.id}`,
            severity: 'error',
            edgeId: edge.id
          });
        }
        edgeIds.add(edge.id);
      }

      if (!edge.source) {
        errors.push({
          type: 'missing_edge_source',
          message: `Edge ${edge.id} is missing a source node`,
          severity: 'error',
          edgeId: edge.id
        });
      } else if (!nodeIds.has(edge.source)) {
        errors.push({
          type: 'invalid_edge_source',
          message: `Edge ${edge.id} references non-existent source node: ${edge.source}`,
          severity: 'error',
          edgeId: edge.id
        });
      }

      if (!edge.target) {
        errors.push({
          type: 'missing_edge_target',
          message: `Edge ${edge.id} is missing a target node`,
          severity: 'error',
          edgeId: edge.id
        });
      } else if (!nodeIds.has(edge.target)) {
        errors.push({
          type: 'invalid_edge_target',
          message: `Edge ${edge.id} references non-existent target node: ${edge.target}`,
          severity: 'error',
          edgeId: edge.id
        });
      }

      // Check for self-loops
      if (edge.source === edge.target) {
        warnings.push({
          type: 'self_loop',
          message: `Edge ${edge.id} creates a self-loop on node ${edge.source}`,
          severity: 'warning',
          edgeId: edge.id
        });
      }
    });
  }

  /**
   * Validate process flow logic
   */
  validateFlow(nodes, edges, errors, warnings) {
    const nodeIds = new Set(nodes.map(n => n.id).filter(id => id));
    
    // Find isolated nodes (no incoming or outgoing connections)
    const isolatedNodes = nodes.filter(node => {
      const hasIncoming = edges.some(edge => edge.target === node.id);
      const hasOutgoing = edges.some(edge => edge.source === node.id);
      return !hasIncoming && !hasOutgoing && node.type !== 'start' && node.type !== 'end';
    });

    isolatedNodes.forEach(node => {
      warnings.push({
        type: 'isolated_node',
        message: `Node ${node.id} (${node.data?.label || 'Untitled'}) is not connected to any other nodes`,
        severity: 'warning',
        nodeId: node.id
      });
    });

    // Find unreachable nodes (no path from start nodes)
    const reachableNodes = this.findReachableNodes(nodes, edges);
    const unreachableNodes = nodes.filter(node => 
      !reachableNodes.has(node.id) && node.type !== 'start'
    );

    unreachableNodes.forEach(node => {
      warnings.push({
        type: 'unreachable_node',
        message: `Node ${node.id} (${node.data?.label || 'Untitled'}) is not reachable from any start node`,
        severity: 'warning',
        nodeId: node.id
      });
    });

    // Check for dead ends (nodes with no outgoing connections except end nodes)
    const deadEnds = nodes.filter(node => {
      const hasOutgoing = edges.some(edge => edge.source === node.id);
      return !hasOutgoing && node.type !== 'end';
    });

    deadEnds.forEach(node => {
      warnings.push({
        type: 'dead_end',
        message: `Node ${node.id} (${node.data?.label || 'Untitled'}) has no outgoing connections`,
        severity: 'warning',
        nodeId: node.id
      });
    });

    // Detect potential infinite loops
    const cycles = this.detectCycles(nodes, edges);
    cycles.forEach(cycle => {
      warnings.push({
        type: 'potential_cycle',
        message: `Potential infinite loop detected involving nodes: ${cycle.join(' -> ')}`,
        severity: 'warning',
        cycle
      });
    });
  }

  /**
   * Validate semantic correctness
   */
  validateSemantics(visualization, warnings, suggestions) {
    const { nodes = [], edges = [] } = visualization;

    // Check for semantic inconsistencies
    nodes.forEach(node => {
      if (node.type === 'decision') {
        const outgoingEdges = edges.filter(edge => edge.source === node.id);
        if (outgoingEdges.length < 2) {
          warnings.push({
            type: 'insufficient_decision_branches',
            message: `Decision node ${node.id} should have at least 2 outgoing paths`,
            severity: 'warning',
            nodeId: node.id
          });
        }
      }

      if (node.type === 'database' && node.data) {
        if (!node.data.operation) {
          suggestions.push({
            type: 'missing_db_operation',
            message: `Database node ${node.id} should specify the operation type`,
            severity: 'suggestion',
            nodeId: node.id
          });
        }
      }

      if (node.type === 'api-call' && node.data) {
        if (!node.data.method || !node.data.endpoint) {
          suggestions.push({
            type: 'incomplete_api_spec',
            message: `API call node ${node.id} should specify method and endpoint`,
            severity: 'suggestion',
            nodeId: node.id
          });
        }
      }
    });

    // Check for missing error handling
    const hasErrorHandling = nodes.some(node => 
      node.data?.label?.toLowerCase().includes('error') ||
      edges.some(edge => edge.label?.toLowerCase().includes('error'))
    );

    if (!hasErrorHandling) {
      suggestions.push({
        type: 'missing_error_handling',
        message: 'Consider adding error handling paths to the process',
        severity: 'suggestion'
      });
    }

    // Check for security considerations
    const hasAuthNode = nodes.some(node => 
      node.type === 'external-service' && 
      node.data?.serviceType === 'auth'
    );

    const hasUserInput = nodes.some(node => 
      node.type === 'html-element' || node.type === 'user-action'
    );

    if (hasUserInput && !hasAuthNode) {
      suggestions.push({
        type: 'missing_authentication',
        message: 'Consider adding user authentication for processes involving user input',
        severity: 'suggestion'
      });
    }
  }

  /**
   * Validate node-specific data
   */
  validateNodeData(node, warnings) {
    const { type, data } = node;

    if (!data.label) {
      warnings.push({
        type: 'missing_node_label',
        message: `Node ${node.id} should have a descriptive label`,
        severity: 'warning',
        nodeId: node.id
      });
    }

    // Type-specific validation
    switch (type) {
      case 'html-element':
        if (!data.elementType) {
          warnings.push({
            type: 'missing_element_type',
            message: `HTML element node ${node.id} should specify element type`,
            severity: 'warning',
            nodeId: node.id
          });
        }
        break;

      case 'database':
        if (!data.operation || !data.table) {
          warnings.push({
            type: 'incomplete_database_spec',
            message: `Database node ${node.id} should specify operation and table`,
            severity: 'warning',
            nodeId: node.id
          });
        }
        break;

      case 'api-call':
        if (!data.method || !data.endpoint) {
          warnings.push({
            type: 'incomplete_api_spec',
            message: `API call node ${node.id} should specify method and endpoint`,
            severity: 'warning',
            nodeId: node.id
          });
        }
        break;

      case 'decision':
        if (!data.condition) {
          warnings.push({
            type: 'missing_decision_condition',
            message: `Decision node ${node.id} should specify the condition`,
            severity: 'warning',
            nodeId: node.id
          });
        }
        break;
    }
  }

  /**
   * Helper methods
   */
  isValidNodeType(type) {
    const validTypes = [
      'html-element', 'database', 'api-call', 'decision', 
      'user-action', 'external-service', 'start', 'end'
    ];
    return validTypes.includes(type);
  }

  findReachableNodes(nodes, edges) {
    const reachable = new Set();
    const startNodes = nodes.filter(node => node.type === 'start');
    
    const traverse = (nodeId) => {
      if (reachable.has(nodeId)) return;
      reachable.add(nodeId);
      
      const outgoingEdges = edges.filter(edge => edge.source === nodeId);
      outgoingEdges.forEach(edge => traverse(edge.target));
    };

    startNodes.forEach(node => traverse(node.id));
    return reachable;
  }

  detectCycles(nodes, edges) {
    const cycles = [];
    const visited = new Set();
    const recursionStack = new Set();
    const path = [];

    const dfs = (nodeId) => {
      if (recursionStack.has(nodeId)) {
        const cycleStart = path.indexOf(nodeId);
        cycles.push([...path.slice(cycleStart), nodeId]);
        return;
      }

      if (visited.has(nodeId)) return;

      visited.add(nodeId);
      recursionStack.add(nodeId);
      path.push(nodeId);

      const outgoingEdges = edges.filter(edge => edge.source === nodeId);
      outgoingEdges.forEach(edge => dfs(edge.target));

      recursionStack.delete(nodeId);
      path.pop();
    };

    nodes.forEach(node => {
      if (!visited.has(node.id)) {
        dfs(node.id);
      }
    });

    return cycles;
  }

  calculateValidationScore(errors, warnings, suggestions) {
    let score = 100;
    score -= errors.length * 20; // Major deduction for errors
    score -= warnings.length * 5; // Minor deduction for warnings
    score -= suggestions.length * 1; // Minimal deduction for suggestions
    
    return Math.max(0, score);
  }

  generateValidationSummary(isValid, errors, warnings, suggestions) {
    if (isValid && warnings.length === 0 && suggestions.length === 0) {
      return 'Diagram is valid and well-structured with no issues detected.';
    }

    let summary = '';
    
    if (!isValid) {
      summary += `Diagram has ${errors.length} error(s) that must be fixed. `;
    } else {
      summary += 'Diagram structure is valid. ';
    }

    if (warnings.length > 0) {
      summary += `${warnings.length} warning(s) detected that should be addressed. `;
    }

    if (suggestions.length > 0) {
      summary += `${suggestions.length} suggestion(s) for improvement. `;
    }

    return summary.trim();
  }
}
