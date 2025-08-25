/**
 * ProcessAnalyzer - Analyzes process flow, dependencies, and performance characteristics
 */
export class ProcessAnalyzer {
  
  /**
   * Analyze the logical flow of a process
   */
  async analyzeFlow(visualization, options = {}) {
    const { nodes, edges } = visualization;
    const { includeMetrics = true, analyzePaths = true } = options;
    
    try {
      // Find all possible execution paths
      const paths = analyzePaths ? this.findAllPaths(nodes, edges) : [];
      
      // Identify critical path (longest path)
      const criticalPath = this.findCriticalPath(paths, nodes);
      
      // Identify bottlenecks
      const bottlenecks = this.identifyBottlenecks(nodes, edges);
      
      // Find parallel processes
      const parallelProcesses = this.findParallelProcesses(nodes, edges);
      
      // Analyze flow patterns
      const patterns = this.analyzeFlowPatterns(nodes, edges);
      
      // Calculate flow metrics
      const metrics = includeMetrics ? this.calculateFlowMetrics(nodes, edges, paths) : {};
      
      return {
        paths,
        criticalPath,
        bottlenecks,
        parallelProcesses,
        patterns,
        ...(includeMetrics && { metrics }),
        flowAnalysis: {
          totalNodes: nodes.length,
          totalConnections: edges.length,
          complexity: this.calculateFlowComplexity(nodes, edges),
          efficiency: this.calculateFlowEfficiency(nodes, edges, paths)
        }
      };
      
    } catch (error) {
      throw new Error(`Flow analysis failed: ${error.message}`);
    }
  }

  /**
   * Analyze dependencies between components
   */
  async analyzeDependencies(visualization) {
    const { nodes, edges } = visualization;
    
    try {
      const dependencies = [];
      
      // Analyze direct dependencies
      edges.forEach(edge => {
        const sourceNode = nodes.find(n => n.id === edge.source);
        const targetNode = nodes.find(n => n.id === edge.target);
        
        if (sourceNode && targetNode) {
          dependencies.push({
            id: `${edge.source}-${edge.target}`,
            source: {
              id: sourceNode.id,
              label: sourceNode.data?.label || 'Untitled',
              type: sourceNode.type
            },
            target: {
              id: targetNode.id,
              label: targetNode.data?.label || 'Untitled', 
              type: targetNode.type
            },
            type: this.determineDependencyType(sourceNode, targetNode, edge),
            strength: this.calculateDependencyStrength(sourceNode, targetNode, edge),
            critical: this.isDependencyCritical(sourceNode, targetNode, edges)
          });
        }
      });
      
      // Identify circular dependencies
      const circularDependencies = this.findCircularDependencies(dependencies);
      
      // Find critical components
      const criticalComponents = this.findCriticalComponents(nodes, dependencies);
      
      return {
        dependencies,
        circularDependencies,
        criticalComponents,
        dependencyMatrix: this.buildDependencyMatrix(nodes, dependencies),
        insights: {
          strongDependencies: dependencies.filter(d => d.strength === 'strong').length,
          weakDependencies: dependencies.filter(d => d.strength === 'weak').length,
          circularCount: circularDependencies.length,
          mostDependentComponent: this.findMostDependentComponent(nodes, dependencies)
        }
      };
      
    } catch (error) {
      throw new Error(`Dependency analysis failed: ${error.message}`);
    }
  }

  /**
   * Analyze performance characteristics
   */
  async analyzePerformance(visualization, metrics = {}) {
    const { nodes, edges } = visualization;
    
    try {
      // Estimate processing times for each node
      const nodePerformance = this.estimateNodePerformance(nodes, metrics);
      
      // Find performance bottlenecks
      const bottlenecks = this.identifyPerformanceBottlenecks(nodePerformance, edges);
      
      // Calculate path performance
      const paths = this.findAllPaths(nodes, edges);
      const pathPerformance = this.calculatePathPerformance(paths, nodePerformance);
      
      // Suggest optimizations
      const optimizations = this.suggestPerformanceOptimizations(bottlenecks, pathPerformance);
      
      return {
        nodePerformance,
        bottlenecks,
        pathPerformance,
        suggestedOptimizations: optimizations,
        overall: {
          estimatedTotalTime: this.calculateTotalExecutionTime(pathPerformance),
          criticalPathTime: this.findLongestPathTime(pathPerformance),
          parallelizable: this.identifyParallelizableComponents(nodes, edges),
          scalabilityFactors: this.identifyScalabilityFactors(nodes)
        }
      };
      
    } catch (error) {
      throw new Error(`Performance analysis failed: ${error.message}`);
    }
  }

