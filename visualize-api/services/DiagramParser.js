/**
 * DiagramParser - Parses and structures process visualization data
 * for AI readability and MCP tool integration
 */
export class DiagramParser {
  
  /**
   * Parse a visualization into a structured, readable format
   */
  async parseVisualization(visualization, options = {}) {
    const startTime = Date.now();
    
    try {
      const { 
        includeMetadata = true,
        analyzeFlow = true,
        extractPatterns = true 
      } = options;

      // Basic structure validation
      if (!visualization.nodes || !Array.isArray(visualization.nodes)) {
        throw new Error('Invalid visualization: nodes array is required');
      }

      // Parse nodes with enhanced metadata
      const parsedNodes = this.parseNodes(visualization.nodes);
      
      // Parse edges/connections
      const parsedEdges = this.parseEdges(visualization.edges || []);
      
      // Extract process steps in logical order
      const processSteps = this.extractProcessSteps(parsedNodes, parsedEdges);
      
      // Calculate complexity metrics
      const complexity = this.calculateComplexity(parsedNodes, parsedEdges);
      
      // Extract patterns if requested
      const patterns = extractPatterns ? this.extractPatterns(visualization) : [];
      
      // Analyze flow if requested
      const flowAnalysis = analyzeFlow ? this.analyzeBasicFlow(parsedNodes, parsedEdges) : null;

      const result = {
        id: visualization.id,
        name: visualization.name,
        description: visualization.description || '',
        nodes: parsedNodes,
        edges: parsedEdges,
        processSteps,
        complexity,
        ...(patterns.length > 0 && { patterns }),
        ...(flowAnalysis && { flowAnalysis }),
        ...(includeMetadata && {
          metadata: {
            totalNodes: parsedNodes.length,
            totalEdges: parsedEdges.length,
            nodeTypes: this.getNodeTypeStats(parsedNodes),
            createdAt: visualization.createdAt,
            updatedAt: visualization.updatedAt,
            processingTime: Date.now() - startTime
          }
        })
      };

      return result;

    } catch (error) {
      throw new Error(`Parsing failed: ${error.message}`);
    }
  }

  /**
   * Parse nodes with enhanced metadata and categorization
   */
  parseNodes(nodes) {
    return nodes.map(node => {
      const parsed = {
        id: node.id,
        type: node.type,
        label: node.data?.label || 'Untitled Node',
        position: node.position || { x: 0, y: 0 },
        data: { ...node.data }
      };

      // Add semantic categorization
      parsed.category = this.categorizeNode(node.type);
      parsed.semanticRole = this.getSemanticRole(node);
      parsed.description = this.generateNodeDescription(node);
      
      // Add complexity indicators
      parsed.complexity = this.calculateNodeComplexity(node);
      
      return parsed;
    });
  }

  /**
   * Parse edges with flow semantics
   */
  parseEdges(edges) {
    return edges.map(edge => ({
      id: edge.id,
      source: edge.source,
      target: edge.target,
      label: edge.label || '',
      type: edge.type || 'default',
      semanticType: this.getEdgeSemanticType(edge),
      conditions: this.extractEdgeConditions(edge),
      animated: edge.animated || false
    }));
  }

  /**
   * Extract logical process steps from nodes and edges
   */
  extractProcessSteps(nodes, edges) {
    const steps = [];
    const visited = new Set();
    
    // Find start nodes
    const startNodes = nodes.filter(node => 
      node.type === 'start' || 
      !edges.some(edge => edge.target === node.id)
    );

    // Traverse from each start node
    startNodes.forEach(startNode => {
      const path = this.traverseFromNode(startNode, nodes, edges, visited);
      steps.push(...path);
    });

    return steps.map((step, index) => ({
      stepNumber: index + 1,
      ...step,
      dependencies: this.findStepDependencies(step, steps),
      estimatedDuration: this.estimateStepDuration(step)
    }));
  }

  /**
   * Calculate overall diagram complexity
   */
  calculateComplexity(nodes, edges) {
    const nodeComplexity = nodes.reduce((sum, node) => sum + node.complexity, 0);
    const edgeComplexity = edges.length * 0.5; // Base edge complexity
    const branchingFactor = this.calculateBranchingFactor(nodes, edges);
    const depth = this.calculateMaxDepth(nodes, edges);
    
    const overallScore = Math.round(
      (nodeComplexity + edgeComplexity + branchingFactor * 2 + depth) / 10
    );

    return {
      overallScore,
      level: this.getComplexityLevel(overallScore),
      factors: {
        nodeComplexity: Math.round(nodeComplexity),
        connectionComplexity: Math.round(edgeComplexity),
        branchingFactor,
        maxDepth: depth
      },
      recommendations: this.getComplexityRecommendations(overallScore)
    };
  }

