// Comment Data Transfer Objects

export interface Comment {
  id: string;
  content: string;
  user_id: string;
  edge_id?: string;
  node_id?: string;
  node_type?: 'user' | 'skill' | 'project';
  created_at: Date;
  updated_at: Date;
}

export interface CommentWithUser extends Comment {
  user: {
    id: string;
    name: string;
    avatar_url?: string;
  };
}
