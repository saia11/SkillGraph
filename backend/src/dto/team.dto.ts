// Team Data Transfer Objects

export interface Team {
  id: string;
  name: string;
  description?: string;
  created_by: string;
  created_at: Date;
  updated_at: Date;
}

export interface TeamMember {
  id: string;
  team_id: string;
  user_id: string;
  role: 'owner' | 'admin' | 'member';
  joined_at: Date;
}

export interface TeamWithMembers extends Team {
  members: TeamMemberWithUser[];
}

export interface TeamMemberWithUser extends TeamMember {
  user: {
    id: string;
    email: string;
    name: string;
    bio?: string;
    avatar_url?: string;
    role: 'admin' | 'member' | 'guest';
    created_at: Date;
    updated_at: Date;
  };
}

export interface TeamSkillCoverage {
  team_id: string;
  team_name: string;
  skill_id: string;
  skill_name: string;
  category?: string;
  members_with_skill: number;
  avg_proficiency: number;
  total_members: number;
  coverage_percentage: number;
}
