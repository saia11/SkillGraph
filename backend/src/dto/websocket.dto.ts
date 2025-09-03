// WebSocket Data Transfer Objects

import { GraphNode, GraphEdge } from './graph.dto';
import { Comment } from './comment.dto';
import { User } from './user.dto';

export interface SocketEvents {
  // Graph updates
  'graph:node:created': GraphNode;
  'graph:node:updated': GraphNode;
  'graph:node:deleted': { id: string; type: string };
  'graph:edge:created': GraphEdge;
  'graph:edge:updated': GraphEdge;
  'graph:edge:deleted': { id: string };
  
  // Comments
  'comment:created': Comment;
  'comment:updated': Comment;
  'comment:deleted': { id: string };
  
  // Team updates
  'team:member:joined': { team_id: string; user: User };
  'team:member:left': { team_id: string; user_id: string };
  
  // Real-time collaboration
  'cursor:moved': { user_id: string; x: number; y: number };
  'selection:changed': { user_id: string; selected_ids: string[] };
}

export interface CursorPosition {
  user_id: string;
  x: number;
  y: number;
  socketId?: string;
}

export interface SelectionState {
  user_id: string;
  selected_nodes: string[];
  selected_edges: string[];
}