  /**
   * Find all execution paths from start to end nodes
   */
  findAllPaths(nodes, edges) {
    const paths = [];
    const startNodes = nodes.filter(node => node.type === 'start');
    const endNodes = nodes.filter(node => node.type === 'end');
    
    startNodes.forEach(startNode => {
      endNodes.forEach(endNode => {
        const pathsToEnd = this.findPathsBetweenNodes(startNode.id, endNode.id, nodes, edges);
        paths.push(...pathsToEnd);
      });
    });
    
    return paths.map((path, index) => ({
      id: `path-${index}`,
      nodes: path,
      length: path.length,
      complexity: this.calculatePathComplexity(path, nodes, edges),
      estimatedDuration: this.estimatePathDuration(path, nodes)
    }));
  }

  /**
   * Find paths between two specific nodes
   */
  findPathsBetweenNodes(startId, endId, nodes, edges, visited = new Set(), currentPath = []) {
    if (visited.has(startId)) return [];
    if (startId === endId) return [[...currentPath, startId]];
    
    visited.add(startId);
    currentPath.push(startId);
    
    const paths = [];
    const outgoingEdges = edges.filter(edge => edge.source === startId);
    
    outgoingEdges.forEach(edge => {
      const subPaths = this.findPathsBetweenNodes(
        edge.target, 
        endId, 
        nodes, 
        edges, 
        new Set(visited), 
        [...currentPath]
      );
      paths.push(...subPaths);
    });
    
    return paths;
  }

  /**
   * Find the critical path (longest execution path)
   */
  findCriticalPath(paths, nodes) {
    if (paths.length === 0) return null;
    
    let criticalPath = paths[0];
    let maxComplexity = criticalPath.complexity;
    
    paths.forEach(path => {
      if (path.complexity > maxComplexity) {
        maxComplexity = path.complexity;
        criticalPath = path;
      }
    });
    
    return {
      ...criticalPath,
      isCritical: true,
      reason: 'Highest complexity path',
      optimizationPriority: 'high'
    };
  }

  /**
   * Identify bottlenecks in the process
   */
  identifyBottlenecks(nodes, edges) {
    const bottlenecks = [];
    
    nodes.forEach(node => {
      const incomingCount = edges.filter(edge => edge.target === node.id).length;
      const outgoingCount = edges.filter(edge => edge.source === node.id).length;
      
      // Node with many incoming connections (convergence point)
      if (incomingCount > 2) {
        bottlenecks.push({
          nodeId: node.id,
          type: 'convergence',
          severity: incomingCount > 4 ? 'high' : 'medium',
          description: `${incomingCount} processes converge at this point`,
          recommendation: 'Consider parallel processing or load balancing'
        });
      }
      
      // High complexity nodes
      if (this.isHighComplexityNode(node)) {
        bottlenecks.push({
          nodeId: node.id,
          type: 'complexity',
          severity: 'high',
          description: 'High complexity operation',
          recommendation: 'Consider breaking into smaller components'
        });
      }
      
      // External service dependencies
      if (node.type === 'external-service' || node.type === 'api-call') {
        bottlenecks.push({
          nodeId: node.id,
          type: 'external_dependency',
          severity: 'medium',
          description: 'External dependency may cause delays',
          recommendation: 'Implement caching and error handling'
        });
      }
    });
    
    return bottlenecks;
  }

