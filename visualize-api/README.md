# Visualize Process AI - Readability Layer API

🤖 **AI-powered API for understanding and implementing process diagrams**

This Node.js API serves as an AI Readability Layer for the Visualize Process AI application, enabling MCP (Model Context Protocol) tools to read, understand, and generate implementation guidance from process diagrams.

## 🎯 Purpose

The API transforms visual process diagrams into structured, AI-readable data that can be used by MCP tools to:

- **Understand** complex process flows and business logic
- **Analyze** performance, complexity, and dependencies
- **Generate** implementation guidance and code structure
- **Recommend** optimizations and best practices
- **Validate** diagram integrity and completeness

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Navigate to the API directory
cd visualize-api

# Install dependencies
npm install

# Start the development server
npm run dev
```

The API will be available at `http://localhost:3001`

### API Documentation

Visit `http://localhost:3001/api` for interactive API documentation.

## 📋 API Endpoints

### Core Diagram Processing

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/diagrams/parse` | POST | Parse diagram into structured format |
| `/api/diagrams/validate` | POST | Validate diagram structure |
| `/api/diagrams/:id/summary` | GET | Get human-readable summary |

### Process Analysis

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/analysis/process-flow` | POST | Analyze logical flow and dependencies |
| `/api/analysis/complexity` | POST | Calculate complexity metrics |
| `/api/analysis/recommendations` | POST | Get improvement recommendations |
| `/api/analysis/performance` | POST | Analyze performance bottlenecks |

### MCP Integration

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/mcp/understand` | POST | **Main MCP endpoint** - comprehensive analysis |
| `/api/mcp/implement` | POST | Generate implementation guidance |
| `/api/mcp/capabilities` | GET | List available capabilities |
| `/api/mcp/validate-integration` | POST | Validate technology compatibility |

### Health & Status

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/health` | GET | Service health check |
| `/api` | GET | API documentation |

## 🔧 Usage Examples

### Parse a Process Diagram

```javascript
const response = await fetch('http://localhost:3001/api/diagrams/parse', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    visualization: {
      id: "login-process",
      name: "User Login Flow",
      nodes: [
        {
          id: "1",
          type: "start",
          position: { x: 100, y: 100 },
          data: { label: "Start", icon: "🚀" }
        },
        {
          id: "2", 
          type: "html-element",
          position: { x: 200, y: 100 },
          data: { 
            label: "Login Form",
            elementType: "form",
            fields: ["email", "password"]
          }
        }
      ],
      edges: [
        {
          id: "e1-2",
          source: "1",
          target: "2"
        }
      ]
    }
  })
});

const result = await response.json();
console.log(result.data.processSteps);
```

### MCP Understanding (Main Endpoint)

```javascript
const understanding = await fetch('http://localhost:3001/api/mcp/understand', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    visualization: {
      // ... your diagram data
    },
    context: {
      domain: "web-application",
      technology: "nodejs",
      framework: "express"
    },
    requestType: "full_analysis", // or "implementation_guide", "optimization"
    format: "detailed" // or "summary", "code_ready"
  })
});

const result = await understanding.json();
console.log(result.understanding);
```

### Generate Implementation Guide

```javascript
const implementation = await fetch('http://localhost:3001/api/mcp/implement', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    visualization: {
      // ... your diagram data
    },
    targetTechnology: "nodejs",
    implementationType: "api",
    includeTests: true,
    codeStyle: "modern"
  })
});

const guide = await implementation.json();
console.log(guide.implementation.fileStructure);
```

## 🏗️ Architecture

### Service Classes

- **DiagramParser** - Parses and structures diagram data
- **DiagramValidator** - Validates diagram integrity  
- **ProcessAnalyzer** - Analyzes flow, dependencies, performance
- **ComplexityAnalyzer** - Quantifies diagram complexity
- **RecommendationEngine** - Generates improvement suggestions
- **MCPIntegrationService** - Main MCP tool interface
- **ImplementationGuide** - Generates code structure and guidance

### Data Flow

```
Diagram → Parser → Validator → Analyzer → MCP Service → Implementation Guide
```

## 🤖 MCP Tool Integration

### Supported Analysis Types

