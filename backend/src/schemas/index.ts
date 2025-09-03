// Central export for all schemas

// Authentication schemas
export * from './auth.schema';

// Team schemas
export * from './team.schema';

// Skill schemas
export * from './skill.schema';

// Project schemas
export * from './project.schema';

// Graph schemas
export * from './graph.schema';

// Comment schemas
export * from './comment.schema';

// Learning Path schemas
export * from './learning-path.schema';

// Common schemas
export interface PaginationRequest {
  page?: number;
  limit?: number;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
}

export interface SearchRequest extends PaginationRequest {
  query: string;
  filters?: Record<string, any>;
}

export interface BulkOperationRequest<T> {
  items: T[];
  validate_all?: boolean;
}

export interface BulkOperationResponse<T> {
  success_count: number;
  error_count: number;
  successful_items: T[];
  failed_items: Array<{
    item: T;
    error: string;
  }>;
}
