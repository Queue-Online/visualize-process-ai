/**
 * ComplexityAnalyzer - Analyzes and quantifies process diagram complexity
 */
export class ComplexityAnalyzer {
  
  /**
   * Analyze overall complexity of a process diagram
   */
  async analyze(visualization) {
    const { nodes, edges } = visualization;
    
    try {
      // Calculate different complexity metrics
      const structural = this.analyzeStructuralComplexity(nodes, edges);
      const cognitive = this.analyzeCognitiveComplexity(nodes, edges);
      const computational = this.analyzeComputationalComplexity(nodes, edges);
      const maintenance = this.analyzeMaintenanceComplexity(nodes, edges);
      
      // Calculate overall complexity score
      const overallScore = this.calculateOverallScore(structural, cognitive, computational, maintenance);
      
      // Determine complexity level
      const level = this.determineComplexityLevel(overallScore);
      
      // Generate complexity factors breakdown
      const factors = this.analyzeComplexityFactors(nodes, edges);
      
      // Provide recommendations
      const recommendations = this.generateComplexityRecommendations(overallScore, factors);
      
      return {
        overallScore,
        level,
        metrics: {
          structural,
          cognitive,
          computational,
          maintenance
        },
        factors,
        recommendations,
        breakdown: {
          nodeComplexity: this.calculateNodeComplexity(nodes),
          edgeComplexity: this.calculateEdgeComplexity(edges),
          flowComplexity: this.calculateFlowComplexity(nodes, edges),
          interactionComplexity: this.calculateInteractionComplexity(nodes, edges)
        }
      };
      
    } catch (error) {
      throw new Error(`Complexity analysis failed: ${error.message}`);
    }
  }

  /**
   * Analyze structural complexity based on diagram topology
   */
  analyzeStructuralComplexity(nodes, edges) {
    const metrics = {
      nodeCount: nodes.length,
      edgeCount: edges.length,
      cyclomaticComplexity: this.calculateCyclomaticComplexity(nodes, edges),
      branchingFactor: this.calculateBranchingFactor(nodes, edges),
      depth: this.calculateMaxDepth(nodes, edges),
      width: this.calculateMaxWidth(nodes, edges)
    };
    
    // Weighted score calculation
    const score = (
      metrics.nodeCount * 0.1 +
      metrics.edgeCount * 0.15 +
      metrics.cyclomaticComplexity * 2 +
      metrics.branchingFactor * 1.5 +
      metrics.depth * 0.5 +
      metrics.width * 0.3
    );
    
    return {
      score: Math.round(score * 10) / 10,
      metrics,
      interpretation: this.interpretStructuralComplexity(score)
    };
  }

  /**
   * Analyze cognitive complexity - how hard it is to understand
   */
  analyzeCognitiveComplexity(nodes, edges) {
    const metrics = {
      decisionPoints: nodes.filter(n => n.type === 'decision').length,
      externalDependencies: nodes.filter(n => 
        n.type === 'external-service' || n.type === 'api-call'
      ).length,
      userInteractions: nodes.filter(n => 
        n.type === 'user-action' || n.type === 'html-element'
      ).length,
      dataOperations: nodes.filter(n => n.type === 'database').length,
      pathDiversity: this.calculatePathDiversity(nodes, edges),
      labelClarity: this.assessLabelClarity(nodes)
    };
    
    const score = (
      metrics.decisionPoints * 3 +
      metrics.externalDependencies * 2 +
      metrics.userInteractions * 1.5 +
      metrics.dataOperations * 1 +
      metrics.pathDiversity * 2 +
      (10 - metrics.labelClarity) * 0.5
    );
    
    return {
      score: Math.round(score * 10) / 10,
      metrics,
      interpretation: this.interpretCognitiveComplexity(score)
    };
  }

