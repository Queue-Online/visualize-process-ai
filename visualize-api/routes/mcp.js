import express from 'express';
import { MCPIntegrationService } from '../services/MCPIntegrationService.js';
import { ImplementationGuide } from '../services/ImplementationGuide.js';

const router = express.Router();
const mcpService = new MCPIntegrationService();
const implementationGuide = new ImplementationGuide();

/**
 * POST /api/mcp/understand
 * Main endpoint for MCP tools to understand process diagrams
 */
router.post('/understand', async (req, res) => {
  try {
    const { 
      visualization, 
      context = {}, 
      requestType = 'full_analysis',
      format = 'detailed'
    } = req.body;

    if (!visualization) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'Visualization data is required',
        example: {
          visualization: {
            id: "unique-id",
            name: "Process Name",
            nodes: [{ id: "1", type: "start", data: { label: "Start", icon: "🚀" } }],
            edges: [{ id: "e1", source: "1", target: "2" }]
          },
          context: {
            domain: "web-application",
            technology: "nodejs",
            framework: "express"
          },
          requestType: "full_analysis | implementation_guide | optimization",
          format: "detailed | summary | code_ready"
        }
      });
    }

    const understanding = await mcpService.understandDiagram(
      visualization, 
      context, 
      requestType, 
      format
    );
    
    res.json({
      success: true,
      understanding,
      mcp_metadata: {
        version: '1.0.0',
        timestamp: new Date().toISOString(),
        requestType,
        format,
        processingTime: understanding.processingTime
      }
    });

  } catch (error) {
    console.error('MCP understanding error:', error);
    res.status(500).json({
      error: 'MCP Understanding Error',
      message: error.message,
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

/**
 * POST /api/mcp/implement
 * Generate implementation guidance for MCP tools
 */
router.post('/implement', async (req, res) => {
  try {
    const { 
      visualization, 
      targetTechnology = 'nodejs',
      implementationType = 'api',
      includeTests = true,
      codeStyle = 'modern'
    } = req.body;

    if (!visualization) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'Visualization data is required'
      });
    }

    const implementation = await implementationGuide.generateImplementation(
      visualization,
      {
        targetTechnology,
        implementationType,
        includeTests,
        codeStyle
      }
    );
    
    res.json({
      success: true,
      implementation,
      metadata: {
        targetTechnology,
        implementationType,
        filesGenerated: implementation.files?.length || 0,
        estimatedComplexity: implementation.complexity
      }
    });

  } catch (error) {
    console.error('Implementation generation error:', error);
    res.status(500).json({
      error: 'Implementation Error',
      message: error.message
    });
  }
});

/**
 * GET /api/mcp/capabilities
 * List all capabilities available to MCP tools
 */
router.get('/capabilities', (req, res) => {
  try {
    const capabilities = mcpService.getCapabilities();
    
    res.json({
      success: true,
      capabilities,
      version: '1.0.0',
      supportedFormats: [
        'reactflow',
        'mermaid', 
        'drawio',
        'custom'
      ],
      analysisTypes: [
        'process_flow',
        'complexity',
        'dependencies',
        'performance',
        'security',
        'patterns'
      ],
      outputFormats: [
        'detailed',
        'summary', 
        'code_ready',
        'documentation',
        'test_cases'
      ]
    });

  } catch (error) {
    console.error('Capabilities error:', error);
    res.status(500).json({
      error: 'Capabilities Error',
      message: error.message
    });
  }
});

/**
 * POST /api/mcp/validate-integration
 * Validate that a diagram can be integrated with specific technology
 */
router.post('/validate-integration', async (req, res) => {
  try {
    const { 
      visualization, 
      targetTechnology,
      constraints = {}
    } = req.body;

    if (!visualization || !targetTechnology) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'Visualization data and target technology are required'
      });
    }

    const validation = await mcpService.validateIntegration(
      visualization,
      targetTechnology,
      constraints
    );
    
    res.json({
      success: true,
      validation,
      compatible: validation.isCompatible,
      issues: validation.issues,
      recommendations: validation.recommendations
    });

  } catch (error) {
    console.error('Integration validation error:', error);
    res.status(500).json({
      error: 'Validation Error',
      message: error.message
    });
  }
});

/**
 * POST /api/mcp/extract-requirements
 * Extract technical requirements from process diagrams
 */
router.post('/extract-requirements', async (req, res) => {
  try {
    const { 
      visualization,
      domain = 'general',
      detailLevel = 'medium'
    } = req.body;

    if (!visualization) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'Visualization data is required'
      });
    }

    const requirements = await mcpService.extractRequirements(
      visualization,
      domain,
      detailLevel
    );
    
    res.json({
      success: true,
      requirements,
      summary: {
        functionalRequirements: requirements.functional?.length || 0,
        nonFunctionalRequirements: requirements.nonFunctional?.length || 0,
        technicalRequirements: requirements.technical?.length || 0
      }
    });

  } catch (error) {
    console.error('Requirements extraction error:', error);
    res.status(500).json({
      error: 'Requirements Error',
      message: error.message
    });
  }
});

export default router;
