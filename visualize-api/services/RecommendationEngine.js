/**
 * RecommendationEngine - Generates improvement recommendations for process diagrams
 */
export class RecommendationEngine {
  
  /**
   * Generate recommendations for improving the process
   */
  async generateRecommendations(visualization, analysisType = 'all') {
    const { nodes, edges } = visualization;
    
    try {
      const recommendations = [];
      
      // Generate different types of recommendations based on analysis type
      if (analysisType === 'all' || analysisType === 'performance') {
        recommendations.push(...this.generatePerformanceRecommendations(nodes, edges));
      }
      
      if (analysisType === 'all' || analysisType === 'structure') {
        recommendations.push(...this.generateStructuralRecommendations(nodes, edges));
      }
      
      if (analysisType === 'all' || analysisType === 'usability') {
        recommendations.push(...this.generateUsabilityRecommendations(nodes, edges));
      }
      
      if (analysisType === 'all' || analysisType === 'security') {
        recommendations.push(...this.generateSecurityRecommendations(nodes, edges));
      }
      
      if (analysisType === 'all' || analysisType === 'maintainability') {
        recommendations.push(...this.generateMaintainabilityRecommendations(nodes, edges));
      }
      
      if (analysisType === 'all' || analysisType === 'scalability') {
        recommendations.push(...this.generateScalabilityRecommendations(nodes, edges));
      }
      
      // Sort by priority and impact
      const sortedRecommendations = this.prioritizeRecommendations(recommendations);
      
      return sortedRecommendations.map((rec, index) => ({
        id: `rec-${index + 1}`,
        ...rec,
        rank: index + 1
      }));
      
    } catch (error) {
      throw new Error(`Recommendation generation failed: ${error.message}`);
    }
  }

  /**
   * Generate performance-focused recommendations
   */
  generatePerformanceRecommendations(nodes, edges) {
    const recommendations = [];
    
    // Check for database bottlenecks
    const dbNodes = nodes.filter(node => node.type === 'database');
    if (dbNodes.length > 3) {
      recommendations.push({
        category: 'performance',
        priority: 'high',
        title: 'Optimize Database Operations',
        description: 'Multiple database operations detected. Consider connection pooling, caching, and query optimization.',
        impact: 'high',
        effort: 'medium',
        implementation: {
          steps: [
            'Implement database connection pooling',
            'Add caching layer (Redis/Memcached)',
            'Optimize database queries',
            'Consider read replicas for read-heavy operations'
          ],
          estimatedTime: '1-2 weeks',
          technologies: ['Redis', 'Connection pooling', 'Query optimization']
        },
        metrics: {
          expectedImprovement: '30-50% reduction in response time',
          measurableBy: ['Response time', 'Database connection usage', 'Cache hit ratio']
        }
      });
    }
    
    // Check for API call bottlenecks
    const apiNodes = nodes.filter(node => node.type === 'api-call');
    if (apiNodes.length > 2) {
      recommendations.push({
        category: 'performance',
        priority: 'medium',
        title: 'Implement API Caching and Batching',
        description: 'Multiple API calls can cause performance issues. Consider caching and request batching.',
        impact: 'medium',
        effort: 'low',
        implementation: {
          steps: [
            'Implement response caching',
            'Batch multiple API calls where possible',
            'Add request deduplication',
            'Implement circuit breaker pattern'
          ],
          estimatedTime: '3-5 days',
          technologies: ['HTTP caching', 'Request batching', 'Circuit breaker']
        },
        metrics: {
          expectedImprovement: '20-40% reduction in API call time',
          measurableBy: ['API response time', 'Number of API calls', 'Cache hit ratio']
        }
      });
    }
    
    // Check for parallel processing opportunities
    const parallelOpportunities = this.identifyParallelProcessingOpportunities(nodes, edges);
    if (parallelOpportunities.length > 0) {
      recommendations.push({
        category: 'performance',
        priority: 'medium',
        title: 'Implement Parallel Processing',
        description: 'Identified opportunities for parallel execution to improve performance.',
        impact: 'high',
        effort: 'medium',
        implementation: {
          steps: [
            'Identify independent operations',
            'Implement async/await patterns',
            'Use worker threads for CPU-intensive tasks',
            'Implement proper synchronization'
          ],
          estimatedTime: '1 week',
          technologies: ['Worker threads', 'Async/await', 'Promise.all()']
        },
        details: {
          opportunities: parallelOpportunities
        }
      });
    }
    
    return recommendations;
  }