  /**
   * Find parallel processes in the flow
   */
  findParallelProcesses(nodes, edges) {
    const parallelGroups = [];
    
    // Find fork points (nodes with multiple outgoing edges)
    const forkPoints = nodes.filter(node => {
      const outgoingCount = edges.filter(edge => edge.source === node.id).length;
      return outgoingCount > 1;
    });
    
    forkPoints.forEach(forkNode => {
      const parallelPaths = edges
        .filter(edge => edge.source === forkNode.id)
        .map(edge => {
          return this.tracePath(edge.target, nodes, edges);
        });
      
      if (parallelPaths.length > 1) {
        parallelGroups.push({
          forkNode: forkNode.id,
          paths: parallelPaths,
          canOptimize: true,
          estimatedSpeedup: this.calculateParallelSpeedup(parallelPaths)
        });
      }
    });
    
    return parallelGroups;
  }

  /**
   * Analyze flow patterns
   */
  analyzeFlowPatterns(nodes, edges) {
    const patterns = {};
    
    // Sequential pattern
    patterns.sequential = this.detectSequentialPattern(nodes, edges);
    
    // Branching pattern
    patterns.branching = this.detectBranchingPattern(nodes, edges);
    
    // Loop pattern
    patterns.loops = this.detectLoopPattern(nodes, edges);
    
    // Pipeline pattern
    patterns.pipeline = this.detectPipelinePattern(nodes, edges);
    
    return patterns;
  }

  /**
   * Calculate flow metrics
   */
  calculateFlowMetrics(nodes, edges, paths) {
    return {
      cyclomatic_complexity: this.calculateCyclomaticComplexity(edges, nodes),
      fan_in_out: this.calculateFanInOut(nodes, edges),
      depth: this.calculateMaxDepth(nodes, edges),
      width: this.calculateMaxWidth(nodes, edges),
      coupling: this.calculateCoupling(nodes, edges),
      cohesion: this.calculateCohesion(nodes, edges)
    };
  }

  /**
   * Helper methods
   */
  calculateFlowComplexity(nodes, edges) {
    const baseComplexity = nodes.length;
    const edgeComplexity = edges.length * 0.5;
    const branchingComplexity = this.calculateBranchingComplexity(nodes, edges);
    
    return Math.round(baseComplexity + edgeComplexity + branchingComplexity);
  }

  calculateFlowEfficiency(nodes, edges, paths) {
    if (paths.length === 0) return 0;
    
    const avgPathLength = paths.reduce((sum, path) => sum + path.length, 0) / paths.length;
    const totalNodes = nodes.length;
    
    // Efficiency is inversely related to redundant paths and node usage
    return Math.round((avgPathLength / totalNodes) * 100);
  }

  determineDependencyType(sourceNode, targetNode, edge) {
    if (sourceNode.type === 'database' && targetNode.type === 'api-call') {
      return 'data_dependency';
    }
    if (sourceNode.type === 'decision') {
      return 'conditional_dependency';
    }
    if (sourceNode.type === 'user-action') {
      return 'user_dependency';
    }
    return 'sequential_dependency';
  }

  calculateDependencyStrength(sourceNode, targetNode, edge) {
    // Database and external service dependencies are strong
    if (sourceNode.type === 'database' || sourceNode.type === 'external-service') {
      return 'strong';
    }
    
    // UI dependencies are medium
    if (sourceNode.type === 'html-element' || sourceNode.type === 'user-action') {
      return 'medium';
    }
    
    return 'weak';
  }

  isDependencyCritical(sourceNode, targetNode, edges) {
    // If removing this dependency would isolate the target node
    const targetIncoming = edges.filter(edge => edge.target === targetNode.id);
    return targetIncoming.length === 1;
  }