  /**
   * Analyze computational complexity - resource requirements
   */
  analyzeComputationalComplexity(nodes, edges) {
    const metrics = {
      computationalNodes: this.countComputationalNodes(nodes),
      ioOperations: this.countIOOperations(nodes),
      networkCalls: this.countNetworkCalls(nodes),
      databaseOperations: this.countDatabaseOperations(nodes),
      parallelizability: this.assessParallelizability(nodes, edges),
      resourceIntensity: this.assessResourceIntensity(nodes)
    };
    
    const score = (
      metrics.computationalNodes * 1.5 +
      metrics.ioOperations * 2 +
      metrics.networkCalls * 3 +
      metrics.databaseOperations * 2.5 +
      (10 - metrics.parallelizability) * 0.5 +
      metrics.resourceIntensity * 1
    );
    
    return {
      score: Math.round(score * 10) / 10,
      metrics,
      interpretation: this.interpretComputationalComplexity(score)
    };
  }

  /**
   * Analyze maintenance complexity - how hard it is to modify
   */
  analyzeMaintenanceComplexity(nodes, edges) {
    const metrics = {
      coupling: this.calculateCoupling(nodes, edges),
      cohesion: this.calculateCohesion(nodes, edges),
      changeImpact: this.assessChangeImpact(nodes, edges),
      testability: this.assessTestability(nodes, edges),
      modularity: this.assessModularity(nodes, edges),
      documentation: this.assessDocumentation(nodes)
    };
    
    const score = (
      metrics.coupling * 2 +
      (10 - metrics.cohesion) * 1.5 +
      metrics.changeImpact * 1.5 +
      (10 - metrics.testability) * 1 +
      (10 - metrics.modularity) * 1 +
      (10 - metrics.documentation) * 0.5
    );
    
    return {
      score: Math.round(score * 10) / 10,
      metrics,
      interpretation: this.interpretMaintenanceComplexity(score)
    };
  }

  /**
   * Calculate cyclomatic complexity
   */
  calculateCyclomaticComplexity(nodes, edges) {
    const decisions = nodes.filter(node => node.type === 'decision').length;
    const stronglyConnectedComponents = this.findStronglyConnectedComponents(nodes, edges);
    
    // V(G) = E - N + 2P (where P is number of connected components)
    return edges.length - nodes.length + 2 * stronglyConnectedComponents + decisions;
  }

  /**
   * Calculate branching factor
   */
  calculateBranchingFactor(nodes, edges) {
    const outgoingCounts = nodes.map(node => 
      edges.filter(edge => edge.source === node.id).length
    );
    
    return Math.max(...outgoingCounts, 1);
  }

  /**
   * Calculate maximum depth of the process
   */
  calculateMaxDepth(nodes, edges) {
    const startNodes = nodes.filter(node => 
      node.type === 'start' || 
      !edges.some(edge => edge.target === node.id)
    );
    
    if (startNodes.length === 0) return 0;
    
    let maxDepth = 0;
    
    const calculateDepth = (nodeId, depth = 0, visited = new Set()) => {
      if (visited.has(nodeId)) return depth;
      visited.add(nodeId);
      
      const outgoing = edges.filter(edge => edge.source === nodeId);
      if (outgoing.length === 0) {
        maxDepth = Math.max(maxDepth, depth);
        return depth;
      }
      
      outgoing.forEach(edge => {
        calculateDepth(edge.target, depth + 1, new Set(visited));
      });
    };
    
    startNodes.forEach(node => calculateDepth(node.id));
    return maxDepth;
  }

  /**
   * Calculate maximum width (parallel branches)
   */
  calculateMaxWidth(nodes, edges) {
    let maxWidth = 1;
    
    // Find all levels in the process
    const levels = this.calculateNodeLevels(nodes, edges);
    const levelCounts = {};
    
    Object.values(levels).forEach(level => {
      levelCounts[level] = (levelCounts[level] || 0) + 1;
      maxWidth = Math.max(maxWidth, levelCounts[level]);
    });
    
    return maxWidth;
  }