  /**
   * Extract common patterns from the diagram
   */
  extractPatterns(visualization) {
    const patterns = [];
    const { nodes, edges } = visualization;

    // Detect sequential patterns
    const sequential = this.detectSequentialPattern(nodes, edges);
    if (sequential.length > 0) {
      patterns.push({
        type: 'sequential',
        name: 'Sequential Processing',
        description: 'Linear flow of operations',
        instances: sequential,
        confidence: 0.9
      });
    }

    // Detect decision patterns
    const decisions = this.detectDecisionPattern(nodes, edges);
    if (decisions.length > 0) {
      patterns.push({
        type: 'decision',
        name: 'Decision Points',
        description: 'Conditional branching in the process',
        instances: decisions,
        confidence: 0.85
      });
    }

    // Detect parallel processing patterns
    const parallel = this.detectParallelPattern(nodes, edges);
    if (parallel.length > 0) {
      patterns.push({
        type: 'parallel',
        name: 'Parallel Processing',
        description: 'Concurrent execution paths',
        instances: parallel,
        confidence: 0.8
      });
    }

    // Detect loop patterns
    const loops = this.detectLoopPattern(nodes, edges);
    if (loops.length > 0) {
      patterns.push({
        type: 'loop',
        name: 'Iterative Processing',
        description: 'Repetitive operations or cycles',
        instances: loops,
        confidence: 0.7
      });
    }

    return patterns;
  }

  /**
   * Generate a human-readable summary
   */
  async generateSummary(diagramId) {
    // This would typically fetch from a database
    // For now, return a sample summary
    return {
      id: diagramId,
      overview: 'This process diagram represents a typical user authentication and data processing workflow.',
      keyComponents: [
        'User authentication system',
        'Database validation layer', 
        'API endpoint processing',
        'Response generation'
      ],
      complexity: 'Medium',
      estimatedImplementationTime: '2-3 days',
      recommendedTechnology: ['Node.js', 'Express', 'MongoDB'],
      criticalPaths: [
        'User login -> Database check -> Session creation',
        'Data request -> Validation -> Database query -> Response'
      ]
    };
  }

  // Helper methods

  categorizeNode(nodeType) {
    const categories = {
      'start': 'entry',
      'end': 'exit',
      'html-element': 'ui',
      'database': 'data',
      'api-call': 'integration',
      'decision': 'logic',
      'user-action': 'interaction',
      'external-service': 'integration'
    };
    return categories[nodeType] || 'other';
  }

  getSemanticRole(node) {
    const { type, data } = node;
    
    const roles = {
      'start': 'process_initiator',
      'end': 'process_terminator', 
      'html-element': 'user_interface',
      'database': 'data_persistence',
      'api-call': 'external_communication',
      'decision': 'conditional_logic',
      'user-action': 'user_interaction',
      'external-service': 'third_party_integration'
    };

    return roles[type] || 'generic_processor';
  }

  generateNodeDescription(node) {
    const { type, data } = node;
    const label = data?.label || 'Unknown';
    
    switch (type) {
      case 'start':
        return `Process begins: ${label}`;
      case 'end':
        return `Process ends: ${label}`;
      case 'html-element':
        return `User interface element: ${label} (${data?.elementType || 'generic'})`;
      case 'database':
        return `Database operation: ${data?.operation || 'query'} on ${data?.table || 'table'}`;
      case 'api-call':
        return `API request: ${data?.method || 'GET'} ${data?.endpoint || '/api'}`;
      case 'decision':
        return `Decision point: ${data?.condition || 'conditional logic'}`;
      case 'user-action':
        return `User action: ${data?.actionType || 'interaction'} - ${label}`;
      case 'external-service':
        return `External service: ${data?.serviceType || 'third-party'} integration`;
      default:
        return `Generic step: ${label}`;
    }
  }

  calculateNodeComplexity(node) {
    const baseComplexity = 1;
    const typeMultipliers = {
      'start': 0.5,
      'end': 0.5,
      'html-element': 1,
      'database': 2,
      'api-call': 2.5,
      'decision': 3,
      'user-action': 1.5,
      'external-service': 3
    };
    
    return baseComplexity * (typeMultipliers[node.type] || 1);
  }

  getEdgeSemanticType(edge) {
    if (edge.label) {
      if (edge.label.toLowerCase().includes('yes') || edge.label.toLowerCase().includes('true')) {
        return 'positive_condition';
      }
      if (edge.label.toLowerCase().includes('no') || edge.label.toLowerCase().includes('false')) {
        return 'negative_condition';
      }
      if (edge.label.toLowerCase().includes('error')) {
        return 'error_flow';
      }
    }
    return 'default_flow';
  }

  extractEdgeConditions(edge) {
    const conditions = [];
    if (edge.label) {
      // Simple condition extraction - could be enhanced with NLP
      if (edge.label.includes('if') || edge.label.includes('when')) {
        conditions.push({
          type: 'conditional',
          expression: edge.label
        });
      }
    }
    return conditions;
  }

  traverseFromNode(node, allNodes, allEdges, visited, path = []) {
    if (visited.has(node.id)) return path;
    
    visited.add(node.id);
    path.push({
      id: node.id,
      type: node.type,
      label: node.label,
      description: node.description,
      semanticRole: node.semanticRole
    });

    // Find outgoing edges
    const outgoingEdges = allEdges.filter(edge => edge.source === node.id);
    
    outgoingEdges.forEach(edge => {
      const targetNode = allNodes.find(n => n.id === edge.target);
      if (targetNode && !visited.has(targetNode.id)) {
        this.traverseFromNode(targetNode, allNodes, allEdges, visited, path);
      }
    });

    return path;
  }

