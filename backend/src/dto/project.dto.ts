// Project Data Transfer Objects

export interface Project {
  id: string;
  title: string;
  description?: string;
  team_id?: string;
  created_by: string;
  status: 'planning' | 'active' | 'completed' | 'archived';
  start_date?: Date;
  end_date?: Date;
  created_at: Date;
  updated_at: Date;
}

export interface ProjectWithTeam extends Project {
  team?: {
    id: string;
    name: string;
  };
}

export interface ProjectWithSkills extends Project {
  required_skills: {
    id: string;
    name: string;
    category?: string;
    strength?: number;
  }[];
}
