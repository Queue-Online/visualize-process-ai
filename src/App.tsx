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
import { ProcessNode, ProcessEdge, StartEndData } from './types';
import ComponentPalette from './components/ComponentPalette';
import PropertiesPanel from './components/PropertiesPanel';

const initialNodes: ProcessNode[] = [
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
];

const initialEdges: ProcessEdge[] = [];

function App() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes as any);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [selectedNode, setSelectedNode] = useState<ProcessNode | null>(null);

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

  return (
    <div className="h-screen flex bg-gray-50">
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
  );
}

export default App;