  findStepDependencies(step, allSteps) {
    // Simple dependency analysis - in practice this would be more sophisticated
    return allSteps
      .filter(s => s.stepNumber < step.stepNumber && s.semanticRole === step.semanticRole)
      .map(s => s.id);
  }

  estimateStepDuration(step) {
    const durations = {
      'process_initiator': '1 minute',
      'user_interface': '2-5 minutes',
      'data_persistence': '1-3 minutes', 
      'external_communication': '2-10 seconds',
      'conditional_logic': '< 1 second',
      'user_interaction': '10-60 seconds',
      'third_party_integration': '1-5 seconds'
    };
    
    return durations[step.semanticRole] || '1-2 minutes';
  }

  calculateBranchingFactor(nodes, edges) {
    const branches = nodes.map(node => {
      return edges.filter(edge => edge.source === node.id).length;
    });
    
    return Math.max(...branches, 1);
  }

  calculateMaxDepth(nodes, edges) {
    // Simple depth calculation - could be enhanced
    const startNodes = nodes.filter(node => 
      node.type === 'start' || 
      !edges.some(edge => edge.target === node.id)
    );
    
    let maxDepth = 0;
    startNodes.forEach(start => {
      const depth = this.getDepthFromNode(start, nodes, edges, new Set());
      maxDepth = Math.max(maxDepth, depth);
    });
    
    return maxDepth;
  }

  getDepthFromNode(node, allNodes, allEdges, visited) {
    if (visited.has(node.id)) return 0;
    
    visited.add(node.id);
    const outgoingEdges = allEdges.filter(edge => edge.source === node.id);
    
    if (outgoingEdges.length === 0) return 1;
    
    let maxChildDepth = 0;
    outgoingEdges.forEach(edge => {
      const targetNode = allNodes.find(n => n.id === edge.target);
      if (targetNode) {
        const childDepth = this.getDepthFromNode(targetNode, allNodes, allEdges, new Set(visited));
        maxChildDepth = Math.max(maxChildDepth, childDepth);
      }
    });
    
    return 1 + maxChildDepth;
  }

  getComplexityLevel(score) {
    if (score <= 3) return 'Low';
    if (score <= 7) return 'Medium';
    if (score <= 12) return 'High';
    return 'Very High';
  }

  getComplexityRecommendations(score) {
    if (score <= 3) {
      return ['Process is simple and straightforward', 'Good for rapid implementation'];
    }
    if (score <= 7) {
      return ['Moderate complexity', 'Consider breaking into smaller components', 'Good documentation recommended'];
    }
    if (score <= 12) {
      return ['High complexity', 'Strong testing strategy needed', 'Consider modular architecture'];
    }
    return ['Very high complexity', 'Requires careful planning', 'Consider simplification', 'Extensive testing essential'];
  }

  getNodeTypeStats(nodes) {
    const stats = {};
    nodes.forEach(node => {
      stats[node.type] = (stats[node.type] || 0) + 1;
    });
    return stats;
  }

  // Pattern detection methods
  detectSequentialPattern(nodes, edges) {
    const sequences = [];
    // Implementation for detecting sequential patterns
    return sequences;
  }

  detectDecisionPattern(nodes, edges) {
    return nodes
      .filter(node => node.type === 'decision')
      .map(node => ({
        nodeId: node.id,
        label: node.data?.label,
        condition: node.data?.condition,
        outgoingPaths: edges.filter(edge => edge.source === node.id).length
      }));
  }

  detectParallelPattern(nodes, edges) {
    const parallel = [];
    // Implementation for detecting parallel patterns
    return parallel;
  }

  detectLoopPattern(nodes, edges) {
    const loops = [];
    // Implementation for detecting loop patterns  
    return loops;
  }

  analyzeBasicFlow(nodes, edges) {
    const startNodes = nodes.filter(node => node.type === 'start');
    const endNodes = nodes.filter(node => node.type === 'end');
    
    return {
      entryPoints: startNodes.length,
      exitPoints: endNodes.length,
      totalConnections: edges.length,
      averageConnectionsPerNode: edges.length / nodes.length,
      hasCircularFlow: this.detectCircularFlow(nodes, edges)
    };
  }

  detectCircularFlow(nodes, edges) {
    // Simple cycle detection
    const visited = new Set();
    const recursionStack = new Set();
    
    const hasCycle = (nodeId) => {
      if (recursionStack.has(nodeId)) return true;
      if (visited.has(nodeId)) return false;
      
      visited.add(nodeId);
      recursionStack.add(nodeId);
      
      const outgoingEdges = edges.filter(edge => edge.source === nodeId);
      for (const edge of outgoingEdges) {
        if (hasCycle(edge.target)) return true;
      }
      
      recursionStack.delete(nodeId);
      return false;
    };
    
    for (const node of nodes) {
      if (hasCycle(node.id)) return true;
    }
    
    return false;
  }
}
