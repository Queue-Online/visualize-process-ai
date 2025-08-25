import React, { useState, useEffect } from 'react';
import { Settings, Trash2, Copy, ArrowRight } from 'lucide-react';
import { MarkerType } from '@xyflow/react';
import { ProcessNode, ProcessEdge } from '../../types';

interface PropertiesPanelProps {
  selectedNode: ProcessNode | null;
  selectedEdge: ProcessEdge | null;
  onUpdateNode: (node: ProcessNode) => void;
  onUpdateEdge: (edge: ProcessEdge) => void;
}

const PropertiesPanel: React.FC<PropertiesPanelProps> = ({ selectedNode, selectedEdge, onUpdateNode, onUpdateEdge }) => {
  const [localData, setLocalData] = useState<any>({});

  useEffect(() => {
    if (selectedNode) {
      setLocalData(selectedNode.data);
    } else if (selectedEdge) {
      setLocalData({
        label: selectedEdge.label || '',
        animated: selectedEdge.animated || false,
        fontSize: selectedEdge.fontSize || 11,
        arrowDirection: selectedEdge.arrowDirection || 'forward',
        style: selectedEdge.style || {},
        labelStyle: selectedEdge.labelStyle || {},
        labelBgStyle: selectedEdge.labelBgStyle || {},
        labelBgPadding: selectedEdge.labelBgPadding || [7.7, 11]
      });
    }
  }, [selectedNode, selectedEdge]);

  const handleInputChange = (field: string, value: any) => {
    const newData = { ...localData, [field]: value };
    setLocalData(newData);
    
    if (selectedNode) {
      onUpdateNode({
        ...selectedNode,
        data: newData,
      });
    } else if (selectedEdge) {
      const updatedEdge = { ...selectedEdge };
      if (field === 'label') {
        updatedEdge.label = value;
      } else if (field === 'animated') {
        updatedEdge.animated = value;
      } else if (field === 'arrowDirection') {
        updatedEdge.arrowDirection = value;
        // Ensure edge style is set for markers to show
        updatedEdge.style = {
          ...updatedEdge.style,
          stroke: '#6b7280',
          strokeWidth: 2
        };
        // Set marker properties based on direction
        switch (value) {
          case 'forward':
            updatedEdge.markerEnd = {
              type: MarkerType.ArrowClosed,
              color: '#6b7280',
            };
            updatedEdge.markerStart = undefined;
            break;
          case 'backward':
            updatedEdge.markerStart = {
              type: MarkerType.ArrowClosed,
              color: '#6b7280',
              orient: 'auto-start-reverse',
            };
            updatedEdge.markerEnd = undefined;
            break;
          case 'bidirectional':
            updatedEdge.markerStart = {
              type: MarkerType.ArrowClosed,
              color: '#6b7280',
              orient: 'auto-start-reverse',
            };
            updatedEdge.markerEnd = {
              type: MarkerType.ArrowClosed,
              color: '#6b7280',
            };
            break;
          case 'none':
            updatedEdge.markerStart = undefined;
            updatedEdge.markerEnd = undefined;
            break;
        }
      } else if (field === 'fontSize') {
        const fontSize = parseInt(value) || 11;
        updatedEdge.fontSize = fontSize;
        // Update labelStyle for ReactFlow edge labels
        updatedEdge.labelStyle = {
          fontSize: `${fontSize}px`,
          fontWeight: '500',
          fill: '#374151'
        };
        // Update labelBgStyle to resize background box based on font size
        const verticalPadding = Math.max(4, fontSize * 0.7); // More generous vertical padding
        const horizontalPadding = Math.max(6, fontSize * 1.0); // Even more horizontal padding
        updatedEdge.labelBgStyle = {
          fill: 'white',
          fillOpacity: 0.9,
          stroke: '#e5e7eb',
          strokeWidth: 1
        } as any; // SVG properties require any type
        updatedEdge.labelBgPadding = [verticalPadding, horizontalPadding]; // [vertical, horizontal] padding
      }
      onUpdateEdge(updatedEdge);
    }
  };

  const renderPropertyInput = (field: string, label: string, type: 'text' | 'select' | 'textarea' = 'text', options?: string[]) => {
    const value = localData[field] || '';

    if (type === 'select' && options) {
      return (
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
          <select
            value={value}
            onChange={(e) => handleInputChange(field, e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            {options.map((option) => (
              <option key={option} value={option}>
                {option.charAt(0).toUpperCase() + option.slice(1)}
              </option>
            ))}
          </select>
        </div>
      );
    }

    if (type === 'textarea') {
      return (
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
          <textarea
            value={value}
            onChange={(e) => handleInputChange(field, e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            rows={3}
          />
        </div>
      );
    }

    return (
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
        <input
          type={type}
          value={value}
          onChange={(e) => handleInputChange(field, e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        />
      </div>
    );
  };

  const renderNodeTypeSpecificProperties = () => {
    if (!selectedNode) return null;

    switch (selectedNode.type) {
      case 'html-element':
        return (
          <>
            {renderPropertyInput('elementType', 'Element Type', 'select', ['page', 'form', 'button', 'input', 'modal'])}
            {renderPropertyInput('url', 'URL/Route')}
            {localData.elementType === 'form' && (
              <div className="mb-4">
                <label htmlFor="form-fields" className="block text-sm font-medium text-gray-700 mb-1">Form Fields</label>
                <textarea
                  id="form-fields"
                  value={(localData.formFields || []).join('\n')}
                  onChange={(e) => handleInputChange('formFields', e.target.value.split('\n').filter(Boolean))}
                  placeholder="Enter field names, one per line"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  rows={4}
                />
              </div>
            )}
          </>
        );

      case 'database':
        return (
          <>
            {renderPropertyInput('operation', 'Operation', 'select', ['read', 'write', 'update', 'delete'])}
            {renderPropertyInput('table', 'Table Name')}
            <div className="mb-4">
              <label htmlFor="db-fields" className="block text-sm font-medium text-gray-700 mb-1">Fields</label>
              <textarea
                id="db-fields"
                value={(localData.fields || []).join('\n')}
                onChange={(e) => handleInputChange('fields', e.target.value.split('\n').filter(Boolean))}
                placeholder="Enter field names, one per line"
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                rows={3}
              />
            </div>
          </>
        );

      case 'api-call':
        return (
          <>
            {renderPropertyInput('method', 'HTTP Method', 'select', ['GET', 'POST', 'PUT', 'DELETE'])}
            {renderPropertyInput('endpoint', 'Endpoint')}
            {renderPropertyInput('payload', 'Payload (JSON)', 'textarea')}
          </>
        );

      case 'decision':
        return (
          <>
            {renderPropertyInput('condition', 'Condition', 'textarea')}
            {renderPropertyInput('trueLabel', 'True Label')}
            {renderPropertyInput('falseLabel', 'False Label')}
          </>
        );

      case 'user-action':
        return (
          <>
            {renderPropertyInput('actionType', 'Action Type', 'select', ['click', 'submit', 'navigate', 'input', 'scroll'])}
            {renderPropertyInput('target', 'Target Element')}
          </>
        );

      case 'external-service':
        return (
          <>
            {renderPropertyInput('serviceType', 'Service Type', 'select', ['payment', 'auth', 'email', 'sms', 'analytics'])}
            {renderPropertyInput('provider', 'Provider')}
          </>
        );

      default:
        return null;
    }
  };

  if (!selectedNode && !selectedEdge) {
    return (
      <div className="h-full flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Properties</h2>
        </div>
        <div className="flex-1 flex items-center justify-center text-gray-500">
          <div className="text-center">
            <Settings className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p className="text-sm">Select a node or arrow to edit its properties</p>
          </div>
        </div>
      </div>
    );
  }

  // Render edge properties
  if (selectedEdge) {
    return (
      <div className="h-full flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-lg font-semibold text-gray-900">Properties</h2>
            <div className="flex gap-2">
              <button className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded">
                <Copy className="w-4 h-4" />
              </button>
              <button className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-blue-500 text-white text-sm">
              <ArrowRight className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-medium text-gray-900">{selectedEdge.label || 'Arrow'}</h3>
              <p className="text-xs text-gray-500">Connection</p>
            </div>
          </div>
        </div>

        {/* Properties Form */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="space-y-4">
            {/* Basic Properties */}
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-3">Arrow Properties</h4>
              {renderPropertyInput('label', 'Label', 'text')}
              
              <div className="mb-4">
                <label htmlFor="font-size-slider" className="block text-sm font-medium text-gray-700 mb-1">Font Size</label>
                <div className="flex items-center space-x-2">
                  <input
                    id="font-size-slider"
                    type="range"
                    min="8"
                    max="20"
                    step="1"
                    value={localData.fontSize || 11}
                    onChange={(e) => handleInputChange('fontSize', e.target.value)}
                    className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <span className="text-sm text-gray-600 min-w-[2rem]">{localData.fontSize || 11}px</span>
                </div>
              </div>

              <div className="mb-4">
                <label htmlFor="arrow-direction" className="block text-sm font-medium text-gray-700 mb-1">Arrow Direction</label>
                <select
                  id="arrow-direction"
                  value={localData.arrowDirection || 'forward'}
                  onChange={(e) => handleInputChange('arrowDirection', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="forward">→ Forward</option>
                  <option value="backward">← Backward</option>
                  <option value="bidirectional">↔ Bidirectional</option>
                  <option value="none">— No Arrows</option>
                </select>
              </div>
              
              <div className="mb-4">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={localData.animated || false}
                    onChange={(e) => handleInputChange('animated', e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm font-medium text-gray-700">Animated</span>
                </label>
              </div>
            </div>

            {/* Connection Info */}
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-3">Connection Info</h4>
              <div className="bg-gray-50 p-3 rounded-md text-sm">
                <p><span className="font-medium">From:</span> {selectedEdge.source}</p>
                <p><span className="font-medium">To:</span> {selectedEdge.target}</p>
                <p><span className="font-medium">ID:</span> {selectedEdge.id}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Render node properties
  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-lg font-semibold text-gray-900">Properties</h2>
          <div className="flex gap-2">
            <button className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded">
              <Copy className="w-4 h-4" />
            </button>
            <button className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded">
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <div 
            className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm"
            style={{ backgroundColor: selectedNode?.data.color }}
          >
            {selectedNode?.data.icon}
          </div>
          <div>
            <h3 className="font-medium text-gray-900">{selectedNode?.data.label}</h3>
            <p className="text-xs text-gray-500 capitalize">{selectedNode?.type.replace('-', ' ')}</p>
          </div>
        </div>
      </div>

      {/* Properties Form */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-4">
          {/* Basic Properties */}
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-3">Basic Properties</h4>
            {renderPropertyInput('label', 'Label')}
            {renderPropertyInput('description', 'Description', 'textarea')}
          </div>

          {/* Type-specific Properties */}
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-3">Specific Properties</h4>
            {renderNodeTypeSpecificProperties()}
          </div>

          {/* Styling */}
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-3">Styling</h4>
            <div className="mb-4">
              <label htmlFor="color-picker" className="block text-sm font-medium text-gray-700 mb-1">Color</label>
              <div id="color-picker" className="flex gap-2 flex-wrap">
                {['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#84cc16', '#f97316'].map((color) => (
                  <button
                    key={color}
                    onClick={() => handleInputChange('color', color)}
                    className={`w-8 h-8 rounded-lg border-2 ${
                      localData.color === color ? 'border-gray-400' : 'border-gray-200'
                    }`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertiesPanel;