  /**
   * Calculate path diversity
   */
  calculatePathDiversity(nodes, edges) {
    const startNodes = nodes.filter(node => node.type === 'start');
    const endNodes = nodes.filter(node => node.type === 'end');
    
    if (startNodes.length === 0 || endNodes.length === 0) return 1;
    
    let totalPaths = 0;
    startNodes.forEach(start => {
      endNodes.forEach(end => {
        const pathCount = this.countPathsBetween(start.id, end.id, nodes, edges);
        totalPaths += pathCount;
      });
    });
    
    return Math.min(totalPaths, 10); // Cap at 10 for scoring
  }

  /**
   * Assess label clarity
   */
  assessLabelClarity(nodes) {
    let clarityScore = 0;
    
    nodes.forEach(node => {
      const label = node.data?.label || '';
      const description = node.data?.description || '';
      
      // Score based on label length and descriptiveness
      if (label.length === 0) {
        clarityScore += 0;
      } else if (label.length < 5) {
        clarityScore += 3;
      } else if (label.length > 50) {
        clarityScore += 5;
      } else {
        clarityScore += 8;
      }
      
      // Bonus for having description
      if (description.length > 0) {
        clarityScore += 2;
      }
    });
    
    return Math.min(clarityScore / nodes.length, 10);
  }

  /**
   * Count computational nodes
   */
  countComputationalNodes(nodes) {
    const computationalTypes = ['decision', 'database', 'api-call', 'external-service'];
    return nodes.filter(node => computationalTypes.includes(node.type)).length;
  }

  /**
   * Count I/O operations
   */
  countIOOperations(nodes) {
    return nodes.filter(node => 
      node.type === 'database' || 
      node.type === 'html-element' ||
      node.type === 'user-action'
    ).length;
  }

  /**
   * Count network calls
   */
  countNetworkCalls(nodes) {
    return nodes.filter(node => 
      node.type === 'api-call' || 
      node.type === 'external-service'
    ).length;
  }

  /**
   * Count database operations
   */
  countDatabaseOperations(nodes) {
    return nodes.filter(node => node.type === 'database').length;
  }

  /**
   * Assess parallelizability
   */
  assessParallelizability(nodes, edges) {
    const forkPoints = nodes.filter(node => {
      const outgoing = edges.filter(edge => edge.source === node.id);
      return outgoing.length > 1;
    });
    
    const joinPoints = nodes.filter(node => {
      const incoming = edges.filter(edge => edge.target === node.id);
      return incoming.length > 1;
    });
    
    const parallelizability = (forkPoints.length + joinPoints.length) / nodes.length * 10;
    return Math.min(parallelizability, 10);
  }

  /**
   * Assess resource intensity
   */
  assessResourceIntensity(nodes) {
    const intensityMap = {
      'database': 3,
      'api-call': 2,
      'external-service': 3,
      'html-element': 1,
      'user-action': 1,
      'decision': 1,
      'start': 0,
      'end': 0
    };
    
    const totalIntensity = nodes.reduce((sum, node) => {
      return sum + (intensityMap[node.type] || 1);
    }, 0);
    
    return Math.min(totalIntensity / nodes.length, 10);
  }

  /**
   * Calculate coupling
   */
  calculateCoupling(nodes, edges) {
    if (nodes.length <= 1) return 0;
    
    const maxPossibleEdges = nodes.length * (nodes.length - 1);
    const couplingRatio = edges.length / maxPossibleEdges;
    
    return Math.min(couplingRatio * 10, 10);
  }

