// Learning Path Request/Response Schemas

export interface CreateLearningPathRequest {
  title: string;
  description?: string;
  target_skill_id: string;
}

export interface UpdateLearningPathRequest {
  title?: string;
  description?: string;
  status?: 'active' | 'completed' | 'paused';
}

export interface CreateLearningPathStepRequest {
  skill_id: string;
  step_order: number;
}

export interface UpdateLearningPathStepRequest {
  step_order?: number;
  status?: 'pending' | 'in_progress' | 'completed';
}

export interface BulkCreateLearningPathStepsRequest {
  steps: CreateLearningPathStepRequest[];
}

export interface GetLearningPathsRequest {
  user_id?: string;
  status?: 'active' | 'completed' | 'paused';
  page?: number;
  limit?: number;
}