  findCircularDependencies(dependencies) {
    const circular = [];
    const visited = new Set();
    const recursionStack = new Set();
    
    const dfs = (nodeId, path = []) => {
      if (recursionStack.has(nodeId)) {
        const cycleStart = path.indexOf(nodeId);
        circular.push(path.slice(cycleStart));
        return;
      }
      
      if (visited.has(nodeId)) return;
      
      visited.add(nodeId);
      recursionStack.add(nodeId);
      path.push(nodeId);
      
      const outgoingDeps = dependencies.filter(dep => dep.source.id === nodeId);
      outgoingDeps.forEach(dep => dfs(dep.target.id, [...path]));
      
      recursionStack.delete(nodeId);
    };
    
    const allNodeIds = new Set();
    dependencies.forEach(dep => {
      allNodeIds.add(dep.source.id);
      allNodeIds.add(dep.target.id);
    });
    
    allNodeIds.forEach(nodeId => {
      if (!visited.has(nodeId)) {
        dfs(nodeId);
      }
    });
    
    return circular;
  }

  findCriticalComponents(nodes, dependencies) {
    return nodes
      .map(node => {
        const incomingDeps = dependencies.filter(dep => dep.target.id === node.id);
        const outgoingDeps = dependencies.filter(dep => dep.source.id === node.id);
        
        return {
          nodeId: node.id,
          label: node.data?.label,
          type: node.type,
          incomingCount: incomingDeps.length,
          outgoingCount: outgoingDeps.length,
          totalConnections: incomingDeps.length + outgoingDeps.length,
          criticalityScore: this.calculateCriticalityScore(node, incomingDeps, outgoingDeps)
        };
      })
      .sort((a, b) => b.criticalityScore - a.criticalityScore)
      .slice(0, 5); // Top 5 critical components
  }

  buildDependencyMatrix(nodes, dependencies) {
    const matrix = {};
    
    nodes.forEach(node => {
      matrix[node.id] = {};
      nodes.forEach(otherNode => {
        matrix[node.id][otherNode.id] = dependencies.some(
          dep => dep.source.id === node.id && dep.target.id === otherNode.id
        );
      });
    });
    
    return matrix;
  }

  estimateNodePerformance(nodes, metrics) {
    return nodes.map(node => {
      const baseTime = this.getBaseProcessingTime(node.type);
      const complexityMultiplier = this.getComplexityMultiplier(node);
      const dataMultiplier = this.getDataMultiplier(node, metrics);
      
      return {
        nodeId: node.id,
        estimatedTime: baseTime * complexityMultiplier * dataMultiplier,
        timeUnit: 'ms',
        factors: {
          baseTime,
          complexity: complexityMultiplier,
          dataLoad: dataMultiplier
        }
      };
    });
  }

  getBaseProcessingTime(nodeType) {
    const baseTimes = {
      'start': 1,
      'end': 1,
      'html-element': 100,
      'database': 50,
      'api-call': 200,
      'decision': 5,
      'user-action': 1000,
      'external-service': 300
    };
    
    return baseTimes[nodeType] || 10;
  }

  getComplexityMultiplier(node) {
    // Simple heuristic based on node type and data
    if (node.type === 'decision' && node.data?.condition) {
      return 1.5;
    }
    if (node.type === 'database' && node.data?.operation === 'write') {
      return 2;
    }
    if (node.type === 'api-call' && node.data?.method === 'POST') {
      return 1.8;
    }
    
    return 1;
  }

  getDataMultiplier(node, metrics) {
    const expectedDataLoad = metrics.expectedDataLoad || 'medium';
    const multipliers = {
      'low': 0.5,
      'medium': 1,
      'high': 2,
      'very_high': 5
    };
    
    return multipliers[expectedDataLoad] || 1;
  }

  // Additional helper methods (simplified for brevity)
  tracePath(nodeId, nodes, edges, visited = new Set()) {
    if (visited.has(nodeId)) return [nodeId];
    
    visited.add(nodeId);
    const path = [nodeId];
    
    const outgoing = edges.filter(edge => edge.source === nodeId);
    if (outgoing.length === 1) {
      path.push(...this.tracePath(outgoing[0].target, nodes, edges, visited));
    }
    
    return path;
  }

  calculateParallelSpeedup(parallelPaths) {
    if (parallelPaths.length <= 1) return 1;
    
    const longestPath = Math.max(...parallelPaths.map(path => path.length));
    const totalSequentialLength = parallelPaths.reduce((sum, path) => sum + path.length, 0);
    
    return Math.round((totalSequentialLength / longestPath) * 10) / 10;
  }

