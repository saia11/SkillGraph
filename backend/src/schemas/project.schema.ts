// Project Request/Response Schemas

export interface CreateProjectRequest {
  title: string;
  description?: string;
  team_id?: string;
  start_date?: string;
  end_date?: string;
}

export interface UpdateProjectRequest {
  title?: string;
  description?: string;
  status?: 'planning' | 'active' | 'completed' | 'archived';
  start_date?: string;
  end_date?: string;
}

export interface ProjectSkillAssignmentRequest {
  skill_id: string;
  relationship_type: 'requires' | 'provides';
  strength?: number;
  metadata?: Record<string, any>;
}

export interface ProjectMemberAssignmentRequest {
  user_id: string;
  role: 'leads' | 'participates_in';
}

export interface SearchProjectsRequest {
  query?: string;
  team_id?: string;
  status?: 'planning' | 'active' | 'completed' | 'archived';
  page?: number;
  limit?: number;
}
