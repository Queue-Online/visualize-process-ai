import express from 'express';
import { ProcessAnalyzer } from '../services/ProcessAnalyzer.js';
import { ComplexityAnalyzer } from '../services/ComplexityAnalyzer.js';
import { RecommendationEngine } from '../services/RecommendationEngine.js';

const router = express.Router();
const processAnalyzer = new ProcessAnalyzer();
const complexityAnalyzer = new ComplexityAnalyzer();
const recommendationEngine = new RecommendationEngine();

/**
 * POST /api/analysis/process-flow
 * Analyze the logical flow of a process diagram
 */
router.post('/process-flow', async (req, res) => {
  try {
    const { visualization, options = {} } = req.body;

    if (!visualization) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'Visualization data is required'
      });
    }

    const analysis = await processAnalyzer.analyzeFlow(visualization, options);
    
    res.json({
      success: true,
      analysis,
      insights: {
        totalPaths: analysis.paths.length,
        criticalPath: analysis.criticalPath,
        bottlenecks: analysis.bottlenecks,
        parallelProcesses: analysis.parallelProcesses
      }
    });

  } catch (error) {
    console.error('Process flow analysis error:', error);
    res.status(500).json({
      error: 'Analysis Error',
      message: error.message
    });
  }
});

/**
 * POST /api/analysis/complexity
 * Analyze the complexity of a process diagram
 */
router.post('/complexity', async (req, res) => {
  try {
    const { visualization } = req.body;

    if (!visualization) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'Visualization data is required'
      });
    }

    const complexity = await complexityAnalyzer.analyze(visualization);
    
    res.json({
      success: true,
      complexity,
      metrics: {
        score: complexity.overallScore,
        level: complexity.level,
        factors: complexity.factors
      }
    });

  } catch (error) {
    console.error('Complexity analysis error:', error);
    res.status(500).json({
      error: 'Complexity Analysis Error',
      message: error.message
    });
  }
});

/**
 * POST /api/analysis/recommendations
 * Get recommendations for improving the process
 */
router.post('/recommendations', async (req, res) => {
  try {
    const { visualization, analysisType = 'all' } = req.body;

    if (!visualization) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'Visualization data is required'
      });
    }

    const recommendations = await recommendationEngine.generateRecommendations(
      visualization, 
      analysisType
    );
    
    res.json({
      success: true,
      recommendations,
      summary: {
        totalRecommendations: recommendations.length,
        highPriority: recommendations.filter(r => r.priority === 'high').length,
        categories: [...new Set(recommendations.map(r => r.category))]
      }
    });

  } catch (error) {
    console.error('Recommendation error:', error);
    res.status(500).json({
      error: 'Recommendation Error',
      message: error.message
    });
  }
});

/**
 * POST /api/analysis/dependencies
 * Analyze dependencies between process components
 */
router.post('/dependencies', async (req, res) => {
  try {
    const { visualization } = req.body;

    if (!visualization) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'Visualization data is required'
      });
    }

    const dependencies = await processAnalyzer.analyzeDependencies(visualization);
    
    res.json({
      success: true,
      dependencies,
      insights: {
        strongDependencies: dependencies.filter(d => d.strength === 'strong').length,
        circularDependencies: dependencies.filter(d => d.type === 'circular').length,
        criticalComponents: dependencies.criticalComponents
      }
    });

  } catch (error) {
    console.error('Dependency analysis error:', error);
    res.status(500).json({
      error: 'Dependency Analysis Error',
      message: error.message
    });
  }
});

/**
 * POST /api/analysis/performance
 * Analyze potential performance bottlenecks
 */
router.post('/performance', async (req, res) => {
  try {
    const { visualization, metrics = {} } = req.body;

    if (!visualization) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'Visualization data is required'
      });
    }

    const performance = await processAnalyzer.analyzePerformance(visualization, metrics);
    
    res.json({
      success: true,
      performance,
      bottlenecks: performance.bottlenecks,
      optimizations: performance.suggestedOptimizations
    });

  } catch (error) {
    console.error('Performance analysis error:', error);
    res.status(500).json({
      error: 'Performance Analysis Error',
      message: error.message
    });
  }
});

export default router;
