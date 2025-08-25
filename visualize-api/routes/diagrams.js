import express from 'express';
import { DiagramParser } from '../services/DiagramParser.js';
import { DiagramValidator } from '../services/DiagramValidator.js';

const router = express.Router();
const parser = new DiagramParser();
const validator = new DiagramValidator();

/**
 * POST /api/diagrams/parse
 * Parse diagram data into a readable, structured format
 */
router.post('/parse', async (req, res) => {
  try {
    const { visualization, options = {} } = req.body;

    if (!visualization) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'Visualization data is required',
        expected: {
          visualization: {
            id: 'string',
            name: 'string',
            nodes: 'array',
            edges: 'array'
          }
        }
      });
    }

    const parsed = await parser.parseVisualization(visualization, options);
    
    res.json({
      success: true,
      data: parsed,
      meta: {
        nodeCount: parsed.nodes.length,
        edgeCount: parsed.edges.length,
        processSteps: parsed.processSteps.length,
        complexity: parsed.complexity
      }
    });

  } catch (error) {
    console.error('Parse error:', error);
    res.status(500).json({
      error: 'Parse Error',
      message: error.message
    });
  }
});

/**
 * POST /api/diagrams/validate
 * Validate diagram structure and integrity
 */
router.post('/validate', async (req, res) => {
  try {
    const { visualization } = req.body;

    if (!visualization) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'Visualization data is required'
      });
    }

    const validation = await validator.validateDiagram(visualization);
    
    res.json({
      success: true,
      valid: validation.isValid,
      validation
    });

  } catch (error) {
    console.error('Validation error:', error);
    res.status(500).json({
      error: 'Validation Error',
      message: error.message
    });
  }
});

/**
 * GET /api/diagrams/:id/summary
 * Get a human-readable summary of a diagram
 */
router.get('/:id/summary', async (req, res) => {
  try {
    const { id } = req.params;
    
    // In a real implementation, you'd fetch from a database
    // For now, return a sample response
    const summary = await parser.generateSummary(id);
    
    res.json({
      success: true,
      diagramId: id,
      summary
    });

  } catch (error) {
    console.error('Summary error:', error);
    res.status(500).json({
      error: 'Summary Error',
      message: error.message
    });
  }
});

/**
 * POST /api/diagrams/extract-patterns
 * Extract common patterns from the diagram
 */
router.post('/extract-patterns', async (req, res) => {
  try {
    const { visualization } = req.body;

    if (!visualization) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'Visualization data is required'
      });
    }

    const patterns = await parser.extractPatterns(visualization);
    
    res.json({
      success: true,
      patterns,
      patternCount: patterns.length
    });

  } catch (error) {
    console.error('Pattern extraction error:', error);
    res.status(500).json({
      error: 'Pattern Extraction Error',
      message: error.message
    });
  }
});

export default router;
