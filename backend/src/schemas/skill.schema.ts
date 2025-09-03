// Skill Request/Response Schemas

export interface CreateSkillRequest {
  name: string;
  category?: string;
  difficulty_level?: number;
  description?: string;
}

export interface UpdateSkillRequest {
  name?: string;
  category?: string;
  difficulty_level?: number;
  description?: string;
}

export interface BulkCreateSkillsRequest {
  skills: CreateSkillRequest[];
}

export interface SearchSkillsRequest {
  query?: string;
  category?: string;
  difficulty_level?: number;
  page?: number;
  limit?: number;
}

export interface SkillRecommendationRequest {
  user_id?: string;
  max_depth?: number;
  limit?: number;
}

export interface UserSkillAssignmentRequest {
  skill_id: string;
  relationship_type: 'knows' | 'wants_to_learn' | 'teaching';
  strength?: number;
  metadata?: Record<string, any>;
}
