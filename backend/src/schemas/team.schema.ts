// Team Request/Response Schemas

export interface CreateTeamRequest {
  name: string;
  description?: string;
}

export interface UpdateTeamRequest {
  name?: string;
  description?: string;
}

export interface AddTeamMemberRequest {
  user_id: string;
  role?: 'admin' | 'member';
}

export interface UpdateTeamMemberRoleRequest {
  role: 'owner' | 'admin' | 'member';
}

export interface TeamInviteRequest {
  email: string;
  role?: 'admin' | 'member';
  message?: string;
}

export interface SearchTeamsRequest {
  query: string;
  page?: number;
  limit?: number;
  category?: string;
}

export interface TeamAnalyticsRequest {
  team_id: string;
  start_date?: string;
  end_date?: string;
}