  /**
   * Calculate cohesion
   */
  calculateCohesion(nodes, edges) {
    if (nodes.length === 0) return 10;
    
    // Group nodes by type and calculate internal connections
    const typeGroups = {};
    nodes.forEach(node => {
      if (!typeGroups[node.type]) {
        typeGroups[node.type] = [];
      }
      typeGroups[node.type].push(node.id);
    });
    
    let totalCohesion = 0;
    let groupCount = 0;
    
    Object.values(typeGroups).forEach(group => {
      if (group.length > 1) {
        const internalEdges = edges.filter(edge => 
          group.includes(edge.source) && group.includes(edge.target)
        ).length;
        
        const maxInternalEdges = group.length * (group.length - 1);
        const cohesion = maxInternalEdges > 0 ? internalEdges / maxInternalEdges : 0;
        
        totalCohesion += cohesion;
        groupCount++;
      }
    });
    
    return groupCount > 0 ? (totalCohesion / groupCount) * 10 : 5;
  }

  /**
   * Overall complexity calculation
   */
  calculateOverallScore(structural, cognitive, computational, maintenance) {
    const weights = {
      structural: 0.3,
      cognitive: 0.3,
      computational: 0.2,
      maintenance: 0.2
    };
    
    return Math.round(
      structural.score * weights.structural +
      cognitive.score * weights.cognitive +
      computational.score * weights.computational +
      maintenance.score * weights.maintenance
    );
  }

  /**
   * Determine complexity level based on score
   */
  determineComplexityLevel(score) {
    if (score <= 10) return 'Very Low';
    if (score <= 20) return 'Low';
    if (score <= 35) return 'Medium';
    if (score <= 50) return 'High';
    return 'Very High';
  }

  /**
   * Analyze specific complexity factors
   */
  analyzeComplexityFactors(nodes, edges) {
    return {
      nodeDistribution: this.analyzeNodeDistribution(nodes),
      connectionPatterns: this.analyzeConnectionPatterns(nodes, edges),
      complexityHotspots: this.identifyComplexityHotspots(nodes, edges),
      simplificationOpportunities: this.identifySimplificationOpportunities(nodes, edges)
    };
  }

  /**
   * Generate complexity-based recommendations
   */
  generateComplexityRecommendations(score, factors) {
    const recommendations = [];
    
    if (score > 50) {
      recommendations.push({
        priority: 'high',
        category: 'architecture',
        title: 'Consider breaking down the process',
        description: 'The process is very complex. Consider splitting it into smaller, manageable sub-processes.',
        expectedImpact: 'significant'
      });
    }
    
    if (score > 35) {
      recommendations.push({
        priority: 'medium',
        category: 'documentation',
        title: 'Enhance documentation',
        description: 'Add detailed descriptions and comments to improve understanding.',
        expectedImpact: 'moderate'
      });
    }
    
    if (factors.complexityHotspots?.length > 0) {
      recommendations.push({
        priority: 'medium',
        category: 'refactoring',
        title: 'Address complexity hotspots',
        description: 'Focus on simplifying the most complex nodes and connections.',
        expectedImpact: 'moderate'
      });
    }
    
    return recommendations;
  }

  // Helper methods (simplified implementations)
  
  findStronglyConnectedComponents(nodes, edges) {
    // Simplified - returns 1 for connected graph
    return 1;
  }

  calculateNodeLevels(nodes, edges) {
    const levels = {};
    const startNodes = nodes.filter(node => node.type === 'start');
    
    const assignLevel = (nodeId, level = 0, visited = new Set()) => {
      if (visited.has(nodeId)) return;
      visited.add(nodeId);
      
      levels[nodeId] = Math.max(levels[nodeId] || 0, level);
      
      const outgoing = edges.filter(edge => edge.source === nodeId);
      outgoing.forEach(edge => {
        assignLevel(edge.target, level + 1, new Set(visited));
      });
    };
    
    startNodes.forEach(node => assignLevel(node.id));
    return levels;
  }

  countPathsBetween(startId, endId, nodes, edges, visited = new Set()) {
    if (startId === endId) return 1;
    if (visited.has(startId)) return 0;
    
    visited.add(startId);
    let pathCount = 0;
    
    const outgoing = edges.filter(edge => edge.source === startId);
    outgoing.forEach(edge => {
      pathCount += this.countPathsBetween(edge.target, endId, nodes, edges, new Set(visited));
    });
    
    return pathCount;
  }

