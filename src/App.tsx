import React, { useCallback, useState } from 'react';
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  BackgroundVariant,
} from '@xyflow/react';
import { ProcessNode, StartEndData, Visualization } from './types';
import ComponentPalette from './components/ComponentPalette';
import PropertiesPanel from './components/PropertiesPanel';

// Sample visualizations
const sampleVisualizations: Visualization[] = [
  {
    id: '1',
    name: 'Login to my cool app',
    description: 'User authentication flow for the application',
    createdAt: new Date(),
    updatedAt: new Date(),
    nodes: [
      {
        id: '1',
        type: 'start',
        position: { x: 250, y: 50 },
        data: { 
          label: 'Start', 
          icon: '🚀', 
          color: '#10b981',
          description: 'User opens the app'
        } as StartEndData,
      },
      {
        id: '2',
        type: 'html-element',
        position: { x: 250, y: 150 },
        data: { 
          label: 'Login Page', 
          icon: '🔐', 
          color: '#3b82f6',
          description: 'User sees login form',
          elementType: 'form',
          formFields: ['email', 'password']
        },
      },
    ],
    edges: [
      {
        id: 'e1-2',
        source: '1',
        target: '2',
        animated: true,
      },
    ],
  },
  {
    id: '2',
    name: 'Database Authentication',
    description: 'Backend authentication process with database validation',
    createdAt: new Date(),
    updatedAt: new Date(),
    nodes: [
      {
        id: '1',
        type: 'start',
        position: { x: 250, y: 50 },
        data: { 
          label: 'Auth Request', 
          icon: '🔑', 
          color: '#10b981',
          description: 'Receive authentication request'
        } as StartEndData,
      },
      {
        id: '2',
        type: 'database',
        position: { x: 250, y: 150 },
        data: { 
          label: 'User Database', 
          icon: '🗄️', 
          color: '#f59e0b',
          description: 'Query user credentials',
          operation: 'read',
          table: 'users',
          fields: ['email', 'password_hash']
        },
      },
    ],
    edges: [
      {
        id: 'e1-2',
        source: '1',
        target: '2',
        animated: true,
      },
    ],
  },
];

function App() {
  const [visualizations, setVisualizations] = useState<Visualization[]>(sampleVisualizations);
  const [currentVisualization, setCurrentVisualization] = useState<Visualization>(sampleVisualizations[0]);
  const [nodes, setNodes, onNodesChange] = useNodesState(currentVisualization.nodes as any);
  const [edges, setEdges, onEdgesChange] = useEdgesState(currentVisualization.edges);
  const [selectedNode, setSelectedNode] = useState<ProcessNode | null>(null);
  const [showNewVisualizationModal, setShowNewVisualizationModal] = useState(false);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const onNodeClick = useCallback(
    (_: React.MouseEvent, node: any) => {
      setSelectedNode(node as ProcessNode);
    },
    []
  );

  const createNewVisualization = useCallback((name: string, description?: string) => {
    const newVisualization: Visualization = {
      id: Date.now().toString(),
      name,
      description,
      createdAt: new Date(),
      updatedAt: new Date(),
      nodes: [
        {
          id: '1',
          type: 'start',
          position: { x: 250, y: 50 },
          data: { 
            label: 'Start', 
            icon: '🚀', 
            color: '#10b981',
            description: 'Starting point of the process'
          } as StartEndData,
        },
      ],
      edges: [],
    };
    
    setVisualizations(prev => [...prev, newVisualization]);
    setCurrentVisualization(newVisualization);
    setNodes(newVisualization.nodes as any);
    setEdges(newVisualization.edges);
    setShowNewVisualizationModal(false);
  }, [setNodes, setEdges]);

  const switchVisualization = useCallback((viz: Visualization) => {
    setCurrentVisualization(viz);
    setNodes(viz.nodes as any);
    setEdges(viz.edges);
    setSelectedNode(null);
  }, [setNodes, setEdges]);

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <div className="h-16 bg-white border-b border-gray-200 shadow-sm flex items-center justify-between px-6">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center shadow-md">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
            </svg>
          </div>
          <h1 className="text-xl font-semibold text-gray-800">Visualize Process AI</h1>
        </div>

        {/* Visualization Controls */}
        <div className="flex items-center space-x-4">
          {/* Current Visualization Selector */}
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">Current:</span>
            <select 
              value={currentVisualization.id}
              onChange={(e) => {
                const viz = visualizations.find(v => v.id === e.target.value);
                if (viz) switchVisualization(viz);
              }}
              className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {visualizations.map(viz => (
                <option key={viz.id} value={viz.id}>
                  {viz.name}
                </option>
              ))}
            </select>
          </div>

          {/* New Visualization Button */}
          <button
            onClick={() => setShowNewVisualizationModal(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm font-medium flex items-center space-x-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span>New Visualization</span>
          </button>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="flex-1 flex">
        {/* Component Palette - Left Sidebar */}
        <div className="w-80 bg-white border-r border-gray-200 shadow-sm">
        <ComponentPalette onAddNode={(nodeData: any) => {
          const newNode: ProcessNode = {
            id: `node-${Date.now()}`,
            type: nodeData.type,
            position: { x: Math.random() * 400 + 200, y: Math.random() * 300 + 100 },
            data: { ...nodeData, label: nodeData.label },
          };
          setNodes((nds) => nds.concat(newNode as any));
        }} />
      </div>

      {/* Main Flow Canvas */}
      <div className="flex-1 relative">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onNodeClick={onNodeClick}
          fitView
          className="bg-gray-50"
        >
          <Controls className="bg-white border border-gray-200 shadow-lg" />
          <MiniMap 
            className="bg-white border border-gray-200 shadow-lg"
            nodeColor={(node: any) => node.data?.color || '#94a3b8'}
          />
          <Background 
            variant={BackgroundVariant.Dots} 
            gap={20} 
            size={1}
            color="#e5e7eb"
          />
        </ReactFlow>
      </div>

      {/* Properties Panel - Right Sidebar */}
      <div className="w-80 bg-white border-l border-gray-200 shadow-sm">
        <PropertiesPanel 
          selectedNode={selectedNode}
          onUpdateNode={(updatedNode: any) => {
            setNodes((nds) =>
              nds.map((node) =>
                node.id === updatedNode.id ? updatedNode : node
              )
            );
            setSelectedNode(updatedNode);
          }}
        />
      </div>
      </div>

      {/* New Visualization Modal */}
      {showNewVisualizationModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96 shadow-xl">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Create New Visualization</h2>
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.target as HTMLFormElement);
              const name = formData.get('name') as string;
              const description = formData.get('description') as string;
              if (name.trim()) {
                createNewVisualization(name.trim(), description.trim() || undefined);
              }
            }}>
              <div className="mb-4">
                <label htmlFor="viz-name" className="block text-sm font-medium text-gray-700 mb-2">
                  Name *
                </label>
                <input
                  id="viz-name"
                  name="name"
                  type="text"
                  required
                  placeholder="e.g., User Registration Flow"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="mb-6">
                <label htmlFor="viz-description" className="block text-sm font-medium text-gray-700 mb-2">
                  Description (optional)
                </label>
                <textarea
                  id="viz-description"
                  name="description"
                  rows={3}
                  placeholder="Brief description of this process..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex space-x-3 justify-end">
                <button
                  type="button"
                  onClick={() => setShowNewVisualizationModal(false)}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