  isHighComplexityNode(node) {
    const complexTypes = ['database', 'api-call', 'external-service', 'decision'];
    return complexTypes.includes(node.type);
  }

  calculatePathComplexity(path, nodes, edges) {
    return path.reduce((complexity, nodeId) => {
      const node = nodes.find(n => n.id === nodeId);
      return complexity + (this.isHighComplexityNode(node) ? 2 : 1);
    }, 0);
  }

  estimatePathDuration(path, nodes) {
    return path.reduce((duration, nodeId) => {
      const node = nodes.find(n => n.id === nodeId);
      return duration + this.getBaseProcessingTime(node?.type || 'unknown');
    }, 0);
  }

  // Pattern detection methods (simplified)
  detectSequentialPattern(nodes, edges) {
    return edges.length > 0 && edges.length === nodes.length - 1;
  }

  detectBranchingPattern(nodes, edges) {
    return nodes.some(node => 
      edges.filter(edge => edge.source === node.id).length > 1
    );
  }

  detectLoopPattern(nodes, edges) {
    // Simple cycle detection
    return this.findCircularDependencies(
      edges.map(edge => ({
        source: { id: edge.source },
        target: { id: edge.target }
      }))
    ).length > 0;
  }

  detectPipelinePattern(nodes, edges) {
    // Check if most nodes have exactly one input and one output
    const pipelineNodes = nodes.filter(node => {
      const incoming = edges.filter(edge => edge.target === node.id).length;
      const outgoing = edges.filter(edge => edge.source === node.id).length;
      return (incoming === 1 && outgoing === 1) || 
             (node.type === 'start' && outgoing === 1) ||
             (node.type === 'end' && incoming === 1);
    });
    
    return pipelineNodes.length / nodes.length > 0.7;
  }

  // Metrics calculations (simplified)
  calculateCyclomaticComplexity(edges, nodes) {
    const decisions = nodes.filter(node => node.type === 'decision').length;
    return edges.length - nodes.length + 2 + decisions;
  }

  calculateFanInOut(nodes, edges) {
    const fanIns = nodes.map(node => 
      edges.filter(edge => edge.target === node.id).length
    );
    const fanOuts = nodes.map(node => 
      edges.filter(edge => edge.source === node.id).length
    );
    
    return {
      maxFanIn: Math.max(...fanIns, 0),
      maxFanOut: Math.max(...fanOuts, 0),
      avgFanIn: fanIns.reduce((a, b) => a + b, 0) / fanIns.length,
      avgFanOut: fanOuts.reduce((a, b) => a + b, 0) / fanOuts.length
    };
  }

  calculateMaxDepth(nodes, edges) {
    const startNodes = nodes.filter(node => node.type === 'start');
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
      
      return depth;
    };
    
