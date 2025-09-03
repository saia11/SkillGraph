// Learning Path Data Transfer Objects

import { Skill } from './skill.dto';

export interface LearningPath {
  id: string;
  user_id: string;
  title: string;
  description?: string;
  target_skill_id: string;
  status: 'active' | 'completed' | 'paused';
  created_at: Date;
  updated_at: Date;
}

export interface LearningPathStep {
  id: string;
  path_id: string;
  skill_id: string;
  step_order: number;
  status: 'pending' | 'in_progress' | 'completed';
  created_at: Date;
  updated_at: Date;
}

export interface LearningPathWithSteps extends LearningPath {
  target_skill: Skill;
  steps: LearningPathStepWithSkill[];
}

export interface LearningPathStepWithSkill extends LearningPathStep {
  skill: Skill;
}
