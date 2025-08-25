import { Node, Edge } from '@xyflow/react';

// Custom node types for our process builder
export type NodeType = 
  | 'html-element'
  | 'database'
  | 'api-call'
  | 'decision'
  | 'user-action'
  | 'external-service'
  | 'start'
  | 'end';

// Base properties that all nodes have
export interface BaseNodeData extends Record<string, unknown> {
  label: string;
  description?: string;
  icon?: string;
  color?: string;
}

// Specific node data types
export interface HtmlElementData extends BaseNodeData {
  elementType: 'page' | 'form' | 'button' | 'input' | 'modal';
  url?: string;
  formFields?: string[];
}

export interface DatabaseData extends BaseNodeData {
  operation: 'read' | 'write' | 'update' | 'delete';
  table: string;
  fields?: string[];
}

export interface ApiCallData extends BaseNodeData {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  endpoint: string;
  payload?: string;
}

export interface DecisionData extends BaseNodeData {
  condition: string;
  trueLabel?: string;
  falseLabel?: string;
}

export interface UserActionData extends BaseNodeData {
  actionType: 'click' | 'submit' | 'navigate' | 'input' | 'scroll';
  target?: string;
}

export interface ExternalServiceData extends BaseNodeData {
  serviceType: 'payment' | 'auth' | 'email' | 'sms' | 'analytics';
  provider?: string;
}

export interface StartEndData extends BaseNodeData {
  // Start and end nodes just need basic properties
}

// Union type for all node data
export type ProcessNodeData = 
  | HtmlElementData
  | DatabaseData
  | ApiCallData
  | DecisionData
  | UserActionData
  | ExternalServiceData
  | StartEndData;

// Our custom node type extending React Flow's Node
export interface ProcessNode extends Omit<Node, 'data' | 'type'> {
  type: NodeType;
  data: ProcessNodeData;
}

// Our custom edge type
export interface ProcessEdge extends Edge {
  label?: string;
  animated?: boolean;
  style?: React.CSSProperties;
}

// Component palette item
export interface PaletteItem {
  id: string;
  type: NodeType;
  label: string;
  icon: string;
  color: string;
  description: string;
  category: 'ui' | 'backend' | 'logic' | 'external';
}

// Flow state
export interface FlowState {
  nodes: ProcessNode[];
  edges: ProcessEdge[];
  selectedNode: ProcessNode | null;
}

// App configuration
export interface AppConfig {
  gridSize: number;
  snapToGrid: boolean;
  showMinimap: boolean;
  showControls: boolean;
  autoSave: boolean;
}