- **`full_analysis`** - Comprehensive process understanding
- **`implementation_guide`** - Technical implementation guidance  
- **`optimization`** - Performance and structure optimization
- **`testing_strategy`** - Test planning and strategy

### Output Formats

- **`detailed`** - Complete analysis with all metrics
- **`summary`** - High-level overview and key insights
- **`code_ready`** - Implementation-focused output
- **`documentation`** - Human-readable documentation

### Supported Technologies

- **Runtime**: Node.js, Python, Java, Go
- **Frameworks**: Express, FastAPI, Spring, Gin
- **Databases**: MongoDB, PostgreSQL, MySQL, Redis  
- **Platforms**: AWS, GCP, Azure, Docker, Kubernetes

## 📊 Example Response Structure

### MCP Understanding Response

```json
{
  "success": true,
  "understanding": {
    "processOverview": {
      "name": "User Login Flow",
      "type": "user_workflow", 
      "complexity": "Medium",
      "domain": "web-application"
    },
    "technicalStructure": {
      "components": [...],
      "dataFlow": {...},
      "integrationPoints": [...],
      "dependencies": [...]
    },
    "implementationGuidance": {
      "recommendedArchitecture": "layered",
      "technologyStack": {...},
      "securityConsiderations": [...],
      "performanceConsiderations": [...]
    },
    "developmentPlan": {
      "phases": [...],
      "estimatedEffort": "2-4 weeks",
      "criticalPath": {...},
      "risks": [...]
    }
  },
  "mcp_metadata": {
    "version": "1.0.0",
    "timestamp": "2024-01-15T10:30:00Z",
    "processingTime": 245
  }
}
```

## 🛠️ Development

### Project Structure

```
visualize-api/
├── server.js              # Main server entry point
├── routes/                 # API route definitions
│   ├── diagrams.js        # Diagram processing routes
│   ├── analysis.js        # Analysis routes  
│   └── mcp.js             # MCP integration routes
├── services/              # Core business logic
│   ├── DiagramParser.js
│   ├── DiagramValidator.js
│   ├── ProcessAnalyzer.js
│   ├── ComplexityAnalyzer.js
│   ├── RecommendationEngine.js
│   ├── MCPIntegrationService.js
│   └── ImplementationGuide.js
├── package.json
└── README.md
```

### Scripts

```bash
# Development with auto-restart
npm run dev

# Production start
npm start

# Run tests (when implemented)
npm test
```

### Environment Variables

Create a `.env` file:

```env
PORT=3001
NODE_ENV=development
CORS_ORIGINS=http://localhost:3000,http://localhost:3001
```

## 🔒 Security

- **CORS** configured for specified origins
- **Helmet** for security headers
- **Rate limiting** to prevent abuse
- **Input validation** on all endpoints
- **Error handling** without sensitive data exposure

## 🚀 Deployment

### Docker (Recommended)

```bash
# Build image
docker build -t visualize-api .

# Run container
docker run -p 3001:3001 visualize-api
```

### Manual Deployment

```bash
# Install production dependencies
npm ci --production

# Start with PM2 (recommended)
pm2 start server.js --name visualize-api

# Or use Node.js directly
node server.js
```

## 📈 Performance

The API is optimized for:

- **Fast parsing** of complex diagrams
- **Concurrent analysis** of multiple diagram aspects
- **Efficient memory usage** for large processes
- **Caching** of analysis results (planned feature)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests (when test framework is set up)
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details.

## 🆘 Support

For issues and questions:

1. Check the API documentation at `/api`
2. Review the health endpoint at `/health`  
3. Check server logs for detailed error information
4. Create an issue in the repository

## 🔮 Roadmap

- [ ] **Caching Layer** - Redis-based result caching
- [ ] **Authentication** - API key and JWT support
- [ ] **Database Integration** - Persistent storage for diagrams
- [ ] **Real-time Analysis** - WebSocket support for live updates
- [ ] **Plugin System** - Custom analyzers and generators
- [ ] **Metrics & Monitoring** - Prometheus integration
- [ ] **More Technologies** - Support for additional frameworks
- [ ] **AI Integration** - LLM-powered analysis enhancement

---

**Ready to understand your processes like never before!** 🚀
