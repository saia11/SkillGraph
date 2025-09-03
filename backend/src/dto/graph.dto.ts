// Graph Data Transfer Objects

import { User } from './user.dto';
import { Skill } from './skill.dto';
import { Project } from './project.dto';

export interface Edge {
  id: string;
  source_id: string;
  target_id: string;
  source_type: 'user' | 'skill' | 'project';
  target_type: 'user' | 'skill' | 'project';
  relationship_type: 'knows' | 'wants_to_learn' | 'teaching' | 'requires' | 'provides' | 
                    'collaborates_on' | 'leads' | 'participates_in' | 'depends_on';
  strength?: number;
  metadata?: Record<string, any>;
  created_by: string;
  created_at: Date;
  updated_at: Date;
}

export interface GraphNode {
  id: string;
  type: 'user' | 'skill' | 'project';
  label: string;
  data: User | Skill | Project;
  x?: number;
  y?: number;
}

export interface GraphEdge {
  id: string;
  from: string;
  to: string;
  label: string;
  type: Edge['relationship_type'];
  strength?: number;
  data: Edge;
}

export interface GraphData {
  nodes: GraphNode[];
  edges: GraphEdge[];
}

export interface NodeConnection {
  node: GraphNode;
  edges: Edge[];
  connections: GraphNode[];
}