  /**
   * Generate structural recommendations
   */
  generateStructuralRecommendations(nodes, edges) {
    const recommendations = [];
    
    // Check for overly complex nodes
    const complexNodes = this.identifyComplexNodes(nodes, edges);
    if (complexNodes.length > 0) {
      recommendations.push({
        category: 'structure',
        priority: 'high',
        title: 'Break Down Complex Components',
        description: 'Some components are overly complex and should be broken down into smaller parts.',
        impact: 'high',
        effort: 'high',
        implementation: {
          steps: [
            'Identify single responsibility for each component',
            'Extract sub-processes into separate modules',
            'Create clear interfaces between components',
            'Update documentation and tests'
          ],
          estimatedTime: '2-3 weeks',
          technologies: ['Modular architecture', 'Interface design']
        },
        details: {
          complexComponents: complexNodes
        }
      });
    }
    
    // Check for missing error handling
    const hasErrorHandling = this.checkErrorHandling(nodes, edges);
    if (!hasErrorHandling) {
      recommendations.push({
        category: 'structure',
        priority: 'high',
        title: 'Add Error Handling Paths',
        description: 'The process lacks proper error handling. Add error paths and fallback mechanisms.',
        impact: 'high',
        effort: 'medium',
        implementation: {
          steps: [
            'Identify potential failure points',
            'Add try-catch blocks around critical operations',
            'Implement fallback mechanisms',
            'Add error logging and monitoring',
            'Create error recovery procedures'
          ],
          estimatedTime: '1 week',
          technologies: ['Error handling', 'Logging', 'Monitoring']
        }
      });
    }
    
    // Check for circular dependencies
    const circularDeps = this.detectCircularDependencies(nodes, edges);
    if (circularDeps.length > 0) {
      recommendations.push({
        category: 'structure',
        priority: 'high',
        title: 'Resolve Circular Dependencies',
        description: 'Circular dependencies can cause infinite loops and make the system unstable.',
        impact: 'high',
        effort: 'medium',
        implementation: {
          steps: [
            'Analyze dependency cycles',
            'Introduce dependency injection',
            'Extract shared dependencies to separate modules',
            'Refactor to eliminate cycles'
          ],
          estimatedTime: '1-2 weeks',
          technologies: ['Dependency injection', 'Modular design']
        },
        details: {
          circularDependencies: circularDeps
        }
      });
    }
    
    return recommendations;
  }