  analyzeNodeDistribution(nodes) {
    const distribution = {};
    nodes.forEach(node => {
      distribution[node.type] = (distribution[node.type] || 0) + 1;
    });
    
    return {
      typeCount: Object.keys(distribution).length,
      distribution,
      dominantType: Object.entries(distribution).reduce((a, b) => a[1] > b[1] ? a : b)[0]
    };
  }

  analyzeConnectionPatterns(nodes, edges) {
    const patterns = {
      fanOut: 0,
      fanIn: 0,
      sequential: 0,
      parallel: 0
    };
    
    nodes.forEach(node => {
      const outgoing = edges.filter(edge => edge.source === node.id);
      const incoming = edges.filter(edge => edge.target === node.id);
      
      if (outgoing.length > 1) patterns.fanOut++;
      if (incoming.length > 1) patterns.fanIn++;
      if (outgoing.length === 1 && incoming.length === 1) patterns.sequential++;
      if (outgoing.length > 1 || incoming.length > 1) patterns.parallel++;
    });
    
    return patterns;
  }

  identifyComplexityHotspots(nodes, edges) {
    return nodes
      .map(node => {
        const incoming = edges.filter(edge => edge.target === node.id).length;
        const outgoing = edges.filter(edge => edge.source === node.id).length;
        const complexity = incoming + outgoing + (node.type === 'decision' ? 2 : 0);
        
        return {
          nodeId: node.id,
          label: node.data?.label,
          type: node.type,
          complexity,
          isHotspot: complexity > 3
        };
      })
      .filter(node => node.isHotspot)
      .sort((a, b) => b.complexity - a.complexity);
  }

  identifySimplificationOpportunities(nodes, edges) {
    const opportunities = [];
    
    // Find sequential chains that could be simplified
    const sequentialChains = this.findSequentialChains(nodes, edges);
    if (sequentialChains.length > 0) {
      opportunities.push({
        type: 'sequential_simplification',
        description: 'Sequential node chains could be consolidated',
        nodes: sequentialChains
      });
    }
    
    // Find redundant paths
    const redundantPaths = this.findRedundantPaths(nodes, edges);
    if (redundantPaths.length > 0) {
      opportunities.push({
        type: 'path_simplification',
        description: 'Redundant paths could be consolidated',
        paths: redundantPaths
      });
    }
    
    return opportunities;
  }

  findSequentialChains(nodes, edges) {
    // Simplified implementation
    return [];
  }

  findRedundantPaths(nodes, edges) {
    // Simplified implementation
    return [];
  }

  assessChangeImpact(nodes, edges) {
    // Simplified: based on node connectivity
    const avgConnectivity = edges.length / nodes.length;
    return Math.min(avgConnectivity * 2, 10);
  }

  assessTestability(nodes, edges) {
    // Simplified: inversely related to complexity
    const decisions = nodes.filter(n => n.type === 'decision').length;
    const external = nodes.filter(n => n.type === 'external-service').length;
    const testability = 10 - (decisions * 0.5 + external * 0.3);
    return Math.max(testability, 0);
  }

  assessModularity(nodes, edges) {
    // Simplified: based on clustering
    const clusters = this.identifyClusters(nodes, edges);
    return Math.min(clusters.length * 2, 10);
  }

  assessDocumentation(nodes) {
    const documented = nodes.filter(node => 
      node.data?.description && node.data.description.length > 10
    ).length;
    
    return (documented / nodes.length) * 10;
  }

  identifyClusters(nodes, edges) {
    // Simplified clustering based on node types
    const clusters = {};
    nodes.forEach(node => {
      if (!clusters[node.type]) {
        clusters[node.type] = [];
      }
      clusters[node.type].push(node.id);
    });
    
    return Object.values(clusters);
  }