    startNodes.forEach(node => calculateDepth(node.id));
    return maxDepth;
  }

  calculateMaxWidth(nodes, edges) {
    // Simplified: count maximum parallel branches
    const forkPoints = nodes.filter(node => {
      return edges.filter(edge => edge.source === node.id).length > 1;
    });
    
    if (forkPoints.length === 0) return 1;
    
    return Math.max(...forkPoints.map(node => 
      edges.filter(edge => edge.source === node.id).length
    ));
  }

  calculateCoupling(nodes, edges) {
    // Simplified coupling calculation
    return edges.length / (nodes.length * (nodes.length - 1));
  }

  calculateCohesion(nodes, edges) {
    // Simplified cohesion calculation
    const totalPossibleConnections = nodes.length * (nodes.length - 1);
    return edges.length / totalPossibleConnections;
  }

  calculateBranchingComplexity(nodes, edges) {
    return nodes.reduce((complexity, node) => {
      const outgoingCount = edges.filter(edge => edge.source === node.id).length;
      return complexity + (outgoingCount > 1 ? outgoingCount - 1 : 0);
    }, 0);
  }

  findMostDependentComponent(nodes, dependencies) {
    let maxDependencies = 0;
    let mostDependent = null;
    
    nodes.forEach(node => {
      const depCount = dependencies.filter(dep => 
        dep.target.id === node.id || dep.source.id === node.id
      ).length;
      
      if (depCount > maxDependencies) {
        maxDependencies = depCount;
        mostDependent = {
          nodeId: node.id,
          label: node.data?.label,
          dependencyCount: depCount
        };
      }
    });
    
    return mostDependent;
  }

  calculateCriticalityScore(node, incomingDeps, outgoingDeps) {
    let score = 0;
    
    // High incoming dependencies increase criticality
    score += incomingDeps.length * 2;
    
    // High outgoing dependencies increase criticality
    score += outgoingDeps.length * 1.5;
    
    // Certain node types are inherently more critical
    const criticalTypes = {
      'database': 3,
      'external-service': 2.5,
      'api-call': 2,
      'decision': 1.5
    };
    
    score += criticalTypes[node.type] || 1;
    
    return Math.round(score * 10) / 10;
  }

  identifyPerformanceBottlenecks(nodePerformance, edges) {
    const sortedByTime = [...nodePerformance].sort((a, b) => b.estimatedTime - a.estimatedTime);
    const threshold = sortedByTime[0]?.estimatedTime * 0.3; // 30% of the slowest node
    
    return sortedByTime
      .filter(node => node.estimatedTime >= threshold)
      .map(node => ({
        ...node,
        bottleneckType: 'performance',
        severity: node.estimatedTime >= sortedByTime[0].estimatedTime * 0.8 ? 'high' : 'medium'
      }));
  }

  calculatePathPerformance(paths, nodePerformance) {
    return paths.map(path => {
      const totalTime = path.nodes.reduce((sum, nodeId) => {
        const nodePerf = nodePerformance.find(np => np.nodeId === nodeId);
        return sum + (nodePerf?.estimatedTime || 0);
      }, 0);
      
      return {
        ...path,
        totalExecutionTime: totalTime,
        averageNodeTime: totalTime / path.nodes.length
      };
    });
  }

  suggestPerformanceOptimizations(bottlenecks, pathPerformance) {
    const optimizations = [];
    
    bottlenecks.forEach(bottleneck => {
      if (bottleneck.severity === 'high') {
        optimizations.push({
          type: 'caching',
          target: bottleneck.nodeId,
          description: 'Implement caching to reduce processing time',
          expectedImprovement: '30-50%'
        });
      }
    });
    
    return optimizations;
  }

  calculateTotalExecutionTime(pathPerformance) {
    if (pathPerformance.length === 0) return 0;
    return Math.max(...pathPerformance.map(p => p.totalExecutionTime));
  }

  findLongestPathTime(pathPerformance) {
    if (pathPerformance.length === 0) return 0;
    const longestPath = pathPerformance.reduce((longest, current) => 
      current.totalExecutionTime > longest.totalExecutionTime ? current : longest
    );
    return longestPath.totalExecutionTime;
  }

  identifyParallelizableComponents(nodes, edges) {
    const parallelizable = [];
    
    nodes.forEach(node => {
      const outgoing = edges.filter(edge => edge.source === node.id);
      if (outgoing.length > 1) {
        parallelizable.push({
          nodeId: node.id,
          parallelBranches: outgoing.length,
          potentialSpeedup: outgoing.length * 0.8 // Assuming 80% efficiency
        });
      }
    });
    
    return parallelizable;
  }

  identifyScalabilityFactors(nodes) {
    const factors = [];
    
    const dbNodes = nodes.filter(node => node.type === 'database');
    if (dbNodes.length > 0) {
      factors.push({
        factor: 'database_operations',
        impact: 'high',
        description: 'Database operations may become bottlenecks at scale'
      });
    }
    
    const apiNodes = nodes.filter(node => node.type === 'api-call');
    if (apiNodes.length > 0) {
      factors.push({
        factor: 'external_api_calls',
        impact: 'medium',
        description: 'External API calls may limit scalability'
      });
    }
    
    return factors;
  }
}