  /**
   * Generate usability recommendations
   */
  generateUsabilityRecommendations(nodes, edges) {
    const recommendations = [];
    
    // Check for missing user feedback
    const userNodes = nodes.filter(node => 
      node.type === 'user-action' || node.type === 'html-element'
    );
    
    if (userNodes.length > 0) {
      const hasFeedback = userNodes.some(node => 
        node.data?.label?.toLowerCase().includes('feedback') ||
        node.data?.label?.toLowerCase().includes('confirmation')
      );
      
      if (!hasFeedback) {
        recommendations.push({
          category: 'usability',
          priority: 'medium',
          title: 'Add User Feedback Mechanisms',
          description: 'Users should receive feedback on their actions. Add confirmation messages and progress indicators.',
          impact: 'medium',
          effort: 'low',
          implementation: {
            steps: [
              'Add success/error messages',
              'Implement loading indicators',
              'Add confirmation dialogs for critical actions',
              'Include progress bars for long operations'
            ],
            estimatedTime: '2-3 days',
            technologies: ['UI components', 'Notifications', 'Progress indicators']
          }
        });
      }
    }
    
    // Check for accessibility considerations
    if (userNodes.length > 0) {
      recommendations.push({
        category: 'usability',
        priority: 'medium',
        title: 'Implement Accessibility Features',
        description: 'Ensure the process is accessible to users with disabilities.',
        impact: 'medium',
        effort: 'medium',
        implementation: {
          steps: [
            'Add ARIA labels and roles',
            'Ensure keyboard navigation',
            'Implement screen reader support',
            'Add high contrast mode support',
            'Test with accessibility tools'
          ],
          estimatedTime: '1 week',
          technologies: ['ARIA', 'Accessibility testing', 'WAI guidelines']
        }
      });
    }
    
    // Check for mobile responsiveness
    const uiElements = nodes.filter(node => node.type === 'html-element');
    if (uiElements.length > 0) {
      recommendations.push({
        category: 'usability',
        priority: 'medium',
        title: 'Ensure Mobile Responsiveness',
        description: 'Make sure the process works well on mobile devices.',
        impact: 'medium',
        effort: 'medium',
        implementation: {
          steps: [
            'Implement responsive design',
            'Test on various screen sizes',
            'Optimize touch interactions',
            'Consider mobile-first approach'
          ],
          estimatedTime: '1 week',
          technologies: ['Responsive design', 'CSS media queries', 'Touch optimization']
        }
      });
    }
    
    return recommendations;
  }

  /**
   * Generate security recommendations
   */
  generateSecurityRecommendations(nodes, edges) {
    const recommendations = [];
    
    // Check for authentication
    const hasUserInput = nodes.some(node => 
      node.type === 'user-action' || node.type === 'html-element'
    );
    
    const hasAuth = nodes.some(node => 
      node.type === 'external-service' && 
      node.data?.serviceType === 'auth'
    );
    
    if (hasUserInput && !hasAuth) {
      recommendations.push({
        category: 'security',
        priority: 'high',
        title: 'Implement User Authentication',
        description: 'Processes involving user input should include proper authentication mechanisms.',
        impact: 'high',
        effort: 'medium',
        implementation: {
          steps: [
            'Choose authentication strategy (JWT, OAuth, etc.)',
            'Implement login/logout functionality',
            'Add session management',
            'Implement authorization checks',
            'Add password security measures'
          ],
          estimatedTime: '1-2 weeks',
          technologies: ['JWT', 'OAuth 2.0', 'Session management', 'Password hashing']
        }
      });
    }
    
    // Check for data validation
    const inputNodes = nodes.filter(node => 
      node.type === 'html-element' && 
      node.data?.elementType === 'form'
    );
    
    if (inputNodes.length > 0) {
      recommendations.push({
        category: 'security',
        priority: 'high',
        title: 'Implement Input Validation',
        description: 'All user inputs must be validated to prevent injection attacks.',
        impact: 'high',
        effort: 'low',
        implementation: {
          steps: [
            'Add client-side validation',
            'Implement server-side validation',
            'Sanitize all inputs',
            'Use parameterized queries for database operations',
            'Implement CSRF protection'
          ],
          estimatedTime: '3-5 days',
          technologies: ['Input validation', 'Sanitization', 'CSRF tokens', 'Parameterized queries']
        }
      });
    }
    
    // Check for HTTPS/encryption
    const apiNodes = nodes.filter(node => node.type === 'api-call');
    if (apiNodes.length > 0) {
      recommendations.push({
        category: 'security',
        priority: 'high',
        title: 'Ensure Secure Communication',
        description: 'All API communications should use HTTPS and proper encryption.',
        impact: 'high',
        effort: 'low',
        implementation: {
          steps: [
            'Use HTTPS for all API calls',
            'Implement proper SSL/TLS configuration',
            'Add API key management',
            'Implement request signing',
            'Use secure headers'
          ],
          estimatedTime: '2-3 days',
          technologies: ['HTTPS', 'SSL/TLS', 'API security', 'Secure headers']
        }
      });
    }
    
    return recommendations;
  }