  calculateNodeComplexity(nodes) {
    return nodes.reduce((sum, node) => {
      const baseComplexity = this.getNodeBaseComplexity(node.type);
      const dataComplexity = this.getNodeDataComplexity(node.data);
      return sum + baseComplexity + dataComplexity;
    }, 0);
  }

  calculateEdgeComplexity(edges) {
    return edges.reduce((sum, edge) => {
      let complexity = 1; // Base complexity
      if (edge.label && edge.label.length > 0) complexity += 0.5;
      if (edge.animated) complexity += 0.2;
      return sum + complexity;
    }, 0);
  }

  calculateFlowComplexity(nodes, edges) {
    const cycles = this.detectCycles(nodes, edges);
    const branches = this.countBranches(nodes, edges);
    return cycles * 3 + branches * 1.5;
  }

  calculateInteractionComplexity(nodes, edges) {
    const userNodes = nodes.filter(n => 
      n.type === 'user-action' || n.type === 'html-element'
    );
    const externalNodes = nodes.filter(n => 
      n.type === 'external-service' || n.type === 'api-call'
    );
    
    return userNodes.length * 1.5 + externalNodes.length * 2;
  }

  getNodeBaseComplexity(type) {
    const complexities = {
      'start': 0.5,
      'end': 0.5,
      'html-element': 1,
      'database': 2,
      'api-call': 2.5,
      'decision': 3,
      'user-action': 1.5,
      'external-service': 2.5
    };
    
    return complexities[type] || 1;
  }

  getNodeDataComplexity(data) {
    if (!data) return 0;
    
    let complexity = 0;
    if (data.condition) complexity += 1;
    if (data.operation) complexity += 0.5;
    if (data.method) complexity += 0.5;
    if (data.fields && Array.isArray(data.fields)) complexity += data.fields.length * 0.1;
    
    return complexity;
  }

  detectCycles(nodes, edges) {
    const visited = new Set();
    const recursionStack = new Set();
    let cycles = 0;
    
    const hasCycle = (nodeId) => {
      if (recursionStack.has(nodeId)) {
        cycles++;
        return true;
      }
      if (visited.has(nodeId)) return false;
      
      visited.add(nodeId);
      recursionStack.add(nodeId);
      
      const outgoing = edges.filter(edge => edge.source === nodeId);
      for (const edge of outgoing) {
        if (hasCycle(edge.target)) return true;
      }
      
      recursionStack.delete(nodeId);
      return false;
    };
    
    nodes.forEach(node => {
      if (!visited.has(node.id)) {
        hasCycle(node.id);
      }
    });
    
    return cycles;
  }

  countBranches(nodes, edges) {
    return nodes.reduce((count, node) => {
      const outgoing = edges.filter(edge => edge.source === node.id);
      return count + Math.max(0, outgoing.length - 1);
    }, 0);
  }

  // Interpretation methods
  interpretStructuralComplexity(score) {
    if (score <= 5) return 'Simple structure with clear flow';
    if (score <= 15) return 'Moderate structure complexity';
    if (score <= 25) return 'Complex structure requiring attention';
    return 'Highly complex structure needing simplification';
  }

  interpretCognitiveComplexity(score) {
    if (score <= 5) return 'Easy to understand and follow';
    if (score <= 15) return 'Moderate cognitive load';
    if (score <= 25) return 'Requires significant mental effort';
    return 'Very difficult to understand without documentation';
  }

  interpretComputationalComplexity(score) {
    if (score <= 5) return 'Low computational requirements';
    if (score <= 15) return 'Moderate resource usage';
    if (score <= 25) return 'High resource requirements';
    return 'Very resource intensive';
  }

  interpretMaintenanceComplexity(score) {
    if (score <= 5) return 'Easy to maintain and modify';
    if (score <= 15) return 'Moderate maintenance effort';
    if (score <= 25) return 'Difficult to maintain';
    return 'Very difficult to maintain and modify';
  }
}
