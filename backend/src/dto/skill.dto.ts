// Skill Data Transfer Objects

export interface Skill {
  id: string;
  name: string;
  category?: string;
  difficulty_level?: number;
  description?: string;
  created_by?: string;
  created_at: Date;
}

export interface SkillWithMetadata extends Skill {
  strength?: number;
  metadata?: Record<string, any>;
}

export interface SkillCategory {
  category: string;
  count: number;
}

export interface SkillRecommendation {
  skill_id: string;
  skill_name: string;
  path_length: number;
  recommendation_score: number;
}

export interface UserSkill extends Skill {
  relationship_type: 'knows' | 'wants_to_learn' | 'teaching';
  strength?: number;
  metadata?: Record<string, any>;
}
