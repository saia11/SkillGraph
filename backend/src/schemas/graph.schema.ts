// Graph Request/Response Schemas

export interface CreateEdgeRequest {
  source_id: string;
  target_id: string;
  source_type: 'user' | 'skill' | 'project';
  target_type: 'user' | 'skill' | 'project';
  relationship_type: 'knows' | 'wants_to_learn' | 'teaching' | 'requires' | 'provides' | 
                    'collaborates_on' | 'leads' | 'participates_in' | 'depends_on';
  strength?: number;
  metadata?: Record<string, any>;
}

export interface UpdateEdgeRequest {
  relationship_type?: 'knows' | 'wants_to_learn' | 'teaching' | 'requires' | 'provides' | 
                     'collaborates_on' | 'leads' | 'participates_in' | 'depends_on';
  strength?: number;
  metadata?: Record<string, any>;
}

export interface BulkCreateEdgesRequest {
  edges: CreateEdgeRequest[];
}

export interface GetGraphDataRequest {
  team_id?: string;
  user_id?: string;
  node_types?: ('user' | 'skill' | 'project')[];
  relationship_types?: string[];
  max_depth?: number;
}

export interface GraphFilterRequest {
  node_types?: ('user' | 'skill' | 'project')[];
  relationship_types?: string[];
  strength_min?: number;
  strength_max?: number;
  created_after?: string;
  created_before?: string;
}

export interface NodeConnectionsRequest {
  node_id: string;
  node_type: 'user' | 'skill' | 'project';
  direction?: 'incoming' | 'outgoing' | 'both';
  max_depth?: number;
}