  /**
   * Generate maintainability recommendations
   */
  generateMaintainabilityRecommendations(nodes, edges) {
    const recommendations = [];
    
    // Check documentation
    const poorlyDocumented = nodes.filter(node => 
      !node.data?.description || node.data.description.length < 10
    );
    
    if (poorlyDocumented.length > nodes.length * 0.3) {
      recommendations.push({
        category: 'maintainability',
        priority: 'medium',
        title: 'Improve Documentation',
        description: 'Many components lack proper documentation. Add detailed descriptions and comments.',
        impact: 'medium',
        effort: 'low',
        implementation: {
          steps: [
            'Add descriptions to all components',
            'Document data flows and dependencies',
            'Create API documentation',
            'Add inline comments for complex logic',
            'Create user guides and technical documentation'
          ],
          estimatedTime: '1 week',
          technologies: ['Documentation tools', 'API docs', 'Comments']
        }
      });
    }
    
    // Check for testing
    recommendations.push({
      category: 'maintainability',
      priority: 'high',
      title: 'Implement Comprehensive Testing',
      description: 'Add unit tests, integration tests, and end-to-end tests to ensure reliability.',
      impact: 'high',
      effort: 'high',
      implementation: {
        steps: [
          'Create unit tests for individual components',
          'Add integration tests for component interactions',
          'Implement end-to-end tests for complete workflows',
          'Set up continuous integration',
          'Add code coverage monitoring'
        ],
        estimatedTime: '2-3 weeks',
        technologies: ['Jest', 'Cypress', 'CI/CD', 'Code coverage tools']
      }
    });
    
    // Check for monitoring
    recommendations.push({
      category: 'maintainability',
      priority: 'medium',
      title: 'Add Monitoring and Logging',
      description: 'Implement comprehensive monitoring and logging for better observability.',
      impact: 'medium',
      effort: 'medium',
      implementation: {
        steps: [
          'Add application logging',
          'Implement error tracking',
          'Set up performance monitoring',
          'Create dashboards and alerts',
          'Add health checks'
        ],
        estimatedTime: '1 week',
        technologies: ['Logging frameworks', 'Error tracking', 'Monitoring tools', 'Dashboards']
      }
    });
    
    return recommendations;
  }

  /**
   * Generate scalability recommendations
   */
  generateScalabilityRecommendations(nodes, edges) {
    const recommendations = [];
    
    // Check for database scalability
    const dbNodes = nodes.filter(node => node.type === 'database');
    if (dbNodes.length > 0) {
      recommendations.push({
        category: 'scalability',
        priority: 'medium',
        title: 'Implement Database Scalability',
        description: 'Prepare database layer for increased load and data volume.',
        impact: 'high',
        effort: 'high',
        implementation: {
          steps: [
            'Implement database sharding',
            'Add read replicas',
            'Optimize database indexes',
            'Consider NoSQL for specific use cases',
            'Implement database connection pooling'
          ],
          estimatedTime: '2-4 weeks',
          technologies: ['Database sharding', 'Read replicas', 'Connection pooling', 'NoSQL']
        }
      });
    }
    
    // Check for horizontal scaling
    const computationalNodes = nodes.filter(node => 
      ['api-call', 'database', 'external-service'].includes(node.type)
    );
    
    if (computationalNodes.length > 3) {
      recommendations.push({
        category: 'scalability',
        priority: 'medium',
        title: 'Implement Horizontal Scaling',
        description: 'Prepare the system for horizontal scaling with load balancing and microservices.',
        impact: 'high',
        effort: 'high',
        implementation: {
          steps: [
            'Containerize applications',
            'Implement load balancing',
            'Add auto-scaling capabilities',
            'Implement stateless design',
            'Add service discovery'
          ],
          estimatedTime: '3-6 weeks',
          technologies: ['Docker', 'Kubernetes', 'Load balancers', 'Microservices']
        }
      });
    }
    
    // Check for caching strategy
    recommendations.push({
      category: 'scalability',
      priority: 'medium',
      title: 'Implement Caching Strategy',
      description: 'Add caching at multiple levels to improve performance and reduce load.',
      impact: 'medium',
      effort: 'medium',
      implementation: {
        steps: [
          'Implement application-level caching',
          'Add database query caching',
          'Implement CDN for static assets',
          'Add browser caching headers',
          'Consider distributed caching'
        ],
        estimatedTime: '1-2 weeks',
        technologies: ['Redis', 'Memcached', 'CDN', 'Browser caching']
      }
    });
    
    return recommendations;
  }

