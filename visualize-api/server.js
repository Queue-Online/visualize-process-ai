import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// ES module __dirname equivalent
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Import routes
import diagramRoutes from './routes/diagrams.js';
import analysisRoutes from './routes/analysis.js';
import mcpRoutes from './routes/mcp.js';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(helmet()); // Security headers
app.use(cors()); // Enable CORS
app.use(morgan('combined')); // Logging
app.use(express.json({ limit: '50mb' })); // Parse JSON bodies
app.use(express.urlencoded({ extended: true, limit: '50mb' })); // Parse URL-encoded bodies

// API Routes
app.use('/api/diagrams', diagramRoutes);
app.use('/api/analysis', analysisRoutes);
app.use('/api/mcp', mcpRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'Visualize Process AI - Readability Layer',
    version: '1.0.0'
  });
});

// API documentation endpoint
app.get('/api', (req, res) => {
  res.json({
    name: 'Visualize Process AI - AI Readability Layer',
    version: '1.0.0',
    description: 'API for MCP tools to read and understand process diagrams',
    endpoints: {
      'GET /health': 'Service health check',
      'GET /api': 'This documentation',
      'POST /api/diagrams/parse': 'Parse diagram data into readable format',
      'POST /api/diagrams/validate': 'Validate diagram structure',
      'GET /api/diagrams/:id/summary': 'Get diagram summary',
      'POST /api/analysis/process-flow': 'Analyze process flow logic',
      'POST /api/analysis/complexity': 'Analyze diagram complexity',
      'POST /api/analysis/recommendations': 'Get improvement recommendations',
      'POST /api/mcp/understand': 'MCP-compatible diagram understanding',
      'POST /api/mcp/implement': 'Generate implementation guidance',
      'GET /api/mcp/capabilities': 'List MCP tool capabilities'
    },
    usage: {
      'Content-Type': 'application/json',
      'Authentication': 'None required',
      'Rate Limiting': 'None configured'
    }
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Route ${req.method} ${req.originalUrl} not found`,
    availableEndpoints: [
      'GET /health',
      'GET /api',
      'POST /api/diagrams/parse',
      'POST /api/analysis/process-flow',
      'POST /api/mcp/understand'
    ]
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    error: 'Internal Server Error',
    message: err.message || 'Something went wrong',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Visualize Process AI - Readability Layer started`);
  console.log(`📍 Server running on http://localhost:${PORT}`);
  console.log(`📋 API documentation: http://localhost:${PORT}/api`);
  console.log(`❤️  Health check: http://localhost:${PORT}/health`);
  console.log(`🤖 Ready for MCP tool integration`);
});

export default app;
