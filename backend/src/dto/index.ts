// Central export for all DTOs

// User DTOs
export * from './user.dto';

// Team DTOs
export * from './team.dto';

// Skill DTOs
export * from './skill.dto';

// Project DTOs
export * from './project.dto';

// Graph DTOs
export * from './graph.dto';

// Comment DTOs
export * from './comment.dto';

// Learning Path DTOs
export * from './learning-path.dto';

// WebSocket DTOs
export * from './websocket.dto';

// Common DTOs
export interface DatabaseConfig {
  host: string;
  port: number;
  database: string;
  user: string;
  password: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  errors?: Array<{
    field: string;
    message: string;
  }>;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  totalPages: number;
}