  /**
   * Prioritize recommendations based on impact, effort, and priority
   */
  prioritizeRecommendations(recommendations) {
    return recommendations.sort((a, b) => {
      // First sort by priority
      const priorityOrder = { 'high': 3, 'medium': 2, 'low': 1 };
      const priorityDiff = priorityOrder[b.priority] - priorityOrder[a.priority];
      if (priorityDiff !== 0) return priorityDiff;
      
      // Then by impact
      const impactOrder = { 'high': 3, 'medium': 2, 'low': 1 };
      const impactDiff = impactOrder[b.impact] - impactOrder[a.impact];
      if (impactDiff !== 0) return impactDiff;
      
      // Finally by effort (lower effort first)
      const effortOrder = { 'low': 1, 'medium': 2, 'high': 3 };
      return effortOrder[a.effort] - effortOrder[b.effort];
    });
  }

  // Helper methods

  identifyParallelProcessingOpportunities(nodes, edges) {
    const opportunities = [];
    
    nodes.forEach(node => {
      const outgoing = edges.filter(edge => edge.source === node.id);
      if (outgoing.length > 1) {
        opportunities.push({
          forkNode: node.id,
          parallelBranches: outgoing.length,
          potentialSpeedup: Math.min(outgoing.length * 0.8, 3) // Cap at 3x speedup
        });
      }
    });
    
    return opportunities;
  }

  identifyComplexNodes(nodes, edges) {
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
          isComplex: complexity > 4
        };
      })
      .filter(node => node.isComplex)
      .sort((a, b) => b.complexity - a.complexity);
  }

  checkErrorHandling(nodes, edges) {
    // Check if there are any error-related nodes or edges
    const hasErrorNodes = nodes.some(node => 
      node.data?.label?.toLowerCase().includes('error') ||
      node.data?.description?.toLowerCase().includes('error')
    );
    
    const hasErrorEdges = edges.some(edge => 
      edge.label?.toLowerCase().includes('error') ||
      edge.label?.toLowerCase().includes('fail')
    );
    
    return hasErrorNodes || hasErrorEdges;
  }

  detectCircularDependencies(nodes, edges) {
    const cycles = [];
    const visited = new Set();
    const recursionStack = new Set();
    
    const dfs = (nodeId, path = []) => {
      if (recursionStack.has(nodeId)) {
        const cycleStart = path.indexOf(nodeId);
        cycles.push(path.slice(cycleStart));
        return;
      }
      
      if (visited.has(nodeId)) return;
      
      visited.add(nodeId);
      recursionStack.add(nodeId);
      path.push(nodeId);
      
      const outgoing = edges.filter(edge => edge.source === nodeId);
      outgoing.forEach(edge => {
        dfs(edge.target, [...path]);
      });
      
      recursionStack.delete(nodeId);
    };
    
    nodes.forEach(node => {
      if (!visited.has(node.id)) {
        dfs(node.id);
      }
    });
    
    return cycles;
  }
}
