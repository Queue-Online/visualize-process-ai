import React, { useState } from 'react';
import { Search, Globe, Database, Zap, Users, Square } from 'lucide-react';
import { PaletteItem, NodeType, ProcessNodeData, StartEndData } from '../../types';

const paletteItems: PaletteItem[] = [
  // UI Components
  {
    id: 'html-page',
    type: 'html-element',
    label: 'Web Page',
    icon: '🌐',
    color: '#3b82f6',
    description: 'HTML page or route',
    category: 'ui',
  },
  {
    id: 'html-form',
    type: 'html-element',
    label: 'Form',
    icon: '📝',
    color: '#8b5cf6',
    description: 'HTML form with inputs',
    category: 'ui',
  },
  {
    id: 'html-button',
    type: 'html-element',
    label: 'Button',
    icon: '🔘',
    color: '#06b6d4',
    description: 'Clickable button element',
    category: 'ui',
  },
  
  // Backend Components
  {
    id: 'database',
    type: 'database',
    label: 'Database',
    icon: '🗄️',
    color: '#10b981',
    description: 'Database operation',
    category: 'backend',
  },
  {
    id: 'api-call',
    type: 'api-call',
    label: 'API Call',
    icon: '🔌',
    color: '#f59e0b',
    description: 'REST API endpoint',
    category: 'backend',
  },
  
  // Logic Components
  {
    id: 'decision',
    type: 'decision',
    label: 'Decision',
    icon: '❓',
    color: '#ef4444',
    description: 'Conditional logic branch',
    category: 'logic',
  },
  {
    id: 'user-action',
    type: 'user-action',
    label: 'User Action',
    icon: '👆',
    color: '#6366f1',
    description: 'User interaction',
    category: 'logic',
  },
  
  // External Services
  {
    id: 'payment',
    type: 'external-service',
    label: 'Payment',
    icon: '💳',
    color: '#059669',
    description: 'Payment gateway integration',
    category: 'external',
  },
  {
    id: 'auth',
    type: 'external-service',
    label: 'Authentication',
    icon: '🔐',
    color: '#dc2626',
    description: 'User authentication service',
    category: 'external',
  },
];

interface ComponentPaletteProps {
  onAddNode: (nodeData: ProcessNodeData & { type: NodeType }) => void;
}

const ComponentPalette: React.FC<ComponentPaletteProps> = ({ onAddNode }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = [
    { id: 'all', label: 'All', icon: Square },
    { id: 'ui', label: 'UI', icon: Globe },
    { id: 'backend', label: 'Backend', icon: Database },
    { id: 'logic', label: 'Logic', icon: Zap },
    { id: 'external', label: 'External', icon: Users },
  ];

  const filteredItems = paletteItems.filter(item => {
    const matchesSearch = item.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const createNodeData = (item: PaletteItem): ProcessNodeData & { type: NodeType } => {
    const baseData = {
      label: item.label,
      icon: item.icon,
      color: item.color,
      description: item.description,
    };

    // Create specific data based on node type
    let nodeData: ProcessNodeData & { type: NodeType };
    
    switch (item.type) {
      case 'html-element':
        nodeData = {
          ...baseData,
          type: item.type,
          elementType: 'page' as const,
        };
        break;
      case 'database':
        nodeData = {
          ...baseData,
          type: item.type,
          operation: 'read' as const,
          table: 'users',
        };
        break;
      case 'api-call':
        nodeData = {
          ...baseData,
          type: item.type,
          method: 'GET' as const,
          endpoint: '/api/endpoint',
        };
        break;
      case 'decision':
        nodeData = {
          ...baseData,
          type: item.type,
          condition: 'if condition',
        };
        break;
      case 'user-action':
        nodeData = {
          ...baseData,
          type: item.type,
          actionType: 'click' as const,
        };
        break;
      case 'external-service':
        nodeData = {
          ...baseData,
          type: item.type,
          serviceType: 'payment' as const,
        };
        break;
      default:
        nodeData = {
          ...baseData,
          type: 'start' as const,
        } as StartEndData & { type: NodeType };
    }

    return nodeData;
  };

  const handleAddNode = (item: PaletteItem) => {
    onAddNode(createNodeData(item));
  };

  const onDragStart = (event: React.DragEvent, item: PaletteItem) => {
    const nodeData = createNodeData(item);
    event.dataTransfer.setData('application/reactflow', JSON.stringify(nodeData));
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900 mb-3">Components</h2>
        
        {/* Search */}
        <div className="relative mb-3">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search components..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap gap-1">
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                  selectedCategory === category.id
                    ? 'bg-primary-100 text-primary-700'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <Icon className="w-3 h-3" />
                {category.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Component List */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-2">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              draggable
              onDragStart={(event) => onDragStart(event, item)}
              onClick={() => handleAddNode(item)}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault();
                  handleAddNode(item);
                }
              }}
              role="button"
              tabIndex={0}
              aria-label={`Add ${item.label} component to canvas`}
              className="w-full p-3 border border-gray-200 rounded-lg hover:border-gray-300 hover:shadow-sm transition-all bg-white text-left cursor-pointer select-none"
            >
              <div className="flex items-center gap-3">
                <div 
                  className="w-10 h-10 rounded-lg flex items-center justify-center text-white text-lg"
                  style={{ backgroundColor: item.color }}
                >
                  {item.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-gray-900 text-sm">{item.label}</h3>
                  <p className="text-xs text-gray-500 mt-1 line-clamp-2">{item.description}</p>
                </div>
                <div className="text-gray-400 text-xs">
                  Drag or click
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredItems.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <Search className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p className="text-sm">No components found</p>
            <p className="text-xs">Try adjusting your search or category filter</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ComponentPalette;
