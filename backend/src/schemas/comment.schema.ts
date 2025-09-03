// Comment Request/Response Schemas

export interface CreateCommentRequest {
  content: string;
  edge_id?: string;
  node_id?: string;
  node_type?: 'user' | 'skill' | 'project';
}

export interface UpdateCommentRequest {
  content: string;
}

export interface GetCommentsRequest {
  edge_id?: string;
  node_id?: string;
  node_type?: 'user' | 'skill' | 'project';
  page?: number;
  limit?: number;
}
